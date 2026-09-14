#!/usr/bin/env node
// gen/pass.mjs — המחולל עובר אגף-אגף על mosad.data.json: בונה כל אגף (HTML + מסלול-Flutter), ולכל אגף מדווח מה נבנה,
// מה לא הוכח, ומה אפשר לשפר — הכל נגזר מכנית מהספק ומהדוח, לא מדעה. פלט: gen/out/pass/{report.json, report.md, index.html}
//   node gen/pass.mjs [--no-flutter]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readShelf } from './shelf.mjs';
import { runGenerator } from './engine.mjs';
import { loadLang } from './lang.mjs';
import { readDartShelf, proveDart, hasDart } from './prove-dart.mjs';
import { buildFlutter } from './flutter.mjs';
import { esc } from './render.mjs';
import { applyLenses, LENSES, isComputedName } from './lenses.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const NEEDS = JSON.parse(fs.readFileSync(path.join(HERE, 'needs.data.json'), 'utf8')).needs;
const DATA = JSON.parse(fs.readFileSync(path.join(HERE, 'mosad.data.json'), 'utf8'));
const LANG = loadLang();
const withFlutter = !process.argv.includes('--no-flutter');
const shelf = readShelf();
const dartShelf = hasDart() ? readDartShelf() : [];
const dartCache = {};
const dartProver = dartShelf.length ? (need) => (dartCache[need.id] ||= proveDart(need, dartShelf)) : null;

const fieldText = (f) => f.shape === 'formula' ? f.name + '=' + f.formula : f.name + (f.shape === 'number' ? `(${f.min ?? 0}..${f.max ?? 1000000})` : f.shape === 'enum' ? `{${f.values.join('|')}}` : f.shape === 'date' ? '[תאריך]' : f.shape === 'phone' ? '[טלפון]' : f.shape === 'id' ? '[מזהה]' : f.shape === 'count' ? '[כמות]' : '') + (f.required ? '*' : '');
function specOf(dep, roles = []) {
  const lines = [`אפליקציה: ${dep.app || dep.name}`];
  const dash = [];
  const names = new Set(dep.entities.map((e) => e.name));
  for (const e of dep.entities) {
    const fs_ = e.fields.map((f, i) => ({ ...f, required: f.required || (i === 0 && !e.fields.some((x) => x.required)) }));
    lines.push(`ישות ${e.name} עם ${fs_.map(fieldText).join(', ')}${e.stages.length ? ` | שלבים: ${e.stages.join(', ')}` : ''}${(e.guards || []).length ? ` | מעברים: ${e.guards.map((g) => g.stage + ': ' + g.cond).join(', ')}` : ''}${(e.forbidden || []).length ? ` | אסור: ${e.forbidden.join(', ')}` : ''}${e.moment ? ` | הרגע: ${e.moment.replace(/[|,]/g, ' ')}` : ''}${(e.screens || []).length ? ` | מסך: ${e.screens.join(', ')}` : ''}${e.fix ? ` | תיקון: ${e.fix.who}${e.fix.days ? ' עד ' + e.fix.days + ' ימים' : ''}` : ''}`);
    for (const f of fs_) { if (f.shape === 'number' || f.shape === 'formula') dash.push(`סכום(${e.name}.${f.name})`); if (f.shape === 'count') dash.push(`סכום(${e.name}.${f.name})`); if (f.shape === 'enum' && f.values.length <= 6) dash.push(`מונה(${e.name}.${f.name})`); }
  }
  for (const r of roles) { const ents = r.all ? null : r.ents.filter((n) => names.has(n)); if (r.all || ents.length) lines.push(`תפקיד ${r.name}: ${r.all ? 'הכל' : ents.join(', ')}`); }
  if (dash.length) lines.push('לוח בקרה עם ' + dash.slice(0, 40).join(', '));
  return lines.join('\n');
}
const allEntityNames = new Set(DATA.departments.flatMap((d) => d.entities.map((e) => e.name)));
const hint = (name, key) => (LANG[key] || []).some((w) => name.split(/\s+/).includes(w));

