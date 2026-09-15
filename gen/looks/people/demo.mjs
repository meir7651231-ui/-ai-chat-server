/* demo.mjs — עשר הדרכים שבהן מוצרים מובילים מעצבים «בצע · אפשר להחזיר · רשום».
   כל לוח כאן הוא מימוש עובד של הדפוס של אותו מוצר, על אותה פעולה בדיוק:
   «רישום תשלום ₪1,000 · משפחת אונגר». הערכים המספריים נשלפו מעמודי-העזרה
   הציבוריים שלהם (undo.json) ולא מהזיכרון.
   הרצה: node gen/looks/people/demo.mjs */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));

const CARDS = [
  { id: 'slack', n: 1, name: 'Slack', kind: 'חלון-חרטה', win: 15,
    rule: '15 שניות, ואז זה סופי', src: 'slack.com/help — "within 15 seconds of sending"',
    why: 'הכי קצר בקבוצה. מתאים לפעולה שקורית עשרות פעמים ביום ורובן נכונות.' },
  { id: 'gmail', n: 2, name: 'Gmail', kind: 'חלון-חרטה', win: 30, choose: [5, 10, 20, 30],
    rule: 'המשתמש בוחר 5 · 10 · 20 · 30 שניות', src: 'support.google.com — "select a Send cancellation period"',
    why: 'ההחלטה היחידה בקבוצה שנמסרה למשתמש. מי שנלחץ מאריך, מי שבטוח מקצר.' },
  { id: 'linear', n: 3, name: 'Linear', kind: 'חלון-חרטה', win: 8, kbd: true,
    rule: 'טוסט קצר + Ctrl+Z תמיד', src: 'linear.app/docs — קיצורי-מקלדת',
    why: 'הטוסט הוא תזכורת, לא המנגנון. המנגנון הוא המקלדת — ולכן הוא קצר.' },
  { id: 'notion', n: 4, name: 'Notion', kind: 'סל-אשפה', days: 30,
    rule: 'אין טוסט. הפריט עובר לסל ל-30 יום', src: 'notion.com/help — "30 days before they are permanently deleted"',
    why: 'לא מפריע בזמן אמת. מי שהתחרט אחרי שבוע עדיין מוצא.' },
  { id: 'photos', n: 5, name: 'Apple Photos', kind: 'סל-אשפה', days: 30,
    rule: '«נמחקו לאחרונה» — 30 יום, עם מונה ימים על כל פריט', src: 'התבנית של iOS',
    why: 'הסל עצמו הוא מסך, ורואים כמה ימים נשארו לכל פריט.' },
  { id: 'figma', n: 6, name: 'Figma', kind: 'ציר-גרסאות', every: 30, days: 30,
    rule: 'נקודת-שמירה כל 30 דקות · אפשר לתת שם לגרסה', src: 'help.figma.com — "records a new checkpoint every 30 minutes"',
    why: 'לא «בטל» אלא «חזור לנקודה». מתאים לעבודה מתמשכת, לא לפעולה בודדת.' },
  { id: 'dropbox', n: 7, name: 'Dropbox', kind: 'ציר-גרסאות',
    rule: 'כל גרסה נשמרת; שחזור יוצר גרסה חדשה', src: 'help.dropbox.com — version history',
    why: 'שחזור לא מוחק את מה שהיה — הוא מוסיף. ההיסטוריה תמיד גדלה.' },
  { id: 'stripe', n: 8, name: 'Stripe', kind: 'רישום-נגדי', days: 30,
    rule: 'אין ביטול. יש **זיכוי** שמפנה לחיוב המקורי', src: 'docs.stripe.com/refunds — "30 days from the post date"',
    why: '🔴 זה הדפוס לכסף. החיוב נשאר לנצח, ולידו שורת-זיכוי. שתי שורות, לא אפס.' },
  { id: 'books', n: 9, name: 'QuickBooks · Xero', kind: 'רישום-נגדי',
    rule: 'יומן-ביקורת בלתי-ניתן-לעריכה: מי · מה · מתי', src: 'quickbooks · central.xero.com — audit log',
    why: 'אפילו בעל-החשבון לא יכול למחוק שורה. זו דרישת-רגולציה, לא העדפה.' },
  { id: 'github', n: 10, name: 'GitHub', kind: 'רישום-נגדי',
    rule: 'Revert = קומיט חדש שמבטל. ההיסטוריה לא נכתבת מחדש', src: 'docs.github.com',
    why: 'אותו רעיון של Stripe, בקוד: מבטלים בהוספה, לא במחיקה.' },
];

const K = { 'חלון-חרטה': '#9fe870', 'סל-אשפה': '#a5ed6e', 'ציר-גרסאות': '#8cd6ff', 'רישום-נגדי': '#ff9f43' };
const md = (s) => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

