/* חסד — לוח-עמודות. כל בקשה היא פתק שנע משלב לשלב.
   המבנה הייחודי: קנבן. הזרימה אופקית, והעמודה עצמה היא הסטטוס. */
import { navDrawer, money } from '../base.mjs';

const STAGES = ['בקשה חדשה', 'בדיקת ערבים', 'לוועדה', 'אושר · ממתין לשטר', 'בפירעון'];

/* [שלב, משפחה, סכום, מטרה, ערבים, ימים, דגל] */
const CARDS = [
  [0, 'משפחת דויטש', 12000, 'הוצאות רפואיות', 0, 2, ''],
  [0, 'משפחת הירש', 8000, 'שכר לימוד', 1, 4, ''],
  [0, 'ר׳ ב. נוימן', 5000, 'תיקון רכב', 0, 9, 'ישן'],
  [1, 'משפחת וקסלר', 20000, 'חתונה', 2, 6, ''],
  [1, 'משפחת זילבר', 15000, 'שיפוץ דירה', 1, 3, ''],
  [2, 'משפחת חשין', 30000, 'חתונה', 2, 11, 'ועדה ה׳'],
  [2, 'ר׳ ע. טננבוים', 10000, 'הוצאות חג', 2, 8, 'ועדה ה׳'],
  [3, 'משפחת יעקובוביץ', 18000, 'מעבר דירה', 2, 1, ''],
  [3, 'משפחת כהנא', 7500, 'ציוד לימודי', 2, 2, ''],
  [4, 'משפחת לנדאו', 24000, 'חתונה', 2, 0, '14 מתוך 24'],
  [4, 'משפחת אברמסון', 9000, 'רפואי', 2, 0, '3 מתוך 12'],
  [4, 'משפחת בלוי', 36000, 'דירה', 2, 0, '31 מתוך 36'],
];

