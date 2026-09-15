/* ═══════════════════════════════════════════════════════════════════════════
   חמש ערכות — חלקים שנלקחו מחמשת האתרים שהבעלים בחר, לפי הצילומים האמיתיים
   (scratchpad/world/jpg + scratchpad/pick). כל ערכה תורמת חמישה חלקים:
     surface — משטח וטיפוגרפיה   home — שלד המסך   widgets — הוויג׳טים
     cards — הכרטיס הפנימי       btn  — שפת הכפתורים
   העיצובים נבנים אך ורק מהחלקים האלה, בשילובים שונים. אין כאן המצאה.
   מחלקות כל ערכה מקודמות באות (r/s/d/w/m) כדי שאפשר יהיה לערבב בלי התנגשות.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── 1 · Raycast ──────────────────────────────────────────────────────────
   מהצילום: משטח שחור-פחם, שורות עם קו-שיער דק, טקסט קטן ואפור, שבבי-מקלדת,
   כפתורי-רפאים עם מסגרת דקה ורדיוס 6, פאנל מפתח/ערך בתחתית.            */
export const raycast = {
  id: 'raycast', name: 'Raycast',
  parts: { surface: 'משטח פחם + שורות קו-שיער', home: 'שורת-פקודה במרכז ותוצאות מתחתיה', widgets: 'רצועת מפתח/ערך צפופה', cards: 'שורה עם אייקון, כותרת ומטא מימין', btn: 'רפאים עם שבב-מקלדת' },
  font: ['Assistant:wght@400;500;600;700'], face: "Assistant", faceNote: 'Assistant · המקבילה העברית ל-Inter',
  tok: { bg: '#09090b', card: '#131316', sunk: '#17171a', ink: '#ededf0', mut: '#9a9aa3', hair: '#26262e', acc: '#ff6363', accInk: '#2a0505', pos: '#7ee0a0', warn: '#e8c07a', solid: '#ededf0', onSolid: '#0b0b0d', accText: '#ff6363', r: '8px' },
  typeCss: `body{font:400 15px/1.55 var(--face),Arial,sans-serif;letter-spacing:0}
h1{font-size:19px;font-weight:600}h2{font-size:12px;font-weight:600;letter-spacing:.12em;color:var(--mut)}`,

  homeCss: `.r-w{max-width:780px;margin-inline:auto;padding:44px 20px 70px}
.r-top{display:flex;align-items:baseline;gap:10px;margin-bottom:22px}
.r-top .d{margin-inline-start:auto;font-size:12.5px;color:var(--mut)}
.r-cmd{display:flex;align-items:center;gap:11px;background:var(--card);border:1px solid var(--hair);
 border-radius:11px;padding:14px 16px}
.r-cmd input{flex:1;background:none;border:0;outline:0;font-size:16px;color:var(--ink)}
.r-cmd input::placeholder{color:var(--mut)}
.r-hint{font-size:12px;color:var(--mut);margin:8px 2px 26px;display:flex;gap:15px;flex-wrap:wrap}
.r-sec{margin:24px 2px 8px}
.r-dep{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
.r-dep a{font-size:12.5px;color:var(--mut);border:1px solid var(--hair);border-radius:7px;padding:5px 10px;text-decoration:none}
.r-dep a:hover{color:var(--ink)}
.r-dep a i{font-style:normal;opacity:.7;margin-inline-start:6px}
.r-foot{margin-top:34px;font-size:12px;color:var(--mut)}`,
  home: (D, P) => `<div class="r-w">
  <header class="r-top"><h1>מוסד · לוח הבית</h1><span class="d">${D.today.hd} ${D.today.hy}</span></header>
  <div class="r-cmd noprint"><span aria-hidden="true" style="color:var(--mut)">⌕</span>
    <input placeholder="חפש משפחה, תלמיד, הלוואה או פעולה…" aria-label="חיפוש"><kbd>Ctrl K</kbd></div>
  <p class="r-hint"><span>↑↓ לבחירה</span><span>Enter לפתיחה</span><span>${D.num(D.people)} רשומות</span></p>
  <h2 class="r-sec">מצב</h2>${P.wid()}
  <h2 class="r-sec">דורש הכרעה</h2>${P.cards()}
  <div class="noprint" style="margin-top:22px">${P.btns()}</div>
  <h2 class="r-sec">אגפים</h2>
  <nav class="r-dep">${D.depts.map(([n, s]) => `<a href="#">${n}<i>${s}</i></a>`).join('')}</nav>
  <p class="r-foot">${P.mixLine}</p></div>`,

  widCss: `.r-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(128px,1fr));gap:1px;
 background:var(--hair);border:1px solid var(--hair);border-radius:var(--r);overflow:hidden}
.r-kpi{background:var(--card);padding:13px 15px}
.r-kpi b{display:block;font-size:20px;font-weight:600;font-variant-numeric:tabular-nums}
.r-kpi span{font-size:12px;color:var(--mut)}
.r-kpi.up b{color:var(--pos)}.r-kpi.warn b{color:var(--warn)}
.r-mini{display:flex;gap:14px;flex-wrap:wrap;margin-top:12px;font-size:12.5px;color:var(--mut)}
.r-mini b{color:var(--ink);font-variant-numeric:tabular-nums}`,
  wid: (D) => `<div class="r-kpis">
  <div class="r-kpi up"><b>${D.pct}%</b><span>נגבה מהחיוב</span></div>
  <div class="r-kpi"><b>${D.present}/${D.staff}</b><span>צוות נוכח</span></div>
  <div class="r-kpi"><b>${D.attAll}%</b><span>נוכחות</span></div>
  <div class="r-kpi warn"><b>${D.late}</b><span>בפיגור</span></div>
  <div class="r-kpi"><b>${D.k(D.fund)}</b><span>גמ״ח זמין</span></div></div>
<p class="r-mini"><span>נגבה <b>${D.money(D.paid)}</b></span><span>פתוח <b>${D.money(D.open)}</b></span>
  <span>מגבית <b>${D.money(D.raised)}</b></span><span>תלמידים <b>${D.num(D.students)}</b></span></p>`,

  cardCss: `.r-rows{border-block-start:1px solid var(--hair)}
.r-row{display:grid;grid-template-columns:26px minmax(0,1fr) auto;gap:12px;align-items:center;
 padding:11px 4px;border-block-end:1px solid var(--hair)}
.r-row:hover{background:var(--card)}
.r-row .ic{width:24px;height:24px;border-radius:6px;display:grid;place-items:center;font-size:12px;
 background:var(--sunk);color:var(--mut)}
.r-row .t{font-size:14.5px}
.r-row .m{font-size:12px;color:var(--mut);white-space:nowrap}`,
  cards: (D) => `<div class="r-rows">
  ${D.alerts.map(([t, dep, sev]) => `<div class="r-row"><span class="ic" aria-hidden="true">${sev === 1 ? '!' : sev === 2 ? '~' : '·'}</span>
    <span class="t">${t}</span><span class="m">${dep}</span></div>`).join('')}
  ${D.minyanim.slice(3, 6).map(m => `<div class="r-row"><span class="ic" aria-hidden="true">•</span>
    <span class="t">${m.name}</span><span class="m">${D.ltr(m.time)}</span></div>`).join('')}</div>`,

  btnCss: `kbd{font:500 11px ui-monospace,Menlo,monospace;color:var(--mut);background:var(--sunk);
 border:1px solid var(--hair);border-radius:5px;padding:2px 6px}
.btn{background:none;border:1px solid var(--hair);color:var(--ink);border-radius:6px;padding:8px 13px;
 font:500 13.5px var(--face);display:inline-flex;align-items:center;gap:8px;min-height:38px}
.btn:hover{border-color:var(--mut)}
.btn.pri{background:var(--solid);border-color:var(--solid);color:var(--onSolid);font-weight:600}
.btns{display:flex;gap:8px;flex-wrap:wrap}`,
  btns: () => `<div class="btns"><button class="btn pri">רישום תשלום <kbd>P</kbd></button>
  <button class="btn">הודעה להורים <kbd>M</kbd></button><button class="btn">דוח לוועד <kbd>R</kbd></button></div>`,
};

