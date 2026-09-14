// gen/render.mjs — הרכבה. מקבל ספק + אטומים-מוכחים ופולט אפליקציה רצה בקובץ-HTML יחיד.
// האטומים מוטבעים כלשונם (אפס import פנימי — לכן אפשר). הדבק כאן הוא מבני בלבד:
// טופס לפי צורת-השדה, טבלה, אחסון-מקומי, וקריאה לאטום-המוכח לפי המתכון (recipe) של הצורך.
import fs from 'node:fs';

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jstr = (v) => JSON.stringify(v).replace(/<\//g, '<\\/');

/** מקור-האטום כפי שהוא, בלי export, עם עטיפת-T זהה לזו של בדיקת-החוזה שלו. */
export function inlineAtom(a) {
  const src = fs.readFileSync(a.file, 'utf8').replace(/^export\s+/m, '');
  const pure = a.fn;
  const wrap = a.hasT
    ? `const ${pure}__T = ${jstr(a.T ?? {})};\nconst ${pure}__call = (...x) => ${pure}(...x, ...Array(Math.max(0, ${a.n} - x.length)).fill(undefined), ${pure}__T);`
    : `const ${pure}__call = (...x) => ${pure}(...x);`;
  return `// ── אטום ${a.name} (${a.file.replace(/.*\/new\//, 'new/')})\n${src.trim()}\n${wrap}`;
}

const INPUT = {
  text: (f, id) => `<input id="${id}" type="text" ${f.required ? 'required' : ''}>`,
  phone: (f, id) => `<input id="${id}" type="tel" inputmode="tel" ${f.required ? 'required' : ''}>`,
  number: (f, id) => `<input id="${id}" type="number" min="${f.min}" max="${f.max}" step="any" ${f.required ? 'required' : ''}>`,
  date: (f, id) => `<input id="${id}" type="date" ${f.required ? 'required' : ''}>`,
  enum: (f, id) => `<select id="${id}" ${f.required ? 'required' : ''}>${f.values.map((v) => `<option>${esc(v)}</option>`).join('')}</select>`,
};

/**
 * chosen: Map needId ⇒ atom (רק מוכחים). plan: [{needId, entity, field, kind: 'column'|'kpi'|'search'}]
 */
export function renderApp(spec, chosen, plan, meta) {
  const atoms = [...new Set([...chosen.values()])];
  const atomJs = atoms.map(inlineAtom).join('\n\n');
  const callOf = (needId) => (chosen.has(needId) ? chosen.get(needId).fn + '__call' : null);

  const entityHtml = spec.entities.map((e, ei) => {
    const ekey = 'e' + ei;
    const form = e.fields.map((f, fi) => `<label>${esc(f.name)}${f.required ? ' <b>*</b>' : ''}${INPUT[f.shape](f, `${ekey}_f${fi}`)}</label>`).join('');
    const head = e.fields.map((f) => `<th>${esc(f.name)}</th>`).join('') + (e.fields.some((f) => f.shape === 'date') && callOf('days-since') ? '<th>ימים</th>' : '') + '<th></th>';
    return `<section class="entity" data-entity="${ekey}">
  <h2>${esc(e.name)} <small id="${ekey}_n"></small></h2>
  <form id="${ekey}_form" class="row">${form}<button type="submit">הוסף ${esc(e.name)}</button></form>
  <div class="tbl"><table><thead><tr>${head}</tr></thead><tbody id="${ekey}_body"></tbody></table></div>
</section>`;
  }).join('\n');

  const kpiHtml = plan.filter((p) => p.kind === 'kpi').map((p, i) => `<div class="kpi" id="kpi${i}"><span class="v">—</span><span class="l">${esc(p.label)}</span></div>`).join('');
  const hasSearch = plan.some((p) => p.kind === 'search');

  const schema = spec.entities.map((e) => ({ name: e.name, fields: e.fields.map((f) => ({ name: f.name, shape: f.shape, required: f.required })) }));
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
.entity{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:12px;margin:12px 0}
form.row{display:flex;flex-wrap:wrap;gap:8px;align-items:end;margin-bottom:10px}label{display:flex;flex-direction:column;font-size:13px;color:var(--mute);gap:2px}
input,select{font:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:4px;padding:6px 8px;min-width:120px}
button{font:inherit;background:var(--acc);color:var(--acc-ink);border:0;border-radius:4px;padding:7px 14px;cursor:pointer}button.x{background:transparent;color:var(--mute);padding:2px 6px}
.tbl{overflow-x:auto}table{border-collapse:collapse;width:100%}th,td{text-align:right;padding:6px 8px;border-bottom:1px solid var(--line);white-space:nowrap}th{color:var(--mute);font-weight:500;font-size:13px}
td.num{font-variant-numeric:tabular-nums}.search{min-width:220px}
.foot{color:var(--mute);font-size:12px;margin-top:16px}
</style></head><body>
<div class="top"><div><h1>${esc(spec.app)}</h1><div class="foot" style="margin:0">נבנה על-ידי המחולל · ${atoms.length} אטומים מוכחים · הנתונים נשמרים בדפדפן זה</div></div>
${hasSearch ? '<input class="search" id="q" type="search" placeholder="חיפוש בכל השדות…">' : ''}</div>
<div class="kpis">${kpiHtml}</div>
${entityHtml}
<div class="foot">אטומים: ${atoms.map((a) => a.name).join(' · ')}</div>
<script>
${atomJs}

// ── דבק מבני (מחולל): סכמה, אחסון, טופס, טבלה, מדדים
const SCHEMA = ${jstr(schema)};
const KPIS = ${jstr(kpis)};
const KEY = ${jstr('gen:' + meta.slug)};
const FN = {${atoms.map((a) => a.fn + '__call').join(', ')}};
const CALL = { money: ${callOf('money')}, fmtDate: ${callOf('fmt-date')}, daysSince: ${callOf('days-since')}, phone: ${callOf('phone-format')}, norm: ${callOf('norm-search')}, sum: ${callOf('sum')}, countBy: ${callOf('count-by')} };
const today = () => new Date().toISOString().slice(0, 10);
let DATA; try { DATA = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { DATA = null; }
if (!DATA) DATA = SCHEMA.map(() => []);
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(DATA)); } catch {} };
const el = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
function show(f, v) {
  if (v === '' || v == null) return '';
  if (f.shape === 'number' && CALL.money) return CALL.money(Number(v));
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
function paint() {
  SCHEMA.forEach((e, ei) => {
    const rows = rowsOf(ei);
    el('e' + ei + '_n').textContent = rows.length ? rows.length + ' רשומות' : 'אין רשומות עדיין';
    const hasDays = e.fields.some((f) => f.shape === 'date') && CALL.daysSince;
    el('e' + ei + '_body').innerHTML = rows.map((r) => {
      const idx = DATA[ei].indexOf(r);
      const cells = e.fields.map((f, fi) => '<td class="' + (f.shape === 'number' ? 'num' : '') + '">' + show(f, r[fi]) + '</td>').join('');
      const d = hasDays ? '<td class="num">' + e.fields.map((f, fi) => (f.shape === 'date' && r[fi] ? CALL.daysSince(r[fi], today()) : '')).filter((x) => x !== '').join(' / ') + '</td>' : '';
      return '<tr>' + cells + d + '<td><button class="x" data-del="' + ei + ':' + idx + '" title="מחק">✕</button></td></tr>';
    }).join('');
  });
  KPIS.forEach((k, i) => {
    const box = el('kpi' + i), v = box.querySelector('.v');
    if (!k.call) { box.classList.add('none'); v.textContent = 'אין אטום מוכח'; return; }
    const rows = DATA[k.entity];
    const fn = FN[k.call];
    if (k.op === 'סכום') v.textContent = CALL.money ? CALL.money(fn(rows, (r) => Number(r[k.field]) || 0)) : fn(rows, (r) => Number(r[k.field]) || 0);
    else if (k.op === 'מונה') { const c = fn(rows, (r) => r[k.field]); v.textContent = c.length ? c.map(([a, n]) => esc(a) + ' ' + n).join(' · ') : '0'; }
  });
}
SCHEMA.forEach((e, ei) => {
  el('e' + ei + '_form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const row = e.fields.map((f, fi) => el('e' + ei + '_f' + fi).value);
    DATA[ei].push(row); save(); ev.target.reset(); paint();
  });
});
document.body.addEventListener('click', (ev) => {
  const b = ev.target.closest('[data-del]'); if (!b) return;
  const [ei, i] = b.dataset.del.split(':').map(Number);
  DATA[ei].splice(i, 1); save(); paint();
});
if (el('q')) el('q').addEventListener('input', paint);
paint();
</script></body></html>`;
}
