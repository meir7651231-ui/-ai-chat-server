/* ===========================================================================
   כלי-התצוגה המשותפים. שלושה עקרונות:
   1. כל מספר עובר דרך kpi()/money() — ואיתו ההסבר איך הוא חושב (אין מספר «סתם»).
   2. כסף נחסם לפי תפקיד במקום אחד, לא בכל מסך.
   3. RTL: כל ערך שנקרא משמאל-לימין עטוף ב-bdi.
   =========================================================================== */

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ltr = (s) => '<bdi dir="ltr">' + esc(s) + '</bdi>';
const nis = (n) => '₪' + Math.round(n).toLocaleString('he-IL');
const money = (n) => ROLE.money ? '<bdi dir="ltr">' + nis(n) + '</bdi>' : '<span class="masked" title="הסכומים חסויים לתפקיד ' + ROLE.name + '">•••</span>';
const kmoney = (n) => ROLE.money ? '<bdi dir="ltr">₪' + Math.round(n / 1000).toLocaleString('he-IL') + 'K</bdi>' : '<span class="masked">•••</span>';
const num = (n) => '<bdi dir="ltr">' + Number(n).toLocaleString('he-IL') + '</bdi>';

/* kpi — הערך + מאיפה הוא. הכפתור פותח את החישוב עצמו. */
let DERIVE = {};
let dseq = 0;
function kpi(value, label, how) {
  const id = 'k' + (dseq++);
  DERIVE[id] = how;
  return `<span class="kpi"><b>${value}</b><button class="why" data-why="${id}" aria-label="איך חושב: ${esc(label)}">?</button><span>${esc(label)}</span></span>`;
}
function derive(id) {
  const how = DERIVE[id]; if (!how) return;
  dialog('איך המספר הזה חושב', `<p class="dtext">${how}</p>
    <p class="dnote">כל מספר במערכת נגזר מהמחסן בזמן הצגה. אין מספרים כתובים במסך.</p>`);
}

/* SVG — כל ציור מקבל תווית נגישה ומספרים אמיתיים */
function ring(pct, color, size = 104, thick = 12, label = '') {
  const r = (size - thick) / 2, c = 2 * Math.PI * r, on = Math.max(0, Math.min(100, pct)) / 100 * c;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(label || pct + ' אחוז')}">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(--sunk)" stroke-width="${thick}"></circle>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="var(${color})" stroke-width="${thick}" stroke-linecap="round"
      stroke-dasharray="${on.toFixed(1)} ${(c - on).toFixed(1)}" transform="rotate(-90 ${size / 2} ${size / 2})"></circle></svg>`;
}
function spark(vals, color, label) {
  const max = Math.max(...vals), min = Math.min(...vals), w = 220, h = 60, pad = 4;
  const x = i => 4 + i * ((w - 8) / (vals.length - 1)), y = v => h - pad - (v - min) / (max - min || 1) * (h - pad * 2 - 4);
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" role="img" aria-label="${esc(label)}" preserveAspectRatio="none">
    <polyline fill="none" stroke="var(${color})" stroke-width="2.5" stroke-linejoin="round" points="${vals.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1)).join(' ')}"></polyline>
    <circle cx="${x(vals.length - 1).toFixed(1)}" cy="${y(vals[vals.length - 1]).toFixed(1)}" r="3.5" fill="var(${color})"></circle></svg>`;
}
function bars(items, label) {
  const max = Math.max(...items.map(i => i[1])) || 1;
  return `<div class="ui-bars" role="img" aria-label="${esc(label)}">${items.map(([k, v, bad]) =>
    `<i class="${bad ? 'low' : ''}" style="height:${Math.max(6, v / max * 100)}%"><b>${v}</b><u>${esc(k)}</u></i>`).join('')}</div>`;
}
function progress(pct, color = '--ok') {
  return `<div class="ui-track"><i style="width:${Math.max(0, Math.min(100, pct))}%;background:var(${color})"></i></div>`;
}
const tag = (t, kind = '') => `<span class="tag ${kind}">${esc(t)}</span>`;
const link = (href, text, cls = '') => `<a class="lk ${cls}" href="#/${href}">${esc(text)}</a>`;
const empty = (msg) => `<p class="ui-empty">${esc(msg)}</p>`;
const initials = (s) => s.replace('משפחת ', '').slice(0, 2);
const colorOf = (id) => 'c' + (1 + (String(id).split('').reduce((a, ch) => a + ch.charCodeAt(0), 0) % 6));
const avatar = (text, id, size = 34) => `<span class="av" style="width:${size}px;height:${size}px;font-size:${Math.round(size / 2.7)}px;background:var(--${colorOf(id)}-soft);color:var(--${colorOf(id)})">${esc(initials(text))}</span>`;

/* דיאלוג עם מלכודת-מיקוד ו-Esc */
let lastFocus = null;
function dialog(title, html, actions = '') {
  close();
  lastFocus = document.activeElement;
  const d = document.createElement('div');
  d.className = 'ui-dialog'; d.id = 'dlg';
  d.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="dlgt">
    <div class="dh"><h2 id="dlgt">${esc(title)}</h2><button class="x" aria-label="סגירה">✕</button></div>
    <div class="db">${html}</div>${actions ? `<div class="da">${actions}</div>` : ''}</div>`;
  document.body.appendChild(d);
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('.x')) close(); });
  const f = d.querySelectorAll('button,a,input,select,textarea');
  (f[1] || f[0]).focus();
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape') { close(); return; }
    if (e.key !== 'Tab') return;
    const list = [...d.querySelectorAll('button,a,input,select,textarea')].filter(x => !x.disabled);
    const i = list.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); list[list.length - 1].focus(); }
    else if (!e.shiftKey && i === list.length - 1) { e.preventDefault(); list[0].focus(); }
  });
  function close() { const o = document.getElementById('dlg'); if (o) o.remove(); if (lastFocus) lastFocus.focus(); }
  return close;
}

/* הודעת-פעולה עם «בטל» — כל שינוי במערכת מקבל אחת */
let toastT = null;
function toast(msg, undoable = true) {
  const old = document.getElementById('toast'); if (old) old.remove();
  const t = document.createElement('div');
  t.id = 'toast'; t.className = 'ui-toast'; t.setAttribute('role', 'status');
  t.innerHTML = `<span>${esc(msg)}</span>${undoable ? '<button id="undoBtn">בטל</button>' : ''}`;
  document.body.appendChild(t);
  clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 7000);
  const b = document.getElementById('undoBtn');
  if (b) b.onclick = () => { const l = undoLast(); t.remove(); if (l) toast('בוטל: ' + l, false); };
}

/* חסימה לפי כלל מהאפיון — הטקסט הוא של המוסד, לא שלי */
function blocked(rule, dept, ent) {
  dialog('הפעולה נחסמה', `<p class="dtext">הכלל שנחסם עליו:</p>
    <p class="rule">«${esc(rule)}»</p>
    <p class="dnote">הכלל הזה יושב באפיון המוסד תחת <b>${esc(dept)} · ${esc(ent)}</b> ברשימת האיסורים,
    והמערכת קוראת אותו משם — הוא לא נכתב בקוד המסך.</p>`);
}

const sortBy = (arr, f, dir = 1) => [...arr].sort((a, b) => (f(a) > f(b) ? 1 : f(a) < f(b) ? -1 : 0) * dir);
