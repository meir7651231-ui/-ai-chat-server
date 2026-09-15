/* גרסאות 1–5 של מסך-הבית. כל אחת עומדת בפני עצמה: פונט, כפתור, פלטה ומבנה משלה. */

/* ═══ 1 · פקודה ═══ שורת-פקודה במרכז, שורות-תוצאה, רמזי-מקלדת, כפתורי-רפאים ═══ */
const command = {
  id: '01-pkuda', name: 'פקודה', ref: 'מסוף-פקודות · כהה · Rubik + מונו · כפתורי-רפאים',
  fonts: ['Rubik:wght@300;400;500;600'],
  css: `
body{background:#0b0c0e;color:#e7e7e4;font:400 15px/1.55 Rubik,Arial,sans-serif}
.w{max-width:760px;margin-inline:auto;padding:56px 20px 80px}
.top{display:flex;align-items:baseline;gap:10px;margin-bottom:28px}
.top h1{font-size:15px;font-weight:500;color:#9d9d97;letter-spacing:.02em}
.top .d{font-size:13px;color:#8b8f96;margin-inline-start:auto;font-variant-numeric:tabular-nums}
.cmd{display:flex;align-items:center;gap:12px;background:#141518;border:1px solid #25272b;
 border-radius:12px;padding:16px 18px;margin-bottom:8px}
.cmd .c{color:#7f838a}
.cmd input{flex:1;background:none;border:0;outline:0;font-size:17px;color:#e7e7e4}
.cmd input::placeholder{color:#7f838a}
kbd{font:500 11px ui-monospace,SFMono-Regular,Menlo,monospace;color:#9d9d97;background:#1d1f23;
 border:1px solid #2c2f34;border-radius:5px;padding:2px 6px}
.hint{font-size:12px;color:#8b8f96;margin:0 4px 30px;display:flex;gap:16px;flex-wrap:wrap}
.sec{font:500 11px/1 Rubik;color:#8b8f96;letter-spacing:.14em;margin:26px 4px 10px}
.rows{border-block-start:1px solid #1c1e21}
.row{display:grid;grid-template-columns:62px minmax(0,1fr) auto;gap:14px;align-items:center;
 padding:11px 4px;border-block-end:1px solid #1c1e21}
.row:hover{background:#111316}
.row time,.row .v{font:400 13px ui-monospace,Menlo,monospace;color:#8b8f96;font-variant-numeric:tabular-nums}
.row .t{font-size:14.5px}
.row .m{font-size:12.5px;color:#8b8f96}
.row.on{background:#101418}
.row.on .t{color:#cfe3ff}
.row.on time{color:#7fa6f5}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1px;background:#1c1e21;
 border:1px solid #1c1e21;border-radius:10px;overflow:hidden;margin:6px 0 4px}
.kpi{background:#0e1013;padding:14px 16px}
.kpi b{display:block;font:500 21px Rubik;font-variant-numeric:tabular-nums}
.kpi span{font-size:12px;color:#8b8f96}
.kpi.up b{color:#8ddba4}.kpi.warn b{color:#e3c07b}
.acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:28px}
.gh{background:none;border:1px solid #2c2f34;color:#c9c9c4;border-radius:8px;padding:9px 14px;
 font-size:13.5px;display:inline-flex;align-items:center;gap:9px;min-height:40px}
.gh:hover{border-color:#4a4f57;color:#fff}
.gh kbd{background:#1d1f23}
.dep{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.dep a{font-size:12.5px;color:#8b8f96;border:1px solid #1c1e21;border-radius:7px;padding:5px 10px;text-decoration:none}
.dep a:hover{border-color:#2c2f34;color:#e7e7e4}
.dep a i{font-style:normal;color:#7f838a;margin-inline-start:6px}
footer{margin-top:40px;font-size:12px;color:#7c8087}
@media(max-width:560px){.row{grid-template-columns:54px minmax(0,1fr)}.row .v{grid-column:2;justify-self:end}}
`,
  body: (D) => `<div class="w">
  <header class="top"><h1>מוסד · לוח הבית</h1><span class="d">${D.today.hd} ${D.today.hy} · ${D.today.dow}</span></header>

  <div class="cmd noprint"><span class="c" aria-hidden="true">⌘</span>
    <input placeholder="חפש משפחה, תלמיד, הלוואה או פעולה…" aria-label="חיפוש בכל המוסד">
    <kbd>Ctrl K</kbd></div>
  <p class="hint"><span>↑↓ לבחירה</span><span>Enter לפתיחה</span><span>${D.num(D.people)} רשומות באינדקס</span></p>

  <div class="kpis">
    <div class="kpi up"><b>${D.pct}%</b><span>נגבה מהחיוב</span></div>
    <div class="kpi"><b>${D.present}/${D.staff}</b><span>צוות נוכח</span></div>
    <div class="kpi"><b>${D.attAll}%</b><span>נוכחות תלמידים</span></div>
    <div class="kpi warn"><b>${D.late}</b><span>משפחות בפיגור</span></div>
    <div class="kpi"><b>${D.k(D.fund)}</b><span>זמין בגמ״ח</span></div>
  </div>

  <h2 class="sec">עכשיו במוסד</h2>
  <div class="rows">
    ${D.minyanim.slice(0, 6).map(m => `<div class="row${m.time === D.now.time ? ' on' : ''}">
      <time>${D.ltr(m.time)}</time>
      <span><span class="t">${m.name}</span>${m.where ? `<br><span class="m">${m.where}</span>` : ''}</span>
      <span class="v">${m.count ? m.count + '↑' : ''}</span></div>`).join('')}
  </div>

  <h2 class="sec">דורש הכרעה</h2>
  <div class="rows">
    ${D.alerts.map(([t, dep]) => `<div class="row">
      <time>${dep}</time><span class="t">${t}</span><span class="v">›</span></div>`).join('')}
  </div>

  <div class="acts noprint">
    <button class="gh">רישום תשלום <kbd>P</kbd></button>
    <button class="gh">הודעה להורים <kbd>M</kbd></button>
    <button class="gh">יומן הפעולות <kbd>L</kbd></button>
  </div>

  <h2 class="sec">אגפים</h2>
  <nav class="dep">${D.depts.map(([n, s]) => `<a href="#">${n}<i>${s}</i></a>`).join('')}</nav>

  <footer>כל מספר כאן נגזר מהמחסן · נתוני דוגמה</footer>
</div>`,
};