/** שיפורים — כל אחד כלל מכני על הספק/הדוח, עם ספירה */
function improvements(dep, report) {
  const out = [];
  const add = (kind, what, why, fix) => out.push({ kind, what, why, fix });
  const names = new Set(dep.entities.map((e) => e.name));
  for (const e of dep.entities) {
    for (const f of e.fields) {
      if (f.shape === 'text' && !f.ref && allEntityNames.has(f.name) && !names.has(f.name) && dep !== UNIFIED) add('קשר חוצה-אגף', `${e.name}.${f.name}`, `שדה-טקסט ששמו ישות באגף אחר («${f.name}»)`, 'באפליקציה-המאוחדת (שרת: ענן) זה קשר; באגף לבד — הקלדה. לבנות את המוסד כאפליקציה אחת, לא 12');
      if (f.shape === 'text' && !f.ref && hint(f.name, 'typeDate')) add('צורה חסרה', `${e.name}.${f.name}`, 'שם עם רמז-תאריך אך טקסט', 'להוסיף [תאריך] או מילה לרמזי-הדאטה');
      if (f.shape === 'text' && !f.ref && hint(f.name, 'typePhone')) add('צורה חסרה', `${e.name}.${f.name}`, 'רמז-טלפון אך טקסט', '[טלפון]');
      if (f.shape === 'enum' && f.values.length === 1) add('ערך יחיד', `${e.name}.${f.name}`, `ערך-מנוי עם ערך אחד {${f.values[0]}}`, 'זה סף/קבוע — צריך «כלל» עם ערך, לא שדה-בחירה');
      if (f.shape === 'number' && /^(מספר|קוד|מזהה)$/.test(f.name)) add('מספר שאינו כמות', `${e.name}.${f.name}`, 'מזהה נספר כסכום בלוח-הבקרה', 'צורה חדשה: [מזהה] — לא נסכם');
      if (isComputedName(f.name) && f.shape !== 'enum' && f.shape !== 'formula' && !e.fields.some((g) => g.shape === 'formula' && g.name === f.name)) add('נוסחה', `${e.name}.${f.name}`, 'שדה שהוא חישוב, מוזן ביד', 'להוסיף «שדה = א פחות ב» במשפט');
      if (f.shape === 'formula' && !/[-+*/]/.test(f.formula)) add('נוסחה ריקה', `${e.name}.${f.name}`, `«${f.formula}» — העתקת שדה, לא חישוב`, 'הנוסחה צריכה שדה מישות אחרת (החזרים) — חישוב חוצה-ישויות עוד לא במחולל');
    }
    const statusEnum = e.fields.find((f) => f.shape === 'enum' && /^(מצב|סטטוס|שלב)$/.test(f.name));
    if (statusEnum && e.stages.length) add('כפילות מצב/שלבים', e.name, `גם שדה «${statusEnum.name}» וגם שלבים`, 'אחד מהם; שלבים אם יש מעבר קדימה');
    if (!e.stages.length && statusEnum) add('שלבים במקום מצב', e.name, `«${statusEnum.name}» עם ערכים שנראים כמסע`, '| שלבים: … ⇒ פס-שלבים, «באיחור», «היום»');
    if (e.stages.length && !e.fields.some((f) => f.shape === 'date')) add('שלבים בלי תאריך', e.name, 'אין תאריך ⇒ אין «באיחור» ואין «היום»', 'להוסיף תאריך-יעד או תאריך-שלב');
    if (e.stages.length >= 3 && !(e.guards || []).length) add('מעברים', e.name, `${e.stages.length} שלבים בלי אף תנאי-מעבר`, '«אפשר לעבור ל-X רק אם Y» במשפט');
    if (e.stages.length >= 4 && (e.guards || []).length === 1) add('מעבר יחיד', e.name, `${e.stages.length} שלבים ורק מעבר אחד מותנה`, 'עוד תנאי על השלבים הקריטיים');
    if (e.fields.length < 3) add('ישות דלה', e.name, `${e.fields.length} שדות`, 'להשלים שדות או למזג לישות-האם');
    if (!e.fields.some((f) => f.required)) add('אין חובה', e.name, 'אף שדה-חובה', 'לפחות שדה-זיהוי אחד חובה');
    if (!e.fields.some((f) => f.ref) && e.fields.some((f) => /^(אדם|משפחה|תלמיד|עובד|תורם)$/.test(f.name)) && dep !== UNIFIED) add('קשר לא נפתר', e.name, 'שדה בשם ישות-יסוד בלי קשר (הישות באגף אחר)', 'כמו «קשר חוצה-אגף»');
  }
  const dup = dep === UNIFIED ? [] : dep.entities.map((e) => e.name).filter((n) => DATA.departments.filter((d) => d.entities.some((x) => x.name === n)).length > 1);
  for (const n of new Set(dup)) add('שם כפול בין אגפים', n, 'אותה ישות בשני אגפים', 'אחת, עם קשר');
  for (const e of dep.entities) if (!(e.forbidden || []).length) add('אין «אסור»', e.name, 'אין רשימת-איסורים', '«אסור למחוק X» / «ב-X אסור: א, ב» במשפט, או חבילת-ידע');
  for (const p of report.proofs) if (!p.chosen) add('אין אטום מוכח', p.need, `${p.tried} אטומי-JS נוסו, אף אחד לא עבר`, 'לחצוב אטום מהאימפריה או להוסיף דוגמאות');
  if (!report.plan.some((p) => p.kind === 'kpi')) add('אין מדדים', dep.name, 'לוח-בקרה ריק', 'שדה-מספר או ערך-מנוי אחד לפחות');
  if (!report.roles || !report.roles.length) add('הרשאות', dep.name, 'אין «תפקיד» בספק — כל מסך פתוח לכולם', '«רק X רואה Y» במשפט');
  else { const covered = new Set(report.roles.flatMap((r) => r.all ? dep.entities.map((e) => e.name) : r.ents)); const un = dep.entities.filter((e) => !covered.has(e.name)); if (un.length) add('ישות בלי תפקיד', dep.name, `${un.length} ישויות שאף תפקיד לא מכסה: ${un.slice(0, 4).map((e) => e.name).join(', ')}`, 'לשייך לתפקיד או «מנהל כללי: הכל»'); }
  add('תוכן הודעות', dep.name, 'אין [הודעה]/תוכן — התזכורות בלי נוסח', '[הודעה] בחירה = [תוכן קבוצה] בשלוש שפות');
  return out;
}

