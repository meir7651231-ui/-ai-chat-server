// gen/render.mjs — הרכבה. מקבל ספק + אטומים-מוכחים ופולט אפליקציה רצה בקובץ-HTML יחיד.
// האטומים מוטבעים כלשונם (אפס import פנימי — לכן אפשר). הדבק כאן הוא מבני בלבד:
// טופס לפי צורת-השדה, טבלה, אחסון-מקומי, וקריאה לאטום-המוכח לפי המתכון (recipe) של הצורך.

import { SKIN_CSS, FONTS, BIDI_SHAPES } from './skin.mjs';

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jstr = (v) => JSON.stringify(v).replace(/<\//g, '<\\/');

/** מקור-האטום כפי שהוא, בלי export, עם עטיפת-T זהה לזו של בדיקת-החוזה שלו. */
export function inlineAtom(a) {
  const src = a.src;
  const pure = a.fn;
  const wrap = a.hasT
    ? `const ${pure}__T = ${jstr(a.T ?? {})};\nconst ${pure}__call = (...x) => ${pure}(...x, ...Array(Math.max(0, ${a.n} - x.length)).fill(undefined), ${pure}__T);`
    : `const ${pure}__call = (...x) => ${pure}(...x);`;
  return `// ── אטום ${a.name} (${a.file})\n${src.trim()}\n${wrap}`;
}

const INPUT = {
  text: (f, id) => `<input id="${id}" type="text" ${f.required ? 'required' : ''}>`,
  phone: (f, id) => `<input id="${id}" type="tel" inputmode="tel" ${f.required ? 'required' : ''}>`,
  number: (f, id) => `<input id="${id}" type="number" min="${f.min}" max="${f.max}" step="any" ${f.required ? 'required' : ''}>`,
  date: (f, id) => `<input id="${id}" type="date" ${f.required ? 'required' : ''}>`,
  enum: (f, id) => `<select id="${id}" ${f.required ? 'required' : ''}>${f.values.map((v) => `<option>${esc(v)}</option>`).join('')}</select>`,
};
// קשר ⇒ בחירה מרשימת הרשומות של ישות-היעד (השדה הראשון שלה); ממולא בזמן-ריצה
INPUT.count = (f, id) => `<input id="${id}" type="number" min="0" step="1" ${f.required ? 'required' : ''}>`;
INPUT.id = (f, id) => `<input id="${id}" type="text" ${f.required ? 'required' : ''}>`;
INPUT.formula = (f, id) => `<input id="${id}" type="text" value="=${esc(f.formula)}" readonly title="מחושב">`;
const inputOf = (f, id, spec) => (f.ref ? `<select id="${id}" data-ref="${spec.entities.findIndex((e) => e.name === f.ref)}" ${f.required ? 'required' : ''}><option value="">—</option></select>` : INPUT[f.shape](f, id));

/**
 * chosen: Map needId ⇒ atom (רק מוכחים). plan: [{needId, entity, field, kind: 'column'|'kpi'|'search'}]
 */
export function renderApp(spec, chosen, plan, meta) {
  const atoms = [...new Set([...chosen.values()])];
  const atomJs = atoms.map(inlineAtom).join('\n\n');
  const callOf = (needId) => (chosen.has(needId) ? chosen.get(needId).fn + '__call' : null);

  const entityHtml = spec.entities.map((e, ei) => {
    const ekey = 'e' + ei;
    const form = e.fields.map((f, fi) => `<label>${esc(f.name)}${f.required ? ' <b>*</b>' : ''}${inputOf(f, `${ekey}_f${fi}`, spec)}</label>`).join('');
    const head = e.fields.map((f) => `<th>${esc(f.name)}</th>`).join('') + (e.stages && e.stages.length ? '<th>שלב</th>' + (callOf('days-since') ? '<th>בשלב</th>' : '') : '') + (e.fields.some((f) => f.shape === 'date') && callOf('days-since') ? '<th>ימים</th>' : '') + '<th></th>';
    return `<section class="entity" data-entity="${ekey}">
  <h2>${esc(e.name)} <small id="${ekey}_n"></small></h2>${e.moment ? `<div class="foot" style="margin:0 0 6px">הרגע: ${esc(e.moment)}${e.screens && e.screens.length ? ' · מסך: ' + esc(e.screens.join(', ')) : ''}</div>` : ''}${e.forbidden && e.forbidden.length ? `<div class="foot" style="margin:0 0 6px">אסור: ${e.forbidden.map((x) => `<b>${esc(x)}</b>`).join(' · ')}</div>` : ''}${e.fix ? `<div class="foot" style="margin:0 0 6px">תיקון בדיעבד: ${esc(e.fix.who)}${e.fix.days ? ' עד ' + e.fix.days + ' ימים מהרישום' : ''}; אחר כך נעול</div>` : ''}
  <form id="${ekey}_form" class="row">${form}<button type="submit">הוסף ${esc(e.name)}</button></form>${callOf('csv') && callOf('csv-escape') ? `<div class="tools noprint"><button class="ghost" data-csv="${ei}" title="מייצא בדיוק את מה שרואים: הסינון, התפקיד והסדר הנוכחיים">⭳ ייצוא לאקסל (CSV)</button></div>` : ''}
  <div class="tbl"><table><thead><tr>${head}</tr></thead><tbody id="${ekey}_body"></tbody></table></div>
</section>`;
  }).join('\n');

  const kpiHtml = plan.filter((p) => p.kind === 'kpi').map((p, i) => `<div class="kpi" id="kpi${i}"><bdi class="v">—</bdi><span class="l">${esc(p.label)}</span></div>`).join('');
  const hasSearch = plan.some((p) => p.kind === 'search');

  const schema = spec.entities.map((e) => ({ name: e.name, stages: e.stages || [], guards: e.guards || [], forbidden: e.forbidden || [], fix: e.fix || null, fields: e.fields.map((f) => ({ name: f.name, shape: f.shape, required: f.required, formula: f.formula || null, ref: f.ref ? spec.entities.findIndex((x) => x.name === f.ref) : -1 })) }));
  const roles = spec.roles || [];
  const EXP = meta.expiryWords || ['תוקף'], EXP_DAYS = meta.expiryWarnDays || 30;
  const kpis = plan.filter((p) => p.kind === 'kpi').map((p) => ({ op: p.op, need: p.needId, entity: spec.entities.findIndex((e) => e.name === p.entity), field: spec.entities.find((e) => e.name === p.entity).fields.findIndex((f) => f.name === p.field), call: callOf(p.needId) }));

  return `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(spec.app)}</title>
${FONTS}
<style>
${SKIN_CSS()}
.top{display:flex;flex-wrap:wrap;gap:var(--s3);align-items:baseline;justify-content:space-between}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(calc(var(--s1) * 40),1fr));gap:var(--s3);margin:var(--s4) 0}
.kpi{background:var(--card);border:1px solid var(--line);padding:var(--s3);border-radius:var(--r-md)}
.kpi .v{display:block;font:var(--w-screen) var(--t-screen)/var(--lh-screen) var(--font-he);font-variant-numeric:tabular-nums}
.kpi .l{color:var(--mute);font-size:var(--t-meta)}
.kpi.none .v{color:var(--warn);font-size:var(--t-dense)}
.exp{font-size:var(--t-micro);padding:0 var(--s2);border-radius:var(--r-pill);background:var(--code)}
.exp.bad{background:var(--err);color:var(--hi)}.exp.warn{background:var(--warn);color:var(--on-a)}
th,td{white-space:nowrap}
.search{min-width:calc(var(--s1) * 55)}
.tools{display:flex;gap:var(--s2);margin-bottom:var(--s2)}
.tbl table{min-width:100%}
th:first-child,td:first-child{position:sticky;inset-inline-start:0;background:var(--card);z-index:2}
thead th:first-child{z-index:3}
.foot{color:var(--mute);font-size:var(--t-meta);margin-top:var(--s4)}
</style></head><body>
<div class="top"><div><h1>${esc(spec.app)}</h1><div class="foot" style="margin:0">נבנה על-ידי המחולל · ${atoms.length} אטומים מוכחים · הנתונים נשמרים בדפדפן זה</div></div>
${hasSearch ? '<input class="search" id="q" type="search" placeholder="חיפוש בכל השדות…">' : ''}<label class="noprint">צפיפות <select id="density"><option value="compact">צפוף</option><option value="cozy" selected>רגיל</option><option value="roomy">מרווח</option></select></label>${(spec.roles || []).length ? `<label>מי אני <select id="role"><option value="">הכל</option>${spec.roles.map((r) => `<option>${esc(r.name)}</option>`).join('')}</select></label>` : ''}</div>
<div class="kpis">${kpiHtml}${spec.entities.some((e) => e.fields.some((f) => f.shape === 'date' && (meta.expiryWords || ['תוקף']).some((w) => f.name.includes(w)))) && callOf('days-since') ? '<div class="kpi" id="kpi-exp"><bdi class="v">—</bdi><span class="l">פג תוקף · פג בקרוב</span></div>' : ''}</div>
${entityHtml}
<div class="foot">אטומים: ${atoms.map((a) => a.name).join(' · ')}</div>
<script>
${atomJs}

// ── דבק מבני (מחולל): סכמה, אחסון, טופס, טבלה, מדדים
const SCHEMA = ${jstr(schema)};
const KPIS = ${jstr(kpis)};
const ROLES = ${jstr(roles)};
const EXP_WORDS = ${jstr(EXP)}, EXP_DAYS = ${EXP_DAYS};
const KEY = ${jstr('gen:' + meta.slug)};
const FN = {${atoms.map((a) => a.fn + '__call').join(', ')}};
const CALL = { money: ${callOf('money')}, fmtDate: ${callOf('fmt-date')}, daysSince: ${callOf('days-since')}, phone: ${callOf('phone-format')}, norm: ${callOf('norm-search')}, sum: ${callOf('sum')}, countBy: ${callOf('count-by')}, csv: ${callOf('csv')}, csvEsc: ${callOf('csv-escape')} };
const today = () => new Date().toISOString().slice(0, 10);
// אחסון: מוגש משרת (http) ⇒ הרשומות אצל השרת (/api/data, אותה צורה: מערך-לישות לפי סדר-הסכמה); נפתח כקובץ ⇒ localStorage. אפס פירוש — רק מאיפה הדף הגיע
const API = /^https?:$/.test(location.protocol) ? new URL('api/data', location.href).pathname : '';   // יחסי לדף: / ⇒ /api/data · /build/7/app ⇒ /build/7/api/data
let DATA; try { DATA = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { DATA = null; }
if (!DATA) DATA = SCHEMA.map(() => []);
let synced = '';
const save = () => { if (API) { synced = JSON.stringify(DATA); fetch(API, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: synced }).catch(() => {}); return; } try { localStorage.setItem(KEY, JSON.stringify(DATA)); } catch {} };
async function pull() { if (!API) return; try { const r = await fetch(API, { cache: 'no-store' }); if (!r.ok) return; const t = await r.text(); if (t === synced) return; const d = JSON.parse(t); if (!Array.isArray(d) || d.length !== SCHEMA.length) return; synced = t; DATA = d; paint(); } catch {} }
if (API) { pull(); setInterval(pull, 3000); }
const el = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function calc(e, r, f) { // נוסחה על שדות אותה רשומה: שמות ⇒ ערכים מספריים, חשבון בלבד
  let expr = ' ' + f.formula + ' ';
  const sorted = e.fields.map((g, i) => ({ g, i })).filter((x) => x.g.name !== f.name).sort((a, b) => b.g.name.length - a.g.name.length);
  for (const { g, i } of sorted) expr = expr.split(g.name).join('(' + (Number(r[i]) || 0) + ')');
  if (/[^0-9.+\\-*/()\\s]/.test(expr)) return NaN;
  try { return Function('return (' + expr + ')')(); } catch { return NaN; }
}
function expiry(f, v) {
  if (!CALL.daysSince || f.shape !== 'date' || !v || !EXP_WORDS.some((w) => f.name.includes(w))) return '';
  const d = -CALL.daysSince(v, today());
  return d < 0 ? ' <b class="exp bad">פג</b>' : d <= EXP_DAYS ? ' <b class="exp warn">פג בעוד ' + d + ' ימים</b>' : '';
}
const BIDI = ${jstr(BIDI_SHAPES)};   // מהדאטה (skin.data.json) — מוזרק בזמן-פליטה, לא רשימה ביד
const bidi = (s) => '<bdi dir="ltr">' + s + '</bdi>';   // UAX#9: ערך בסדר-לטיני (₪8,000 · 052- · 15/10 · -31) מבודד ומוכרז ltr — סימן/מטבע נשארים בצד הנכון
function show(f, v, e, r) {
  if (f.shape === 'formula' && e && r) { const n = calc(e, r, f); return Number.isFinite(n) ? bidi(CALL.money ? CALL.money(n) : String(n)) : '—'; }
  if (v === '' || v == null) return '';
  if (f.shape === 'date') return bidi(CALL.fmtDate ? CALL.fmtDate(v) : esc(v)) + expiry(f, v);
  if (f.shape === 'number' && CALL.money) return bidi(CALL.money(Number(v)));
  if (f.shape === 'count') return bidi(esc(v));
  if (f.shape === 'date' && CALL.fmtDate) return CALL.fmtDate(v);
  if (f.shape === 'phone' && CALL.phone) return bidi(CALL.phone(v));
  return BIDI.includes(f.shape) ? bidi(esc(v)) : esc(v);
}
function rowsOf(ei) {
  const q = el('q') ? el('q').value : '';
  const rows = DATA[ei];
  if (!q || !CALL.norm) return rows;
  const nq = CALL.norm(q);
  return rows.filter((r) => SCHEMA[ei].fields.some((f, fi) => CALL.norm(r[fi]).includes(nq)));
}
let role = '';
// צפיפות: העדפה אישית שנשמרת (המתג משנה טוקן, לא כלל-CSS)
const DKEY = KEY + ':density';
function setDensity(v) { document.documentElement.setAttribute('data-density', v); try { localStorage.setItem(DKEY, v); } catch {} }
// ייצוא: בדיוק התצוגה שעל המסך (כותרות + שורות גלויות), דרך אטומי-המדף המוכחים
function exportCsv(ei) {
  if (!CALL.csv || !CALL.csvEsc) return;
  const sec = document.querySelector('[data-entity="e' + ei + '"]');
  const head = [...sec.querySelectorAll('thead th')].map((th) => th.textContent.trim()).filter((x, i, a) => i < a.length - 1);
  const body = [...sec.querySelectorAll('tbody tr')].map((tr) => [...tr.children].slice(0, head.length).map((td) => td.textContent.replace(/\s*›\s*$/, '').trim()));
  const text = CALL.csv([head, ...body], CALL.csvEsc);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
  a.download = SCHEMA[ei].name + '.csv';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function paint() {
  role = el('role') ? el('role').value : '';
  const allowed = role ? (ROLES.find((x) => x.name === role) || { ents: [] }) : null;
  SCHEMA.forEach((e, ei) => {
    const sec = document.querySelector('[data-entity="e' + ei + '"]');
    if (sec) sec.hidden = !!allowed && !allowed.all && !allowed.ents.includes(e.name);
    const rows = rowsOf(ei);
    el('e' + ei + '_n').textContent = rows.length ? rows.length + ' רשומות' : 'אין רשומות עדיין';
    const hasDays = e.fields.some((f) => f.shape === 'date') && CALL.daysSince;
    el('e' + ei + '_body').innerHTML = rows.map((r) => {
      const idx = DATA[ei].indexOf(r);
      const cells = e.fields.map((f, fi) => '<td class="' + (f.shape === 'number' || f.shape === 'formula' ? 'num' : '') + '">' + show(f, r[fi], e, r) + '</td>').join('');
      const n = e.fields.length;
      const st = e.stages.length ? '<td>' + esc(r[n] || e.stages[0]) + (e.stages.indexOf(r[n] || e.stages[0]) < e.stages.length - 1 ? ' <button class="x" data-adv="' + ei + ':' + idx + '" title="לשלב הבא">›</button>' : '') + '</td>' + (CALL.daysSince ? '<td class="num">' + (r[n + 1] ? CALL.daysSince(r[n + 1], today()) + ' ימים' : '') + '</td>' : '') : '';
      const d = hasDays ? '<td class="num">' + bidi(e.fields.map((f, fi) => (f.shape === 'date' && r[fi] ? CALL.daysSince(r[fi], today()) : '')).filter((x) => x !== '').join(' / ')) + '</td>' : '';
      const noDel = e.forbidden.some((x) => /^מחיקה$/.test(x));
      const created = r[n + 2] || r[n + 1] || '';
      const fixOk = e.fix ? ((role === '' || role === e.fix.who) && (!e.fix.days || !CALL.daysSince || !created || CALL.daysSince(created, today()) <= e.fix.days)) : true;
      const editBtn = e.fix ? (fixOk ? '<button class="x" data-edit="' + ei + ':' + idx + '" title="תקן">✎</button>' : '<span class="x" title="נעול לתיקון">🔒</span>') : '';
      return '<tr>' + cells + st + d + '<td>' + editBtn + (noDel ? '' : '<button class="x" data-del="' + ei + ':' + idx + '" title="מחק">✕</button>') + '</td></tr>';
    }).join('');
  });
  // קשרים: רשימות-הבחירה מתמלאות מהרשומות של ישות-היעד
  document.querySelectorAll('select[data-ref]').forEach((sel) => { const ti = Number(sel.dataset.ref); const cur = sel.value; sel.innerHTML = '<option value="">—</option>' + DATA[ti].map((r) => '<option>' + esc(r[0]) + '</option>').join(''); sel.value = cur; });
  if (el('kpi-exp') && CALL.daysSince) { let bad = 0, soon = 0; SCHEMA.forEach((e, ei) => e.fields.forEach((f, fi) => { if (f.shape === 'date' && EXP_WORDS.some((w) => f.name.includes(w))) for (const r of DATA[ei]) if (r[fi]) { const d = -CALL.daysSince(r[fi], today()); if (d < 0) bad++; else if (d <= EXP_DAYS) soon++; } })); el('kpi-exp').querySelector('.v').textContent = bad + ' · ' + soon; }
  KPIS.forEach((k, i) => {
    const box = el('kpi' + i), v = box.querySelector('.v');
    if (!k.call) { box.classList.add('none'); v.textContent = 'אין אטום מוכח'; return; }
    const rows = DATA[k.entity];
    const fn = FN[k.call];
    const fdef = SCHEMA[k.entity].fields[k.field]; const get = fdef.shape === 'formula' ? ((r) => { const n = calc(SCHEMA[k.entity], r, fdef); return Number.isFinite(n) ? n : 0; }) : ((r) => Number(r[k.field]) || 0);
    if (k.op === 'סכום') v.textContent = CALL.money ? CALL.money(fn(rows, get)) : fn(rows, get);
    else if (k.op === 'מונה') { const c = fn(rows, (r) => r[k.field]); v.textContent = c.length ? c.map(([a, n]) => esc(a) + ' ' + n).join(' · ') : '0'; }
  });
}
SCHEMA.forEach((e, ei) => {
  el('e' + ei + '_form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const form = ev.target; const editing = form.dataset.editing;
    if (editing !== undefined && editing !== '') { const r = DATA[ei][Number(editing)]; e.fields.forEach((f, fi) => { if (f.shape !== 'formula') r[fi] = el('e' + ei + '_f' + fi).value; }); delete form.dataset.editing; form.querySelector('button[type=submit]').textContent = 'הוסף ' + e.name; save(); form.reset(); paint(); return; }
    const row = e.fields.map((f, fi) => el('e' + ei + '_f' + fi).value);
    if (e.stages.length) row.push(e.stages[0], today()); else row.push('', '');
    row.push(today()); // תאריך רישום — למדיניות-תיקון
    DATA[ei].push(row); save(); ev.target.reset(); paint();
  });
});
// מעבר מותנה: «שדה» = מלא · «שדה > 5» · «שדה >= שדה2» — כמו compileGuard של המחצב
function guardOk(e, r, cond) {
  const idx = (name) => e.fields.findIndex((f) => f.name === name.trim());
  const val = (i) => { const f = e.fields[i]; return f.shape === 'formula' ? calc(e, r, f) : Number(r[i]) || 0; };
  const m = cond.match(/^(.+?)\\s*(>=|<=|>|<|=)\\s*(.+)$/);
  if (m) { const li = idx(m[1]); if (li < 0) return true; const rhs = /^-?\\d+(\\.\\d+)?$/.test(m[3].trim()) ? Number(m[3]) : (idx(m[3]) >= 0 ? val(idx(m[3])) : NaN); if (Number.isNaN(rhs)) return true; const l = val(li); return m[2] === '>=' ? l >= rhs : m[2] === '<=' ? l <= rhs : m[2] === '>' ? l > rhs : m[2] === '<' ? l < rhs : l === rhs; }
  const bi = idx(cond); return bi < 0 ? true : String(r[bi] ?? '').trim() !== '';
}
document.body.addEventListener('click', (ev) => {
  const a = ev.target.closest('[data-adv]');
  if (a) { const [ei, i] = a.dataset.adv.split(':').map(Number); const e = SCHEMA[ei]; const st = e.stages; const r = DATA[ei][i]; const n = e.fields.length; const k = st.indexOf(r[n] || st[0]);
    if (k < st.length - 1) { const next = st[k + 1]; const g = e.guards.find((x) => x.stage === next);
      if (g && !guardOk(e, r, g.cond)) { alert('אי אפשר לעבור ל«' + next + '»: ' + g.cond); return; }
      r[n] = next; r[n + 1] = today(); save(); paint(); } return; }
  const ed = ev.target.closest('[data-edit]');
  if (ed) { const [ei, i] = ed.dataset.edit.split(':').map(Number); const e = SCHEMA[ei]; const r = DATA[ei][i]; e.fields.forEach((f, fi) => { if (f.shape !== 'formula') { const inp = el('e' + ei + '_f' + fi); if (inp) inp.value = r[fi] ?? ''; } }); const form = el('e' + ei + '_form'); form.dataset.editing = String(i); form.querySelector('button[type=submit]').textContent = 'שמור תיקון'; form.scrollIntoView({ block: 'center' }); return; }
  const b = ev.target.closest('[data-del]'); if (!b) return;
  const [ei, i] = b.dataset.del.split(':').map(Number);
  DATA[ei].splice(i, 1); save(); paint();
});
if (el('q')) el('q').addEventListener('input', paint);
if (el('role')) el('role').addEventListener('change', paint);
if (el('density')) { let d = 'cozy'; try { d = localStorage.getItem(DKEY) || 'cozy'; } catch {} el('density').value = d; setDensity(d); el('density').addEventListener('change', (ev) => setDensity(ev.target.value)); }
document.addEventListener('click', (ev) => { const b = ev.target.closest('[data-csv]'); if (b) exportCsv(Number(b.dataset.csv)); });

paint();
</script></body></html>`;
}