/* ── 2 · Spotify ──────────────────────────────────────────────────────────
   מהצילום: שחור מלא, כותרות-מדף מודגשות, אריחי-אמנות מרובעים ואווטרים עגולים
   במדף אופקי, כפתור-נגינה עגול ירוק, כפתור-רפאים בגלולה, באנר תחתון.      */
export const spotify = {
  id: 'spotify', name: 'Spotify',
  parts: { surface: 'שחור מלא + כותרות מודגשות', home: 'מדפים אופקיים עם כותרת-קטע', widgets: 'אריחי-אמנות מרובעים במדף', cards: 'שורת-רשימה ממוספרת עם מטא', btn: 'גלולה + כפתור עגול ירוק' },
  font: ['Secular+One', 'Assistant:wght@400;600;700'], face: "Assistant", faceNote: "Secular One לכותרות · Assistant לגוף (מקבילות ל-Circular)",
  tok: { bg: '#000', card: '#121212', sunk: '#181818', ink: '#fff', mut: '#a7a7a7', hair: '#2a2a2a', acc: '#1db954', accInk: '#00220d', pos: '#1db954', warn: '#f0c05a', solid: '#1db954', onSolid: '#00220d', accText: '#1db954', r: '10px' },
  typeCss: `body{font:400 15px/1.5 var(--face),Arial,sans-serif}
h1{font:400 22px 'Secular One',var(--face),sans-serif}
h2{font:400 20px 'Secular One',var(--face),sans-serif;display:flex;align-items:baseline;gap:9px}
h2 small{font:400 12.5px var(--face);color:var(--mut)}`,

  homeCss: `.s-w{max-width:1160px;margin-inline:auto;padding:22px 22px 80px}
.s-top{display:flex;align-items:center;gap:13px;margin-bottom:22px}
.s-top .av{width:36px;height:36px;border-radius:50%;background:var(--acc);color:var(--accInk);
 display:grid;place-items:center;font:400 15px 'Secular One'}
.s-top .d{margin-inline-start:auto;color:var(--mut);font-size:13px}
.s-hero{background:#06170d linear-gradient(160deg,var(--acc) 0%,#0f6e34 55%,#06170d 100%);color:#fff;border-radius:12px;
 padding:30px 26px;display:flex;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:26px}
.s-hero .big{font:400 clamp(34px,7vw,64px)/1 'Secular One',var(--face),sans-serif}
.s-hero .lab{font-size:14px;color:#dff3e6}
.s-hero .side{margin-inline-start:auto;display:flex;align-items:center;gap:12px}
.s-sec{margin:26px 0 12px}
.s-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.s-chips a{background:var(--card);border-radius:999px;padding:8px 14px;font-size:13.5px;text-decoration:none}
.s-chips a:hover{background:var(--sunk)}
.s-chips a i{font-style:normal;color:var(--mut);font-size:12px;margin-inline-start:6px}
.s-foot{margin-top:38px;color:var(--mut);font-size:12.5px}
/* כל כפתור שיושב בכותרת הכהה מקבל צבעים בהירים ושומר על צורתו המקורית */
.s-hero .btn{background:#fff;color:#0a0a0a;border-color:#fff;box-shadow:0 4px 0 rgba(0,0,0,.35)}
.s-hero .btn:hover{background:#f0f0f0}
.s-hero .btn.sec,.s-hero .btn.line{background:transparent;color:#fff;border-color:rgba(255,255,255,.7);
 box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.7)}
.s-hero .btn.sec:hover,.s-hero .btn.line:hover{background:rgba(255,255,255,.12)}
.s-hero .btn.round{background:#fff;color:#0a0a0a;box-shadow:0 8px 20px rgba(0,0,0,.4)}
.s-hero kbd{background:rgba(0,0,0,.25);color:#fff;border-color:rgba(255,255,255,.4)}`,
  home: (D, P) => `<div class="s-w">
  <header class="s-top"><span class="av" aria-hidden="true">מ</span><h1>הבית של המוסד</h1>
    <span class="d">${D.today.hd} ${D.today.hy}</span></header>
  <section class="s-hero"><div><p class="lab">גבייה · ${D.tariff.year}</p>
    <p class="big">${D.pct}%</p><p class="lab">${D.money(D.paid)} נגבו · ${D.money(D.open)} פתוחים</p></div>
    <div class="side noprint">${P.btns()}</div></section>
  <h2 class="s-sec">לטפל היום <small>נבנה מהמחסן</small></h2>${P.wid()}
  <h2 class="s-sec">דורש הכרעה</h2>${P.cards()}
  <h2 class="s-sec">אגפים</h2>
  <nav class="s-chips">${D.depts.map(([n, s]) => `<a href="#">${n}<i>${s}</i></a>`).join('')}</nav>
  <p class="s-foot">${P.mixLine}</p></div>`,

  widCss: `.s-shelf{display:flex;gap:15px;overflow-x:auto;padding-bottom:8px;scroll-snap-type:x proximity}
.s-card{flex:none;width:178px;background:var(--card);border-radius:var(--r);padding:15px;
 scroll-snap-align:start;text-decoration:none;color:inherit}
.s-card:hover{background:var(--sunk)}
.s-card .art{aspect-ratio:1;border-radius:7px;display:grid;place-items:center;margin-bottom:12px;
 font:400 32px 'Secular One',var(--face),sans-serif;font-variant-numeric:tabular-nums}
.s-card b{display:block;font-size:14.5px;font-weight:700}
.s-card span{font-size:12.5px;color:var(--mut)}`,
  wid: (D) => `<div class="s-shelf">
  ${[[D.late, 'משפחות בפיגור', 'שיחה או תזכורת', '#3b1f2b', '#f2789b'],
    [D.loansOpen, 'בקשות גמ״ח', 'ממתינות לוועדה', '#1f2b3b', '#8fb4ff'],
    [D.queue, 'בתור לקבלת קהל', 'החצר', '#2b2b1f', '#e8c07a'],
    [D.absent, 'חסרים בצוות', D.subs + ' מחליפים', '#1f3b2b', '#7ee0a0'],
    [D.noDriver.length, 'קווים בלי נהג', 'למחר', '#3b2b1f', '#f0a97b']]
    .map(([n, t, s, bg, fg]) => `<a class="s-card" href="#"><span class="art" style="background:${bg};color:${fg}">${n}</span>
      <b>${t}</b><span>${s}</span></a>`).join('')}</div>`,

  cardCss: `.s-list li{display:grid;grid-template-columns:26px minmax(0,1fr) auto;gap:13px;align-items:center;
 padding:10px 8px;border-radius:6px;font-size:14.5px}
.s-list li:hover{background:var(--card)}
.s-list .n{color:var(--mut);font-size:13px;text-align:center;font-variant-numeric:tabular-nums}
.s-list .t{font-size:12.5px;color:var(--mut)}
.s-list .on b{color:var(--accText)}`,
  cards: (D) => `<ul class="s-list">
  ${D.alerts.map(([t, dep], i) => `<li><span class="n">${i + 1}</span>
    <span><b>${t}</b><br><span class="t">${dep}</span></span><span class="n">›</span></li>`).join('')}
  ${D.minyanim.slice(4, 6).map((m, i) => `<li class="${i === 0 ? 'on' : ''}"><span class="n">${D.alerts.length + i + 1}</span>
    <span><b>${m.name}</b><br><span class="t">${m.where || ''}${m.count ? ' · ' + m.count + ' משתתפים' : ''}</span></span>
    <span class="n">${D.ltr(m.time)}</span></li>`).join('')}</ul>`,

  btnCss: `.btn{background:transparent;border:1.5px solid var(--ink);color:var(--ink);border-radius:999px;
 padding:10px 19px;font:700 14px var(--face);min-height:44px}
.btn:hover{background:var(--sunk)}
.btn.pri{background:var(--solid);border-color:var(--solid);color:var(--onSolid)}
.btn.round{width:54px;height:54px;border-radius:50%;background:var(--solid);color:var(--onSolid);border:0;
 font-size:19px;display:grid;place-items:center;padding:0}
.btns{display:flex;gap:11px;align-items:center;flex-wrap:wrap}`,
  btns: () => `<div class="btns"><button class="btn">רישום תשלום</button>
  <button class="btn round" aria-label="פתיחת יום העבודה">▸</button></div>`,
};