const outDir = path.join(HERE, 'out', 'pass'); fs.mkdirSync(outDir, { recursive: true });
const results = [];
const ROLES = DATA.roles || [];
const UNIFIED = { name: 'המוסד כולו (ספק מאוחד)', app: 'מוסד חסידי', entities: DATA.departments.flatMap((d) => d.entities) };
for (const dep of [...DATA.departments, UNIFIED]) {
  const t0 = Date.now();
  const specText = specOf(dep, ROLES);
  const slug = 'pass-' + (results.length + 1);
  const { report, app } = await runGenerator({ text: specText, slug, shelf, NEEDS, LANG, dartProver, dartCount: dartShelf.length });
  const fl = withFlutter && dep !== UNIFIED ? buildFlutter(specText, slug) : null;
  const imp = improvements(dep, report);
  const kpiEntities = new Set(report.plan.filter((p) => p.kind === 'kpi').map((p) => p.entity));
  const lensCtx = { automations: DATA.automations, faces: DATA.faces, roles: DATA.roles || [], kpiEntities };
  const lenses = dep.entities.map((e) => ({ entity: e.name, open: applyLenses(e, lensCtx).filter((x) => x.open) }));
  const shapes = {}; for (const e of report.entities) for (const f of e.fields) shapes[f.ref ? 'קשר' : f.shape] = (shapes[f.ref ? 'קשר' : f.shape] ?? 0) + 1;
  const r = { dep: dep.name, app: report.app, entities: report.entities.length, fields: report.entities.reduce((a, e) => a + e.fields.length, 0), stages: report.entities.filter((e) => e.stages && e.stages.length).length, shapes,
    kpis: report.plan.filter((p) => p.kind === 'kpi').length, proofs: report.proofs.map((p) => ({ need: p.need, chosen: p.chosen, tried: p.tried, dart: p.dart ? p.dart.proven.length : null })), unproven: report.unproven,
    flutter: fl ? { ok: fl.ok, files: fl.files?.length ?? 0, displayAtoms: fl.displayAtoms?.length ?? 0, why: fl.why || fl.err || '' } : null,
    improvements: imp, byKind: imp.reduce((m, x) => ((m[x.kind] = (m[x.kind] ?? 0) + 1), m), {}), lenses, ms: Date.now() - t0, specText };
  results.push(r);
  fs.writeFileSync(path.join(outDir, slug + '.html'), app);
  console.log(`  עדשות: ${lenses.reduce((a, l) => a + l.open.length, 0)} שאלות פתוחות על ${lenses.length} ישויות`);
  console.log(`● ${dep.name}: ${r.entities} ישויות · ${r.fields} שדות · ${r.kpis} מדדים · אטומים ${report.atoms.length}${fl ? ` · Flutter ${fl.ok ? fl.displayAtoms.length + ' אטומי-תצוגה' : 'נכשל'}` : ''} · שיפורים ${imp.length} · ${r.ms}ms`);
}
const totals = {}; for (const r of results) for (const [k, v] of Object.entries(r.byKind)) totals[k] = (totals[k] ?? 0) + v;
const ranked = Object.entries(totals).sort((a, b) => b[1] - a[1]);
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify({ results, totals: ranked, built: new Date().toISOString() }, null, 1));
const md = [`# המחולל עבר אגף-אגף · ${results.length} אגפים`, '', '| אגף | ישויות | שדות | עם שלבים | מדדים | אטומים מוכחים | Flutter | שיפורים |', '|---|---|---|---|---|---|---|---|',
  ...results.map((r) => `| ${r.dep} | ${r.entities} | ${r.fields} | ${r.stages} | ${r.kpis} | ${r.proofs.filter((p) => p.chosen).length}/${r.proofs.length} | ${r.flutter ? (r.flutter.ok ? r.flutter.displayAtoms + ' אטומי-תצוגה' : 'נכשל') : '—'} | ${r.improvements.length} |`),
  '', '## מה לשפר, לפי כמות (כל 12 האגפים)', ...ranked.map(([k, v]) => `- **${k}** × ${v}`), ''];
