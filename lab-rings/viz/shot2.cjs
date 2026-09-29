const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async()=>{ const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1360, height: 1250 } });
const errs=[]; p.on('pageerror', e=>errs.push(e.message));
const html = require('fs').readFileSync('rings-live.html','utf8');
await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${html}</body></html>`);
await p.evaluate(()=>{ document.getElementById('speed').value=10; }); await p.click('#run'); await p.waitForTimeout(19000);
await p.screenshot({ path: 'rings2.png', fullPage: true }); console.log('errors:', errs.length?errs:'none');
console.log(await p.textContent('#ladder')); await b.close(); })();
