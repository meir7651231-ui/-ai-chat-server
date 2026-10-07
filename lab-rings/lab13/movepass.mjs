// «מעבר-העברות»: העתקה בת 6 פקודות (WHERE a·GO·TAKE·WHERE b·GO·PUT) — מנסים למחוק אותה ולקרוא מ-a במקום מ-b.
// גם: מחיקת חלונות 3–8 פקודות, והחלפת שם-תא מנקודה מסוימת והלאה. כל ניסיון נבדק בבודק — אין הנחות.
const isMv=(p,i)=>i+6<=p.length&&p[i][0]==='WHERE'&&!p[i][2]&&p[i+1][0]==='GO'&&p[i+2][0]==='TAKE'&&p[i+3][0]==='WHERE'&&!p[i+3][2]&&p[i+4][0]==='GO'&&p[i+5][0]==='PUT';
// מחיקת [i,i+w) עם תיקון כתובות-קפיצה; אסור אם קפיצה נוחתת באמצע
export function cut(p,i,w){ for(const x of p) if(x[2]==='code'&&x[1]>i&&x[1]<i+w) return null; for(let j=i;j<i+w;j++) if(p[j][0]==='JUMP'||p[j][2]) return null;
  return [...p.slice(0,i),...p.slice(i+w)].map(x=>x[2]==='code'&&x[1]>=i+w?['WHERE',x[1]-w,'code']:x); }
const ren=(p,from,a,b,upto=Infinity)=>{ let n=0; return p.map((x,j)=>{ if(j>=from&&n<upto&&x[0]==='WHERE'&&!x[2]&&x[1]===a){ n++; return ['WHERE',b]; } return x; }); };
export function movePass(p,ok,{log=()=>{}}={}){ let improved=true;
  while(improved){ improved=false;
    // 1. העתקות
    for(let i=0;i<p.length&&!improved;i++){ if(!isMv(p,i)) continue; const a=p[i][1], b=p[i+3][1]; const q0=cut(p,i,6); if(!q0) continue;
      const nb=q0.slice(i).filter(x=>x[0]==='WHERE'&&!x[2]&&x[1]===b).length;
      for(let k=0;k<=nb;k++){ const q=ren(q0,i,b,a,k); if(ok(q)){ log(`העתקה ${a}→${b} במקום ${i} נמחקה (${k} קריאות הופנו)`); p=q; improved=true; break; } }
      if(improved) break;
      // הפוך: כותבים ישר ל-b במקום ל-a (שינוי שם a→b לפני ההעתקה)
      for(let s=i-1;s>=0&&s>=i-60;s--){ const r=[...q0.slice(0,s),...ren(q0.slice(s,i),0,a,b),...q0.slice(i)]; if(ok(r)){ log(`העתקה ${a}→${b} במקום ${i}: כתיבה ישירה ל-${b}`); p=r; improved=true; break; } } }
    // 2. מחיקת חלונות
    for(let w=8;w>=3&&!improved;w--) for(let i=0;i+w<=p.length&&!improved;i++){ const q=cut(p,i,w); if(q&&ok(q)){ log(`חלון ${w} במקום ${i} נמחק`); p=q; improved=true; } }
  }
  return p; }
