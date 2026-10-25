"""Original 60s chamber miniature, 96 BPM, 24 bars in D major.
No sampled recordings. Deterministic physical-model plucks, celesta, bowed bed.
"""
from pathlib import Path
import json, wave
import numpy as np
from scipy.signal import lfilter, butter, sosfilt

ROOT=Path(__file__).resolve().parents[1]
SR=44100; DUR=60; N=SR*DUR; BEAT=.625; BAR=2.5
rng=np.random.default_rng(2305)
music=np.zeros((N,2),dtype=np.float64)
fx=np.zeros_like(music)
events=[]

def freq(m): return 440*2**((m-69)/12)
def add(dst,x,t,amp=1,pan=0):
    start=int(round(t*SR)); end=min(N,start+len(x)); off=max(0,-start); start=max(0,start)
    if end<=start:return
    x=x[off:off+end-start]*amp
    if x.ndim==1:
        gains=np.sqrt([(1-pan)/2,(1+pan)/2]); dst[start:end]+=x[:,None]*gains
    else:dst[start:end]+=x

def pluck(m,d=1.2,soft=False):
    f=freq(m); n=int(d*SR); t=np.arange(n)/SR; y=np.zeros(n)
    # A lightly detuned, damped string with an increasingly dark spectrum.
    for k in range(1,10):
        env=np.exp(-t*(1.7+k*.52)/(1.6 if soft else 1))
        y+=(1/k**(1.8 if soft else 1.4))*np.sin(2*np.pi*f*k*t+rng.uniform(-.02,.02))*env
    y*=np.minimum(1,t/.007)*np.minimum(1,(d-t)/.15)
    return y*.26

def celesta(m,d=1.8):
    f=freq(m);t=np.arange(int(d*SR))/SR;y=np.zeros(len(t))
    for ratio,a,decay in [(1,1,2.5),(2,.24,4),(3.99,.12,7),(5.41,.025,9)]:
        y+=a*np.sin(2*np.pi*f*ratio*t)*np.exp(-decay*t)
    return y*np.minimum(1,t/.006)*np.minimum(1,(d-t)/.08)*.16

def bowed(m,d=2.7):
    f=freq(m);t=np.arange(int(d*SR))/SR;y=np.zeros(len(t));vib=.0017*np.sin(2*np.pi*4.8*t)
    for k in range(1,9):
        for detune in [-.0028,.0028]:
            y+=np.sin(2*np.pi*f*k*(1+detune)*t+vib*f*k)/(k**1.65)*.5
    env=np.minimum(1,t/.6)*np.minimum(1,(d-t)/.75)
    return y*env*.05

def note(inst,m,t,d=1,amp=1,pan=0):
    if t>=59.2:return
    add(music,{'pluck':pluck,'celesta':celesta,'bowed':bowed}[inst](m,d),t,amp,pan)
    events.append({'t':round(t,3),'instrument':inst,'midi':m})

# Each harmony has one bar. Opening and late bars breathe; middle voices imitate.
chords=[[50,57,62,66],[47,54,59,62],[43,50,55,59],[45,52,57,61]]
progression=[0,0,1,2,0,3,1,3,0,2,1,3,0,1,2,3,0,0,2,3,1,2,3,0]
motif=[0,2,1,3,2,1,2,0]
for bar,ci in enumerate(progression):
    start=bar*BAR;ch=chords[ci]
    if bar<2:pattern=[0,2,1,3]
    elif bar in [5,9,15,19]:pattern=[0,2,1,3]
    else:pattern=motif
    step=BAR/len(pattern)
    for i,k in enumerate(pattern):
        velocity=(.68 if bar<2 else .83)*(1.12 if i%4==0 else .9)
        note('pluck',ch[k]+12,start+i*step+.06,1.1,velocity,.18)
    for i in [0,2]:note('pluck',ch[0]-12,start+i*BEAT,1.8,.75,-.23)
    if bar>=3 and bar not in [5,9,15,19]:
        answer=[ch[2],ch[1],ch[3],ch[2]]
        for i,m in enumerate(answer):note('pluck',m,start+i*BEAT+.16,1.3,.46,-.35)
    if 6<=bar<=18:
        for k,m in enumerate(ch[1:]):note('bowed',m,start+.01,2.9,.52,.2*(k-1))
    if bar in [2,6,10,16,20]:
        for i,m in enumerate([ch[2]+12,ch[3]+12,ch[1]+24]):note('celesta',m,start+i*.3125,2.2,.6,-.12+i*.15)

# A written cadence resolves exactly under the final verdict.
for i,m in enumerate([50,57,62,66,69,74]):note('pluck',m,57.5+i*.045,2.3,.64,-.1+i*.05)
for m in [62,66,69,74]:note('celesta',m,58.12,1.8,.38,.15)

def tick(d=.08,f=1150):
    t=np.arange(int(d*SR))/SR
    return (.7*np.sin(2*np.pi*f*t)+.3*rng.standard_normal(len(t)))*np.exp(-t*80)*.14
for t in [6.25,16.25,26.25,40,50,56.25]:add(fx,tick(),t,.45)
for t in [.3,1.1,1.75,2.3,7.05,8.1,17.0,20.0,26.8,27.3,28.0,40.6,41.2,50.3,51.6]:
    d=.3;ticks=np.arange(int(d*SR))/SR;n=rng.standard_normal(len(ticks))
    filtered=sosfilt(butter(2,[2100,5400],btype='bandpass',fs=SR,output='sos'),n)
    add(fx,filtered*np.sin(np.pi*ticks/d)**2,t,.011,pan=rng.uniform(-.25,.25))
add(fx,tick(.15,160),58.15,1.3)

# Small chamber early reflections, then decaying stereo echoes.
dry=music.copy()
for delay,gain,cross in [(.047,.13,False),(.079,.1,True),(.113,.085,False),(.173,.06,True),(.269,.045,False),(.421,.025,True)]:
    n=int(delay*SR);src=dry[:,::-1] if cross else dry;music[n:]+=src[:-n]*gain
mix=music+fx
t=np.arange(N)/SR;env=np.minimum(1,t/.4)*np.minimum(1,(60-t)/1.4)
mix*=env[:,None]
mix=sosfilt(butter(2,55,btype='highpass',fs=SR,output='sos'),mix,axis=0)
mix=np.tanh(mix*1.3);mix*=.79/max(1e-12,np.abs(mix).max())
out=ROOT/'.cache';out.mkdir(exist_ok=True)
pcm=(mix*32767).astype('<i2')
with wave.open(str(out/'score.wav'),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(pcm.tobytes())
report={'duration':DUR,'sample_rate':SR,'bpm':96,'bars':24,'composition':'Between the Forces / 受力之间','original':True,'notes':len(events),'peak_dbfs':round(float(20*np.log10(np.abs(mix).max())),3),'rms_dbfs':round(float(20*np.log10(np.sqrt(np.mean(mix**2)))),3),'clipped_samples':int(np.sum(np.abs(mix)>=1)),'cues':[6.25,16.25,26.25,40,50,56.25,58.15],'events':events}
(ROOT/'references'/'score-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({k:v for k,v in report.items() if k!='events'},ensure_ascii=False))
