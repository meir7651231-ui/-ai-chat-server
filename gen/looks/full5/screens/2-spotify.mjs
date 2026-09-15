/* מסך הבית בשפת Spotify — עמוד-בית מלא:
   סרגל-צד עם ספרייה, פס עליון, שש אריחי-כניסה, ארבעה מדפים אופקיים מלאים,
   ופס-נגינה תחתון קבוע. בדיוק המבנה של עמוד-הבית בצילום. */
export default {
  id: '2-spotify', name: 'Spotify', ref: 'עמוד-בית: סרגל-צד · אריחי-כניסה · ארבעה מדפים · פס-נגינה תחתון',
  fonts: ['Secular+One', 'Assistant:wght@400;600;700'],
  css: `
:root{--bg:#000;--panel:#121212;--card:#181818;--hi:#232323;--ink:#fff;--mut:#a7a7a7;--acc:#1db954;--hair:#2a2a2a}
body{background:var(--bg);color:var(--ink);font:400 15px/1.5 Assistant,Arial,sans-serif;padding-bottom:78px}
.app{display:grid;grid-template-columns:248px minmax(0,1fr);gap:8px;padding:8px;min-height:100vh}
@media(max-width:900px){.app{grid-template-columns:1fr}.side{display:none}}

.side{background:var(--panel);border-radius:9px;padding:14px 10px;position:sticky;top:8px;align-self:start;max-height:calc(100vh - 16px);overflow:auto}
.side .brand{display:flex;align-items:center;gap:9px;padding:6px 8px 14px;font:400 18px 'Secular One',Assistant,sans-serif}
.side .brand i{width:28px;height:28px;border-radius:50%;background:var(--acc);color:#00220d;display:grid;place-items:center;font-style:normal;font-size:14px}
.nav a{display:flex;align-items:center;gap:13px;padding:9px 10px;border-radius:6px;color:var(--mut);font-weight:600;font-size:14.5px}
.nav a:hover,.nav a[aria-current]{color:var(--ink);background:var(--card)}
.libhead{display:flex;align-items:center;gap:8px;color:var(--mut);font-weight:700;font-size:13.5px;padding:16px 10px 8px;border-block-start:1px solid var(--hair);margin-top:12px}
.lib a{display:grid;grid-template-columns:38px minmax(0,1fr);gap:11px;align-items:center;padding:7px 8px;border-radius:6px}
.lib a:hover{background:var(--card)}
.lib .art{width:38px;height:38px;border-radius:5px;display:grid;place-items:center;font-size:15px}
.lib b{font-size:13.5px;font-weight:600;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lib span{font-size:11.5px;color:var(--mut)}

.main{background:linear-gradient(180deg,#1f3a2a 0%,#101010 260px);border-radius:9px;padding:0 0 30px;overflow:hidden}
.top{display:flex;align-items:center;gap:12px;padding:14px 22px;position:sticky;top:8px;z-index:5;
 background:rgba(10,10,10,.6);backdrop-filter:blur(8px)}
.top .circ{width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.6);display:grid;place-items:center;color:var(--mut)}
.top .sp{flex:1}
.top .pill{background:var(--ink);color:#000;border:0;border-radius:999px;padding:8px 17px;font-weight:700;font-size:13.5px;min-height:38px}
.top .av{width:32px;height:32px;border-radius:50%;background:#535353;display:grid;place-items:center;font-size:13px;font-weight:700}
.in{padding:8px 22px}
h1{font:400 clamp(26px,4vw,36px)/1.15 'Secular One',Assistant,sans-serif;margin:10px 0 18px}
.quick{display:grid;grid-template-columns:repeat(auto-fit,minmax(248px,1fr));gap:9px;margin-bottom:30px}
.q{display:grid;grid-template-columns:62px minmax(0,1fr);align-items:center;gap:13px;background:#2a2a2a;
 border-radius:5px;overflow:hidden;min-height:62px}
.q:hover{background:#3a3a3a}
.q .art{width:62px;height:62px;display:grid;place-items:center;font:400 22px 'Secular One',Assistant,sans-serif}
.q b{font-size:14.5px;font-weight:700}
.q span{display:block;font-size:11.5px;color:var(--mut)}
h2{font:400 22px 'Secular One',Assistant,sans-serif;margin:26px 0 4px;display:flex;align-items:baseline;gap:10px}
h2 a{margin-inline-start:auto;font:600 12px Assistant;color:var(--mut);letter-spacing:.08em}
p.sub{font-size:13px;color:var(--mut);margin-bottom:14px}
.shelf{display:flex;gap:16px;overflow-x:auto;padding-bottom:12px;scroll-snap-type:x proximity}
.c{flex:none;width:174px;background:var(--card);border-radius:8px;padding:14px;scroll-snap-align:start}
.c:hover{background:var(--hi)}
.c .art{aspect-ratio:1;border-radius:6px;display:grid;place-items:center;margin-bottom:12px;
 font:400 30px 'Secular One',Assistant,sans-serif;font-variant-numeric:tabular-nums;position:relative}
.c .art.round{border-radius:50%}
.c b{display:block;font-size:14.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.c span{font-size:12.5px;color:var(--mut);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rows{display:grid;gap:2px;margin-top:6px}
.row{display:grid;grid-template-columns:26px 40px minmax(0,1fr) auto auto;gap:14px;align-items:center;
 padding:7px 10px;border-radius:5px;font-size:14px}
.row:hover{background:var(--card)}
.row .n{color:var(--mut);font-size:13px;text-align:center;font-variant-numeric:tabular-nums}
.row .art{width:40px;height:40px;border-radius:4px;display:grid;place-items:center;font-size:13px;font-weight:700}
.row b{font-weight:600;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.row span{font-size:12.5px;color:var(--mut)}
.row .m{color:var(--mut);font-size:13px;font-variant-numeric:tabular-nums;white-space:nowrap}
.row.on b{color:var(--acc)}
.band{background:linear-gradient(90deg,#6a2fb5,#1db954);border-radius:9px;padding:18px 22px;margin-top:26px;
 display:flex;align-items:center;gap:16px;flex-wrap:wrap}
.band b{font:400 19px 'Secular One',Assistant,sans-serif}
.band p{font-size:13.5px;color:#eaf7ef}
.band .sp{flex:1}
.band button{background:#fff;color:#000;border:0;border-radius:999px;padding:11px 22px;font-weight:700;min-height:44px}
.foot{padding:26px 22px 0;color:var(--mut);font-size:12.5px;border-block-start:1px solid var(--hair);margin-top:26px}

.player{position:fixed;inset-inline:0;bottom:0;height:70px;background:#181818;border-block-start:1px solid var(--hair);
 display:flex;align-items:center;gap:16px;padding:0 16px;z-index:20}
.player .now{display:flex;align-items:center;gap:12px;min-width:min(38%,280px)}
.player .art{width:46px;height:46px;border-radius:5px;background:#1f3a2a;display:grid;place-items:center;font-size:17px}
.player b{font-size:13.5px;display:block}
.player span{font-size:11.5px;color:var(--mut)}
.player .mid{flex:1;display:grid;gap:6px;justify-items:center}
.player .ctr{display:flex;align-items:center;gap:18px}
.player .ctr button{background:none;border:0;color:var(--mut);font-size:15px;padding:0}
.player .ctr .play{width:34px;height:34px;border-radius:50%;background:#fff;color:#000;display:grid;place-items:center;font-size:14px}
.player .track{display:flex;align-items:center;gap:9px;width:min(100%,420px);font-size:11px;color:var(--mut)}
.player .bar{flex:1;height:4px;border-radius:999px;background:#4d4d4d;position:relative;overflow:hidden}
.player .bar i{position:absolute;inset-block:0;inset-inline-start:0;background:#fff;border-radius:999px}
.player .right{display:flex;align-items:center;gap:12px;color:var(--mut);font-size:13px}
@media(max-width:700px){.player .mid,.player .right{display:none}}
`,
  body: (D) => {
    const arts = ['#3b1f2b', '#1f2b3b', '#2b2b1f', '#1f3b2b', '#3b2b1f', '#2b1f3b'];
    const fgs = ['#f2789b', '#8fb4ff', '#e8c07a', '#7ee0a0', '#f0a97b', '#c9a6f0'];
    const art = (i) => `background:${arts[i % 6]};color:${fgs[i % 6]}`;
    return `<div class="app">
<aside class="side">
  <p class="brand"><i aria-hidden="true">מ</i>מוסד</p>
  <nav class="nav"><a href="#" aria-current="page">🏠 בית</a><a href="#">⌕ חיפוש</a><a href="#">📚 הספרייה</a></nav>
  <p class="libhead">האגפים שלך</p>
  <nav class="lib">
    ${D.depts.map(([n, s, e], i) => `<a href="#"><span class="art" style="${art(i)}">${e}</span>
      <span><b>${n}</b><span>${s}</span></span></a>`).join('')}
  </nav>
</aside>

<main class="main">
  <div class="top noprint"><span class="circ">›</span><span class="circ">‹</span><span class="sp"></span>
    <button class="pill">רישום תשלום</button><span class="av">מ</span></div>

  <div class="in">
    <h1>${D.today.dow} טוב</h1>
    <div class="quick">
      ${[['גבייה', D.pct + '%', 0], ['פתוח', D.nis(D.open), 1], ['צוות היום', D.present + '/' + D.staff, 3],
      ['נוכחות', D.attAll + '%', 2], ['גמ״ח זמין', D.nis(D.fund), 4], ['מגבית', D.nis(D.raised), 5]]
        .map(([t, v, i]) => `<a class="q" href="#"><span class="art" style="${art(i)}">${i % 2 ? '▤' : '◆'}</span>
          <span><b>${t}</b><span>${v}</span></span></a>`).join('')}
    </div>

    <h2>לטפל היום <a href="#">הצג הכל</a></h2>
    <p class="sub">נבנה מהמחסן · ${D.alerts.length} עניינים פתוחים</p>
    <div class="shelf">
      ${[[D.late, 'משפחות בפיגור', 'שיחה או תזכורת'], [D.loansOpen, 'בקשות גמ״ח', 'ממתינות לוועדה'],
      [D.queueN, 'בתור לקבלת קהל', 'החצר'], [D.absent, 'חסרים בצוות', D.subs + ' מחליפים שובצו'],
      [D.routes.filter(r => !r.driver).length, 'קווים בלי נהג', 'למחר'], [D.calls.length, 'קריאות שירות', 'פתוחות'],
      [D.payList.filter(p => p.method === 'המחאה').length, 'צ׳קים להפקדה', 'עד חמישי']]
        .map(([n, t, s], i) => `<a class="c" href="#"><span class="art" style="${art(i)}">${n}</span>
          <b>${t}</b><span>${s}</span></a>`).join('')}
    </div>

    <h2>משפחות לפי יתרה פתוחה <a href="#">הצג הכל</a></h2>
    <p class="sub">${D.families} משפחות · ${D.money(D.open)} פתוחים</p>
    <div class="shelf">
      ${D.topOpen.slice(0, 10).map((f, i) => `<a class="c" href="#">
        <span class="art round" style="${art(i)}">${f.init}</span>
        <b>${f.name}</b><span>${D.nis(f.bal)} · ${f.kids} ילדים</span></a>`).join('')}
    </div>

    <h2>תרומות אחרונות <a href="#">הצג הכל</a></h2>
    <p class="sub">${D.donations} תרומות למגבית ${D.camp} · ${Math.round(D.raised / D.goal * 100)}% מהיעד</p>
    <div class="shelf">
      ${D.donList.slice(0, 10).map((d, i) => `<a class="c" href="#">
        <span class="art round" style="${art(i + 2)}">${d.init}</span>
        <b>${d.name}</b><span>${D.nis(d.amount)} · ${d.method}</span></a>`).join('')}
    </div>

    <h2>היום בבית המדרש</h2>
    <p class="sub">${D.minyanim.length} זמנים · הזמן הנוכחי מסומן</p>
    <div class="rows">
      ${D.minyanim.map((m, i) => `<div class="row${m.time === D.now.time ? ' on' : ''}">
        <span class="n">${i + 1}</span><span class="art" style="${art(i)}">🕯</span>
        <span><b>${m.name}</b><span>${m.where || '—'}</span></span>
        <span class="m">${m.count ? m.count + ' משתתפים' : ''}</span><span class="m">${D.ltr(m.time)}</span></div>`).join('')}
    </div>

    <h2>כיתות</h2>
    <p class="sub">${D.students} תלמידים ב-${D.classes.length} כיתות · נוכחות ממוצעת ${D.attAll}%</p>
    <div class="rows">
      ${D.classes.map((c, i) => `<div class="row"><span class="n">${i + 1}</span>
        <span class="art" style="${art(i)}">${c.name}</span>
        <span><b>${c.rebbe}</b><span>${c.room} · ${c.n} תלמידים</span></span>
        <span class="m">${c.pct}%</span><span class="m">${c.n}</span></div>`).join('')}
    </div>

    <h2>הלוואות גמ״ח</h2>
    <p class="sub">${D.loans} בתיק · ${D.money(D.fund)} זמינים · ${D.fundLate} באיחור</p>
    <div class="rows">
      ${D.loanList.map((l, i) => `<div class="row"><span class="n">${i + 1}</span>
        <span class="art round" style="${art(i + 3)}">${l.init}</span>
        <span><b>${l.fam}</b><span>${l.purpose} · ${l.stage}</span></span>
        <span class="m">${l.g}/2 ערבים</span><span class="m">${D.nis(l.amount)}</span></div>`).join('')}
    </div>

    <div class="band noprint"><div><b>${D.camp}</b><p>${D.money(D.raised)} מתוך ${D.money(D.goal)} · ${D.donations} תרומות</p></div>
      <span class="sp"></span><button>רישום תרומה</button></div>

    <p class="foot">כל המספרים נשאבים מהמחסן של המערכת · החלקים (סרגל-ספרייה · אריחי-כניסה · מדפים אופקיים ·
      שורות ממוספרות · פס-נגינה) לקוחים מ-Spotify · נתוני דוגמה</p>
  </div>
</main>
</div>

<div class="player noprint">
  <div class="now"><span class="art">🕯</span><span><b>${D.now.name}</b><span>${D.now.where} · ${D.now.count} משתתפים</span></span></div>
  <div class="mid"><div class="ctr"><button>⇄</button><button>‹‹</button>
      <button class="play" aria-label="נגן">▸</button><button>››</button><button>↻</button></div>
    <div class="track"><span>${D.ltr('13:45')}</span><span class="bar"><i style="width:42%"></i></span><span>${D.ltr('14:30')}</span></div></div>
  <div class="right"><span>${D.present}/${D.staff} צוות</span><span>${D.queueN} בתור</span></div>
</div>`;
  },
};
