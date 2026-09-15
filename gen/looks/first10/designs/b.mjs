/* גרסאות 6–10 של מסך-הבית. */

/* ═══ 6 · שווייצרי ═══ רשת קשיחה, שחור-לבן-אדום, פינות ישרות, קווי-סרגל ═══ */
const swiss = {
  id: '06-shweitz', name: 'שווייצרי', ref: 'רשת בינלאומית · לבן/שחור/אדום · Miriam Libre + Arimo · כפתור חד',
  fonts: ['Miriam+Libre:wght@400;700', 'Arimo:wght@400;700'],
  css: `
body{background:#fff;color:#000;font:400 15px/1.5 Arimo,Arial,sans-serif}
.w{max-width:1120px;margin-inline:auto;padding:0 20px 80px}
.rule{border-block-end:3px solid #000}
.mast{display:grid;grid-template-columns:repeat(12,1fr);gap:0;align-items:end;padding:18px 0 10px}
.mast h1{grid-column:1/8;font:700 clamp(30px,6vw,54px)/.95 'Miriam Libre',sans-serif;letter-spacing:-.02em}
.mast .meta{grid-column:8/13;text-align:end;font-size:12px;line-height:1.7;text-transform:uppercase;letter-spacing:.06em}
.mast .meta b{color:#e2231a}
.band{display:grid;grid-template-columns:repeat(12,1fr);border-block-end:1px solid #000}
.band>div{grid-column:span 3;padding:18px 14px 18px 0;border-inline-start:1px solid #000}
.band>div:first-child{border-inline-start:0;padding-inline-start:0}
.band b{display:block;font:700 clamp(26px,4vw,40px)/1 'Miriam Libre',sans-serif;font-variant-numeric:tabular-nums}
.band span{font-size:11.5px;text-transform:uppercase;letter-spacing:.08em}
.band .red b{color:#e2231a}
.cols{display:grid;grid-template-columns:repeat(12,1fr);gap:0;margin-top:0}
.c8{grid-column:1/9;border-inline-end:1px solid #000;padding:22px 0 22px 0}
.c4{grid-column:9/13;padding:22px 0 22px 18px}
h2{font:700 13px Arimo;text-transform:uppercase;letter-spacing:.12em;margin-bottom:14px}
.ln{display:grid;grid-template-columns:70px minmax(0,1fr) auto;gap:14px;padding:10px 18px 10px 0;
 border-block-start:1px solid #000;font-size:14.5px}
.ln:last-child{border-block-end:1px solid #000}
.ln time,.ln .v{font-variant-numeric:tabular-nums;font-size:13px}
.ln.on{background:#000;color:#fff}
.ln.on time{color:#fff}
.al{border-block-start:1px solid #000;padding:11px 0;font-size:14px;display:flex;gap:10px}
.al:last-child{border-block-end:1px solid #000}
.al .n{font:700 12px Arimo;color:#e2231a;min-width:18px}
.al .d{margin-inline-start:auto;font-size:11.5px;text-transform:uppercase;letter-spacing:.06em}
.btns{display:flex;gap:0;margin:26px 0 0;flex-wrap:wrap}
.btn{background:#000;color:#fff;border:0;border-radius:0;padding:14px 22px;font:700 14px Arimo;min-height:48px}
.btn:hover{background:#e2231a}
.btn.o{background:#fff;color:#000;box-shadow:inset 0 0 0 1px #000;margin-inline-start:-1px}
.btn.o:hover{background:#000;color:#fff}
.att{display:grid;grid-template-columns:repeat(12,1fr);border-block-start:3px solid #000;margin-top:28px}
.att div{grid-column:span 2;padding:12px 0;border-inline-start:1px solid #000;padding-inline-start:10px}
.att div:first-child{border-inline-start:0;padding-inline-start:0}
.att b{display:block;font:700 20px 'Miriam Libre';font-variant-numeric:tabular-nums}
.att span{font-size:11px}
.att .low b{color:#e2231a}
.dep{border-block-start:3px solid #000;margin-top:28px;padding-top:14px;
 display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:0}
.dep a{padding:10px 10px 10px 0;text-decoration:none;font-size:13.5px;border-block-end:1px solid #ddd}
.dep a:hover{color:#e2231a}
.dep a span{display:block;font-size:11px;color:#555}
footer{margin-top:30px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#555}
@media(max-width:760px){.mast h1,.mast .meta{grid-column:1/13;text-align:start}
 .band>div{grid-column:span 6}.c8,.c4{grid-column:1/13;border:0;padding-inline:0}
 .att div{grid-column:span 4}}
`,
  body: (D) => `<div class="w">
  <header class="mast rule">
    <h1>מוסד / לוח הבית</h1>
    <p class="meta">${D.today.hd} ${D.today.hy}<br>${D.today.dow}<br><b>נתוני דוגמה</b></p>
  </header>

  <section class="band">
    <div><b>${D.pct}%</b><span>גבייה</span></div>
    <div><b>${D.present}/${D.staff}</b><span>צוות נוכח</span></div>
    <div><b>${D.attAll}%</b><span>נוכחות</span></div>
    <div class="red"><b>${D.late}</b><span>בפיגור</span></div>
  </section>

  <div class="cols">
    <div class="c8">
      <h2>עכשיו במוסד</h2>
      ${D.minyanim.slice(0, 7).map(m => `<div class="ln${m.time === D.now.time ? ' on' : ''}">
        <time>${D.ltr(m.time)}</time><span>${m.name}</span><span class="v">${m.count ? m.count : '—'}</span></div>`).join('')}
      <div class="btns noprint"><button class="btn">רישום תשלום</button>
        <button class="btn o">הודעה להורים</button><button class="btn o">דוח לוועד</button></div>
    </div>
    <div class="c4">
      <h2>דורש הכרעה</h2>
      ${D.alerts.map(([t, dep], i) => `<div class="al"><span class="n">${String(i + 1).padStart(2, '0')}</span>
        <span>${t}<span class="d">${dep}</span></span></div>`).join('')}
      <h2 style="margin-top:22px">כספים</h2>
      <div class="al"><span>נגבה</span><span class="d">${D.money(D.paid)}</span></div>
      <div class="al"><span>פתוח</span><span class="d">${D.money(D.open)}</span></div>
      <div class="al"><span>מגבית</span><span class="d">${D.money(D.raised)}</span></div>
      <div class="al"><span>גמ״ח זמין</span><span class="d">${D.money(D.fund)}</span></div>
    </div>
  </div>

  <section class="att">
    ${D.att.map(c => `<div class="${c.pct < 90 ? 'low' : ''}"><b>${c.pct}</b><span>${c.name}</span></div>`).join('')}
  </section>

  <nav class="dep">${D.depts.map(([n, s]) => `<a href="#">${n}<span>${s}</span></a>`).join('')}</nav>
  <footer>כל מספר נגזר מהמחסן · אין ערכים כתובים במסך</footer>
</div>`,
};

