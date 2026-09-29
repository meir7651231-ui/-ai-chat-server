const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 1400 } });
const html = require('fs').readFileSync('rings-live.html', 'utf8');
await p.setContent(`<!doctype html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`);
const errs = []; p.on('pageerror', (e) => errs.push(e.message));
for (let i = 0; i < 13; i++) { await p.click('#ring'); await p.waitForTimeout(2600); }
await p.screenshot({ path: 'rings.png', fullPage: false }); console.log('errors:', errs.length ? errs : 'none');
console.log(await p.textContent('#hist')); await b.close(); })();