/* ═══ 2 · מדף ═══ כהה, כותרת-ענק, אריחים צבעוניים, מדפים אופקיים, כפתור עגול ═══ */
const shelf = {
  id: '02-madaf', name: 'מדף', ref: 'נגן-מוזיקה · כהה · Secular One + Assistant · כפתור עגול',
  fonts: ['Secular+One', 'Assistant:wght@400;600;700'],
  css: `
body{background:#0a0a0a;color:#fff;font:400 15px/1.5 Assistant,Arial,sans-serif}
.w{max-width:1180px;margin-inline:auto;padding:24px 24px 90px}
.top{display:flex;align-items:center;gap:14px;margin-bottom:26px}
.top .av{width:38px;height:38px;border-radius:50%;background:#1db954;color:#0a0a0a;display:grid;place-items:center;font:400 16px 'Secular One'}
.top h1{font:400 20px 'Secular One',Assistant,sans-serif}
.top .d{margin-inline-start:auto;color:#a7a7a7;font-size:13px}
.hero{background:linear-gradient(160deg,#1db954 0%,#0f6e34 55%,#0a0a0a 100%);border-radius:14px;
 padding:34px 30px;display:flex;align-items:flex-end;gap:24px;flex-wrap:wrap;margin-bottom:34px}
.hero .big{font:400 clamp(38px,8vw,72px)/1 'Secular One',Assistant,sans-serif}
.hero .lab{font-size:14px;color:#dff5e6}
.hero .side{margin-inline-start:auto;display:flex;align-items:center;gap:14px}
.play{width:56px;height:56px;border-radius:50%;background:#fff;color:#0a0a0a;border:0;font-size:20px;
 display:grid;place-items:center;box-shadow:0 8px 24px rgba(0,0,0,.4)}
.play:hover{transform:scale(1.05)}
.ghost{background:transparent;border:1px solid rgba(255,255,255,.55);color:#fff;border-radius:999px;
 padding:10px 20px;font-size:14px;font-weight:700;min-height:44px}
.ghost:hover{border-color:#fff;background:rgba(255,255,255,.08)}
h2{font:400 21px 'Secular One',Assistant,sans-serif;margin:30px 0 14px;display:flex;align-items:baseline;gap:10px}
h2 span{font:400 12.5px Assistant;color:#a7a7a7}
.shelf{display:flex;gap:16px;overflow-x:auto;padding-bottom:10px;scroll-snap-type:x proximity}
.card{flex:none;width:186px;background:#181818;border-radius:10px;padding:16px;scroll-snap-align:start;text-decoration:none;color:inherit}
.card:hover{background:#232323}
.card .art{aspect-ratio:1;border-radius:8px;display:grid;place-items:center;margin-bottom:14px;
 font:400 34px 'Secular One',Assistant,sans-serif;font-variant-numeric:tabular-nums}
.card b{display:block;font-size:15px;font-weight:700}
.card span{font-size:12.5px;color:#a7a7a7}
.list li{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:14px;align-items:center;
 padding:10px 8px;border-radius:6px;font-size:14.5px}
.list li:hover{background:#181818}
.list .n{color:#a7a7a7;font-size:13px;text-align:center;font-variant-numeric:tabular-nums}
.list .t{font-size:12.5px;color:#a7a7a7}
.list .on{color:#1db954}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}
.chips a{background:#181818;border-radius:999px;padding:8px 15px;font-size:13.5px;text-decoration:none}
.chips a:hover{background:#282828}
.chips a i{font-style:normal;color:#a7a7a7;margin-inline-start:7px;font-size:12px}
footer{margin-top:46px;color:#9a9a9a;font-size:12.5px}
`,
  body: (D) => `<div class="w">
  <header class="top"><span class="av" aria-hidden="true">מ</span><h1>הבית של המוסד</h1>
    <span class="d">${D.today.hd} ${D.today.hy}</span></header>

  <section class="hero">
    <div><p class="lab">גבייה · שכר לימוד ${D.tariff.year}</p>
      <p class="big">${D.pct}%</p>
      <p class="lab">${D.money(D.paid)} נגבו · ${D.money(D.open)} פתוחים</p></div>
    <div class="side noprint"><button class="ghost">רישום תשלום</button>
      <button class="play" aria-label="פתיחת יום העבודה">▸</button></div>
  </section>

  <h2>לטפל היום <span>נבנה מהמחסן</span></h2>
  <div class="shelf">
    ${[[D.late, 'משפחות בפיגור', 'שיחה או תזכורת', '#3b1f2b', '#f2789b'],
    [D.loansOpen, 'בקשות גמ״ח', 'ממתינות לוועדה', '#1f2b3b', '#7fa6f5'],
    [D.queue, 'בתור לקבלת קהל', 'החצר', '#2b2b1f', '#e3c07b'],
    [D.absent, 'חסרים בצוות', D.subs + ' מחליפים שובצו', '#1f3b2b', '#8ddba4'],
    [D.noDriver.length, 'קווים בלי נהג', 'למחר', '#3b2b1f', '#f0a97b']]
      .map(([n, t, s, bg, fg]) => `<a class="card" href="#">
        <span class="art" style="background:${bg};color:${fg}">${n}</span>
        <b>${t}</b><span>${s}</span></a>`).join('')}
  </div>

  <h2>עכשיו במוסד</h2>
  <ul class="list">
    ${D.minyanim.slice(0, 6).map((m, i) => `<li class="${m.time === D.now.time ? 'on' : ''}">
      <span class="n">${i + 1}</span>
      <span><b>${m.name}</b><br><span class="t">${m.where || '—'}${m.count ? ' · ' + m.count + ' משתתפים' : ''}</span></span>
      <span class="n">${D.ltr(m.time)}</span></li>`).join('')}
  </ul>

  <h2>אגפים</h2>
  <nav class="chips">${D.depts.map(([n, s]) => `<a href="#">${n}<i>${s}</i></a>`).join('')}</nav>
  <footer>אותם מספרים בכל עשר הגרסאות · נתוני דוגמה</footer>
</div>`,
};