/* ═══ 7 · עיתון ═══ נייר, טורי-טקסט, כותרות-ספר, קישורים עם חץ במקום כפתורים ═══ */
const paper = {
  id: '07-iton', name: 'עיתון', ref: 'עמוד ראשי · נייר · Frank Ruhl Libre + David Libre · קישור-חץ',
  fonts: ['Frank+Ruhl+Libre:wght@400;500;700;900', 'David+Libre:wght@400;500;700'],
  css: `
body{background:#f7f3ea;color:#22201c;font:400 16px/1.7 'David Libre',Georgia,serif}
.w{max-width:1060px;margin-inline:auto;padding:26px 22px 80px}
.flag{text-align:center;border-block:3px double #22201c;padding:14px 0 10px;margin-bottom:6px}
.flag h1{font:900 clamp(34px,7vw,62px)/1 'Frank Ruhl Libre',serif;letter-spacing:-.01em}
.flag p{font-size:12.5px;letter-spacing:.14em;margin-top:8px}
.dek{text-align:center;font-size:14px;color:#5b554c;margin-bottom:22px}
.lead{display:grid;grid-template-columns:2fr 1fr;gap:26px;border-block-end:1px solid #cfc7b8;padding-bottom:22px;margin-bottom:22px}
.lead h2{font:700 clamp(24px,4vw,34px)/1.15 'Frank Ruhl Libre',serif;margin-bottom:10px}
.lead p{font-size:16.5px}
.lead p:first-letter{font:700 46px/38px 'Frank Ruhl Libre',serif;float:inline-start;margin-inline-end:8px;margin-block-start:4px}
.box{border:1px solid #cfc7b8;padding:16px;background:#fffdf8}
.box h3{font:700 13px 'Frank Ruhl Libre';letter-spacing:.1em;margin-bottom:10px;border-block-end:1px solid #cfc7b8;padding-bottom:7px}
.box dl{display:grid;grid-template-columns:auto 1fr;gap:5px 10px;font-size:14px}
.box dt{color:#5b554c}.box dd{margin:0;text-align:end;font-variant-numeric:tabular-nums;font-weight:500}
.cols{column-count:3;column-gap:26px;column-rule:1px solid #cfc7b8}
@media(max-width:860px){.cols{column-count:2}.lead{grid-template-columns:1fr}}
@media(max-width:560px){.cols{column-count:1}}
.art{break-inside:avoid;margin-bottom:20px}
.art h3{font:700 19px 'Frank Ruhl Libre',serif;margin-bottom:4px}
.art .kicker{font:500 11.5px 'Frank Ruhl Libre';letter-spacing:.12em;color:#8a2f22}
.art p{font-size:14.5px;line-height:1.65}
.art .more{display:inline-block;margin-top:5px;font:500 13.5px 'Frank Ruhl Libre';color:#8a2f22;text-decoration:none;border-block-end:1px solid #8a2f22}
.art .more:hover{background:#8a2f22;color:#fffdf8}
.tbl{width:100%;border-collapse:collapse;font-size:14px;margin-top:4px}
.tbl th,.tbl td{text-align:start;padding:5px 0;border-block-end:1px dotted #cfc7b8}
.tbl td.n{text-align:end;font-variant-numeric:tabular-nums}
.rule2{border-block-start:3px double #22201c;margin:24px 0 16px}
.dep{display:flex;flex-wrap:wrap;gap:0 18px;font-size:14px}
.dep a{text-decoration:none;border-block-end:1px solid transparent;padding:4px 0}
.dep a:hover{border-block-end-color:#22201c}
.dep a i{font-style:normal;color:#5b554c;font-size:12px;margin-inline-start:5px}
footer{margin-top:26px;font-size:12px;color:#5b554c;text-align:center;letter-spacing:.06em}
`,
  body: (D) => `<div class="w">
  <header class="flag"><h1>לוח המוסד</h1>
    <p>${D.today.hd} ${D.today.hy} · ${D.today.dow} · גיליון יומי · נתוני דוגמה</p></header>
  <p class="dek">כל המספרים בעמוד זה נגזרו מן המחסן בעת ההדפסה</p>

  <section class="lead">
    <article>
      <span class="kicker">גבייה</span>
      <h2>${D.pct} אחוזים מן החיוב השנתי כבר נגבו; ${D.money(D.open)} נותרו פתוחים</h2>
      <p>עד היום נגבו ${D.money(D.paid)} מתוך ${D.money(D.due)} שחויבו ל-${D.families} משפחות
         בשנת ${D.tariff.year}. ${D.late} משפחות מצויות בפיגור ואינן מחזיקות הוראת קבע —
         אלו הן הפניות שראש-המוסד מתבקש להכריע בהן ראשונה.
         <a class="more" href="#">אל אגף הגבייה ←</a></p>
    </article>
    <aside class="box">
      <h3>במספרים</h3>
      <dl>
        <dt>תלמידים</dt><dd>${D.num(D.students)}</dd>
        <dt>משפחות</dt><dd>${D.families}</dd>
        <dt>צוות נוכח</dt><dd>${D.present} מתוך ${D.staff}</dd>
        <dt>נוכחות</dt><dd>${D.attAll}%</dd>
        <dt>מגבית</dt><dd>${D.money(D.raised)}</dd>
        <dt>גמ״ח זמין</dt><dd>${D.money(D.fund)}</dd>
      </dl>
    </aside>
  </section>

  <div class="cols">
    <article class="art">
      <span class="kicker">בית המדרש</span>
      <h3>סדר היום: ${D.minyanim.length} זמנים</h3>
      <table class="tbl">${D.minyanim.slice(0, 6).map(m => `<tr><th scope="row">${m.name}</th>
        <td class="n">${D.ltr(m.time)}</td></tr>`).join('')}</table>
      <a class="more" href="#">הלוח המלא ←</a>
    </article>

    <article class="art">
      <span class="kicker">דורש הכרעה</span>
      <h3>ארבעה עניינים על השולחן</h3>
      <p>${D.alerts.map(([t, dep]) => `<b>${dep}:</b> ${t}.`).join(' ')}</p>
      <a class="more" href="#">רשימת המשימות ←</a>
    </article>

    <article class="art">
      <span class="kicker">חינוך</span>
      <h3>נוכחות לפי כיתה</h3>
      <table class="tbl">${D.att.slice(0, 8).map(c => `<tr><th scope="row">${c.name}</th>
        <td class="n">${c.pct}%</td></tr>`).join('')}</table>
      <a class="more" href="#">אל אגף החינוך ←</a>
    </article>

    <article class="art">
      <span class="kicker">תרומות</span>
      <h3>מגבית ${D.camp}</h3>
      <p>נאספו ${D.money(D.raised)} מתוך ${D.money(D.goal)} — ${Math.round(D.raised / D.goal * 100)} אחוזים —
         ב-${D.donations} תרומות. <a class="more" href="#">אל המגבית ←</a></p>
    </article>

    <article class="art">
      <span class="kicker">חסד</span>
      <h3>הגמ״ח</h3>
      <p>${D.money(D.fund)} זמינים להלוואה; ${D.loans} הלוואות בתיק ו-${D.loansOpen} בקשות ממתינות לוועדה.
         <a class="more" href="#">אל אגף החסד ←</a></p>
    </article>
  </div>

  <div class="rule2"></div>
  <nav class="dep">${D.depts.map(([n, s]) => `<a href="#">${n}<i>${s}</i></a>`).join('')}</nav>
  <footer>מוסד · לוח הבית · עמוד אחד</footer>
</div>`,
};