/* ── 3 · Duolingo ─────────────────────────────────────────────────────────
   מהצילום: לבן ונקי, טיפוגרפיה עגולה וידידותית, כפתור ירוק תלת-ממדי עם צל
   תחתון ותווית גדולה, כפתור-משנה לבן עם מסגרת, שורת-שבבים עם דגלים למטה. */
export const duolingo = {
  id: 'duolingo', name: 'Duolingo',
  parts: { surface: 'לבן נקי + טיפוגרפיה עגולה', home: 'מרכז-מסך עם טבעות התקדמות', widgets: 'טבעות + פסי-התקדמות עבים', cards: 'שורת-משימה עם אייקון מרובע וכפתור', btn: 'תלת-ממדי עם צל תחתון' },
  font: ['Varela+Round', 'Alef:wght@400;700'], face: "'Varela Round'", faceNote: "Varela Round · המקבילה העברית ל-Feather/DIN Round",
  tok: { bg: '#fff', card: '#fff', sunk: '#f7f7f7', ink: '#3c3c3c', mut: '#6a6a6a', hair: '#e5e5e5', acc: '#46a302', accInk: '#0d2600', pos: '#3f7a00', warn: '#b35f00', solid: '#46a302', onSolid: '#0d2600', accText: '#3f7a00', r: '16px' },
  typeCss: `body{font:400 16px/1.55 var(--face),Arial,sans-serif}
h1{font-size:23px}h2{font-size:18px}`,

  homeCss: `.d-w{max-width:980px;margin-inline:auto;padding:22px 20px 80px}
.d-top{display:flex;align-items:center;gap:12px;margin-bottom:20px}
.d-top .pill{background:var(--sunk);border:2px solid var(--hair);border-radius:999px;padding:6px 13px;font-size:14px}
.d-top .sp{flex:1}
.d-sec{margin:26px 0 12px;text-align:center}
.d-dep{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-top:12px}
.d-dep a{border:2px solid var(--hair);border-radius:14px;padding:12px;text-align:center;text-decoration:none;font-size:14px}
.d-dep a:hover{border-color:var(--acc);color:var(--acc)}
.d-dep a span{display:block;font-size:11.5px;color:var(--mut);margin-top:2px}
.d-foot{margin-top:30px;text-align:center;font-size:12.5px;color:var(--mut)}`,
  home: (D, P) => `<div class="d-w">
  <header class="d-top"><h1>שלום, מוסד!</h1><span class="sp"></span>
    <span class="pill">🔥 ${D.pct}% גבייה</span><span class="pill">👥 ${D.present}/${D.staff}</span></header>
  ${P.wid()}
  <h2 class="d-sec">המשימות של היום</h2>${P.cards()}
  <div class="noprint" style="margin-top:20px;display:flex;justify-content:center">${P.btns()}</div>
  <h2 class="d-sec">אגפים</h2>
  <nav class="d-dep">${D.depts.map(([n, s]) => `<a href="#">${n}<span>${s}</span></a>`).join('')}</nav>
  <p class="d-foot">${P.mixLine}</p></div>`,

  widCss: `.d-rings{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:14px}
.d-ring{border:2px solid var(--hair);border-radius:20px;padding:20px;text-align:center}
.d-ring .r{position:relative;display:grid;place-items:center;margin-bottom:8px}
.d-ring .r b{position:absolute;font-size:25px;color:var(--pos)}
.d-ring h3{font-size:16px;margin-bottom:3px}
.d-ring p{font-size:13px;color:var(--mut)}
.d-bars{border:2px solid var(--hair);border-radius:20px;padding:18px;margin-top:14px}
.d-bar{display:grid;grid-template-columns:42px minmax(0,1fr) 44px;gap:11px;align-items:center;margin-bottom:8px;font-size:14px}
.d-track{height:15px;border-radius:999px;background:var(--sunk);overflow:hidden;position:relative}
.d-track i{position:absolute;inset-block:0;inset-inline-start:0;background:var(--pos);border-radius:999px}
.d-track i.low{background:var(--warn)}`,
  wid: (D) => {
    const ring = (pct, lab, sub) => `<div class="d-ring"><div class="r">
      <svg width="112" height="112" viewBox="0 0 112 112" role="img" aria-label="${lab} ${pct} אחוז">
        <circle cx="56" cy="56" r="47" fill="none" stroke="var(--sunk)" stroke-width="13"></circle>
        <circle cx="56" cy="56" r="47" fill="none" stroke="var(--pos)" stroke-width="13" stroke-linecap="round"
          stroke-dasharray="${(pct / 100 * 295).toFixed(0)} 295" transform="rotate(-90 56 56)"></circle></svg>
      <b>${pct}%</b></div><h3>${lab}</h3><p>${sub}</p></div>`;
    return `<div class="d-rings">
      ${ring(D.pct, 'גבייה', D.money(D.paid) + ' מתוך ' + D.money(D.due))}
      ${ring(D.attAll, 'נוכחות תלמידים', D.num(D.students) + ' תלמידים')}
      ${ring(Math.round(D.raised / D.goal * 100), 'מגבית הבניין', D.money(D.raised))}</div>
    <div class="d-bars">${D.att.map(c => `<div class="d-bar"><span>${c.name}</span>
      <span class="d-track"><i class="${c.pct < 90 ? 'low' : ''}" style="width:${c.pct}%"></i></span>
      <span>${c.pct}%</span></div>`).join('')}</div>`;
  },

  cardCss: `.d-task{display:flex;align-items:center;gap:13px;padding:13px;border:2px solid var(--hair);
 border-radius:16px;margin-bottom:9px}
.d-task .ic{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;font-size:19px;flex:none;background:var(--sunk)}
.d-task .t{flex:1;font-size:15px}
.d-task .t span{display:block;font-size:12.5px;color:var(--mut)}`,
  cards: (D) => D.alerts.map(([t, dep, sev]) => `<div class="d-task">
    <span class="ic" aria-hidden="true">${['❗', '⏰', '💬'][sev - 1]}</span>
    <span class="t">${t}<span>${dep}</span></span>
    <button class="btn ${sev === 1 ? 'pri' : 'sec'}">${sev === 1 ? 'טפל' : 'פתח'}</button></div>`).join(''),

  btnCss: `.btn{border:0;border-radius:14px;padding:11px 20px;font:400 15px var(--face);min-height:46px;
 background:var(--solid);color:var(--onSolid);box-shadow:0 4px 0 var(--hair)}
.btn:active{transform:translateY(3px);box-shadow:0 1px 0 var(--hair)}
.btn.sec,.btn.pri.sec{background:var(--card);color:var(--ink);border:2px solid var(--hair);box-shadow:0 4px 0 var(--hair)}
.btn.sec:active{box-shadow:0 1px 0 var(--hair)}
.btns{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}`,
  btns: () => `<div class="btns"><button class="btn">רישום תשלום</button>
  <button class="btn sec">הודעה להורים</button><button class="btn sec">דוח לוועד</button></div>`,
};

