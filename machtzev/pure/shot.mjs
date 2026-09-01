import { chromium } from 'playwright-core';
const EXE='/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const file=process.argv[2], out=process.argv[3], theme=process.argv[4]||'';
const b=await chromium.launch({executablePath:EXE});
const p=await b.newPage({viewport:{width:1240,height:1000},deviceScaleFactor:2});
await p.goto('file://'+file);
if(theme){await p.click(`.seg button[data-t="${theme}"]`);await p.waitForTimeout(700);}
try{await p.evaluate(()=>document.fonts.ready);}catch{}
await p.waitForTimeout(500);
await p.screenshot({path:out,fullPage:true,type:'jpeg',quality:82});
await b.close();
console.log('ok',out);