/* ═══ 8 · מסוף ═══ מונוספייס בלבד, מסגרות ASCII, כפתורי-סוגריים ═══ */
const terminal = {
  id: '08-masof', name: 'מסוף', ref: 'טרמינל · ענבר על שחור · Cousine מונו · כפתור [בסוגריים]',
  fonts: ['Cousine:wght@400;700'],
  css: `
body{background:#0d0f0d;color:#d6e2c4;font:400 14px/1.6 Cousine,ui-monospace,monospace}
.w{max-width:940px;margin-inline:auto;padding:26px 18px 70px}
.bar{display:flex;gap:12px;align-items:baseline;border:1px solid #2c3a2a;padding:8px 12px;margin-bottom:16px}
.bar h1{font-size:14px;font-weight:700;color:#ffc857}
.bar .sp{flex:1}
.bar span{font-size:12.5px;color:#7f9170}
pre{margin:0;white-space:pre;overflow-x:auto;font:inherit;color:#7d9b73}
.blk{border:1px solid #2c3a2a;margin-bottom:14px}
.blk>h2{background:#16211a;color:#ffc857;font-size:12.5px;font-weight:700;padding:6px 12px;
 border-block-end:1px solid #2c3a2a;letter-spacing:.06em}
.blk>div{padding:10px 12px}
.kv{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:2px 18px}
.kv p{display:flex;gap:8px;font-size:13.5px}
.kv p b{color:#fff;font-weight:700;font-variant-numeric:tabular-nums}
.kv p i{flex:1;border-block-end:1px dotted #2c3a2a;font-style:normal;transform:translateY(-4px)}
.rowl{display:grid;grid-template-columns:62px minmax(0,1fr) auto;gap:10px;font-size:13.5px;padding:2px 0}
.rowl.on{color:#ffc857}
.rowl .c{color:#7f9170}
.warn{color:#ff8b6b}
.ok{color:#8fe388}
.acts{display:flex;gap:14px;flex-wrap:wrap;margin:16px 0 6px}
.br{background:none;border:0;color:#d6e2c4;font:700 14px Cousine,monospace;padding:6px 2px;min-height:38px}
.br:hover{color:#ffc857}
.br::before{content:'[ '}.br::after{content:' ]'}
.dep{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:2px 16px;font-size:13px}
.dep a{text-decoration:none;color:#d6e2c4;padding:2px 0}
.dep a:hover{color:#ffc857}
.dep a::before{content:'› ';color:#7d9b73}
.dep a i{font-style:normal;color:#7f9170}
footer{color:#7d9b73;font-size:12.5px;margin-top:18px}
.cur{display:inline-block;width:8px;height:15px;background:#ffc857;vertical-align:-2px}
`,
  body: (D) => `<div class="w">
  <header class="bar"><h1>mosad@bayit</h1><span>~/${D.tariff.year}</span><span class="sp"></span>
    <span>${D.today.hd} ${D.today.hy}</span></header>

  <pre>┌─ סיכום ─────────────────────────────────────────────┐</pre>
  <div class="blk"><h2>מצב כללי</h2><div class="kv">
    <p>גבייה <i></i><b>${D.pct}%</b></p>
    <p>נגבה <i></i><b>${D.money(D.paid)}</b></p>
    <p>פתוח <i></i><b class="warn">${D.money(D.open)}</b></p>
    <p>תלמידים <i></i><b>${D.num(D.students)}</b></p>
    <p>נוכחות <i></i><b>${D.attAll}%</b></p>
    <p>צוות <i></i><b>${D.present}/${D.staff}</b></p>
    <p>מגבית <i></i><b>${D.money(D.raised)}</b></p>
    <p>גמ״ח זמין <i></i><b class="ok">${D.money(D.fund)}</b></p>
  </div></div>

  <div class="blk"><h2>לוח היום</h2><div>
    ${D.minyanim.map(m => `<div class="rowl${m.time === D.now.time ? ' on' : ''}">
      <span>${D.ltr(m.time)}</span><span>${m.name}</span>
      <span class="c">${m.count ? m.count : '·'}</span></div>`).join('')}
  </div></div>

  <div class="blk"><h2>דורש הכרעה</h2><div>
    ${D.alerts.map(([t, dep, sev]) => `<div class="rowl">
      <span class="${sev === 1 ? 'warn' : 'c'}">${sev === 1 ? '!!' : sev === 2 ? '!' : '·'}</span>
      <span>${t}</span><span class="c">${dep}</span></div>`).join('')}
  </div></div>

  <div class="acts noprint">
    <button class="br">רישום תשלום</button><button class="br">הודעה להורים</button>
    <button class="br">דוח לוועד</button><button class="br">יומן</button>
  </div>

  <div class="blk"><h2>אגפים</h2><div class="dep">
    ${D.depts.map(([n, s]) => `<a href="#">${n} <i>${s}</i></a>`).join('')}
  </div></div>

  <footer>$ הכל נגזר מהמחסן · אפס ערכים כתובים <span class="cur" aria-hidden="true"></span></footer>
</div>`,
};

