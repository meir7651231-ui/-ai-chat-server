// Persistent Chromium renderer: reads JSON lines {svg:"path", out:"path", scale:1} from stdin, replies "ok" per line.
// Uses the exact same page setup as ../vec/render.mjs so results match score.py.
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import fs from 'fs';
import readline from 'readline';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const pages = {};
async function getPage(w, h, sc) {
  const k = `${w}x${h}@${sc}`;
  if (!pages[k]) pages[k] = await b.newPage({viewport:{width:w,height:h},deviceScaleFactor:sc});
  return pages[k];
}
const rl = readline.createInterface({input: process.stdin});
for await (const line of rl) {
  if (!line.trim()) continue;
  try {
    const j = JSON.parse(line); const sc = +j.scale || 1;
    const svg = fs.readFileSync(j.svg, 'utf8'); const m = svg.match(/width="(\d+)" height="(\d+)"/);
    const p = await getPage(+m[1], +m[2], sc);
    await p.setContent(`<html><body style="margin:0">${svg}</body></html>`); await p.waitForTimeout(j.wait ?? 30);
    await p.screenshot({path: j.out, clip:{x:0,y:0,width:+m[1],height:+m[2]}});
    process.stdout.write('ok\n');
  } catch (e) { process.stdout.write('err ' + String(e).replace(/\n/g,' ') + '\n'); }
}
await b.close();
