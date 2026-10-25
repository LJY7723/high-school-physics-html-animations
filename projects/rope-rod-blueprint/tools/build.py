from pathlib import Path
import base64, subprocess, sys
ROOT=Path(__file__).resolve().parents[1]
wave=ROOT/'.cache'/'score.wav'; mp3=ROOT/'.cache'/'score.mp3'
if not wave.exists():subprocess.run([sys.executable,str(ROOT/'tools'/'compose_score.py')],check=True)
subprocess.run(['ffmpeg','-y','-loglevel','error','-i',str(wave),'-af','loudnorm=I=-18:TP=-1.5:LRA=9','-t','60','-c:a','libmp3lame','-b:a','160k',str(mp3)],check=True)
html=(ROOT/'src'/'page.html').read_text(encoding='utf-8')
for marker,content in [('/*__CSS__*/',(ROOT/'src'/'style.css').read_text(encoding='utf-8')),('/*__JS__*/',(ROOT/'src'/'film.js').read_text(encoding='utf-8')),('/*__AUDIO__*/',base64.b64encode(mp3.read_bytes()).decode())]:
    html=html.replace(marker,content)
(ROOT/'index.html').write_text(html,encoding='utf-8')
print(f'Built {ROOT / "index.html"} ({len(html.encode()):,} bytes); all assets embedded.')
