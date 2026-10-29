#!/usr/bin/env python3
"""Processamento local reproduzível. Requer Pillow, ffmpeg, Poppler e Ghostscript.
Entradas permanecem privadas; apenas derivados sem metadados vão para public.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageFilter
import argparse, base64, hashlib, io, json, re, shutil, subprocess, unicodedata, os, importlib.util
import xml.etree.ElementTree as ET
import zipfile
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from media_transaction import transaction

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / '_entregas'
CACHE = ROOT / '_processamento'
PUBLIC = ROOT / 'public'
VERSION = 'v3-q80-720-crf28'
TOOL_CACHE = CACHE / 'ferramentas/imageio_ffmpeg/binaries'

def clean(value):
    value = re.sub(r'#U([0-9a-fA-F]{4})', lambda m: chr(int(m[1], 16)), value)
    return re.sub(r'[^a-z0-9]+', '-', unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode().lower()).strip('-')

def run(args):
    if args[0] == 'ffmpeg':
        local = next(TOOL_CACHE.glob('ffmpeg-*'), None)
        args[0] = os.environ.get('FFMPEG_BINARY') or str(local or 'ffmpeg')
    result = subprocess.run([str(x) for x in args], capture_output=True)
    if result.returncode: raise RuntimeError(result.stderr.decode(errors='replace'))
    return result.stdout.decode(errors='replace')

def relative(p):
    return '/' + str(p.relative_to(PUBLIC))

def variants(source, directory, stem):
    directory.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as opened:
        im = ImageOps.exif_transpose(opened).convert('RGB')
    sizes = sorted(set(min(w, im.width) for w in [480, 960, 1600]))
    output = []
    for w in sizes:
        dest = directory / f'{stem}-{w}.webp'
        thumb = im.resize((w, round(im.height * w / im.width)), Image.Resampling.LANCZOS)
        quality = 80
        while True:
            thumb.save(dest, 'WEBP', quality=quality, method=6, exif=b'')
            if dest.stat().st_size <= 350000 or quality <= 45: break
            quality -= 5
        output.append({'src': relative(dest), 'width': w})
    small = im.copy(); small.thumbnail((16, 16)); small = small.filter(ImageFilter.GaussianBlur(2))
    buffer = io.BytesIO(); small.save(buffer, 'WEBP', quality=35)
    dominant = im.resize((1, 1)).getpixel((0, 0))
    return {'src': output[-1]['src'], 'srcSet': ', '.join(f"{v['src']} {v['width']}w" for v in output),
            'variants': output, 'width': im.width, 'height': im.height,
            'color': '#%02x%02x%02x' % dominant, 'placeholder': 'data:image/webp;base64,' + base64.b64encode(buffer.getvalue()).decode()}

def palette(source):
    im = Image.open(source).convert('RGB'); im.thumbnail((240, 240))
    quantized = im.quantize(colors=12)
    pal = quantized.getpalette()
    return [{'hex': '#%02x%02x%02x' % tuple(pal[i*3:i*3+3]), 'pixels': n} for n,i in sorted(quantized.getcolors(), reverse=True)]

def asset_outputs(item):
    paths = [item.get('src'), item.get('poster')]
    paths.extend(v['src'] for v in item.get('variants', []))
    paths.extend(candidate.strip().split(' ')[0] for candidate in item.get('posterSrcSet', '').split(',') if candidate.strip())
    return list(dict.fromkeys(p for p in paths if p))

def preserve_inventory(generated, existing, public):
    """Missing sources never mean deletion. Reject incomplete/ambiguous output."""
    keys = [(m['country'], m['original']) for m in generated]
    if len(keys) != len(set(keys)):
        raise RuntimeError('Manifesto ambíguo: país/nome duplicado; nada será publicado.')
    by_key = dict(zip(keys, generated))
    merged = [by_key.pop((old['country'], old['original']), old) for old in existing]
    merged.extend(by_key.values())
    if len({m['id'] for m in merged}) != len(merged):
        raise RuntimeError('IDs duplicados; nada será publicado.')
    missing = [p for m in merged for p in asset_outputs(m) if not (public / p.lstrip('/')).is_file()]
    if missing:
        raise RuntimeError('Acervo incompleto; manifestos preservados. Arquivos ausentes: ' + ', '.join(missing))
    retained = [m['id'] for m in existing if (m['country'], m['original']) not in keys]
    if retained:
        print(f'AVISO: {len(retained)} registros sem nova fonte preservados: ' + ', '.join(retained), flush=True)
    return merged

def generate(args):
    manifest_path = ROOT/'src/data/generated/midias.json'
    existing = json.loads(manifest_path.read_text()) if manifest_path.exists() else []
    # Check before any expensive processing or publication.
    preserve_inventory(existing, [], PUBLIC)
    if args.check:
        hashes = {hashlib.sha256(p.read_bytes()).hexdigest() for p in RAW.rglob('*') if p.is_file()}
        restored = [m['id'] for m in existing if m.get('sha256') in hashes]
        missing = [m['id'] for m in existing if m.get('sha256') and not m.get('extracted') and m['sha256'] not in hashes]
        print(json.dumps({'records':len(existing), 'sourcesVerified':len(restored), 'sourcesUnavailablePreserved':missing, 'writes':0}, ensure_ascii=False, indent=2))
        return
    CACHE.mkdir(exist_ok=True); (CACHE/'textos').mkdir(exist_ok=True)
    old_path = CACHE/'manifest-cache.json'
    old = json.loads(old_path.read_text()) if old_path.exists() else {}
    # Reuse validated imports (including Jambor) when their source hash matches.
    identity_keys = {'id','country','phase','activity','original','sources','sha256','originalBytes'}
    for item in existing:
        if item.get('sha256') and not item.get('extracted'):
            old.setdefault(VERSION + '-' + item['id'], {'result':{k:v for k,v in item.items() if k not in identity_keys}, 'outputs':asset_outputs(item)})
    cache = {}; manifest = []; duplicates = []; ignored = []; seen = {}
    sources = sorted((p for p in RAW.rglob('*') if p.is_file()), key=lambda p: ('Atividade 1' not in str(p), str(p)))
    if not sources: raise RuntimeError('Adicione os arquivos em _entregas/ antes de processar.')
    for path in sources:
        if 'Screenshot_20260929_190842_Drive' in path.name:
            ignored.append(str(path.relative_to(RAW))); continue
        slug = next((c for c in ['galixandria','astalania','jakkar','jambor','lervuria'] if c in clean(str(path))), None)
        if not slug: continue
        # Lervúria exige os nomes revisados e a extração dos símbolos do PDF.
        # O mesmo processador é usado na atualização isolada e na carga completa.
        if slug == 'lervuria': continue
        suffix = path.suffix.lower()
        if suffix not in ['.png','.jpg','.jpeg','.mp4','.pdf','.docx','.csv']: continue
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        source = str(path.relative_to(RAW))
        if digest in seen:
            seen[digest]['sources'].append(source); duplicates.append(source); continue
        stem = clean(path.stem)
        identifier = f'{slug}-{stem}-{digest[:8]}'
        activity = re.search(r'atividade-(\d+)', clean(str(path)))
        phase = re.search(r'fase-(\d+)', clean(str(path)))
        item = {'id': identifier, 'country': slug, 'phase': f"fase-{phase[1] if phase else '1'}", 'activity': int(activity[1]) if activity else 1,
                'original': path.name, 'sources': [source], 'sha256': digest, 'originalBytes': path.stat().st_size}
        key = VERSION + '-' + identifier
        previous = old.get(key)
        if previous and all((PUBLIC/u.lstrip('/')).exists() for u in previous.get('outputs',[])):
            item.update(previous['result'])
        else:
            result = {}; outputs = []
            if suffix in ['.png','.jpg','.jpeg']:
                result = {'type': 'image', **variants(path, PUBLIC/'midia'/slug, stem+'-'+digest[:8])}
                outputs = [v['src'] for v in result['variants']]
            elif suffix == '.mp4':
                dest = PUBLIC/'midia'/slug/f'{stem}.mp4'; dest.parent.mkdir(parents=True,exist_ok=True)
                info = json.loads(run(['ffprobe','-v','quiet','-show_format','-show_streams','-of','json',path]))
                duration = float(info['format']['duration'])
                # Cap at 9.5 MB through a duration-based bitrate envelope; short videos use CRF alone.
                budget = max(180, int((9.5*1024*1024*8/duration)/1000)-110)
                command = ['ffmpeg','-y','-v','error','-i',path,'-map_metadata','-1','-vf',"scale=trunc(iw*min(1\\,720/ih)/2)*2:trunc(ih*min(1\\,720/ih)/2)*2",'-c:v','libx264','-crf','28','-preset','slow','-threads','2','-pix_fmt','yuv420p','-maxrate',f'{budget}k','-bufsize',f'{budget*2}k','-c:a','aac','-b:a','96k','-movflags','+faststart',dest]
                print(f'Comprimindo vídeo {path.name} ({duration:.1f}s)…', flush=True)
                run(command)
                if dest.stat().st_size > 10*1024*1024:
                    raise RuntimeError(f'Vídeo excedeu 10 MB: {dest}; reduza bitrate.')
                poster = CACHE/f'{stem}-poster.png'
                run(['ffmpeg','-y','-v','error','-ss','1','-i',dest,'-frames:v','1',poster])
                image = variants(poster,PUBLIC/'midia'/slug,stem+'-poster')
                result = {'type':'video','src':relative(dest),'poster':image['src'],'posterSrcSet':image['srcSet'],'duration':round(duration,1),'width':image['width'],'height':image['height'],'bytes':dest.stat().st_size}
                outputs = [relative(dest)] + [v['src'] for v in image['variants']]
            elif suffix == '.pdf':
                dest = PUBLIC/'documentos'/slug/f'{stem}.pdf';dest.parent.mkdir(parents=True,exist_ok=True)
                if path.stat().st_size > 5*1024*1024:
                    print(f'Comprimindo PDF {path.name}…',flush=True)
                    run(['gs','-sDEVICE=pdfwrite','-dCompatibilityLevel=1.4','-dPDFSETTINGS=/ebook','-dNOPAUSE','-dQUIET','-dBATCH',f'-sOutputFile={dest}',path])
                    if dest.stat().st_size > 5*1024*1024: raise RuntimeError('PDF ainda excede 5 MB')
                else: shutil.copy2(path,dest)
                info = run(['pdfinfo',dest]);pages = int(re.search(r'Pages:\s+(\d+)',info)[1])
                run(['pdftotext','-layout',path,CACHE/'textos'/f'{stem}.txt'])
                result = {'type':'document','src':relative(dest),'pages':pages,'bytes':dest.stat().st_size}
                outputs = [relative(dest)]
            elif suffix == '.docx':
                with zipfile.ZipFile(path) as z:
                    root = ET.fromstring(z.read('word/document.xml')); ns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
                    paragraphs = [''.join(t.text or '' for t in p.findall('.//w:t',ns)) for p in root.findall('.//w:p',ns)]
                (CACHE/'textos'/f'{stem}.txt').write_text('\n'.join(paragraphs))
                result = {'type':'source','note':'Texto extraído; DOCX não publicado.'}
            else:
                dest = PUBLIC/'documentos'/slug/'briefing-site.csv';dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(path,dest)
                result = {'type':'briefing','src':relative(dest),'bytes':dest.stat().st_size}; outputs = [relative(dest)]
            item.update(result)
            previous = {'result':result,'outputs':outputs}
        cache[key] = previous
        manifest.append(item);seen[digest]=item
        old_path.write_text(json.dumps({**old,**cache},ensure_ascii=False))

    lervuria_pdf = next((p for p in sources if p.name == 'Símbolo da bandeira de Lervúria (1).pdf'), None)
    lervuria_source = lervuria_pdf or next((p for p in sources if 'lervuria' in clean(str(p))), None)
    if lervuria_source:
        spec = importlib.util.spec_from_file_location('lervuria', ROOT/'scripts/processar-lervuria.py')
        lervuria = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(lervuria)
        lervuria.ROOT = ROOT
        from types import SimpleNamespace
        lervuria.processing = SimpleNamespace(variants=variants, run=run, relative=relative)
        manifest.extend(lervuria.build_records(lervuria_source.parent))

    # Extração sem rasterizar texto: imagens incorporadas nas páginas originais.
    pdf = next((p for p in sources if p.name=='Galixandria_Terra_Mar_Uniao-1.pdf'), None)
    if pdf:
        for page, name in [(1,'brasao'),(6,'mapa')]:
            prefix = CACHE/f'galixandria-{name}'
            run(['pdfimages','-f',page,'-l',page,'-j',pdf,prefix])
            candidates = list(CACHE.glob(f'galixandria-{name}-*'))
            if not candidates: raise RuntimeError(f'PDF de Galixandria sem imagem extraível na página {page}.')
            selected = max(candidates,key=lambda p:Image.open(p).width*Image.open(p).height)
            output = variants(selected,PUBLIC/'midia/galixandria',name)
            manifest.append({'id':f'galixandria-{name}','country':'galixandria','phase':'fase-1','activity':1,'type':'image','original':f'{name}-extraido.pdf','sources':[f'{pdf.name} — página {page}'],'extracted':True,**output})
    hero_source = ROOT/args.hero
    if not hero_source.exists(): hero_source = next((p for p in sources if p.name=='1000396039.jpg'), None)
    if hero_source is None:
        hero_path = ROOT/'src/data/generated/hero.json'
        if not hero_path.exists():
            raise RuntimeError('Hero ausente: informe --hero ou preserve hero.json e seus derivados anteriores.')
        hero = json.loads(hero_path.read_text())
        hero_outputs = [hero.get('src'), hero.get('avifSrc')]
        for key in ['srcSet', 'avifSrcSet']:
            hero_outputs.extend(part.strip().split(' ')[0] for part in hero.get(key, '').split(',') if part.strip())
        if any(not (PUBLIC/path.lstrip('/')).is_file() for path in hero_outputs if path):
            raise RuntimeError('Derivado do hero anterior ausente; forneça uma fonte com --hero.')
    else:
        hero = variants(hero_source,PUBLIC/'midia','hero')
        # AVIF complementar para o LCP; WebP permanece como fallback universal.
        with Image.open(hero_source) as opened:
            hero_image = ImageOps.exif_transpose(opened).convert('RGB')
            avif = []
            for w in sorted(set(min(w, hero_image.width) for w in [480, 960, 1600])):
                dest = PUBLIC/'midia'/f'hero-{w}.avif'
                resized = hero_image.resize((w, round(hero_image.height*w/hero_image.width)), Image.Resampling.LANCZOS)
                try:
                    resized.save(dest, 'AVIF', quality=50, speed=6)
                except KeyError:
                    # Algumas distribuições compilam Pillow sem libavif.
                    png = CACHE/f'hero-{w}-avif.png'; resized.save(png)
                    run([os.environ.get('AVIF_FFMPEG_BINARY') or shutil.which('ffmpeg'), '-y', '-v', 'error', '-i', png, '-map_metadata', '-1', '-c:v', 'libaom-av1', '-crf', '36', '-cpu-used', '6', '-still-picture', '1', '-pix_fmt', 'yuv420p', dest])
                avif.append(f'{relative(dest)} {w}w')
            hero['avifSrc'] = relative(dest)
            hero['avifSrcSet'] = ', '.join(avif)
    # Miniaturas das bandeiras evitam baixar 480px para um espaço de 46–64px.
    flag_names = ['1789400638988.png', 'Bárbara 13 setembro 2 (BANDEIRA).png', 'Bandeira de Jakkar.png', 'bandeira de Jambor.jpeg']
    for item in manifest:
        if item['original'] not in flag_names: continue
        original = RAW/item['sources'][0]
        with Image.open(original) as opened:
            thumb = ImageOps.exif_transpose(opened).convert('RGB')
            thumb.thumbnail((128,128), Image.Resampling.LANCZOS)
            dest = PUBLIC/'midia'/item['country']/f"{clean(original.stem)}-{item['sha256'][:8]}-128.webp"
            thumb.save(dest, 'WEBP', quality=80, method=6, exif=b'')
        item['variants'] = [{'src':relative(dest), 'width':thumb.width}] + [v for v in item['variants'] if v['width'] != thumb.width]
        item['srcSet'] = ', '.join(f"{v['src']} {v['width']}w" for v in item['variants'])
    (ROOT/'src/data/generated').mkdir(parents=True,exist_ok=True)
    manifest = preserve_inventory(manifest, existing, PUBLIC)
    # Prepare both files before replacing either; a validation failure writes neither.
    manifest_temp = manifest_path.with_suffix('.json.tmp')
    manifest_temp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    # O navegador recebe só campos de exibição; hashes, origens e cache ficam no inventário.
    runtime_keys = {'id','country','phase','activity','type','original','src','srcSet','width','height','color','poster','posterSrcSet','duration','bytes','pages','extracted'}
    public_path = ROOT/'src/data/generated/midias-publicas.json'
    public_temp = public_path.with_suffix('.json.tmp')
    public_temp.write_text(json.dumps([{k:v for k,v in item.items() if k in runtime_keys} for item in manifest],ensure_ascii=False,indent=2)+'\n')
    manifest_temp.replace(manifest_path)
    public_temp.replace(public_path)
    if hero_source is not None:
        (ROOT/'src/data/generated/hero.json').write_text(json.dumps(hero,ensure_ascii=False,indent=2)+'\n')
    # Logo oficial: manter original; derivado transparente só remove branco exterior.
    logo_path = PUBLIC/'assets/planeta-jovem-oficial.png'
    if logo_path.exists():
        logo = Image.open(logo_path).convert('RGBA')
        for y in range(logo.height):
            for x in range(logo.width):
                r,g,b,a = logo.getpixel((x,y))
                if min(r,g,b)>245:logo.putpixel((x,y),(r,g,b,0))
        logo=logo.crop(logo.getbbox());logo.save(PUBLIC/'assets/planeta-jovem-marca.webp',format='WEBP',lossless=True)
    color_sources={'marca':logo_path} if logo_path.exists() else {}
    for slug, name in [('galixandria','1789400638988.png'),('astalania','Bárbara 13 setembro 2 (BANDEIRA).png'),('jakkar','Bandeira de Jakkar.png')]:
        source = next((p for p in sources if p.name==name), None)
        if source: color_sources[slug] = source
    palette_path = ROOT/'docs/cores-amostradas.json'
    colors = json.loads(palette_path.read_text()) if palette_path.exists() else {}
    colors.update({k:palette(v) for k,v in color_sources.items()})
    palette_path.write_text(json.dumps(colors,ensure_ascii=False,indent=2)+'\n')
    files=[p for folder in ['midia','documentos'] for p in (PUBLIC/folder).rglob('*') if p.is_file()]
    report={'uniqueSources':len(seen),'duplicates':duplicates,'ignored':ignored,'totalBytes':sum(p.stat().st_size for p in files),'largest':[{'path':relative(p),'bytes':p.stat().st_size} for p in sorted(files,key=lambda p:p.stat().st_size,reverse=True)[:10]],'heroSource':hero_source.name if hero_source else 'derivado-preservado','heroBytes':(PUBLIC/hero['src'].lstrip('/')).stat().st_size}
    (ROOT/'docs/relatorio-midias.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    old_path.write_text(json.dumps(cache,ensure_ascii=False))
    print(json.dumps(report,ensure_ascii=False,indent=2))

def preflight(args):
    sources = [p for p in RAW.rglob('*') if p.is_file()]
    if not sources:
        raise RuntimeError('Adicione fontes em _entregas/ antes de processar; acervo anterior preservado.')
    if args.hero != '_referencias/hero-alta.jpg' and not (ROOT/args.hero).is_file():
        raise RuntimeError('Fonte obrigatória --hero ausente; nenhum arquivo publicado foi alterado.')
    required = set()
    for source in sources:
        suffix = source.suffix.lower()
        if suffix in {'.jpg', '.jpeg', '.png'}:
            with Image.open(source) as image:
                image.verify()
        if suffix == '.pdf':
            required.update(['pdfinfo', 'pdftotext', 'pdfimages'])
            if source.stat().st_size > 5*1024*1024: required.add('gs')
        if suffix == '.mp4': required.update(['ffmpeg', 'ffprobe'])
        if suffix == '.docx':
            with zipfile.ZipFile(source) as archive: archive.read('word/document.xml')
    for command in required:
        executable = (os.environ.get('FFMPEG_BINARY') or next(TOOL_CACHE.glob('ffmpeg-*'), 'ffmpeg')) if command == 'ffmpeg' else command
        if not shutil.which(str(executable)):
            raise RuntimeError(f'Ferramenta ausente: {command}; nenhum arquivo publicado foi alterado.')


def main(argv=None):
    global ROOT, CACHE, PUBLIC
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--hero', default='_referencias/hero-alta.jpg')
    parser.add_argument('--check', action='store_true', help='Confere fontes e derivados sem escrever.')
    args = parser.parse_args(argv)
    if args.check:
        return generate(args)
    original = ROOT, CACHE, PUBLIC
    with transaction(ROOT) as staging:
        preflight(args)
        # Input files stay immutable. All outputs, including specialist processing, use staging.
        hero = ROOT/args.hero
        if hero.is_file(): args.hero = str(hero.resolve())
        ROOT, CACHE, PUBLIC = staging, staging/'_processamento', staging/'public'
        try:
            generate(args)
        finally:
            ROOT, CACHE, PUBLIC = original


if __name__ == '__main__':
    try:
        main()
    except (RuntimeError, OSError, ValueError, zipfile.BadZipFile) as error:
        raise SystemExit(f'Processamento interrompido: {error}') from error
