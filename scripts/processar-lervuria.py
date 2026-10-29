#!/usr/bin/env python3
"""Incorpora somente o acervo oficial de Lervúria, preservando os demais países.

Uso: python3 scripts/processar-lervuria.py --origem 'pasta/Atividade 1'
Reutiliza os derivados responsivos do processador existente. Não altera as fontes.
"""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import shutil

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('processar', ROOT / 'scripts/processar-entregas.py')
processing = importlib.util.module_from_spec(spec)
spec.loader.exec_module(processing)

# Nomes distintos evitam a colisão dos três JPEGs diferenciados só por espaços.
# As origens literais ficam no inventário privado ao navegador.
IMAGES = {
    'WhatsApp Image 2026-10-08 at 14.02.58  .jpeg': 'lervuria-apresentacao',
    'WhatsApp Image 2026-10-08 at 14.02.58 (1).jpeg': 'lervuria-pinacoteca-chaveiro',
    'WhatsApp Image 2026-10-08 at 14.02.58 (2).jpeg': 'lervuria-pinacoteca-ala-oeste',
    'WhatsApp Image 2026-10-08 at 14.02.58 (3).jpeg': 'lervuria-pinacoteca-ala-leste',
    'WhatsApp Image 2026-10-08 at 14.02.58 (4).jpeg': 'lervuria-pinacoteca-ala-norte',
    'WhatsApp Image 2026-10-08 at 14.02.58 (5).jpeg': 'lervuria-pinacoteca-ala-sul',
    'WhatsApp Image 2026-10-08 at 14.02.58 .jpeg': 'lervuria-guardioes-criativos',
    'WhatsApp Image 2026-10-08 at 14.02.58.jpeg': 'lervuria-pinacoteca-miniatura',
    'WhatsApp Image 2026-10-08 at 14.06.11.jpeg': 'lervuria-construcao-virtual',
    'WhatsApp Image 2026-10-08 at 14.06.16.jpeg': 'lervuria-divulgacao-ganhadores',
    'WhatsApp Image 2026-10-08 at 14.06.51.jpeg': 'lervuria-pinacoteca-convite',
}


def build_records(raw):
    raw = raw.resolve()
    cache = ROOT / '_processamento/lervuria'
    cache.mkdir(parents=True, exist_ok=True)
    media_dir = ROOT / 'public/midia/lervuria'
    pdf = raw / 'Símbolo da bandeira de Lervúria (1).pdf'
    docx = raw / 'PAÍS LERVÚRIA.docx'
    records = []

    def record(source, alias, **fields):
        try:
            origin = str(source.relative_to(ROOT / '_entregas'))
        except ValueError:
            origin = source.name
        return {
            'id': Path(alias).stem, 'country': 'lervuria', 'phase': 'fase-1',
            'activity': 1, 'original': alias, 'sources': [origin],
            'sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
            'originalBytes': source.stat().st_size, **fields,
        }

    for name, stem in IMAGES.items():
        source = raw / name
        if not source.is_file(): continue
        records.append(record(source, stem + '.jpeg', type='image',
                              **processing.variants(source, media_dir, stem)))

    if pdf.is_file():
        for page, stem in [(1, 'lervuria-bandeira'), (3, 'lervuria-brasao')]:
            prefix = cache / stem
            processing.run(['pdfimages', '-f', page, '-l', page, '-png', pdf, prefix])
            candidates = list(cache.glob(stem + '-*.png'))
            if len(candidates) != 1:
                raise RuntimeError(f'Confira as imagens incorporadas na página {page}')
            source = candidates[0]
            item = record(source, stem + '.png', type='image', extracted=True,
                          **processing.variants(source, media_dir, stem))
            item['sources'] = [f'{pdf.name} — página {page}, imagem incorporada']
            if page == 1:
                # A imagem original tem 642×361: não ampliar nem recolorir.
                # Derivados lossless preservam as cores na resolução nativa.
                with Image.open(source) as opened:
                    im = opened.convert('RGB')
                    for variant in item['variants']:
                        width = variant['width']
                        im.resize((width, round(im.height * width / im.width)), Image.Resampling.LANCZOS).save(
                            ROOT / 'public' / variant['src'].lstrip('/'), 'WEBP', lossless=True, method=6)
                    im.thumbnail((128, 128), Image.Resampling.LANCZOS)
                    dest = media_dir / f'{stem}-128.webp'
                    im.save(dest, 'WEBP', lossless=True, method=6)
                    url = processing.relative(dest)
                    item['srcSet'] = f'{url} {im.width}w, ' + item['srcSet']
                    item['variants'].insert(0, {'src': url, 'width': im.width})
            records.append(item)

        dest = ROOT / 'public/documentos/lervuria/lervuria-material-institucional.pdf'
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(pdf, dest)
        records.append(record(pdf, 'lervuria-material-institucional.pdf', type='document',
                              src=processing.relative(dest), pages=19, bytes=dest.stat().st_size))
    if docx.is_file():
        records.append(record(docx, docx.name, type='source', note='Fonte textual; DOCX não publicado.'))
    return records


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--origem', type=Path, required=True)
    args = parser.parse_args(argv)
    # Same lock/journal as the general importer; standalone processing cannot race it.
    global ROOT
    original = ROOT
    with processing.transaction(ROOT) as staging:
        processing.RAW = args.origem.resolve()
        processing.preflight(argparse.Namespace(hero='_referencias/hero-alta.jpg'))
        ROOT = staging
        processing.ROOT = staging
        processing.PUBLIC = staging/'public'
        processing.CACHE = staging/'_processamento'
        try:
            records = build_records(args.origem)
            if not records: raise RuntimeError('Nenhuma fonte reconhecida de Lervúria; acervo preservado.')
            runtime_keys = {'id', 'country', 'phase', 'activity', 'type', 'original', 'src', 'srcSet',
                            'width', 'height', 'color', 'poster', 'posterSrcSet', 'duration', 'bytes', 'pages', 'extracted'}
            inventory = staging/'src/data/generated/midias.json'
            merged = processing.preserve_inventory(records, json.loads(inventory.read_text()), staging/'public')
            inventory.write_text(json.dumps(merged, ensure_ascii=False, indent=2)+'\n')
            runtime = [{k:v for k,v in item.items() if k in runtime_keys} for item in merged]
            (staging/'src/data/generated/midias-publicas.json').write_text(json.dumps(runtime, ensure_ascii=False, indent=2)+'\n')
        finally:
            ROOT = original
            processing.ROOT = original
            processing.PUBLIC = original/'public'
            processing.CACHE = original/'_processamento'
    print(f'Lervúria: {len(records)} registros processados; anteriores preservados.')


if __name__ == '__main__':
    main()
