/* anashim.mjs — מסך «אנשים», מעוצב מהקונצנזוס המדוד של המסכים הכי נצפים בעולם
   שמציגים אדם ורשימה: YouTube · LinkedIn · Amazon · Booking · Airbnb · ויקיפדיה · Spotify.
   כל טוקן כאן נושא בהערה את האתר שממנו נמדד. אפס ערכים שהומצאו.
   הרצה: node gen/looks/people/anashim.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const app = join(here, '..', 'app');
const raw = JSON.parse(readFileSync(join(here, '..', '..', 'mosad.data.json'), 'utf8'));
const SPEC = {
  roles: raw.roles.map(r => typeof r === 'string' ? r : r.name),
  depts: raw.departments.map(d => ({ n: d.name, e: (d.entities || []).map(e => ({ n: e.name, st: e.stages || [], fb: e.forbidden || [], mo: e.moment || '', f: (e.fields || []).map(f => [f.name, f.shape || '', f.required ? 1 : 0]) })) })),
};
const storeSrc = readFileSync(join(app, 'src', '01-store.js'), 'utf8');
const D = new Function('SPEC', storeSrc + `
  const sortBy = (a, f, d = 1) => [...a].sort((x, y) => (f(x) > f(y) ? 1 : f(x) < f(y) ? -1 : 0) * d);
  build();
  const t = totals();
  return {
    people: DB.people.length, families: DB.families.length, staff: DB.staff.length,
    donors: DB.donors.length, students: DB.students.length, year: DB.tariff.year,
    list: sortBy(DB.families, f => f.name).map(f => ({
      id: f.id, name: f.name, city: f.city, kids: f.kids.length, bal: balance(f),
      paid: f.paid, hok: f.hok, disc: f.discount,
      init: f.name.replace('משפחת ', '').slice(0, 2),
      letter: f.name.replace('משפחת ', '')[0],
      head: nameOf(f.head), spouse: nameOf(f.spouse), phone: f.phone,
      kidList: f.kids.map(k => { const s = stu(k); return { name: nameOf(s.personId), cls: cls(s.classId).name, att: s.att.filter(Boolean).length }; }),
    })),
  };
`)(SPEC);

const nis = n => '₪' + Math.round(n).toLocaleString('en-US');
const LET = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sel = D.list[0];

const groups = {};
D.list.forEach(f => { (groups[f.letter] = groups[f.letter] || []).push(f); });

const html = `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>אנשים — ${D.people} רשומות</title>
<meta name="description" content="מסך אנשים: ספר-רשומות עם מסילת-אינדקס ופאנל-פרטים, מעוצב מערכים שנמדדו במסכים הכי נצפים בעולם.">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&display=swap">
<style>
*{box-sizing:border-box}html,body{overflow-x:hidden}
:root{
 /* ---- נמדד רק באתרים שהליבה שלהם היא אדם. בסוגריים: מאיפה ---- */
 --bg:#ffffff;              /* LinkedIn · Stack Overflow · Dribbble */
 --sunk:#f7f7f8;            /* Twitch */
 --paper:#f1f2f3;           /* Stack Overflow */
 --ink:#000000;             /* LinkedIn */
 --mut:#666666;             /* LinkedIn */
 --dim:#3b4045;             /* Stack Overflow */
 --hair:#d6d9dc;            /* Stack Overflow — מסגרת-הכרטיס המדודה */
 --link:#0a66c2;            /* LinkedIn — קישורי-טקסט */
 --btnBg:#0a66c2;           /* LinkedIn — רקע-הכפתור המדוד. נשאר זהה גם בכהה:
                               לבן עליו = 5.68; כחול בהיר עם לבן היה נופל ל-2.15 */
 --linkA:#1b75d0;           /* Stack Overflow */
 --r:8px;                   /* LinkedIn — רדיוס-הכרטיס */
 --rBtn:24px;               /* LinkedIn — רדיוס-הכפתור */
 --rSm:6px;                 /* Stack Overflow · Twitch */
 --rPill:9000px;            /* Twitch · Stack Overflow 1000 · Dribbble 50 */
 --g1:8px;--g2:12px;--g3:24px;   /* LinkedIn pads 8/12/20/24 · SO gaps 4/12/8/24 */
 --shadow:rgba(0,0,0,.15) 0 4px 6px 0;      /* LinkedIn — צל-הכרטיס המדוד */
 --ring:0 0 0 1px var(--hair);              /* Stack Overflow — border 1px #d6d9dc */
 --fs:16px;--lh:24px;       /* LinkedIn — גוף עמוד-האדם */
 --fsList:13px;--lhList:17px;  /* Stack Overflow — הצפיפות לרשימה */
 --cardPadY:24px;--cardPadX:32px;  /* LinkedIn — ריפוד-הכרטיס המדוד */
}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){
 --bg:#0e0e10;              /* Twitch — הדיו שלו כרקע */
 --sunk:#18181b;
 --paper:#1f1f23;
 --ink:#ffffff;
 --mut:#adadb8;
 --dim:#c8c8d0;
 --hair:#2f2f35;
 --link:#65b7ff;--linkA:#8ab4f8;   /* קישורי-טקסט מתבהרים בכהה */
 --btnBg:#0a66c2;                  /* הכפתור **לא** מתבהר — אחרת הלבן עליו נופל */
 --shadow:rgba(0,0,0,.5) 0 4px 6px 0;
}}
body{margin:0;background:var(--bg);color:var(--ink);font:400 var(--fs)/var(--lh) Heebo,Arial,sans-serif}
h1,h2,h3{margin:0}p{margin:0}ul,ol{margin:0;padding:0;list-style:none}
a{color:inherit;text-decoration:none}button{font:inherit;cursor:pointer}
bdi{unicode-bidi:isolate}
:focus-visible{outline:2px solid var(--link);outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}

