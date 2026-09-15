/* מסך הבית בשפת Duolingo — עמוד-לימוד מלא:
   פס עליון עם מוני-רצף, מסלול-יחידות עם צמתים עגולים, באנר-יחידה, סרגל-צד ימני
   (ליגה · משימות יומיות · חברים), ופס-ניווט תחתון. המבנה של מסך הלימוד בצילום. */
import { scene, appIcon } from '../art.mjs';

export default {
  id: '3-duolingo', name: 'Duolingo', ref: 'עמוד-לימוד: פס-מונים · מסלול-צמתים · באנר-יחידה · ליגה ומשימות · ניווט תחתון',
  fonts: ['Varela+Round', 'Alef:wght@400;700'],
  css: `
:root{/* נמדד ב-duolingo.com */
 --bg:#ffffff;--ink:#3c3c3c;--mut:#4b4b4b;--dim:#777777;--hair:#e5e5e5;--sunk:#f7f7f7;
 --green:#58cc02;--greenInk:#0d2600;--greenL:#a5ed6e;--greenPale:#d7ffb8;
 /* שלושת הכחולים המדודים: #100f3e · #0b3e71 · #042c60 · והתכלת #1cb0f6 (מילוי בלבד) */
 --navy:#100f3e;--blue:#1cb0f6;--blueInk:#0b3e71;--deep:#042c60;
 --r:12px;--gap:10px;--gap2:24px}
body{background:var(--bg);color:var(--ink);font:400 17px/1.18 'Varela Round',Arial,sans-serif;padding-bottom:76px}
.hdr{border-block-end:2px solid var(--hair);position:sticky;top:0;background:#fff;z-index:10}
.hdr .in{max-width:1180px;margin-inline:auto;padding:12px 18px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
/* הירוק המדוד אינו עובר סף-קריאוּת כטקסט — לכן הוא מילוי, והשם עליו כהה */
.hdr .logo{font-size:21px;margin:0;background:var(--green);color:var(--greenInk);font-weight:700;margin:0;border-radius:var(--r);padding:7px 12px}
.hdr .sp{flex:1}
/* המונים: הערך יושב בגלולה בגוון מדוד, הטקסט תמיד בדיו המדוד */
.mtr{display:flex;align-items:center;gap:7px;font-size:15px;font-weight:700;color:var(--ink)}
.mtr i{font-style:normal;font-size:18px}
.mtr b{border-radius:9999px;padding:7px 12px;background:var(--sunk);color:var(--ink)}
.mtr.f b{background:var(--greenPale)}.mtr.g b{background:var(--hair)}
.mtr.h b{background:var(--greenL)}.mtr.x b{background:var(--greenPale)}

.wrap{max-width:1180px;margin-inline:auto;padding:20px 18px;display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:24px}
@media(max-width:940px){.wrap{grid-template-columns:1fr}}

.unit{--onUnit:#100f3e;background:var(--navy);color:#fff;border-radius:var(--r);padding:16px 20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:8px}
.unit small{display:block;font-size:12.5px;opacity:.9}
.unit b{font-size:19px}
.unit .sp{flex:1}
/* כפתור-המשנה של דואולינגו על באנר צבעוני: מילוי לבן מלא, הטקסט בצבע הבאנר עצמו */
.unit button{background:#fff;border:2px solid #fff;color:var(--onUnit);border-radius:var(--r);
 padding:0 16px;font:700 15px 'Varela Round';min-height:50px;text-transform:uppercase;box-shadow:0 4px 0 rgba(0,0,0,.18)}
.unit.blue{background:var(--blueInk);--onUnit:#0b3e71}
.unit.purple{background:var(--deep);--onUnit:#042c60}
/* באנר ירוק: הירוק המדוד כרקע והדיו הכהה שלו כטקסט (חריגה מוצהרת) */
.unit.green{background:var(--green);color:var(--greenInk);--onUnit:#0d2600}

/* הכרטיס המאויר שפותח את עמוד-הלימוד של דואולינגו */
.welcome{display:grid;grid-template-columns:300px minmax(0,1fr);gap:24px;align-items:center;
 border:2px solid var(--hair);border-radius:var(--r);padding:24px;margin-bottom:24px}
@media(max-width:700px){.welcome{grid-template-columns:1fr;text-align:center;justify-items:center}}
.welcome .scene{width:300px;max-width:100%;height:auto}
.welcome h1{font:700 clamp(28px,4.4vw,40px)/1.05 'Varela Round';letter-spacing:-.02em;text-wrap:balance}
.welcome p{font-size:17px;color:var(--mut);margin:10px 0 16px;max-width:38ch}
/* רצועת-הקורסים הצבעונית בתחתית העמוד של דואולינגו */
.courses{display:flex;gap:24px;overflow-x:auto;padding:12px 0 24px;align-items:center}
.courses a{display:flex;align-items:center;gap:10px;flex:none;font-size:13px;font-weight:700;
 color:var(--mut);text-transform:uppercase;letter-spacing:.06em}
.courses i{width:36px;height:26px;border-radius:var(--r);display:block;flex:none}
.path{display:grid;justify-items:center;gap:24px;padding:14px 0 22px;max-width:440px;margin-inline:auto}
.node{display:grid;justify-items:center;gap:7px;position:relative}
.node .btn{width:76px;height:76px;border-radius:9999px;border:0;display:grid;place-items:center;font-size:24px;padding:0;
 background:var(--green);color:var(--greenInk);box-shadow:0 7px 0 rgba(0,0,0,.22);position:relative}
.node .btn:active{transform:translateY(4px);box-shadow:0 3px 0 rgba(0,0,0,.22)}
.node.locked .btn{background:var(--hair);color:#afafaf;box-shadow:0 7px 0 rgba(0,0,0,.12)}
.node.done .btn{background:var(--greenL);color:var(--greenInk);box-shadow:0 7px 0 rgba(0,0,0,.18)}
.node .lab{font-size:13.5px;color:var(--mut);text-align:center;max-width:22ch}
.node .lab b{display:block;color:var(--ink);font-size:14.5px}
/* «התחל כאן» זורם מעל הצומת במקום לרחף — כך הוא לא נוחת על תווית הצומת שמעליו */
.node .start{order:-1;background:#fff;border:2px solid var(--hair);border-radius:var(--r);
 padding:7px 12px;font-size:12px;font-weight:700;color:var(--blueInk);white-space:nowrap;text-transform:uppercase}
.node:nth-child(2){margin-inline-start:96px}.node:nth-child(3){margin-inline-start:150px}
.node:nth-child(4){margin-inline-start:96px}.node:nth-child(6){margin-inline-end:96px}
.node:nth-child(7){margin-inline-end:150px}.node:nth-child(8){margin-inline-end:96px}
@media(max-width:560px){.path .node{margin-inline:0!important}}

.side section{border:2px solid var(--hair);border-radius:var(--r);padding:16px;margin-bottom:16px}
.side h2{font-size:17px;margin-bottom:4px}
.side p.s{font-size:13px;color:var(--mut);margin-bottom:12px}
.lg{display:grid;grid-template-columns:26px 34px minmax(0,1fr) auto;gap:10px;align-items:center;padding:8px 0;border-block-end:1px solid var(--hair);font-size:14px}
.lg:last-child{border:0}
.lg .n{font-weight:700;color:var(--mut);text-align:center}
.lg .av{width:34px;height:34px;border-radius:9999px;display:grid;place-items:center;font-size:12px;font-weight:700}
.lg .m{font-variant-numeric:tabular-nums;font-weight:700;font-size:13.5px}
.lg.me{background:var(--greenPale);border-radius:var(--r);padding-inline:8px}
.q{display:flex;align-items:center;gap:12px;padding:10px 0;border-block-end:1px solid var(--hair)}
.q:last-child{border:0}
.q .ic{width:40px;height:40px;border-radius:var(--r);background:var(--sunk);display:grid;place-items:center;font-size:18px;flex:none}
.q .t{flex:1;font-size:14px}
.q .track{height:12px;border-radius:9999px;background:var(--sunk);overflow:hidden;position:relative;margin-top:6px}
.q .track i{position:absolute;inset-block:0;inset-inline-start:0;background:var(--green);border-radius:9999px}
.q .val{font-size:12.5px;color:var(--mut);font-variant-numeric:tabular-nums}
.friend{display:flex;align-items:center;gap:10px;padding:8px 0;font-size:14px}
.friend .av{width:32px;height:32px;border-radius:9999px;display:grid;place-items:center;font-size:12px;font-weight:700}
.friend .m{margin-inline-start:auto;font-size:12.5px;color:var(--mut)}

.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:12px;margin:6px 0 20px}
.card{border:2px solid var(--hair);border-radius:var(--r);padding:16px;text-align:center}
.card .r{position:relative;display:grid;place-items:center;margin-bottom:8px}
.card .r b{position:absolute;font-size:23px;color:var(--ink)}
.card h3{font-size:15.5px}
.card p{font-size:12.5px;color:var(--mut)}
.tasks{margin-top:8px}
.task{display:flex;align-items:center;gap:12px;border:2px solid var(--hair);border-radius:var(--r);padding:12px;margin-bottom:9px}
.task .ic{width:44px;height:44px;border-radius:var(--r);display:grid;place-items:center;font-size:19px;flex:none;background:var(--sunk)}
.task .t{flex:1;font-size:15px}
.task .t span{display:block;font-size:12.5px;color:var(--mut)}
/* הכפתור המדוד: גובה 50 · ריפוד 0/16 · 15px/700 · רדיוס 12 · אותיות גדולות · מסגרת 2 למשני */
.go{border:0;border-radius:var(--r);padding:0 16px;font:700 15px 'Varela Round';min-height:50px;text-transform:uppercase;
 background:var(--green);color:var(--greenInk);box-shadow:0 4px 0 rgba(0,0,0,.22)}
.go:active{transform:translateY(3px);box-shadow:0 1px 0 rgba(0,0,0,.22)}
.go.grey{background:#fff;color:var(--blueInk);border:2px solid var(--hair);box-shadow:0 4px 0 var(--hair)}
h2.sec{font-size:19px;margin:22px 0 10px}
.foot{font-size:12.5px;color:var(--mut);text-align:center;margin-top:20px}

.bottom{position:fixed;inset-inline:0;bottom:0;background:#fff;border-block-start:2px solid var(--hair);
 display:flex;justify-content:center;gap:7px;padding:8px;z-index:20}
.bottom a{display:grid;justify-items:center;gap:7px;padding:8px 12px;border-radius:12px;font-size:11px;color:var(--mut)}
.bottom a i{font-style:normal;font-size:21px}
.bottom a[aria-current]{background:var(--greenPale);color:var(--ink)}
`,
  body: (D) => {
    /* הפלטה המדודה של Duolingo: #58cc02 · #a5ed6e · #d7ffb8 · #100f3e · #1cb0f6 · #777777 */
    /* חמשת המשטחים הבהירים שנמדדו ב-duolingo, כל אחד עם דיו מדוד שעובר סף-קריאוּת */
    const cols = ['#d7ffb8:#3c3c3c', '#a5ed6e:#3c3c3c', '#e5e5e5:#4b4b4b', '#f7f7f7:#100f3e', '#f7f7f7:#4b4b4b'];
    const av = (i) => { const [bg, fg] = cols[i % 5].split(':'); return `background:${bg};color:${fg}`; };
    const ring = (pct, lab, sub, col) => `<div class="card"><div class="r">
      <svg width="106" height="106" viewBox="0 0 106 106" role="img" aria-label="${lab} ${pct} אחוז">
        <circle cx="53" cy="53" r="44" fill="none" stroke="#f0f0f0" stroke-width="12"></circle>
        <circle cx="53" cy="53" r="44" fill="none" stroke="${col}" stroke-width="12" stroke-linecap="round"
          stroke-dasharray="${(pct / 100 * 276).toFixed(0)} 276" transform="rotate(-90 53 53)"></circle></svg>
      <b style="color:${col}">${pct}%</b></div><h3>${lab}</h3><p>${sub}</p></div>`;
    const nodes = [
      ['done', '₪', 'גבייה', D.pct + '% הושלמו'],
      ['done', '👥', 'נוכחות צוות', D.present + ' מתוך ' + D.staff],
      ['', '📚', 'נוכחות תלמידים', D.attAll + '% השבוע'],
      ['', '❤', 'מגבית הבניין', Math.round(D.raised / D.goal * 100) + '% מהיעד'],
      ['locked', '🤝', 'ועדת גמ״ח', D.loansOpen + ' בקשות'],
      ['locked', '👑', 'קבלת קהל', D.queueN + ' ממתינים'],
      ['locked', '🔧', 'קריאות שירות', D.calls.length + ' פתוחות'],
      ['locked', '📊', 'דוח לוועד', 'סוף החודש'],
    ];
    return `<header class="hdr"><div class="in">
  <p class="logo">מוסד</p>
  <span class="mtr f"><i>🔥</i><b>${D.pct}%</b></span>
  <span class="mtr g"><i>💎</i><b>${D.nis(D.raised)}</b></span>
  <span class="mtr h"><i>❤</i><b>${D.absent}</b></span>
  <span class="sp"></span>
  <span class="mtr x"><i>👥</i><b>${D.present}/${D.staff}</b></span>
  <span class="mtr"><i>📅</i><b>${D.today.hd} ${D.today.hy}</b></span>
</div></header>

<div class="wrap">
<main>
  <section class="welcome">
    ${scene('mosad-' + D.tariff.year)}
    <div>
      <h1>הדרך הכי פשוטה לנהל את המוסד</h1>
      <p>${D.pct}% מהחיוב השנתי כבר נגבו · ${D.students} תלמידים ב-${D.classes.length} כיתות ·
        ${D.staff} אנשי צוות. ממשיכים מהמקום שבו עצרנו.</p>
      <button class="go">המשך ליחידה 1</button>
    </div>
  </section>

  <div class="unit"><small>יחידה 1 · ${D.tariff.year}</small><b>גבייה ושכר לימוד</b><span class="sp"></span>
    <button class="noprint">מדריך היחידה</button></div>

  <div class="path">
    ${nodes.map(([st, ic, t, s], i) => `<div class="node ${st}">
      ${i === 2 ? '<span class="start">התחל כאן</span>' : ''}
      <button class="btn" aria-label="${t}"><span aria-hidden="true">${ic}</span></button>
      <span class="lab"><b>${t}</b>${s}</span></div>`).join('')}
  </div>

  <div class="unit blue"><small>יחידה 2 · חינוך</small><b>נוכחות, כיתות ומבחנים</b><span class="sp"></span>
    <button class="noprint">${D.classes.length} כיתות</button></div>

  <div class="cards">
    ${ring(D.pct, 'גבייה', D.money(D.paid) + ' מתוך ' + D.money(D.due), '#3f7a00')}
    ${ring(D.attAll, 'נוכחות', D.num(D.students) + ' תלמידים', '#0f6f9e')}
    ${ring(Math.round(D.raised / D.goal * 100), 'מגבית', D.money(D.raised), '#2f2d6e')}
  </div>

  <h2 class="sec">המשימות של היום</h2>
  <div class="tasks">
    ${D.alerts.map(([t, dep, sev], i) => `<div class="task">
      <span class="ic" style="${av(i)}" aria-hidden="true">${['❗', '⏰', '💬'][sev - 1]}</span>
      <span class="t">${t}<span>${dep}</span></span>
      <button class="go${sev === 1 ? '' : ' grey'}">${sev === 1 ? 'טפל' : 'פתח'}</button></div>`).join('')}
    ${D.calls.slice(0, 3).map((c, i) => `<div class="task">
      <span class="ic" style="${av(i + 2)}" aria-hidden="true">🔧</span>
      <span class="t">${c.text}<span>תפעול · ${c.owner || 'לא שובץ'} · ${c.days} ימים</span></span>
      <button class="go grey">פתח</button></div>`).join('')}
  </div>

  <div class="unit green"><small>יחידה 3 · בית המדרש</small><b>${D.minyanim.length} זמנים היום</b><span class="sp"></span>
    <button class="noprint">${D.now.name} עכשיו</button></div>

  <div class="tasks">
    ${D.minyanim.map((m, i) => `<div class="task">
      <span class="ic" style="${av(i)}" aria-hidden="true">🕯</span>
      <span class="t">${m.name}<span>${m.where || '—'}${m.count ? ' · ' + m.count + ' משתתפים' : ''}</span></span>
      <span style="font-weight:700;font-variant-numeric:tabular-nums">${D.ltr(m.time)}</span></div>`).join('')}
  </div>

  <div class="unit purple"><small>יחידה 4 · חסד</small><b>גמ״ח הלוואות</b><span class="sp"></span>
    <button class="noprint">${D.money(D.fund)} זמינים</button></div>

  <div class="tasks">
    ${D.loanList.slice(0, 8).map((l, i) => `<div class="task">
      <span class="ic" style="${av(i + 1)}">${l.init}</span>
      <span class="t">${l.fam} · ${l.purpose}<span>${l.stage} · ${l.g}/2 ערבים${l.paid ? ' · ' + l.paid + '/' + l.inst + ' תשלומים' : ''}</span></span>
      <span style="font-weight:700;font-variant-numeric:tabular-nums">${D.nis(l.amount)}</span></div>`).join('')}
  </div>

  <nav class="courses noprint" aria-label="אגפים">
    ${D.depts.map(([n]) => `<a href="#"><i data-art style="${appIcon(n)}"></i>${n}</a>`).join('')}
  </nav>

  <p class="foot">כל הנתונים מהמחסן של המערכת · החלקים (פס-מונים · איור-פתיחה · רצועת-אגפים · צמתי-מסלול · באנר-יחידה · ליגה ·
    משימות יומיות · ניווט תחתון · כפתור תלת-ממדי) לקוחים מ-Duolingo · נתוני דוגמה</p>
</main>

<aside class="side">
  <section><h2>ליגת הגבייה</h2><p class="s">המשפחות עם היתרה הגדולה ביותר — לפי גודל החוב</p>
    ${D.topOpen.slice(0, 10).map((f, i) => `<div class="lg${i === 2 ? ' me' : ''}">
      <span class="n">${i + 1}</span><span class="av" style="${av(i)}">${f.init}</span>
      <span>${f.name}<br><span style="font-size:12px;color:var(--mut)">${f.city} · ${f.kids} ילדים</span></span>
      <span class="m">${D.nis(f.bal)}</span></div>`).join('')}
  </section>

  <section><h2>משימות יומיות</h2><p class="s">מתאפסות בחצות</p>
    ${[['לגבות 5 משפחות', Math.min(100, D.pct), '💰'], ['לסגור 3 קריאות שירות', 40, '🔧'],
      ['לאשר 2 בקשות גמ״ח', D.loansOpen ? 50 : 100, '🤝'], ['לשלוח תזכורת להורים', 100, '✉']]
      .map(([t, p, ic]) => `<div class="q"><span class="ic" aria-hidden="true">${ic}</span>
        <span class="t">${t}<span class="track"><i style="width:${p}%"></i></span></span>
        <span class="val">${p}%</span></div>`).join('')}
  </section>

  <section><h2>הצוות שלך</h2><p class="s">${D.present} נוכחים מתוך ${D.staff}</p>
    ${D.staffList.slice(0, 8).map((s, i) => `<div class="friend"><span class="av" style="${av(i)}">${s.init}</span>
      <span>${s.name}<br><span style="font-size:12px;color:var(--mut)">${s.role}</span></span>
      <span class="m">${s.absent ? s.absent : 'נוכח'}</span></div>`).join('')}
  </section>

  <section><h2>יארצייטים השבוע</h2><p class="s">${D.yahr.length} רשומים</p>
    ${D.yahr.slice(0, 6).map(y => `<div class="friend"><span class="av" style="${av(4)}" aria-hidden="true">🕯</span>
      <span>${y.name}<br><span style="font-size:12px;color:var(--mut)">${y.fam}</span></span>
      <span class="m">${y.day}</span></div>`).join('')}
  </section>
</aside>
</div>

<nav class="bottom noprint">
  <a href="#" aria-current="page"><i>🏠</i>בית</a><a href="#"><i>₪</i>גבייה</a><a href="#"><i>📚</i>חינוך</a>
  <a href="#"><i>❤</i>תרומות</a><a href="#"><i>🤝</i>חסד</a><a href="#"><i>👤</i>פרופיל</a>
</nav>`;
  },
};
