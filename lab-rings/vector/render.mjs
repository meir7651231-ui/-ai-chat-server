import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import fs from 'fs';
const [,,src,out,scaleArg]=process.argv; const SC=+scaleArg||1; const svg=fs.readFileSync(src,'utf8'); const m=svg.match(/width="(\d+)" height="(\d+)"/);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:+m[1],height:+m[2]},deviceScaleFactor:SC});
await p.setContent(`<html><body style="margin:0">${svg}</body></html>`); await p.waitForTimeout(150);
await p.screenshot({path:out,clip:{x:0,y:0,width:+m[1],height:+m[2]}}); await b.close();
