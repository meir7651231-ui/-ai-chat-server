// הלולאה: כל לבנה עם מתכון נבנית מחדש מהגרסאות הקצרות של החלקים (לפי סדר תלות). נכנסת אם קצרה יותר, או אם הישנה לא עומדת בכללים.
import fs from 'fs'; import { expand } from './recipes.mjs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, anneal } from './tools3.mjs';
const M=(f)=>()=>{ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); if(Math.random()<0.25) m[1]=m[0]; const w=f(m[0],m[1]); return {mem:m,ok:r=>r[2]===w}; };
const {S}=makeSpecs(55);
const keep=(gen,ins)=>()=>{ const e=gen(); const before=e.mem.slice(); return {mem:e.mem,ok:(r)=>e.ok(r)&&ins.every(c=>r[c]===before[c])}; };
Object.assign(S,{ 'חיסור':M((a,b)=>(a-b)&15), 'ועוד 2':M(a=>(a+2)&15), 'קטן מ-':M((a,b)=>a<b?15:0), 'גדול מ-':M((a,b)=>a>b?15:0), 'מינימום':M((a,b)=>Math.min(a,b)), 'מקסימום':M((a,b)=>Math.max(a,b)) });
const F15='TAKE; TAKE; CALC; TAKE; CALC';
export const R={
 'ועוד 1': [{call:'קבוע 1',map:{2:5},avoid:[0]},{call:'חיבור מספרים',map:{0:0,1:5,2:2}}],
 'ועוד 1 באותו תא': [{call:'קבוע 1',map:{2:5},avoid:[2]},{call:'חיבור מספרים',map:{0:2,1:5,2:2}}],
 'שווה (מספרים)': [{call:'שונה (מספרים)',map:{0:0,1:1,2:2}}, `WHERE 2; GO; TAKE; WHERE @NZ; JUMP; TAKE; TAKE; CALC; PUT; TAKE; WHERE @END; JUMP; NZ: ${F15}; PUT; TAKE; TAKE; CALC; PUT; END:`],
 'חיסור': [{call:'לא (מספר)',map:{0:1,2:5},avoid:[0]},{call:'ועוד 1 באותו תא',map:{2:5},avoid:[0]},{call:'חיבור מספרים',map:{0:0,1:5,2:2}}],
 'ועוד 2': [{call:'ועוד 1',map:{0:0,2:2}},{call:'ועוד 1 באותו תא',map:{2:2}}],
 // במכונה עם «הזז ימינה»: e = a + לא(b); הנשא-לכל-ספרה (לבנה 212); מזיזים 3 פעמים ימינה ⇒ 0 או 1; ואז 0−v = לא(v)+1 ⇒ 0 או 15.
 'גדול מ-': [{call:'לא (מספר)',map:{0:1,2:3},free:[7,6,5,4]}, {call:'חיבור מספרים',map:{0:0,1:3,2:4},free:[7,6,5]}, {call:'tt:212',map:{0:0,1:3,3:4,2:5},free:[7,6]},
   'WHERE 5; GO; TAKE; SHR; SHR; SHR; PUT; TAKE; TAKE; CALC; WHERE 2; GO; PUT', {call:'ועוד 1 באותו תא',map:{2:2},free:[7,6,5,4]}],
 'קטן מ-': [{call:'גדול מ-',map:{0:1,1:0,2:2},free:[7,6,5,4,3]}],
 'מינימום': [{call:'קטן מ-',map:{0:0,1:1,2:12},free:[7,6,5,4,8,9,10,11,13]},{call:'אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)',map:{0:12,1:0,3:1,2:2},free:[7,6,5,4]}],
 'מקסימום': [{call:'קטן מ-',map:{0:0,1:1,2:12},free:[7,6,5,4,8,9,10,11,13]},{call:'אם (תא0 לא-אפס ⇒ תא1, אחרת תא3)',map:{0:12,1:1,3:0,2:2},free:[7,6,5,4]}],
};
const INS={'חיסור':[0,1],'ועוד 2':[0],'קטן מ-':[0,1],'גדול מ-':[0,1],'מינימום':[0,1],'מקסימום':[0,1]};
const deps=(n)=>(R[n]||[]).filter(x=>typeof x!=='string').map(x=>x.call);
function order(){ const out=[], seen=new Set(); const visit=(n)=>{ if(seen.has(n)) return; seen.add(n); for(const d of deps(n)) visit(d); if(R[n]) out.push(n); }; Object.keys(R).forEach(visit); return out; }
const file=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const shelf=new Map(file.named.map(b=>[b.name,b])); for(const l of file.logic) shelf.set('tt:'+l.tt,{name:'tt:'+l.tt,ins:[0,1,3],out:2,prog:l.prog});
const AMS=+process.argv[2]||4000;
if(import.meta.url==='file://'+process.argv[1]) for(let round=1;round<=4;round++){ let changed=0;
  for(const name of order()){ const ins0=(shelf.get(name)?.ins||INS[name]||[]).filter(c=>c!==2); const gen=S[name]&&keep(S[name],ins0); if(!gen){ console.log('אין מבחן',name); continue; }
    const fast=checker(gen,40,60000), full=checker(gen,300,60000), fresh=checker(gen,3000,60000); const ok=p=>fast(p)&&full(p);
    let raw; try{ raw=expand(R[name],shelf); }catch(e){ console.log(`✗ ${name}: ${e.message}`); continue; }
    if(!fresh(raw)){ console.log(`✗ ${name}: המורכבת לא עובדת (${raw.length})`); continue; }
    const s1=shrink(raw,ok); const s2=anneal(s1,ok,AMS,4,round*13); const best=fresh(s2)?s2:s1; const old=shelf.get(name); const oldBad=old&&!fresh(old.prog);
    console.log(`  ${name}: ממתכון ${raw.length} ⇐ ${best.length} · במדף ${old?old.prog.length:'-'}`);
    if(!old||oldBad||best.length<old.prog.length){ changed++; console.log(`סיבוב ${round} · ${name}: ${old?old.prog.length+(oldBad?' (לא עמדה בכללים)':''):'חדשה'} → ${best.length}`);
      shelf.set(name,{name,ins:old?.ins||INS[name],out:2,prog:best,recipe:R[name],by:'ממתכון'}); } else shelf.set(name,{...old,recipe:R[name]}); }
  fs.writeFileSync('shelf3.json',JSON.stringify({...file,named:[...shelf.values()].filter(b=>!b.name.startsWith('tt:'))})); if(!changed){ console.log(`סיבוב ${round}: אין שינוי — נעצר`); break; } }
