// «גדול וקטן»: בסוף — תא 6 = הגדול ברשימה (0 אם ריקה), תא 7 = הקטן (15 אם ריקה). קלט (0,1,8–15) לא משתנה.
import fs from 'fs'; import { expand } from './recipes.mjs'; import { checkerF } from './tools3f.mjs';
let s=5; const rnd=(k)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%k; };
const LIST=[0,1,8,9,10,11,12,13,14,15];
export const genMM=()=>{ const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=rnd(i+1); [p[i],p[j]]=[p[j],p[i]]; } const l=p.slice(0,rnd(9));
  const m=new Array(16).fill(0); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; }); const mx=l.length?Math.max(...l):0, mn=l.length?Math.min(...l):15;
  const mem=m.map((v,k)=>LIST.includes(k)?v:rnd(16)); const bf=mem.slice(); return {mem,ok:r=>r[6]===mx&&r[7]===mn&&LIST.every(c=>r[c]===bf[c])}; };
const F15='TAKE; TAKE; CALC; TAKE; CALC';
const HEAD='WHERE 1; GO; TAKE; WHERE 3; GO; PUT';
const TEST='LOOP: WHERE 3; GO; TAKE; WHERE @BODY; JUMP; WHERE 3; GO; TAKE; TAKE; CALC; WHERE @END; JUMP';
const STEP='WHERE 3; GO; TAKE; WHERE@; GO; TAKE; WHERE 3; GO; PUT';
export const RA=[{call:'הגדול ברשימה',map:{1:1,2:6},free:[3,4,5]},{call:'הקטן ברשימה',map:{1:1,2:7},avoid:[6],free:[3,4,5]}];
export const RB=[`WHERE 6; GO; ${F15}; PUT; TAKE; TAKE; CALC; PUT`,`WHERE 7; GO; ${F15}; PUT`,HEAD,TEST,'BODY: WHERE 3; GO; TAKE',
  {call:'גדול מ-',map:{0:3,1:6,2:5},free:[2,4]},
  'WHERE 5; GO; TAKE; WHERE @SM; JUMP; WHERE 3; GO; TAKE; WHERE @C2; JUMP; SM: WHERE 3; GO; TAKE; WHERE 6; GO; PUT; C2:',
  {call:'קטן מ-',map:{0:3,1:7,2:5},free:[2,4]},
  'WHERE 5; GO; TAKE; WHERE @SN; JUMP; WHERE 3; GO; TAKE; WHERE @C3; JUMP; SN: WHERE 3; GO; TAKE; WHERE 7; GO; PUT; C3:',
  STEP,'WHERE @LOOP; JUMP; END:'];
if(import.meta.url==='file://'+process.argv[1]){ const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const shelf=new Map(sh.named.map(b=>[b.name,b]));
  const fresh=checkerF(genMM,3000,200000);
  for(const [nm,rec] of [['A (שני מעברים)',RA],['B (מעבר אחד)',RB]]){ const p=expand(rec,shelf); console.log(nm,'אורך',p.length,'עובדת:',fresh(p)); fs.writeFileSync(`mm-${nm[0]}.json`,JSON.stringify(p)); } }
