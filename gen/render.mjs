// gen/render.mjs — הרכבה. מקבל ספק + אטומים-מוכחים ופולט אפליקציה רצה בקובץ-HTML יחיד.
// האטומים מוטבעים כלשונם (אפס import פנימי — לכן אפשר). הדבק כאן הוא מבני בלבד:
// טופס לפי צורת-השדה, טבלה, אחסון-מקומי, וקריאה לאטום-המוכח לפי המתכון (recipe) של הצורך.

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
  <form id="${ekey}_form" class="row">${form}<button type="submit">הוסף ${esc(e.name)}</button></form>
  <div class="tbl"><table><thead><tr>${head}</tr></thead><tbody id="${ekey}_body"></tbody></table></div>
</section>`;
  }).join('\n');

  const kpiHtml = plan.filter((p) => p.kind === 'kpi').map((p, i) => `<div class="kpi" id="kpi${i}"><span class="v">—</span><span class="l">${esc(p.label)}</span></div>`).join('');
  const hasSearch = plan.some((p) => p.kind === 'search');

  const schema = spec.entities.map((e) => ({ name: e.name, stages: e.stages || [], guards: e.guards || [], forbidden: e.forbidden || [], fix: e.fix || null, fields: e.fields.map((f) => ({ name: f.name, shape: f.shape, required: f.required, formula: f.formula || null, ref: f.ref ? spec.entities.findIndex((x) => x.name === f.ref) : -1 })) }));
  const roles = spec.roles || [];
  const EXP = meta.expiryWords || ['תוקף'], EXP_DAYS = meta.expiryWarnDays || 30;
  const kpis = plan.filter((p) => p.kind === 'kpi').map((p) => ({ op: p.op, need: p.needId, entity: spec.entities.findIndex((e) => e.name === p.entity), field: spec.entities.find((e) => e.name === p.entity).fields.findIndex((f) => f.name === p.field), call: callOf(p.needId) }));

  return `<!doctype html>
<html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(spec.app)}</title>
<style>
:root{--bg:#f7f6f2;--ink:#1d1c19;--mute:#6b675e;--line:#d9d5cb;--card:#ffffff;--acc:#1f5f5b;--acc-ink:#ffffff;--warn:#8a3b12}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#16171a;--ink:#ece9e1;--mute:#a19c90;--line:#33363c;--card:#1f2125;--acc:#5cbcb4;--acc-ink:#0f1f1e}}
:root[data-theme=dark]{--bg:#16171a;--ink:#ece9e1;--mute:#a19c90;--line:#33363c;--card:#1f2125;--acc:#5cbcb4;--acc-ink:#0f1f1e}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 Heebo,Arial,sans-serif;padding-block:16px;padding-inline:16px}
h1{font-size:22px;margin:0 0 4px}h2{font-size:17px;margin:0 0 8px}h2 small{color:var(--mute);font-weight:400}
.top{display:flex;flex-wrap:wrap;gap:12px;align-items:baseline;justify-content:space-between}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin:14px 0}
.kpi{background:var(--card);border:1px solid var(--line);padding:10px 12px;border-radius:6px}.kpi .v{display:block;font-size:22px;font-variant-numeric:tabular-nums;font-weight:600}.kpi .l{color:var(--mute);font-size:13px}
.kpi.none .v{color:var(--warn);font-size:14px}
.exp{font-size:11px;padding:0 5px;border-radius:99px;background:var(--line)}.exp.bad{background:#b3261e;color:#fff}.exp.warn{background:#e0a100;color:#1d1c19}
.entity{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:12px;margin:12px 0}
form.row{display:flex;flex-wrap:wrap;gap:8px;align-items:end;margin-bottom:10px}label{display:flex;flex-direction:column;font-size:13px;color:var(--mute);gap:2px}
input,select{font:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:4px;padding:6px 8px;min-width:120px}
button{font:inherit;background:var(--acc);color:var(--acc-ink);border:0;border-radius:4px;padding:7px 14px;cursor:pointer}button.x{background:transparent;color:var(--mute);padding:2px 6px}
.tbl{overflow-x:auto}table{border-collapse:collapse;width:100%}th,td{text-align:right;padding:6px 8px;border-bottom:1px solid var(--line);white-space:nowrap}th{color:var(--mute);font-weight:500;font-size:13px}
td.num{font-variant-numeric:tabular-nums}.search{min-width:220px}
.foot{color:var(--mute);font-size:12px;margin-top:16px}
</style></head><body>
<div class="top"><div><h1>${esc(spec.app)}</h1><div class="foot" style="margin:0">נבנה על-ידי המחולל · ${atoms.length} אטומים מוכחים · הנתונים נשמרים בדפדפן זה</div></div>
${hasSearch ? '<input class="search" id="q" type="search" placeholder="חיפוש בכל השדות…">' : ''}${(spec.roles || []).length ? `<label>מי אני <select id="role"><option value="">הכל</option>${spec.roles.map((r) => `<option>${esc(r.name)}</option>`).join('')}</select></label>` : ''}</div>
<div class="kpis">${kpiHtml}${spec.entities.some((e) => e.fields.some((f) => f.shape === 'date' && (meta.expiryWords || ['תוקף']).some((w) => f.name.includes(w)))) && callOf('days-since') ? '<div class="kpi" id="kpi-exp"><span class="v">—</span><span class="l">פג תוקף · פג בקרוב</span></div>' : ''}</div>
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
const CALL = { money: ${callOf('money')}, fmtDate: ${callOf('fmt-date')}, daysSince: ${callOf('days-since')}, phone: ${callOf('phone-format')}, norm: ${callOf('norm-search')}, sum: ${callOf('sum')}, countBy: ${callOf('count-by')} };
const today = () => new Date().toISOString().slice(0, 10);
let DATA; try { DATA = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { DATA = null; }
if (!DATA) DATA = SCHEMA.map(() => []);
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(DATA)); } catch {} };
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
function show(f, v, e, r) {
  if (f.shape === 'formula' && e && r) { const n = calc(e, r, f); return Number.isFinite(n) ? (CALL.money ? CALL.money(n) : String(n)) : '—'; }
  if (v === '' || v == null) return '';
  if (f.shape === 'date') return (CALL.fmtDate ? CALL.fmtDate(v) : esc(v)) + expiry(f, v);
  if (f.shape === 'number' && CALL.money) return CALL.money(Number(v));
  if (f.shape === 'count') return esc(v);
  if (f.shape === 'date' && CALL.fmtDate) return CALL.fmtDate(v);
  if (f.shape === 'phone' && CALL.phone) return CALL.phone(v);
  return esc(v);
}
function rowsOf(ei) {
  const q = el('q') ? el('q').value : '';
  const rows = DATA[ei];
  if (!q || !CALL.norm) return rows;
  const nq = CALL.norm(q);
  return rows.filter((r) => SCHEMA[ei].fields.some((f, fi) => CALL.norm(r[fi]).includes(nq)));
}
let role = '';
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
      const d = hasDays ? '<td class="num">' + e.fields.map((f, fi) => (f.shape === 'date' && r[fi] ? CALL.daysSince(r[fi], today()) : '')).filter((x) => x !== '').join(' / ') + '</td>' : '';
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
paint();
</script></body></html>`;
}
