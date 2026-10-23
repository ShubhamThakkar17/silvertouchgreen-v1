# Stages the multipage site for a shareable preview (claude.ai artifact).
# index.html becomes the main page (head + body content; the host wraps it in
# its own document skeleton). Every other page ships unchanged next to it, with
# the shared CSS/JS/images at the same relative paths, so links keep working.
# Usage: python3 tools/build_preview.py . out_dir   (run tools/build_site.py first)
import glob, json, os, re, shutil, sys

root, out = sys.argv[1], sys.argv[2]
shutil.rmtree(out, ignore_errors=True)
os.makedirs(out)

files = {}
for path in sorted(glob.glob(f'{root}/assets/**/*', recursive=True)):
    if os.path.isfile(path):
        rel = os.path.relpath(path, root)
        os.makedirs(os.path.dirname(f'{out}/{rel}'), exist_ok=True)
        shutil.copy(path, f'{out}/{rel}')
        files[rel] = rel

pages = sorted(os.path.basename(p) for p in glob.glob(f'{root}/*.html'))
for name in pages:
    html = open(f'{root}/{name}').read()
    if name == 'index.html':
        head = html[html.index('<head>') + len('<head>'):html.index('</head>')]
        head = re.sub(r'\s*<meta (charset|name="viewport")[^>]*>', '', head)
        head = re.sub(r'<title>.*?</title>', '<title>Silver Touch Green</title>', head)
        body = html[html.index('>', html.index('<body')) + 1:html.index('</body>')]
        html = head.strip() + '\n' + body.strip() + '\n'
    else:
        files[name] = name
    open(f'{out}/{name}', 'w').write(html)

json.dump(files, open(f'{out}/files.json', 'w'), indent=1)
print(f'{len(pages)} pages, {len(files)} supporting files -> {out}')