/* ═══ 3 · משחק ═══ בהיר, עגול, כפתורים תלת-ממדיים, טבעות התקדמות ═══ */
const play = {
  id: '03-mischak', name: 'משחק', ref: 'אפליקציית-לימוד · בהיר · Varela Round · כפתור תלת-ממדי',
  fonts: ['Varela+Round', 'Alef:wght@400;700'],
  css: `
body{background:#fff8ef;color:#3c3836;font:400 16px/1.55 'Varela Round',Arial,sans-serif}
.w{max-width:960px;margin-inline:auto;padding:22px 20px 80px}
.top{display:flex;align-items:center;gap:12px;margin-bottom:22px}
.top h1{font-size:20px}
.streak{margin-inline-start:auto;display:flex;gap:10px}
.pill{background:#fff;border:2px solid #ecdcc8;border-radius:999px;padding:7px 14px;font-size:14px;display:flex;gap:7px;align-items:center}
.pill b{color:#a85f00}
.board{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;margin-bottom:26px}
.big{background:#fff;border:2px solid #ecdcc8;border-radius:22px;padding:22px;text-align:center}
.ring{position:relative;display:grid;place-items:center;margin-bottom:10px}
.ring b{position:absolute;font-size:26px;color:#3f7a00}
.big h2{font-size:16px;margin-bottom:4px}
.big p{font-size:13.5px;color:#6b635b}
.tasks{background:#fff;border:2px solid #ecdcc8;border-radius:22px;padding:18px;margin-bottom:24px}
.tasks h2{font-size:17px;margin-bottom:12px}
.task{display:flex;align-items:center;gap:14px;padding:12px 0;border-block-end:2px solid #f6ecdf}
.task:last-child{border:0}
.task .ic{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:19px;flex:none}
.task .t{flex:1;font-size:15px}
.task .t span{display:block;font-size:12.5px;color:#6b635b}
.go{background:#3f7a00;color:#fff;border:0;border-radius:14px;padding:10px 18px;font-size:14px;
 box-shadow:0 4px 0 #2d5700;min-height:44px}
.go:active{transform:translateY(3px);box-shadow:0 1px 0 #2d5700}
.go.blue{background:#0f6f9e;box-shadow:0 4px 0 #0a5273}
.go.blue:active{box-shadow:0 1px 0 #0a5273}
.go.grey{background:#fff;color:#3c3836;border:2px solid #ecdcc8;box-shadow:0 4px 0 #ecdcc8}
.bars{background:#fff;border:2px solid #ecdcc8;border-radius:22px;padding:18px}
.bars h2{font-size:17px;margin-bottom:14px}
.bar{display:grid;grid-template-columns:44px minmax(0,1fr) 46px;gap:12px;align-items:center;margin-bottom:9px;font-size:14px}
.track{height:16px;border-radius:999px;background:#f0e5d6;overflow:hidden;position:relative}
.track i{position:absolute;inset-block:0;inset-inline-start:0;background:#58a700;border-radius:999px}
.track i.low{background:#ff9600}
.dep{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-top:24px}
.dep a{background:#fff;border:2px solid #ecdcc8;border-radius:16px;padding:13px;text-align:center;
 text-decoration:none;font-size:14px}
.dep a:hover{border-color:#58a700;color:#3f7a00}
.dep a span{display:block;font-size:11.5px;color:#6b635b;margin-top:2px}
footer{margin-top:34px;text-align:center;font-size:13px;color:#6b635b}
`,
  body: (D) => `<div class="w">
  <header class="top"><h1>שלום, מוסד!</h1>
    <div class="streak"><span class="pill">🔥<b>${D.pct}%</b> גבייה</span>
      <span class="pill">👥 <b>${D.present}</b>/${D.staff}</span></div></header>

  <div class="board">
    <div class="big">
      <div class="ring"><svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="נגבו ${D.pct} אחוז">
        <circle cx="60" cy="60" r="50" fill="none" stroke="#f0e5d6" stroke-width="14"></circle>
        <circle cx="60" cy="60" r="50" fill="none" stroke="#58a700" stroke-width="14" stroke-linecap="round"
          stroke-dasharray="${(D.pct / 100 * 314).toFixed(0)} 314" transform="rotate(-90 60 60)"></circle></svg>
        <b>${D.pct}%</b></div>
      <h2>גבייה</h2><p>${D.money(D.paid)} מתוך ${D.money(D.due)}</p></div>
    <div class="big">
      <div class="ring"><svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="נוכחות ${D.attAll} אחוז">
        <circle cx="60" cy="60" r="50" fill="none" stroke="#f0e5d6" stroke-width="14"></circle>
        <circle cx="60" cy="60" r="50" fill="none" stroke="#1cb0f6" stroke-width="14" stroke-linecap="round"
          stroke-dasharray="${(D.attAll / 100 * 314).toFixed(0)} 314" transform="rotate(-90 60 60)"></circle></svg>
        <b style="color:#0f6f9e">${D.attAll}%</b></div>
      <h2>נוכחות תלמידים</h2><p>${D.num(D.students)} תלמידים ב-12 כיתות</p></div>
    <div class="big">
      <div class="ring"><svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="מגבית ${Math.round(D.raised / D.goal * 100)} אחוז">
        <circle cx="60" cy="60" r="50" fill="none" stroke="#f0e5d6" stroke-width="14"></circle>
        <circle cx="60" cy="60" r="50" fill="none" stroke="#ff9600" stroke-width="14" stroke-linecap="round"
          stroke-dasharray="${Math.min(314, (D.raised / D.goal * 314)).toFixed(0)} 314" transform="rotate(-90 60 60)"></circle></svg>
        <b style="color:#b35f00">${Math.round(D.raised / D.goal * 100)}%</b></div>
      <h2>מגבית הבניין</h2><p>${D.money(D.raised)} מ-${D.donations} תרומות</p></div>
  </div>

  <section class="tasks">
    <h2>המשימות של היום</h2>
    ${D.alerts.map(([t, dep, sev], i) => `<div class="task">
      <span class="ic" style="background:${['#ffe2e2', '#fff0d6', '#e6f4ff'][sev - 1]}" aria-hidden="true">${['❗', '⏰', '💬'][sev - 1]}</span>
      <span class="t">${t}<span>${dep}</span></span>
      <button class="go${i === 0 ? '' : i === 1 ? ' blue' : ' grey'}">${i === 0 ? 'טפל' : 'פתח'}</button></div>`).join('')}
  </section>

  <section class="bars">
    <h2>נוכחות לפי כיתה</h2>
    ${D.att.map(c => `<div class="bar"><span>${c.name}</span>
      <span class="track"><i class="${c.pct < 90 ? 'low' : ''}" style="width:${c.pct}%"></i></span>
      <span>${c.pct}%</span></div>`).join('')}
  </section>

  <nav class="dep">${D.depts.map(([n, s]) => `<a href="#">${n}<span>${s}</span></a>`).join('')}</nav>
  <footer>אותם נתונים, עיצוב אחר · נתוני דוגמה</footer>
</div>`,
};

