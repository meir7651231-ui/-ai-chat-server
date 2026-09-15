/* btnlab.mjs — מעבדת-הכפתור: איך «רישום תשלום» נראה ומתנהג בשש שפות.
   כל ערך מסומן: נמדד (btn.json) או שוחזר. עבור על הכפתורים עם Tab
   כדי לראות את טבעות-המיקוד — שם ההבדל הכי גדול.
   הרצה: node gen/looks/people/btnlab.mjs */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));

const B = [
  { id: 'govuk', n: 1, name: 'GOV.UK', m: true,
    spec: 'ירוק #0f7a52 · פינה 0 · גובה 38 · צל 0 2px 0 #083d29 · מעבר all 0s',
    states: 'ריחוף: ירוק כהה · מיקוד: **מסגרת צהובה #ffdd00** · לחיצה: **הצל הופך ל-inset — הכפתור יורד**',
    note: 'תקן-הנגישות של ממשלת בריטניה. הצהוב נראה על כל רקע, גם בשמש.' },
  { id: 'wise', n: 2, name: 'Wise', m: true,
    spec: 'ירוק-יער #163300 · טקסט ליים #9fe870 · גלולה · גובה 48 · בלי צל · מעבר 0s',
    states: 'ריחוף: מכהה ל-#0d1f00 · מיקוד: קו 2px כהה · לחיצה: כמעט שחור #0e0f0c',
    note: 'שלוש דרגות-כהות של אותו ירוק. בלי אנימציה — התגובה מיידית.' },
  { id: 'monzo', n: 3, name: 'Monzo', m: true,
    spec: 'לבן מלא · טקסט #091723 · גלולה r500 · גובה 48 · מעבר background 0.2s ease',
    states: 'ריחוף: **הלבן נהיה שקוף 80%** · מיקוד: קו ירוק · לחיצה: חוזר ל-90%',
    note: 'לא מחליף צבע — משנה שקיפות. על רקע צבעוני זה נראה כמו זכוכית.' },
  { id: 'stripe', n: 4, name: 'Stripe', m: true,
    spec: 'נייבי #0a2540 · לבן · פינה 4 · גובה 40 · מעבר background 0.2s ease-in-out',
    states: 'ריחוף: מתבהר · מיקוד: טבעת · לחיצה: מכהה',
    note: 'הפינה הקטנה ביותר בקבוצה (4). קורא כ«כלי», לא כ«אפליקציה».' },
  { id: 'linear', n: 5, name: 'Linear', m: true,
    spec: 'סגול-מותג #5e6ad2 · לבן · גובה 32',
    states: 'מיקוד: **טבעת כפולה** — 2px ברקע הכהה ואז 4px בסגול-המותג',
    note: 'הטבעת הכפולה נראית על כהה וגם על בהיר. הכפתור עצמו נמוך (32) — צפוף.' },
  { id: 'duolingo', n: 6, name: 'Duolingo', m: false,
    spec: 'ירוק #58cc02 · פינה 12 · גובה 50 · **צל 0 4px 0 #46a302** · אותיות גדולות',
    states: 'לחיצה: **יורד 4px והצל מתכווץ ל-1px** — תחושת כפתור פיזי',
    note: 'שוחזר — לא נמדד (האתר לא חשף כפתור). הדפוס זהה ל-GOV.UK אך מוגזם.' },
];
const md = s => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>מעבדת הכפתור</title>
<meta name="description" content="כפתור רישום תשלום בשש שפות: מנוחה, ריחוף, מיקוד, לחיצה, טעינה, הצלחה, כבוי.">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&display=swap">
<style>
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{--bg:#0f0f0e;--card:#1a1a17;--hair:#2f2f2a;--ink:#f2f0eb;--mut:#b5b0a4;--acc:#9fe870;--accInk:#163300}
@media(prefers-color-scheme:light){:root:not([data-theme=dark]){--bg:#f7f5f0;--card:#fff;--hair:#dcdad0;--ink:#191814;--mut:#5b5749}}
body{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.55 Heebo,Arial,sans-serif;padding:26px 20px 50px}
h1,h2{margin:0}p{margin:0}button{font:inherit;cursor:pointer}
bdi{unicode-bidi:isolate}
h1{font-size:clamp(26px,4vw,36px);font-weight:800}
p.lead{color:var(--mut);max-width:80ch;margin-top:8px}
p.lead b{color:var(--ink)}
.grid{max-width:1500px;margin:22px auto 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:16px}
.v{background:var(--card);border:1px solid var(--hair);border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:12px}
.v header{display:flex;align-items:center;gap:10px}
.v .n{width:28px;height:28px;border-radius:999px;background:var(--acc);color:var(--accInk);display:grid;place-items:center;font-weight:800;font-size:14px;flex:none}
.v h2{font-size:18px;font-weight:700}
.tag{margin-inline-start:auto;font-size:11.5px;border-radius:999px;padding:3px 10px;border:1px solid var(--hair);color:var(--mut)}
.tag.m{border-color:var(--acc);color:var(--acc)}
.spec{font-size:13px;color:var(--mut);font-variant-numeric:tabular-nums}
.states{font-size:13.5px}
.note{font-size:13px;color:var(--mut)}
.pad{background:#f4f2ec;border-radius:12px;padding:20px;display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:center;min-height:104px}
.pad.dark{background:#141416}
.lbl{width:100%;text-align:center;font-size:11.5px;color:#6b675c;margin-bottom:-4px}
.pad.dark .lbl{color:#8b8780}

/* ===== שש שפות-הכפתור ===== */
.b{border:0;font-weight:700;display:inline-flex;align-items:center;gap:9px;position:relative}
.b:disabled{cursor:not-allowed}
.b .sp{width:15px;height:15px;border-radius:999px;border:2px solid currentColor;border-top-color:transparent;animation:sp .7s linear infinite;display:none}
.b[data-busy] .sp{display:block}
@keyframes sp{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.b .sp{animation:none}}

.b-govuk{background:#0f7a52;color:#fff;border-radius:0;height:38px;padding:0 16px;font-size:15px;
 box-shadow:0 2px 0 #083d29;transition:all 0s}
.b-govuk:hover{background:#0b5c3e}
.b-govuk:focus-visible{outline:3px solid transparent;border:2px solid #ffdd00;box-shadow:0 0 0 1px #0b0c0c inset,0 2px 0 #0b0c0c;background:#ffdd00;color:#0b0c0c}
.b-govuk:active{box-shadow:inset 0 0 0 1px #083d29;transform:translateY(2px)}

.b-wise{background:#163300;color:#9fe870;border-radius:9999px;height:48px;padding:0 24px;font-size:16px;font-weight:600;transition:none}
.b-wise:hover{background:#0d1f00}
.b-wise:focus-visible{outline:2px solid #163300;outline-offset:2px}
.b-wise:active{background:#0e0f0c}

.b-monzo{background:#fff;color:#091723;border-radius:500px;height:48px;padding:0 24px;font-size:16px;font-weight:400;transition:background-color .2s ease}
.b-monzo:hover{background:rgba(255,255,255,.8)}
.b-monzo:focus-visible{outline:1px solid #218f01;outline-offset:2px}
.b-monzo:active{background:rgba(255,255,255,.9)}

.b-stripe{background:#0a2540;color:#fff;border-radius:4px;height:40px;padding:0 16px;font-size:15px;transition:background .2s ease-in-out}
.b-stripe:hover{background:#1a3a5c}
.b-stripe:focus-visible{outline:2px solid #635bff;outline-offset:2px}
.b-stripe:active{background:#061a2e}

.b-linear{background:#5e6ad2;color:#fff;border-radius:6px;height:32px;padding:0 13px;font-size:14px;transition:background .15s ease}
.b-linear:hover{background:#6e79e0}
.b-linear:focus-visible{outline:0;box-shadow:0 0 0 2px #08090a,0 0 0 4px #5e6ad2}
.b-linear:active{background:#4f5ac2}

.b-duolingo{background:#58cc02;color:#0d2600;border-radius:12px;height:50px;padding:0 16px;font-size:15px;
 text-transform:uppercase;letter-spacing:.04em;box-shadow:0 4px 0 #46a302;transition:none}
.b-duolingo:hover{background:#61e002}
.b-duolingo:focus-visible{outline:3px solid #1cb0f6;outline-offset:3px}
.b-duolingo:active{transform:translateY(4px);box-shadow:0 1px 0 #46a302}

.done{background:#e7f6ea!important;color:#0d5c2b!important;box-shadow:none!important;transform:none!important}
.pad.dark .done{background:#12301d!important;color:#9fe870!important}
.off{opacity:.45}
</style></head>
<body>
<h1>מעבדת הכפתור — «רישום תשלום» בשש שפות</h1>
<p class="lead">בכל לוח אותו כפתור בדיוק. <b>רחף</b> · <b>לחץ והחזק</b> · והכי חשוב — <b>עבור עם Tab</b>,
כי שם ההבדל הגדול ביותר: טבעת-המיקוד. לוח 1 ולוח 6 <b>יורדים פיזית</b> בלחיצה.
לחיצה מלאה מפעילה את מצב הטעינה ואז ההצלחה. תג <span class="tag m">נמדד</span> = הערכים נשלפו מהאתר החי.</p>
<div class="grid">
${B.map(b => `<section class="v">
 <header><span class="n">${b.n}</span><h2>${b.name}</h2><span class="tag${b.m ? ' m' : ''}">${b.m ? 'נמדד' : 'שוחזר'}</span></header>
 <p class="spec">${b.spec}</p>
 <div class="pad ${['monzo', 'linear'].includes(b.id) ? 'dark' : ''}">
   <span class="lbl">מנוחה · ריחוף · מיקוד · לחיצה</span>
   <button class="b b-${b.id}" type="button" data-go="${b.id}"><i class="sp" aria-hidden="true"></i><span class="tx">רישום תשלום <bdi dir="ltr">₪1,000</bdi></span></button>
   <button class="b b-${b.id} off" type="button" disabled>כבוי</button>
 </div>
 <p class="states">${md(b.states)}</p>
 <p class="note">${b.note}</p>
</section>`).join('\n')}
</div>
<script>
document.addEventListener('click', e => {
  const b = e.target.closest('[data-go]'); if (!b || b.dataset.busy) return;
  const tx = b.querySelector('.tx'), was = tx.innerHTML;
  b.dataset.busy = '1'; b.disabled = true; tx.textContent = 'רושם…';
  setTimeout(() => {
    delete b.dataset.busy; b.classList.add('done');
    tx.innerHTML = '✓ נרשם';
    setTimeout(() => { b.classList.remove('done'); b.disabled = false; tx.innerHTML = was; }, 1600);
  }, 900);
});
</script>
</body></html>`;
writeFileSync(join(here, 'btn-lab.html'), html);
console.log('gen/looks/people/btn-lab.html · ' + (html.length / 1024).toFixed(0) + 'KB');
