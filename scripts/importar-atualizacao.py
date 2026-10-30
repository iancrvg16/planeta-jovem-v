#!/usr/bin/env python3
"""Importação parcial de 30/10/2026; sem alterar fontes ou derivados anteriores."""
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import shutil
import subprocess
import tempfile
from media_transaction import transaction

ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('processing', ROOT/'scripts/processar-entregas.py')
processing = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(processing)


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def import_items(root, sources, definitions):
    """Missing entries are reported individually; complete independent entries still publish."""
    missing = []
    with transaction(root) as stage:
        processing.PUBLIC = stage/'public'
        inventory = stage/'src/data/generated/midias.json'
        records = json.loads(inventory.read_text())
        registry_path = stage/'docs/publication-status.json'
        registry = json.loads(registry_path.read_text())
        by_hash = {m['sha256']: m for m in records if m.get('sha256')}
        for definition in definitions:
            source = sources/definition['original']
            if not source.is_file():
                missing.append(definition['original'])
                continue
            digest = sha(source)
            if digest in by_hash:
                previous = by_hash[digest]
                if previous['country'] != definition['country']:
                    raise RuntimeError('Hash já associado a outro país: '+source.name)
                continue
            slug, stem = definition['country'], definition['publicStem']
            directory = stage/'public/midia'/slug
            directory.mkdir(parents=True, exist_ok=True)
            item = {k: v for k, v in definition.items() if k != 'publicStem'}
            item.update(id=f'{slug}-{stem}-{digest[:8]}', phase='nao-informada', activity=0,
                        sha256=digest, originalBytes=source.stat().st_size,
                        sources=['atualizacao-2026-10-30/'+source.name])
            with tempfile.TemporaryDirectory(prefix='pj-import-') as temporary:
                temp = Path(temporary)
                if source.suffix.lower() == '.jpg':
                    item.update(type='image', **processing.variants(source, directory, stem+'-'+digest[:8]))
                elif source.suffix.lower() == '.pdf':
                    dest = stage/'public/documentos'/slug/(stem+'.pdf')
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    if dest.exists():
                        raise RuntimeError('Destino diferente já existe: '+str(dest.relative_to(stage)))
                    shutil.copyfile(source, dest)
                    info = processing.run(['pdfinfo', source])
                    processing.run(['pdftoppm', '-f', '1', '-singlefile', '-scale-to', '960', '-png', source, temp/'cover'])
                    cover = processing.variants(temp/'cover.png', directory, stem+'-capa')
                    item.update(type='document', src=processing.relative(dest), bytes=dest.stat().st_size,
                                pages=int(re.search(r'Pages:\s+(\d+)', info)[1]),
                                preserveOriginal=True, publicSHA256=sha(dest),
                                poster=cover['src'], posterSrcSet=cover['srcSet'],
                                width=cover['width'], height=cover['height'])
                elif source.suffix.lower() == '.mp4':
                    dest = directory/(stem+'.mp4')
                    if dest.exists():
                        raise RuntimeError('Destino de vídeo já existe: '+stem)
                    # Existing 10 MiB video budget requires optimization. Keep original audio.
                    processing.run(['ffmpeg', '-y', '-v', 'error', '-i', source, '-map', '0:v:0', '-map', '0:a:0',
                                    '-map_metadata', '-1', '-c:v', 'libx264', '-crf', '23', '-preset', 'slow',
                                    '-threads', '2', '-pix_fmt', 'yuv420p', '-maxrate', '700k', '-bufsize', '1400k',
                                    '-c:a', 'copy', '-movflags', '+faststart', dest])
                    info = json.loads(processing.run(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', dest]))
                    if dest.stat().st_size > 10*1024*1024:
                        raise RuntimeError('Vídeo excede orçamento de 10 MiB')
                    processing.run(['ffmpeg', '-y', '-v', 'error', '-ss', '12', '-i', dest, '-frames:v', '1', temp/'poster.png'])
                    poster = processing.variants(temp/'poster.png', directory, stem+'-poster')
                    item.update(type='video', src=processing.relative(dest), bytes=dest.stat().st_size,
                                duration=float(info['format']['duration']), width=poster['width'], height=poster['height'],
                                poster=poster['src'], posterSrcSet=poster['srcSet'])
                else:
                    raise RuntimeError('Tipo não suportado: '+source.name)
            records.append(item)
            by_hash[digest] = item
            outputs = processing.asset_outputs(item)
            registry['materials'].append({
                'materialId': 'media-'+hashlib.sha256(item['id'].encode()).hexdigest()[:16],
                'type': item['type'], 'status': 'aprovado-com-evidencia',
                'publicFilesSHA256': [sha(stage/'public'/p.lstrip('/')) for p in outputs],
                'evidenceRef': 'autorizacao-responsavel-2026-10-30',
            })
        processing.preserve_inventory(records, [], stage/'public')
        inventory.write_text(json.dumps(records, ensure_ascii=False, indent=2)+'\n')
        runtime = {'id','country','phase','activity','type','original','src','srcSet','width','height','color',
                   'poster','posterSrcSet','duration','bytes','pages','extracted','collection','title','description','alt'}
        (inventory.parent/'midias-publicas.json').write_text(json.dumps([
            {k: v for k, v in m.items() if k in runtime} for m in records
        ], ensure_ascii=False, indent=2)+'\n')
        registry_path.write_text(json.dumps(registry, ensure_ascii=False, indent=2)+'\n')
    return missing


if __name__ == '__main__':
    definitions = json.loads((ROOT/'scripts/atualizacao-2026-10-30.json').read_text())
    missing = import_items(ROOT, ROOT/'_entregas/atualizacao-2026-10-30', definitions)
    print(json.dumps({'missing': missing, 'declaration': 'autorizacao-responsavel-2026-10-30'}, ensure_ascii=False))
    # Generated manifests are excluded from mass formatting; format them explicitly.
    subprocess.run(['node', 'node_modules/prettier/bin/prettier.cjs', '--write', '--ignore-path', '/dev/null',
                    'src/data/generated/midias.json', 'src/data/generated/midias-publicas.json',
                    'docs/publication-status.json'], cwd=ROOT, check=True)
