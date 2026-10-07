// «הסולם»: שלב 1 — 10 משימות אמיתיות נבנות, מתקצרות ונכנסות למדף ככלים. שלב 2 — משימות גדולות שבנויות מהן: עם הכלים החדשים מול בלעדיהם
import fs from 'fs'; import { valueBuild, show } from './tzoref-value.mjs'; import { shorten, finalCheck, movable } from './tzoref.mjs';
const R=k=>Math.floor(Math.random()*k); const mn=Math.min, mx=Math.max, m=x=>((x%16)+16)%16;
const L1=[
 ['ש1 ממוצע הגדול והקטן',[0,1,3],(a,b,c)=>(mx(a,b,c)+mn(a,b,c))>>1],
 ['ש1 הגדול מבין א+ב ו-ג',[0,1,3],(a,b,c)=>mx(m(a+b),c)],
 ['ש1 הפרש מוחלט ועוד ג',[0,1,3],(a,b,c)=>m(Math.abs(a-b)+c)],
 ['ש1 האם ג בין א ל-ב',[0,1,3],(a,b,c)=>(c>=mn(a,b)&&c<=mx(a,b))?1:0],
 ['ש1 ממוצע כפול 2',[0,1],(a,b)=>m(((a+b)>>1)*2)],
 ['ש1 הקטן בריבוע',[0,1],(a,b)=>m(mn(a,b)**2)],
 ['ש1 א כפול ב ועוד א',[0,1],(a,b)=>m(a*b+a)],
 ['ש1 סכום רווי פחות 1',[0,1],(a,b)=>mx(mn(a+b,15)-1,0)],
 ['ש1 שארית א+ב ב-3',[0,1],(a,b)=>(a+b)%3],
 ['ש1 חצי ההפרש',[0,1],(a,b)=>Math.abs(a-b)>>1],
];
const F=Object.fromEntries(L1.map(([n,i,f])=>[n,f]));
const L2=[
 ['ש2 חצי ההפרש בריבוע',[0,1],(a,b)=>m((Math.abs(a-b)>>1)**2)],
 ['ש2 (א כפול ב ועוד א) שארית 3',[0,1],(a,b)=>m(a*b+a)%3],
 ['ש2 סכום רווי פחות 1, כפול 2',[0,1],(a,b)=>m(mx(mn(a+b,15)-1,0)*2)],
 ['ש2 הקטן בריבוע ועוד ממוצע כפול 2',[0,1],(a,b)=>m(m(mn(a,b)**2)+m(((a+b)>>1)*2))],
 ['ש2 אם ג בין א ל-ב: הפרש ועוד ג, אחרת 0',[0,1,3],(a,b,c)=>(c>=mn(a,b)&&c<=mx(a,b))?m(Math.abs(a-b)+c):0],
 ['ש2 הגדול מבין א+ב ו-ג, פחות ממוצע הגדול והקטן',[0,1,3],(a,b,c)=>m(mx(m(a+b),c)-((mx(a,b,c)+mn(a,b,c))>>1))],
];
const f2=Object.fromEntries(L2.map(([n,i,f])=>[n,f]));
const L3=[
 ['ש3 חצי-ההפרש-בריבוע ועוד הקטן-בריבוע-וממוצע',[0,1],(a,b)=>m(f2['ש2 חצי ההפרש בריבוע'](a,b)+f2['ש2 הקטן בריבוע ועוד ממוצע כפול 2'](a,b))],
 ['ש3 הגדול מבין חצי-ההפרש-בריבוע וסכום-רווי-כפול-2',[0,1],(a,b)=>mx(f2['ש2 חצי ההפרש בריבוע'](a,b),f2['ש2 סכום רווי פחות 1, כפול 2'](a,b))],
 ['ש3 (שארית-3) כפול (סכום-רווי-כפול-2)',[0,1],(a,b)=>m(f2['ש2 (א כפול ב ועוד א) שארית 3'](a,b)*f2['ש2 סכום רווי פחות 1, כפול 2'](a,b))],
 ['ש3 אם-בין פחות הגדול-פחות-ממוצע',[0,1,3],(a,b,c)=>m(f2['ש2 אם ג בין א ל-ב: הפרש ועוד ג, אחרת 0'](a,b,c)-f2['ש2 הגדול מבין א+ב ו-ג, פחות ממוצע הגדול והקטן'](a,b,c))],
];
const LV={1:L1,2:L2,3:L3};
const genOf=(ins,f)=>()=>{ const mem=Array.from({length:16},()=>R(16)); const w=f(...ins.map(c=>mem[c])); const keep=ins.map(c=>mem[c]); return {mem,want:w,ok:r=>r[2]===w&&ins.every((c,i)=>r[c]===keep[i])}; };
const ttOf=(ins,f)=>{ const N=16**ins.length, T=[]; for(let i=0;i<N;i++){ const v=ins.map((_,j)=>(i>>(4*(ins.length-1-j)))&15); T.push(f(...v)); } return T; };
if(process.env.SAVE||process.env.LEVEL==='1'){ const LIST=LV[process.env.SAVE||1]; const sh=JSON.parse(fs.readFileSync('shelf3.json','utf8')); let LG={}; try{ LG=JSON.parse(fs.readFileSync('tzoref-learned-goals.json','utf8')); }catch{}
  for(const [name,ins,f] of LIST){ const gen=genOf(ins,f); const t=Date.now(); const v=valueBuild(gen,{name,ins,out:2,ms:+process.env.VMS||90000}); if(!v.prog){ console.log(`✗ ${name}`); continue; }
    let s=v.prog; try{ s=shorten(v.prog,gen,{minutes:+process.env.MIN||1,quiet:9}).prog; }catch{} const fc=finalCheck(s,gen); if(fc.bad){ console.log(`✗ ${name} (בדיקה)`); continue; }
    sh.named=sh.named.filter(b=>b.name!==name); sh.named.push({name,prog:s,ins,out:2,movable:movable(s,gen),by:'הסולם · שלב '+(process.env.SAVE||1)}); LG[name]={ins,tt:ttOf(ins,f)};
    fs.writeFileSync('shelf3.json',JSON.stringify(sh)); fs.writeFileSync('tzoref-learned-goals.json',JSON.stringify(LG));
    console.log(`✓ ${name}: נבנה ${v.prog.length} ⇒ קוצר ${s.length} · ${((Date.now()-t)/1000).toFixed(0)} שנ׳ ⇒ במדף`); } }
if(process.env.TEST||process.env.LEVEL==='2'){ const lv=+(process.env.TEST||2); const ban=process.env.NOPREV?LV[lv-1].map(x=>x[0]):process.env.NOL1?L1.map(x=>x[0]):[];
  for(const [name,ins,f] of LV[lv]){ const gen=genOf(ins,f); const t=Date.now(); let v=null; try{ v=valueBuild(gen,{name,ins,out:2,ms:+process.env.VMS||60000,ban}); }catch(e){}
    const ok=v&&v.prog&&!finalCheck(v.prog,gen,3000).bad; console.log(`${ok?'✓':'✗'} ${name}: ${ok?v.prog.length+' פקודות · '+show(v.expr).slice(0,90):'לא נמצא'} · ${((Date.now()-t)/1000).toFixed(0)} שנ׳`); } }
process.exit(0);
