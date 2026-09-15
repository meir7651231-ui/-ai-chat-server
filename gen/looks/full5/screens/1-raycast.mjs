/* מסך הבית בשפת Raycast — חלון-פקודות מלא:
   שורת-חיפוש, מסנן, רשימת-תוצאות מקובצת ארוכה, פאנל-פרטים ימני, סרגל-פעולות תחתון,
   ומתחתיו רשת-הפקודות המהירות — בדיוק המבנה של חלון האפליקציה בצילום. */
export default {
  id: '1-raycast', name: 'Raycast', ref: 'חלון-פקודות: חיפוש · רשימה מקובצת · פאנל-פרטים · סרגל-פעולות · רשת פקודות',
  fonts: ['Assistant:wght@400;500;600;700'],
  css: `
:root{--bg:#09090b;--win:#131316;--row:#17171a;--ink:#ededf0;--mut:#9a9aa3;--dim:#8b8b95;
 --hair:#26262e;--acc:#ff6363;--ok:#7ee0a0;--warn:#e8c07a;--blue:#8fb4ff}
body{background:var(--bg);color:var(--ink);font:400 14.5px/1.5 Assistant,Arial,sans-serif}
.page{max-width:1240px;margin-inline:auto;padding:26px 20px 70px}
.head{display:flex;align-items:baseline;gap:12px;margin-bottom:16px}
.head h1{font-size:18px;font-weight:600}
.head .d{margin-inline-start:auto;font-size:12.5px;color:var(--mut)}
kbd{font:500 11px ui-monospace,Menlo,monospace;color:var(--mut);background:var(--row);
 border:1px solid var(--hair);border-radius:5px;padding:2px 6px;white-space:nowrap}

.win{background:var(--win);border:1px solid var(--hair);border-radius:14px;overflow:hidden;
 box-shadow:0 24px 60px rgba(0,0,0,.55)}
.bar{display:flex;align-items:center;gap:12px;padding:15px 18px;border-block-end:1px solid var(--hair)}
.bar input{flex:1;background:none;border:0;outline:0;font-size:17px;color:var(--ink)}
.bar input::placeholder{color:var(--dim)}
.filter{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--hair);border-radius:7px;
 padding:5px 10px;font-size:12.5px;color:var(--mut)}
.body{display:grid;grid-template-columns:minmax(0,1fr) 336px;min-height:520px}
.list{border-inline-end:1px solid var(--hair);padding:8px 0;max-height:560px;overflow:auto}
.grp{font:600 11px Assistant;letter-spacing:.1em;color:var(--dim);padding:10px 18px 5px}
.r{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:12px;align-items:center;
 padding:8px 18px;cursor:default}
.r:hover{background:var(--row)}
.r.sel{background:#1b2331}
.r .ic{width:26px;height:26px;border-radius:7px;display:grid;place-items:center;font:600 11px Assistant}
.r .t{font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.r .s{font-size:12px;color:var(--mut)}
.r .m{font-size:12.5px;color:var(--mut);font-variant-numeric:tabular-nums;white-space:nowrap}
.r.sel .m{color:var(--blue)}
.i1{background:#2a1a1f;color:#ff9b9b}.i2{background:#1a2a20;color:#8fe0ab}.i3{background:#2a2517;color:#e8c07a}
.i4{background:#1a2030;color:#9dc0ff}.i5{background:#26192b;color:#d5a6ef}.i6{background:#19282a;color:#8fd8dd}

.det{padding:18px;overflow:auto;max-height:560px}
.det .big{display:flex;gap:13px;align-items:center;margin-bottom:14px}
.det .av{width:46px;height:46px;border-radius:12px;display:grid;place-items:center;font:600 16px Assistant}
.det h2{font-size:17px}
.det .sub{font-size:12.5px;color:var(--mut)}
.kv{display:grid;gap:0;font-size:13px;border-block-start:1px solid var(--hair)}
.kv div{display:flex;gap:10px;padding:7px 0;border-block-end:1px solid var(--hair)}
.kv dt{color:var(--mut);margin:0}
.kv dd{margin:0 0 0 auto;font-variant-numeric:tabular-nums}
.det h3{font:600 11px Assistant;letter-spacing:.1em;color:var(--dim);margin:16px 0 7px}
.mini{display:grid;gap:5px;font-size:13px}
.mini a{display:flex;gap:9px;align-items:center;padding:6px 8px;border-radius:7px}
.mini a:hover{background:var(--row)}
.mini .dot{width:7px;height:7px;border-radius:50%;background:var(--dim)}
.mini .m{margin-inline-start:auto;color:var(--mut);font-size:12px;font-variant-numeric:tabular-nums}

.foot{display:flex;align-items:center;gap:10px;padding:10px 16px;border-block-start:1px solid var(--hair);
 background:#101013;font-size:12.5px;color:var(--mut)}
.foot .sp{flex:1}
.act{display:inline-flex;align-items:center;gap:7px;border:1px solid var(--hair);background:none;color:var(--ink);
 border-radius:6px;padding:6px 11px;font-size:12.5px;min-height:34px}
.act:hover{border-color:var(--dim)}
.act.pri{background:var(--ink);border-color:var(--ink);color:#0b0b0d;font-weight:600}

h2.sec{font:600 11px Assistant;letter-spacing:.12em;color:var(--dim);margin:30px 2px 10px}
.cmds{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));gap:8px}
.cmd{display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:11px;align-items:center;
 border:1px solid var(--hair);border-radius:9px;padding:11px 13px;background:var(--win)}
.cmd:hover{border-color:var(--dim)}
.cmd .ic{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;font-size:13px}
.cmd b{font-size:13.5px;font-weight:600;display:block}
.cmd span{font-size:11.5px;color:var(--mut)}

.strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(142px,1fr));gap:1px;background:var(--hair);
 border:1px solid var(--hair);border-radius:10px;overflow:hidden;margin-top:12px}
.strip div{background:var(--win);padding:13px 15px}
.strip b{display:block;font-size:19px;font-weight:600;font-variant-numeric:tabular-nums}
.strip span{font-size:11.5px;color:var(--mut)}
.strip .ok b{color:var(--ok)}.strip .warn b{color:var(--warn)}.strip .acc b{color:var(--acc)}

.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;margin-top:14px}
.panel{border:1px solid var(--hair);border-radius:11px;background:var(--win);overflow:hidden}
.panel h3{font:600 12px Assistant;letter-spacing:.06em;color:var(--mut);padding:11px 14px;border-block-end:1px solid var(--hair)}
.panel .in{padding:6px 8px}
.lrow{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;padding:7px 8px;border-radius:7px;font-size:13.5px}
.lrow:hover{background:var(--row)}
.lrow time,.lrow .m{font-size:12px;color:var(--mut);font-variant-numeric:tabular-nums;white-space:nowrap}
.lrow .tag{font:600 10.5px Assistant;border-radius:999px;padding:1px 8px;background:var(--row);color:var(--mut)}
.foot2{margin-top:26px;font-size:12px;color:var(--dim);border-block-start:1px solid var(--hair);padding-block-start:14px}
@media(max-width:900px){.body{grid-template-columns:1fr}.det{border-block-start:1px solid var(--hair);max-height:none}}
`,
  body: (D) => {
    const ic = (i) => 'i' + (1 + i % 6);
    const sel = D.topOpen[0];
    return `<div class="page">
<header class="head"><h1>מוסד · לוח הבית</h1>
  <span class="d">${D.today.hd} ${D.today.hy} · ${D.today.dow} · ${D.num(D.people)} רשומות באינדקס · נתוני דוגמה</span></header>

<section class="win">
  <div class="bar noprint"><span aria-hidden="true" style="color:var(--dim)">⌕</span>
    <input value="משפחת" aria-label="חיפוש בכל המוסד">
    <span class="filter">כל הסוגים ▾</span><kbd>Ctrl K</kbd></div>

  <div class="body">
    <div class="list">
      <p class="grp">משפחות · יתרה פתוחה</p>
      ${D.topOpen.map((f, i) => `<div class="r${i === 0 ? ' sel' : ''}">
        <span class="ic ${ic(i)}">${f.init}</span>
        <span><span class="t">${f.name}</span><br><span class="s">${f.city} · ${f.kids} ילדים${f.hok ? ' · הו״ק' : ''}${f.disc ? ' · הנחה ' + f.disc + '%' : ''}</span></span>
        <span class="m">${D.money(f.bal)}</span></div>`).join('')}

      <p class="grp">תלמידים</p>
      ${D.students20.slice(0, 8).map((s, i) => `<div class="r">
        <span class="ic ${ic(i + 2)}">${s.init}</span>
        <span><span class="t">${s.name}</span><br><span class="s">${s.fam} · כיתה ${s.cls}</span></span>
        <span class="m">נוכחות ${s.att}/5</span></div>`).join('')}

      <p class="grp">צוות</p>
      ${D.staffList.slice(0, 7).map((s, i) => `<div class="r">
        <span class="ic ${ic(i + 4)}">${s.init}</span>
        <span><span class="t">${s.name}</span><br><span class="s">${s.role}${s.absent ? ' · ' + s.absent : ''}</span></span>
        <span class="m">${s.absent ? (s.sub ? 'מחליף: ' + s.sub : 'אין מחליף') : D.ltr(s.first || '')}</span></div>`).join('')}

      <p class="grp">הלוואות גמ״ח</p>
      ${D.loanList.slice(0, 6).map((l, i) => `<div class="r">
        <span class="ic ${ic(i + 1)}">${l.init}</span>
        <span><span class="t">${l.fam} · ${l.purpose}</span><br><span class="s">${l.stage} · ${l.g}/2 ערבים${l.paid ? ' · ' + l.paid + '/' + l.inst + ' תשלומים' : ''}</span></span>
        <span class="m">${D.money(l.amount)}</span></div>`).join('')}

      <p class="grp">פעולות</p>
      ${[['רישום תשלום', 'גבייה', 'P'], ['הודעה להורים', 'תקשורת', 'M'], ['הפקת קבלה', 'גבייה', 'K'],
      ['פתיחת בקשת הנחה', 'גבייה', 'H'], ['שיבוץ מחליף', 'צוות', 'S'], ['דוח לוועד', 'כספים', 'R']]
        .map(([t, d, k], i) => `<div class="r"><span class="ic ${ic(i + 3)}">⌘</span>
          <span><span class="t">${t}</span><br><span class="s">${d}</span></span><span class="m"><kbd>${k}</kbd></span></div>`).join('')}
    </div>

    <aside class="det">
      <div class="big"><span class="av i1">${sel.init}</span>
        <span><h2>${sel.name}</h2><span class="sub">${sel.city} · ${sel.kids} ילדים במוסד</span></span></div>
      <dl class="kv">
        <div><dt>חיוב אחרי הנחה</dt><dd>${D.money(sel.due)}</dd></div>
        <div><dt>שולם</dt><dd>${D.money(sel.paid)}</dd></div>
        <div><dt>יתרה</dt><dd>${D.money(sel.bal)}</dd></div>
        <div><dt>הנחה</dt><dd>${sel.disc}%</dd></div>
        <div><dt>הוראת קבע</dt><dd>${sel.hok ? 'פעילה' : 'אין'}</dd></div>
        <div><dt>תעריף לילד</dt><dd>${D.money(D.tariff.tuition)}</dd></div>
        <div><dt>שנה</dt><dd>${D.tariff.year}</dd></div>
      </dl>
      <h3>תשלומים אחרונים</h3>
      <div class="mini">${D.payList.slice(0, 5).map(p => `<a href="#"><span class="dot"></span>${p.method}
        <span class="m">${D.money(p.amount)}</span></a>`).join('')}</div>
      <h3>פעולות על התיק</h3>
      <div class="mini">${['פתיחת התיק המלא', 'רישום תשלום', 'שליחת תזכורת', 'הפקת קבלה', 'פתיחת בקשת הנחה']
        .map(t => `<a href="#"><span class="dot"></span>${t}<span class="m">↵</span></a>`).join('')}</div>
    </aside>
  </div>

  <div class="foot noprint"><span>${D.topOpen.length + D.students20.slice(0, 8).length + 13 + 6} תוצאות</span>
    <span class="sp"></span>
    <button class="act pri">פתיחה <kbd>↵</kbd></button>
    <button class="act">פעולות <kbd>Ctrl K</kbd></button></div>
</section>

<h2 class="sec">מצב המוסד</h2>
<div class="strip">
  <div class="ok"><b>${D.pct}%</b><span>נגבה מהחיוב</span></div>
  <div><b>${D.money(D.paid)}</b><span>נגבה עד היום</span></div>
  <div class="acc"><b>${D.money(D.open)}</b><span>יתרה פתוחה</span></div>
  <div><b>${D.present}/${D.staff}</b><span>צוות נוכח</span></div>
  <div><b>${D.attAll}%</b><span>נוכחות תלמידים</span></div>
  <div class="warn"><b>${D.late}</b><span>משפחות בפיגור</span></div>
  <div><b>${D.money(D.fund)}</b><span>זמין בגמ״ח</span></div>
  <div><b>${D.money(D.raised)}</b><span>מגבית הבניין</span></div>
</div>

<div class="two">
  <section class="panel"><h3>עכשיו במוסד · ${D.minyanim.length} זמנים</h3><div class="in">
    ${D.minyanim.map(m => `<div class="lrow"><time>${D.ltr(m.time)}</time>
      <span>${m.name}${m.where ? ' · <span style="color:var(--mut)">' + m.where + '</span>' : ''}</span>
      <span class="m">${m.count ? m.count + ' משתתפים' : ''}</span></div>`).join('')}</div></section>

  <section class="panel"><h3>דורש הכרעה</h3><div class="in">
    ${D.alerts.map(([t, dep, sev]) => `<div class="lrow"><span class="tag">${dep}</span>
      <span>${t}</span><span class="m">${['דחוף', 'השבוע', 'רגיל'][sev - 1]}</span></div>`).join('')}
    ${D.calls.map(c => `<div class="lrow"><span class="tag">תפעול</span><span>${c.text}</span>
      <span class="m">${c.owner || 'לא שובץ'} · ${c.days} ימים</span></div>`).join('')}</div></section>

  <section class="panel"><h3>כיתות · נוכחות</h3><div class="in">
    ${D.classes.map(c => `<div class="lrow"><span class="tag">${c.name}</span>
      <span>${c.rebbe} · ${c.room}</span><span class="m">${c.n} תלמידים · ${c.pct}%</span></div>`).join('')}</div></section>

  <section class="panel"><h3>קווי הסעה</h3><div class="in">
    ${D.routes.map(r => `<div class="lrow"><span class="tag">${r.stops} תחנות</span>
      <span>${r.name}${r.driver ? ' · ' + r.driver : ' · <span style="color:var(--acc)">אין נהג</span>'}</span>
      <span class="m">${r.riders} נוסעים · ${D.ltr(r.first)}</span></div>`).join('')}</div></section>

  <section class="panel"><h3>תרומות אחרונות</h3><div class="in">
    ${D.donList.slice(0, 9).map(d => `<div class="lrow"><span class="tag">${d.method}</span>
      <span>${d.name}${d.city ? ' · ' + d.city : ''}</span><span class="m">${D.money(d.amount)}</span></div>`).join('')}</div></section>

  <section class="panel"><h3>יומן הפעולות</h3><div class="in">
    ${D.log.map(e => `<div class="lrow"><span class="tag">${e.dept}</span>
      <span>${e.what}</span><span class="m">${e.when}</span></div>`).join('')}</div></section>
</div>

<h2 class="sec">פקודות מהירות</h2>
<div class="cmds">
  ${D.depts.map(([n, s, e], i) => `<a class="cmd" href="#"><span class="ic ${ic(i)}">${e}</span>
    <span><b>${n}</b><span>${s}</span></span><kbd>⌘${i + 1}</kbd></a>`).join('')}
</div>

<p class="foot2">כל הרשומות, הסכומים והספירות נשאבים מהמחסן של המערכת בזמן הבנייה ·
  החלקים (משטח-פחם · שורת-פקודה · שורות עם מטא · פאנל מפתח/ערך · סרגל-פעולות · רשת-פקודות) לקוחים מ-Raycast · נתוני דוגמה</p>
</div>`;
  },
};
