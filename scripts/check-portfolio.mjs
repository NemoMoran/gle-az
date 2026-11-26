import { chromium } from 'playwright-core'
import { readFile, mkdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import assert from 'node:assert/strict'
const require = createRequire(import.meta.url)
const axe = await readFile(require.resolve('axe-core/axe.min.js'),'utf8')
const browser = await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true})
const outDir=(process.env.SHOT_DIR ?? 'screenshots')+'/portfolio'
await mkdir(outDir,{recursive:true})
const errors=[]
try {
for (const width of [390,768,900,1100,1440]) {
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'})
 page.on('pageerror',e=>errors.push(e.message))
 for(const route of ['/','/referenzen','/ueber-uns','/schulungen']) {
  await page.goto('http://127.0.0.1:4173'+route)
  await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('img').forEach(i=>i.loading='eager');await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))})
  assert.equal(await page.locator('h1').count(),1)
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${route} ${width}`)
  assert.equal(await page.evaluate(()=>[...document.images].filter(i=>!i.naturalWidth).length),0)
  const overlap=await page.evaluate(()=>{const nav=document.querySelector('.site-nav');if(getComputedStyle(nav).display==='none')return false;const a=nav.getBoundingClientRect(),b=document.querySelector('.site-header__actions').getBoundingClientRect(),c=document.querySelector('.wordmark').getBoundingClientRect();return a.right>b.left+1 || a.left<c.right-1})
  assert.ok(!overlap,`header overlap ${width}`)
  if([390,768,1440].includes(width)){
   await page.addScriptTag({content:axe});const result=await page.evaluate(()=>axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));assert.equal(result.violations.length,0,JSON.stringify(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))))
   await page.screenshot({path:`${outDir}/${width}-${route.slice(1)||'home'}.png`,fullPage:true})
  }
  if(route==='/referenzen'){
   assert.equal(await page.locator('.project').count(),4)
   assert.equal(await page.locator('.reference-row, .reference-filters').count(),0)
   assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight < 7500), 'curated page stays concise')
   assert.ok(await page.evaluate(()=>[...document.querySelectorAll('.project')].every(p=>p.querySelectorAll('.project__photo img').length===2)),'each project shows two original photos')
   const opener=page.locator('#projekt-4 .project__open')
   await opener.click()
   // A closed native dialog is excluded from role queries before React unmounts it.
   const gallery=page.locator('dialog.lightbox')
   const stage=gallery.locator('.lightbox__img')
   await gallery.waitFor({state:'visible'})
   assert.equal(await gallery.locator('h2').innerText(),'Finkenweg')
   const firstImage=await stage.getAttribute('src')
   await gallery.getByRole('button',{name:'Nächstes Foto',exact:true}).click()
   assert.notEqual(await stage.getAttribute('src'),firstImage)
   await page.keyboard.press('ArrowLeft')
   assert.equal(await stage.getAttribute('src'),firstImage)
   await gallery.getByRole('button',{name:'Foto 2 anzeigen',exact:true}).click()
   assert.notEqual(await stage.getAttribute('src'),firstImage,'thumbnail selects its photo')
   await gallery.getByRole('button',{name:'Foto 1 anzeigen',exact:true}).click()
   assert.equal(await stage.getAttribute('src'),firstImage)
   await gallery.getByRole('button',{name:'Vorheriges Foto',exact:true}).click()
   assert.notEqual(await stage.getAttribute('src'),firstImage, 'previous wraps to last photo')
   assert.ok(await page.evaluate(()=>document.documentElement.style.overflow==='hidden'))
   await page.keyboard.press('Escape')
   await gallery.waitFor({state:'detached'})
   assert.ok(await opener.evaluate(el=>el===document.activeElement),'focus returns to gallery opener')
   assert.ok(await page.evaluate(()=>document.documentElement.style.overflow!=='hidden'))
   for(const id of [6,18,1]) {
    await page.locator(`#projekt-${id} .project__open`).click()
    await gallery.waitFor({state:'visible'})
    assert.ok(await stage.getAttribute('alt'))
    await page.evaluate(async()=>{await document.querySelector('dialog .lightbox__img').decode()})
    await gallery.getByRole('button',{name:'Nächstes Foto',exact:true}).click()
    await page.evaluate(async()=>{await document.querySelector('dialog .lightbox__img').decode()})
    if(id===1 && [390,768,1440].includes(width)) {
     const result=await page.evaluate(()=>axe.run(document.querySelector('dialog'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}))
     assert.equal(result.violations.length,0,JSON.stringify(result.violations.map(v=>v.id)))
     await page.screenshot({path:`${outDir}/${width}-gallery.png`})
    }
    await gallery.getByRole('button',{name:'Projekt schließen',exact:true}).click()
    await gallery.waitFor({state:'detached'})
   }
   await opener.click()
   await gallery.waitFor({state:'visible'})
   await page.mouse.click(2,2)
   await gallery.waitFor({state:'detached'})
   const response=await page.request.get('http://127.0.0.1:4173/documents/altay-rustamov-portfolio.pdf');assert.equal(response.status(),200)
  }
 }
 if(width===390){await page.getByRole('button',{name:'Menü öffnen'}).click();await page.getByRole('navigation',{name:'Mobile Navigation'}).getByRole('link',{name:'Referenzen',exact:true}).click();await page.waitForURL('**/referenzen');await page.waitForFunction(()=>!document.documentElement.classList.contains('menu-open'))}
 await page.close(); console.log(`PASS ${width}px: routes, images, layout, curated selection, gallery controls and focus, PDF${[390,768,1440].includes(width)?', accessibility':''}`)
}
assert.deepEqual(errors,[])
} finally {await browser.close()}
