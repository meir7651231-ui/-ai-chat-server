// לכל אחת משלוש הלבנים שנכשלו במכונה הקפדנית: מחפש בכל הגרסאות השמורות את הקצרה ביותר שעוברת בקפדנית
import fs from 'fs'; import { makeSpecs } from './specs.mjs'; import { checker } from './tools3s.mjs';
const src=fs.readFileSync('audit3s.mjs','utf8'); // לוקחים את מחוללי הבדיקה מהביקורת
const {S}=makeSpecs(909);
eval(src.split('\n').slice(3,8).join('\n'));
const names=['חפש ברשימה','הקטן ברשימה','ספור גדולים מ-X'];
const files=fs.readdirSync('.').filter(f=>/^(shelf.*|lm.*)\.json$/.test(f));
for(const n of names){ const cands=[];
  for(const f of files){ let j; try{ j=JSON.parse(fs.readFileSync(f,'utf8')); }catch{ continue; }
    if(Array.isArray(j)&&f.includes(n.replace(/[ ()]/g,'_'))) cands.push([f,j]);
    else if(j.named){ const b=j.named.find(x=>x.name===n); if(b) cands.push([f,b.prog]); } }
  cands.sort((a,b)=>a[1].length-b[1].length); let found=null;
  for(const [f,p] of cands){ if(checker(S[n],3000,200000)(p)){ found=[f,p]; break; } }
  console.log(n,':', cands.map(c=>c[1].length).join(','),'→', found?`תקינה: ${found[1].length} (${found[0]})`:'אין תקינה');
  if(found) fs.writeFileSync('strict-'+n.replace(/[ ()]/g,'_')+'.json',JSON.stringify(found[1])); }
