"""Partial delivery imports preserve history, private sources and publication decisions."""
import copy
import hashlib
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT/'scripts'))
spec = importlib.util.spec_from_file_location('import_update', ROOT/'scripts/importar-atualizacao.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class UpdateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        for name in ['public/midia', 'src/data/generated', 'docs', 'scripts', '_entregas/atualizacao-2026-10-30']:
            (self.root/name).mkdir(parents=True)
        self.source = self.root/'_entregas/atualizacao-2026-10-30'
        self.previous = self.root/'public/midia/previous.webp'
        self.previous.write_bytes(b'preserved')
        self.records = [{'id': 'previous', 'country': 'jakkar', 'original': 'old.jpg', 'src': '/midia/previous.webp', 'type': 'image'}]
        for name in ['midias.json', 'midias-publicas.json']:
            (self.root/'src/data/generated'/name).write_text(json.dumps(self.records))
        self.registry = {'version': 1, 'materials': [{'materialId': 'restricted', 'status': 'restrito', 'publicFilesSHA256': [], 'evidenceRef': None}]}
        (self.root/'docs/publication-status.json').write_text(json.dumps(self.registry))
        Image.new('RGB', (64, 96), 'blue').save(self.source/'photo.jpg', exif=Image.Exif())
        self.definition = dict(original='photo.jpg', country='memoria', publicStem='registro-01', collection='outras-edicoes', title='Registro', description='Descrição visual', alt='Descrição visual')

    def load_records(self):
        return json.loads((self.root/'src/data/generated/midias.json').read_text())

    def test_partial_missing_deduplication_and_idempotence(self):
        duplicate = copy.deepcopy(self.definition)
        duplicate['original'] = 'duplicate.jpg'
        (self.source/'duplicate.jpg').write_bytes((self.source/'photo.jpg').read_bytes())
        missing = {**self.definition, 'original': 'missing.jpg'}
        sources_before = {p.name: p.read_bytes() for p in self.source.iterdir()}
        self.assertEqual(module.import_items(self.root, self.source, [missing, self.definition, duplicate]), ['missing.jpg'])
        records = self.load_records()
        self.assertEqual(records[0], self.records[0])
        self.assertEqual(len(records), 2)
        self.assertEqual(self.previous.read_bytes(), b'preserved')
        for variant in records[1]['variants']:
            with Image.open(self.root/'public'/variant['src'].lstrip('/')) as image:
                self.assertFalse(image.getexif())
                self.assertEqual(image.width/image.height, 64/96)
        registry = json.loads((self.root/'docs/publication-status.json').read_text())
        self.assertEqual(registry['materials'][0], self.registry['materials'][0])
        self.assertEqual(registry['materials'][1]['evidenceRef'], 'autorizacao-responsavel-2026-10-30')
        module.import_items(self.root, self.source, [self.definition, duplicate])
        self.assertEqual(records, self.load_records())
        self.assertEqual(registry, json.loads((self.root/'docs/publication-status.json').read_text()))
        self.assertEqual(sources_before, {p.name: p.read_bytes() for p in self.source.iterdir()})

    def test_failure_rolls_back_registry_inventory_and_derivatives(self):
        before = {str(p.relative_to(self.root)): p.read_bytes() for p in self.root.rglob('*') if p.is_file()}
        with patch.object(module.processing, 'variants', side_effect=RuntimeError('conversion failed')):
            with self.assertRaisesRegex(RuntimeError, 'conversion failed'):
                module.import_items(self.root, self.source, [self.definition])
        after = {str(p.relative_to(self.root)): p.read_bytes() for p in self.root.rglob('*') if p.is_file() and p.name != '.media-processing.lock'}
        self.assertEqual(before, after)

    def test_pdf_bytes_are_preserved_and_only_cover_is_rendered(self):
        source = self.source/'document.pdf'
        source.write_bytes(b'%PDF-synthetic-original')
        calls = []
        def convert(args):
            calls.append(args)
            if args[0] == 'pdfinfo':
                return 'Pages: 12\n'
            self.assertEqual(args[:5], ['pdftoppm', '-f', '1', '-singlefile', '-scale-to'])
            Image.new('RGB', (64, 96), 'red').save(str(args[-1])+'.png')
            return ''
        definition = {**self.definition, 'original': source.name, 'country': 'astalania', 'publicStem': 'gibi-de-astalania', 'collection': 'materiais-pais'}
        with patch.object(module.processing, 'run', side_effect=convert):
            module.import_items(self.root, self.source, [definition])
        record = self.load_records()[-1]
        dest = self.root/'public'/record['src'].lstrip('/')
        self.assertEqual(dest.read_bytes(), source.read_bytes())
        self.assertEqual(record['sha256'], hashlib.sha256(dest.read_bytes()).hexdigest())
        self.assertTrue(record['preserveOriginal'])
        self.assertEqual(len(calls), 2)


if __name__ == '__main__':
    unittest.main()
