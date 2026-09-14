#!/usr/bin/env node
// gen/wizard.mjs — האשף: התוכנית המלאה למוסד חסידי כעץ-מתגים (mosad.data.json). הכל דלוק כברירת-מחדל; כל אגף / ישות / שדה /
// שלבים / אוטומציה / פנים / חיבור — נדלק ונכבה. מה שדלוק ⇒ ספק מדויק (נכתב חי) ⇒ המחולל בונה אותו כאן בדפדפן (אותה ליבה של הסטודיו).
//   node gen/wizard.mjs  ⇒ gen/out/wizard.html
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readShelf } from './shelf.mjs';
import { LIVE_CSS, LIVE_FONTS } from './live.mjs';
import { loadLang } from './lang.mjs';
import { readDartShelf, proveDart, hasDart } from './prove-dart.mjs';
import { inventory } from './inventory.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => fs.readFileSync(path.join(HERE, f), 'utf8');
const strip = (src) => src.replace(/^import\s[^\n]*\n/gm, '').replace(/^export\s+(default\s+)?/gm, '');
const CORE = ['spec.mjs', 'sentence.mjs', 'prove.mjs', 'plan.mjs', 'render.mjs', 'live.mjs', 'engine.mjs'].map((f) => `// ══ ${f}\n${strip(read(f))}`).join('\n\n');
const NEEDS = JSON.parse(read('needs.data.json')).needs;
const DATA = JSON.parse(read('mosad.data.json'));
const shelf = readShelf().filter((a) => a.kind === 'fn').map(({ test, params, ...a }) => a);
const LANG = loadLang();
const dartShelf = hasDart() ? readDartShelf() : [];
const DART_PROOFS = {};
for (const need of NEEDS) if (dartShelf.length) { const d = proveDart(need, dartShelf); DART_PROOFS[need.id] = { tried: d.tried, proven: d.proven.map((a) => ({ name: a.name, fn: a.fn, file: a.file, params: a.params, ret: a.ret })), failed: d.failed, note: d.note || '' }; }
const INVENTORY = inventory();
const safe = (s) => s.replace(/<\/script/gi, '<\\/script').replace(/�/g, '\\uFFFD');
const counts = { deps: DATA.departments.length, ents: DATA.departments.reduce((a, d) => a + d.entities.length, 0), fields: DATA.departments.reduce((a, d) => a + d.entities.reduce((b, e) => b + e.fields.length, 0), 0), autos: DATA.automations.length, faces: DATA.faces.length, integ: DATA.integrations.length };

