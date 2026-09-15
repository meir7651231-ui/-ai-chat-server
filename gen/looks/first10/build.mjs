/* first10 — עשר גרסאות-עיצוב של מסך-הבית.
   אותו תוכן, אותם מספרים (נגזרים מהמחסן של האפליקציה), עשר שפות-עיצוב שונות:
   פונט אחר · כפתור אחר · מבנה אחר · פלטה אחרת. הרצה: node gen/looks/first10/build.mjs */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

/* ---- הנתונים: מריצים את המחסן של האפליקציה ושואבים ממנו, לא ממציאים ---- */
const raw = JSON.parse(readFileSync(join(here, '..', '..', 'mosad.data.json'), 'utf8'));
const SPEC = {
  roles: raw.roles.map(r => typeof r === 'string' ? r : r.name),
  depts: raw.departments.map(d => ({
    n: d.name, e: (d.entities || []).map(e => ({ n: e.name, st: e.stages || [], fb: e.forbidden || [], mo: e.moment || '', f: (e.fields || []).map(f => [f.name, f.shape || '', f.required ? 1 : 0]) })),
  })),
};
const storeSrc = readFileSync(join(here, '..', 'app', 'src', '01-store.js'), 'utf8');
const D = new Function('SPEC', storeSrc + `
  build();
  const t = totals(), f = fund(), camp = DB.campaigns[0];
  return {
    today: DB.today, tariff: DB.tariff,
    pct: t.pct, paid: t.paid, open: t.open, due: t.due,
    students: DB.students.length, families: DB.families.length, people: DB.people.length,
    staff: DB.staff.length, present: presentToday(),
    absent: DB.staff.filter(s => s.absent).length,
    subs: DB.staff.filter(s => s.absent && s.sub).length,
    raised: raised(camp.id), goal: camp.goal, camp: camp.name,
    donations: DB.donations.filter(d => d.campaignId === camp.id).length,
    fund: f.free, fundOut: f.out, loansOpen: DB.loans.filter(l => l.stage === 'בקשה').length, loans: DB.loans.length,
    late: lateFamilies().length, queue: DB.queue.filter(q => q.state === 'wait').length,
    noDriver: DB.routes.filter(r => !r.driver).map(r => r.name),
    att: DB.classes.map(c => ({ name: c.name, pct: attendanceOf(c.id) })),
    attAll: Math.round(DB.classes.reduce((a, c) => a + attendanceOf(c.id), 0) / DB.classes.length),
    minyanim: DB.minyanim.map(m => ({ time: m.time, name: m.name, where: m.where, count: m.count })),
    depts: [['אנשים', DB.people.length + ' רשומות'], ['חינוך', DB.students.length + ' תלמידים'],
      ['צוות', DB.staff.length + ' עובדים'], ['גבייה', t.pct + '% מהחיוב'],
      ['תרומות', DB.campaigns.length + ' מגביות'], ['כספים', 'תקציב ' + DB.tariff.year],
      ['בית המדרש', DB.minyanim.length + ' זמנים'], ['החצר', DB.queue.filter(q => q.state === 'wait').length + ' בתור'],
      ['חסד', DB.loans.length + ' הלוואות'], ['תפעול', DB.routes.length + ' קווים'],
      ['שידוכים', DB.proposals.length + ' הצעות'], ['תקשורת', DB.groups.length + ' קבוצות']],
  };
`)(SPEC);

/* עזרי-תצוגה משותפים לכל העיצובים (תוכן, לא מראה) */
D.nis = (n) => '₪' + Math.round(n).toLocaleString('he-IL');
D.money = (n) => '<bdi dir="ltr">' + D.nis(n) + '</bdi>';
D.k = (n) => '<bdi dir="ltr">₪' + Math.round(n / 1000).toLocaleString('he-IL') + 'K</bdi>';
D.num = (n) => '<bdi dir="ltr">' + Number(n).toLocaleString('he-IL') + '</bdi>';
D.ltr = (s) => '<bdi dir="ltr">' + s + '</bdi>';
D.now = D.minyanim[4];
D.alerts = [
  ['ביטוח האולם פג בעוד 6 ימים', 'כספים', 1],
  [D.late + ' משפחות בפיגור בלי הוראת קבע', 'גבייה', 2],
  ...D.noDriver.map(n => [n + ' בלי נהג למחר', 'תפעול', 2]),
  [D.queue + ' ממתינים בקבלת קהל', 'החצר', 3],
];

