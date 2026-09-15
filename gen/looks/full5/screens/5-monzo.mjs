/* מסך הבית בשפת Monzo — עמוד-בית מלא:
   פס-הודעה עליון, כרטיס-חשבון צבעוני עם יתרה, רצועת «קופות», סיכום-הוצאה לפי קטגוריה,
   רשימת-תנועות ארוכה עם עיגולי-אייקון, כרטיסי-צבע עם כרטיסונים לבנים, ותשלומים קרובים. */
export default {
  id: '5-monzo', name: 'Monzo', ref: 'עמוד-בית: כרטיס-חשבון · קופות · הוצאה לפי קטגוריה · תנועות · כרטיסי-צבע',
  fonts: ['Rubik:wght@400;500;600;700'],
  css: `
:root{--bg:#fff;--ink:#14233c;--mut:#57606f;--dim:#5f6875;--hair:#e6e4e1;--sunk:#f6f5f4;
 --coral:#ff4f40;--coralD:#2b0c08;--pos:#116b3c;--neg:#a8281a;--navy:#14233c}
body{background:var(--bg);color:var(--ink);font:400 16px/1.55 Rubik,Arial,sans-serif}
.note{background:var(--sunk);padding:11px 20px;display:flex;align-items:center;gap:12px;font-size:13.5px;flex-wrap:wrap}
.note .sp{flex:1}
.note button{background:#fff;border:1px solid var(--hair);border-radius:999px;padding:7px 15px;font-size:13px;min-height:36px}
.nav{border-block-end:1px solid var(--hair);position:sticky;top:0;background:#fff;z-index:10}
.nav .in{max-width:1180px;margin-inline:auto;padding:13px 20px;display:flex;align-items:center;gap:20px;flex-wrap:wrap}
.nav .logo{font-weight:700;font-size:20px}
.nav a{font-size:14.5px;color:var(--mut)}
.nav a:hover{color:var(--ink)}
.nav .sp{flex:1}
.nav .btn{background:var(--navy);color:#fff;border:0;border-radius:999px;padding:9px 17px;font-size:14px;min-height:40px;
 display:inline-flex;align-items:center;gap:7px}
.nav .btn::after{content:'←';font-size:12px;opacity:.85}

.wrap{max-width:1180px;margin-inline:auto;padding:24px 20px 80px}
.greet{font-size:clamp(24px,4vw,32px);font-weight:700;letter-spacing:-.01em;margin-bottom:18px}
.hero{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:20px;align-items:start;margin-bottom:26px}
@media(max-width:860px){.hero{grid-template-columns:1fr}}
.acct{background:var(--coral);color:var(--coralD);border-radius:22px;padding:24px;min-height:210px;display:flex;flex-direction:column;gap:6px}
.acct .lab{font-size:13.5px;font-weight:600;opacity:.85}
.acct .big{font-size:clamp(32px,6vw,48px);font-weight:700;font-variant-numeric:tabular-nums;line-height:1.05}
.acct .sub{font-size:13.5px;opacity:.9}
.acct .row{margin-top:auto;display:flex;gap:9px;flex-wrap:wrap}
.acct .row button{background:#fff;color:var(--coralD);border:0;border-radius:999px;padding:10px 18px;font-size:14px;font-weight:600;min-height:42px}
.acct .row button.o{background:rgba(255,255,255,.25);color:#2b0c08;box-shadow:inset 0 0 0 1.5px rgba(43,12,8,.35)}
.side{display:grid;gap:12px}
.mini{background:#fff;border:1px solid var(--hair);border-radius:18px;padding:16px}
.mini h3{font-size:14.5px;margin-bottom:9px}
.mini .r{display:grid;grid-template-columns:32px minmax(0,1fr) auto;gap:11px;align-items:center;padding:7px 0;font-size:13.5px}
.mini .c{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:700}
.mini .m{font-weight:600;font-variant-numeric:tabular-nums}

h2{font-size:21px;font-weight:700;margin:26px 0 4px}
p.sub{font-size:13.5px;color:var(--mut);margin-bottom:14px}
.pots{display:flex;gap:12px;overflow-x:auto;padding-bottom:10px}
.pot{flex:none;width:168px;border-radius:18px;padding:16px;min-height:132px;display:flex;flex-direction:column;gap:4px}
.pot b{font-size:22px;font-weight:700;font-variant-numeric:tabular-nums}
.pot span{font-size:13px;font-weight:600}
.pot small{font-size:11.5px;margin-top:auto;opacity:.85}
.p1{background:#ffd7d2;color:#5c1810}.p2{background:#d6ecff;color:#0d3663}.p3{background:#dff3d8;color:#14401f}
.p4{background:#ffeccc;color:#5a3a00}.p5{background:#e8e2ff;color:#2d1f5c}.p6{background:#d9f3ef;color:#10403a}

.cat{display:grid;gap:10px;background:#fff;border:1px solid var(--hair);border-radius:18px;padding:18px}
.cat .r{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:12px;align-items:center;font-size:14px}
.cat .c{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font-size:14px}
.cat .t{height:8px;border-radius:999px;background:var(--sunk);overflow:hidden;position:relative;grid-column:2/4;margin-top:-4px}
.cat .t i{position:absolute;inset-block:0;inset-inline-start:0;border-radius:999px}
.cat .m{font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}

.box{background:var(--coral);border-radius:22px;padding:16px;display:grid;gap:10px;color:var(--coralD)}
.box.blue{background:#d6ecff}.box.green{background:#dff3d8}
.box h3{font-size:15px;padding:2px 4px 0}
.inner{background:#fff;color:var(--ink);border-radius:15px;padding:13px 15px;display:grid;
 grid-template-columns:36px minmax(0,1fr) auto;gap:12px;align-items:center}
.inner .c{width:36px;height:36px;border-radius:11px;background:#f1efec;display:grid;place-items:center;font-size:15px}
.inner b{font-size:14.5px;font-weight:600;display:block}
.inner .tag{display:inline-block;font-size:11px;font-weight:700;background:#d9f2e3;color:var(--pos);border-radius:999px;padding:1px 8px;margin-bottom:3px}
.inner .tag.w{background:#ffeccc;color:#8a5a00}.inner .tag.r{background:#ffe0dc;color:#a8281a}
.inner span.s{font-size:12.5px;color:var(--dim)}
.inner .ch{font-size:18px;color:var(--dim)}
.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:16px}

.tx{display:grid;grid-template-columns:44px minmax(0,1fr) auto;gap:13px;align-items:center;padding:12px 4px;border-block-end:1px solid var(--hair)}
.tx .c{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:700}
.tx b{font-size:15px;font-weight:600;display:block}
.tx span{font-size:12.5px;color:var(--dim)}
.tx .m{text-align:end;font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}
.tx .m.pos{color:var(--pos)}
.tx .m small{display:block;font-size:11.5px;font-weight:400;color:var(--dim)}
.day{font-size:12.5px;font-weight:600;color:var(--dim);margin:16px 0 4px}
.foot{margin-top:30px;font-size:12.5px;color:var(--dim)}
`,
  body: (D) => {
    const cols = ['#ffd7d2:#5c1810', '#d6ecff:#0d3663', '#dff3d8:#14401f', '#ffeccc:#5a3a00', '#e8e2ff:#2d1f5c', '#d9f3ef:#10403a'];
    const c = (i) => { const [bg, fg] = cols[i % 6].split(':'); return `background:${bg};color:${fg}`; };
    const budTot = D.budget.reduce((a, b) => a + b.actual, 0);
    return `<div class="note noprint"><span>נתוני דוגמה · ${D.today.hd} ${D.today.hy} · ${D.today.dow}</span>
  <span class="sp"></span><button>החלפת שנה</button></div>
<header class="nav noprint"><div class="in"><span class="logo">מוסד</span>
  <a href="#">בית</a><a href="#">גבייה</a><a href="#">חינוך</a><a href="#">תרומות</a><a href="#">חסד</a><a href="#">דוחות</a>
  <span class="sp"></span><button class="btn">רישום תשלום</button></div></header>

<div class="wrap">
  <h1 class="greet">בוקר טוב · הבית של המוסד</h1>
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
          <span>${m.name}<br><span style="font-size:12px;color:var(--dim)">${m.where || '—'}</span></span>
          <span class="m">${D.ltr(m.time)}</span></div>`).join('')}</div>
      <div class="mini"><h3>צוות</h3>
        ${D.staffList.filter(s => s.absent).slice(0, 3).map((s, i) => `<div class="r"><span class="c" style="${c(i + 3)}">${s.init}</span>
          <span>${s.name}<br><span style="font-size:12px;color:var(--dim)">${s.role}</span></span>
          <span class="m" style="font-size:12.5px">${s.sub ? 'מחליף' : 'אין מחליף'}</span></div>`).join('')}
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
      <span class="t"><i style="width:${Math.min(100, b.actual / b.plan * 100)}%;background:${b.actual > b.plan ? 'var(--neg)' : 'var(--pos)'}"></i></span></div>`).join('')}
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
    <span class="m pos">+${D.nis(p.amount)}<small>לפני ${p.ago} ימים</small></span></div>`).join('')}
  <p class="day">תרומות שהתקבלו</p>
  ${D.donList.slice(0, 7).map((d, i) => `<div class="tx"><span class="c" style="${c(i + 2)}">${d.init}</span>
    <span><b>${d.name}</b><span>${d.city || '—'} · ${d.method}</span></span>
    <span class="m pos">+${D.nis(d.amount)}<small>${d.camp}</small></span></div>`).join('')}
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
    הוצאה לפי קטגוריה · כרטיסון לבן עם תג וחץ · רשימת-תנועות) לקוחים מ-Monzo · נתוני דוגמה</p>
</div>`;
  },
};
