from pathlib import Path
import base64, json, hashlib
ROOT=Path(__file__).resolve().parents[1]
music=json.loads((ROOT/'assets'/'music.json').read_text(encoding='utf-8'))
mp3=ROOT/music['file']
assert hashlib.sha256(mp3.read_bytes()).hexdigest()==music['sha256'], 'Music file does not match its provenance manifest.'
html=(ROOT/'src'/'page.html').read_text(encoding='utf-8')
for marker,content in [('/*__CSS__*/',(ROOT/'src'/'style.css').read_text(encoding='utf-8')),('/*__JS__*/',(ROOT/'src'/'film.js').read_text(encoding='utf-8')),('/*__AUDIO__*/',base64.b64encode(mp3.read_bytes()).decode())]:
    html=html.replace(marker,content)
(ROOT/'index.html').write_text(html,encoding='utf-8')
print(f'Built {ROOT / "index.html"} ({len(html.encode()):,} bytes); all assets embedded.')