/* ═══ 9 · קונטור ═══ ברוטליסטי: מסגרות עבות, צל-קשיח, בלוקי-צבע חזקים ═══ */
const outline = {
  id: '09-kontur', name: 'קונטור', ref: 'ברוטליסטי · מסגרת עבה וצל-קשיח · Alef + Karantina · כפתור-בלוק',
  fonts: ['Alef:wght@400;700', 'Karantina:wght@400;700'],
  css: `
body{background:#fdf6e3;color:#111;font:400 16px/1.5 Alef,Arial,sans-serif}
.w{max-width:1120px;margin-inline:auto;padding:22px 20px 80px}
.top{border:3px solid #111;background:#ffd23f;padding:14px 18px;display:flex;align-items:center;gap:14px;
 flex-wrap:wrap;box-shadow:7px 7px 0 #111;margin-bottom:26px}
.top h1{font:700 clamp(30px,6vw,46px)/1 Karantina,Alef,sans-serif;letter-spacing:.01em}
.top .d{margin-inline-start:auto;font-size:13.5px;font-weight:700}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:16px;margin-bottom:22px}
.blk{border:3px solid #111;background:#fff;padding:16px;box-shadow:6px 6px 0 #111}
.blk b{display:block;font:700 clamp(28px,5vw,40px)/1 Karantina,Alef,sans-serif;font-variant-numeric:tabular-nums}
.blk span{font-size:13.5px;font-weight:700}
.blk p{font-size:12.5px;color:#444;margin-top:4px}
.blk.pink{background:#ff90b3}.blk.blue{background:#8ecdf7}.blk.green{background:#9be08a}.blk.lilac{background:#c9b6f7}
.two{display:grid;grid-template-columns:1.25fr 1fr;gap:16px}
@media(max-width:820px){.two{grid-template-columns:1fr}}
.panel{border:3px solid #111;background:#fff;box-shadow:6px 6px 0 #111}
.panel h2{font:700 26px Karantina,Alef,sans-serif;background:#111;color:#fdf6e3;padding:7px 16px}
.panel .in{padding:14px 16px}
.ln{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:12px;padding:9px 0;
 border-block-end:2px dashed #111;font-size:14.5px}
.ln:last-child{border:0}
.ln time{font-weight:700;font-variant-numeric:tabular-nums}
.ln .c{font-size:12.5px;color:#444}
.ln.on{background:#ffd23f;margin-inline:-16px;padding-inline:16px}
.al{display:flex;gap:12px;align-items:center;padding:11px 0;border-block-end:2px dashed #111;font-size:14.5px}
.al:last-child{border:0}
.al .tag{font:700 11px Alef;border:2px solid #111;padding:1px 7px;white-space:nowrap}
.al .tag.s1{background:#ff90b3}.al .tag.s2{background:#ffd23f}.al .tag.s3{background:#8ecdf7}
.btns{display:flex;gap:14px;flex-wrap:wrap;margin:26px 0}
.blkbtn{border:3px solid #111;background:#111;color:#fdf6e3;padding:13px 22px;font:700 16px Alef;
 box-shadow:5px 5px 0 #ff90b3;min-height:50px}
.blkbtn:hover{transform:translate(2px,2px);box-shadow:3px 3px 0 #ff90b3}
.blkbtn.y{background:#ffd23f;color:#111;box-shadow:5px 5px 0 #111}
.blkbtn.w{background:#fff;color:#111;box-shadow:5px 5px 0 #8ecdf7}
.dep{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
.dep a{border:3px solid #111;background:#fff;padding:12px;text-decoration:none;font-weight:700;font-size:14.5px;
 box-shadow:4px 4px 0 #111}
.dep a:hover{background:#ffd23f}
.dep a span{display:block;font-weight:400;font-size:12px;color:#444}
footer{margin-top:26px;font-size:12.5px;font-weight:700}
`,
  body: (D) => `<div class="w">
  <header class="top"><h1>הבית</h1><span class="d">${D.today.hd} ${D.today.hy} · ${D.today.dow} · נתוני דוגמה</span></header>

  <div class="grid">
    <div class="blk green"><b>${D.pct}%</b><span>גבייה</span><p>${D.money(D.paid)} מתוך ${D.money(D.due)}</p></div>
    <div class="blk blue"><b>${D.present}/${D.staff}</b><span>צוות נוכח</span><p>${D.absent} חסרים · ${D.subs} מחליפים</p></div>
    <div class="blk lilac"><b>${D.attAll}%</b><span>נוכחות תלמידים</span><p>${D.num(D.students)} תלמידים</p></div>
    <div class="blk pink"><b>${D.late}</b><span>משפחות בפיגור</span><p>בלי הוראת קבע</p></div>
  </div>

  <div class="two">
    <section class="panel"><h2>עכשיו במוסד</h2><div class="in">
      ${D.minyanim.slice(0, 7).map(m => `<div class="ln${m.time === D.now.time ? ' on' : ''}">
        <time>${D.ltr(m.time)}</time>
        <span>${m.name}${m.where ? `<br><span class="c">${m.where}</span>` : ''}</span>
        <span class="c">${m.count ? m.count : ''}</span></div>`).join('')}
    </div></section>

    <section class="panel"><h2>דורש הכרעה</h2><div class="in">
      ${D.alerts.map(([t, dep, sev]) => `<div class="al">
        <span class="tag s${sev}">${dep}</span><span>${t}</span></div>`).join('')}
      <div class="al"><span class="tag s3">גמ״ח</span><span>${D.money(D.fund)} זמינים · ${D.loansOpen} בקשות</span></div>
      <div class="al"><span class="tag s2">מגבית</span><span>${D.money(D.raised)} · ${Math.round(D.raised / D.goal * 100)}% מהיעד</span></div>
    </div></section>
  </div>

  <div class="btns noprint"><button class="blkbtn">רישום תשלום</button>
    <button class="blkbtn y">הודעה להורים</button><button class="blkbtn w">דוח לוועד</button></div>

  <nav class="dep">${D.depts.map(([n, s]) => `<a href="#">${n}<span>${s}</span></a>`).join('')}</nav>
  <footer>אותם מספרים בכל עשר הגרסאות — רק העיצוב מתחלף.</footer>
</div>`,
};

