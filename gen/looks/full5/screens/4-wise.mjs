/* מסך הבית בשפת Wise — עמוד-חשבון מלא:
   פס-ניווט עליון, רצועת-יתרות בצד, יתרה ראשית עם שורת-פעולות, רשימת-תנועות מקובצת לפי יום,
   כרטיס-המרה עם בוררים ושורת-עמלה, וכרטיסי-צד. המבנה של עמוד החשבון בצילום. */
export default {
  id: '4-wise', name: 'Wise', ref: 'עמוד-חשבון: ניווט · רצועת-יתרות · תנועות לפי יום · כרטיס-חישוב · כרטיסי-צד',
  fonts: ['Heebo:wght@400;500;700;800'],
  css: `
:root{--bg:#fff;--ink:#163300;--mut:#454f3f;--dim:#6b7464;--hair:#dcdad0;--sunk:#f7f5f0;
 --lime:#9fe870;--limeD:#8ad95c;--pos:#2f7a00;--neg:#a8281a;--gold:#8a5a00}
body{background:var(--bg);color:var(--ink);font:400 16px/1.5 Heebo,Arial,sans-serif}
.nav{border-block-end:1px solid var(--hair);position:sticky;top:0;background:#fff;z-index:10}
.nav .in{max-width:1220px;margin-inline:auto;padding:13px 20px;display:flex;align-items:center;gap:22px;flex-wrap:wrap}
.nav .logo{font:800 22px Heebo;letter-spacing:-.02em}
.nav a{font-size:14.5px;font-weight:500;color:var(--mut)}
.nav a:hover{color:var(--ink)}
.nav .sp{flex:1}
.nav .av{width:34px;height:34px;border-radius:50%;background:var(--lime);display:grid;place-items:center;font-weight:800;font-size:13px}

.band{background:var(--lime);color:var(--ink)}
.band .in{max-width:1220px;margin-inline:auto;padding:28px 20px;display:flex;gap:20px;align-items:flex-end;flex-wrap:wrap}
.band h1{font:800 clamp(26px,4.4vw,42px)/1.05 Heebo;letter-spacing:-.02em;max-width:18ch}
.band .r{margin-inline-start:auto;text-align:end}
.band .r b{display:block;font:800 clamp(22px,3.4vw,32px)/1 Heebo;font-variant-numeric:tabular-nums}
.band .r span{font-size:13.5px}

.wrap{max-width:1220px;margin-inline:auto;padding:24px 20px 80px;display:grid;
 grid-template-columns:270px minmax(0,1fr) 300px;gap:24px;align-items:start}
@media(max-width:1100px){.wrap{grid-template-columns:260px minmax(0,1fr)}.right{grid-column:1/-1}}
@media(max-width:820px){.wrap{grid-template-columns:1fr}.left{order:2}}

.left h2,.right h2{font:800 15px Heebo;margin-bottom:10px}
.bal{display:grid;gap:2px;margin-bottom:22px}
.bal a{display:grid;grid-template-columns:36px minmax(0,1fr) auto;gap:11px;align-items:center;padding:10px;border-radius:12px}
.bal a:hover{background:var(--sunk)}
.bal .c{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;font-size:14px;font-weight:800}
.bal b{font-size:14.5px;font-weight:700;display:block}
.bal span{font-size:12px;color:var(--dim)}
.bal .m{font-weight:700;font-variant-numeric:tabular-nums;font-size:14px;white-space:nowrap}
.addbtn{width:100%;border:1.5px dashed var(--hair);background:none;border-radius:12px;padding:11px;
 font:700 14px Heebo;color:var(--mut);min-height:44px;margin-top:6px}
.addbtn:hover{border-color:var(--ink);color:var(--ink)}

.main .big{font:800 clamp(30px,6vw,46px)/1 Heebo;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.main .cap{font-size:14px;color:var(--mut);margin-top:4px}
.acts{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0 26px}
.btn{background:var(--ink);color:#fff;border:0;border-radius:999px;padding:12px 24px;font:700 15px Heebo;min-height:48px}
.btn:hover{background:#0f2400}
.btn.lime{background:var(--lime);color:var(--ink)}
.btn.lime:hover{background:var(--limeD)}
.btn.line{background:#fff;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--ink)}

.calc{border:1px solid var(--hair);border-radius:16px;overflow:hidden;margin-bottom:26px}
.calc .row{display:flex;align-items:center;gap:14px;padding:18px 20px;border-block-end:1px solid var(--hair);flex-wrap:wrap}
.calc .row:last-child{border:0}
.calc .lab{width:100%;font-size:13px;color:var(--dim)}
.calc .sel{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--hair);border-radius:999px;padding:7px 14px;font-weight:700;font-size:14px}
.calc .sel i{width:22px;height:22px;border-radius:50%;background:var(--sunk);display:grid;place-items:center;font-style:normal;font-size:11px}
.calc .amt{margin-inline-start:auto;font:800 clamp(24px,4.4vw,34px)/1 Heebo;font-variant-numeric:tabular-nums}
.calc .note{background:var(--sunk);padding:12px 20px;font-size:13px;display:flex;gap:9px;align-items:center;flex-wrap:wrap}
.calc .note a{color:var(--pos);font-weight:700;text-decoration:underline}
.calc .rate{display:inline-flex;align-items:center;gap:7px;background:var(--sunk);border-radius:999px;
 padding:6px 13px;font-size:13px;font-weight:700;margin-inline-start:auto}

h2.sec{font:800 19px Heebo;margin:26px 0 6px}
p.sub{font-size:13.5px;color:var(--mut);margin-bottom:12px}
.day{font:700 12.5px Heebo;color:var(--dim);margin:18px 0 6px}
.tx{display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:13px;align-items:center;padding:12px 4px;border-block-end:1px solid var(--hair)}
.tx .c{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:800}
.tx b{font-size:15px;font-weight:700;display:block}
.tx span{font-size:12.5px;color:var(--dim)}
.tx .m{text-align:end;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
.tx .m.pos{color:var(--pos)}
.tx .m small{display:block;font-size:11.5px;font-weight:400;color:var(--dim)}

.right section{border:1px solid var(--hair);border-radius:16px;padding:16px;margin-bottom:14px}
.right p.s{font-size:13px;color:var(--mut);margin-bottom:10px}
.mini{display:grid;gap:8px}
.mini .r2{display:flex;align-items:center;gap:10px;font-size:13.5px}
.mini .r2 .c{width:30px;height:30px;border-radius:50%;background:var(--sunk);display:grid;place-items:center;font-size:12px;font-weight:700}
.mini .r2 .m{margin-inline-start:auto;font-weight:700;font-variant-numeric:tabular-nums}
.bars{display:grid;gap:7px;font-size:13px}
.bars .b{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}
.bars .t{height:8px;border-radius:999px;background:var(--sunk);position:relative;overflow:hidden;grid-column:1/-1}
.bars .t i{position:absolute;inset-block:0;inset-inline-start:0;background:var(--pos);border-radius:999px}
.bars .t i.over{background:var(--neg)}
.foot{max-width:1220px;margin:0 auto;padding:0 20px 40px;font-size:12.5px;color:var(--dim)}
`,
  body: (D) => {
    const cols = ['#e6f4d9:#2f7a00', '#dbe9ff:#14448a', '#ffe9cc:#8a5a00', '#f3e2ff:#5b34c4', '#ffe0dc:#a8281a'];
    const c = (i) => { const [bg, fg] = cols[i % 5].split(':'); return `background:${bg};color:${fg}`; };
    const groups = [['היום', D.payList.slice(0, 5)], ['אתמול', D.payList.slice(5, 10)], ['השבוע', D.payList.slice(10, 16)]];
    return `<header class="nav noprint"><div class="in"><span class="logo">מוסד</span>
  <a href="#">גבייה</a><a href="#">תרומות</a><a href="#">כספים</a><a href="#">חסד</a><a href="#">דוחות</a>
  <span class="sp"></span><a href="#">עזרה</a><span class="av">מ</span></div></header>

<section class="band"><div class="in">
  <h1>${D.pct}% מהחיוב השנתי כבר נגבו.</h1>
  <div class="r"><b>${D.money(D.open)}</b><span>פתוח אצל ${D.families} משפחות · ${D.late} בפיגור</span></div>
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
      .map(([t, s, v, i]) => `<a href="#"><span class="c" style="${c(i)}">₪</span>
        <span><b>${t}</b><span>${s}</span></span><span class="m">${D.money(v)}</span></a>`).join('')}
  </div>
  <button class="addbtn noprint">+ פתיחת יתרה חדשה</button>

  <h2 style="margin-top:24px">אנשים</h2>
  <div class="mini">
    ${D.staffList.slice(0, 6).map((s, i) => `<span class="r2"><span class="c" style="${c(i)}">${s.init}</span>
      <span>${s.name}</span><span class="m" style="font-size:12px;color:var(--dim)">${s.absent || 'נוכח'}</span></span>`).join('')}
  </div>
</aside>

<main class="main">
  <p class="cap">נגבה עד היום · ${D.tariff.year}</p>
  <p class="big">${D.money(D.paid)}</p>
  <p class="cap">מתוך ${D.money(D.due)} שחויבו ל-${D.families} משפחות · ${D.num(D.students)} תלמידים</p>
  <div class="acts noprint"><button class="btn">רישום תשלום</button><button class="btn lime">שליחת תזכורות</button>
    <button class="btn line">הפקת קבלות</button><button class="btn line">ייצוא לרואה חשבון</button></div>

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
      <span class="m pos">+${D.nis(p.amount)}<small>לפני ${p.ago} ימים</small></span></div>`).join('')}`).join('')}

  <h2 class="sec">תרומות שהתקבלו</h2>
  <p class="sub">מגבית ${D.camp} · ${Math.round(D.raised / D.goal * 100)}% מהיעד</p>
  ${D.donList.slice(0, 8).map((d, i) => `<div class="tx"><span class="c" style="${c(i + 1)}">${d.init}</span>
    <span><b>${d.name}</b><span>${d.city || '—'} · ${d.method}</span></span>
    <span class="m pos">+${D.nis(d.amount)}<small>${d.camp}</small></span></div>`).join('')}

  <h2 class="sec">הלוואות גמ״ח</h2>
  <p class="sub">${D.loans} בתיק · ${D.money(D.fundOut)} בחוץ · ${D.fundLate} באיחור</p>
  ${D.loanList.map((l, i) => `<div class="tx"><span class="c" style="${c(i + 2)}">${l.init}</span>
    <span><b>${l.fam}</b><span>${l.purpose} · ${l.stage} · ${l.g}/2 ערבים</span></span>
    <span class="m">−${D.nis(l.amount)}<small>${l.paid ? l.paid + '/' + l.inst + ' תשלומים' : 'טרם ניתנה'}</small></span></div>`).join('')}
</main>

<aside class="right">
  <section><h2>דורש הכרעה</h2><p class="s">${D.alerts.length} עניינים פתוחים</p>
    <div class="mini">${D.alerts.map(([t, dep], i) => `<span class="r2"><span class="c" style="${c(i)}">!</span>
      <span>${t}<br><span style="font-size:12px;color:var(--dim)">${dep}</span></span></span>`).join('')}</div>
  </section>

  <section><h2>תקציב מול ביצוע</h2><p class="s">באלפי ₪ · ${D.budget.length} סעיפים</p>
    <div class="bars">${D.budget.map(b => `<div class="b"><span>${b.name}</span>
      <span style="font-variant-numeric:tabular-nums">${b.actual}/${b.plan}</span>
      <span class="t"><i class="${b.actual > b.plan ? 'over' : ''}" style="width:${Math.min(100, b.actual / b.plan * 100)}%"></i></span></div>`).join('')}</div>
  </section>

  <section><h2>קווי הסעה</h2><p class="s">${D.routes.reduce((a, r) => a + r.riders, 0)} נוסעים</p>
    <div class="mini">${D.routes.map((r, i) => `<span class="r2"><span class="c" style="${c(i)}">🚌</span>
      <span>${r.name.split(' · ')[0]}<br><span style="font-size:12px;color:var(--dim)">${r.driver || 'אין נהג'}</span></span>
      <span class="m">${r.riders}</span></span>`).join('')}</div>
  </section>

  <section><h2>בתור לקבלת קהל</h2><p class="s">${D.queueN} ממתינים</p>
    <div class="mini">${D.queue.slice(0, 6).map((q, i) => `<span class="r2"><span class="c" style="${c(i)}">${q.no}</span>
      <span>${q.fam}<br><span style="font-size:12px;color:var(--dim)">${q.reason}</span></span></span>`).join('')}</div>
  </section>
</aside>
</div>
<p class="foot">כל היתרות, התנועות והסכומים נשאבים מהמחסן של המערכת · החלקים (פס-ניווט · רצועת-יתרות ·
  כרטיס-חישוב עם בוררים ושורת-עמלה · תנועות לפי יום · כפתור-גלולה) לקוחים מ-Wise · נתוני דוגמה</p>`;
  },
};
