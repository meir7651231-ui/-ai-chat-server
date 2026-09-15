/* מסך הבית בשפת Monzo — עמוד-בית מלא:
   פס-הודעה עליון, כרטיס-חשבון צבעוני עם יתרה, רצועת «קופות», סיכום-הוצאה לפי קטגוריה,
   רשימת-תנועות ארוכה עם עיגולי-אייקון, כרטיסי-צבע עם כרטיסונים לבנים, ותשלומים קרובים. */
import { monzoCard } from '../art.mjs';

export default {
  id: '5-monzo', name: 'Monzo', ref: 'עמוד-בית: כרטיס-חשבון · קופות · הוצאה לפי קטגוריה · תנועות · כרטיסי-צבע',
  fonts: ['Rubik:wght@400;500;700;800'],
  css: `
:root{/* נמדד ב-monzo.com — כל גוון כאן מופיע במדידה */
 --bg:#ffffff;--ink:#091723;--mut:#3b4c54;--dim:#3b4c54;
 --mint:#f2f8f3;--navy:#112231;--coral:#ff4f40;--grey:#efefef;
 /* מסגרת-הכרטיס המדודה היא 2px בשקיפות (הצבע חזר null כי אלפא<0.5) */
 --edge:2px solid rgba(9,23,35,.1);
 --rTiny:4px;--r:16px;--rCard:32px;--rBig:64px;--rPill:128px;
 --gap:8px;--gap2:24px}
body{background:var(--bg);color:var(--ink);font:400 16px/22.4px Rubik,Arial,sans-serif}

.note{background:var(--mint);padding:12px 24px;display:flex;align-items:center;gap:16px;font-size:16px;flex-wrap:wrap}
.note .sp{flex:1}
/* כפתור-הקו המדוד: מסגרת 2 · גלולה 128 · גובה 36 · ריפוד 0/16 · 13px/400 */
.note button{background:none;border:2px solid var(--ink);color:var(--ink);border-radius:var(--rPill);
 padding:0 16px;font:400 13px Rubik;min-height:36px}
.note button:hover{background:var(--ink);color:#fff}

.nav{border-block-end:var(--edge);position:sticky;top:0;background:#fff;z-index:10}
.nav .in{max-width:1180px;margin-inline:auto;padding:16px 24px;display:flex;align-items:center;gap:24px;flex-wrap:wrap}
.nav .logo{font-weight:800;font-size:22px}
.nav a{font-size:16px;color:var(--ink)}
.nav a:hover{text-decoration:underline}
.nav .sp{flex:1}
/* הכפתור הראשי המדוד: רקע #091723 · טקסט לבן · גלולה 128 · גובה 48 · ריפוד 0/24 · 16px/400 */
.nav .btn{background:var(--ink);color:#fff;border:0;border-radius:var(--rPill);padding:0 24px;font:400 16px Rubik;
 min-height:48px;display:inline-flex;align-items:center;gap:8px}
.nav .btn::after{content:'←';font-size:13px}

.wrap{max-width:1180px;margin-inline:auto;padding:32px 24px 80px}
/* הגיבור של מונזו: משטח הנייבי המדוד #112231, פינה 32, ריפוד 64, כותרת 49/800 לבנה */
.lead{background:var(--navy);color:#fff;border-radius:var(--rCard);padding:64px;margin-bottom:32px;
 display:grid;grid-template-columns:minmax(0,1fr) 380px;gap:48px;align-items:center}
@media(max-width:900px){.lead{grid-template-columns:1fr;padding:32px 24px;gap:32px}}
.lead h1{font:800 clamp(32px,5vw,49px)/1.2 Rubik;max-width:16ch;text-wrap:balance}
.lead p{font-size:20px;line-height:28px;margin:16px 0 32px;max-width:46ch;opacity:.92}
.lead .cta{display:flex;gap:16px;flex-wrap:wrap}
.lead .cta button{background:#fff;color:var(--ink);border:0;border-radius:var(--rPill);padding:0 24px;font:400 16px Rubik;min-height:48px}
.lead .cta button.o{background:none;color:#fff;border:2px solid #fff}
.lead .cardart{width:100%;height:auto;filter:drop-shadow(0 24px 48px rgb(0 0 0 / .45));transform:rotate(-6deg)}
.greet{font:800 clamp(26px,3.6vw,34px)/1.2 Rubik;margin-bottom:24px}
.hero{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:24px;align-items:start;margin-bottom:32px}
@media(max-width:860px){.hero{grid-template-columns:1fr}}
/* כרטיס מדוד: רדיוס 32 · ריפוד 32/24 · מסגרת 2 */
.acct{background:var(--coral);color:var(--ink);border-radius:var(--rCard);border:var(--edge);
 padding:32px 24px;min-height:230px;display:flex;flex-direction:column;gap:8px}
.acct .lab{font-size:16px;font-weight:500}
.acct .big{font:800 clamp(34px,6vw,49px)/1.1 Rubik;font-variant-numeric:tabular-nums}
.acct .sub{font-size:16px}
.acct .row{margin-top:auto;padding-top:16px;display:flex;gap:8px;flex-wrap:wrap}
.acct .row button{background:var(--ink);color:#fff;border:0;border-radius:var(--rPill);padding:0 24px;font:400 16px Rubik;min-height:48px}
.acct .row button.o{background:none;color:var(--ink);border:2px solid var(--ink)}
.acct .row button.o:hover{background:var(--ink);color:#fff}
.side{display:grid;gap:16px}
.mini{background:var(--mint);border:var(--edge);border-radius:var(--rCard);padding:32px 24px}
.mini h3{font:700 20px/1.2 Rubik;margin-bottom:12px}
.mini .r{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:16px;align-items:center;padding:8px 0;font-size:16px}
.mini .c{width:40px;height:40px;border-radius:var(--rPill);display:grid;place-items:center;font-size:14px;font-weight:500}
.mini .m{font-weight:500;font-variant-numeric:tabular-nums}

/* h2 מדוד: 44/800 — הוקטן לעברית, המשקל נשמר */
h2{font:800 clamp(26px,3.6vw,34px)/1.2 Rubik;margin:40px 0 4px}
p.sub{font-size:16px;color:var(--mut);margin-bottom:16px}
.pots{display:flex;gap:16px;overflow-x:auto;padding-bottom:12px}
.pot{flex:none;width:200px;border-radius:var(--rCard);border:var(--edge);padding:24px;min-height:150px;display:flex;flex-direction:column;gap:8px}
.pot b{font:800 26px/1.1 Rubik;font-variant-numeric:tabular-nums}
.pot span{font-size:16px;font-weight:500}
.pot small{font-size:14px;margin-top:auto;padding-top:8px}
/* ארבעת המשטחים היחידים שנמדדו: קורל · נייבי · מנטה · לבן */
.p1,.p3{background:var(--coral);color:var(--ink)}
.p2,.p5{background:var(--navy);color:#fff}
.p4,.p6{background:var(--mint);color:var(--ink)}

.cat{display:grid;gap:16px;background:var(--mint);border:var(--edge);border-radius:var(--rCard);padding:32px 24px}
.cat .r{display:grid;grid-template-columns:40px minmax(0,1fr) auto;gap:16px;align-items:center;font-size:16px}
.cat .c{width:40px;height:40px;border-radius:var(--rPill);display:grid;place-items:center;font-size:16px}
.cat .t{height:8px;border-radius:var(--rPill);background:#fff;overflow:hidden;position:relative;grid-column:2/4;margin-top:-8px}
.cat .t i{position:absolute;inset-block:0;inset-inline-start:0;border-radius:var(--rPill)}
.cat .m{font-weight:500;font-variant-numeric:tabular-nums;white-space:nowrap}

.box{background:var(--coral);color:var(--ink);border:var(--edge);border-radius:var(--rCard);padding:24px;display:grid;gap:8px}
.box.blue{background:var(--navy);color:#fff}
.box.green{background:var(--mint);color:var(--ink)}
.box h3{font:700 20px/1.2 Rubik;padding:0 8px 4px}
/* הכרטיסון הלבן בתוך הכרטיס הצבעוני — רדיוס-המשנה המדוד 16 */
.inner{background:#fff;color:var(--ink);border-radius:var(--r);padding:16px;display:grid;
 grid-template-columns:40px minmax(0,1fr) auto;gap:16px;align-items:center}
.inner .c{width:40px;height:40px;border-radius:var(--rPill);background:var(--mint);display:grid;place-items:center;font-size:16px}
.inner b{font-size:16px;font-weight:500;display:block}
.inner .tag{display:inline-block;font-size:13px;font-weight:500;background:var(--mint);color:var(--ink);
 border-radius:var(--rPill);padding:2px 12px;margin-bottom:4px}
.inner .tag.w{background:var(--navy);color:#fff}
.inner .tag.r{background:var(--coral);color:var(--ink)}
.inner span.s{font-size:14px;color:var(--mut)}
.inner .ch{font-size:20px;color:var(--ink)}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:24px}

.tx{display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:16px;align-items:center;padding:12px 4px;
 border-block-end:var(--edge)}
.tx .c{width:48px;height:48px;border-radius:var(--rPill);display:grid;place-items:center;font-size:14px;font-weight:500}
.tx b{font-size:16px;font-weight:500;display:block}
.tx span{font-size:14px;color:var(--mut)}
.tx .m{text-align:end;font-weight:500;font-variant-numeric:tabular-nums;white-space:nowrap}
.tx .m small{display:block;font-size:14px;font-weight:400;color:var(--mut)}
.day{font-size:14px;font-weight:500;color:var(--mut);margin:24px 0 8px}
.foot{margin-top:32px;font-size:14px;color:var(--mut)}
`,
  body: (D) => {
    /* ארבעת המשטחים שנמדדו ב-monzo.com — מנטה · נייבי · קורל · אפור */
    const cols = ['#f2f8f3:#091723', '#112231:#ffffff', '#ff4f40:#091723', '#efefef:#091723'];
    const c = (i) => { const [bg, fg] = cols[i % 4].split(':'); return `background:${bg};color:${fg}`; };
    const budTot = D.budget.reduce((a, b) => a + b.actual, 0);
    return `<div class="note noprint"><span>נתוני דוגמה · ${D.today.hd} ${D.today.hy} · ${D.today.dow}</span>
  <span class="sp"></span><button>החלפת שנה</button></div>
<header class="nav noprint"><div class="in"><span class="logo">מוסד</span>
  <a href="#">בית</a><a href="#">גבייה</a><a href="#">חינוך</a><a href="#">תרומות</a><a href="#">חסד</a><a href="#">דוחות</a>
  <span class="sp"></span><button class="btn">רישום תשלום</button></div></header>

<div class="wrap">
  <section class="lead">
    <div>
      <h1>הכסף של המוסד — במקום אחד, ברור, וכל הזמן מעודכן.</h1>
      <p>${D.pct}% מהחיוב השנתי כבר נגבו. ${D.money(D.open)} עדיין פתוחים אצל ${D.families} משפחות,
        ו-${D.late} מהן בפיגור בלי הוראת קבע. הכל נשאב מהמחסן, אף מספר לא הוקלד.</p>
      <div class="cta noprint"><button>רישום תשלום</button><button class="o">שליחת תזכורות</button></div>
    </div>
    ${monzoCard('4417')}
  </section>
  <h2 class="greet">בוקר טוב · הבית של המוסד</h2>
  <section class="hero">
    <div class="acct">
      <span class="lab">נגבה עד היום · ${D.tariff.year}</span>
      <span class="big">${D.money(D.paid)}</span>
      <span class="sub">${D.pct}% מהחיוב · נותרו ${D.money(D.open)} אצל ${D.families} משפחות</span>
      <span class="row noprint"><button>רישום תשלום</button><button class="o">שליחת תזכורות</button><button class="o">הפקת קבלות</button></span>
    </div>
    <div class="side">
      <div class="mini"><h3>היום במוסד</h3>
        ${D.minyanim.slice(2, 6).map((m, i) => `<div class="r"><span class="c" style="${c(i)}">🕯</span>
          <span>${m.name}<br><span style="font-size:14px;color:var(--mut)">${m.where || '—'}</span></span>
          <span class="m">${D.ltr(m.time)}</span></div>`).join('')}</div>
      <div class="mini"><h3>צוות</h3>
        ${D.staffList.filter(s => s.absent).slice(0, 3).map((s, i) => `<div class="r"><span class="c" style="${c(i + 3)}">${s.init}</span>
          <span>${s.name}<br><span style="font-size:14px;color:var(--mut)">${s.role}</span></span>
          <span class="m" style="font-size:14px;font-weight:400">${s.sub ? 'מחליף' : 'אין מחליף'}</span></div>`).join('')}
        <div class="r"><span class="c" style="${c(2)}">✓</span><span>נוכחים היום</span><span class="m">${D.present}/${D.staff}</span></div></div>
    </div>
  </section>

  <h2>קופות</h2>
  <p class="sub">כסף שמוקצה מראש · ${D.budget.length} סעיפי תקציב ועוד</p>
  <div class="pots">
    <div class="pot p1"><span>מגבית הבניין</span><b>${D.k(D.raised)}</b><small>מתוך ${D.k(D.goal)} · ${Math.round(D.raised / D.goal * 100)}%</small></div>
    <div class="pot p3"><span>גמ״ח — זמין</span><b>${D.k(D.fund)}</b><small>${D.loans} הלוואות פעילות</small></div>
    <div class="pot p2"><span>יתרה פתוחה</span><b>${D.k(D.open)}</b><small>${D.late} משפחות בפיגור</small></div>
    <div class="pot p4"><span>תקציב שנתי</span><b>${D.k(budTot * 1000)}</b><small>ביצוע ${D.budget.length} סעיפים</small></div>
    <div class="pot p5"><span>הסעות</span><b>${D.routes.reduce((a, r) => a + r.riders, 0)}</b><small>נוסעים ב-${D.routes.length} קווים</small></div>
    <div class="pot p6"><span>תלמידים</span><b>${D.num(D.students)}</b><small>${D.classes.length} כיתות · ${D.attAll}% נוכחות</small></div>
  </div>

  <h2>הוצאה לפי סעיף</h2>
  <p class="sub">באלפי ₪ · אדום = חריגה מהתכנון</p>
  <div class="cat">
    ${D.budget.map((b, i) => `<div class="r"><span class="c" style="${c(i)}">${['🎓', '🍲', '🚌', '🔧', '📚', '🛏', '🧾', '🕯'][i % 8]}</span>
      <span>${b.name}</span><span class="m">${b.actual} / ${b.plan}</span>
      <span class="t"><i style="width:${Math.min(100, b.actual / b.plan * 100)}%;background:${b.actual > b.plan ? 'var(--coral)' : 'var(--navy)'}"></i></span></div>`).join('')}
  </div>

  <h2>דורש הכרעה</h2>
  <p class="sub">${D.alerts.length} עניינים · לחיצה פותחת את האגף</p>
  <div class="two">
    <div class="box">
      <h3>היום</h3>
      ${D.alerts.map(([t, dep, sev]) => `<a class="inner" href="#"><span class="c" aria-hidden="true">${['⚠', '⏳', '👤'][sev - 1]}</span>
        <span><span class="tag ${sev === 1 ? 'r' : sev === 2 ? 'w' : ''}">${dep}</span><b>${t}</b></span>
        <span class="ch" aria-hidden="true">›</span></a>`).join('')}
    </div>
    <div class="box blue">
      <h3>קריאות שירות</h3>
      ${D.calls.map(c2 => `<a class="inner" href="#"><span class="c" aria-hidden="true">🔧</span>
        <span><span class="tag ${c2.sev === 'דחוף' ? 'r' : 'w'}">${c2.sev}</span><b>${c2.text}</b>
        <span class="s">${c2.owner || 'לא שובץ'} · ${c2.days} ימים</span></span>
        <span class="ch" aria-hidden="true">›</span></a>`).join('')}
    </div>
    <div class="box green">
      <h3>בתור לקבלת קהל</h3>
      ${D.queue.slice(0, 5).map(q => `<a class="inner" href="#"><span class="c" aria-hidden="true">${q.no}</span>
        <span><span class="tag">${q.state === 'inside' ? 'בפנים' : 'ממתין'}</span><b>${q.fam}</b>
        <span class="s">${q.reason}</span></span><span class="ch" aria-hidden="true">›</span></a>`).join('')}
    </div>
  </div>

  <h2>תנועות</h2>
  <p class="sub">${D.payList.length} תשלומים אחרונים · ${D.donList.length} תרומות</p>
  <p class="day">היום</p>
  ${D.payList.slice(0, 6).map((p, i) => `<div class="tx"><span class="c" style="${c(i)}">${p.init}</span>
    <span><b>${p.fam}</b><span>${p.method} · שכר לימוד</span></span>
    <span class="m">+${D.nis(p.amount)}<small>לפני ${p.ago} ימים</small></span></div>`).join('')}
  <p class="day">תרומות שהתקבלו</p>
  ${D.donList.slice(0, 7).map((d, i) => `<div class="tx"><span class="c" style="${c(i + 2)}">${d.init}</span>
    <span><b>${d.name}</b><span>${d.city || '—'} · ${d.method}</span></span>
    <span class="m">+${D.nis(d.amount)}<small>${d.camp}</small></span></div>`).join('')}
  <p class="day">הלוואות שניתנו</p>
  ${D.loanList.slice(0, 6).map((l, i) => `<div class="tx"><span class="c" style="${c(i + 4)}">${l.init}</span>
    <span><b>${l.fam}</b><span>${l.purpose} · ${l.stage}</span></span>
    <span class="m">−${D.nis(l.amount)}<small>${l.g}/2 ערבים</small></span></div>`).join('')}

  <h2>משפחות עם יתרה פתוחה</h2>
  <p class="sub">${D.topOpen.length} הגדולות · מתוך ${D.families}</p>
  ${D.topOpen.map((f, i) => `<div class="tx"><span class="c" style="${c(i)}">${f.init}</span>
    <span><b>${f.name}</b><span>${f.city} · ${f.kids} ילדים${f.hok ? ' · הוראת קבע' : ''}${f.disc ? ' · הנחה ' + f.disc + '%' : ''}</span></span>
    <span class="m">${D.nis(f.bal)}<small>שולם ${D.nis(f.paid)}</small></span></div>`).join('')}

  <p class="foot">כל התנועות, הקופות והסכומים נשאבים מהמחסן של המערכת · החלקים (כרטיס-חשבון צבעוני · קופות ·
    הוצאה לפי קטגוריה · כרטיסון לבן עם תג וחץ · רשימת-תנועות) נמדדו ב-monzo.com · נתוני דוגמה</p>
</div>`;
  },
};