/* ═══ 4 · בנק ═══ טיפוגרפיה כבדה, ירוק-חד, פינות ישרות, שורות-תנועות ═══ */
const bank = {
  id: '04-bank', name: 'בנק', ref: 'אפליקציית-תשלומים · בהיר · Assistant כבד · כפתור מרובע',
  fonts: ['Assistant:wght@400;600;800'],
  css: `
body{background:#fff;color:#0e0f0c;font:400 16px/1.5 Assistant,Arial,sans-serif}
.strip{background:#163300;color:#9fe870;padding:10px 20px;font-size:13px;display:flex;gap:14px;flex-wrap:wrap}
.strip b{color:#fff}
.w{max-width:1080px;margin-inline:auto;padding:34px 20px 80px}
.head{display:flex;align-items:flex-start;gap:20px;flex-wrap:wrap;margin-bottom:34px}
.head h1{font:800 clamp(30px,5vw,46px)/1.05 Assistant;letter-spacing:-.02em;max-width:14ch}
.head .r{margin-inline-start:auto;text-align:end}
.head .r b{display:block;font:800 clamp(26px,4vw,38px)/1 Assistant;font-variant-numeric:tabular-nums}
.head .r span{font-size:13.5px;color:#454b3f}
.btns{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:38px}
.sq{background:#9fe870;color:#163300;border:0;border-radius:4px;padding:14px 22px;font-size:15px;font-weight:800;min-height:50px}
.sq:hover{background:#8ad95c}
.sq.dark{background:#163300;color:#9fe870}
.sq.line{background:#fff;border:2px solid #0e0f0c;color:#0e0f0c}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0;border:1px solid #d7d9d3;margin-bottom:38px}
.cell{padding:22px;border-inline-start:1px solid #d7d9d3}
.cell:first-child{border-inline-start:0}
.cell b{display:block;font:800 30px Assistant;font-variant-numeric:tabular-nums;letter-spacing:-.02em}
.cell span{font-size:13.5px;color:#454b3f}
.cell .sub{font-size:12.5px;color:#6b7264;margin-top:6px}
h2{font:800 20px Assistant;margin:0 0 4px}
p.lead{font-size:14px;color:#454b3f;margin-bottom:16px}
table{width:100%;border-collapse:collapse;font-size:15px}
th,td{text-align:start;padding:14px 8px;border-block-end:1px solid #e6e8e3}
thead th{font-size:12px;font-weight:600;color:#6b7264;text-transform:none;border-block-end:2px solid #0e0f0c}
td.n{text-align:end;font-variant-numeric:tabular-nums;font-weight:600;white-space:nowrap}
td .tag{display:inline-block;font-size:11.5px;font-weight:800;padding:2px 8px;border-radius:3px}
.t1{background:#ffe0e0;color:#8a1c1c}.t2{background:#fff3d6;color:#7a5200}.t3{background:#e9f7dd;color:#2f5c00}
.dep{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1px;background:#d7d9d3;
 border:1px solid #d7d9d3;margin-top:38px}
.dep a{background:#fff;padding:16px;text-decoration:none;font-weight:600;font-size:14.5px}
.dep a:hover{background:#f2f4ef}
.dep a span{display:block;font-weight:400;font-size:12.5px;color:#6b7264;margin-top:3px}
footer{margin-top:40px;font-size:12.5px;color:#6b7264}
`,
  body: (D) => `<div class="strip"><span>שנת ${D.tariff.year}</span><span>${D.today.hd}</span>
  <span>תעריף לילד <b>${D.money(D.tariff.tuition)}</b></span><span>נתוני דוגמה</span></div>
<div class="w">
  <header class="head">
    <h1>${D.pct}% מהחיוב השנתי כבר נגבו.</h1>
    <div class="r"><b>${D.money(D.open)}</b><span>פתוח אצל ${D.families} משפחות</span></div>
  </header>

  <div class="btns noprint"><button class="sq">רישום תשלום</button>
    <button class="sq dark">הפקת קבלות</button><button class="sq line">ייצוא לרואה חשבון</button></div>

  <div class="grid">
    <div class="cell"><b>${D.money(D.paid)}</b><span>נגבה עד היום</span><p class="sub">מתוך ${D.money(D.due)} שחויבו</p></div>
    <div class="cell"><b>${D.money(D.raised)}</b><span>מגבית הבניין</span><p class="sub">${D.donations} תרומות · ${Math.round(D.raised / D.goal * 100)}% מהיעד</p></div>
    <div class="cell"><b>${D.money(D.fund)}</b><span>זמין בגמ״ח</span><p class="sub">${D.loans} הלוואות · ${D.loansOpen} ממתינות</p></div>
  </div>

  <h2>דורש הכרעה היום</h2>
  <p class="lead">ארבעה דברים שממתינים לך, לפי דחיפות.</p>
  <table>
    <thead><tr><th scope="col">מה</th><th scope="col">אגף</th><th scope="col" class="n">דחיפות</th></tr></thead>
    <tbody>${D.alerts.map(([t, dep, sev]) => `<tr><td>${t}</td><td>${dep}</td>
      <td class="n"><span class="tag t${sev}">${['דחוף', 'השבוע', 'רגיל'][sev - 1]}</span></td></tr>`).join('')}</tbody>
  </table>

  <nav class="dep">${D.depts.map(([n, s]) => `<a href="#">${n}<span>${s}</span></a>`).join('')}</nav>
  <footer>כל הסכומים נגזרים מהמחסן בזמן ההצגה.</footer>
</div>`,
};

