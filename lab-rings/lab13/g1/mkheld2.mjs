// writes g1/heldout2/g1held2.json — 6 more generic tasks (not suite6), written AFTER the G1 freeze, so that t.flip / t.peak /
// e.adev also have >= 5 non-suite6 tasks each (g1/express.mjs). Same spec format as the suites.
import fs from 'fs';
const T = (prod, name, kind, difficulty, src, note) => ({ name, kind, src, difficulty, note, g1: prod });
const tasks = [
  T('e.adev', 'מיון לפי מרחק מהממוצע', 'list2list', 'hard', `l=>{ const n=l.length, s=l.reduce((a,b)=>a+b,0); return l.map((x,i)=>[x,i]).sort((A,B)=>Math.abs(A[0]*n-s)-Math.abs(B[0]*n-s)||A[1]-B[1]).map(z=>z[0]); }`, 'Elements ordered by their distance from the exact mean, input order on ties.'),
  T('t.flip', 'סכומי שכנים חוצים 24', 'list2num', 'medium', `l=>{ let c=0; for(let i=1;i+1<l.length;i++) if((l[i-1]+l[i]<24)!==(l[i]+l[i+1]<24)) c++; return c; }`, 'Interior positions where exactly one of the two neighbouring pair sums is below 24.'),
  T('t.flip', 'שלישיות לא מונוטוניות', 'list2num', 'hard', `l=>{ let c=0; const n=l.length; for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) for(let k=j+1;k<n;k++) if((l[i]<l[j])!==(l[j]<l[k])) c++; return Math.min(15,c); }`, 'Number of index triples i<j<k whose values are not monotone (capped at 15).'),
  T('t.flip', 'שכן אחד מאותה רביעייה', 'list2num', 'medium', `l=>{ let c=0; const q=x=>x>>2; for(let i=1;i+1<l.length;i++) if((q(l[i-1])===q(l[i]))!==(q(l[i])===q(l[i+1]))) c++; return c; }`, 'Interior positions where exactly one neighbour is in the same block of four values.'),
  T('t.peak', 'שלישיות הר', 'list2num', 'hard', `l=>{ let c=0; const n=l.length; for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) for(let k=j+1;k<n;k++) if(l[i]<l[j]&&l[j]>l[k]) c++; return Math.min(15,c); }`, 'Number of index triples i<j<k with a peak in the middle (capped at 15).'),
  T('t.peak', 'סוף זוג באותה זוגיות', 'list2num', 'medium', `l=>{ let c=0; for(let i=1;i+1<l.length;i++) if(l[i-1]%2===l[i]%2&&l[i]%2!==l[i+1]%2) c++; return c; }`, 'Interior positions where a same-parity step is followed by a parity change.'),
];
fs.writeFileSync(new URL('./heldout2/g1held2.json', import.meta.url), JSON.stringify({ tasks }, null, 1));
console.log(tasks.length, 'tasks');
