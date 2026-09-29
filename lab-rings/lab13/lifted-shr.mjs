// lifted-shr.mjs — «הזז ימינה» במכונה השנייה = תוכנית במכונה הראשונה (תא = ספרה אחת), רק מחמש פעולות-היסוד, מופעלת פעם אחת על 4 הספרות.
//   אין כאן >> של JavaScript: כל ספרה של התוצאה יוצאת מהרצת התוכנית על תאי-ביט.
//   תאים 0–3 = הספרות של הקלט (0 = הנמוכה). תאים 4–7 = התוצאה: ספרה i מקבלת את ספרה i+1, והעליונה מקבלת 0.
const R={ 'לאן':'WHERE','לך':'GO','קח':'TAKE','שים':'PUT','חשב':'CALC' };
export const SHR_SRC='לאן1 לך קח לאן4 לך שים  לאן2 לך קח לאן5 לך שים  לאן3 לך קח לאן6 לך שים  קח קח חשב קח חשב לאן7 לך שים קח קח חשב שים';   // המנוע קיצר מ-32 ל-30
const P=SHR_SRC.trim().split(/\s+/).map(t=>{ const m=t.match(/^(\D+)(\d*)$/); return m[2]?[R[m[1]],+m[2]]:[R[m[1]]]; });
function runBits(prog,input,cells=8){ const mem=new Array(cells).fill(0); input.forEach((v,i)=>{ mem[i]=v; }); let A=0,P=0; const st=[];
  for(const [op,k] of prog){ if(op==='WHERE') A=k; else if(op==='GO') P=A; else if(op==='TAKE') st.push(mem[P]); else if(op==='PUT') mem[P]=st.pop(); else { const b=st.pop(),a=st.pop(); st.push(a&b?0:1); } }
  return mem; }
export function shr4(x){ const m=runBits(P,[x&1,(x>>1)&1,(x>>2)&1,(x>>3)&1]); return m[4]|(m[5]<<1)|(m[6]<<2)|(m[7]<<3); }
if(import.meta.url==='file://'+process.argv[1]){ let ok=0; for(let x=0;x<16;x++) if(shr4(x)===(x>>1)) ok++;
  console.log(`«הזז ימינה» (${P.length} פעולות-יסוד במכונה של הספרות): ${ok}/16 נכונים`); }
