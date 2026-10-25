/* Set PLAYWRIGHT_CORE_PATH to a playwright-core installation before running. */
const fs=require('fs'),path=require('path'),assert=require('assert');
const {pathToFileURL}=require('url');
const {chromium}=require(process.env.PLAYWRIGHT_CORE_PATH||'playwright-core');
const root=path.resolve(__dirname,'..'),refs=path.join(root,'references');
const full=process.argv.includes('--full');
const browserPath=process.env.CHROMIUM_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe';
(async()=>{
 const browser=await chromium.launch({executablePath:browserPath,headless:true,args:['--autoplay-policy=no-user-gesture-required','--disable-background-timer-throttling']});
 const page=await browser.newPage({viewport:{width:1600,height:1150},deviceScaleFactor:1});
 const errors=[],remote=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))remote.push(r.url());});
 await page.goto(pathToFileURL(path.join(root,'index.html')).href);await page.waitForFunction(()=>window.READY);
 await page.locator('#film').screenshot({path:path.join(refs,'01-title.png')});
 const frames=[9.5,14.5,24,34.5,38,47,54.5,59.2];
 for(const t of frames){await page.evaluate(t=>window.render(t),t);await page.locator('#film').screenshot({path:path.join(refs,`frame-${String(t).replace('.','-')}.png`)});}
 await page.evaluate(()=>window.render(0));
 await page.locator('#play').click();await page.waitForTimeout(1200);
 const playing=await page.evaluate(()=>({time:FILM.state.time,playing:FILM.state.playing,audio:FILM.getAudio()}));
 assert(playing.playing&&playing.time>.8&&!playing.audio.paused);
 assert(playing.audio.duration>59.9&&playing.audio.duration<60.1);
 await page.locator('#play').click();const pauseAt=await page.evaluate(()=>FILM.state.time);await page.waitForTimeout(350);assert(Math.abs(await page.evaluate(()=>FILM.state.time)-pauseAt)<.01);
 await page.locator('#seek').evaluate(el=>{el.value=32;el.dispatchEvent(new Event('input',{bubbles:true}));});
 assert.equal(await page.evaluate(()=>FILM.state.time),32);
 await page.locator('[data-time="40"]').click();assert.equal(await page.evaluate(()=>FILM.state.time),40);
 await page.locator('#music').click();assert.equal(await page.evaluate(()=>FILM.getAudio().muted),true);
 await page.locator('#music').click();
 await page.locator('#volume').evaluate(el=>{el.value=.35;el.dispatchEvent(new Event('input',{bubbles:true}));});assert.equal(await page.evaluate(()=>FILM.getAudio().volume),.35);
 const eq=await page.evaluate(()=>PHYSICS.equilibrium(30));assert(Math.abs(eq.T-2)<1e-12&&Math.abs(eq.N-Math.sqrt(3))<1e-12);
 await page.locator('#explore').click();
 for(const angle of [20,30,65]){await page.locator('#angle').evaluate((el,v)=>{el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));},angle);assert.equal(await page.evaluate(()=>FILM.state.angle),angle);await page.locator('#film').screenshot({path:path.join(refs,`explore-${angle}.png`)});}
 await page.locator('#returnFilm').click();assert.equal(await page.evaluate(()=>FILM.state.exploring),false);assert.equal(await page.evaluate(()=>FILM.state.time),40);
 await page.locator('#transcriptToggle').click();assert.equal(await page.locator('#transcript').isVisible(),true);await page.locator('#transcriptToggle').click();
 await page.locator('#fullscreen').click();await page.waitForFunction(()=>!!document.fullscreenElement);await page.evaluate(()=>document.exitFullscreen());
 const allFrames=await page.evaluate(()=>{let n=0;for(let i=0;i<=1440;i++){window.render(i/24);n++;}return n;});assert.equal(allFrames,1441);
 const angleLabels=await page.evaluate(()=>{const ctx=document.getElementById('film').getContext('2d'),original=ctx.fillText,labels=[];ctx.fillText=function(s,...a){labels.push(String(s));return original.call(this,s,...a);};window.render(38);ctx.fillText=original;return labels;});assert(angleLabels.some(s=>/^24\.2°$/.test(s)));assert(!angleLabels.includes('30°'));
 await page.evaluate(()=>window.render(40));
 await page.locator('body').click({position:{x:15,y:10}});await page.keyboard.press('ArrowLeft');assert.equal(await page.evaluate(()=>FILM.state.time),35);await page.keyboard.press('m');assert.equal(await page.evaluate(()=>FILM.state.muted),true);await page.keyboard.press('m');
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.render(34.5));
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:path.join(refs,'mobile.png')});
 await page.setViewportSize({width:1600,height:1150});await page.evaluate(()=>window.render(34.5));await page.screenshot({path:path.join(refs,'desktop.png')});
 await page.context().setOffline(true);await page.reload();await page.waitForFunction(()=>window.READY);assert.equal(remote.length,0);
 if(full){await page.locator('#start').click();await page.waitForFunction(()=>FILM.state.time>=60,{},{timeout:75000});assert.equal(await page.evaluate(()=>FILM.state.playing),false);}
 const final=await page.evaluate(()=>({time:FILM.state.time,playing:FILM.state.playing,audio:FILM.getAudio()}));
 const report={date:'2026-10-25',browser:await browser.version(),offline:true,remoteRequests:remote.length,errors,checks:{playback:playing,paused:true,seek:true,chapters:true,mute:true,volume:true,physics30:eq,explore:[20,30,65],keyboard:true,fullscreen:true,transcript:true,mobileNoOverflow:true,renderedFrames:allFrames,angleLabelsAgree:true,full60SecondPlayback:full},final};
 fs.writeFileSync(path.join(refs,'verification.json'),JSON.stringify(report,null,2));assert.deepEqual(errors,[]);
 console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
