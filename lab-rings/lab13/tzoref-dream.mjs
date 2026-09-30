// «חלומות»: הצורף מחבר חלקים באקראי, מריץ, ורואה מה יצא — וכך מקבל מיליוני «שאלות עם תשובה»:
// «כדי לקבל התנהגות כזו (תא 0,1 ⇒ תא 2) — אלה החלקים». רשת קטנה לומדת מזה לנחש אילו חלקים מתאימים למשימה חדשה.
import fs from 'fs'; import { loadShelf, placements } from './tzoref.mjs'; import { encode, runCode, MEM } from './machine3f.mjs';
const sh=loadShelf();
export const PARTS=sh.named.filter(b=>!b.bad&&b.movable!==false&&(b.ins||[]).length>=1&&(b.ins||[]).length<=2&&b.prog.length<=60&&!/רשימה|ספור|בלי|אמצע|וקטן|שלושה|השני/.test(b.name));
export const NAMES=PARTS.map(b=>b.name);
// «עדשות»: כל חלק בשיבוץ הטבעי שלו על תאים 0,1 ⇒ 2 (ובסדר הפוך). התאמה בין מה שהעדשה נותנת לבין התשובה = תכונה.
const LENS=[]; for(const b of PARTS){ const P=placements(b,4000); const want=[[0,1],[1,0],[0],[1]].filter(I=>I.length===b.ins.filter(c=>c<8).length);
  for(const I of want){ const q=P.find(p=>p.out===2&&p.ins.join()===I.join()); if(q) LENS.push({name:b.name,code:encode(q.prog)}); } }
export const NF=LENS.length*2+6;
const R=k=>Math.floor(Math.random()*k);
export function features(ex){ const n=ex.length, f=new Float32Array(NF); let j=0;
  for(const L of LENS){ let eq=0, cor=0; for(const e of ex){ const r=runCode(L.code,0,0,e.mem,4000,0); const o=r===1?MEM[2]:-1; if(o===e.want) eq++; if(o>=0&&((o^e.want)&1)===0) cor++; } f[j++]=eq/n; f[j++]=cor/n; }
  let z=0,a=0,b=0,f15=0,le=0,od=0; for(const e of ex){ const w=e.want; if(w===0)z++; if(w===e.mem[0])a++; if(w===e.mem[1])b++; if(w===15)f15++; if(w<=Math.max(e.mem[0],e.mem[1]))le++; if(w&1)od++; }
  for(const v of [z,a,b,f15,le,od]) f[j++]=v/n; return f; }
// חלום אחד: 2–3 חלקים מחוברים. תוצאות-ביניים בתאים 4–7, התוצאה הסופית בתא 2.
const PL=PARTS.map(b=>placements(b,4000).filter(p=>p.ins.every(c=>[0,1,4,5,6,7].includes(c))&&[2,4,5,6,7].includes(p.out)));
export function dream(){ const k=2+R(2); let prog=[], avail=[0,1], used=[];
  for(let s=0;s<k;s++){ const last=s===k-1; const bi=R(PARTS.length); const opts=PL[bi].filter(p=>p.ins.every(c=>avail.includes(c))&&(last?p.out===2:(p.out>=4&&!avail.includes(p.out))));
    if(!opts.length) return null; const p=opts[R(opts.length)]; prog=prog.concat(p.prog); used.push(bi); if(!last) avail.push(p.out); }
  const code=encode(prog); const ex=[]; let bad=0;
  for(let t=0;t<48;t++){ const mem=Array.from({length:16},()=>R(16)); if(t%4===0) mem[1]=mem[0];
    const r=runCode(code,0,0,mem,8000,0); if(r!==1){ bad++; break; } const w=MEM[2], k0=MEM[0], k1=MEM[1];
    const mem2=mem.slice(); for(let c=2;c<16;c++) mem2[c]=R(16); const r2=runCode(code,0,0,mem2,8000,0); if(r2!==1||MEM[2]!==w||k0!==mem[0]||k1!==mem[1]){ bad++; break; } ex.push({mem,want:w}); }
  if(bad) return null; const ws=new Set(ex.map(e=>e.want)); if(ws.size<2) return null;
  return {ex,used:[...new Set(used)]}; }
// רשת: שכבה נסתרת אחת. יציאה לכל חלק: «כמה סביר שהחלק הזה בפתרון».
export function makeNet(H=96){ const NO=PARTS.length; const g=()=>(Math.random()*2-1)*0.1;
  return {H,NO,W1:Float32Array.from({length:NF*H},g),b1:new Float32Array(H),W2:Float32Array.from({length:H*NO},g),b2:new Float32Array(NO)}; }
