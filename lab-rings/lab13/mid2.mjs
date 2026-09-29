// «כמה מעל האמצע» בנויה מהלבנה המשולבת «גדול וקטן» (66, מעבר אחד) במקום הגדול+הקטן (34+42)
import fs from 'fs'; import { expand, dataOf } from './recipes.mjs'; import { checkerF, shrink, anneal } from './tools3f.mjs';
let s=91; const rnd=(k)=>{ s=(Math.imul(s,1103515245)+12345)&0x7fffffff; return (s>>>16)%k; };
const LIST=[0,1,8,9,10,11,12,13,14,15];
const g=()=>{ const p=[8,9,10,11,12,13,14,15]; for(let i=7;i>0;i--){ const j=rnd(i+1); [p[i],p[j]]=[p[j],p[i]]; } const l=p.slice(0,rnd(9)); const m=new Array(16).fill(0); m[1]=l[0]||0; l.forEach((a,i)=>{ m[a]=l[i+1]||0; });
  const a=l.length?Math.max(...l):0, b=l.length?Math.min(...l):15, mid=(b+(((a-b)&15)>>1))&15, w=l.filter(x=>x>mid).length; const mem=m.map((v,k)=>LIST.includes(k)?v:rnd(16)); const bf=mem.slice(); return {mem,ok:r=>r[2]===w&&LIST.every(c=>r[c]===bf[c])}; };
const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); const shelf=new Map(sh.named.map(b=>[b.name,b]));
const mm=JSON.parse(fs.readFileSync('lm-mmB.json','utf8')); console.log('תאים של «גדול וקטן»:',JSON.stringify(dataOf(mm).sort((a,b)=>a-b)));
shelf.set('גדול וקטן',{name:'גדול וקטן',ins:[1],prog:mm});
const idm=Object.fromEntries(dataOf(mm).map(c=>[c,c]));
const rec=[{call:'גדול וקטן',map:idm},{call:'חיסור',map:{0:6,1:7,2:5}},'WHERE 5; GO; TAKE; SHR; WHERE 7; GO; TAKE; ADD; WHERE 5; GO; PUT',{call:'ספור גדולים מ-X',map:{0:5,1:1,2:2},free:[3,4,6,7]}];
const fast=checkerF(g,40,200000), full=checkerF(g,300,200000), fresh=checkerF(g,3000,200000); const ok=p=>fast(p)&&full(p);
const raw=expand(rec,shelf); console.log('אחרי הדבקה:',raw.length,'(66+18+11+61) · עובדת:',fresh(raw));
if(fresh(raw)){ const p=anneal(shrink(raw,ok),ok,60000,4,3); const best=fresh(p)?p:raw; console.log('אחרי קיצור מהיר:',best.length); fs.writeFileSync('start-mid2.json',JSON.stringify(best)); }
