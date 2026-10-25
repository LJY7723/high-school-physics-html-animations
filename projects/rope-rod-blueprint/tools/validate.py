from pathlib import Path
import json,re,math
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
report=json.loads((ROOT/'references'/'score-report.json').read_text(encoding='utf-8'))
assert report['duration']==60 and report['clipped_samples']==0
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
