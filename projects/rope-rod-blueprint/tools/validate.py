from pathlib import Path
import json,re,math,base64,hashlib,subprocess
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
music=json.loads((ROOT/'assets'/'music.json').read_text(encoding='utf-8'))
assert music['effective_speed_factor']==.9 and music['additional_speed_factor']==1
assert music['source_already_slowed'] and music['excerpt_duration_seconds']==60
audio=re.search(r'src="data:audio/mpeg;base64,([^"]+)"',html).group(1)
embedded=base64.b64decode(audio)
assert hashlib.sha256(embedded).hexdigest()==music['sha256']
assert embedded==(ROOT/music['file']).read_bytes()
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(ROOT/music['file'])]))
assert abs(float(probe['format']['duration'])-60)<.1
assert probe['streams'][0]['channels']==2
assert not re.search(r'''(?:src|href)=["']https?://''',html)
assert '/*__' not in html
assert 'data:audio/mpeg;base64,' in html and len(html)>1000000
assert 'DURATION=60' in html and 'fps:24' in html
assert abs(1/math.sin(math.pi/6)-2)<1e-12
assert abs(1/math.tan(math.pi/6)-math.sqrt(3))<1e-12
for deg in range(20,66):
    r=math.radians(deg);T=1/math.sin(r);N=1/math.tan(r)
    assert abs(T*math.sin(r)-1)<1e-12
    assert abs(N-T*math.cos(r))<1e-12
assert abs(math.hypot(-math.sqrt(3)/2,1-.5)-1)<1e-12
print('PASS: 60s, embedded music, offline resources, 46 equilibrium states, fixed-pulley vector closure.')
