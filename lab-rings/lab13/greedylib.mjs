// greedylib.mjs (KEY=greedy) — skeleton bricks for the greedy / budget / small-DP frames (greedyframes.mjs).
// Only generic machine idioms (move, constants, compare, 2-cell add/sub, list walking). No task knowledge here.
import { assemble } from './posframes.mjs'; import { scanTools, shift, dataCells, remap } from './scan-tools.mjs';
export { assemble };
export const G_=c=>[['WHERE',c],['GO']], T_=c=>[...G_(c),['TAKE']], P_=c=>[...G_(c),['PUT']], MV=(a,b)=>[...T_(a),...P_(b)];
export const P15=[['TAKE'],['TAKE'],['CALC'],['TAKE'],['CALC']];   // nand(nand(v,v),v)=15 from any cell
export const GOTO=l=>[...P15,['J',l]];
export const CONST=(()=>{ const best=new Array(16).fill(null); const q=[{st:[],code:[]}]; const seen=new Set(['']);
  while(q.length){ const n=q.shift(); if(n.st.length===1&&!best[n.st[0]]) best[n.st[0]]=n.code; if(best.every(Boolean)) break; const nx=[];
    if(n.st.length<3) nx.push({st:[...n.st,15],code:[...n.code,...P15]});
    if(n.st.length>=1) nx.push({st:[...n.st.slice(0,-1),n.st.at(-1)>>1],code:[...n.code,['SHR']]});
    if(n.st.length>=2){ const a=n.st.at(-2), b=n.st.at(-1); nx.push({st:[...n.st.slice(0,-2),(a+b)&15],code:[...n.code,['ADD']]}); nx.push({st:[...n.st.slice(0,-2),~(a&b)&15],code:[...n.code,['CALC']]}); }
    for(const m of nx){ const k=m.st.join(','); if(seen.has(k)||m.code.length>40) continue; seen.add(k); q.push(m); } q.sort((a,b)=>a.code.length-b.code.length); }
  return best; })();
export const SET=(c,k)=>[...G_(c),...CONST[k&15],...P_(c)];
export const INC=c=>[...T_(c),...CONST[1],['ADD'],...P_(c)];
export const DEC=c=>[...T_(c),...P15,['ADD'],...P_(c)];
export const NOT=[['TAKE'],['CALC']];   // after pushing v with P at v's cell: pushes ~v  (nand(v,v))
let UID=0; export const uid=()=>++UID;
// jump to lab if cell a ≠ cell b (xor from nand; s = scratch)
export const JNE=(a,b,s,lab)=>[...T_(a),...T_(b),['CALC'],...P_(s),...T_(a),...T_(s),['CALC'],...T_(b),...T_(s),['CALC'],['CALC'],['J',lab]];
// jump to lab if cell a == cell b
export const JEQ=(a,b,s,lab)=>{ const u=uid(); return [...JNE(a,b,s,'ne'+u),...GOTO(lab),'ne'+u]; };
// push the borrow of a−b (1 if a<b, unsigned 4-bit), s = scratch (gets a−b)
export const BORROW=(a,b,s)=>[...T_(b),...T_(b),['CALC'],...CONST[1],['ADD'],...T_(a),['ADD'],...P_(s),
  ...T_(a),...T_(a),['CALC'],...T_(b),['CALC'], ...T_(a),...T_(b),...T_(b),['CALC'],['CALC'], ...T_(s),['CALC'],['CALC'],['SHR'],['SHR'],['SHR']];
export const JLT=(a,b,s,lab)=>[...BORROW(a,b,s),['J',lab]];       // a<b ⇒ lab
// (lo,hi) ⇐ (lo,hi)+c ; s scratch
export const ADDW=(lo,hi,c,s)=>[...T_(lo),...T_(c),['ADD'],...P_(s),
  ...T_(lo),...T_(c),['CALC'], ...T_(lo),...T_(lo),['CALC'],...T_(c),...T_(c),['CALC'],['CALC'], ...T_(s),...T_(s),['CALC'],['CALC'],['CALC'],
  ['SHR'],['SHR'],['SHR'],...T_(hi),['ADD'],...P_(hi), ...MV(s,lo)];
// (lo,hi) ⇐ (lo,hi)−c ; negative ⇒ jump to under with nothing changed
export const SUBW=(lo,hi,c,s,under)=>{ const u=uid(), B='sb'+u, HD='sh'+u, NB='sn'+u;
  return [...BORROW(lo,c,s),['J',B],...GOTO(NB),
    B,...T_(hi),['J',HD],...GOTO(under),
    HD,...DEC(hi),
    NB,...MV(s,lo)]; };
export const INC2=(lo,hi)=>{ const u=uid(), DN='in'+u; return [...INC(lo),...T_(lo),['J',DN],...INC(hi),DN]; };
// 2-cell compare (aL,aH) < (bL,bH) ⇒ lab ; s scratch
export const JLTW=(aL,aH,bL,bH,s,lab)=>{ const u=uid(); return [...JLT(aH,bH,s,lab),...JNE(aH,bH,s,'cw'+u),...JLT(aL,bL,s,lab),'cw'+u]; };
export const JEQW=(aL,aH,bL,bH,s,lab)=>{ const u=uid(); return [...JNE(aL,bL,s,'qw'+u),...JNE(aH,bH,s,'qw'+u),...GOTO(lab),'qw'+u]; };
// push (cell & k) for constant k
export const ANDK=(c,k)=>[...T_(c),...CONST[k],['CALC'],...P15,['CALC']];
export const AT=Pc=>[...T_(Pc),['WHERE@'],['GO']];                    // P ⇐ mem[Pc]
export const LOADAT=(Pc,d)=>[...AT(Pc),['TAKE'],...P_(d)];            // d ⇐ mem[mem[Pc]]
export const STOREAT=(Pc,v)=>[...T_(v),...AT(Pc),['PUT']];           // mem[mem[Pc]] ⇐ v
// a shelf tool in place: inputs ⇒ inCells, output ⇒ outC; scratch ⇒ free cells (busy live cells saved on the stack around it)
export function callTool(f,inCells,outC,live){ const map={}; f.ins.forEach((c,i)=>{ map[c]=inCells[i]; }); map[f.out]=outC; const taken=new Set([...inCells,outC]);
  const scratch=dataCells(f.prog).filter(c=>map[c]==null); const cells=[0,2,3,4,5,6,7]; const free=cells.filter(c=>!taken.has(c)&&!live.has(c)), busy=cells.filter(c=>!taken.has(c)&&live.has(c)); const save=[];
  for(const c of scratch){ if(free.length) map[c]=free.shift(); else if(busy.length){ const b=busy.shift(); map[c]=b; save.push(b); } else return null; }
  return [...save.flatMap(c=>T_(c)),{code:[['WHERE',0],['GO'],...shift(remap(f.prog,map),2)]},...[...save].reverse().flatMap(c=>P_(c))]; }
export { scanTools };
export const walk=m=>{ const o=[]; let a=m[1]; for(let i=0;a&&i<10;i++){ o.push(a); a=m[a]; } return o; };