for (const r of results) { md.push(`## ${r.dep}`); const g = {}; for (const x of r.improvements) (g[x.kind] ||= []).push(x); for (const [k, xs] of Object.entries(g)) md.push(`- **${k}** (${xs.length}): ${xs.slice(0, 6).map((x) => x.what).join(' · ')}${xs.length > 6 ? ' · …' : ''} — ${xs[0].fix}`); md.push(''); }
fs.writeFileSync(path.join(outDir, 'report.md'), md.join('\n'));

// ── עמוד-הדוח (index.html) + היסטוריית-סבבים (history.json): כל ריצה מוסיפה סבב, כדי לראות מה ירד ומה עלה
const HIST = path.join(outDir, 'history.json');
const history = fs.existsSync(HIST) ? JSON.parse(fs.readFileSync(HIST, 'utf8')) : [];
const perDept = results.filter((r) => r.dep !== UNIFIED.name);
const deptTotals = {}; for (const r of perDept) for (const [k, v] of Object.entries(r.byKind)) deptTotals[k] = (deptTotals[k] ?? 0) + v;
const uni = results.find((r) => r.dep === UNIFIED.name);
const lensTotal = results.filter((r) => r !== uni).reduce((a, r) => a + r.lenses.reduce((b, l) => b + l.open.length, 0), 0);
history.push({ round: history.length + 1, at: new Date().toISOString(), perDept: deptTotals, perDeptTotal: Object.values(deptTotals).reduce((a, b) => a + b, 0), unified: uni ? uni.byKind : null, unifiedTotal: uni ? uni.improvements.length : null, lenses: lensTotal, packFiles: (() => { try { return fs.readdirSync(path.join(HERE, 'packs')).filter((f) => f.endsWith('.json')).length; } catch { return null; } })(), packs: (() => { try { return JSON.parse(fs.readFileSync(path.join(HERE, 'mosad.data.json'), 'utf8')).packsApplied.length; } catch { return null; } })() });
fs.writeFileSync(HIST, JSON.stringify(history, null, 1));
const FIX = {
  'קשר חוצה-אגף': 'נעלם בספק המאוחד — שדה בשם ישות מאגף אחר הופך לבחירה מרשימה',
  'מעברים': 'להוסיף «אפשר לעבור ל-X רק אם Y» לישויות שנותרו',
  'קשר לא נפתר': 'נעלם בספק המאוחד',
  'שלבים בלי תאריך': 'המחולל כבר רושם «תאריך שלב» לבד; חסר תאריך-יעד כדי לדעת «באיחור»',
  'הרשאות': 'תפקידים כבר בספק',
  'ישות בלי תפקיד': 'לשייך לתפקיד; «מנהל כללי: הכל» מכסה תמיד',
  'תוכן הודעות': 'לכתוב נוסחים כדאטה בשלוש שפות',
  'תוקף ⇒ התראה': 'המחולל כבר מסמן «פג / פג בעוד N ימים» ומונה בלוח-הבקרה',
  'ערך יחיד': 'סף שנכנס כשדה-בחירה — צריך צורת «כלל»',
  'מספר שאינו כמות': 'תוקן: [מזהה]',
  'שלבים במקום מצב': 'הכרעת-בעלים: מצב או מסע',
  'נוסחה': 'להוסיף «שדה = א פחות ב» במשפט',
  'נוסחה ריקה': 'חישוב חוצה-ישויות (יתרה = סכום − סך ההחזרים) עוד לא במחולל',
  'ישות דלה': 'להשלים שדות או למזג',
  'מעבר יחיד': 'עוד תנאי על השלבים הקריטיים',
  'שם כפול בין אגפים': 'שם מבחין או מיזוג',
};
const rows = results.map((r) => `<tr><td><b>${esc(r.dep)}</b></td><td class="num">${r.entities}</td><td class="num">${r.fields}</td><td class="num">${r.stages}</td><td class="num">${r.kpis}</td><td class="num">${r.proofs.filter((p) => p.chosen).length}/${r.proofs.length}</td><td class="num">${r.flutter ? (r.flutter.ok ? r.flutter.displayAtoms : '✗') : '—'}</td><td class="num">${r.improvements.length}</td></tr>`).join('');
const allKinds = [...new Set(history.flatMap((h) => Object.keys(h.perDept)))].sort((a, b) => (deptTotals[b] ?? 0) - (deptTotals[a] ?? 0));
const histRows = allKinds.map((k) => `<tr><td><b>${esc(k)}</b></td>${history.map((h) => `<td class="num">${h.perDept[k] ?? 0}</td>`).join('')}<td class="num">${uni ? (uni.byKind[k] ?? 0) : '—'}</td><td class="mute">${esc(FIX[k] || '')}</td></tr>`).join('');
const deps = results.map((r) => { const g = {}; for (const x of r.improvements) (g[x.kind] ||= []).push(x); return `<details><summary><b>${esc(r.dep)}</b> <span class="mute">${r.entities} ישויות · ${r.improvements.length} שיפורים · Flutter: ${r.flutter && r.flutter.ok ? r.flutter.files + ' קבצי-Dart, ' + r.flutter.displayAtoms + ' אטומי-תצוגה' : '—'}</span></summary>
<table><tr><th>סוג</th><th>איפה</th><th>למה</th><th>התיקון</th></tr>${Object.entries(g).map(([k, xs]) => `<tr><td><b>${esc(k)}</b> × ${xs.length}</td><td>${xs.slice(0, 8).map((x) => '<code>' + esc(x.what) + '</code>').join(' ')}${xs.length > 8 ? ' …' : ''}</td><td>${esc(xs[0].why)}</td><td>${esc(xs[0].fix)}</td></tr>`).join('')}</table>
<details><summary class="mute">הספק שנבנה</summary><pre>${esc(r.specText)}</pre></details></details>`; }).join('');
const page = `<title>המחולל אגף-אגף</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&display=swap">
<style>
:root{--bg:#f4f3ee;--ink:#1b1a17;--mute:#6f6a5f;--line:#d7d2c6;--card:#fbfaf7;--acc:#1f5f5b;--code:#eeece5;--warn:#a33d1a}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--bg:#141518;--ink:#ebe8e0;--mute:#a09b8f;--line:#2f3238;--card:#1c1e22;--acc:#62c2ba;--code:#101114;--warn:#f08a5b}}
:root[data-theme=dark]{--bg:#141518;--ink:#ebe8e0;--mute:#a09b8f;--line:#2f3238;--card:#1c1e22;--acc:#62c2ba;--code:#101114;--warn:#f08a5b}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.6 Heebo,Arial,sans-serif;direction:rtl;padding-block:24px;padding-inline:18px}.wrap{max-width:1100px;margin:0 auto}
h1{font-size:26px;margin:0}h2{font-size:18px;margin:26px 0 8px}.mute{color:var(--mute)}.step{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px 16px;margin:12px 0}
table{border-collapse:collapse;width:100%}td,th{padding:6px 8px;border-bottom:1px solid var(--line);text-align:right;vertical-align:top;font-size:14px}th{color:var(--mute);font-weight:500;font-size:13px}td.num{font-variant-numeric:tabular-nums;text-align:left}
code{background:var(--code);padding:1px 5px;border-radius:3px;font-size:12.5px}pre{background:var(--code);padding:10px;border-radius:6px;white-space:pre-wrap;font:13px/1.5 Heebo,Arial,sans-serif}
details{border-top:1px solid var(--line);padding:8px 0}summary{cursor:pointer}.tbl{overflow-x:auto}
</style>
<div class="wrap">
<h1>המחולל אגף-אגף</h1><div class="mute">סבב ${history.length}: 12 אגפי המוסד, כל אחד לחוד, ואז המוסד כולו כספק מאוחד. השיפורים נגזרים מכנית מהספק ומהדוח. ${esc(new Date().toLocaleDateString('he-IL'))}</div>
<section class="step"><h2>מה נבנה</h2><div class="tbl"><table><tr><th>אגף</th><th>ישויות</th><th>שדות</th><th>עם שלבים</th><th>מדדים</th><th>צרכים מוכחים</th><th>אטומי-תצוגה (Flutter)</th><th>שיפורים</th></tr>${rows}</table></div></section>
<section class="step"><h2>מה לשפר — סבב אחרי סבב</h2><div class="tbl"><table><tr><th>סוג</th>${history.map((h) => `<th>סבב ${h.round} (12 אגפים)</th>`).join('')}<th>מאוחד (סבב ${history.length})</th><th>התיקון</th></tr>${histRows}<tr><td><b>סה"כ</b></td>${history.map((h) => `<td class="num">${h.perDeptTotal}</td>`).join('')}<td class="num">${uni ? uni.improvements.length : '—'}</td><td></td></tr><tr><td><b>שאלות-עדשה פתוחות (12 אגפים)</b></td>${history.map((h) => `<td class="num">${h.lenses ?? '—'}</td>`).join('')}<td class="num">${uni ? uni.lenses.reduce((a, l) => a + l.open.length, 0) : '—'}</td><td class="mute">יורד עם חבילות-ידע (packs/) ודקדוק חדש; לא עם קוד-פר-ישות</td></tr><tr><td><b>קובצי חבילות-ידע</b></td>${history.map((h) => `<td class="num">${h.packFiles ?? '—'}</td>`).join('')}<td></td><td class="mute">כל חבילה = דאטה עם מוצא (אטום במדף / פירוק של הבעלים)</td></tr><tr><td><b>הצמדות חבילה×ישות</b></td>${history.map((h) => `<td class="num">${h.packs ?? '—'}</td>`).join('')}<td></td><td class="mute">חבילה מוצמדת לישות לפי match.entity</td></tr></table></div></section>
${uni ? (() => { const byLens = {}; for (const l of uni.lenses) for (const o of l.open) byLens[o.lens] = (byLens[o.lens] ?? 0) + 1; const worst = [...uni.lenses].sort((a, b) => b.open.length - a.open.length).slice(0, 12);
  return `<section class="step"><h2>12 העדשות של המנוע הישיבתי — שאלות פתוחות על ${uni.lenses.length} ישויות</h2><p class="mute">המנוע שואל, לא עונה. עדשה שאין לה דקדוק פתוחה תמיד — זה פער במחולל, לא בתוכנית.</p>
