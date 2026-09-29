import fs from 'fs'; import { expand } from './recipes.mjs'; import { run } from './machine2.mjs'; import { shrink, checker, plain } from './tools2.mjs';
const file=JSON.parse(fs.readFileSync('shelf.json','utf8')); const shelf=new Map(file.named.map(b=>[b.name,b])); for(const l of file.logic) shelf.set('tt:'+l.tt,{name:'tt:'+l.tt,ins:[0,1,3],out:2,prog:l.prog});
const F15='TAKE; TAKE; CALC; TAKE; CALC';
const rec=[{call:'חיסור',map:{0:0,1:1,2:3},free:[7,6,5,4]}, {call:'tt:142',map:{0:0,1:1,3:3,2:4},free:[7,6,5]},
 `WHERE 5; GO; ${F15}; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; CALC; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; ADD; PUT; TAKE; TAKE; ADD; PUT`,
 {call:'וגם (מספרים)',map:{0:4,1:5,2:6},free:[7]}, `WHERE 6; GO; TAKE; WHERE @YES; JUMP; WHERE 2; GO; ${F15}; PUT; TAKE; TAKE; CALC; PUT; TAKE; TAKE; CALC; WHERE @END; JUMP; YES: WHERE 2; GO; ${F15}; PUT; END:`];
const gen=()=>{ const m=Array.from({length:16},()=>Math.floor(Math.random()*16)); const w=m[0]<m[1]?15:0; const b=m.slice(); return {mem:m,ok:r=>r[2]===w&&r[0]===b[0]&&r[1]===b[1]}; };
const ok=checker(gen,300,60000); const fast=shrink(expand(rec,shelf),ok);
const loop=shelf.get('קטן מ-').prog; const steps=(p)=>{ let t=0,mx=0; for(let i=0;i<500;i++){ const r=run(plain(p),Array.from({length:16},()=>Math.floor(Math.random()*16)),{maxSteps:60000}); t+=r.steps; mx=Math.max(mx,r.steps);} return [Math.round(t/500),mx]; };
console.log('עם לולאה (במדף):',loop.length,'פעולות בקוד · צעדים בהרצה (ממוצע/מקס):',steps(loop).join('/'));
console.log('בלי לולאה (חדשה):',fast.length,'פעולות בקוד · צעדים בהרצה:',steps(fast).join('/'),'· עובדת:',checker(gen,3000,60000)(fast));
fs.writeFileSync('less-fast.json',JSON.stringify(fast));