/* ---- הרכבה ---- */
const BASE = `*{box-sizing:border-box}html,body{overflow-x:hidden}body{margin:0}
bdi{unicode-bidi:isolate}button,input,select{font:inherit;color:inherit}button{cursor:pointer}
h1,h2,h3{margin:0}p{margin:0}ul,ol{margin:0;padding:0;list-style:none}a{color:inherit}
:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
@media print{.noprint{display:none!important}}`;

const files = readdirSync(join(here, 'designs')).filter(f => f.endsWith('.mjs')).sort();
const made = [];
for (const f of files) {
  const mod = (await import(join(here, 'designs', f))).default;
  if (!mod) continue;                    // kits.mjs מייצא חלקים בלבד, לא מסכים
  for (const d of [].concat(mod)) {
  const fam = d.fonts.map(x => 'family=' + x).join('&');
  const html = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${d.name} — מסך הבית</title>
<meta name="description" content="גרסת עיצוב «${d.name}» למסך הבית של המוסד. ${d.ref}">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fam}&display=swap">
<style>
${BASE}
${d.css}
</style>
</head>
<body>
${d.body(D)}
</body>
</html>
`;
  writeFileSync(join(here, d.id + '.html'), html);
  made.push(d);
  }
}

/* ---- דף-הבחירה: עשר תצוגות חיות, בלחיצה נפתח מסך מלא ---- */
const index = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>עשר גרסאות למסך הבית</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&display=swap">
<style>
${BASE}
body{background:#11110f;color:#f3f1ec;font:400 16px/1.5 Heebo,Arial,sans-serif;padding:20px}
header{max-width:1400px;margin:0 auto 20px}
h1{font-size:26px;font-weight:800}
p.s{color:#a8a396;font-size:14px;margin-top:6px;max-width:70ch}
.grid{max-width:1400px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:18px}
figure{margin:0;background:#1a1a17;border:1px solid #2e2e29;border-radius:14px;overflow:hidden}
.win{height:300px;overflow:hidden;position:relative;background:#fff}
.win iframe{width:250%;height:250%;border:0;transform:scale(.4);transform-origin:top right;pointer-events:none}
figcaption{padding:12px 14px;display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
figcaption b{font-size:16px}
figcaption .no{font:800 12px Heebo;background:#2e2e29;color:#f3f1ec;border-radius:999px;padding:2px 9px}
figcaption span{font-size:12.5px;color:#a8a396;width:100%}
figcaption a{margin-inline-start:auto;font-size:13px;color:#8fb4ff;text-decoration:none}
figcaption a:hover{text-decoration:underline}
</style>
</head>
<body>
<header>
  <h1>עשר גרסאות למסך הבית</h1>
  <p class="s">אותו תוכן ואותם מספרים — נגזרים מהמחסן של המערכת. מה שמשתנה: הפונט, הכפתורים,
     הפלטה והמבנה. לחיצה על «פתח» מציגה את המסך המלא.</p>
</header>
<div class="grid">
${made.map((d, i) => `  <figure>
    <div class="win"><iframe src="${d.id}.html" title="${d.name}" loading="lazy" scrolling="no"></iframe></div>
    <figcaption><span class="no">${i + 1}</span><b>${d.name}</b>
      <a href="${d.id}.html">פתח ←</a><span>${d.ref}</span></figcaption>
  </figure>`).join('\n')}
</div>
</body>
</html>
`;
writeFileSync(join(here, 'index.html'), index);
console.log(made.map((d, i) => String(i + 1).padStart(2) + '. ' + d.id.padEnd(16) + d.name.padEnd(12) + d.ref).join('\n'));
console.log('\nמספרים משותפים: גבייה ' + D.pct + '% · ' + D.nis(D.paid) + ' · ' + D.students + ' תלמידים · ' +
  D.present + '/' + D.staff + ' צוות · מגבית ' + D.nis(D.raised));