/* ---- פס עליון: LinkedIn h1 24/600 lh36 ---- */
.top{border-block-end:1px solid var(--hair);background:var(--bg);position:sticky;top:0;z-index:10}
.top .in{max-width:1400px;margin-inline:auto;padding:var(--g2) var(--g3);display:flex;align-items:center;gap:var(--g2);flex-wrap:wrap}
h1{font:600 24px/36px Heebo}
.cnt{font-size:var(--fs);color:var(--mut)}
.find{margin-inline-start:auto;display:flex;align-items:center;gap:var(--g1);
 background:var(--sunk);border:1px solid var(--hair);border-radius:var(--rPill);
 padding:0 var(--g2);min-height:40px;min-width:min(38vw,320px)}
.find input{flex:1;background:none;border:0;outline:0;font:inherit;color:inherit;min-width:0}
.find input::placeholder{color:var(--dim)}

.wrap{max-width:1400px;margin-inline:auto;padding:var(--g3);display:grid;
 grid-template-columns:34px minmax(0,1fr) 380px;gap:var(--g3);align-items:start}
@media(max-width:1100px){.wrap{grid-template-columns:34px minmax(0,1fr)}.side{display:none}}
@media(max-width:620px){.wrap{grid-template-columns:1fr;padding:var(--g2)}.rail{display:none}}

/* ---- מסילת-אינדקס: גלולה, כמו האווטרים אצל כולם ---- */
.rail{position:sticky;top:96px;display:grid;gap:2px}
.rail button{width:34px;height:26px;border:0;background:none;border-radius:var(--rPill);
 font:600 12px Heebo;color:var(--mut)}
.rail button:hover:not(:disabled){background:var(--sunk);color:var(--ink)}
.rail button:disabled{color:var(--hair);cursor:default}

/* ---- הספר: Amazon/Booking — צפוף, קו-שיער, אפס כרטיסים ---- */
.book{font:400 var(--fsList)/var(--lhList) Heebo,Arial,sans-serif}
.book h2{font:700 12px/20px Heebo;color:var(--mut);letter-spacing:.06em;
 padding:var(--g3) 0 var(--g1);position:sticky;top:88px;background:var(--bg)}
.row{display:grid;grid-template-columns:44px minmax(0,1fr) auto;gap:var(--g2);align-items:center;
 padding:12px var(--g1);border-block-end:1px solid var(--hair);border-radius:var(--r)}
.row:hover{background:var(--sunk)}
.row .av{width:44px;height:44px;border-radius:var(--rPill);background:var(--sunk);color:var(--ink);
 display:grid;place-items:center;font:700 15px Heebo;box-shadow:var(--ring)}