/* ═══ 5 · כרטיס ═══ כותרת-מדרג צבעוני, גיליון לבן מתחת, פעילות כמו אפליקציית-בנק ניידת ═══ */
const card = {
  id: '05-kartis', name: 'כרטיס', ref: 'ארנק נייד · מדרג צבעוני · Heebo + Suez One · כפתור גלולה',
  fonts: ['Heebo:wght@400;500;700;800', 'Suez+One'],
  css: `
body{background:#f4f2f7;color:#221c2e;font:400 16px/1.55 Heebo,Arial,sans-serif}
.hero{background:#a82f27 linear-gradient(135deg,#5b34c4 0%,#8e2fa8 48%,#a82f27 100%);color:#fff;
 padding:26px 22px 76px;position:relative}
.hero .top{display:flex;align-items:center;gap:12px;font-size:13.5px;opacity:.92}
.hero .top .sp{flex:1}
.hero h1{font:400 15px 'Suez One',Heebo,serif;opacity:.95;margin-top:26px}
.hero .amt{font:400 clamp(36px,9vw,58px)/1 'Suez One',Heebo,serif;margin-top:6px;font-variant-numeric:tabular-nums}
.hero .sub{font-size:14px;opacity:.92;margin-top:8px}
.hero .acts{display:flex;gap:10px;margin-top:20px;flex-wrap:wrap}
.pill{background:#fff;color:#4b2ea8;border:0;border-radius:999px;padding:11px 20px;font-size:14.5px;font-weight:700;min-height:44px}
.pill.o{background:rgba(255,255,255,.18);color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.6)}
.sheet{background:#fff;border-radius:26px 26px 0 0;margin-top:-54px;position:relative;padding:22px 20px 70px;
 max-width:760px;margin-inline:auto;box-shadow:0 -6px 30px rgba(34,28,46,.12)}
.quick{display:flex;gap:10px;overflow-x:auto;padding-bottom:12px;margin-bottom:6px}
.quick a{flex:none;background:#f4f2f7;border-radius:16px;padding:12px 16px;text-decoration:none;min-width:116px}
.quick a b{display:block;font-size:19px;font-weight:800;font-variant-numeric:tabular-nums}
.quick a span{font-size:12px;color:#6c6480}
h2{font-size:16px;margin:22px 0 10px;display:flex;align-items:baseline}
h2 a{margin-inline-start:auto;font-size:13px;color:#6f4bd8;text-decoration:none;font-weight:500}
.act li{display:grid;grid-template-columns:42px minmax(0,1fr) auto;gap:13px;align-items:center;padding:12px 0;border-block-end:1px solid #efedf3}
.act .ic{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-size:17px}
.act b{font-size:15px;font-weight:600}
.act span{font-size:12.5px;color:#6c6480}
.act .v{font-size:15px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}
.act .v.neg{color:#c02b2b}
.act .v.pos{color:#1b7a3d}
.prog{background:#f4f2f7;border-radius:18px;padding:16px;margin-top:16px}
.prog .row{display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:9px}
.track{height:10px;border-radius:999px;background:#e3dfeb;overflow:hidden;position:relative}
.track i{position:absolute;inset-block:0;inset-inline-start:0;background:linear-gradient(90deg,#5b34c4,#a82f27);border-radius:999px}
.dep{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.dep a{background:#f4f2f7;border-radius:999px;padding:9px 15px;font-size:13.5px;text-decoration:none}
.dep a:hover{background:#e9e5f2}
.dep a i{font-style:normal;color:#6c6480;font-size:12px;margin-inline-start:6px}
footer{text-align:center;font-size:12.5px;color:#6c6480;margin-top:26px}
`,
  body: (D) => `<header class="hero">
  <div class="top"><span>מוסד</span><span class="sp"></span><span>${D.today.hd} ${D.today.hy}</span></div>
  <h1>נגבה עד היום</h1>
  <p class="amt">${D.money(D.paid)}</p>
  <p class="sub">${D.pct}% מהחיוב השנתי · נותרו ${D.money(D.open)}</p>
  <div class="acts noprint"><button class="pill">רישום תשלום</button><button class="pill o">שליחת תזכורות</button></div>
</header>

<main class="sheet">
  <div class="quick">
    <a href="#"><b>${D.present}/${D.staff}</b><span>צוות נוכח</span></a>
    <a href="#"><b>${D.attAll}%</b><span>נוכחות</span></a>
    <a href="#"><b>${D.num(D.students)}</b><span>תלמידים</span></a>
    <a href="#"><b>${D.k(D.fund)}</b><span>זמין בגמ״ח</span></a>
    <a href="#"><b>${D.queue}</b><span>בתור</span></a>
  </div>

  <h2>דורש הכרעה <a href="#">הכל</a></h2>
  <ul class="act">
    ${D.alerts.map(([t, dep, sev]) => `<li>
      <span class="ic" style="background:${['#ffe4e4', '#fff1dc', '#e8f0ff'][sev - 1]}" aria-hidden="true">${['⚠', '⏳', '👤'][sev - 1]}</span>
      <span><b>${t}</b><br><span>${dep}</span></span>
      <span class="v ${sev === 1 ? 'neg' : ''}">${['דחוף', 'השבוע', 'רגיל'][sev - 1]}</span></li>`).join('')}
  </ul>

  <h2>היום בבית המדרש</h2>
  <ul class="act">
    ${D.minyanim.slice(3, 7).map(m => `<li>
      <span class="ic" style="background:#f0ecfa" aria-hidden="true">🕯</span>
      <span><b>${m.name}</b><br><span>${m.where || '—'}${m.count ? ' · ' + m.count + ' משתתפים' : ''}</span></span>
      <span class="v">${D.ltr(m.time)}</span></li>`).join('')}
  </ul>

  <div class="prog">
    <div class="row"><span>מגבית ${D.camp}</span><b>${Math.round(D.raised / D.goal * 100)}%</b></div>
    <div class="track"><i style="width:${Math.min(100, D.raised / D.goal * 100)}%"></i></div>
    <div class="row" style="margin:9px 0 0"><span>${D.money(D.raised)}</span><span>יעד ${D.money(D.goal)}</span></div>
  </div>

  <nav class="dep">${D.depts.map(([n, s]) => `<a href="#">${n}<i>${s}</i></a>`).join('')}</nav>
  <footer>נתוני דוגמה · אותם מספרים בכל הגרסאות</footer>
</main>`,
};

export default [command, shelf, play, bank, card];