/* ── 4 · Wise ─────────────────────────────────────────────────────────────
   מהצילום: ירוק-בהיר עם דיו ירוק-כהה, כותרת כבדה, כרטיס פנימי עם עיגול-דגל
   בצד, שם, וכפתור-גלולה קטן מימין; שורות-סכום ענקיות עם בורר-מטבע.      */
export const wise = {
  id: 'wise', name: 'Wise',
  parts: { surface: 'ירוק-בהיר + דיו ירוק-כהה', home: 'כותרת כבדה ואחריה כרטיס-חישוב', widgets: 'שורות-סכום ענקיות עם בורר', cards: 'כרטיס עם עיגול, שם וכפתור-גלולה קטן', btn: 'גלולה כהה מלאה' },
  font: ['Heebo:wght@400;500;700;800'], face: "Heebo", faceNote: 'Heebo 800 · המקבילה העברית ל-Wise Sans',
  tok: { bg: '#fff', card: '#fff', sunk: '#f4f2ea', ink: '#163300', mut: '#4b5744', hair: '#dcdad0', acc: '#9fe870', accInk: '#163300', pos: '#2f7a00', warn: '#8a5a00', solid: '#163300', onSolid: '#ffffff', accText: '#2f7a00', r: '14px' },
  typeCss: `body{font:400 16px/1.5 var(--face),Arial,sans-serif}
h1{font:800 clamp(28px,5vw,44px)/1.05 var(--face);letter-spacing:-.02em}
h2{font:800 20px var(--face)}`,

  homeCss: `.w-band{background:var(--acc);color:var(--accInk);padding:30px 20px}
.w-band .in{max-width:1040px;margin-inline:auto;display:flex;gap:20px;align-items:flex-end;flex-wrap:wrap}
.w-band .r{margin-inline-start:auto;text-align:end}
.w-band .r b{display:block;font:800 clamp(24px,4vw,34px)/1 var(--face);font-variant-numeric:tabular-nums}
.w-band .r span{font-size:13.5px}
.w-w{max-width:1040px;margin-inline:auto;padding:26px 20px 80px}
.w-sec{margin:26px 0 12px}
.w-dep{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:1px;background:var(--hair);
 border:1px solid var(--hair);margin-top:12px}
.w-dep a{background:var(--card);padding:14px;text-decoration:none;font-weight:700;font-size:14.5px}
.w-dep a:hover{background:var(--sunk)}
.w-dep a span{display:block;font-weight:400;font-size:12.5px;color:var(--mut);margin-top:2px}
.w-foot{margin-top:32px;font-size:12.5px;color:var(--mut)}`,
  home: (D, P) => `<header class="w-band"><div class="in">
    <h1>${D.pct}% מהחיוב השנתי כבר נגבו.</h1>
    <div class="r"><b>${D.money(D.open)}</b><span>פתוח אצל ${D.families} משפחות</span></div>
  </div></header>
<div class="w-w">
  <div class="noprint" style="margin-bottom:26px">${P.btns()}</div>
  ${P.wid()}
  <h2 class="w-sec">דורש הכרעה</h2>${P.cards()}
  <h2 class="w-sec">אגפים</h2>
  <nav class="w-dep">${D.depts.map(([n, s]) => `<a href="#">${n}<span>${s}</span></a>`).join('')}</nav>
  <p class="w-foot">${P.mixLine}</p></div>`,

  widCss: `.w-calc{border:1px solid var(--hair);border-radius:var(--r);overflow:hidden}
.w-row{display:flex;align-items:center;gap:14px;padding:18px 20px;border-block-end:1px solid var(--hair);flex-wrap:wrap}
.w-row:last-child{border:0}
.w-row .lab{font-size:13.5px;color:var(--mut);width:100%}
.w-row .sel{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--hair);border-radius:999px;
 padding:7px 13px;font-size:14px;font-weight:700}
.w-row .sel i{width:20px;height:20px;border-radius:50%;background:var(--sunk);display:grid;place-items:center;font-style:normal;font-size:11px}
.w-row .amt{margin-inline-start:auto;font:800 clamp(26px,5vw,38px)/1 var(--face);font-variant-numeric:tabular-nums}
.w-note{display:flex;align-items:center;gap:8px;padding:12px 20px;background:var(--sunk);font-size:13px}
.w-note a{color:var(--accText);font-weight:700}
.w-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-top:16px}
.w-kpi{border:1px solid var(--hair);border-radius:var(--r);padding:16px}
.w-kpi b{display:block;font:800 22px var(--face);font-variant-numeric:tabular-nums;color:var(--ink)}
.w-kpi span{font-size:12.5px;color:var(--mut)}`,
  wid: (D) => `<div class="w-calc">
  <div class="w-row"><span class="lab">נגבה עד היום</span>
    <span class="sel"><i aria-hidden="true">₪</i>שכר לימוד</span><span class="amt">${D.money(D.paid)}</span></div>
  <div class="w-row"><span class="lab">נותר פתוח</span>
    <span class="sel"><i aria-hidden="true">₪</i>${D.families} משפחות</span><span class="amt">${D.money(D.open)}</span></div>
  <div class="w-note"><span aria-hidden="true">🛈</span><span>${D.late} משפחות בפיגור בלי הוראת קבע — <a href="#">רשימה לשיחה</a></span></div>
</div>
<div class="w-kpis">
  <div class="w-kpi"><b>${D.attAll}%</b><span>נוכחות תלמידים</span></div>
  <div class="w-kpi"><b>${D.present}/${D.staff}</b><span>צוות נוכח היום</span></div>
  <div class="w-kpi"><b>${D.money(D.raised)}</b><span>מגבית · ${Math.round(D.raised / D.goal * 100)}% מהיעד</span></div>
  <div class="w-kpi"><b>${D.money(D.fund)}</b><span>זמין בגמ״ח</span></div></div>`,

  cardCss: `.w-card{display:flex;align-items:center;gap:13px;border:1px solid var(--hair);border-radius:var(--r);
 padding:13px 16px;margin-bottom:9px;flex-wrap:wrap}
.w-card .circ{width:38px;height:38px;border-radius:50%;background:var(--sunk);display:grid;place-items:center;
 font-size:15px;flex:none}
.w-card .t{flex:1;min-width:150px;font-size:15px;font-weight:700}
.w-card .t span{display:block;font-size:12.5px;font-weight:400;color:var(--mut)}
.w-pill{background:var(--acc);color:var(--accInk);border:0;border-radius:999px;padding:6px 14px;
 font:700 13px var(--face);min-height:34px}
.w-pill:hover{background:#8ed85e}`,
  cards: (D) => D.alerts.map(([t, dep, sev]) => `<div class="w-card">
    <span class="circ" aria-hidden="true">${['⚠', '⏳', '👤'][sev - 1]}</span>
    <span class="t">${t}<span>${dep}</span></span>
    <button class="w-pill">${sev === 1 ? 'טפל' : 'פתח'}</button></div>`).join(''),

  btnCss: `.btn{background:var(--solid);color:var(--onSolid);border:0;border-radius:999px;padding:13px 26px;
 font:700 15px var(--face);min-height:48px}
.btn:hover{filter:brightness(.92)}
.btn.sec{background:var(--acc);color:var(--accInk)}
.btn.line{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--ink)}
.btns{display:flex;gap:10px;flex-wrap:wrap}`,
  btns: () => `<div class="btns"><button class="btn">רישום תשלום</button>
  <button class="btn sec">הודעה להורים</button><button class="btn line">דוח לוועד</button></div>`,
};

