/* 轻绳与轻杆 · 受力之间. Deterministic 60-second Canvas film. */
(() => {
'use strict';
const W=1920,H=1080,DURATION=60,TAU=Math.PI*2;
const INK='#e8f0f8',BLUE='#18396d',MONO='Consolas, monospace',SANS='"Microsoft YaHei UI", "PingFang SC", sans-serif',HAND='KaiTi, STKaiti, serif',SERIF='Georgia, "Times New Roman", serif';
const $=id=>document.getElementById(id),canvas=$('film'),c=canvas.getContext('2d',{alpha:false});
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,u)=>a+(b-a)*u;
const phase=(t,a,b)=>clamp((t-a)/(b-a));
const smooth=u=>{u=clamp(u);return u*u*(3-2*u);};
const ease=u=>1-(1-clamp(u))**3;
const beat=.625,chapters=[0,6.25,16.25,26.25,40,50];
const names=['序 · 受力之间','01 · 绳的语言','02 · 杆的两面','03 · 铰接平衡','04 · 固定连接','05 · 一眼辨认'];
const state={time:0,playing:false,started:false,muted:false,volume:.65,exploring:false,angle:30,returnTime:0};
let seed=2305;const rand=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const paper=document.createElement('canvas');paper.width=W;paper.height=H;
const pc=paper.getContext('2d');
function makePaper(){
  const g=pc.createLinearGradient(0,0,W,H);g.addColorStop(0,'#142d59');g.addColorStop(.45,'#224985');g.addColorStop(1,'#173764');pc.fillStyle=g;pc.fillRect(0,0,W,H);
  for(let i=0;i<75;i++){const x=rand()*W,y=rand()*H,r=180+rand()*600;const g=pc.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${rand()>.5?'160,190,224':'5,19,49'},${.014+rand()*.03})`);g.addColorStop(1,'transparent');pc.fillStyle=g;pc.fillRect(x-r,y-r,2*r,2*r);}
  for(let i=0;i<12000;i++){pc.fillStyle=`rgba(208,225,242,${rand()*.045})`;pc.fillRect(rand()*W,rand()*H,.6+rand()*1.1,.5+rand()*1.5);}
  for(let y=0;y<H;y+=3){pc.fillStyle=`rgba(6,20,42,${rand()*.025})`;pc.fillRect(0,y,W,.55);}
  for(const x of [W/2]){pc.fillStyle='rgba(185,210,235,.035)';pc.fillRect(x-1,0,1,H);pc.fillStyle='rgba(5,20,45,.09)';pc.fillRect(x+1,0,2,H);}
  pc.fillStyle='rgba(210,225,240,.02)';pc.fillRect(0,540,W,1);
  const v=pc.createRadialGradient(960,510,300,960,510,1130);v.addColorStop(0,'transparent');v.addColorStop(1,'#06163070');pc.fillStyle=v;pc.fillRect(0,0,W,H);
}
makePaper();
let nibs=[];
function path(points,{u=1,w=2,a=1,dash=[],close=false,nib=true}={}){
  if(u<=0||points.length<2||a<=0)return;let pts=points;if(close)pts=[...points,points[0]];
  const lengths=pts.slice(1).map((p,i)=>Math.hypot(p[0]-pts[i][0],p[1]-pts[i][1]));
  let rest=lengths.reduce((x,y)=>x+y,0)*clamp(u);c.save();c.globalAlpha*=a;c.strokeStyle=INK;c.lineWidth=w;c.lineCap='round';c.lineJoin='round';c.setLineDash(dash);c.beginPath();c.moveTo(...pts[0]);let end=pts[0];
  for(let i=0;i<lengths.length;i++){const f=Math.min(1,rest/(lengths[i]||1));end=[lerp(pts[i][0],pts[i+1][0],f),lerp(pts[i][1],pts[i+1][1],f)];c.lineTo(...end);rest-=lengths[i];if(rest<=0)break;}c.stroke();c.restore();if(nib&&u>0&&u<1)nibs.push(end);
}
function circle(x,y,r,{u=1,w=2,a=1,fill=false,start=-Math.PI/2}={}){if(u<=0||a<=0)return;c.save();c.globalAlpha*=a;c.strokeStyle=INK;c.lineWidth=w;c.beginPath();c.arc(x,y,r,start,start+TAU*clamp(u));if(fill){c.fillStyle=BLUE;c.fill();}c.stroke();c.restore();}
function text(str,x,y,size=28,{u=1,a=1,font=SANS,weight=400,align='left',spacing=0}={}){
  if(u<=0||a<=0)return;c.save();c.globalAlpha*=a;c.fillStyle=INK;c.font=`${weight} ${size}px ${font}`;c.textAlign=align;c.textBaseline='alphabetic';c.letterSpacing=spacing+'px';
  if(u<1){const width=c.measureText(str).width,dx=align==='center'?-width/2:align==='right'?-width:0;c.beginPath();c.rect(x+dx-2,y-size*1.4,(width+5)*u,size*2);c.clip();}c.fillText(str,x,y);c.restore();
}
function math(str,x,y,size=42,o={}){text(str,x,y,size,{font:SERIF,...o});}
function box(x,y,w,h,{a=.6,u=1,double=false,fill=false}={}){
  if(fill){c.save();c.globalAlpha*=a;c.fillStyle='#102d58';c.fillRect(x,y,w,h);c.restore();}
  path([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],{u,a,w:1.2,close:true,nib:false});if(double)path([[x+5,y+5],[x+w-5,y+5],[x+w-5,y+h-5],[x+5,y+h-5]],{u,a:a*.6,w:.7,close:true,nib:false});
}
function hatch(x,y,w,h,{a=.4,u=1,spacing=12}={}){c.save();c.beginPath();c.rect(x,y,w,h);c.clip();for(let i=-h;i<w;i+=spacing)path([[x+i,y+h],[x+i+h,y]],{w:1,a:a*clamp(u*2-i/(w+h)),nib:false});c.restore();}
function arrow(p,q,{u=1,w=3.4,a=1,head=14,dash=[],label='',lx=0,ly=0,size=32}={}){
  if(u<=0||a<=0)return;const e=[lerp(p[0],q[0],ease(u)),lerp(p[1],q[1],ease(u))];path([p,e],{w,a,dash,nib:false});const an=Math.atan2(q[1]-p[1],q[0]-p[0]);path([[e[0]-head*Math.cos(an-.42),e[1]-head*Math.sin(an-.42)],e,[e[0]-head*Math.cos(an+.42),e[1]-head*Math.sin(an+.42)]],{w:w*.8,a,nib:false});if(label)math(label,q[0]+lx,q[1]+ly,size,{a:a*phase(u,.45,1)});
}
function lineLabel(s,x,y,u=1){text(s,x,y,18,{font:MONO,spacing:2,u,a:.7});}
function pin(x,y,r=12,u=1){circle(x,y,r,{u,w:2,fill:true});circle(x,y,3,{u,w:1.2});}
function wall(x,y0,y1,u=1,fixed=false){path([[x,y0],[x,y1]],{u,w:3});hatch(x-35,y0,35,y1-y0,{u,a:.45});if(fixed){box(x-16,(y0+y1)/2-40,32,80,{u,a:.9,fill:true});for(const y of [(y0+y1)/2-27,(y0+y1)/2+27])circle(x,y,3,{u});}}
function rope(a,b,{u=1,slack=0,alpha=1,braid=true}={}){
  const pts=Array.from({length:61},(_,i)=>{const f=i/60;return[lerp(a[0],b[0],f),lerp(a[1],b[1],f)+Math.sin(Math.PI*f)*slack];});path(pts,{u,w:3.4,a:alpha});
  if(braid&&slack<2){const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L;for(let i=16;i<L*u;i+=13){const k=i/L;path([[lerp(a[0],b[0],k)-nx*3-3*dx/L,lerp(a[1],b[1],k)-ny*3-3*dy/L],[lerp(a[0],b[0],k)+nx*3+3*dx/L,lerp(a[1],b[1],k)+ny*3+3*dy/L]],{w:.65,a:alpha*.6,nib:false});}}
}
function rod(a,b,{u=1,a:alpha=1,th=14,pins=true}={}){
  const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),nx=-dy/L*th/2,ny=dx/L*th/2;
  path([[a[0]+nx,a[1]+ny],[b[0]+nx,b[1]+ny],[b[0]-nx,b[1]-ny],[a[0]-nx,a[1]-ny]],{u,w:2.5,a:alpha,close:true});path([[a[0]-dx/L*35,a[1]-dy/L*35],[b[0]+dx/L*35,b[1]+dy/L*35]],{u,w:.8,a:alpha*.5,dash:[23,6,3,6],nib:false});if(pins){pin(...a,11,u);pin(...b,11,u);}
}
function mass(x,y,{u=1,a=1,label='G',size=90}={}){
  const w=size,h=size*.82;box(x-w/2,y,w,h,{a,u,fill:true});hatch(x-w/2+5,y+h*.68,w-10,h*.25,{a:.35*a,u,spacing:9});path([[x-13,y],[x-13,y-10],[x+13,y-10],[x+13,y]],{u,w:2,a});math(label,x,y+h*.55,32,{u,a,align:'center'});
}
function angleArc(x,y,r,a0,a1,{u=1,label='θ',lx=0,ly=0,a=.85}={}){
  if(u<=0)return;const pts=Array.from({length:49},(_,i)=>{const f=i/48;const an=lerp(a0,a1,f);return[x+r*Math.cos(an),y+r*Math.sin(an)];});path(pts,{u,w:1.3,a,nib:false});const mid=(a0+a1)/2;math(label,x+(r+20)*Math.cos(mid)+lx,y+(r+20)*Math.sin(mid)+ly,26,{u,a,align:'center'});
}
function note(n,lines,t0,t,x=140,y=747,w=650){
  const u=ease(phase(t,t0,t0+.35));if(u<=0)return;const h=lines.length===1?94:125;box(x,y,w,h,{a:.8,u,double:true,fill:true});path([[x+88,y+17],[x+88,y+h-17]],{a:.6,u,nib:false,w:1});text('NOTE',x+44,y+32,13,{font:MONO,align:'center',spacing:2,u});text(String(n).padStart(2,'0'),x+44,y+68,28,{font:MONO,align:'center',u});lines.forEach((s,i)=>text(s,x+113,y+42+i*39,25,{font:HAND,u:phase(t,t0+.06+i*.05,t0+.38+i*.05)}));path([[x,y+h],[x-15,y+h+15]],{a:.7,u,w:1,nib:false});
}
function sectionHead(num,tag,title,subtitle,t,start){
  text(num,1750,315,235,{font:MONO,align:'right',a:.065,u:phase(t,start,start+.6)});
  lineLabel(`FIG. ${num}   /   ${tag}`,140,181,phase(t,start,start+.5));
  text(title,135,285,68,{weight:300,u:ease(phase(t,start+.1,start+.8)),spacing:2});
  path([[140,321],[770,321]],{u:phase(t,start+.35,start+1),a:.55,w:1});
  if(subtitle)text(subtitle,140,366,23,{u:phase(t,start+.65,start+1.25),a:.7});
}
function sheetFurniture(t,id){
  const u=phase(t,0,1.25);box(42,42,W-84,H-84,{u,a:.35});box(52,52,W-104,H-104,{u,a:.6});
  for(let i=1;i<9;i++){const x=52+i*(W-104)/9;path([[x,42],[x,52]],{u,a:.6,w:.8,nib:false});path([[x,H-52],[x,H-42]],{u,a:.6,w:.8,nib:false});text(String(10-i),x-95,36,10,{font:MONO,a:.45,u});}
  for(let y=160;y<960;y+=170){path([[42,y],[52,y]],{a:.6,u,w:.8,nib:false});path([[W-52,y],[W-42,y]],{a:.6,u,w:.8,nib:false});}
  text('力 学 手 记',92,106,15,{u:phase(t,.2,1),spacing:5,a:.9});text('THE MECHANICS ATELIER  /  CONSTRAINT STUDIES',326,105,12,{font:MONO,u:phase(t,.3,1),spacing:1.6,a:.55});text('高中物理 · 必修一 · 3.5',1820,105,14,{align:'right',u:phase(t,.5,1.3),a:.75});
  path([[92,126],[1828,126]],{u:phase(t,.4,1.1),a:.4,w:.9,nib:false});
  text('IDEAL MODELS · MASSLESS MEMBERS · STATIC EQUILIBRIUM',95,994,11,{font:MONO,a:.5,spacing:1.2,u:phase(t,.7,1.5)});
  text('轻 = 质量、自重忽略',95,966,17,{font:HAND,a:.75,u:phase(t,.7,1.5)});
  box(1442,930,385,76,{a:.5,u:phase(t,.8,1.6)});path([[1442,958],[1827,958]],{w:.7,a:.4,nib:false});path([[1665,958],[1665,1006]],{w:.7,a:.4,nib:false});
  text('DRAWING  /  轻绳与轻杆',1455,949,11,{font:MONO,a:.65});text('PHYSICS 03.5',1455,989,20,{font:MONO});text(`${String(id).padStart(2,'0')} / 05`,1680,989,20,{font:MONO,a:.8});
}
function crosshair(x,y,a=.35,r=22){path([[x-r,y],[x+r,y]],{w:.8,a,nib:false});path([[x,y-r],[x,y+r]],{w:.8,a,nib:false});}
function labelCallout(from,to,title,sub,u=1){path([from,[to[0]-20,to[1]],to],{u,w:1.1,a:.7});circle(...from,3,{u,w:1});text(title,to[0]+12,to[1]+6,21,{u,font:HAND});if(sub)text(sub,to[0]+12,to[1]+30,12,{font:MONO,u,a:.55});}
function dimension(a,b,offset,label,u=1){
  if(u<=0)return;const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
  const p=[a[0]+nx*offset,a[1]+ny*offset],q=[b[0]+nx*offset,b[1]+ny*offset];
  path([a,[p[0]+nx*8,p[1]+ny*8]],{u,w:.7,a:.4,nib:false});path([b,[q[0]+nx*8,q[1]+ny*8]],{u,w:.7,a:.4,nib:false});
  arrow(p,q,{u,w:.8,a:.5,head:8});arrow(q,p,{u,w:.8,a:.5,head:8});
  text(label,(p[0]+q[0])/2,(p[1]+q[1])/2-11,15,{font:MONO,align:'center',u,a:.65});
}
function flow(a,b,t,start,end,{reverse=false,alpha=.9}={}){
  if(t<start||t>end)return;const p=reverse?b:a,q=reverse?a:b;const f=((t-start)/1.25)%1,len=.12;
  const lo=Math.max(0,f-len),hi=Math.min(1,f);path([[lerp(p[0],q[0],lo),lerp(p[1],q[1],lo)],[lerp(p[0],q[0],hi),lerp(p[1],q[1],hi)]],{w:5,a:alpha*Math.sin(Math.PI*f),nib:false});
}
function ropeSag(span,length){
  if(span>=length)return 0;let lo=0,hi=length;
  for(let k=0;k<25;k++){const h=(lo+hi)/2;let len=0;for(let i=1;i<=60;i++)len+=Math.hypot(span/60,h*(Math.sin(Math.PI*i/60)-Math.sin(Math.PI*(i-1)/60)));if(len>length)hi=h;else lo=h;}
  return(lo+hi)/2;
}
function intro(t){
  lineLabel('CONSTRAINT STUDY  003.5',140,233,phase(t,.7,1.4));
  text('轻绳',132,391,138,{weight:300,u:ease(phase(t,.8,1.9)),spacing:8});text('与',428,387,54,{font:HAND,a:.7,u:phase(t,1.5,2)});text('轻杆',490,391,138,{weight:300,u:ease(phase(t,1.4,2.4)),spacing:8});
  path([[140,434],[790,434]],{u:phase(t,1.6,2.5),a:.7,w:1.8});path([[140,441],[790,441]],{u:phase(t,1.7,2.6),a:.3,w:.7});
  text('受 力 之 间',140,513,42,{font:HAND,u:phase(t,2,2.8),spacing:5});text('一根只能拉，一根还能推。',140,585,27,{u:phase(t,2.6,3.3),a:.75});
  text('A STUDY IN TENSION & COMPRESSION',141,638,14,{font:MONO,spacing:2,u:phase(t,2.9,3.5),a:.55});
  const A=[1050,293],B=[1050,674],O=[1630,674];
  crosshair(...O,.4,70);wall(1050,266,870,phase(t,1.2,2));rope(A,O,{u:phase(t,1.7,2.8)});rod(B,O,{u:phase(t,2.2,3.2)});pin(...A,10,phase(t,2,2.8));rope(O,[1630,809],{u:phase(t,2.8,3.3)});mass(1630,820,{u:phase(t,3,3.7),size:100});
  labelCallout([1360,497],[1435,317],'轻绳','TENSION ONLY',phase(t,3.2,3.9));labelCallout([1330,674],[1190,787],'轻杆','TENSION / COMPRESSION',phase(t,3.65,4.4));
  flow(A,O,t,3.25,6.25);dimension(B,O,68,'L',phase(t,4.1,4.7));
  angleArc(...O,75,Math.PI,Math.PI+Math.atan2(381,580),{label:'θ',u:phase(t,3.5,4.2)});
  note(0,['从连接方式，读出力的方向。'],4.3,t,140,733,650);
}
function ropeScene(t){
  const st=6.25,d=t-st;sectionHead('01','THE LANGUAGE OF ROPE','绳，只会拉。','轻绳：质量忽略，张力沿绳的方向。',t,st);
  const slack=smooth(phase(d,5,6.5));
  math(slack<.5?'T > 0':'T = 0',145,538,100,{u:phase(d,1.3,2),a:.96});
  text(slack<.5?'绷紧 · 产生拉力':'松弛 · 张力归零',147,603,30,{font:HAND,u:phase(d,1.7,2.5)});
  const x=lerp(1590,1435,slack),y=488,A=[1010,y],B=[x,y];
  wall(1010,326,792,phase(d,.25,1));pin(...A,12,phase(d,.8,1.3));
  path([[1040,y],[1720,y]],{u:phase(d,.5,1.5),w:.9,a:.25,dash:[25,6,3,6],nib:false});
  const sag=ropeSag(x-A[0],580);rope(A,B,{u:phase(d,.7,1.8),slack:sag});
  box(x,y-48,105,96,{a:1,u:phase(d,1,1.8),fill:true});hatch(x+5,y+18,94,24,{u:phase(d,1.3,2),a:.35});math('B',x+53,y+11,32,{align:'center',u:phase(d,1.5,2)});
  const focus=[x+53,y];arrow(focus,[x-140,y],{u:phase(d,2.2,2.8),a:1-slack,label:'T',ly:-23,lx:50});arrow(focus,[x+218,y],{u:phase(d,2.2,2.8),a:1-slack,label:'F',ly:-23,lx:-40});
  text('研究对象：B · 仅画水平方向受力',1100,304,19,{font:HAND,u:phase(d,2,2.6),a:.8});path([[1210,313],[x+53,410]],{u:phase(d,2.3,3),w:.8,a:.4,nib:false});
  path([[1410,554],[1780,554]],{u:phase(d,1.4,2),w:1,a:.35,nib:false});for(const cx of [x+25,x+80])circle(cx,545,8,{u:phase(d,1.4,2),w:1.2,a:.6});
  flow(A,B,d,2,4.8,{reverse:true});
  text('A',975,478,24,{font:SERIF,u:phase(d,1,1.5)});
  const u=phase(d,2.8,3.4);path([[1060,717],[1560,717]],{u,a:.45,w:1,nib:false});for(let i=0;i<6;i++)path([[1080+i*88,709],[1080+i*88,725]],{u,w:1,a:.5,nib:false});
  text('TAUT',1070,760,14,{font:MONO,a:.55,u});text('SLACK',1510,760,14,{font:MONO,a:.55,u});circle(1080+440*slack,717,5,{u,w:1.4});
  if(slack>.3)labelCallout([(1010+x)/2,488+sag],[1320,817],'绳不能“推”物体','NO COMPRESSION',phase(d,6.3,7));
  note(1,d<5?['拉力从物体出发，沿绳指向另一端。']:['两端靠近，绳松弛。','绳不能传递压力。'],d<5?3.1:5.6,t-st);
}
function rodScene(t){
  const st=16.25,d=t-st;sectionHead('02','TWO FACES OF A ROD','杆，能拉也能推。','先看约束，再决定弹力的方向。',t,st);
  text('二力杆',143,481,62,{font:HAND,u:phase(d,1,1.7)});
  const rules=['轻杆 · 两端受力','铰接 · 静力平衡'];rules.forEach((s,i)=>text(s,146,548+i*43,26,{u:phase(d,1.6+i*.4,2.3+i*.4),a:.8}));
  math('F  ∥  AB',145,677,43,{u:phase(d,3.1,3.8)});
  const x0=1090,x1=1580;
  for(let i=0;i<2;i++){const y=370+i*298,when=i?3.75:.7,u=phase(d,when,when+1);rod([x0,y],[x1,y],{u,th:21});
    const target=lerp(100,150,(.5+.5*Math.sin(d*1.8))*phase(d,6.2,7));
    arrow([x0,y],[x0+(i?target:-target),y],{u:phase(d,when+1.1,when+1.7),label:'F',lx:25,ly:-22});
    arrow([x1,y],[x1+(i?-target:target),y],{u:phase(d,when+1.1,when+1.7),label:'F',lx:i?-30:-40,ly:-22});
    text(i?'受压 · 两端向内推':'受拉 · 两端向外拉',1335,y+89,30,{align:'center',font:HAND,u:phase(d,when+1.5,when+2.2)});
    text(i?'COMPRESSION':'TENSION',1335,y+121,13,{align:'center',font:MONO,spacing:3,a:.55,u:phase(d,when+1.7,when+2.3)});
  }
  text('研究对象：杆自身',1090,262,20,{font:HAND,u:phase(d,.6,1.3),a:.8});
  dimension([1090,370],[1580,370],-66,'AB = L',phase(d,2.8,3.4));
  note(2,['只有两端受力的铰接轻杆，','才可直接沿杆画力。'],6.3,d);
}
function equilibrium(theta=30){const rad=theta*Math.PI/180;return{theta,T:1/Math.sin(rad),N:1/Math.tan(rad),G:1};}
function triangle(x,y,scale,theta,u=1,{labels=true}={}){
  const f=equilibrium(theta),p=[x,y],q=[x,y+scale],r=[x+scale*f.N,y+scale];
  arrow(p,q,{u:clamp(u*3),w:2,head:9});arrow(q,r,{u:clamp(u*3-1),w:2,head:9});arrow(r,p,{u:clamp(u*3-2),w:2,head:9});
  if(labels){math('G',x-25,y+scale*.65,20,{u:clamp(u*3),a:.8});math('N',x+scale*f.N*.5,y+scale+26,20,{u:clamp(u*3-1),a:.8,align:'center'});math('T',x+scale*f.N*.56+8,y+scale*.42,20,{u:clamp(u*3-2),a:.8});}
  if(u>.9)circle(...p,5,{u:phase(u,.9,1),w:1});
}
function hingeScene(t,exploring=false){
  const st=26.25,d=exploring?12.8:t-st,theta=exploring?state.angle:(d<9?30:lerp(30,22,smooth(phase(d,9,10.6)))+8*smooth(phase(d,11.3,12.6))),f=equilibrium(theta);
  sectionHead('03','HINGED CONNECTION','三力，恰好闭合。','水平铰接杆 + 斜绳 + 静止的重物',t,exploring?t-12:st);
  const span=Math.min(440,300/Math.tan(theta*Math.PI/180)),bx=1390-span;
  const A=[bx,615-span*Math.tan(theta*Math.PI/180)],B=[bx,615],O=[1390,615];
  const u=phase(d,.2,1.3),ghost=lerp(1,.3,phase(d,2.1,3.1));
  c.save();c.globalAlpha=ghost;wall(bx,Math.min(285,A[1]-30),880,u);rope(A,O,{u:phase(d,.5,1.3)});rod(B,O,{u:phase(d,.8,1.7),th:17});pin(...A,11,u);rope(O,[1390,794],{u:phase(d,1,1.7)});mass(1390,810,{u:phase(d,1.2,1.9),label:'G',size:84});text('A',bx-30,A[1]-20,23,{font:SERIF,u});text('B',bx-30,B[1]+30,23,{font:SERIF,u});c.restore();
  angleArc(...O,90,Math.PI,Math.PI+theta*Math.PI/180,{u:phase(d,1.5,2.1),label:`${theta.toFixed(!exploring&&d>=9?1:0)}°`,ly:4});
  const forceScale=98,au=phase(d,2.4,3.2);arrow(O,[O[0]-forceScale*f.N,O[1]-forceScale],{u:au,label:'T',lx:-36,ly:-12});arrow(O,[O[0]+forceScale*f.N,O[1]],{u:phase(d,3,3.7),label:'N',lx:15,ly:12});arrow(O,[O[0],O[1]+forceScale],{u:phase(d,3.6,4.3),label:'G',lx:18,ly:4});pin(...O,8,au);text('O',1407,593,26,{font:SERIF,u:au});
  text('研究对象：结点 O',1090,286,22,{font:HAND,u:phase(d,2,2.7)});path([[1230,305],[1327,472]],{u:phase(d,2.4,3),a:.45,w:1,nib:false});
  lineLabel('ΣF = 0',1604,322,phase(d,4.5,5.1));
  if(d>4.4&&d<6.4){const move=smooth(phase(d,4.4,6.4));const to=[1610,360],anchor=[lerp(O[0],to[0],move),lerp(O[1],to[1],move)],s=lerp(forceScale,82,move);
    const gp=anchor,gq=[anchor[0],anchor[1]+s],nr=[anchor[0]+s*f.N,anchor[1]+s];
    const np=[lerp(anchor[0],gq[0],move),lerp(anchor[1],gq[1],move)];
    const nt=[np[0]+s*f.N,np[1]],tp=[lerp(anchor[0],nr[0],move),lerp(anchor[1],nr[1],move)];
    arrow(gp,gq,{w:1.3,a:.32,head:8});arrow(np,nt,{w:1.3,a:.32,head:8});arrow(tp,[tp[0]-s*f.N,tp[1]-s],{w:1.3,a:.32,head:8});
  }
  triangle(1610,360,82,theta,phase(d,5.7,6.7));
  text('力矢量首尾相接',1600,518,17,{font:HAND,u:phase(d,5.6,6.3),a:.7});
  math('T sinθ = G',146,465,44,{u:phase(d,4.4,5.1)});math('N = T cosθ',146,530,44,{u:phase(d,5.1,5.8)});
  path([[144,566],[716,566]],{u:phase(d,5.5,6),a:.4,w:1});
  if(exploring){math(`T = ${f.T.toFixed(2)}G`,146,644,62,{u:1});math(`N = ${f.N.toFixed(2)}G`,146,710,46);text(`θ = ${theta}°`,687,703,24,{font:MONO,align:'right',a:.65});}
  else if(d<9){math('T = 2G',146,648,72,{u:phase(d,6.1,6.9)});math('N = √3G',146,714,46,{u:phase(d,6.8,7.4)});}
  else{math(`T = ${f.T.toFixed(2)}G`,146,648,65);math(`N = ${f.N.toFixed(2)}G`,146,714,46);}
  if(d>9||exploring){box(1438,755,350,112,{a:.55,u:phase(d,9,9.45),fill:true});text('θ  /  与水平的夹角',1458,785,16,{font:HAND,u:phase(d,9.05,9.5),a:.7});math(`${theta.toFixed(0)}°`,1458,839,44,{u:phase(d,9.1,9.6)});text(`T/G = ${f.T.toFixed(2)}`,1578,834,20,{font:MONO,u:phase(d,9.1,9.6)});}
  flow(A,O,d,1.7,4.2);flow(B,O,d,3,4.2);
  note(3,exploring?['逐个比较静态平衡态。','θ 越小，T 与 N 都越大。']:d<9?['30° 时，斜绳拉力是重力的两倍。']:['斜绳越平，T 与 N 越大。','图中箭头按实际比例变化。'],exploring?0:d<9?7.7:9,d,140,771,650);
  text('二力杆对 O 的支持力沿杆向右',1490,910,20,{font:HAND,u:phase(d,7.2,7.9),a:.7,align:'center'});
}
function fixedScene(t){
  const st=40,d=t-st;sectionHead('04','RIGID CONNECTION','固定杆，方向未必沿杆。','同一根轻绳，跨过理想光滑轻滑轮。',t,st);
  const O=[1400,600],B=[965,600],r=29,P=[O[0]+r*.5,O[1]-r*Math.sqrt(3)/2],A=[965,P[1]-(P[0]-965)*Math.tan(Math.PI/6)];
  const ghost=lerp(1,.3,phase(d,2.2,3));c.save();c.globalAlpha=ghost;wall(965,290,873,phase(d,.2,1));
  box(949,560,32,80,{u:phase(d,.5,1.2),a:1,fill:true});hatch(950,563,28,74,{u:phase(d,.5,1.2),a:.6,spacing:8});rod(B,O,{u:phase(d,.6,1.4),th:20,pins:false});circle(...O,r,{u:phase(d,.9,1.6),w:2.5,fill:true});circle(...O,r-7,{u:phase(d,1,1.7),w:.9});pin(...O,4,phase(d,1,1.7));
  rope(A,P,{u:phase(d,1.2,2)});const arc=Array.from({length:40},(_,i)=>{const a=-Math.PI/3+Math.PI/3*i/39;return[O[0]+r*Math.cos(a),O[1]+r*Math.sin(a)];});path(arc,{u:phase(d,1.7,2.2),w:3.5});rope([1429,600],[1429,787],{u:phase(d,1.9,2.4)});mass(1429,802,{u:phase(d,2,2.7),size:84});pin(...A,9,phase(d,1.2,2));c.restore();
  const v=160;arrow(O,[O[0]-v*Math.sqrt(3)/2,O[1]-v*.5],{u:phase(d,2.7,3.3),label:'T₁',lx:-45,ly:-14});arrow(O,[O[0],O[1]+v],{u:phase(d,3.1,3.7),label:'T₂',lx:14,ly:0});
  arrow(O,[O[0]+v*Math.sqrt(3)/2,O[1]-v*.5],{u:phase(d,4.2,4.9),label:'R',lx:17,ly:-8,w:4});pin(...O,7,phase(d,2.7,3.3));text('O',1376,629,25,{font:SERIF,u:phase(d,3,3.5)});
  path([O,[1700,600]],{u:phase(d,4,4.6),a:.35,w:1,dash:[22,6,3,6],nib:false});angleArc(...O,102,-Math.PI/6,0,{u:phase(d,5,5.6),label:'30°',ly:-4});angleArc(...O,61,Math.PI*7/6,Math.PI*5/2,{u:0});
  text('研究对象：轻滑轮 O',1090,285,22,{font:HAND,u:phase(d,2,2.7)});text('固定连接可传递力矩',1000,857,20,{font:HAND,u:phase(d,5.2,5.9),a:.7});flow(A,P,d,2.1,3.8);flow([1429,787],[1429,600],d,2.1,3.8);
  math('T₁ = T₂ = G',145,475,60,{u:phase(d,3.3,4)});text('两段绳夹角为 120°',146,535,25,{font:HAND,u:phase(d,4.3,4.9),a:.8});math('R = G',145,647,93,{u:phase(d,5,5.8)});text('斜向右上，与水平成 30°',148,705,26,{u:phase(d,5.5,6.2),font:HAND});
  lineLabel('ΣF = 0',1630,322,phase(d,5,5.6));const p=[1680,360],q=[1615,322.5],z=[1615,397.5];arrow(p,q,{u:phase(d,5.3,5.8),w:2,head:9});arrow(q,z,{u:phase(d,5.6,6.1),w:2,head:9});arrow(z,p,{u:phase(d,5.9,6.4),w:2,head:9});text('闭合',1700,394,16,{font:HAND,u:phase(d,6.2,6.7)});
  note(4,['“轻”只忽略质量。','固定杆的力，不能直接沿杆画。'],6.5,d,140,771,650);
}
function replacementScene(t){
  const st=50,d=t-st;sectionHead('05','READ THE CONSTRAINT','能否换绳？','看它承受拉力，还是压力。',t,st);
  const A=[1030,302],C=[1030,814],B=[1500,555];wall(1030,270,887,phase(d,.1,.7));
  const switchU=phase(d,1.5,2.2);if(switchU<1)rod(A,B,{u:phase(d,.3,.8),a:1-switchU,th:16});rope(A,B,{u:switchU});rod(C,B,{u:phase(d,.55,1),th:16});pin(...A,10,1);pin(...C,10,1);pin(...B,11,1);rope(B,[1500,766],{u:phase(d,.8,1.3)});mass(1500,780,{u:phase(d,1,1.5),size:84});
  const horizontal=150/((555-302)/470+(814-555)/470);
  arrow(B,[B[0]-horizontal,B[1]-horizontal*(555-302)/470],{u:phase(d,1.1,1.7),w:3,label:'拉',lx:-28,ly:-14,size:23});arrow(B,[B[0]+horizontal,B[1]-horizontal*(814-555)/470],{u:phase(d,1.7,2.3),w:3,label:'推',lx:15,ly:-5,size:23});arrow(B,[1500,705],{u:phase(d,1.3,1.9),w:3,label:'G',lx:17,ly:0});
  text('AB',1090,356,22,{font:MONO,u:phase(d,.7,1)});text('CB',1090,785,22,{font:MONO,u:phase(d,.7,1)});
  text('拉杆 → 轻绳',145,494,54,{font:HAND,u:phase(d,1,1.7)});text('保持绷紧，可替代',146,544,25,{u:phase(d,1.5,2.1),a:.7});
  text('压杆不能换绳',145,656,54,{font:HAND,u:phase(d,2,2.7)});text('绳不能提供支持所需的推力',146,706,25,{u:phase(d,2.4,3.1),a:.7});
  note(5,['先判连接，再画受力。','最后检验：合力是否为零。'],3.3,d,140,771,650);
}
function finalScene(t){
  const d=t-56.25;const titleU=phase(d,0,.6);
  text('DRAWING COMPLETE  /  THE NATURE OF CONSTRAINTS',960,212,18,{font:MONO,spacing:2,u:titleU,a:.7,align:'center'});
  text('轻绳与轻杆',960,347,105,{align:'center',weight:300,spacing:12,u:ease(titleU)});
  text('连接方式，写好了力的方向。',960,419,31,{font:HAND,align:'center',u:phase(d,.3,.9),a:.8});
  const xs=[410,960,1510],u=phase(d,.2,1.1);
  for(const x of [685,1235])path([[x,500],[x,790]],{u,w:.8,a:.3,nib:false});
  rope([270,582],[550,582],{u});arrow([410,582],[310,582],{u:phase(d,.5,1.1),w:2.5});arrow([410,582],[510,582],{u:phase(d,.5,1.1),w:2.5});
  rod([820,582],[1100,582],{u,th:16});arrow([820,582],[865,582],{u:phase(d,.7,1.3),w:2.4});arrow([1100,582],[1055,582],{u:phase(d,.7,1.3),w:2.4});
  wall(1370,520,648,u);rod([1370,584],[1595,584],{u,pins:false,th:16});box(1359,561,22,46,{u,a:.9});arrow([1595,584],[1688,534],{u:phase(d,.9,1.5),w:2.8});
  ['绳只能拉','二力杆沿杆','固定杆先分析'].forEach((s,i)=>{text(s,xs[i],711,35,{align:'center',font:HAND,u:phase(d,.6+i*.1,1.3+i*.1)});text(['TAUT ROPE','TWO-FORCE MEMBER','RIGID CONNECTION'][i],xs[i],754,12,{align:'center',font:MONO,spacing:2,a:.55,u:phase(d,.9+i*.1,1.4+i*.1)});});
  path([[250,815],[1670,815]],{u:phase(d,.9,1.6),w:1,a:.4});math('ΣF = 0',960,895,56,{align:'center',u:phase(d,1.1,1.7)});
  if(d>1.9){const p=ease(phase(d,1.9,2.08));c.save();c.translate(1645,866);c.rotate(-.11);c.scale(1.12-.12*p,1.12-.12*p);c.globalAlpha=p;c.strokeStyle='#c56351';c.fillStyle='#c56351';c.lineWidth=3;c.strokeRect(-113,-32,226,64);c.lineWidth=1;c.strokeRect(-106,-25,212,50);c.font=`600 27px ${HAND}`;c.textAlign='center';c.fillText('平 衡 已 验',0,10);c.restore();}
}
function render(time){
  const t=clamp(time,0,60);nibs=[];c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.drawImage(paper,0,0);
  // Paper-fixed construction grid is deliberately faint.
  for(let x=92;x<1840;x+=96)for(let y=174;y<940;y+=96)crosshair(x,y,.047,3);
  const id=state.exploring?3:Math.max(0,chapters.findLastIndex(x=>t>=x));
  const local=state.exploring?12:t-chapters[id];const z=1+.006*smooth(phase(local,1,8));c.save();c.translate(960,540);c.scale(z,z);c.translate(-960,-540);
  sheetFurniture(t,id);
  if(state.exploring)hingeScene(t,true);else if(t<6.25)intro(t);else if(t<16.25)ropeScene(t);else if(t<26.25)rodScene(t);else if(t<40)hingeScene(t);else if(t<50)fixedScene(t);else if(t<56.25)replacementScene(t);else finalScene(t);
  for(const [x,y] of nibs){c.save();c.fillStyle='#f5faff';c.globalAlpha=.75;c.beginPath();c.arc(x,y,2,0,TAU);c.fill();c.restore();}
  c.restore();return{time:t,chapter:id,theta:state.angle};
}
const score=$('score');score.volume=state.volume;
function setPlayVisuals(){ $('playGlyph').textContent=state.playing?'Ⅱ':'▶';$('play').setAttribute('aria-label',state.playing?'暂停':'播放');}
function formatTime(t){const s=Math.floor(t);return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function refresh(){
  $('seek').value=state.time;$('seek').style.setProperty('--progress',state.time/60*100+'%');$('current').textContent=formatTime(state.time);
  const id=Math.max(0,chapters.findLastIndex(x=>state.time>=x));$('now').textContent=names[id];document.querySelectorAll('.chapter').forEach((el,i)=>{el.classList.toggle('active',i===id);if(i===id)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  setPlayVisuals();
}
function syncAudio(){if(Number.isFinite(score.duration)&&Math.abs(score.currentTime-state.time)>.16)score.currentTime=Math.min(state.time,59.999);}
async function play(){
  if(state.exploring)returnFilm(false);if(state.time>=59.99)state.time=0;state.started=true;state.playing=true;$('gate').hidden=true;$('soundHint').hidden=true;
  syncAudio();try{await score.play();}catch(e){$('soundHint').textContent='请点击配乐按钮开启声音';$('soundHint').hidden=false;}last=performance.now();refresh();
}
function pause(){state.playing=false;score.pause();refresh();}
function seek(t){state.time=clamp(t,0,60);syncAudio();render(state.time);refresh();}
function toggle(){state.playing?pause():play();}
function setMuted(m){state.muted=m;score.muted=m;$('music').setAttribute('aria-pressed',String(m));$('music').setAttribute('aria-label',m?'开启背景音乐':'静音背景音乐');$('musicText').textContent=m?'静音':'配乐';}
function returnFilm(resume=false){state.exploring=false;$('labControls').hidden=true;$('explore').hidden=false;$('explore').setAttribute('aria-pressed','false');$('exploreBadge').hidden=true;document.querySelector('.lab').classList.remove('exploring');seek(state.returnTime);if(resume)play();}
$('start').addEventListener('click',play);$('play').addEventListener('click',toggle);$('restart').addEventListener('click',()=>{if(state.exploring)returnFilm();seek(0);play();});
$('seek').addEventListener('input',e=>{if(state.exploring)returnFilm();seek(+e.target.value);});
document.querySelectorAll('.chapter').forEach(el=>el.addEventListener('click',()=>{if(state.exploring)returnFilm();state.started=true;$('gate').hidden=true;$('soundHint').hidden=true;seek(+el.dataset.time);}));
$('music').addEventListener('click',()=>{setMuted(!state.muted);if(state.playing&&!state.muted)score.play().catch(()=>{});});
$('volume').addEventListener('input',e=>{state.volume=+e.target.value;score.volume=state.volume;setMuted(state.volume===0);});
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await $('stage').requestFullscreen();}catch(e){$('fullscreen').title='此浏览器未允许全屏，请按 F11';}}
$('fullscreen').addEventListener('click',fullscreen);
$('explore').addEventListener('click',()=>{state.returnTime=state.time;pause();state.exploring=true;state.started=true;$('gate').hidden=true;$('soundHint').hidden=true;$('explore').hidden=true;$('labControls').hidden=false;$('exploreBadge').hidden=false;$('explore').setAttribute('aria-pressed','true');document.querySelector('.lab').classList.add('exploring');render(39);});
$('angle').addEventListener('input',e=>{state.angle=+e.target.value;$('angleValue').textContent=state.angle+'°';render(39);});$('returnFilm').addEventListener('click',()=>returnFilm());
$('transcriptToggle').addEventListener('click',()=>{const h=$('transcript').hidden;$('transcript').hidden=!h;$('transcriptToggle').setAttribute('aria-expanded',String(h));$('transcriptToggle').textContent=h?'收起讲解稿 −':'阅读讲解稿 ＋';});
document.addEventListener('keydown',e=>{if(/INPUT|BUTTON/.test(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();toggle();}else if(e.key==='ArrowRight'){e.preventDefault();if(state.exploring)returnFilm();seek(state.time+5);}else if(e.key==='ArrowLeft'){e.preventDefault();if(state.exploring)returnFilm();seek(state.time-5);}else if(e.key.toLowerCase()==='m')setMuted(!state.muted);else if(e.key.toLowerCase()==='r'){if(state.exploring)returnFilm();seek(0);play();}else if(e.key.toLowerCase()==='f')fullscreen();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.playing)pause();});
score.addEventListener('ended',()=>{state.time=60;pause();render(60);});
let last=performance.now(),lastFrame=-1,rafCount=0;
function tick(now){const dt=Math.min(.15,(now-last)/1000);last=now;if(state.playing){state.time=Math.min(60,state.time+dt);const f=Math.floor(state.time*24);if(f!==lastFrame){render(f/24);lastFrame=f;}if(++rafCount%4===0)refresh();if(rafCount%60===0)syncAudio();if(state.time>=60){pause();render(60);}}requestAnimationFrame(tick);}
// Deterministic renderer for checks and poster capture, without advancing audio.
window.render=t=>{pause();state.exploring=false;$('gate').hidden=true;$('soundHint').hidden=true;seek(t);return render(t);};
window.PHYSICS={equilibrium,fixedPulley:{theta:30,T1:1,T2:1,R:1,ropeAngle:120,reactionAngle:30}};window.FILM={duration:60,fps:24,chapters,state,getAudio:()=>({time:score.currentTime,paused:score.paused,muted:score.muted,volume:score.volume,duration:score.duration,ready:score.readyState})};
const query=new URLSearchParams(location.search);if(query.has('t')){state.time=clamp(+query.get('t'));$('gate').hidden=true;$('soundHint').hidden=true;}
if(query.has('clean')){document.body.classList.add('clean');const style=document.createElement('style');style.textContent='html,body{background:#17376b;overflow:hidden}.app{width:100vw!important;padding:0!important}.masthead,.transport,.lab,footer,article,.gate,.sound-hint{display:none!important}.player{border:0;box-shadow:none}.stage{width:100vw;height:100vh;aspect-ratio:auto}';document.head.appendChild(style);}
  render(state.time||4.25);refresh();window.READY=true;window.DUR=DURATION;requestAnimationFrame(tick);
})();
