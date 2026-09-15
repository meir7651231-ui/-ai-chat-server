/* full5 — מסך-הבית במלואו, בחמש השפות של חמשת האתרים.
   לא תקציר: כל מסך בנוי כמו העמוד האמיתי של אותו אתר — סרגל-צד, מדפים, רשימות-תנועות,
   לוח-ליגה, פס-תחתון — ומלא בנתונים אמיתיים מהמחסן של האפליקציה.
   הרצה: node gen/looks/full5/build.mjs */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(readFileSync(join(here, '..', '..', 'mosad.data.json'), 'utf8'));
const SPEC = {
  roles: raw.roles.map(r => typeof r === 'string' ? r : r.name),
  depts: raw.departments.map(d => ({ n: d.name, e: (d.entities || []).map(e => ({ n: e.name, st: e.stages || [], fb: e.forbidden || [], mo: e.moment || '', f: (e.fields || []).map(f => [f.name, f.shape || '', f.required ? 1 : 0]) })) })),
};
const storeSrc = readFileSync(join(here, '..', 'app', 'src', '01-store.js'), 'utf8');

/* שאיבה עשירה — לא רק מונים, אלא הרשימות עצמן */
const D = new Function('SPEC', storeSrc + `
  const sortBy = (arr, f, dir = 1) => [...arr].sort((a, b) => (f(a) > f(b) ? 1 : f(a) < f(b) ? -1 : 0) * dir);
  build();
  const t = totals(), fn = fund(), camp = DB.campaigns[0];
  const famRow = f => ({ id: f.id, name: f.name, city: f.city, kids: f.kids.length, bal: balance(f),
    due: discounted(f), paid: f.paid, hok: f.hok, disc: f.discount, init: f.name.replace('משפחת ','').slice(0,2) });
  return {
    today: DB.today, tariff: DB.tariff,
    pct: t.pct, paid: t.paid, open: t.open, due: t.due,
    students: DB.students.length, families: DB.families.length, people: DB.people.length,
    staff: DB.staff.length, present: presentToday(), absent: DB.staff.filter(s => s.absent).length,
    subs: DB.staff.filter(s => s.absent && s.sub).length,
    raised: raised(camp.id), goal: camp.goal, camp: camp.name,
    donations: DB.donations.filter(d => d.campaignId === camp.id).length,
    fund: fn.free, fundCap: fn.cap, fundOut: fn.out, fundLate: fn.late,
    loans: DB.loans.length, loansOpen: DB.loans.filter(l => l.stage === 'בקשה').length,
    late: lateFamilies().length, queueN: DB.queue.filter(q => q.state === 'wait').length,
    attAll: Math.round(DB.classes.reduce((a, c) => a + attendanceOf(c.id), 0) / DB.classes.length),

    /* רשימות */
    topOpen: sortBy(DB.families.filter(f => balance(f) > 0), f => -balance(f)).slice(0, 14).map(famRow),
    lateList: sortBy(lateFamilies(), f => -balance(f)).slice(0, 10).map(famRow),
    payList: DB.payments.slice(0, 16).map(p => ({ fam: fam(p.familyId).name, init: fam(p.familyId).name.replace('משפחת ','').slice(0,2),
      id: p.familyId, amount: p.amount, method: p.method, ago: p.ago })),
    classes: DB.classes.map(c => ({ id: c.id, name: c.name, room: c.room, n: c.students.length,
      pct: attendanceOf(c.id), rebbe: nameOf(staff(c.rebbe).personId) })),
    staffList: DB.staff.map(s => ({ id: s.id, name: nameOf(s.personId), role: s.role, absent: s.absent,
      sub: s.sub ? nameOf(staff(s.sub).personId) : null, shifts: s.shifts.length,
      first: s.shifts[0] ? s.shifts[0][0] + '–' + s.shifts[0][1] : null, init: nameOf(s.personId).slice(0,2) })),
    minyanim: DB.minyanim.map(m => ({ time: m.time, name: m.name, where: m.where, count: m.count })),
    donList: DB.donations.slice(0, 14).map(d => { const dn = DB.donors.find(x => x.id === d.donorId);
      return { name: dn.anon ? 'בעילום שם' : nameOf(dn.personId), city: dn.city, amount: d.amount, method: d.method,
        camp: DB.campaigns.find(c => c.id === d.campaignId).name, init: nameOf(dn.personId).slice(0,2) }; }),
    loanList: DB.loans.slice(0, 12).map(l => ({ fam: fam(l.familyId).name, id: l.familyId, amount: l.amount,
      purpose: l.purpose, stage: l.stage, g: l.guarantors, paid: l.paid, inst: l.installments,
      init: fam(l.familyId).name.replace('משפחת ','').slice(0,2) })),
    queue: DB.queue.map(q => ({ no: q.no, fam: fam(q.familyId).name, reason: q.reason, state: q.state,
      init: fam(q.familyId).name.replace('משפחת ','').slice(0,2) })),
    routes: DB.routes.map(r => ({ id: r.id, name: r.name, driver: r.driver ? nameOf(staff(r.driver).personId) : null,
      stops: r.stops.length, riders: ridersOf(r), first: r.stops[0].time, last: r.stops[r.stops.length-1].time })),
    calls: DB.calls.map(c => ({ text: c.text, sev: c.sev, days: c.days, owner: c.owner ? nameOf(staff(c.owner).personId) : null })),
    yahr: DB.yahrzeits.map(y => ({ name: y.name, day: y.day, fam: fam(y.familyId).name })),
    budget: DB.budget.map(b => ({ name: b.name, plan: b.plan, actual: budgetActual(b) })),
    log: DB.log.map(e => ({ what: e.what, dept: e.dept, when: e.when, who: e.who })),
    students20: DB.students.slice(0, 20).map(s => ({ name: nameOf(s.personId), cls: cls(s.classId).name,
      att: s.att.filter(Boolean).length, fam: fam(s.familyId).name, init: nameOf(s.personId).slice(0,2) })),
    depts: [['אנשים', DB.people.length + ' רשומות', '👥'], ['חינוך', DB.students.length + ' תלמידים', '📚'],
      ['צוות', DB.staff.length + ' עובדים', '🧰'], ['גבייה', t.pct + '% מהחיוב', '₪'],
      ['תרומות', DB.campaigns.length + ' מגביות', '❤'], ['כספים', 'תקציב ' + DB.tariff.year, '📊'],
      ['בית המדרש', DB.minyanim.length + ' זמנים', '🕯'], ['החצר', DB.queue.filter(q => q.state === 'wait').length + ' בתור', '👑'],
      ['חסד', DB.loans.length + ' הלוואות', '🤝'], ['תפעול', DB.routes.length + ' קווים', '🔧'],
      ['שידוכים', DB.proposals.length + ' הצעות', '💍'], ['תקשורת', DB.groups.length + ' קבוצות', '✉']],
  };
`)(SPEC);