const card = (c) => `<section class="c" data-kind="${c.kind}">
 <header><span class="n">${c.n}</span><h2>${c.name}</h2><span class="k" style="--k:${K[c.kind]}">${c.kind}</span></header>
 <p class="rule">${md(c.rule)}</p>
 <div class="pay">
   <div class="row"><span class="fam">משפחת אונגר</span><span class="bal" id="bal-${c.id}"><bdi dir="ltr">₪14,428</bdi></span></div>
   <button class="go" data-do="${c.id}">רישום תשלום <bdi dir="ltr">₪1,000</bdi></button>
   ${c.choose ? `<label class="pick">חלון: <select id="win-${c.id}">${c.choose.map(v => `<option value="${v}"${v === c.win ? ' selected' : ''}>${v} שניות</option>`).join('')}</select></label>` : ''}
   ${c.kbd ? '<span class="hint"><kbd>Ctrl</kbd>+<kbd>Z</kbd> עובד גם כאן</span>' : ''}
 </div>
 <ul class="ledger" id="led-${c.id}" aria-live="polite"><li class="none">הספר ריק</li></ul>
 <p class="why">${md(c.why)}</p>
 <p class="src">מקור: ${c.src}</p>
</section>`;

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>עשר דרכים להחזיר פעולה</title>
<meta name="description" content="עשרה דפוסי ביטול-והחזרה של מוצרים מובילים, ממומשים על אותה פעולה: רישום תשלום.">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&display=swap">
<style>
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{--bg:#0f0f0e;--card:#1a1a17;--hair:#2f2f2a;--ink:#f2f0eb;--mut:#b5b0a4;--acc:#9fe870;--accInk:#163300;--warn:#ff9f43}
@media(prefers-color-scheme:light){:root:not([data-theme=dark]){--bg:#f7f5f0;--card:#fff;--hair:#dcdad0;--ink:#191814;--mut:#5b5749}}
body{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.55 Heebo,Arial,sans-serif;padding:26px 20px 60px}
button,select,input{font:inherit;color:inherit}button{cursor:pointer}
h1,h2{margin:0}p{margin:0}ul{margin:0;padding:0;list-style:none}
:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
bdi{unicode-bidi:isolate}
header.top{max-width:1500px;margin:0 auto 10px}
h1{font-size:clamp(26px,4vw,38px);font-weight:800;letter-spacing:-.01em}
p.lead{color:var(--mut);max-width:78ch;margin-top:8px}
p.lead b{color:var(--ink)}
.grid{max-width:1500px;margin:22px auto 0;display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px}
.c{background:var(--card);border:1px solid var(--hair);border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:12px}
.c header{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.c .n{width:30px;height:30px;border-radius:999px;background:var(--acc);color:var(--accInk);display:grid;place-items:center;font-weight:800;font-size:15px;flex:none}
.c h2{font-size:19px;font-weight:700}
.c .k{margin-inline-start:auto;font-size:12px;font-weight:700;border-radius:999px;padding:4px 10px;background:color-mix(in srgb,var(--k) 22%,transparent);color:var(--k);border:1px solid color-mix(in srgb,var(--k) 45%,transparent)}
.rule{font-size:14.5px;color:var(--mut)}
.pay{border:1px solid var(--hair);border-radius:12px;padding:12px;display:grid;gap:10px}
.row{display:flex;align-items:center;gap:10px;font-size:15px}
.fam{font-weight:700}.bal{margin-inline-start:auto;font-variant-numeric:tabular-nums;font-weight:700}
.go{background:var(--acc);color:var(--accInk);border:0;border-radius:999px;padding:0 18px;min-height:44px;font-weight:700;font-size:15px}
.go:disabled{opacity:.45;cursor:not-allowed}
.pick{font-size:13px;color:var(--mut);display:flex;gap:8px;align-items:center}
.pick select{background:transparent;border:1px solid var(--hair);border-radius:8px;padding:5px 8px}
.hint{font-size:12.5px;color:var(--mut)}
kbd{font:500 11px ui-monospace,Menlo,monospace;background:var(--hair);border-radius:4px;padding:2px 5px}
.ledger{display:grid;gap:6px;min-height:34px}
.ledger li{font-size:13.5px;display:flex;gap:8px;align-items:baseline;border-inline-start:3px solid var(--hair);padding-inline-start:9px}
.ledger li.none{color:var(--mut);border-color:transparent;padding-inline-start:0}
.ledger li.add{border-color:var(--acc)}
.ledger li.rev{border-color:var(--warn)}
.ledger li.gone{opacity:.45;text-decoration:line-through}
.ledger .t{margin-inline-start:auto;color:var(--mut);font-size:12px;font-variant-numeric:tabular-nums}
.why{font-size:14px}
.src{font-size:12px;color:var(--mut)}
.toast{position:fixed;inset-block-end:calc(18px + env(safe-area-inset-bottom,0px));inset-inline-start:50%;transform:translateX(50%);
 background:#191814;color:#fff;border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:14px;
 box-shadow:0 12px 34px rgb(0 0 0/.5);z-index:50;font-size:14.5px;max-width:min(92vw,520px)}
.toast button{background:none;border:0;color:var(--acc);font-weight:700;padding:6px 8px;border-radius:8px}
.toast .bar{position:absolute;inset-inline:0;inset-block-end:0;height:3px;background:var(--acc);border-end-start-radius:12px;border-end-end-radius:12px}
@media(prefers-reduced-motion:reduce){.toast .bar{transition:none!important}}
</style></head>
<body>
<header class="top">
  <h1>עשר דרכים להחזיר פעולה</h1>
  <p class="lead">אותה פעולה בדיוק — <b>רישום תשלום ₪1,000 למשפחת אונגר</b> — בעשרת הדפוסים של המוצרים
  שהפעולה הזו היא הליבה שלהם. <b>לחץ בכל לוח</b> ותראה מה קורה לספר. המספרים נשלפו מעמודי-העזרה הציבוריים שלהם.</p>
</header>
<div class="grid">${CARDS.map(card).join('\n')}</div>
<script>
const CARDS = ${JSON.stringify(CARDS)};
const nis = n => '₪' + n.toLocaleString('en-US');
const state = {};
CARDS.forEach(c => state[c.id] = { bal: 14428, rows: [], last: null });

const paint = (c) => {
  const s = state[c.id];
  document.getElementById('bal-' + c.id).innerHTML = '<bdi dir="ltr">' + nis(s.bal) + '</bdi>';
  const led = document.getElementById('led-' + c.id);
  led.innerHTML = s.rows.length
    ? s.rows.map(r => '<li class="' + r.cls + '"><span>' + r.text + '</span><span class="t">' + r.t + '</span></li>').join('')
    : '<li class="none">הספר ריק</li>';
};
const now = () => new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

let toastEl = null, toastTimer = null;
const closeToast = () => { if (toastEl) { toastEl.remove(); toastEl = null; } if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; } };
const showToast = (msg, secs, onUndo) => {
  closeToast();
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status');
  t.innerHTML = '<span>' + msg + '</span><button type="button">בטל</button><i class="bar"></i>';
  document.body.appendChild(t); toastEl = t;
  t.querySelector('button').onclick = () => { onUndo(); closeToast(); };
  const bar = t.querySelector('.bar');
  requestAnimationFrame(() => { bar.style.transition = 'width ' + secs + 's linear'; bar.style.width = '0%'; });
  bar.style.width = '100%';
  toastTimer = setTimeout(closeToast, secs * 1000);
};

const undoable = {};
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-do]'); if (!b) return;
  const c = CARDS.find(x => x.id === b.dataset.do), s = state[c.id];

  if (c.kind === 'חלון-חרטה') {
    s.bal -= 1000;
    const row = { text: 'נרשם תשלום ' + nis(1000), t: now(), cls: 'add' };
    s.rows.unshift(row); paint(c);
    const secs = c.choose ? +document.getElementById('win-' + c.id).value : c.win;
    const undo = () => { s.bal += 1000; s.rows = s.rows.filter(r => r !== row); paint(c); undoable[c.id] = null; };
    undoable[c.id] = undo;
    showToast('נרשם תשלום של ' + nis(1000), secs, undo);
    setTimeout(() => { if (undoable[c.id] === undo) undoable[c.id] = null; }, secs * 1000);

  } else if (c.kind === 'סל-אשפה') {
    s.bal -= 1000;
    s.rows.unshift({ text: 'נרשם תשלום ' + nis(1000), t: now(), cls: 'add' });
    s.rows.unshift({ text: '↩ בסל — ניתן לשחזור ' + c.days + ' יום', t: 'נותרו ' + c.days + ' יום', cls: 'rev' });
    paint(c);

  } else if (c.kind === 'ציר-גרסאות') {
    s.bal -= 1000;
    const v = s.rows.filter(r => r.cls === 'add').length + 1;
    s.rows.unshift({ text: 'גרסה ' + v + ' · נרשם תשלום ' + nis(1000), t: now(), cls: 'add' });
    if (c.every) s.rows.unshift({ text: '⏱ נקודת-שמירה הבאה בעוד ' + c.every + ' דק׳', t: '', cls: '' });
    paint(c);

  } else { /* רישום-נגדי */
    s.bal -= 1000;
    s.rows.unshift({ text: 'חיוב · נרשם תשלום ' + nis(1000), t: now(), cls: 'add' });
    paint(c);
    const btn = document.createElement('button');
    btn.className = 'go'; btn.type = 'button'; btn.textContent = 'הפקת זיכוי ' + nis(1000);
    btn.style.background = 'transparent'; btn.style.color = 'var(--warn)';
    btn.style.border = '1.5px solid var(--warn)';
    btn.onclick = () => {
      s.bal += 1000;
      s.rows.unshift({ text: '↺ זיכוי · מבטל את החיוב שמעליו', t: now(), cls: 'rev' });
      paint(c); btn.remove();
    };
    b.parentElement.appendChild(btn);
  }
});

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    const f = undoable['linear']; if (f) { e.preventDefault(); f(); closeToast(); }
  }
});
CARDS.forEach(paint);
</script>
</body></html>`;
writeFileSync(join(here, 'undo-demo.html'), html);
console.log('gen/looks/people/undo-demo.html · ' + (html.length / 1024).toFixed(0) + 'KB');
