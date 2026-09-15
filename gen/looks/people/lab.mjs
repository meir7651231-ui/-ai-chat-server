/* lab.mjs — מעבדת-הטוסט: איך זה נראה ואיך זה מתנהג.
   אותה הודעה בדיוק — «נרשם תשלום ₪1,000» — בשבע שפות-עיצוב.
   מסומן על כל אחת מה **נמדד** ומה **שוחזר**, כי חלק מהרכיבים לא ניתנים
   למדידה מבחוץ (מאחורי חשבון או מצוירים כתמונה בתיעוד).
   הרצה: node gen/looks/people/lab.mjs */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));

const V = [
  { id: 'material', n: 1, name: 'Material · Gmail', pos: 'bottom-center', enter: 'slide-up', secs: 6,
    look: 'רצועה כהה, פינה 4, טקסט לבן, פעולה אחת בצבע-מותג', bar: false, icon: false, close: false,
    measured: 'המיקום — «bottom of the screen» מ-m3.material.io', guess: 'הגוונים והפינה' },
  { id: 'spectrum', n: 2, name: 'Spectrum · Adobe', pos: 'bottom-center', enter: 'fade', secs: 5,
    look: 'רצועה **ירוקה** עם אייקון-וי, טקסט, ו-× לסגירה', bar: false, icon: true, close: true,
    measured: 'ירוק · אייקון+טקסט+× · bottom center · 5 שניות — נמדד מהעמוד', guess: 'הגוון המדויק' },
  { id: 'carbon', n: 3, name: 'Carbon · IBM', pos: 'top-right', enter: 'slide-right', secs: 8,
    look: '**כרטיס לבן** 264×64 עם פס-צבע בצד, כותרת + שורה שנייה', bar: false, icon: true, close: true,
    measured: '264×64 · #ffffff על #161616 · top right — נמדד', guess: 'פס-הצבע' },
  { id: 'linear', n: 4, name: 'Linear', pos: 'bottom-center', enter: 'slide-up', secs: 8,
    look: 'רצועה כהה **צרה** עם קיצור-מקלדת מוצג בתוכה', bar: false, icon: false, close: false, kbd: true,
    measured: '—', guess: 'הכל — הממשק מאחורי חשבון' },
  { id: 'gmail-bar', n: 5, name: 'עם מד-זמן', pos: 'bottom-center', enter: 'slide-up', secs: 10,
    look: 'אותה רצועה, **ופס שמתקצר** — רואים כמה זמן נשאר', bar: true, icon: false, close: false,
    measured: '—', guess: 'הדפוס עצמו נפוץ; אין מדידה' },
  { id: 'toast-card', n: 6, name: 'כרטיס בהיר', pos: 'bottom-start', enter: 'slide-up', secs: 8,
    look: 'כרטיס **בהיר** עם צל, מתמזג עם ממשק בהיר במקום לחתוך אותו', bar: false, icon: true, close: true,
    measured: '—', guess: 'הכל' },
  { id: 'inline', n: 7, name: 'בתוך השורה', pos: 'inline', enter: 'none', secs: 0,
    look: '**אין טוסט בכלל.** השורה עצמה משתנה ומחזיקה את «בטל»', bar: false, icon: false, close: false,
    measured: '—', guess: 'דפוס — לא מוצר מסוים' },
];
const md = s => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>מעבדת הטוסט</title>
<meta name="description" content="אותה הודעת-ביטול בשבע שפות-עיצוב: מיקום, כניסה, צורה, מד-זמן והתנהגות.">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&display=swap">
<style>
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{--bg:#0f0f0e;--card:#1a1a17;--hair:#2f2f2a;--ink:#f2f0eb;--mut:#b5b0a4;--acc:#9fe870;--accInk:#163300}
@media(prefers-color-scheme:light){:root:not([data-theme=dark]){--bg:#f7f5f0;--card:#fff;--hair:#dcdad0;--ink:#191814;--mut:#5b5749}}
body{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.55 Heebo,Arial,sans-serif;padding:26px 20px 40px}
button{font:inherit;cursor:pointer}h1,h2{margin:0}p{margin:0}
:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
bdi{unicode-bidi:isolate}
h1{font-size:clamp(26px,4vw,36px);font-weight:800}
p.lead{color:var(--mut);max-width:78ch;margin-top:8px}
.grid{max-width:1500px;margin:22px auto 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(400px,1fr));gap:16px}
.v{background:var(--card);border:1px solid var(--hair);border-radius:16px;padding:16px;display:flex;flex-direction:column;gap:11px}
.v header{display:flex;align-items:center;gap:10px}
.v .n{width:28px;height:28px;border-radius:999px;background:var(--acc);color:var(--accInk);display:grid;place-items:center;font-weight:800;font-size:14px;flex:none}
.v h2{font-size:18px;font-weight:700}
.v .meta{margin-inline-start:auto;font-size:12px;color:var(--mut)}
.look{font-size:14px;color:var(--mut)}
/* במה: כאן הטוסט באמת מופיע, בתוך הכרטיס, במיקום שלו */
.stage{position:relative;height:190px;border-radius:12px;border:1px dashed var(--hair);overflow:hidden;
 background:repeating-linear-gradient(45deg,transparent,transparent 9px,color-mix(in srgb,var(--hair) 40%,transparent) 9px,color-mix(in srgb,var(--hair) 40%,transparent) 10px)}
.stage .fake{position:absolute;inset:14px;border-radius:10px;background:var(--card);border:1px solid var(--hair);padding:12px;display:grid;gap:8px;align-content:start}
.fake .fr{display:flex;gap:10px;align-items:center;font-size:13.5px}
.fake .fr .nm{font-weight:700}.fake .fr .m{margin-inline-start:auto;font-variant-numeric:tabular-nums}
.go{background:var(--acc);color:var(--accInk);border:0;border-radius:999px;padding:0 16px;min-height:38px;font-weight:700;font-size:14px;justify-self:start}
.tags{display:flex;gap:6px;flex-wrap:wrap;font-size:11.5px}
.tags span{border:1px solid var(--hair);border-radius:999px;padding:3px 9px;color:var(--mut)}
.tags span.ok{border-color:var(--acc);color:var(--acc)}
.src{font-size:11.5px;color:var(--mut)}
.src b{color:var(--ink)}

/* ---- שבע צורות-הטוסט ---- */
.t{position:absolute;display:flex;align-items:center;gap:12px;z-index:5;max-width:calc(100% - 28px);
 opacity:0;pointer-events:none;transition:opacity .22s ease,transform .26s cubic-bezier(.2,.8,.2,1)}
.t.on{opacity:1;pointer-events:auto}
@media(prefers-reduced-motion:reduce){.t{transition:none}}
.t .act{background:none;border:0;font-weight:700;padding:5px 7px;border-radius:7px}
.t .x{background:none;border:0;opacity:.75;padding:4px 6px;font-size:15px;line-height:1}
.t .ic{flex:none;font-style:normal}
.t .bar{position:absolute;inset-inline:0;inset-block-end:0;height:3px;border-radius:0 0 8px 8px}

/* מיקומים */
.pos-bottom-center{inset-block-end:16px;inset-inline-start:50%;transform:translateX(50%) translateY(14px)}
.pos-bottom-center.on{transform:translateX(50%)}
.pos-bottom-start{inset-block-end:16px;inset-inline-start:16px;transform:translateY(14px)}
.pos-bottom-start.on{transform:none}
.pos-top-right{inset-block-start:16px;inset-inline-end:16px;transform:translateX(-18px)}
.pos-top-right.on{transform:none}

/* שפות */
.s-material{background:#322f35;color:#f4eff4;border-radius:4px;padding:10px 12px 10px 16px;font-size:14px;box-shadow:0 3px 8px rgb(0 0 0/.35)}
.s-material .act{color:#d0bcff}
.s-spectrum{background:#0d7148;color:#fff;border-radius:6px;padding:10px 12px;font-size:14px;box-shadow:0 4px 12px rgb(0 0 0/.3)}
.s-spectrum .act{color:#fff;text-decoration:underline}
.s-carbon{background:#ffffff;color:#161616;border-radius:0;padding:14px 16px;font-size:14px;width:264px;min-height:64px;
 box-shadow:0 2px 6px rgb(0 0 0/.2);border-inline-start:3px solid #0f62fe;align-items:flex-start}
.s-carbon .act{color:#0f62fe}
.s-linear{background:#1c1c1f;color:#f7f8f8;border-radius:8px;padding:8px 10px;font-size:13px;
 box-shadow:0 8px 24px rgb(0 0 0/.5),inset 0 0 0 1px rgb(255 255 255/.08)}
.s-linear .act{color:#8cd6ff}
.s-linear kbd{font:500 10px ui-monospace,Menlo,monospace;background:rgb(255 255 255/.12);border-radius:4px;padding:2px 5px}
.s-gmail-bar{background:#202124;color:#e8eaed;border-radius:8px;padding:12px 14px;font-size:14px;box-shadow:0 4px 14px rgb(0 0 0/.4);position:absolute}
.s-gmail-bar .act{color:#8ab4f8}
.s-gmail-bar .bar{background:#8ab4f8}
.s-toast-card{background:#fff;color:#191814;border-radius:14px;padding:12px 14px;font-size:14px;
 box-shadow:0 10px 30px rgb(0 0 0/.22);border:1px solid #e6e3da}
.s-toast-card .act{color:#0b5c2e}
.s-inline{display:none}
.rowundo{display:none;align-items:center;gap:10px;background:color-mix(in srgb,var(--acc) 18%,transparent);
 border:1px solid var(--acc);border-radius:9px;padding:8px 10px;font-size:13px}
.rowundo.on{display:flex}
.rowundo button{background:none;border:0;color:var(--acc);font-weight:700;margin-inline-start:auto}
</style></head>
<body>
<h1>מעבדת הטוסט — אותה הודעה, שבע שפות</h1>
<p class="lead">לחץ «רישום תשלום» בכל לוח. ההודעה מופיעה <b>בתוך הלוח</b>, במיקום ובתזמון של אותה שפה.
שים לב לארבעה דברים: <b>איפה</b> היא מופיעה · <b>איך</b> היא נכנסת · <b>מה יש בתוכה</b> · <b>מתי</b> היא נעלמת.
מתחת לכל לוח כתוב מה נמדד באמת ומה שוחזר.</p>
<div class="grid">
${V.map(v => `<section class="v">
 <header><span class="n">${v.n}</span><h2>${v.name}</h2><span class="meta">${v.pos} · ${v.secs ? v.secs + ' שניות' : 'נשאר'}</span></header>
 <p class="look">${md(v.look)}</p>
 <div class="stage" id="st-${v.id}">
   <div class="fake">
     <div class="fr"><span class="nm">משפחת אונגר</span><span class="m" id="b-${v.id}"><bdi dir="ltr">₪14,428</bdi></span></div>
     <div class="rowundo" id="ri-${v.id}"><span>נרשם <bdi dir="ltr">₪1,000</bdi></span><button type="button" data-undo="${v.id}">בטל</button></div>
     <button class="go" type="button" data-fire="${v.id}">רישום תשלום</button>
   </div>
   <div class="t pos-${v.pos} s-${v.id}" id="t-${v.id}" role="status">
     ${v.icon ? '<i class="ic" aria-hidden="true">✓</i>' : ''}
     <span class="msg">נרשם תשלום של <bdi dir="ltr">₪1,000</bdi></span>
     <button class="act" type="button" data-undo="${v.id}">בטל</button>
     ${v.kbd ? '<kbd>Ctrl</kbd><kbd>Z</kbd>' : ''}
     ${v.close ? '<button class="x" type="button" aria-label="סגור" data-close="' + v.id + '">×</button>' : ''}
     ${v.bar ? '<i class="bar"></i>' : ''}
   </div>
 </div>
 <div class="tags">
   <span class="${v.pos !== 'inline' ? 'ok' : ''}">מיקום: ${v.pos}</span>
   <span class="${v.bar ? 'ok' : ''}">מד-זמן: ${v.bar ? 'יש' : 'אין'}</span>
   <span class="${v.close ? 'ok' : ''}">סגירה ידנית: ${v.close ? 'יש' : 'אין'}</span>
   <span class="${v.icon ? 'ok' : ''}">אייקון: ${v.icon ? 'יש' : 'אין'}</span>
 </div>
 <p class="src"><b>נמדד:</b> ${v.measured} · <b>שוחזר:</b> ${v.guess}</p>
</section>`).join('\n')}
</div>
<script>
const V = ${JSON.stringify(V)};
const st = {}; V.forEach(v => st[v.id] = { bal: 14428, timer: null });
const nis = n => '₪' + n.toLocaleString('en-US');
const setBal = id => document.getElementById('b-' + id).innerHTML = '<bdi dir="ltr">' + nis(st[id].bal) + '</bdi>';
const hide = (v) => {
  const t = document.getElementById('t-' + v.id); if (t) t.classList.remove('on');
  const ri = document.getElementById('ri-' + v.id); if (ri) ri.classList.remove('on');
  if (st[v.id].timer) { clearTimeout(st[v.id].timer); st[v.id].timer = null; }
};
document.addEventListener('click', e => {
  const f = e.target.closest('[data-fire]'), u = e.target.closest('[data-undo]'), c = e.target.closest('[data-close]');
  if (c) { hide(V.find(x => x.id === c.dataset.close)); return; }
  if (u) { const v = V.find(x => x.id === u.dataset.undo); st[v.id].bal += 1000; setBal(v.id); hide(v); return; }
  if (!f) return;
  const v = V.find(x => x.id === f.dataset.fire);
  st[v.id].bal -= 1000; setBal(v.id); hide(v);
  if (v.pos === 'inline') { document.getElementById('ri-' + v.id).classList.add('on'); return; }
  const t = document.getElementById('t-' + v.id);
  t.classList.add('on');
  const bar = t.querySelector('.bar');
  if (bar) { bar.style.transition = 'none'; bar.style.width = '100%';
    requestAnimationFrame(() => { bar.style.transition = 'width ' + v.secs + 's linear'; bar.style.width = '0%'; }); }
  st[v.id].timer = setTimeout(() => hide(v), v.secs * 1000);
});
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    const t = document.getElementById('t-linear');
    if (t && t.classList.contains('on')) { e.preventDefault(); st.linear.bal += 1000; setBal('linear'); hide(V.find(x => x.id === 'linear')); }
  }
});
V.forEach(v => setBal(v.id));
</script>
</body></html>`;
writeFileSync(join(here, 'toast-lab.html'), html);
console.log('gen/looks/people/toast-lab.html · ' + (html.length / 1024).toFixed(0) + 'KB');
