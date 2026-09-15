/* ===========================================================================
   השלד — ניווט, תפקידים, פלטת-פקודות, ביטול, יומן.
   כל מסך הוא פונקציה שמחזירה HTML; השלד מחליף אותם בלי טעינה מחדש.
   =========================================================================== */

/* עשרת התפקידים הם של האפיון (SPEC.roles). המדיניות אומרת מה כל אחד רואה. */
const POLICY = {
  'מנהל כללי': { money: 1, kvittel: 1, views: '*' },
  'מזכירות': { money: 1, kvittel: 0, views: ['bait', 'anashim', 'hinuch', 'tzevet', 'hatzer', 'tikshor'] },
  'גזבר': { money: 1, kvittel: 0, views: ['bait', 'gviya', 'ksafim', 'trumot', 'hesed', 'anashim'] },
  'מגייס': { money: 1, kvittel: 0, views: ['bait', 'trumot', 'anashim', 'tikshor'] },
  'מלמד': { money: 0, kvittel: 0, views: ['bait', 'hinuch', 'anashim', 'medrash'] },
  'גבאי': { money: 1, kvittel: 1, views: ['bait', 'medrash', 'hatzer', 'anashim'] },
  'ועדת חסד': { money: 1, kvittel: 0, views: ['bait', 'hesed', 'anashim'] },
  'אב בית': { money: 0, kvittel: 0, views: ['bait', 'tifol', 'tzevet', 'medrash'] },
  'שדכן': { money: 0, kvittel: 0, views: ['bait', 'shiduch', 'anashim'] },
  'רואה חשבון': { money: 1, kvittel: 0, views: ['bait', 'ksafim', 'gviya', 'trumot'] },
};
let ROLE = { name: 'מנהל כללי', money: 1, kvittel: 1, views: '*' };
const allowed = (v) => ROLE.views === '*' || ROLE.views.includes(v) || DOSSIERS.includes(v);
const DOSSIERS = ['family', 'person', 'student', 'staffp', 'loanp', 'donorp', 'log', 'spec'];

const NAV = [
  ['bait', 'בית', '🏛'], ['anashim', 'אנשים', '👥'], ['hinuch', 'חינוך', '📚'], ['tzevet', 'צוות', '🧰'],
  ['gviya', 'גבייה', '₪'], ['trumot', 'תרומות', '❤'], ['ksafim', 'כספים', '📊'], ['medrash', 'בית המדרש', '🕯'],
  ['hatzer', 'החצר', '👑'], ['hesed', 'חסד', '🤝'], ['tifol', 'תפעול', '🔧'], ['shiduch', 'שידוכים', '💍'], ['tikshor', 'תקשורת', '✉'],
];

const parse = () => {
  const h = (location.hash || '#/bait').slice(2).split('/').filter(Boolean);
  return { view: h[0] || 'bait', params: h.slice(1) };
};
const go = (path) => { location.hash = '#/' + path; };

function chrome() {
  return `<a class="skip" href="#main">דלג לתוכן</a>
  <header class="bar">
    <a class="brand" href="#/bait"><span class="mark">מוסד</span></a>
    <button class="find" id="openPal"><span aria-hidden="true">⌕</span> חיפוש בכל המוסד <kbd>Ctrl K</kbd></button>
    <nav class="tabs" id="tabs" aria-label="אגפים"></nav>
    <div class="tools">
      <label class="sel"><span class="sr">תפקיד</span>
        <select id="role">${SPEC.roles.map(r => `<option${r === ROLE.name ? ' selected' : ''}>${r}</option>`).join('')}</select></label>
      <button id="logBtn" class="tbtn" aria-label="יומן פעולות">יומן</button>
      <button id="dens" class="tbtn" aria-label="צפיפות">צפיפות</button>
      <button id="theme" class="tbtn" aria-label="ערכת צבע">מצב</button>
    </div>
  </header>
  <main id="app" tabindex="-1"></main>
  <div id="pal" class="pal" hidden>
    <div class="palbox" role="dialog" aria-modal="true" aria-label="חיפוש בכל המוסד">
      <input id="palq" type="search" placeholder="שם משפחה · תלמיד · עובד · תורם · הלוואה · מסך · פעולה…"
             role="combobox" aria-expanded="true" aria-controls="palr" aria-autocomplete="list" autocomplete="off">
      <ul id="palr" role="listbox" aria-label="תוצאות"></ul>
      <p class="palfoot">↑↓ לבחירה · Enter לפתיחה · Esc לסגירה</p>
    </div>
  </div>`;
}