export function forward(net,f){ const {H,NO,W1,b1,W2,b2}=net; const h=new Float32Array(H), o=new Float32Array(NO);
  for(let i=0;i<H;i++){ let s=b1[i]; for(let k=0;k<NF;k++) s+=f[k]*W1[k*H+i]; h[i]=s>0?s:0.01*s; }
  for(let j=0;j<NO;j++){ let s=b2[j]; for(let i=0;i<H;i++) s+=h[i]*W2[i*NO+j]; o[j]=1/(1+Math.exp(-s)); } return {h,o}; }
export function trainStep(net,f,y,lr){ const {H,NO,W1,b1,W2,b2}=net; const {h,o}=forward(net,f); const dh=new Float32Array(H); let loss=0;
  for(let j=0;j<NO;j++){ const d=o[j]-y[j]; loss-=y[j]?Math.log(o[j]+1e-9):Math.log(1-o[j]+1e-9); b2[j]-=lr*d; for(let i=0;i<H;i++){ dh[i]+=d*W2[i*NO+j]; W2[i*NO+j]-=lr*d*h[i]; } }
  for(let i=0;i<H;i++){ const d=dh[i]*(h[i]>0?1:0.01); b1[i]-=lr*d; if(d!==0) for(let k=0;k<NF;k++) W1[k*H+i]-=lr*d*f[k]; } return loss; }
export const saveNet=(net,file='tzoref-net.json')=>fs.writeFileSync(file,JSON.stringify({names:NAMES,H:net.H,W1:[...net.W1],b1:[...net.b1],W2:[...net.W2],b2:[...net.b2]}));
export function loadNet(file='tzoref-net.json'){ try{ const j=JSON.parse(fs.readFileSync(file,'utf8')); if(j.names.join('|')!==NAMES.join('|')) return null; return {H:j.H,NO:NAMES.length,W1:Float32Array.from(j.W1),b1:Float32Array.from(j.b1),W2:Float32Array.from(j.W2),b2:Float32Array.from(j.b2)}; }catch{ return null; } }
if(import.meta.url==='file://'+process.argv[1]){ const N=+process.argv[2]||20000, EP=+process.argv[3]||4; const t0=Date.now();
  console.log(`חלקים: ${PARTS.length} · עדשות: ${LENS.length} · תכונות: ${NF}`);
  const D=[]; let tries=0; while(D.length<N){ tries++; const d=dream(); if(!d) continue; const y=new Float32Array(PARTS.length); for(const u of d.used) y[u]=1; D.push({f:features(d.ex.slice(0,32)),y}); }
  console.log(`חלומות: ${D.length} (מתוך ${tries} ניסיונות) · ${((Date.now()-t0)/1000).toFixed(0)} שנ׳`);
  const test=D.splice(0,Math.floor(N*0.1)); const net=makeNet();
  const evalTop=()=>{ let hit=0,tot=0; for(const d of test){ const {o}=forward(net,d.f); const k=d.y.reduce((a,b)=>a+b,0); const top=[...o].map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]).slice(0,5).map(x=>x[1]); for(let j=0;j<o.length;j++) if(d.y[j]){ tot++; if(top.includes(j)) hit++; } } return hit/tot; };
  { let hit=0,tot=0; for(const d of test){ const sc=new Float32Array(PARTS.length); LENS.forEach((L,li)=>{ const bi=NAMES.indexOf(L.name); sc[bi]=Math.max(sc[bi],d.f[2*li]); }); const top=[...sc].map((v,i)=>[v,i]).sort((a,b)=>b[0]-a[0]).slice(0,5).map(x=>x[1]); for(let j=0;j<sc.length;j++) if(d.y[j]){ tot++; if(top.includes(j)) hit++; } }
    console.log(`השיטה הישנה («כמה החלק דומה לתשובה»): החלקים הנכונים ב-5 הראשונים: ${(100*hit/tot).toFixed(0)}%`); }
  console.log(`לפני אימון: החלקים הנכונים ב-5 הראשונים: ${(100*evalTop()).toFixed(0)}%`);
  for(let e=0;e<EP;e++){ let L=0; for(let i=D.length-1;i>0;i--){ const j=R(i+1); [D[i],D[j]]=[D[j],D[i]]; } for(const d of D) L+=trainStep(net,d.f,d.y,0.01/(1+e));
    console.log(`  סבב ${e+1}: שגיאה ${(L/D.length).toFixed(3)} · החלקים הנכונים ב-5 הראשונים: ${(100*evalTop()).toFixed(0)}% · ${((Date.now()-t0)/1000).toFixed(0)} שנ׳`); }
  saveNet(net); console.log('נשמר: tzoref-net.json'); }