export default {
  id: 'hesed',
  name: 'חסד',
  title: 'חסד — מוסד',
  desc: 'לוח הבקשות של גמ״ח ההלוואות: כל בקשה נעה משלב לשלב.',
  css: `
.hd{display:flex;align-items:center;gap:var(--s3);flex-wrap:wrap;padding:var(--s4) var(--s4) var(--s3)}
.hd h1{font-size:20px}.hd .sp{flex:1}
.fund{display:flex;gap:var(--s2);flex-wrap:wrap;padding:0 var(--s4) var(--s4)}
.fund div{background:var(--card);border:1px solid var(--hair);border-radius:12px;padding:10px var(--s4);min-width:140px}
.fund b{display:block;font:800 19px Heebo;font-variant-numeric:tabular-nums}
.fund span{font-size:12px;color:var(--mut)}
.fund .free b{color:var(--ok)}

.board{display:flex;gap:var(--s3);overflow-x:auto;padding:0 var(--s4) var(--s6);align-items:flex-start;
 scroll-snap-type:x proximity}
.col{flex:1 0 246px;max-width:300px;background:var(--sunk);border-radius:var(--r);padding:var(--s3);scroll-snap-align:start}
.col>h2{display:flex;align-items:baseline;gap:var(--s2);font-size:13.5px;padding:0 4px var(--s3)}
.col .cnt{font:800 11px Heebo;background:var(--raise);color:var(--mut);border-radius:999px;padding:1px 8px}
.col .sum{margin-inline-start:auto;font-size:11.5px;color:var(--mut);font-variant-numeric:tabular-nums}

.card{background:var(--card);border:1px solid var(--hair);border-radius:12px;padding:var(--s3);margin-bottom:var(--s2)}
.card .r1{display:flex;align-items:baseline;gap:var(--s2)}
.card .fam{font-weight:700;font-size:14px;flex:1}
.card .amt{font:800 14px Heebo;font-variant-numeric:tabular-nums}
.card .why{font-size:12.5px;color:var(--mut);margin-top:2px}
.card .meta{display:flex;gap:6px;flex-wrap:wrap;margin-top:var(--s2)}
.tag{font-size:10.5px;font-weight:700;border-radius:999px;padding:2px 8px;background:var(--sunk);color:var(--mut)}
.tag.ok{background:var(--ok-soft);color:var(--ok)}
.tag.warn{background:var(--warn-soft);color:var(--warn)}
.tag.err{background:var(--err-soft);color:var(--err)}
.card .move{display:flex;gap:6px;margin-top:var(--s3)}
.card .move button{flex:1;border:1px solid var(--hair);background:var(--card);border-radius:8px;
 padding:6px;font-size:12px;min-height:34px;color:var(--mut)}
.card .move button:hover{border-color:var(--acc);color:var(--acc)}
.card .move button[disabled]{opacity:.4;cursor:not-allowed}
.card .bar{height:5px;border-radius:999px;background:var(--sunk);margin-top:var(--s2);overflow:hidden;position:relative}
.card .bar i{position:absolute;inset-block:0;inset-inline-start:0;background:var(--ok);border-radius:999px}
.empty{font-size:12.5px;color:var(--mut);text-align:center;padding:var(--s4) 0}

@media print{.board{display:block}.col{max-width:none;break-inside:avoid;margin-bottom:12px}.move{display:none!important}}
`,
  body: `
<header class="hd">
  <h1>חסד · גמ״ח הלוואות</h1>
  <span class="sp"></span>
  ${navDrawer('hesed')}
</header>

<section class="fund" aria-label="מצב הקרן">
  <div><b>${money(742000)}</b><span>הון הקרן</span></div>
  <div><b>${money(486300)}</b><span>בהלוואות פעילות</span></div>
  <div class="free"><b>${money(255700)}</b><span>זמין להלוואה</span></div>
  <div><b>26</b><span>הלוואות פעילות</span></div>
  <div><b>0</b><span>בפיגור מעל חודשיים</span></div>
</section>

<main id="main" class="board">
  ${STAGES.map((st, si) => {
    const cards = CARDS.filter(c => c[0] === si);
    const sum = cards.reduce((a, c) => a + c[2], 0);
    return `<section class="col" data-stage="${si}" aria-label="${st}">
      <h2>${st}<span class="cnt">${cards.length}</span><span class="sum">${money(sum)}</span></h2>
      ${cards.map((c, i) => {
      const [, fam, amt, why, guar, days, flag] = c;
      const paid = si === 4 && flag ? flag.split(' ') : null;
      return `<article class="card" data-i="${CARDS.indexOf(c)}">
          <div class="r1"><span class="fam">${fam}</span><span class="amt">${money(amt)}</span></div>
          <p class="why">${why}</p>
          <div class="meta">
            <span class="tag ${guar === 2 ? 'ok' : guar === 1 ? 'warn' : 'err'}">${guar}/2 ערבים</span>
            ${days > 7 ? `<span class="tag warn">${days} ימים ממתין</span>` : days ? `<span class="tag">${days} ימים</span>` : ''}
            ${flag && si !== 4 ? `<span class="tag">${flag}</span>` : ''}
          </div>
          ${paid ? `<div class="bar" role="img" aria-label="נפרעו ${paid[0]} מתוך ${paid[2]} תשלומים">
              <i style="width:${Math.round(+paid[0] / +paid[2] * 100)}%"></i></div>
            <p class="why">${flag} תשלומים</p>` : ''}
          <div class="move">
            <button data-dir="-1" ${si === 0 ? 'disabled' : ''} aria-label="החזרה לשלב הקודם">→ אחורה</button>
            <button data-dir="1" ${si === STAGES.length - 1 ? 'disabled' : ''} aria-label="קידום לשלב הבא">קדימה ←</button>
          </div>
        </article>`;
    }).join('') || '<p class="empty">אין בקשות בשלב הזה</p>'}
    </section>`;
  }).join('')}
</main>`,
  js: `
/* העברת פתק בין עמודות — כולל עדכון המונה והסכום של שתי העמודות */
document.querySelector('.board').addEventListener('click',e=>{
 const b=e.target.closest('[data-dir]'); if(!b||b.disabled)return;
 const card=b.closest('.card'), col=card.closest('.col');
 const to=+col.dataset.stage+ +b.dataset.dir;
 const dest=document.querySelector('.col[data-stage="'+to+'"]'); if(!dest)return;
 const empty=dest.querySelector('.empty'); if(empty)empty.remove();
 dest.appendChild(card);
 card.querySelector('[data-dir="-1"]').disabled = to===0;
 card.querySelector('[data-dir="1"]').disabled  = to===${STAGES.length - 1};
 [col,dest].forEach(c=>{
  const cards=[...c.querySelectorAll('.card')];
  c.querySelector('.cnt').textContent=cards.length;
  const sum=cards.reduce((a,x)=>a+Number(x.querySelector('.amt').textContent.replace(/[^\\d]/g,'')),0);
  c.querySelector('.sum').innerHTML='<bdi dir="ltr">₪'+sum.toLocaleString('he-IL')+'</bdi>';
  if(!cards.length&&!c.querySelector('.empty'))c.insertAdjacentHTML('beforeend','<p class="empty">אין בקשות בשלב הזה</p>');
 });
 card.querySelector('.fam').focus?.();
});
`,
};
