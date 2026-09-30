// הצורף בוחר לבד אילו חלקים להביא למשימה: מריץ כל שיבוץ של כל חלק על הדוגמאות של המשימה,
// ומודד כמה התוצאה שלו «מספרת» על התשובה הנכונה (מידע משותף). חלק שהתוצאה שלו קשורה לתשובה — כנראה שימושי.
// + זיכרון: חלקים שעזרו בעבר (tzoref-used.json) מקבלים תוספת.
import fs from 'fs'; import { encode, runCode, MEM } from './machine3f.mjs';
const H=(cnt,n)=>{ let h=0; for(const c of cnt.values()){ const p=c/n; h-=p*Math.log2(p); } return h; };
export function loadUsed(){ try{ return JSON.parse(fs.readFileSync('tzoref-used.json','utf8')); }catch{ return {}; } }
export function noteUsed(goal,used){ const U=loadUsed(); const g=U[goal]||(U[goal]={}); for(const n of new Set(used||[])) g[n]=(g[n]||0)+1; fs.writeFileSync('tzoref-used.json',JSON.stringify(U)); }
// הרשת (מהחלומות) — אם קיימת: עוד ניחוש «אילו חלקים מתאימים» (משקל NETW)
let NET=undefined, DR=null; const NETW=process.env.NETW!=null?+process.env.NETW:1;
async function loadDream(){ if(NET!==undefined) return; DR=await import('./tzoref-dream.mjs'); NET=DR.loadNet(); }
export async function rankPartsNet(gen,pieces,opt={}){ await loadDream(); return rankParts(gen,pieces,opt); }
export function rankParts(gen,pieces,{n=64,used={}}={}){ const ex=Array.from({length:n},()=>gen()); const wants=ex.map(e=>e.want);
  const netP={}; if(NET&&NETW>0){ const {o}=DR.forward(NET,DR.features(ex.slice(0,32))); DR.NAMES.forEach((nm,i)=>{ netP[nm]=o[i]; }); }
  const cw=new Map(); for(const w of wants) cw.set(w,(cw.get(w)||0)+1); const Hw=H(cw,n)||1;
  const tot={}; for(const g of Object.values(used)) for(const [k,v] of Object.entries(g)) tot[k]=(tot[k]||0)+v; const maxU=Math.max(1,...Object.values(tot));
  const scored=pieces.map(p=>{ const code=encode(p.prog); const outs=ex.map(e=>{ const r=runCode(code,0,0,e.mem,4000,0); return r===1?MEM[p.out??2]:-1; });
    const co=new Map(), cj=new Map(); let exact=0; outs.forEach((o,i)=>{ co.set(o,(co.get(o)||0)+1); const k=o*64+wants[i]; cj.set(k,(cj.get(k)||0)+1); if(o===wants[i]) exact++; });
    const mi=H(co,n)+Hw-H(cj,n); return {p,s:mi/Hw+exact/n+0.5*(tot[p.name]||0)/maxU+NETW*(netP[p.name]||0)}; });
  scored.sort((a,b)=>b.s-a.s); return scored; }
