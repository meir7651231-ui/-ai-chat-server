// מנוע העיגולים על התפרים: בכל נקודה בתוכנית — «מה יש ביד» (כל הביקורים בנקודה, על הרבה דוגמאות, כולל סיבובי לולאה).
// מגדלים עיגולים מהמצב הזה (פעולה, שתיים, ... עד D), כפילויות מתאחדות; אם עיגול פוגע במצב שבנקודה מאוחרת יותר — גשר קצר יותר.
// רק בקטעים ישרים (בלי קפיצה, בלי כתובת-קוד, בלי יעד-קפיצה באמצע). כל החלפה נבדקת בבודק המלא.
import { add4 } from './lifted-add.mjs'; import { replace } from './tools2.mjs';
const ADD=[]; for(let a=0;a<16;a++){ ADD[a]=[]; for(let b=0;b<16;b++) ADD[a][b]=add4(a,b); }
const ALPHA=[...[0,1,2,3,4,5,6,7].map(k=>['WHERE',k]),['WHERE@'],['GO'],['TAKE'],['PUT'],['CALC'],['ADD']];
const step=(S,[o,k])=>{ const m=S.m.slice(), st=S.st.slice(); let A=S.A,P=S.P;
  if(o==='WHERE')A=k; else if(o==='WHERE@'){ if(!st.length) return null; A=st.pop()%16; } else if(o==='GO'){ if(A>15) return null; P=A; } else if(o==='TAKE') st.push(m[P]);
  else if(o==='PUT'){ if(!st.length) return null; m[P]=st.pop(); } else if(o==='CALC'){ if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(~(a&b)&15); }
  else if(o==='ADD'){ if(st.length<2) return null; const b=st.pop(),a=st.pop(); st.push(ADD[a][b]); } else return null; if(st.length>12) return null; return {m,st,A,P}; };
// הרצה עם מעקב: בכל pc נאסף המצב לפני הפקודה (עד CAP ביקורים)
function trace(prog,runs,CAP=48){ const at=Array.from({length:prog.length+1},()=>[]);
  for(const {mem,pa,aa,sc} of runs){ let S={m:mem.slice(),st:[],A:aa,P:pa}, pc=0, steps=0, sd=sc;
    const rnd=()=>{ sd=(sd*1103515245+12345)%2147483648; return Math.floor((sd/2147483648)*16); };
    while(pc<prog.length&&steps++<60000){ if(at[pc].length<CAP) at[pc].push({S,run:runs.indexOf}); const [o,k]=prog[pc];
      if(o==='JUMP'){ if(!S.st.length) break; const st=S.st.slice(); const v=st.pop(); S={...S,st}; if(v!==0){ const back=S.A<pc+1; pc=S.A; if(sc&&back){ S={...S,A:rnd(),P:rnd()}; } continue; } pc++; continue; }
      const T=step(S,[o,k]); if(!T) break; S=T; pc++; }
    if(pc===prog.length&&at[pc].length<CAP) at[pc].push({S}); }
  return at; }
const key=(S,live)=>S.m.map((v,i)=>live.cells[i]?v:'').join(',')+'|'+(live.A?S.A:'')+'|'+(live.P?S.P:'')+'|'+S.st.join(',');

// מה «חי» בנקודה j: סורקים קדימה בקו ישר. תא שנכתב (שים, כשידוע לאן) לפני שנקרא — מת. «לאן» שנדרס לפני שקוראים אותו — מת. «איפה» שמוחלף ב«לך» לפני קח/שים — מת.
// מגיעים לקפיצה/יעד-קפיצה לפני שהוכרע — חי (זהירות). בסוף התוכנית: רק התאים השמורים חיים.
function liveAt(prog,j,bad,keepCells){ const n=prog.length; const cell=Array(16).fill(null); let A=null,P=null, a=null, pKnown=null, aVal=null;
  let i=j; for(;i<n;i++){ if(i>j&&bad.has('t'+i)) break; const [o,k,c]=prog[i]; if(o==='JUMP'||c){ if(A===null) A=true; break; }
    if(o==='WHERE'){ if(A===null) A=false; aVal=k; } else if(o==='WHERE@'){ if(A===null) A=false; aVal=null; }
    else if(o==='GO'){ if(A===null) A=true; if(P===null) P=false; pKnown=aVal; }
    else if(o==='TAKE'){ if(P===null) P=true; if(pKnown==null){ for(let x=0;x<16;x++) if(cell[x]===null) cell[x]=true; } else if(cell[pKnown]===null) cell[pKnown]=true; }
    else if(o==='PUT'){ if(P===null) P=true; if(pKnown!=null&&cell[pKnown]===null) cell[pKnown]=false; } }
  const end=i===n; return {cells:cell.map((v,x)=>v===null?(end?keepCells.includes(x):true):v),A:A===null?!end:A,P:P===null?!end:P}; }
export function seamRings(prog,ok,runs,{D=4,cap=30000,keepCells}={}){ let cur=prog, gains=0;
  for(let pass=0;pass<30;pass++){ const at=trace(cur,runs); const n=cur.length; let improved=false;
    const bad=new Set(); cur.forEach(([o,k,c],i)=>{ if(o==='JUMP'||c) bad.add(i); if(c) bad.add('t'+k); });
    for(let i=0;i<n&&!improved;i++){ if(bad.has(i)||!at[i].length) continue;
      // הנקודות j שאפשר להגיע אליהן בקו ישר מ-i
      let jmax=i; while(jmax<n&&!bad.has(jmax)&&(jmax===i||!bad.has('t'+jmax))) jmax++;
      if(jmax-i<2) continue;
      for(let j=jmax;j>i+1&&!improved;j--){ const V=at[j].length; if(!V||at[i].length!==V) continue;
        const live=liveAt(cur,j,bad,keepCells);
        const target=at[j].map(v=>key(v.S,live)).join(';'); const seen=new Set(); let layer=[{seq:[],Ss:at[i].map(v=>v.S)}]; let found=null;
        for(let d=1;d<j-i&&d<=D&&!found;d++){ const next=[]; for(const {seq,Ss} of layer){ for(const a of ALPHA){ const T=Ss.map(S=>S&&step(S,a)); if(T.some(x=>!x)) continue;
              const kf=T.map(S=>key(S,{cells:Array(16).fill(true),A:true,P:true})).join(';'); if(seen.has(kf)) continue; seen.add(kf); const q=[...seq,a];
              if(T.map(S=>key(S,live)).join(';')===target){ found=q; break; } if(seen.size<cap) next.push({seq:q,Ss:T}); } if(found) break; } layer=next; }
        if(!found&&j-i>=1){ /* גם גשר ריק */ if(at[i].map(v=>key(v.S,live)).join(';')===target) found=[]; }
        if(found&&found.length<j-i){ const cand=replace(cur,i,j-i,found); if(cand&&ok(cand)){ gains+=(j-i)-found.length; cur=cand; improved=true; } } } }
    if(!improved) break; }
  return cur; }