/* ═══ 10 · מוסדי ═══ כחול-זהב, סימטריה, קווי-זהב דקים, כפתור רשמי ═══ */
const formal = {
  id: '10-mosadi', name: 'מוסדי', ref: 'רשמי · כחול-זהב · Bellefair + Noto Sans Hebrew · כפתור מסגרת',
  fonts: ['Bellefair', 'Noto+Sans+Hebrew:wght@400;500;700'],
  css: `
body{background:#f6f4ef;color:#15213b;font:400 15.5px/1.6 'Noto Sans Hebrew',Arial,sans-serif}
.crest{background:#15213b;color:#f6f4ef;padding:26px 20px 22px;text-align:center;
 border-block-end:3px solid #c9a227}
.crest .mark{width:54px;height:54px;border:2px solid #c9a227;border-radius:50%;display:grid;place-items:center;
 margin:0 auto 12px;font:400 26px Bellefair,serif;color:#c9a227}
.crest h1{font:400 clamp(28px,5vw,42px)/1.1 Bellefair,serif;letter-spacing:.02em}
.crest p{font-size:13px;color:#c9c3b4;margin-top:6px;letter-spacing:.08em}
.w{max-width:1000px;margin-inline:auto;padding:0 20px 80px}
.band{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:0;background:#fff;
 border:1px solid #ddd8cc;border-block-start:0;margin-bottom:30px}
.band div{padding:20px 16px;text-align:center;border-inline-start:1px solid #ddd8cc}
.band div:first-child{border-inline-start:0}
.band b{display:block;font:400 32px Bellefair,serif;color:#15213b;font-variant-numeric:tabular-nums}
.band span{font-size:12.5px;color:#5a6274;letter-spacing:.04em}
h2{font:400 24px Bellefair,serif;text-align:center;margin:0 0 4px}
h2+p.s{text-align:center;font-size:13px;color:#5a6274;margin-bottom:18px}
.gold{width:76px;height:1px;background:#c9a227;margin:10px auto 20px}
.two{display:grid;grid-template-columns:1fr 1fr;gap:34px;margin-bottom:34px}
@media(max-width:800px){.two{grid-template-columns:1fr;gap:26px}}
.card{background:#fff;border:1px solid #ddd8cc;padding:22px}
.card h3{font:400 20px Bellefair,serif;border-block-end:1px solid #c9a227;padding-bottom:8px;margin-bottom:12px}
.li{display:flex;gap:12px;align-items:baseline;padding:9px 0;border-block-end:1px dotted #ddd8cc;font-size:14.5px}
.li:last-child{border:0}
.li time{font-variant-numeric:tabular-nums;color:#5a6274;font-size:13.5px;min-width:52px}
.li .v{margin-inline-start:auto;font-weight:500;font-variant-numeric:tabular-nums}
.li.on{background:#fbf7ea}
.li.on time{color:#8a6d14;font-weight:700}
.btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:6px 0 34px}
.of{background:#fff;border:1px solid #15213b;color:#15213b;padding:12px 26px;font:500 14.5px 'Noto Sans Hebrew';
 letter-spacing:.03em;min-height:46px}
.of:hover{background:#15213b;color:#f6f4ef}
.of.gold{border-color:#c9a227;color:#8a6d14}
.of.gold:hover{background:#c9a227;color:#15213b}
.of.solid{background:#15213b;color:#f6f4ef}
.of.solid:hover{background:#0e1729}
.dep{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:1px;background:#ddd8cc;border:1px solid #ddd8cc}
.dep a{background:#fff;padding:14px;text-align:center;text-decoration:none;font-size:14px}
.dep a:hover{background:#fbf7ea;color:#8a6d14}
.dep a span{display:block;font-size:11.5px;color:#5a6274;margin-top:3px}
footer{text-align:center;margin-top:30px;font-size:12px;color:#5a6274;letter-spacing:.06em}
`,
  body: (D) => `<header class="crest">
  <div class="mark" aria-hidden="true">מ</div>
  <h1>מוסד · לוח ההנהלה</h1>
  <p>${D.today.hd} ${D.today.hy} · ${D.today.dow} · נתוני דוגמה</p>
</header>
<div class="w">
  <section class="band">
    <div><b>${D.pct}%</b><span>גבייה</span></div>
    <div><b>${D.num(D.students)}</b><span>תלמידים</span></div>
    <div><b>${D.present}/${D.staff}</b><span>צוות נוכח</span></div>
    <div><b>${D.attAll}%</b><span>נוכחות</span></div>
    <div><b>${Math.round(D.raised / D.goal * 100)}%</b><span>מן המגבית</span></div>
  </section>

  <h2>המצב לעת עתה</h2>
  <p class="s">כל הנתונים נגזרים מן המחסן בעת ההצגה</p>
  <div class="gold"></div>

  <div class="two">
    <section class="card"><h3>סדר היום</h3>
      ${D.minyanim.slice(0, 7).map(m => `<div class="li${m.time === D.now.time ? ' on' : ''}">
        <time>${D.ltr(m.time)}</time><span>${m.name}</span>
        <span class="v">${m.count ? m.count : ''}</span></div>`).join('')}
    </section>
    <section class="card"><h3>לתשומת לב ההנהלה</h3>
      ${D.alerts.map(([t, dep]) => `<div class="li"><span>${t}</span><span class="v">${dep}</span></div>`).join('')}
      <div class="li"><span>נגבה עד היום</span><span class="v">${D.money(D.paid)}</span></div>
      <div class="li"><span>יתרה פתוחה</span><span class="v">${D.money(D.open)}</span></div>
      <div class="li"><span>זמין בגמ״ח</span><span class="v">${D.money(D.fund)}</span></div>
    </section>
  </div>

  <div class="btns noprint"><button class="of solid">רישום תשלום</button>
    <button class="of gold">דוח לוועד</button><button class="of">הודעה להורים</button></div>

  <h2>אגפי המוסד</h2><div class="gold"></div>
  <nav class="dep">${D.depts.map(([n, s]) => `<a href="#">${n}<span>${s}</span></a>`).join('')}</nav>
  <footer>מוסד · ${D.tariff.year}</footer>
</div>`,
};

export default [swiss, paper, terminal, outline, formal];
