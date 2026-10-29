"""Local POSIX media transaction: lock, staging, durable journal and rollback.

Readers must use a completed build, not the working directory during publication.
A killed publisher is rolled back under the same lock on the next invocation.
"""
from contextlib import contextmanager
from pathlib import Path
import fcntl
import hashlib
import json
import os
import shutil
import tempfile

OUTPUTS = ('public', 'src/data/generated')
DOCUMENTS = ('cores-amostradas.json', 'relatorio-midias.json')


def digest(path):
    return hashlib.sha256(path.read_bytes()).digest()


def durable_json(path, value):
    temporary = path.with_suffix('.tmp')
    with temporary.open('w') as stream:
        json.dump(value, stream)
        stream.flush()
        os.fsync(stream.fileno())
    os.replace(temporary, path)
    directory = os.open(path.parent, os.O_RDONLY)
    try:
        os.fsync(directory)
    finally:
        os.close(directory)


def recover(root, journal):
    state = json.loads(journal.read_text())
    staging = Path(state['staging'])
    # Paths come from our journal, but reject a malformed journal before writing.
    if staging.parent != root or not staging.name.startswith('.media-stage-'):
        raise RuntimeError('Journal de mídia inválido; preserve-o para recuperação manual.')
    for row in reversed(state['files']):
        relative = Path(row['path'])
        if relative.is_absolute() or '..' in relative.parts:
            raise RuntimeError('Caminho inválido no journal de mídia.')
        target = root / relative
        backup = staging / 'backup' / relative
        if row['existed']:
            # Copy rather than consume backups: recovery itself is restartable.
            temporary = target.with_name(target.name + '.restore')
            shutil.copy2(backup, temporary)
            os.replace(temporary, target)
        elif target.exists():
            target.unlink()
    journal.unlink()
    shutil.rmtree(staging)


def publish(root, staging, replace=os.replace):
    files = []
    for directory in OUTPUTS:
        files.extend(p for p in (staging / directory).rglob('*') if p.is_file())
    files.extend(staging / 'docs' / name for name in DOCUMENTS
                 if (staging / 'docs' / name).is_file())
    rows = []
    for source in files:
        relative = source.relative_to(staging)
        target = root / relative
        if target.is_file() and digest(source) == digest(target):
            continue
        if target.exists() and not target.is_file():
            raise RuntimeError(f'Destino de mídia não é um arquivo: {relative}')
        existed = target.is_file()
        if existed:
            backup = staging / 'backup' / relative
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(target, backup)
            with backup.open('rb') as stream:
                os.fsync(stream.fileno())
        with source.open('rb') as stream:
            os.fsync(stream.fileno())
        rows.append({'path': str(relative), 'existed': existed})
    journal = root / '.media-transaction.json'
    durable_json(journal, {'staging': str(staging), 'files': rows})
    try:
        for row in rows:
            target = root / row['path']
            target.parent.mkdir(parents=True, exist_ok=True)
            replace(staging / row['path'], target)
        # Persist directory entries before considering the set committed.
        for parent in { (root / row['path']).parent for row in rows }:
            fd = os.open(parent, os.O_RDONLY)
            try:
                os.fsync(fd)
            finally:
                os.close(fd)
        journal.unlink()
    except BaseException:
        recover(root, journal)
        raise


@contextmanager
def transaction(root):
    root = Path(root).resolve()
    with (root / '.media-processing.lock').open('a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as error:
            raise RuntimeError('Outro processamento está em execução; aguarde sua conclusão.') from error
        journal = root / '.media-transaction.json'
        if journal.exists():
            recover(root, journal)
        staging = Path(tempfile.mkdtemp(prefix='.media-stage-', dir=root))
        try:
            for directory in OUTPUTS:
                if (root / directory).exists():
                    shutil.copytree(root / directory, staging / directory)
            (staging / 'docs').mkdir(exist_ok=True)
            for name in DOCUMENTS:
                if (root / 'docs' / name).exists():
                    shutil.copy2(root / 'docs' / name, staging / 'docs' / name)
            # Specialist code is read from source; only output goes to staging.
            (staging / 'scripts').mkdir()
            for source in (root / 'scripts').glob('*.py'):
                shutil.copy2(source, staging / 'scripts' / source.name)
            yield staging
            publish(root, staging)
        finally:
            # Keep backups if recovery itself failed; next invocation retries.
            if not journal.exists() and staging.exists():
                shutil.rmtree(staging)
            fcntl.flock(lock, fcntl.LOCK_UN)
