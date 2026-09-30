import { goals, goalFor } from './tzoref-goals.mjs'; const G=goals(); const gen=goalFor('מיין רשימה',{},G);
function exec(ops,m){ for(let p=0;p<ops.length;p++){ const o=ops[p]; switch(o.t){ case 'zero': m[o.i]=0; break; case 'mark': m[m[o.i]&15]=15; break; case 'copy': m[o.i]=m[o.j]; break; case 'load': m[o.i]=m[m[o.j]&15]; break; case 'store': m[m[o.i]&15]=m[o.j]; break; case 'if': if(m[o.i]===0) p+=o.k; break; } } }
const A=[{t:'copy',i:2,j:1},{t:'load',i:1,j:1},{t:'mark',i:2}], B=[{t:'load',i:3,j:4},{t:'if',i:3,k:2},{t:'store',i:4,j:1},{t:'copy',i:1,j:4}];
let ok=0,bad=0,why=null; for(let t=0;t<2000;t++){ const e=gen(); const m=e.mem.slice(); let k=0; while(m[1]!==0&&k++<12) exec(A,m); for(let v=15;v>=8;v--){ m[4]=v; exec(B,m); } if(e.ok(m)) ok++; else { bad++; if(!why) why={mem:e.mem.join(','),after:m.join(',')}; } }
console.log('הפתרון שלי:',ok,'עוברות ·',bad,'נכשלות'); if(why) console.log(why);
