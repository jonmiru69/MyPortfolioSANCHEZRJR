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
 await page.goto(base+'/#/certificates');await page.locator('.certificate-record').waitFor();
 for(let n=1;n<=3;n++){
  if(n>1)await page.locator('#cert-next').click();
  await page.waitForFunction(()=>[...document.querySelectorAll('.certificate-information dl > div')].every(el=>el.classList.contains('is-visible')));
  assert.equal(await page.locator('.certificate-record').count(),1);
  assert.equal(await page.locator('.certificate-information dl > div.reveal.is-visible').count(),8);
  assert.match(await page.locator('.certificate-information dl > div').first().evaluate(el=>getComputedStyle(el).animationName),/editorial-rise/);
  const bottom=await page.locator('.certificate-pagination').evaluate(el=>el.getBoundingClientRect().bottom);
  assert.ok(bottom<=900,`page ${n} controls below fold: ${bottom}`);
 }
 await page.waitForTimeout(1000);await page.screenshot({path:out+'/certificates-desktop.png'});
 await page.setViewportSize({width:1366,height:768});assert.ok(await page.locator('.certificate-pagination').evaluate(el=>el.getBoundingClientRect().bottom)<=768,'laptop pagination below fold');await page.screenshot({path:out+'/certificates-laptop.png'});await page.setViewportSize({width:1440,height:900});
 await page.locator('.certificate-image-button').click();await page.locator('.document-viewer.is-fit-page').waitFor();
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
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/#/certificates');await page.locator('.certificate-record').waitFor();await page.locator('#cert-next').click();assert.equal(await page.locator('.certificate-information dl > div').first().evaluate(el=>getComputedStyle(el).animationName),'none');
 assert.deepEqual(errors,[]);console.log('PASS balanced 480px portrait; all eight fields animate on certificate pages 1–3; desktop pagination fits 900px; fit-page viewer and multi-page navigation; responsive routes; reduced motion; no uncaught errors');
}finally{await browser.close();await new Promise(r=>server.close(r));}
