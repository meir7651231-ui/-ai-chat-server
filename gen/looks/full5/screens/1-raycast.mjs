/* מסך הבית בשפת Raycast — חלון-פקודות מלא:
   שורת-חיפוש, מסנן, רשימת-תוצאות מקובצת ארוכה, פאנל-פרטים ימני, סרגל-פעולות תחתון,
   ומתחתיו רשת-הפקודות המהירות — בדיוק המבנה של חלון האפליקציה בצילום. */
import { appIcon, glow } from '../art.mjs';

export default {
  id: '1-raycast', name: 'Raycast', ref: 'חלון-פקודות: חיפוש · רשימה מקובצת · פאנל-פרטים · סרגל-פעולות · רשת פקודות',
  fonts: ['Assistant:wght@400;500;600;700'],
  css: `
:root{/* כל הערכים נמדדו ב-raycast.com ו-raycast.com/store */
 --bg:#07080a;--win:#0c0d0f;--row:#1b1c1e;--raise:#434345;--ink:#ffffff;--mut:#9c9c9d;--dim:#9c9c9d;
 --hair:#2f3031;--acc:#e6e6e6;--accInk:#2f3031;--panel:#111214;--void:#000000;
 --r:8px;--rCard:12px;--rSm:6px;--gap:8px}
body{background:var(--bg);color:var(--ink);font:400 16px/1.15 Assistant,Arial,sans-serif}
.page{background:var(--bg);max-width:1240px;margin-inline:auto;padding:26px 20px 70px}
.head{display:flex;align-items:baseline;gap:12px;margin-bottom:16px}
.head h1{font-size:18px;font-weight:600;letter-spacing:0}
.head .d{margin-inline-start:auto;font-size:12.5px;color:var(--mut)}
/* כיפות-המקשים של רייקאסט יושבות על המשטח המורם המדוד #434345 */
kbd{font:500 11px ui-monospace,Menlo,monospace;color:#ffffff;background:var(--raise);
 border:1px solid var(--hair);border-radius:4px;padding:2px 6px;white-space:nowrap}

/* הזוהר שמאחורי חלון-הפקודות באתר של רייקאסט — אמנות, לא משטח */
.stage{position:relative;isolation:isolate}
.glow{position:absolute;inset-inline:-8%;top:-140px;height:420px;z-index:-1;pointer-events:none;
 background:radial-gradient(52% 60% at 50% 50%,hsl(258 90% 62% / .40),transparent 70%),
  radial-gradient(38% 52% at 22% 40%,hsl(190 95% 55% / .30),transparent 72%),
  radial-gradient(40% 54% at 80% 46%,hsl(330 90% 60% / .28),transparent 72%);
 filter:blur(28px)}
.win{background:var(--win);border:1px solid var(--hair);border-radius:var(--rCard);overflow:hidden;
 box-shadow:0 24px 60px rgba(0,0,0,.55)}
.bar{display:flex;align-items:center;gap:12px;padding:16px;border-block-end:1px solid var(--hair)}
.bar input{flex:1;background:none;border:0;outline:0;font-size:17px;color:var(--ink)}
.bar input::placeholder{color:var(--dim)}
.filter{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--hair);border-radius:var(--r);
 padding:8px 12px;font-size:14px;font-weight:500;color:var(--mut);
 box-shadow:rgba(255,255,255,.05) 0 1px 0 0 inset}
.body{display:grid;grid-template-columns:minmax(0,1fr) 336px;min-height:520px}
.list{border-inline-end:1px solid var(--hair);padding:8px 0;max-height:560px;overflow:auto}
.grp{font:600 11px Assistant;letter-spacing:.1em;color:var(--dim);padding:10px 18px 5px}
.r{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:12px;align-items:center;
 padding:8px 18px;cursor:default}
.r:hover{background:var(--row)}
.r.sel{background:var(--row)}
.r .ic{width:26px;height:26px;border-radius:var(--rSm);display:grid;place-items:center;font:600 11px Assistant}
.r .t{font-size:14.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.r .s{font-size:12px;color:var(--mut)}
.r .m{font-size:12.5px;color:var(--mut);font-variant-numeric:tabular-nums;white-space:nowrap}
.r.sel .m{color:var(--ink)}
/* הפלטה המדודה של Raycast מונוכרומטית: #434345 · #2f3031 · #1b1c1e · #9c9c9d · #e6e6e6 */
/* אייקוני-האפליקציה של רייקאסט צבעוניים — הם אמנות (תמונות באתר האמיתי), לא טוקן */
.ic[data-art],.av[data-art]{color:#ffffff;text-shadow:0 1px 2px rgb(0 0 0 / .45)}

/* פאנל-הפרטים על המשטח המדוד #111214 · סרגל-הפעולות על השחור המלא */
.det{background:var(--panel);padding:18px;overflow:auto;max-height:560px}
.det .big{display:flex;gap:12px;align-items:center;margin-bottom:14px}
.det .av{width:46px;height:46px;border-radius:var(--rCard);display:grid;place-items:center;font:600 16px Assistant}
.det h2{font-size:17px}
.det .sub{font-size:12.5px;color:var(--mut)}
.kv{display:grid;gap:0;font-size:13px;border-block-start:1px solid var(--hair)}
.kv div{display:flex;gap:10px;padding:7px 0;border-block-end:1px solid var(--hair)}
.kv dt{color:var(--mut);margin:0}
.kv dd{margin:0 0 0 auto;font-variant-numeric:tabular-nums}
.det h3{font:600 11px Assistant;letter-spacing:.1em;color:var(--dim);margin:16px 0 7px}
.mini{display:grid;gap:4px;font-size:13px}
.mini a{display:flex;gap:8px;align-items:center;padding:6px 8px;border-radius:var(--r)}
.mini a:hover{background:var(--row)}
.mini .dot{width:7px;height:7px;border-radius:9999px;background:var(--dim)}
.mini .m{margin-inline-start:auto;color:var(--mut);font-size:12px;font-variant-numeric:tabular-nums}

.foot{display:flex;align-items:center;gap:10px;padding:10px 16px;border-block-start:1px solid var(--hair);
 background:var(--void);font-size:12.5px;color:var(--mut)}
.foot .sp{flex:1}
/* כפתור-רפאים מדוד: גובה 32 · ריפוד 8/8 · 14px/500 · רדיוס 8 · הדגשה פנימית */
.act{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--hair);background:none;color:var(--ink);
 border-radius:var(--r);padding:8px;font:500 14px Assistant;min-height:32px;
 box-shadow:rgba(255,255,255,.05) 0 1px 0 0 inset}
.act:hover{border-color:var(--mut)}
/* כפתור ראשי מדוד: bg #e6e6e6 · טקסט #2f3031 · גובה 36 · ריפוד 8/12 */
.act.pri{background:var(--acc);border-color:var(--acc);color:var(--accInk);font-weight:500;padding:8px 12px;min-height:36px;box-shadow:none}

h2.sec{font:600 11px Assistant;letter-spacing:.12em;color:var(--dim);margin:30px 2px 10px}
.cmds{display:grid;grid-template-columns:repeat(auto-fill,minmax(232px,1fr));gap:8px}
.cmd{display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:10px;align-items:center;
 border:1px solid var(--hair);border-radius:var(--rCard);padding:16px;background:var(--win)}
.cmd:hover{border-color:var(--dim)}
.cmd .ic{width:28px;height:28px;border-radius:var(--r);display:grid;place-items:center;font-size:13px;color:var(--ink)}
.cmd b{font-size:13.5px;font-weight:600;display:block}
.cmd span{font-size:11.5px;color:var(--mut)}

.strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(142px,1fr));gap:2px;background:var(--hair);
 border:1px solid var(--hair);border-radius:var(--rCard);overflow:hidden;margin-top:12px}
.strip div{background:var(--win);padding:13px 15px}
.strip b{display:block;font-size:19px;font-weight:600;font-variant-numeric:tabular-nums}
.strip span{font-size:11.5px;color:var(--mut)}
.strip .ok b,.strip .warn b,.strip .acc b{color:var(--ink)}

.two{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:16px;margin-top:14px}
.panel{border:1px solid var(--hair);border-radius:var(--rCard);background:var(--win);overflow:hidden}
.panel h3{font:600 12px Assistant;letter-spacing:.06em;color:var(--mut);padding:11px 14px;border-block-end:1px solid var(--hair)}
.panel .in{padding:6px 8px}
.lrow{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;padding:7px 8px;border-radius:var(--r);font-size:13.5px}
.lrow:hover{background:var(--row)}
.lrow time,.lrow .m{font-size:12px;color:var(--mut);font-variant-numeric:tabular-nums;white-space:nowrap}
.lrow .tag{font:600 10.5px Assistant;border-radius:999px;padding:1px 8px;background:var(--row);color:var(--mut)}
.foot2{margin-top:26px;font-size:12px;color:var(--dim);border-block-start:1px solid var(--hair);padding-block-start:14px}
@media(max-width:900px){.body{grid-template-columns:1fr}.det{border-block-start:1px solid var(--hair);max-height:none}}
`,
  body: (D) => {
    /* אייקון-אפליקציה מצויר מהמפתח של הרשומה */
    const ic = (k) => appIcon(String(k));
    const sel = D.topOpen[0];
    return `<div class="page">
<header class="head"><h1>מוסד · לוח הבית</h1>
  <span class="d">${D.today.hd} ${D.today.hy} · ${D.today.dow} · ${D.num(D.people)} רשומות באינדקס · נתוני דוגמה</span></header>

<div class="stage">${glow()}<section class="win">
  <div class="bar noprint"><span aria-hidden="true" style="color:var(--dim)">⌕</span>
    <input value="משפחת" aria-label="חיפוש בכל המוסד">
    <span class="filter">כל הסוגים ▾</span><kbd>Ctrl K</kbd></div>

  <div class="body">
    <div class="list">
      <p class="grp">משפחות · יתרה פתוחה</p>
      ${D.topOpen.map((f, i) => `<div class="r${i === 0 ? ' sel' : ''}">
        <span class="ic" data-art style="${ic(f.name)}">${f.init}</span>
        <span><span class="t">${f.name}</span><br><span class="s">${f.city} · ${f.kids} ילדים${f.hok ? ' · הו״ק' : ''}${f.disc ? ' · הנחה ' + f.disc + '%' : ''}</span></span>
        <span class="m">${D.money(f.bal)}</span></div>`).join('')}

      <p class="grp">תלמידים</p>
      ${D.students20.slice(0, 8).map((s, i) => `<div class="r">
        <span class="ic" data-art style="${ic(s.name)}">${s.init}</span>
        <span><span class="t">${s.name}</span><br><span class="s">${s.fam} · כיתה ${s.cls}</span></span>
        <span class="m">נוכחות ${s.att}/5</span></div>`).join('')}

      <p class="grp">צוות</p>
      ${D.staffList.slice(0, 7).map((s, i) => `<div class="r">
        <span class="ic" data-art style="${ic(s.name + s.role)}">${s.init}</span>
        <span><span class="t">${s.name}</span><br><span class="s">${s.role}${s.absent ? ' · ' + s.absent : ''}</span></span>
        <span class="m">${s.absent ? (s.sub ? 'מחליף: ' + s.sub : 'אין מחליף') : D.ltr(s.first || '')}</span></div>`).join('')}

      <p class="grp">הלוואות גמ״ח</p>
      ${D.loanList.slice(0, 6).map((l, i) => `<div class="r">
        <span class="ic" data-art style="${ic(l.fam + l.purpose)}">${l.init}</span>
        <span><span class="t">${l.fam} · ${l.purpose}</span><br><span class="s">${l.stage} · ${l.g}/2 ערבים${l.paid ? ' · ' + l.paid + '/' + l.inst + ' תשלומים' : ''}</span></span>
        <span class="m">${D.money(l.amount)}</span></div>`).join('')}

      <p class="grp">פעולות</p>
      ${[['רישום תשלום', 'גבייה', 'P'], ['הודעה להורים', 'תקשורת', 'M'], ['הפקת קבלה', 'גבייה', 'K'],
      ['פתיחת בקשת הנחה', 'גבייה', 'H'], ['שיבוץ מחליף', 'צוות', 'S'], ['דוח לוועד', 'כספים', 'R']]
        .map(([t, d, k], i) => `<div class="r"><span class="ic" data-art style="${ic(t)}">⌘</span>
          <span><span class="t">${t}</span><br><span class="s">${d}</span></span><span class="m"><kbd>${k}</kbd></span></div>`).join('')}
    </div>

    <aside class="det">
      <div class="big"><span class="av" data-art style="${ic(sel.name)}">${sel.init}</span>
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
</section></div>

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
  ${D.depts.map(([n, s, e], i) => `<a class="cmd" href="#"><span class="ic" data-art style="${ic(n)}">${e}</span>
    <span><b>${n}</b><span>${s}</span></span><kbd>⌘${i + 1}</kbd></a>`).join('')}
</div>

<p class="foot2">כל הרשומות, הסכומים והספירות נשאבים מהמחסן של המערכת בזמן הבנייה ·
  החלקים (משטח-פחם · שורת-פקודה · שורות עם מטא · פאנל מפתח/ערך · סרגל-פעולות · רשת-פקודות) לקוחים מ-Raycast · נתוני דוגמה</p>
</div>`;
  },
};