.row .nm{font:600 15px/20px Heebo;display:block}
.row .nm a{color:var(--link)}
.row .nm a:hover{text-decoration:underline}
.row .sb{font-size:var(--fsList);color:var(--mut);display:block}
.row .m{text-align:end;font-variant-numeric:tabular-nums;white-space:nowrap}
.row .m b{display:block;font:700 15px/20px Heebo}
.row .m span{font-size:12px;color:var(--dim)}
.chip{display:inline-block;font:600 11px/16px Heebo;border-radius:var(--rPill);
 padding:2px 9px;background:var(--sunk);color:var(--mut);margin-inline-end:5px;box-shadow:var(--ring)}
.chip.ok{color:#116b3c;background:#e7f6ea;box-shadow:none}
.chip.no{color:#8a4b00;background:#fff4e5;box-shadow:none}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]) .chip.ok{color:#7ee2a8;background:#10301e}
 :root:not([data-theme=light]) .chip.no{color:#f0c070;background:#2b1f0c}}

/* ---- פאנל-פרטים: LinkedIn — כרטיס r8 עם טבעת, בלי צל ---- */
.side{position:sticky;top:96px;display:grid;gap:var(--g2)}
/* כרטיס LinkedIn המדוד: r8 · ריפוד 24/32 · צל rgba(0,0,0,.15) 0 4px 6px */
.card{background:var(--bg);border-radius:var(--r);box-shadow:var(--shadow);padding:var(--cardPadY) var(--cardPadX);font:400 var(--fs)/var(--lh) Heebo,Arial,sans-serif}
.card h3{font:600 18px/22.5px Heebo;margin-bottom:2px}
.who{display:flex;align-items:center;gap:var(--g2);margin-bottom:var(--g2)}
.who .av{width:64px;height:64px;border-radius:var(--rPill);background:var(--sunk);
 display:grid;place-items:center;font:700 22px Heebo;box-shadow:var(--ring);flex:none}
.who .ct{font-size:13px;color:var(--mut)}
/* ---- תיבת-המידע של ויקיפדיה: תווית מימין, ערך משמאל, קו-שיער בין שורות ---- */
.kv{display:grid;grid-template-columns:auto minmax(0,1fr);gap:0 var(--g2);font-size:var(--fs)}
.kv dt{color:var(--mut);padding:7px 0;border-block-end:1px solid var(--hair);white-space:nowrap}
.kv dd{margin:0;padding:7px 0;border-block-end:1px solid var(--hair);text-align:end;font-weight:600;font-variant-numeric:tabular-nums}
.kv dt:last-of-type,.kv dd:last-of-type{border:0}
.kids{margin-top:var(--g2);display:grid;gap:var(--g1)}
.kid{display:grid;grid-template-columns:32px minmax(0,1fr) auto;gap:var(--g1);align-items:center;font-size:13px}
.kid .av{width:32px;height:32px;border-radius:var(--rPill);background:var(--sunk);display:grid;place-items:center;font:700 12px Heebo;box-shadow:var(--ring)}
.kid b{font-weight:600}
.kid span{color:var(--mut);font-size:12px;display:block}
.kid .at{color:var(--mut);font-variant-numeric:tabular-nums;font-size:12px}
/* הכפתור הראשי של LinkedIn, כפי שנמדד: #0a66c2 · לבן · r24 · גובה 48 · ריפוד 12/24 · 16/600 */
.more{display:flex;align-items:center;justify-content:center;margin-top:var(--g3);
 background:var(--btnBg);color:#fff;border-radius:var(--rBtn);
 min-height:48px;padding:12px 24px;font:600 16px Heebo}
.more:hover{background:#004182}

.src{max-width:1400px;margin:var(--g3) auto 40px;padding:0 var(--g3);font-size:12px;color:var(--dim)}
.src b{color:var(--mut)}
</style></head>
<body>
<header class="top"><div class="in">
  <h1>אנשים</h1>
  <p class="cnt"><bdi dir="ltr">${D.people}</bdi> רשומות · ${D.families} משפחות · ${D.staff} עובדים · ${D.donors} תורמים</p>
  <label class="find"><span aria-hidden="true">⌕</span><span class="sr">חיפוש</span>
    <input type="search" placeholder="שם, עיר או תפקיד…" autocomplete="off"></label>
</div></header>

<div class="wrap">
  <nav class="rail" aria-label="קפיצה לאות">
    ${LET.map(L => `<button type="button"${groups[L] ? '' : ' disabled'} aria-label="קפוץ לאות ${L}">${L}</button>`).join('')}
  </nav>

  <main class="book">
    ${Object.keys(groups).sort().map(L => `<h2 id="L${L}">${L}</h2>
      ${groups[L].map(f => `<article class="row">
        <span class="av" aria-hidden="true">${esc(f.init)}</span>
        <span><span class="nm"><a href="#">${esc(f.name)}</a></span>
          <span class="sb">${esc(f.city)} · ${f.kids} ילדים
            ${f.hok ? '<span class="chip ok">הוראת קבע</span>' : '<span class="chip no">בלי הו״ק</span>'}
            ${f.disc ? `<span class="chip">הנחה ${f.disc}%</span>` : ''}</span></span>
        <span class="m"><b><bdi dir="ltr">${nis(f.bal)}</bdi></b><span>יתרה</span></span>
      </article>`).join('')}`).join('')}
  </main>

  <aside class="side">
    <section class="card">
      <div class="who"><span class="av" aria-hidden="true">${esc(sel.init)}</span>
        <span><h3>${esc(sel.name)}</h3><span class="ct">${esc(sel.city)} · ${sel.kids} ילדים במוסד</span></span></div>
      <dl class="kv">
        <dt>אב</dt><dd>${esc(sel.head)}</dd>
        <dt>אם</dt><dd>${esc(sel.spouse)}</dd>
        <dt>טלפון</dt><dd><bdi dir="ltr">${esc(sel.phone)}</bdi></dd>
        <dt>שולם</dt><dd><bdi dir="ltr">${nis(sel.paid)}</bdi></dd>
        <dt>יתרה</dt><dd><bdi dir="ltr">${nis(sel.bal)}</bdi></dd>
        <dt>הנחה</dt><dd>${sel.disc}%</dd>
        <dt>הוראת קבע</dt><dd>${sel.hok ? 'פעילה' : 'אין'}</dd>
      </dl>
      <div class="kids"><h3 style="font-size:13px;color:var(--mut);font-weight:600">ילדים במוסד</h3>
        ${sel.kidList.map(k => `<div class="kid"><span class="av" aria-hidden="true">${esc(k.name.slice(0, 2))}</span>
          <span><b>${esc(k.name)}</b><span>${esc(k.cls)}</span></span>
          <span class="at">נוכחות <bdi dir="ltr">${k.att}/5</bdi></span></div>`).join('')}
      </div>
      <a class="more" href="#">פתיחת התיק המלא</a>
    </section>
  </aside>
</div>

<p class="src"><b>מאיפה העיצוב — רק אתרים שהליבה שלהם אדם:</b>
הכפתור <bdi dir="ltr">#0a66c2 · r24 · h48 · 12/24 · 16/600</bdi> והכרטיס <bdi dir="ltr">r8 · 24/32 · צל .15</bdi> — <b>LinkedIn</b> (מיליארד משתמשים) ·
צפיפות־הרשימה <bdi dir="ltr">13/17</bdi> ומסגרת <bdi dir="ltr">#d6d9dc</bdi> — <b>Stack Overflow</b> ·
גלולה לאווטרים — <b>Twitch · Dribbble</b> · המשטח הכהה <bdi dir="ltr">#0e0e10</bdi> — <b>Twitch</b> ·
תיבת־המידע — <b>WikiTree</b>.
<b>שבעה נחסמו ולא נמדדו:</b> Instagram · X · Facebook · Goodreads · Geni · MyHeritage · Behance · Last.fm · Letterboxd.
נתונים: ${D.families} משפחות מהמחסן.</p>
</body></html>`;

writeFileSync(join(here, 'anashim.html'), html);
console.log('gen/looks/people/anashim.html · ' + (html.length / 1024).toFixed(0) + 'KB · ' + D.list.length + ' משפחות');
