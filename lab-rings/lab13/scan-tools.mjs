// «לוחות לסורק»: כל כלי-מספר מהמדף (קלט אחד/שניים/שלושה) + 256 הלוגיות ⇒ לוח-ערכים מלא (16 / 256 / 4096 כניסות).
// כלי נכנס רק אם: (1) עונה אותו דבר עם זבל שונה בשאר התאים, (2) לא נוגע בתאי הרשימה (8–15) ולא משנה את הקלטים שלו,
// (3) עובד גם כשמזיזים אותו (כתובות-קוד) וגם כשממפים את התאים שלו לתאים אחרים — כי המסגרת שמה אותו בתאים שלה.
import fs from 'fs'; import crypto from 'crypto'; import { run } from './machine3s.mjs';
const R=k=>Math.floor(Math.random()*k);
export const shift=(p,o)=>p.map(x=>x[2]==='code'&&x[1]>=0?['WHERE',x[1]+o,'code']:x);
export const dataCells=p=>[...new Set(p.filter(x=>x[0]==='WHERE'&&!x[2]).map(x=>x[1]))];
// מיפוי תאים: map[תא-מקורי] = תא-חדש
export const remap=(p,map)=>p.map(([o,k,c])=>o==='WHERE'&&!c?['WHERE',map[k]??k]:(c?[o,k,c]:(k==null?[o]:[o,k])));
const PAD=[['WHERE',0],['GO'],['WHERE',0],['GO'],['WHERE',0],['GO']];
function tableOf(prog,ins,out,keep=true){ const k=ins.length, n=1<<(4*k); const T=new Int8Array(n);
  for(let idx=0;idx<n;idx++){ const a=[]; for(let j=0;j<k;j++) a.push((idx>>(4*(k-1-j)))&15); let v=null;
    for(let t=0;t<2;t++){ const m=Array.from({length:16},()=>R(16)); ins.forEach((c,j)=>{ m[c]=a[j]; }); const r=run(prog,m,{maxSteps:20000});
      if(!r||r.st.length||[8,9,10,11,12,13,14,15].some(c=>r.mem[c]!==m[c])||(keep&&ins.some((c,j)=>r.mem[c]!==a[j]))){ v=-1; break; }
      const y=r.mem[out]; if(v==null) v=y; else if(v!==y){ v=-1; break; } }
    T[idx]=v; }
  return T; }
// בדיקת מיפוי: כניסות לתאים אחרים, יציאה לתא אחר, תאי-עבודה לתאים הפנויים — וקוד מוזז
function remapOk(b,T,trials=160){ const ins=b.ins, data=dataCells(b.prog); const sets=[[5,6,7,4],[3,0,7,6],[7,4,2,0]];
  for(const S of sets){ const I=S.slice(0,ins.length), O=S[ins.length]; const map={}; ins.forEach((c,j)=>{ map[c]=I[j]; }); map[b.out]=O;
    const used=new Set(Object.values(map)); const free=[0,1,2,3,4,5,6,7].filter(c=>!used.has(c)); for(const c of data){ if(map[c]!=null) continue; const f=free.shift(); if(f==null) return false; map[c]=f; }
    if(Object.values(map).some(c=>c>7)) return false;
    const p=[...PAD,...shift(remap(b.prog,map),PAD.length)];
    for(let t=0;t<trials;t++){ const a=ins.map(()=>R(16)); let idx=0; for(const v of a) idx=idx*16+v; if(T[idx]<0) continue; const m=Array.from({length:16},()=>R(16)); I.forEach((c,j)=>{ m[c]=a[j]; });
      const r=run(p,m,{maxSteps:20000}); if(!r||r.st.length||r.mem[O]!==T[idx]||[8,9,10,11,12,13,14,15].some(c=>r.mem[c]!==m[c])||I.some((c,j)=>r.mem[c]!==a[j])) return false; } }
  return true; }
const CACHE='scan-tables-cache.json';
// מחזיר {U:[…], B:[…], T:[…]} — כל אחד {name, ins, out, prog, T}
export function scanTools({maxLen=260,quiet=true}={}){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); let cache={}; try{ cache=JSON.parse(fs.readFileSync(CACHE,'utf8')); }catch{}
  const out={U:[],B:[],T:[]}; let dirty=false;
  const items=[]; for(const b of sh.named){ if(b.bad) continue; const ins=(b.ins||[]); if(ins.length<1||ins.length>3||ins.some(c=>c>7)||(b.out??2)>7||ins.includes(b.out??2)) continue; if(b.prog.length>maxLen) continue;
      if(/רשימה|ספור|בלי|אמצע|וקטן|כתובת|צעד/.test(b.name)) continue; items.push({name:b.name,ins:ins.slice(),out:b.out??2,prog:b.prog}); }
  // הלוגיות: שלוש כניסות (תאים 0,1,3) ⇒ תא 2, ביט אחרי ביט
  for(const l of sh.logic) items.push({name:'לוגי '+l.tt,ins:[0,1,3],out:2,prog:l.prog,tt:l.tt});
  for(const it of items){ const h=crypto.createHash('md5').update(JSON.stringify([it.ins,it.out,it.prog])).digest('hex'); let e=cache[h];
    if(!e){ const T=tableOf(it.prog,it.ins,it.out); const ok=Array.from(T).some(v=>v>=0)&&remapOk(it,T); e={ok,T:ok?Array.from(T):null}; cache[h]=e; dirty=true; if(!quiet) console.log((ok?'✓ ':'✗ ')+it.name); }
    if(!e.ok) continue; const k=it.ins.length; const rec={name:it.name,ins:it.ins,out:it.out,prog:it.prog,T:Int8Array.from(e.T),k}; (k===1?out.U:k===2?out.B:out.T).push(rec); }
  if(dirty) fs.writeFileSync(CACHE,JSON.stringify(cache));
  return out; }
if((process.argv[1]||'').endsWith('scan-tools.mjs')){ const t=Date.now(); const r=scanTools({quiet:false}); console.log(`קלט אחד ${r.U.length} · שניים ${r.B.length} · שלושה ${r.T.length} · ${Date.now()-t}ms`);
  console.log('U:',r.U.map(x=>x.name).join(' | ')); console.log('B:',r.B.map(x=>x.name).join(' | ')); console.log('T:',r.T.filter(x=>!x.name.startsWith('לוגי')).map(x=>x.name).join(' | ')); }
