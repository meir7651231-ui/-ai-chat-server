/* base.mjs — השלד המשותף לכל מסכי-המוסד.
   משותף: טוקנים · איפוס · כללי-RTL · מגירת-האגפים · הדפסה.
   לא משותף: המבנה. כל מסך בונה לעצמו מסגרת אחרת — זו הדרישה («שום מסך לא דומה לאחר»). */

export const DEPTS = [
  ['bait',    'בית',        '🏛'],
  ['anashim', 'אנשים',      '👥'],
  ['hinuch',  'חינוך',      '📚'],
  ['tzevet',  'צוות',       '🧰'],
  ['gviya',   'גבייה',      '₪'],
  ['trumot',  'תרומות',     '❤'],
  ['ksafim',  'כספים',      '📊'],
  ['medrash', 'בית המדרש',  '🕯'],
  ['hatzer',  'החצר',       '👑'],
  ['hesed',   'חסד',        '🤝'],
  ['tifol',   'תפעול',      '🔧'],
  ['shiduch', 'שידוכים',    '💍'],
  ['tikshor', 'תקשורת',     '✉'],
];

/* הפלטה היא אותה פלטה של מסך-הגבייה שאושר. מה שמשתנה בין מסכים הוא --acc בלבד. */
export const TOKENS = `:root{
 --bg:#fbfbfa;--card:#fff;--sunk:#f4f3f0;--raise:#ebe9e5;--ink:#37352F;--mut:#6b675e;--faint:#8a857b;
 --hair:rgba(0,0,0,.1);--acc:#2560D0;--acc-soft:#eaf1fe;--on-acc:#fff;--ok:#12703d;--ok-soft:#e3f3ea;
 --warn:#8a5e00;--warn-soft:#fbf0d8;--err:#a8281a;--err-soft:#fbe7e4;
 --c1:#2560D0;--c1-soft:#eaf1fe;--c2:#12703d;--c2-soft:#e3f3ea;--c3:#8a5e00;--c3-soft:#fbf0d8;
 --c4:#6a3fc0;--c4-soft:#f0ebfb;--c5:#a8281a;--c5-soft:#fbe7e4;--c6:#0c6570;--c6-soft:#e2f2f4;
 --s1:4px;--s2:8px;--s3:12px;--s4:16px;--s5:24px;--s6:32px;--s7:48px;
 --r:16px;--rs:10px;--row:44px;--dir:-1;color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#0d0d0f;--card:#161619;--sunk:#1c1c20;--raise:#26262b;--ink:#ECE9E2;--mut:#a8a299;--faint:#8b857c;
 --hair:rgba(236,233,226,.14);--acc:#7FA6F5;--acc-soft:#1a2436;--on-acc:#0B0B0D;--ok:#5cd79b;--ok-soft:#14261d;
 --warn:#e8bd5c;--warn-soft:#2a2318;--err:#f08d80;--err-soft:#2c1a17;
 --c1:#7FA6F5;--c1-soft:#1a2436;--c2:#5cd79b;--c2-soft:#14261d;--c3:#e8bd5c;--c3-soft:#2a2318;
 --c4:#b79bf0;--c4-soft:#221c32;--c5:#f08d80;--c5-soft:#2c1a17;--c6:#63c6d2;--c6-soft:#152628;color-scheme:dark}}
:root[data-theme=dark]{--bg:#0d0d0f;--card:#161619;--sunk:#1c1c20;--raise:#26262b;--ink:#ECE9E2;--mut:#a8a299;--faint:#8b857c;--hair:rgba(236,233,226,.14);--acc:#7FA6F5;--acc-soft:#1a2436;--on-acc:#0B0B0D;--ok:#5cd79b;--ok-soft:#14261d;--warn:#e8bd5c;--warn-soft:#2a2318;--err:#f08d80;--err-soft:#2c1a17;--c1:#7FA6F5;--c1-soft:#1a2436;--c2:#5cd79b;--c2-soft:#14261d;--c3:#e8bd5c;--c3-soft:#2a2318;--c4:#b79bf0;--c4-soft:#221c32;--c5:#f08d80;--c5-soft:#2c1a17;--c6:#63c6d2;--c6-soft:#152628;color-scheme:dark}`;

