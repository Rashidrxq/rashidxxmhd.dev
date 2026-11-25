"""Prepare the static site and a portable source download. Run from any directory."""
from pathlib import Path
from shutil import copy2, copytree
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
output = root / 'dist'
output.mkdir(exist_ok=True)
web_files = ['index.html', 'glimpse.css', 'glimpse.js', 'favicon.svg', 'wall.json',
             'wall.txt', 'themes.json', 'github-snapshot.json', 'profile.js']
web_dirs = ['assets', 'intros', 'site']
for name in web_files:
    copy2(root / name, output / name)
for name in web_dirs:
    copytree(root / name, output / name, dirs_exist_ok=True)

with ZipFile(output / 'rashid-portfolio.zip', 'w', compression=ZIP_DEFLATED) as archive:
    for name in web_files + ['README.md', 'portfolio.config.json', 'serve.py']:
        archive.write(root / name, 'rashid-portfolio/' + name)
    for name in web_dirs + ['scripts']:
        for item in sorted((root / name).rglob('*')):
            if item.is_file() and '__pycache__' not in item.parts:
                archive.write(item, 'rashid-portfolio/' + item.relative_to(root).as_posix())
