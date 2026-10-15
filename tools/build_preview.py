# Bundles index.html + CSS + JS into one self-contained file (GSAP from cdnjs).
# Usage: python3 tools/build_preview.py . out.html
import re, sys
root, out = sys.argv[1], sys.argv[2]
html = open(f'{root}/index.html').read()
css = open(f'{root}/assets/css/styles.css').read()
js = open(f'{root}/assets/js/main.js').read()
head_end = html.index('</head>')
body = html[html.index('<body>') + len('<body>'):html.index('</body>')]
# drop external script tags at the end of body
body = re.sub(r'\s*<script src="assets/js/[^"]+" defer></script>', '', body)
page = (
  '<title>Silver Touch Green RE</title>\n'
  '<link rel="preconnect" href="https://fonts.googleapis.com" />\n'
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n'
  '<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />\n'
  '<style>\n' + css + '\n</style>\n'
  "<script>document.documentElement.classList.add('js');</script>\n"
  + body +
  '\n<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>\n'
  '<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>\n'
  '<script>\n' + js + '\n</script>\n'
)
assert '</script>' not in js
open(out, 'w').write(page)
print(len(page))