export const RESET = `*{box-sizing:border-box}
html,body{overflow-x:hidden}
body{margin:0;background:var(--bg);color:var(--ink);font:400 16px/1.5 Heebo,Arial,sans-serif;letter-spacing:0}
bdi{unicode-bidi:isolate}.num{font-variant-numeric:tabular-nums}
button,input,select,textarea{font:inherit;color:inherit}button{cursor:pointer}
h1,h2,h3,h4{margin:0;text-wrap:balance}p{margin:0}
ul,ol{margin:0;padding:0;list-style:none}
:focus-visible{outline:2px solid var(--acc);outline-offset:2px;border-radius:4px}
.skip{position:absolute;inset-inline-start:-9999px;top:0;background:var(--acc);color:var(--on-acc);padding:var(--s2) var(--s4);border-radius:var(--rs);z-index:99}
.skip:focus{inset-inline-start:var(--s4);top:var(--s2)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
/* מגירת-האגפים: ב-NAV_CSS */
@media print{.nav,.skip{display:none!important}body{background:#fff}}`;

export const NAV_CSS = `.nav{position:relative;font-size:0}
.nav>summary{list-style:none;cursor:pointer;display:inline-flex;align-items:center;gap:var(--s2);
 border:1px solid var(--hair);background:var(--card);color:var(--ink);border-radius:999px;padding:7px 14px;font-size:13.5px;min-height:38px}
.nav>summary::-webkit-details-marker{display:none}
.nav>summary::after{content:'▾';color:var(--faint)}
.nav[open]>summary{border-color:var(--acc)}
.nav .sheet{position:absolute;inset-inline-end:0;top:calc(100% + 6px);z-index:40;background:var(--card);
 border:1px solid var(--hair);border-radius:var(--r);padding:var(--s2);box-shadow:0 12px 32px rgba(0,0,0,.14);
 display:grid;grid-template-columns:repeat(2,minmax(120px,1fr));gap:2px;width:max-content;max-width:min(92vw,340px)}
.nav .sheet a{display:flex;align-items:center;gap:var(--s2);padding:8px 10px;border-radius:var(--rs);
 color:var(--ink);text-decoration:none;font-size:13.5px;white-space:nowrap}
.nav .sheet a:hover{background:var(--sunk)}
.nav .sheet a[aria-current=page]{background:var(--acc-soft);color:var(--acc);font-weight:700}
.nav .sheet i{font-style:normal;width:18px;text-align:center;opacity:.75}
`;

export const money = (n) => '<bdi dir="ltr">₪' + Number(n).toLocaleString('he-IL') + '</bdi>';
export const ltr = (s) => '<bdi dir="ltr">' + s + '</bdi>';

export function navDrawer(id) {
  return `<details class="nav"><summary aria-label="מעבר לאגף">${DEPTS.find(d => d[0] === id)[1]}</summary>
  <nav class="sheet" aria-label="אגפי המוסד">${DEPTS.map(([k, n, e]) =>
    `<a href="${k === 'bait' ? 'index.html' : k + '.html'}"${k === id ? ' aria-current="page"' : ''}><i aria-hidden="true">${e}</i>${n}</a>`).join('')}</nav></details>`;
}

/** page — עוטף מסך שלם. fonts: משפחות Google נוספות מעבר ל-Heebo. */
export function page({ id, title, desc, fonts = [], css, body, js = '' }) {
  const fam = ['Heebo:wght@400;500;600;700;800', ...fonts];
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fam.map(f => 'family=' + f).join('&')}&display=swap">
<style>
${TOKENS}
${RESET}
${NAV_CSS}
${css}
</style>
</head>
<body>
<a class="skip" href="#main">דלג לתוכן</a>
${body}
${js ? '<script>\n' + js + '\n</script>' : ''}
</body>
</html>
`;
}