D.nis = (n) => '₪' + Math.round(n).toLocaleString('he-IL');
D.money = (n) => '<bdi dir="ltr">' + D.nis(n) + '</bdi>';
D.k = (n) => '<bdi dir="ltr">₪' + Math.round(n / 1000).toLocaleString('he-IL') + 'K</bdi>';
D.num = (n) => '<bdi dir="ltr">' + Number(n).toLocaleString('he-IL') + '</bdi>';
D.ltr = (s) => '<bdi dir="ltr">' + s + '</bdi>';
D.now = D.minyanim[4];
D.alerts = [
  ['ביטוח האולם פג בעוד 6 ימים', 'כספים', 1],
  [D.late + ' משפחות בפיגור בלי הוראת קבע', 'גבייה', 2],
  ...D.routes.filter(r => !r.driver).map(r => [r.name + ' בלי נהג למחר', 'תפעול', 2]),
  [D.queueN + ' ממתינים בקבלת קהל', 'החצר', 3],
  [D.loansOpen + ' בקשות גמ״ח ממתינות לוועדה', 'חסד', 3],
];

const BASE = `*{box-sizing:border-box}html,body{overflow-x:hidden}body{margin:0}
bdi{unicode-bidi:isolate}button,input,select{font:inherit;color:inherit}button{cursor:pointer}
h1,h2,h3,h4{margin:0}p{margin:0}ul,ol{margin:0;padding:0;list-style:none}a{color:inherit;text-decoration:none}
img{max-width:100%}:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
@media print{.noprint{display:none!important}}`;

const files = readdirSync(join(here, 'screens')).filter(f => f.endsWith('.mjs')).sort();
const made = [];
for (const f of files) {
  const d = (await import(join(here, 'screens', f))).default;
  const html = `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${d.name} — מסך הבית המלא</title>
<meta name="description" content="מסך הבית של המוסד בשפת ${d.name}, מלא. ${d.ref}">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${d.fonts.map(x => 'family=' + x).join('&')}&display=swap">
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

const index = `<!doctype html>
<html lang="he" dir="rtl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>מסך הבית — חמש גרסאות מלאות</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&display=swap">
<style>${BASE}
body{background:#0f0f0e;color:#f2f0eb;font:400 16px/1.5 Heebo,Arial,sans-serif;padding:22px}
header{max-width:1500px;margin:0 auto 18px}h1{font-size:26px;font-weight:800}
p.s{color:#a9a498;font-size:14px;margin-top:6px;max-width:75ch}
.grid{max-width:1500px;margin:0 auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
figure{margin:0;background:#1a1a17;border:1px solid #2f2f2a;border-radius:14px;overflow:hidden}
.win{height:420px;overflow:hidden;background:#fff}
.win iframe{width:333%;height:333%;border:0;transform:scale(.3);transform-origin:top right;pointer-events:none}
figcaption{padding:12px 14px}
figcaption b{font-size:17px}figcaption span{display:block;font-size:12.5px;color:#a9a498;margin-top:3px}
figcaption a{display:inline-block;margin-top:8px;color:#9dc0ff}
</style></head>
<body>
<header><h1>מסך הבית — חמש גרסאות מלאות</h1>
<p class="s">מסך אחד (בית) בחמש השפות של חמשת האתרים, בצפיפות אמיתית: סרגל-צד, מדפים, רשימות-תנועות,
לוח-ליגה ופס-תחתון. כל הנתונים מגיעים מהמחסן של המערכת.</p></header>
<div class="grid">
${made.map(d => `<figure><div class="win"><iframe src="${d.id}.html" title="${d.name}" loading="lazy" scrolling="no"></iframe></div>
  <figcaption><b>${d.name}</b><span>${d.ref}</span><a href="${d.id}.html">פתח מסך מלא ←</a></figcaption></figure>`).join('\n')}
</div></body></html>`;
writeFileSync(join(here, 'index.html'), index);
console.log(made.map(d => d.id.padEnd(14) + d.name.padEnd(12) + d.ref).join('\n'));
console.log('\nנתונים: ' + D.families + ' משפחות · ' + D.students + ' תלמידים · ' + D.staff + ' עובדים · ' +
  D.loans + ' הלוואות · ' + D.donations + ' תרומות למגבית · ' + D.minyanim.length + ' זמנים');
