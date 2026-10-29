#!/usr/bin/env python3
"""Review candidate paths with Git's own ignore engine. Never stage or commit."""
from pathlib import Path
import json
import re
import subprocess
import tempfile
import sys

ROOT = Path(__file__).resolve().parents[1]
patterns = [r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----', r'AKIA[0-9A-Z]{16}',
            r'gh[pousr]_[A-Za-z0-9]{30,}', r'(?:sk-proj-|sk_live_)[A-Za-z0-9_-]{16,}',
            r'(?i)(?:password|secret|token|api_key)\s*[:=]\s*["\x27][A-Za-z0-9_/-]{20,}["\x27]']
# A temporary Git index is used only to evaluate .gitignore, not the real .git.
with tempfile.TemporaryDirectory(prefix='pj-candidate-') as temporary:
    subprocess.run(['git','init','--bare','--quiet',temporary],check=True)
    command = ['git', f'--git-dir={temporary}', f'--work-tree={ROOT}', '-c', 'core.excludesFile=/dev/null']
    result = subprocess.run(command+['ls-files','--others','--exclude-standard','-z'],capture_output=True,check=True)
    paths = sorted(p for p in result.stdout.decode().split('\0') if p)
    findings = []
    large = []
    total = 0
    for name in paths:
        path = ROOT/name
        if path.is_symlink(): findings.append({'path':name,'kind':'symlink: review target'}); continue
        size = path.stat().st_size
        total += size
        if size > 50*1024*1024: large.append({'path':name,'bytes':size})
        if size < 8*1024*1024 and path.suffix.lower() not in {'.mp4','.pdf','.webp','.avif','.png','.jpg','.jpeg','.woff2'}:
            text = path.read_text(errors='replace')
            if any(re.search(pattern,text) for pattern in patterns): findings.append({'path':name,'kind':'possible credential; value suppressed'})
            if re.search(r'/(?:home|Users)/[^/\s]+/',text): findings.append({'path':name,'kind':'private absolute path'})
    registry = json.loads((ROOT/'docs/publication-status.json').read_text())
    materials = registry['materials']
    valid = {'aprovado-com-evidencia','pendente','restrito'}
    for row in materials:
        if row['status'] not in valid or (row['status']=='aprovado-com-evidencia' and not row.get('evidenceRef')):
            findings.append({'path':'docs/publication-status.json','kind':'invalid editorial decision'})
    import hashlib
    covered = {digest for row in materials for digest in row['publicFilesSHA256']}
    unlisted = sum(hashlib.sha256(p.read_bytes()).hexdigest() not in covered for p in (ROOT/'public').rglob('*') if p.is_file())
    if unlisted: findings.append({'path':'public/','kind':f'{unlisted} unregistered files'})
    blocked = bool(unlisted) or any(row['publicFilesSHA256'] and row['status']!='aprovado-com-evidencia' for row in materials)
    report = {'candidateFiles' :len(paths),'candidateBytes':total,'largeFiles':large,'findings':findings,
              'publicReleaseBlocked':blocked,'reason':'Conferir decisões editoriais em docs/PUBLICACAO.md.'}
    (ROOT/'test-results').mkdir(exist_ok=True)
    (ROOT/'test-results/github-candidates.json').write_text(json.dumps({'summary':report,'paths':paths},indent=2)+'\n')
    print(json.dumps(report,indent=2))
    if findings or any(row['bytes']>100*1024*1024 for row in large): raise SystemExit(1)

    if '--public' in sys.argv and blocked: raise SystemExit(2)