function tabs() {
  const cur = parse().view;
  document.getElementById('tabs').innerHTML = NAV.filter(([id]) => allowed(id))
    .map(([id, n, e]) => `<a href="#/${id}"${id === cur ? ' aria-current="page"' : ''}><i aria-hidden="true">${e}</i>${n}</a>`).join('');
}

let lastRoute = '';
function render() {
  const { view, params } = parse();
  const same = location.hash === lastRoute; lastRoute = location.hash;
  const keepY = window.scrollY;
  const app = document.getElementById('app');
  const v = VIEWS[view];
  if (!v) { app.dataset.v = 'x'; app.innerHTML = `<div class="pad"><h1>לא נמצא</h1><p class="ui-empty">אין מסך בשם «${esc(view)}».</p></div>`; return; }
  if (!allowed(view)) {
    app.dataset.v = 'x';
    app.innerHTML = `<div class="pad"><h1>${esc(v.name)}</h1>
      <div class="deny"><p><b>אין לך גישה למסך הזה בתפקיד «${esc(ROLE.name)}».</b></p>
      <p>המדיניות מגיעה מרשימת התפקידים של האפיון. החלף תפקיד בסרגל העליון כדי לראות.</p>
      <p class="dnote">מותר בתפקיד הזה: ${ROLE.views === '*' ? 'הכל' : ROLE.views.map(x => (NAV.find(n => n[0] === x) || [, x])[1]).join(' · ')}</p></div></div>`;
    return;
  }
  DERIVE = {}; dseq = 0;
  app.dataset.v = view;
  app.innerHTML = v.render(params);
  document.title = v.name + ' — מוסד';
  if (v.mount) v.mount(params);
  tabs();
  if (same) { window.scrollTo(0, keepY); }
  else { const h = app.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } window.scrollTo(0, 0); }
}

/* ---------- פלטת-הפקודות: מחפשת בכל הישויות, לא רק בשמות-מסכים ---------- */
let INDEX = null, palSel = 0, palRows = [];
function buildIndex() {
  if (INDEX) return INDEX;
  INDEX = [];
  NAV.forEach(([id, n]) => INDEX.push({ t: n, s: 'מסך', go: id, k: n }));
  INDEX.push({ t: 'יומן הפעולות', s: 'מסך', go: 'log', k: 'יומן' });
  INDEX.push({ t: 'האפיון · 181 ישויות', s: 'מסך', go: 'spec', k: 'אפיון ישויות שדות' });
  DB.families.forEach(f => INDEX.push({ t: f.name, s: f.city + ' · ' + f.kids.length + ' ילדים', go: 'family/' + f.id, k: f.name + ' ' + f.city }));
  DB.staff.forEach(s => INDEX.push({ t: nameOf(s.personId), s: 'צוות · ' + s.role, go: 'staffp/' + s.id, k: nameOf(s.personId) + ' ' + s.role }));
  DB.students.forEach(s => INDEX.push({ t: nameOf(s.personId), s: 'תלמיד · ' + cls(s.classId).name, go: 'student/' + s.id, k: nameOf(s.personId) }));
  DB.loans.forEach(l => INDEX.push({ t: 'הלוואה · ' + fam(l.familyId).name, s: l.purpose + ' · ' + l.stage, go: 'loanp/' + l.id, k: fam(l.familyId).name + ' הלוואה ' + l.purpose }));
  DB.donors.slice(0, 60).forEach(d => INDEX.push({ t: nameOf(d.personId), s: 'תורם · ' + d.city, go: 'donorp/' + d.id, k: nameOf(d.personId) + ' תורם' }));
  DB.routes.forEach(r => INDEX.push({ t: r.name, s: 'קו הסעה · ' + ridersOf(r) + ' נוסעים', go: 'tifol/' + r.id, k: r.name + ' הסעה' }));
  DB.classes.forEach(c => INDEX.push({ t: 'כיתה ' + c.name, s: c.students.length + ' תלמידים', go: 'hinuch/' + c.id, k: 'כיתה ' + c.name }));
  return INDEX;
}
function palOpen() {
  buildIndex();
  const p = document.getElementById('pal'); p.hidden = false;
  const q = document.getElementById('palq'); q.value = ''; palSearch(''); q.focus();
}
function palClose(restore = true) { document.getElementById('pal').hidden = true; if (restore) document.getElementById('openPal').focus(); }
function palSearch(t) {
  const q = t.trim();
  palRows = !q ? INDEX.filter(r => r.s === 'מסך').slice(0, 9)
    : INDEX.filter(r => r.k.includes(q)).slice(0, 40);
  palSel = 0;
  document.getElementById('palr').innerHTML = palRows.length
    ? palRows.map((r, i) => `<li role="option" id="pr${i}" aria-selected="${i === palSel}" data-go="${r.go}">
        <span class="t">${esc(r.t)}</span><span class="s">${esc(r.s)}</span></li>`).join('')
    : `<li class="none">אין תוצאה ל«${esc(q)}» מתוך ${num(INDEX.length)} רשומות</li>`;
  document.getElementById('palq').setAttribute('aria-activedescendant', palRows.length ? 'pr0' : '');
}
function palMove(d) {
  if (!palRows.length) return;
  palSel = (palSel + d + palRows.length) % palRows.length;
  const rows = [...document.querySelectorAll('#palr li')];
  rows.forEach((r, i) => r.setAttribute('aria-selected', String(i === palSel)));
  rows[palSel].scrollIntoView({ block: 'nearest' });
  document.getElementById('palq').setAttribute('aria-activedescendant', 'pr' + palSel);
}

