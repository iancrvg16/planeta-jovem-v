"""Exercise the complete pipeline and publication failures with synthetic sources only."""
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch
from PIL import Image

SCRIPTS = Path(__file__).resolve().parents[1] / 'scripts'
sys.path.insert(0, str(SCRIPTS))
import media_transaction as tx


class PipelineTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        shutil.copytree(SCRIPTS, self.root/'scripts', ignore=shutil.ignore_patterns('__pycache__'))
        (self.root/'public/midia').mkdir(parents=True)
        (self.root/'src/data/generated').mkdir(parents=True)
        (self.root/'docs').mkdir()
        raw = self.root/'_entregas/País Jambor/Atividade 1'
        raw.mkdir(parents=True)
        Image.new('RGB', (32, 20), 'blue').save(raw/'novo.png')
        (self.root/'public/midia/previous.webp').write_bytes(b'previous-derivative')
        (self.root/'public/midia/hero.webp').write_bytes(b'previous-hero')
        record = {'id':'previous','country':'jakkar','original':'previous.png','type':'image','src':'/midia/previous.webp'}
        for n in ['midias.json', 'midias-publicas.json']:
            (self.root/'src/data/generated'/n).write_text(json.dumps([record]))
        (self.root/'src/data/generated/hero.json').write_text(json.dumps({'src':'/midia/hero.webp'}))
        spec = importlib.util.spec_from_file_location('synthetic_processor', SCRIPTS/'processar-entregas.py')
        self.module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(self.module)
        self.module.ROOT = self.root
        self.module.RAW = self.root/'_entregas'
        self.module.CACHE = self.root/'_processamento'
        self.module.PUBLIC = self.root/'public'
        self.before = self.hashes()

    def hashes(self):
        return {str(p.relative_to(self.root)):hashlib.sha256(p.read_bytes()).hexdigest()
                for d in ['public','src/data/generated','docs'] for p in (self.root/d).rglob('*') if p.is_file()}

    def test_partial_sources_preserve_previous_hashes_and_publish_new_image(self):
        self.module.main([])
        after = self.hashes()
        for name, digest in self.before.items():
            if not name.endswith(('midias.json','midias-publicas.json')):
                self.assertEqual(after[name], digest)
        records = json.loads((self.root/'src/data/generated/midias.json').read_text())
        self.assertEqual(records[0]['id'], 'previous')
        self.assertEqual(len(records), 2)
        self.assertTrue((self.root/'public'/records[1]['src'].lstrip('/')).is_file())
        self.assertFalse((self.root/'.media-transaction.json').exists())

    def test_partial_lervuria_without_pdf_preserves_existing_country(self):
        raw = self.module.RAW/'País Lervúria'/'Atividade 1'
        raw.mkdir(parents=True)
        Image.new('RGB', (24, 16), 'green').save(raw/'WhatsApp Image 2026-10-08 at 14.02.58  .jpeg')
        self.module.main([])
        records = json.loads((self.root/'src/data/generated/midias.json').read_text())
        self.assertIn('lervuria-apresentacao', [r['id'] for r in records])
        self.assertEqual((self.root/'public/midia/previous.webp').read_bytes(), b'previous-derivative')

    def test_missing_preserved_hero_variant_changes_nothing(self):
        hero = self.root/'src/data/generated/hero.json'
        hero.write_text(json.dumps({'src':'/midia/hero.webp', 'srcSet':'/midia/missing.webp 480w'}))
        before = self.hashes()
        with self.assertRaisesRegex(RuntimeError, 'Derivado do hero anterior ausente'):
            self.module.main([])
        self.assertEqual(self.hashes(), before)

    def test_missing_initial_hero_has_actionable_error_and_no_publication(self):
        (self.root/'src/data/generated/hero.json').unlink()
        before = self.hashes()
        with self.assertRaisesRegex(RuntimeError, 'Hero ausente'):
            self.module.main([])
        self.assertEqual(self.hashes(), before)

    def test_explicit_required_source_missing_changes_nothing(self):
        with self.assertRaisesRegex(RuntimeError, 'obrigatória --hero ausente'):
            self.module.main(['--hero','missing.png'])
        self.assertEqual(self.hashes(), self.before)

    def test_processing_failure_after_derivative_changes_nothing(self):
        real = self.module.variants
        def fail(*args):
            real(*args)
            raise RuntimeError('synthetic conversion failure')
        with patch.object(self.module, 'variants', side_effect=fail):
            with self.assertRaisesRegex(RuntimeError, 'synthetic conversion'):
                self.module.main([])
        self.assertEqual(self.hashes(), self.before)
        self.assertFalse(list(self.root.glob('.media-stage-*')))

    def test_missing_previous_derivative_is_reported_without_changes(self):
        (self.root/'public/midia/previous.webp').unlink()
        before = self.hashes()
        with self.assertRaisesRegex(RuntimeError, 'manifestos preservados'):
            self.module.main([])
        self.assertEqual(self.hashes(), before)

    def test_missing_tool_is_checked_before_processing(self):
        (self.module.RAW/'País Jambor/Atividade 1/video.mp4').write_bytes(b'synthetic')
        with patch.object(self.module.shutil, 'which', return_value=None):
            with self.assertRaisesRegex(RuntimeError, 'Ferramenta ausente'):
                self.module.main([])
        self.assertEqual(self.hashes(), self.before)

    def test_publication_failure_restores_overwritten_and_new_files(self):
        with self.assertRaisesRegex(OSError, 'synthetic publication'):
            with tx.transaction(self.root) as stage:
                (stage/'public/midia/previous.webp').write_bytes(b'changed')
                (stage/'public/midia/new.webp').write_bytes(b'new')
                (stage/'public/midia/new2.webp').write_bytes(b'new2')
                real = tx.publish
                def fail_publish(root, staging):
                    count = 0
                    def replace(source, target):
                        nonlocal count
                        count += 1
                        if count == 3: raise OSError('synthetic publication failure')
                        return tx.os.replace(source, target)
                    return real(root, staging, replace=replace)
                # Patch only publication; use original replacement during rollback.
                with patch.object(tx, 'publish', side_effect=fail_publish):
                    # Context publishes on exit, so invoke the fault here explicitly.
                    tx.publish(self.root, stage)
        self.assertEqual(self.hashes(), self.before)
        self.assertFalse((self.root/'.media-transaction.json').exists())

    def test_concurrent_process_is_rejected(self):
        code = "import sys; from pathlib import Path; from media_transaction import transaction; ctx=transaction(Path(sys.argv[1])); ctx.__enter__(); print('ready',flush=True); input(); ctx.__exit__(None,None,None)"
        child = subprocess.Popen([sys.executable,'-c',code,str(self.root)],cwd=SCRIPTS,stdin=subprocess.PIPE,stdout=subprocess.PIPE,text=True)
        try:
            self.assertEqual(child.stdout.readline().strip(), 'ready')
            with self.assertRaisesRegex(RuntimeError, 'Outro processamento'):
                self.module.main([])
            self.assertEqual(self.hashes(), self.before)
        finally:
            child.communicate('\n',timeout=10)
            self.assertEqual(child.returncode, 0)

    def test_killed_publisher_recovers_on_next_transaction(self):
        code = """import os,sys
from pathlib import Path
from media_transaction import transaction,publish
root=Path(sys.argv[1])
with transaction(root) as stage:
 (stage/'public/midia/previous.webp').write_bytes(b'changed')
 def die(source,target):
  os.replace(source,target)
  os._exit(17)
 publish(root,stage,replace=die)
"""
        result = subprocess.run([sys.executable,'-c',code,str(self.root)],cwd=SCRIPTS)
        self.assertEqual(result.returncode,17)
        self.assertTrue((self.root/'.media-transaction.json').exists())
        with tx.transaction(self.root):
            self.assertEqual(self.hashes(), self.before)
        self.assertFalse((self.root/'.media-transaction.json').exists())


if __name__ == '__main__': unittest.main()
