import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import assert from 'node:assert/strict';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = resolve(import.meta.dirname, '..');
const out = resolve(root, '.test-results/revisions'); await mkdir(out, {recursive:true});
const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.pdf':'application/pdf'};
const server = createServer(async(req,res)=>{try{
 const pathname = new URL(req.url,'http://localhost').pathname;
 if(pathname==='/data/cloud.json'){res.setHeader('Content-Type','application/json');res.end('{"api_url":""}');return;}
 const f=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!f.startsWith(root+sep))return res.writeHead(403).end();
 res.setHeader('Content-Type',mime[extname(f)]||'application/octet-stream');res.end(await readFile(f));
}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.locator('.hero-name').waitFor();await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(1100);
 const geometry=await page.evaluate(()=>{const r=e=>document.querySelector(e).getBoundingClientRect();const p=r('.portrait-frame'),s=r('.hero-stage'),w=r('.hero-writing');return {portrait:p.width,offset:Math.abs((p.top+p.height/2)-(w.top+w.height/2)),share:p.width/s.width};});
 assert.ok(geometry.portrait>=450);assert.ok(geometry.offset<2);assert.ok(geometry.share>.33);
 assert.equal(await page.locator('.inquiry-feature h2').innerText(),'Research and thesis authored');
 await page.waitForTimeout(1000);await page.screenshot({path:out+'/overview-desktop.png'});
 await page.goto(base+'/#/certificates');await page.locator('.certificate-record').first().waitFor();
 const records=page.locator('.certificate-record');
 assert.ok(await records.count()>3);
 assert.equal(await page.locator('#cert-next').count(),0);
 const lastArtwork=records.last().locator('.certificate-art');
 assert.equal(await lastArtwork.evaluate(el=>el.classList.contains('is-visible')),false);
 await lastArtwork.scrollIntoViewIfNeeded();
 await records.last().locator('.certificate-art.reveal.is-visible').waitFor();
 assert.match(await lastArtwork.evaluate(el=>getComputedStyle(el).animationName),/editorial-rise/);
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:out+'/certificates-desktop.png'});
 await page.setViewportSize({width:1366,height:768});
 await page.screenshot({path:out+'/certificates-laptop.png'});
 await page.setViewportSize({width:1440,height:900});
 await page.locator('.certificate-image-button').first().click();await page.locator('.document-viewer.is-fit-page').waitFor();
 assert.equal(await page.locator('.document-viewer [download]').count(),0);
 await page.waitForFunction(()=>document.querySelector('.document-page')?.complete);
 assert.equal(await page.locator('.document-viewport').evaluate(el=>el.scrollHeight>el.clientHeight+2),false);
 await page.screenshot({path:out+'/certificate-fit-page.png'});
 await page.getByRole('button',{name:'Zoom in',exact:true}).click();assert.equal(await page.locator('.document-viewer.is-fit-page').count(),0);
 await page.getByRole('button',{name:'Fit page',exact:true}).click();await page.keyboard.press('Escape');
 await page.evaluate(async()=>{const {openLightbox}=await import('/js/render/lightbox.js');await openLightbox({file:'assets/docs/certificates/ai-class-asean.pdf',label:'AI Class ASEAN',preview_images:['assets/images/certificate-pages/ai-class-asean-1.webp','assets/images/certificate-pages/ai-class-asean-2.webp']});});
 await page.getByRole('button',{name:'Next document page',exact:true}).click();
 assert.equal(await page.locator('.document-page:not([hidden])').count(),1);assert.match(await page.locator('.viewer-page-count').innerText(),/2 of 2/);await page.keyboard.press('Escape');
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:900});
  for(const route of ['cover','certificates','profile','research','contact']){
   await page.goto(base+'/#/'+route);await page.locator('.page-view').waitFor();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${route} ${width}`);
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base);await page.locator('.hero-name').waitFor();await page.waitForTimeout(1000);await page.screenshot({path:out+'/overview-mobile.png'});
 assert.equal(await page.locator('.overview-contact-links').evaluate(el=>getComputedStyle(el).columnGap),'24px');
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/#/certificates');await page.locator('.certificate-record').first().waitFor();assert.equal(await page.locator('.certificate-information dl > div').first().evaluate(el=>getComputedStyle(el).animationName),'none');
 const theme=page.locator('#btn-toggle-theme');
 await theme.click();
 assert.equal(await theme.evaluate(el=>el.getAnimations().length),0);
 assert.equal(await page.locator('.is-revealing-theme').count(),0);
 await page.emulateMedia({reducedMotion:'no-preference'});
 const duringBounce=await theme.evaluate(el=>{
  const before=document.documentElement.dataset.theme;
  const {left,top,width,height}=el.getBoundingClientRect();
  el.click();
  return {sameTheme:before===document.documentElement.dataset.theme,duration:el.getAnimations()[0].effect.getTiming().duration,x:left+width/2,y:top+height/2};
 });
 assert.equal(duringBounce.sameTheme,true);
 assert.equal(duringBounce.duration,150);
 await page.waitForFunction(()=>document.getAnimations().some(a=>a.animationName==='theme-reveal'));
 const reveal=await page.evaluate(({x,y})=>{
  const root=document.documentElement;
  const [originX,originY]=root.style.getPropertyValue('--theme-reveal-origin').split(' ').map(parseFloat);
  const radius=parseFloat(root.style.getPropertyValue('--theme-reveal-radius'));
  return {
   centered:Math.abs(x-originX)<1 && Math.abs(y-originY)<1,
   coversViewport:radius>=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y)),
   oldViewVisible:getComputedStyle(root,'::view-transition-old(root)').animationName==='none',
   newViewClipped:getComputedStyle(root,'::view-transition-new(root)').clipPath.startsWith('circle('),
  };
 },duringBounce);
 assert.deepEqual(reveal,{centered:true,coversViewport:true,oldViewVisible:true,newViewClipped:true});
 await page.locator('.is-revealing-theme').waitFor({state:'detached'});
 assert.deepEqual(errors,[]);console.log('PASS scroll reveals, preview-only certificate viewer, responsive routes, theme bounce and ripple, reduced motion and no uncaught errors');
}finally{await browser.close();await new Promise(r=>server.close(r));}