/* ---------- אתחול ---------- */
function boot() {
  build();
  document.body.insertAdjacentHTML('afterbegin', chrome());
  const root = document.documentElement;

  document.getElementById('openPal').onclick = palOpen;
  document.getElementById('palq').addEventListener('input', e => palSearch(e.target.value));
  document.getElementById('palq').addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); palMove(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); palMove(-1); }
    else if (e.key === 'Enter' && palRows[palSel]) { e.preventDefault(); go(palRows[palSel].go); palClose(false); }
    else if (e.key === 'Escape') palClose();
  });
  document.getElementById('pal').addEventListener('click', e => {
    const li = e.target.closest('[data-go]'); if (li) { go(li.dataset.go); palClose(false); }
    else if (e.target.id === 'pal') palClose();
  });
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); document.getElementById('pal').hidden ? palOpen() : palClose(); }
    if (e.key === 'Escape' && !document.getElementById('pal').hidden) palClose();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { const l = undoLast(); if (l) toast('בוטל: ' + l, false); }
  });

  document.getElementById('role').onchange = e => {
    const p = POLICY[e.target.value] || { money: 0, kvittel: 0, views: ['bait'] };
    ROLE = { name: e.target.value, ...p };
    tabs(); render();
    toast('התפקיד הוחלף ל' + ROLE.name + (ROLE.money ? '' : ' · הסכומים הוסתרו'), false);
  };
  document.getElementById('theme').onclick = () => {
    const cur = root.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : cur === 'light' ? '' : 'dark';
    next ? root.setAttribute('data-theme', next) : root.removeAttribute('data-theme');
    toast('ערכת צבע: ' + (next === 'dark' ? 'כהה' : next === 'light' ? 'בהירה' : 'לפי המכשיר'), false);
  };
  document.getElementById('dens').onclick = () => {
    const d = root.getAttribute('data-density') === 'compact' ? '' : 'compact';
    d ? root.setAttribute('data-density', d) : root.removeAttribute('data-density');
    toast('צפיפות: ' + (d ? 'צפופה' : 'רגילה'), false);
  };
  document.getElementById('logBtn').onclick = () => go('log');

  /* «איך זה חושב» בכל מקום */
  document.addEventListener('click', e => {
    const w = e.target.closest('[data-why]'); if (w) { derive(w.dataset.why); }
  });

  onChange(() => { render(); });
  addEventListener('hashchange', render);
  render();
}
document.addEventListener('DOMContentLoaded', boot);