const html = `<title>אשף המוסד</title>
${LIVE_FONTS}
<style>
${LIVE_CSS}
.layout{display:grid;grid-template-columns:minmax(300px,1.1fr) minmax(320px,1fr);gap:16px}@media(max-width:900px){.layout{grid-template-columns:1fr}}
.tree{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px 12px;max-height:78vh;overflow:auto}
.tree details{margin:2px 0}.tree summary{cursor:pointer;display:flex;align-items:center;gap:8px;padding:3px 0}.tree summary .cnt{color:var(--mute);font-size:12.5px;margin-inline-start:auto}
.dep>summary{font-weight:600;font-size:15.5px;border-top:1px solid var(--line);padding-top:8px;margin-top:6px}.ent{margin-inline-start:18px}.ent>summary{font-weight:500}
.flds{margin-inline-start:24px;display:flex;flex-wrap:wrap;gap:4px 10px;padding:2px 0 6px}.flds label{font-size:13px;display:inline-flex;gap:4px;align-items:center;color:var(--ink)}.flds label.off{color:var(--mute);text-decoration:line-through}
.flds code{font-size:11px}.ctx{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px}.ctx label{display:flex;flex-direction:column;font-size:13px;color:var(--mute);gap:2px}.ctx select{font:inherit;color:var(--ink);background:var(--code);border:1px solid var(--line);border-radius:4px;padding:5px 8px}
.list label{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;padding:2px 0}.list label.off{color:var(--mute);text-decoration:line-through}
input[type=checkbox]{accent-color:var(--acc);width:15px;height:15px;flex:none;margin-top:2px}
.sticky{position:sticky;top:0}.spec{background:var(--code);border:1px solid var(--line);border-radius:6px;padding:10px 12px;max-height:38vh;overflow:auto;white-space:pre-wrap;font:13.5px/1.55 Heebo,Arial,sans-serif;direction:rtl}
.err{color:var(--none);white-space:pre-wrap;margin-top:8px}.note{font-size:13px;color:var(--mute)}
.tag{display:inline-block;font-size:11px;padding:0 6px;border-radius:99px;background:var(--code);color:var(--mute);margin-inline-start:4px}
</style>
<div class="wrap" dir="rtl" lang="he">
<div class="head"><div><h1>אשף המוסד</h1><div class="mute">כל התוכנית כמתגים. הכל דלוק. מה שדלוק נכתב כספק ונבנה כאן, בדפדפן, בלי בינה.</div></div>
<div class="stat"><div><b id="c-ents">${counts.ents}</b>ישויות</div><div><b id="c-fields">${counts.fields}</b>שדות</div><div><b>${counts.autos}</b>אוטומציות</div><div><b>${counts.faces}</b>פנים</div><div><b>${shelf.length}</b>אטומי-JS</div><div><b>${dartShelf.length}</b>Dart-בלבד</div></div></div>

<section class="step"><h2>0 · ההקשר <span class="n">לא שאלות — מתגים. כל בחירה משנה ברירות-מחדל; אפשר לדרוס כל אחת למטה</span></h2>
<div class="ctx" id="ctx"></div></section>

<div class="layout">
<div>
<section class="step"><h2>1 · האגפים <span class="n">אגף ⇒ ישויות ⇒ שדות ושלבים. כיבוי אגף מכבה הכל בתוכו</span></h2>
<div class="bar"><button class="ghost sm" id="all-on">הכל דלוק</button><button class="ghost sm" id="all-off">הכל כבוי</button><button class="ghost sm" id="open-all">פתח הכל</button><button class="ghost sm" id="close-all">סגור הכל</button><span class="note" id="tree-note"></span></div>
<div class="tree" id="tree"></div></section>
<section class="step"><h2>1½ · תפקידים <span class="n">מי רואה מה. «מי אני» באפליקציה</span></h2><div class="list" id="roles"></div></section>
<section class="step"><h2>2 · אוטומציות <span class="n">מה קורה לבד. כל אחת נדלקת ונכבית, ולכל אחת «מי מקבל»</span></h2><div class="list" id="autos"></div></section>
<section class="step"><h2>3 · הפנים <span class="n">מסכים לפי תפקיד</span></h2><div class="list" id="faces"></div></section>
<section class="step"><h2>4 · חיבורים חיצוניים <span class="n">שקעים: ספק חיצוני, מפתחות אצל המוסד. המערכת מכינה, הספק מבצע</span></h2><div class="list" id="integ"></div></section>
</div>
<div><div class="sticky">
<section class="step"><h2>הספק <span class="n">נכתב חי מהמתגים. זה הקלט היחיד של המחולל</span></h2>
<div class="spec" id="spec"></div>
<div class="bar"><button id="build">בנה את מה שדלוק</button><button class="ghost" id="copy">העתק ספק</button><span class="mute" id="status"></span></div>
<div class="err" id="err" hidden></div>
<p class="note">לאתר-Flutter מלא: שומרים את הספק ב-<code>gen/specs/&lt;שם&gt;.txt</code> ו-push, או Actions ⇒ gen ⇒ Run workflow. הבנייה כאן = HTML בדפדפן.</p></section>
</div></div>
</div>
<div id="out"></div>
</div>
<script>
${safe(CORE)}
const NEEDS = ${safe(JSON.stringify(NEEDS))};
const SHELF = ${safe(JSON.stringify(shelf))};
const LANG = ${safe(JSON.stringify(LANG))};
const DART_PROOFS = ${safe(JSON.stringify(DART_PROOFS))};
const DART_COUNT = ${dartShelf.length};
const INVENTORY = ${safe(JSON.stringify(INVENTORY))};
const DATA = ${safe(JSON.stringify(DATA))};
const $ = (id) => document.getElementById(id);
const KEY = 'gen-wizard:v1';
// esc — כבר מוגדר בליבה (render.mjs)
// ── מצב: הכל דלוק כברירת-מחדל; רק מה שכובה נשמר
let state = { off: {}, ctx: {} };
try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.off) state = s; } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
const isOn = (k) => !state.off[k];
const set = (k, on) => { if (on) delete state.off[k]; else state.off[k] = 1; };
const kDep = (d) => 'd:' + d.name, kEnt = (d, e) => 'e:' + d.name + '/' + e.name, kFld = (d, e, f) => 'f:' + d.name + '/' + e.name + '/' + f.name, kStg = (d, e) => 's:' + d.name + '/' + e.name;
const kAuto = (i) => 'a:' + i, kFace = (i) => 'p:' + i, kInt = (i) => 'i:' + i;
// ── הקשר ⇒ ברירות-מחדל (דאטה, לא קוד: אילו מתגים כבים לכל בחירה)
const CTX_RULES = {
  country: { 'ארצות הברית': ['d:כספים ורגולציה'], 'אנגליה': ['d:כספים ורגולציה'], 'בלגיה': ['d:כספים ורגולציה'] },
  court: { 'רק גבאות ונסיעות': ['e:החצר/קבלת קהל', 'e:החצר/קוויטל', 'e:החצר/תשובה מהרבי'], 'לא': ['d:החצר'] },
  server: { 'מקומי בלבד': [] },
  phone: { 'טלפון כשר (SMS וקו קולי)': ['p:5'], 'סמארטפון': [] },
};
function applyCtx(id, v) {
  const rules = CTX_RULES[id] || {}; for (const opts of Object.values(rules)) for (const k of opts) set(k, true);
  for (const k of (rules[v] || [])) set(k, false);
}
// ── שדה ⇒ טקסט-ספק
const fieldText = (f) => f.shape === 'formula' ? f.name + '=' + f.formula : f.name + (f.shape === 'number' ? '(' + (f.min ?? 0) + '..' + (f.max ?? 1000000) + ')' : f.shape === 'enum' ? '{' + f.values.join('|') + '}' : f.shape === 'date' ? '[תאריך]' : f.shape === 'phone' ? '[טלפון]' : f.shape === 'id' ? '[מזהה]' : f.shape === 'count' ? '[כמות]' : '') + (f.required ? '*' : '');
const kRole = (i) => 'r:' + i, kGrd = (d, e) => 'g:' + d.name + '/' + e.name;
function specText() {
  const lines = ['אפליקציה: מוסד חסידי'];
  const dash = [];
  if (state.ctx.server !== 'מקומי בלבד') lines.push('# שרת: ענן — במסלול-Flutter של המחצב (לא ב-HTML)');
  for (const d of DATA.departments) { if (!isOn(kDep(d))) continue;
    for (const e of d.entities) { if (!isOn(kEnt(d, e))) continue;
      const fs = e.fields.filter((f) => isOn(kFld(d, e, f)));
      if (!fs.length) continue;
      if (!fs.some((f) => f.required)) fs[0] = { ...fs[0], required: true };
      const stOn = e.stages.length && isOn(kStg(d, e));
      const guards = stOn && isOn(kGrd(d, e)) ? (e.guards || []).filter((g) => fs.some((f) => f.name === g.cond.split(/\s*[><=]/)[0].trim())) : [];
      lines.push('ישות ' + e.name + ' עם ' + fs.map(fieldText).join(', ') + (stOn ? ' | שלבים: ' + e.stages.join(', ') : '') + (guards.length ? ' | מעברים: ' + guards.map((g) => g.stage + ': ' + g.cond).join(', ') : '') + ((e.forbidden || []).length ? ' | אסור: ' + e.forbidden.join(', ') : '') + (e.moment ? ' | הרגע: ' + e.moment.replace(/[|,]/g, ' ') : '') + ((e.screens || []).length ? ' | מסך: ' + e.screens.join(', ') : '') + (e.fix ? ' | תיקון: ' + e.fix.who + (e.fix.days ? ' עד ' + e.fix.days + ' ימים' : '') : ''));
      for (const f of fs) { if (f.shape === 'number' || f.shape === 'formula') dash.push('סכום(' + e.name + '.' + f.name + ')'); if (f.shape === 'enum' && f.values.length <= 6) dash.push('מונה(' + e.name + '.' + f.name + ')'); }
    } }
  const onEnts = new Set(lines.filter((l) => l.startsWith('ישות ')).map((l) => l.slice(5, l.indexOf(' עם '))));
  (DATA.roles || []).forEach((r, i) => { if (!isOn(kRole(i))) return; const ents = r.all ? null : r.ents.filter((n) => onEnts.has(n)); if (r.all || ents.length) lines.push('תפקיד ' + r.name + ': ' + (r.all ? 'הכל' : ents.join(', '))); });
  if (dash.length) lines.push('לוח בקרה עם ' + dash.slice(0, 40).join(', '));
  return lines.join('\\n');
}
function counts() { let ents = 0, fields = 0; for (const d of DATA.departments) if (isOn(kDep(d))) for (const e of d.entities) if (isOn(kEnt(d, e))) { const n = e.fields.filter((f) => isOn(kFld(d, e, f))).length; if (n) { ents++; fields += n; } } return { ents, fields }; }
// ── ציור
function renderCtx() {
  $('ctx').innerHTML = DATA.context.map((c) => '<label>' + esc(c.q) + '<select data-ctx="' + c.id + '">' + c.options.map((o) => '<option ' + ((state.ctx[c.id] || c.def) === o ? 'selected' : '') + '>' + esc(o) + '</option>').join('') + '</select></label>').join('');
}
function renderTree() {
  const wasOpen = new Set([...document.querySelectorAll('#tree details.ent[open]')].map((d) => d.querySelector('input').dataset.k));
  $('tree').innerHTML = DATA.departments.map((d) => {
    const on = isOn(kDep(d));
    return '<details class="dep" open><summary><input type="checkbox" data-k="' + esc(kDep(d)) + '" ' + (on ? 'checked' : '') + '> ' + esc(d.name) + '<span class="cnt">' + d.entities.length + ' ישויות</span></summary>' +
      d.entities.map((e) => { const eon = on && isOn(kEnt(d, e));
        return '<details class="ent"><summary><input type="checkbox" data-k="' + esc(kEnt(d, e)) + '" ' + (isOn(kEnt(d, e)) ? 'checked' : '') + ' ' + (on ? '' : 'disabled') + '> ' + esc(e.name) + (e.stages.length ? '<span class="tag">' + e.stages.length + ' שלבים</span>' : '') + '<span class="cnt">' + e.fields.length + ' שדות</span></summary><div class="flds">' +
          e.fields.map((f) => '<label class="' + (isOn(kFld(d, e, f)) ? '' : 'off') + '"><input type="checkbox" data-k="' + esc(kFld(d, e, f)) + '" ' + (isOn(kFld(d, e, f)) ? 'checked' : '') + ' ' + (eon ? '' : 'disabled') + '>' + esc(f.name) + (f.ref ? '<code>⇒ ' + esc(f.ref) + '</code>' : f.shape !== 'text' ? '<code>' + esc(f.shape === 'enum' ? '{' + f.values.join('|') + '}' : f.shape === 'number' ? 'מספר' : f.shape === 'date' ? 'תאריך' : 'טלפון') + '</code>' : '') + '</label>').join('') +
          (e.stages.length ? '<label class="' + (isOn(kStg(d, e)) ? '' : 'off') + '"><input type="checkbox" data-k="' + esc(kStg(d, e)) + '" ' + (isOn(kStg(d, e)) ? 'checked' : '') + ' ' + (eon ? '' : 'disabled') + '>שלבים: ' + esc(e.stages.join(' → ')) + '</label>' : '') +
          ((e.guards || []).length ? '<label class="' + (isOn(kGrd(d, e)) ? '' : 'off') + '"><input type="checkbox" data-k="' + esc(kGrd(d, e)) + '" ' + (isOn(kGrd(d, e)) ? 'checked' : '') + ' ' + (eon ? '' : 'disabled') + '>מעברים: ' + esc(e.guards.map((g) => g.stage + ' ⇐ ' + g.cond).join(' · ')) + '</label>' : '') + '</div></details>'; }).join('') + '</details>';
  }).join('');
  for (const d of document.querySelectorAll('#tree details.ent')) if (wasOpen.has(d.querySelector('input').dataset.k)) d.open = true;
}
const renderList = (id, items, kf, label) => { $(id).innerHTML = items.map((it, i) => '<label class="' + (isOn(kf(i)) ? '' : 'off') + '"><input type="checkbox" data-k="' + esc(kf(i)) + '" ' + (isOn(kf(i)) ? 'checked' : '') + '><span>' + label(it) + '</span></label>').join(''); };
function renderAll() {
  renderCtx(); renderTree();
  renderList('autos', DATA.automations, kAuto, (a) => esc(a));
  renderList('roles', DATA.roles || [], kRole, (r) => '<b>' + esc(r.name) + '</b> <span class="mute">' + (r.all ? 'הכל' : esc(r.ents.join(', '))) + '</span>');
  renderList('faces', DATA.faces, kFace, (f) => '<b>' + esc(f.name) + '</b> <span class="mute">' + esc(f.what) + '</span>');
  renderList('integ', DATA.integrations, kInt, (f) => '<b>' + esc(f.name) + '</b> <span class="mute">' + esc(f.what) + '</span><span class="tag">שקע</span>');
  refresh();
}
function refresh() {
  const c = counts(); $('c-ents').textContent = c.ents; $('c-fields').textContent = c.fields;
  $('spec').textContent = specText();
  const offN = Object.keys(state.off).length; $('tree-note').textContent = offN ? offN + ' מתגים כבויים' : 'הכל דלוק (מקסימום)';
  save();
}
document.body.addEventListener('change', (ev) => {
  const t = ev.target;
  if (t.dataset && t.dataset.ctx) { state.ctx[t.dataset.ctx] = t.value; applyCtx(t.dataset.ctx, t.value); renderAll(); return; }
  if (t.dataset && t.dataset.k) { set(t.dataset.k, t.checked); if (t.dataset.k.startsWith('d:') || t.dataset.k.startsWith('e:')) renderTree(); else { const lab = t.closest('label'); if (lab) lab.classList.toggle('off', !t.checked); } refresh(); }
});
$('all-on').onclick = () => { state.off = {}; renderAll(); };
$('all-off').onclick = () => { for (const d of DATA.departments) set(kDep(d), false); DATA.automations.forEach((_, i) => set(kAuto(i), false)); DATA.faces.forEach((_, i) => set(kFace(i), false)); DATA.integrations.forEach((_, i) => set(kInt(i), false)); renderAll(); };
$('open-all').onclick = () => document.querySelectorAll('#tree details').forEach((d) => d.open = true);
$('close-all').onclick = () => document.querySelectorAll('#tree details.ent').forEach((d) => d.open = false);
$('copy').onclick = async () => { try { await navigator.clipboard.writeText(specText()); $('status').textContent = 'הספק הועתק'; } catch { $('status').textContent = 'לא ניתן להעתיק כאן — סמן והעתק ידנית'; } };
$('build').onclick = async () => {
  $('err').hidden = true; $('status').textContent = 'בונה…';
  const text = specText().split('\\n').filter((l) => !l.startsWith('#')).join('\\n');
  try {
    const { report, app } = await runGenerator({ text, slug: 'mosad', shelf: SHELF, NEEDS, LANG, dartProver: (need) => DART_PROOFS[need.id] || null, dartCount: DART_COUNT, inventory: INVENTORY, now: () => performance.now(),
      onStep: (s) => { if (s.step === 'proof') $('status').textContent = 'הוכחה: ' + s.proof.need + ' — נוסו ' + s.proof.tried + ', עברו ' + s.proof.proven.length; } });
    report.meta.ms = Math.round(report.meta.ms);
    $('out').innerHTML = renderLiveBody(report, app);
    $('status').textContent = 'נבנה ב-' + report.meta.ms + 'ms · ' + report.entities.length + ' ישויות · ' + report.atoms.length + ' אטומים מוכחים';
    $('out').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) { $('status').textContent = ''; $('err').textContent = 'הספק לא התקבל: ' + e.message; $('err').hidden = false; }
};
for (const c of DATA.context) if (!state.ctx[c.id]) state.ctx[c.id] = c.def;
renderAll();
</script>`;
fs.mkdirSync(path.join(HERE, 'out'), { recursive: true });
fs.writeFileSync(path.join(HERE, 'out', 'wizard.html'), html);
console.log(`✓ gen/out/wizard.html · ${(html.length / 1024 / 1024).toFixed(2)}MB · ${counts.deps} אגפים · ${counts.ents} ישויות · ${counts.fields} שדות · ${counts.autos} אוטומציות`);