<div class="tbl"><table><tr><th>עדשה</th><th>השאלה</th><th>פתוחה ב-</th></tr>${LENSES.map((L) => `<tr><td><b>${esc(L.name)}</b>${L.kind === 'no-grammar' ? ' <span class="mute">(אין דקדוק)</span>' : ''}</td><td>${esc(L.q)}</td><td class="num">${byLens[L.id] ?? 0} / ${uni.lenses.length}</td></tr>`).join('')}</table></div>
<h2>הישויות עם הכי הרבה שאלות פתוחות</h2><div class="tbl"><table><tr><th>ישות</th><th>פתוחות</th><th>מה חסר</th></tr>${worst.map((l) => `<tr><td><b>${esc(l.entity)}</b></td><td class="num">${l.open.length}</td><td>${l.open.filter((o) => !o.grammar).map((o) => `<b>${esc(o.name)}</b>: ${esc(o.why)}`).join(' · ')}</td></tr>`).join('')}</table></div>
<details><summary>כל הישויות</summary><div class="tbl"><table><tr><th>ישות</th><th>שאלות פתוחות</th></tr>${uni.lenses.map((l) => `<tr><td>${esc(l.entity)}</td><td>${l.open.map((o) => esc(o.name)).join(' · ')}</td></tr>`).join('')}</table></div></details></section>`; })() : ''}
<section class="step"><h2>אגף-אגף</h2>${deps}</section>
<p class="mute">הכלי: <code>node gen/pass.mjs</code>. הפלט: <code>gen/out/pass/</code>.</p>
</div>`;
fs.writeFileSync(path.join(outDir, 'index.html'), page);

console.log(`\nסה"כ (12 אגפים): ${Object.values(deptTotals).reduce((a, b) => a + b, 0)} · מאוחד: ${uni ? uni.improvements.length : '—'}`); Object.entries(deptTotals).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => console.log(`  ${String(v).padStart(4)}  ${k}${uni ? '  · מאוחד ' + (uni.byKind[k] ?? 0) : ''}`));
