/* מסך הבית בשפת Wise — עמוד-חשבון מלא:
   פס-ניווט עליון, רצועת-יתרות בצד, יתרה ראשית עם שורת-פעולות, רשימת-תנועות מקובצת לפי יום,
   כרטיס-המרה עם בוררים ושורת-עמלה, וכרטיסי-צד. המבנה של עמוד החשבון בצילום. */
import { coin } from '../art.mjs';

export default {
  id: '4-wise', name: 'Wise', ref: 'עמוד-חשבון: ניווט · רצועת-יתרות · תנועות לפי יום · כרטיס-חישוב · כרטיסי-צד',
  fonts: ['Heebo:wght@400;500;600;700;800;900'],
  css: `
:root{/* נמדד ב-wise.com — פלטה · רדיוסים · כפתורים · כרטיסים */
 --bg:#ffffff;--ink:#163300;--mut:#454745;--dim:#454745;--deep:#0e0f0c;
 --lime:#9fe870;--forest:#163300;--teal:#e0f7f7;--stone:#e8ebe6;--neg:#cf2929;
 /* הגבול של Wise אינו border אלא טבעת-צל מדודה */
 --ring:0 0 0 1px rgba(22,51,0,.12);--ringOn:0 0 0 1px rgba(255,255,255,.2);
 --r:19px;--rCard:28px;--rPill:9999px;--rTiny:2px;
 --gap:9px;--gap2:28px}
body{background:var(--bg);color:var(--mut);font:400 18px/26px Heebo,Arial,sans-serif}

.nav{box-shadow:var(--ring);position:sticky;top:0;background:#fff;z-index:10}
.nav .in{max-width:1220px;margin-inline:auto;padding:11px 24px;display:flex;align-items:center;gap:19px;flex-wrap:wrap}
.nav .logo{font:900 24px/1 Heebo;color:var(--ink)}
.nav a{font-size:16px;font-weight:600;color:var(--ink);border-radius:var(--r);padding:8px 12px;min-height:40px;display:inline-flex;align-items:center}
.nav a:hover{background:var(--stone)}
.nav .sp{flex:1}
.nav .av{width:40px;height:40px;border-radius:var(--rPill);background:var(--lime);color:var(--ink);display:grid;place-items:center;font-weight:800;font-size:15px}

.band{background:var(--lime);color:var(--ink)}
.band .in{max-width:1220px;margin-inline:auto;padding:56px 24px;display:flex;gap:28px;align-items:flex-end;flex-wrap:wrap}
/* מטבעות-הדגל של וייז — אמנות, כמו הדגלים באתר */
.coins{display:flex;gap:9px;align-items:center;margin-top:19px;flex-wrap:wrap}
.coins .coin{width:40px;height:40px;display:block}
.coins span{font-size:16px;font-weight:600}
/* h1 מדוד: 89/900 · גובה-שורה 0.85 · אין ריווח-אותיות */
.band h1{font:900 clamp(40px,8vw,89px)/.85 Heebo;max-width:13ch;text-wrap:balance}
.band .r{margin-inline-start:auto;text-align:end}
.band .r b{display:block;font:900 clamp(26px,4vw,40px)/.9 Heebo;font-variant-numeric:tabular-nums}
.band .r span{font-size:16px}

.wrap{max-width:1220px;margin-inline:auto;padding:28px 24px 80px;display:grid;
 grid-template-columns:280px minmax(0,1fr) 310px;gap:28px;align-items:start}
@media(max-width:1100px){.wrap{grid-template-columns:270px minmax(0,1fr)}.right{grid-column:1/-1}}
@media(max-width:820px){.wrap{grid-template-columns:1fr}.left{order:2}}

.left h2,.right h2{font:900 18px/1.2 Heebo;color:var(--ink);margin-bottom:9px}
.bal{display:grid;gap:4px;margin-bottom:28px}
.bal a{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:9px;align-items:center;padding:9px 11px;border-radius:var(--r)}
.bal a:hover{background:var(--teal)}
.bal .c{width:40px;height:40px;border-radius:var(--rPill);display:grid;place-items:center;font-size:15px;font-weight:800}
.bal .coin{width:40px;height:40px;display:block}
.bal b{font-size:16px;font-weight:600;display:block;color:var(--ink);line-height:1.3}
.bal span{font-size:14px;color:var(--mut)}
.bal .m{font-weight:600;font-variant-numeric:tabular-nums;font-size:16px;white-space:nowrap;color:var(--ink)}
/* כפתור-הטקסט המדוד: גובה 40 · ריפוד 8/12 · 18px/600 · רדיוס 19 */
.addbtn{width:100%;border:0;background:none;border-radius:var(--r);padding:8px 12px;
 font:600 18px Heebo;color:var(--ink);min-height:40px;margin-top:4px;box-shadow:var(--ring)}
.addbtn:hover{background:var(--stone)}

.main .big{font:900 clamp(34px,7vw,56px)/.9 Heebo;font-variant-numeric:tabular-nums;color:var(--ink)}
.main .cap{font-size:16px;color:var(--mut);margin-top:4px}
.acts{display:flex;gap:9px;flex-wrap:wrap;margin:19px 0 28px}
/* הכפתור הראשי המדוד: bg #9fe870 · color #163300 · גובה 48 · ריפוד 11/24 · 16px/600 · גלולה */
.btn{background:var(--lime);color:var(--ink);border:1px solid var(--lime);border-radius:var(--rPill);
 padding:11px 24px;font:600 16px Heebo;min-height:48px}
.btn:hover{background:#8ad95c;border-color:#8ad95c}
.btn.dark{background:var(--forest);color:#fff;border-color:var(--forest)}
.btn.dark:hover{background:#0f2400;border-color:#0f2400}
/* כפתור-הקו המדוד: אותו גודל, מסגרת 1 בצבע הדיו */
.btn.line{background:#fff;color:var(--ink);border-color:var(--ink)}
.btn.line:hover{background:var(--stone)}
/* כפתור-טקסט (החתימה הנפוצה ביותר באתר — 25 מופעים) */
.btn.text{background:none;border-color:transparent;border-radius:var(--r);padding:8px 12px;font-size:18px;min-height:40px}
.btn.text:hover{background:var(--stone)}

.calc{border-radius:var(--rCard);overflow:hidden;margin-bottom:28px;box-shadow:var(--ring)}
.calc .row{display:flex;align-items:center;gap:9px;padding:19px 28px;box-shadow:0 1px 0 rgba(22,51,0,.12);flex-wrap:wrap}
.calc .row:last-child{box-shadow:none}
.calc .lab{width:100%;font-size:16px;color:var(--mut)}
.calc .sel{display:inline-flex;align-items:center;gap:8px;border-radius:var(--rPill);padding:11px 19px;
 font-weight:600;font-size:16px;color:var(--ink);box-shadow:var(--ring)}
.calc .sel i{width:24px;height:24px;border-radius:var(--rPill);background:var(--teal);display:grid;place-items:center;font-style:normal;font-size:12px}
.calc .amt{margin-inline-start:auto;font:900 clamp(26px,4vw,40px)/.9 Heebo;font-variant-numeric:tabular-nums;color:var(--ink)}
.calc .note{background:var(--teal);padding:19px 28px;font-size:16px;display:flex;gap:9px;align-items:center;flex-wrap:wrap;color:var(--ink)}
.calc .note a{font-weight:600;text-decoration:underline}
.calc .rate{display:inline-flex;align-items:center;gap:8px;background:var(--stone);border-radius:var(--rPill);
 padding:8px 16px;font-size:15px;font-weight:600;color:var(--ink);margin-inline-start:auto}

h2.sec{font:900 28px/1.1 Heebo;color:var(--ink);margin:38px 0 4px}
p.sub{font-size:16px;color:var(--mut);margin-bottom:9px}
.day{font:600 15px Heebo;color:var(--mut);margin:19px 0 4px}
.tx{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:9px;align-items:center;padding:11px 4px;
 box-shadow:0 1px 0 rgba(22,51,0,.12)}
.tx .c{width:48px;height:48px;border-radius:var(--rPill);display:grid;place-items:center;font-size:15px;font-weight:800}
.tx b{font-size:16px;font-weight:600;display:block;color:var(--ink);line-height:1.35}
.tx span{font-size:14px;color:var(--mut)}
.tx .m{text-align:end;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap;font-size:16px;color:var(--ink)}
.tx .m.neg{color:var(--neg)}
.tx .m small{display:block;font-size:14px;font-weight:400;color:var(--mut)}

/* כרטיס מדוד: רדיוס 28 · ריפוד 28 */
.right section{border-radius:var(--rCard);padding:28px;margin-bottom:9px;box-shadow:var(--ring)}
/* כרטיס-כהה מדוד: רקע #163300 · טבעת לבנה שקופה · הדיו המשני = הליים */
.right section.dark{background:var(--forest);color:#fff;box-shadow:var(--ringOn)}
.right section.dark h2{color:#fff}
.right section.dark p.s,.right section.dark .r2 span span{color:var(--lime)}
/* על הכרטיס הכהה נשאר רק גוון בהיר אחד — אחרת עיגול-הפתיח נבלע ברקע */
.right section.dark .r2 .c{background:var(--lime)!important;color:var(--ink)!important}
.right p.s{font-size:16px;color:var(--mut);margin-bottom:9px}
.mini{display:grid;gap:9px}
.mini .r2{display:flex;align-items:center;gap:9px;font-size:16px;color:var(--ink)}
.right section.dark .mini .r2{color:#fff}
.mini .r2 .c{width:36px;height:36px;border-radius:var(--rPill);background:var(--teal);color:var(--ink);display:grid;place-items:center;font-size:14px;font-weight:600;flex:none}
.mini .r2 .m{margin-inline-start:auto;font-weight:600;font-variant-numeric:tabular-nums}
.bars{display:grid;gap:9px;font-size:16px;color:var(--ink)}
.bars .b{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}
.bars .t{height:9px;border-radius:var(--rPill);background:var(--stone);position:relative;overflow:hidden;grid-column:1/-1}
.bars .t i{position:absolute;inset-block:0;inset-inline-start:0;background:var(--forest);border-radius:var(--rPill)}
.bars .t i.over{background:var(--neg)}
.foot{max-width:1220px;margin:0 auto;padding:0 24px 40px;font-size:15px;color:var(--mut)}
`,
  body: (D) => {
    /* ארבעת הגוונים היחידים שנמדדו ב-wise.com — ליים · תכלת · יער · אבן */
    const cols = ['#9fe870:#163300', '#e0f7f7:#163300', '#163300:#9fe870', '#e8ebe6:#163300'];
    const c = (i) => { const [bg, fg] = cols[i % 4].split(':'); return `background:${bg};color:${fg}`; };
    const groups = [['היום', D.payList.slice(0, 5)], ['אתמול', D.payList.slice(5, 10)], ['השבוע', D.payList.slice(10, 16)]];
    return `<header class="nav noprint"><div class="in"><span class="logo">מוסד</span>
  <a href="#">גבייה</a><a href="#">תרומות</a><a href="#">כספים</a><a href="#">חסד</a><a href="#">דוחות</a>
  <span class="sp"></span><a href="#">עזרה</a><span class="av">מ</span></div></header>

<section class="band"><div class="in">
  <h1>${D.pct}% מהחיוב השנתי כבר נגבו.</h1>
  <div class="r"><b>${D.money(D.open)}</b><span>פתוח אצל ${D.families} משפחות · ${D.late} בפיגור</span>
    <div class="coins">${D.depts.slice(0, 5).map(([n]) => coin(n, n)).join('')}<span>${D.depts.length} אגפים</span></div></div>
</div></section>

<div class="wrap">
<aside class="left">
  <h2>יתרות</h2>
  <div class="bal">
    ${[['שכר לימוד', D.tariff.year, D.paid, 0], ['יתרה פתוחה', D.families + ' משפחות', D.open, 4],
      ['מגבית הבניין', D.donations + ' תרומות', D.raised, 2], ['גמ״ח — זמין', D.loans + ' הלוואות', D.fund, 1],
      ['גמ״ח — בחוץ', D.fundLate + ' באיחור', D.fundOut, 3],
      ['תקציב שנתי', 'ביצוע ' + Math.round(D.budget.reduce((a, b) => a + b.actual, 0) / D.budget.reduce((a, b) => a + b.plan, 0) * 100) + '%',
        D.budget.reduce((a, b) => a + b.plan, 0) * 1000, 2]]
      .map(([t, s, v, i]) => `<a href="#">${coin(t, t)}
        <span><b>${t}</b><span>${s}</span></span><span class="m">${D.money(v)}</span></a>`).join('')}
  </div>
  <button class="addbtn noprint">+ פתיחת יתרה חדשה</button>

  <h2 style="margin-top:24px">אנשים</h2>
  <div class="mini">
    ${D.staffList.slice(0, 6).map((s, i) => `<span class="r2"><span class="c" style="${c(i)}">${s.init}</span>
      <span>${s.name}</span><span class="m" style="font-size:14px">${s.absent || 'נוכח'}</span></span>`).join('')}
  </div>
</aside>

<main class="main">
  <p class="cap">נגבה עד היום · ${D.tariff.year}</p>
  <p class="big">${D.money(D.paid)}</p>
  <p class="cap">מתוך ${D.money(D.due)} שחויבו ל-${D.families} משפחות · ${D.num(D.students)} תלמידים</p>
  <div class="acts noprint"><button class="btn">רישום תשלום</button><button class="btn dark">שליחת תזכורות</button>
    <button class="btn line">הפקת קבלות</button><button class="btn text">ייצוא לרואה חשבון</button></div>

  <div class="calc">
    <div class="row"><span class="lab">חיוב למשפחה — כך הוא מחושב</span>
      <span class="sel"><i aria-hidden="true">₪</i>תעריף לילד</span>
      <span class="amt">${D.money(D.tariff.tuition)}</span></div>
    <div class="row"><span class="lab">הסעות לילד (למי שרשום לקו)</span>
      <span class="sel"><i aria-hidden="true">🚌</i>${D.routes.length} קווים</span>
      <span class="amt">${D.money(D.tariff.bus)}</span></div>
    <div class="row"><span class="lab">ספרים וציוד</span>
      <span class="sel"><i aria-hidden="true">📚</i>לילד</span>
      <span class="amt">${D.money(D.tariff.books)}</span>
      <span class="rate">הנחה: הגבוהה בלבד</span></div>
    <div class="note"><span aria-hidden="true">🛈</span>
      <span>${D.late} משפחות בפיגור בלי הוראת קבע — <a href="#">רשימה לשיחה</a></span></div>
  </div>

  <h2 class="sec">תנועות אחרונות</h2>
  <p class="sub">${D.payList.length} תשלומים אחרונים · מקובצים לפי יום</p>
  ${groups.map(([day, rows]) => `<p class="day">${day}</p>
    ${rows.map((p, i) => `<div class="tx"><span class="c" style="${c(i)}">${p.init}</span>
      <span><b>${p.fam}</b><span>${p.method} · שכר לימוד</span></span>
      <span class="m">+${D.nis(p.amount)}<small>לפני ${p.ago} ימים</small></span></div>`).join('')}`).join('')}

  <h2 class="sec">תרומות שהתקבלו</h2>
  <p class="sub">מגבית ${D.camp} · ${Math.round(D.raised / D.goal * 100)}% מהיעד</p>
  ${D.donList.slice(0, 8).map((d, i) => `<div class="tx"><span class="c" style="${c(i + 1)}">${d.init}</span>
    <span><b>${d.name}</b><span>${d.city || '—'} · ${d.method}</span></span>
    <span class="m">+${D.nis(d.amount)}<small>${d.camp}</small></span></div>`).join('')}

  <h2 class="sec">הלוואות גמ״ח</h2>
  <p class="sub">${D.loans} בתיק · ${D.money(D.fundOut)} בחוץ · ${D.fundLate} באיחור</p>
  ${D.loanList.map((l, i) => `<div class="tx"><span class="c" style="${c(i + 2)}">${l.init}</span>
    <span><b>${l.fam}</b><span>${l.purpose} · ${l.stage} · ${l.g}/2 ערבים</span></span>
    <span class="m neg">−${D.nis(l.amount)}<small>${l.paid ? l.paid + '/' + l.inst + ' תשלומים' : 'טרם ניתנה'}</small></span></div>`).join('')}
</main>

<aside class="right">
  <section class="dark"><h2>דורש הכרעה</h2><p class="s">${D.alerts.length} עניינים פתוחים</p>
    <div class="mini">${D.alerts.map(([t, dep], i) => `<span class="r2"><span class="c" style="${c(i)}">!</span>
      <span>${t}<br><span style="font-size:14px">${dep}</span></span></span>`).join('')}</div>
  </section>

  <section><h2>תקציב מול ביצוע</h2><p class="s">באלפי ₪ · ${D.budget.length} סעיפים</p>
    <div class="bars">${D.budget.map(b => `<div class="b"><span>${b.name}</span>
      <span style="font-variant-numeric:tabular-nums">${b.actual}/${b.plan}</span>
      <span class="t"><i class="${b.actual > b.plan ? 'over' : ''}" style="width:${Math.min(100, b.actual / b.plan * 100)}%"></i></span></div>`).join('')}</div>
  </section>

  <section><h2>קווי הסעה</h2><p class="s">${D.routes.reduce((a, r) => a + r.riders, 0)} נוסעים</p>
    <div class="mini">${D.routes.map((r, i) => `<span class="r2"><span class="c" style="${c(i)}">🚌</span>
      <span>${r.name.split(' · ')[0]}<br><span style="font-size:14px">${r.driver || 'אין נהג'}</span></span>
      <span class="m">${r.riders}</span></span>`).join('')}</div>
  </section>

  <section><h2>בתור לקבלת קהל</h2><p class="s">${D.queueN} ממתינים</p>
    <div class="mini">${D.queue.slice(0, 6).map((q, i) => `<span class="r2"><span class="c" style="${c(i)}">${q.no}</span>
      <span>${q.fam}<br><span style="font-size:14px">${q.reason}</span></span></span>`).join('')}</div>
  </section>
</aside>
</div>
<p class="foot">כל היתרות, התנועות והסכומים נשאבים מהמחסן של המערכת · החלקים (פס-ניווט · רצועת-יתרות ·
  כרטיס-חישוב עם בוררים ושורת-עמלה · תנועות לפי יום · טבעת-צל במקום מסגרת · כפתור-גלולה) נמדדו ב-wise.com · נתוני דוגמה</p>`;
  },
};
