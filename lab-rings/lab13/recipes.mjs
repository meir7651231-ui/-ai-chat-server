// מתכונים: לבנה = רשימת חלקים — קוד גולמי, או «קרא ללבנה X, עם התאים האלה». כשלבנה משתנה — כל מי שבנוי ממנה נבנה מחדש.
// הרכבה: מדביקים את הגרסה הקצרה של כל חלק (תאי-עבודה מועברים לתאים פנויים, כתובות-קוד ⇒ תוויות), ואז המקצר מוריד את ה«תפרים».
import fs from 'fs'; import { asm } from './machine2.mjs'; import { makeSpecs } from './specs.mjs'; import { checker, shrink, anneal } from './tools2.mjs';
const tag=(p)=>{ const out=p.map(x=>x.slice()); let last=-1; out.forEach(([o],i)=>{ if(o==='WHERE') last=i; else if(o==='WHERE@'||o==='GO') last=-1; else if(o==='JUMP'&&last>=0){ out[last]=['WHERE',out[last][1],'code']; last=-1; } }); return out; };
const dataOf=(p)=>[...new Set(p.filter(([o,,c])=>o==='WHERE'&&!c).map(([,k])=>k))];
let uid=0;
// לבנה ⇒ טקסט-אסמבלי, עם תאים ממופים ותוויות ייחודיות
function inline(b,map,avoid,freePool){ const ins=b.ins, cells=dataOf(b.prog); const used=new Set([...Object.values(map),...avoid]);
  const free=(freePool||[7,6,5,4]).filter(c=>!used.has(c)); const mm={...map}; for(const c of cells) if(mm[c]==null){ const f=free.shift(); if(f==null) throw new Error('אין תא פנוי'); mm[c]=f; }
  const id=++uid; const targets=new Set(b.prog.filter(x=>x[2]).map(x=>x[1]));
  const lines=b.prog.map(([o,k,c],i)=>{ const lab=targets.has(i)?`r${id}_${i}: `:''; return lab+(o==='WHERE'?(c?`WHERE @r${id}_${k}`:`WHERE ${mm[k]}`):o); });
  if(targets.has(b.prog.length)) lines.push(`r${id}_${b.prog.length}:`); return lines.join('; '); }
export function expand(recipe,shelf){ const parts=recipe.map(x=>typeof x==='string'?x:inline(shelf.get(x.call),x.map,x.avoid||[],x.free)); return tag(asm(parts.join('; '))); }
export { tag, dataOf };
