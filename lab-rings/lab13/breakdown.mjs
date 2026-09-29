// פירוק «קטן מ-» לחלקים — כמה עולה כל חלק, אחרי קיצור, בנפרד.
import fs from 'fs'; import { expand } from './recipes.mjs'; import { checker, shrink } from './tools2.mjs';
const file=JSON.parse(fs.readFileSync('shelf.json','utf8')); const shelf=new Map(file.named.map(b=>[b.name,b])); for(const l of file.logic) shelf.set('tt:'+l.tt,{name:'tt:'+l.tt,ins:[0,1,3],out:2,prog:l.prog});
const F15='TAKE; TAKE; CALC; TAKE; CALC'; const rnd=()=>Math.floor(Math.random()*16);
const part=(name,rec,gen)=>{ const ok=checker(gen,300); const raw=expand(rec,shelf); const good=checker(gen,2000)(raw); const p=good?shrink(raw,ok):raw; console.log(`${name}: ${p.length}${good?'':' (לא עובד!)'}`); return p.length; };
const G=(f,keep=[0,1])=>()=>{ const m=Array.from({length:16},rnd); const b=m.slice(); const w=f(m); return {mem:m,ok:r=>w(r)&&keep.every(c=>r[c]===b[c])}; };
let t=0;
t+=part('1. חיסור d=a−b (לתא 3)',[{call:'חיסור',map:{0:0,1:1,2:3},free:[7,6,5,4]}],G(m=>{ const d=(m[0]-m[1])&15; return r=>r[3]===d; }));
t+=part('2. «הלווה» לכל ספרה (לבנה לוגית 142)',[{call:'tt:142',map:{0:0,1:1,3:3,2:4},free:[7,6,5]}],G(m=>{ let w=0; for(let k=0;k<4;k++){ const i=((m[0]>>k&1)<<2)|((m[1]>>k&1)<<1)|(m[3]>>k&1); w|=((142>>i)&1)<<k; } return r=>r[4]===w; },[0,1,3]));
t+=part('3. בניית המספר 8',[`WHERE 5; GO; ${F15}; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; CALC; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; ADD; PUT`],G(m=>r=>r[5]===8,[]));
t+=part('3ב. המספר 8 בדרך אחרת (15→14→12→8)',[`WHERE 5; GO; ${F15}; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; ADD; PUT`],G(m=>r=>r[5]===8,[]))-0;
t+=part('4. «וגם» עם 8 (לבודד את הספרה העליונה)',[{call:'וגם (מספרים)',map:{0:4,1:5,2:6},free:[7]}],G(m=>{ const w=m[4]&m[5]; return r=>r[6]===w; },[4,5]));
t+=part('5. הסתעפות: 15 או 0',[`WHERE 6; GO; TAKE; WHERE @YES; JUMP; WHERE 2; GO; ${F15}; PUT; TAKE; TAKE; CALC; PUT; TAKE; TAKE; CALC; WHERE @END; JUMP; YES: WHERE 2; GO; ${F15}; PUT; END:`],G(m=>{ const w=m[6]?15:0; return r=>r[2]===w; },[]));