/* ── 5 · Monzo ────────────────────────────────────────────────────────────
   מהצילום: משטח לבן, כרטיסי-צבע גדולים (אלמוגי) עם פינות עגולות, ובתוכם
   כרטיסונים לבנים עם תג-סטטוס ירוק וחץ ›; כפתור-גלולה כהה בפס העליון.   */
export const monzo = {
  id: 'monzo', name: 'Monzo',
  parts: { surface: 'לבן + כרטיסי-צבע גדולים', home: 'פס-הודעה עליון ורשת כרטיסי-צבע', widgets: 'כרטיס-צבע עם מספר גדול', cards: 'כרטיסון לבן עם תג ירוק וחץ', btn: 'גלולה כהה + חץ' },
  font: ['Rubik:wght@400;500;600;700'], face: "Rubik", faceNote: 'Rubik · המקבילה העברית ל-ABC Favorit/Inter',
  tok: { bg: '#fff', card: '#fff', sunk: '#f6f5f4', ink: '#14233c', mut: '#57606f', hair: '#e6e4e1', acc: '#ff4f40', accInk: '#2b0c08', pos: '#116b3c', warn: '#8a5a00', solid: '#14233c', onSolid: '#ffffff', accText: '#b3382c', r: '20px' },
  typeCss: `body{font:400 16px/1.55 var(--face),Arial,sans-serif}
h1{font-size:clamp(24px,4vw,34px);font-weight:700;letter-spacing:-.01em}
h2{font-size:20px;font-weight:700}`,

  homeCss: `.m-note{background:var(--sunk);padding:11px 20px;display:flex;align-items:center;gap:12px;
 font-size:13.5px;flex-wrap:wrap}
.m-note .sp{flex:1}
.m-w{max-width:1100px;margin-inline:auto;padding:26px 20px 80px}
.m-head{margin-bottom:22px}
.m-head p{color:var(--mut);font-size:14.5px;margin-top:6px}
.m-sec{margin:28px 0 14px}
.m-dep{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:12px}
.m-dep a{border:1px solid var(--hair);border-radius:14px;padding:13px;text-decoration:none;font-size:14.5px;font-weight:500}
.m-dep a:hover{border-color:var(--ink)}
.m-dep a span{display:block;font-size:12px;color:var(--mut);font-weight:400;margin-top:2px}
.m-foot{margin-top:32px;font-size:12.5px;color:var(--mut)}`,
  home: (D, P) => `<div class="m-note noprint"><span>נתוני דוגמה · ${D.today.hd} ${D.today.hy}</span>
  <span class="sp"></span>${P.btns()}</div>
<div class="m-w">
  <header class="m-head"><h1>${D.pct}% נגבו · ${D.money(D.open)} פתוחים</h1>
    <p>${D.num(D.students)} תלמידים · ${D.families} משפחות · ${D.present} מתוך ${D.staff} אנשי צוות נוכחים היום</p></header>
  ${P.wid()}
  <h2 class="m-sec">דורש הכרעה</h2>${P.cards()}
  <h2 class="m-sec">אגפים</h2>
  <nav class="m-dep">${D.depts.map(([n, s]) => `<a href="#">${n}<span>${s}</span></a>`).join('')}</nav>
  <p class="m-foot">${P.mixLine}</p></div>`,

  widCss: `.m-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
.m-tile{border-radius:var(--r);padding:20px;color:#2b0c08;min-height:150px;display:flex;flex-direction:column;gap:6px}
.m-tile b{font-size:34px;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.05}
.m-tile .lab{font-size:14.5px;font-weight:600}
.m-tile .sub{font-size:12.5px;margin-top:auto;opacity:.85}
.m-t1{background:#ffd7d2}.m-t2{background:#d6ecff}.m-t3{background:#dff3d8}.m-t4{background:#ffeccc}.m-t5{background:#e8e2ff}`,
  wid: (D) => `<div class="m-grid">
  <div class="m-tile m-t1"><b>${D.pct}%</b><span class="lab">גבייה</span><span class="sub">${D.money(D.paid)} מתוך ${D.money(D.due)}</span></div>
  <div class="m-tile m-t2"><b>${D.present}/${D.staff}</b><span class="lab">צוות נוכח</span><span class="sub">${D.absent} חסרים · ${D.subs} מחליפים</span></div>
  <div class="m-tile m-t3"><b>${D.attAll}%</b><span class="lab">נוכחות תלמידים</span><span class="sub">${D.num(D.students)} תלמידים ב-12 כיתות</span></div>
  <div class="m-tile m-t4"><b>${Math.round(D.raised / D.goal * 100)}%</b><span class="lab">מגבית הבניין</span><span class="sub">${D.money(D.raised)} · ${D.donations} תרומות</span></div>
  <div class="m-tile m-t5"><b>${D.k(D.fund)}</b><span class="lab">זמין בגמ״ח</span><span class="sub">${D.loans} הלוואות · ${D.loansOpen} ממתינות</span></div></div>`,

  cardCss: `.m-box{background:var(--acc);border-radius:var(--r);padding:16px;display:grid;gap:10px;color:var(--accInk)}
.m-inner{background:#fff;color:#14233c;border-radius:14px;padding:13px 15px;display:grid;
 grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center;text-decoration:none}
.m-inner .ic{width:34px;height:34px;border-radius:10px;background:#f1efec;display:grid;place-items:center;font-size:15px}
.m-inner b{font-size:14.5px;font-weight:600;display:block}
.m-inner .tag{display:inline-block;font-size:11px;font-weight:700;background:#d9f2e3;color:#116b3c;
 border-radius:999px;padding:1px 8px;margin-bottom:3px}
.m-inner .ch{font-size:17px;color:#57606f}
.m-inner:hover{box-shadow:0 2px 10px rgba(0,0,0,.12)}`,
  cards: (D) => `<div class="m-box">
  ${D.alerts.map(([t, dep, sev]) => `<a class="m-inner" href="#">
    <span class="ic" aria-hidden="true">${['⚠', '⏳', '👤'][sev - 1]}</span>
    <span><span class="tag">${dep}</span><b>${t}</b></span><span class="ch" aria-hidden="true">›</span></a>`).join('')}
</div>`,

  btnCss: `.btn{background:var(--solid);color:var(--onSolid);border:0;border-radius:999px;padding:10px 18px;
 font:500 14px var(--face);min-height:42px;display:inline-flex;align-items:center;gap:8px}
.btn:hover{filter:brightness(.92)}
.btn::after{content:'←';font-size:13px;opacity:.8}
.btn.sec{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--hair)}
.btn.sec:hover{box-shadow:inset 0 0 0 1.5px var(--ink);background:transparent}
.btns{display:flex;gap:9px;flex-wrap:wrap}`,
  btns: () => `<div class="btns"><button class="btn">רישום תשלום</button>
  <button class="btn sec">הודעה להורים</button></div>`,
};

export const KITS = { raycast, spotify, duolingo, wise, monzo };
