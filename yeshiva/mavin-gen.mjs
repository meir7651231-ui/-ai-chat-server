// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/mavin-gen.mjs — 🚪 דלת אחת: מנוע 2 מחלק עבודה למנועים הקיימים (אפס מנוע חדש).
//  הבעלים (23.9): «יש לך דרך לקבל את הפלוסים שלו ולתת למנועים הקיימים» ⇒ «תחבר».
//    · יחידה עם סעיף-תנאי (capability.detectAllClauses על הקטע)   ⇒ capability.emitApp   ⇒ אפליקציה-רצה (main)
//    · דבר עם שדות (מהמשפט/מתשובה)                                  ⇒ app-ds.buildApp      ⇒ מסכי-ישות/לוח/דוח
//    · יחידה שדומה למסך רשום (retrieveScreen score>0)               ⇒ מיזוג-סקציות בזיכרון ⇒ gen-screen ⇒ מסך מורכב
//    · השאר                                                          ⇒ שאלות (mavin.questionsFor), לא המצאה
//  🔒 לא מתלכלך: combine-screens כותב מניפסט למדף — כאן המיזוג בזיכרון והכתיבה רק ל-outDir. המדף לא נוגע.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { formOf, specOf, answerFor, toks, serverDeclOf, lookDeclOf, headOf, planBehaviors, sameStem, leadOf, recall, remember, carriersOf } from './mavin.mjs';
import { askMaimatai } from './kashe.mjs';   // המקשה (18 גלאים) — שאלות על המשפט, לא הנחות
import { rule as yeshivaRule } from './purpose.mjs';   // הפוסק (9 מהלכים) על האפיון שיצא
import { detectAllClauses, relOpOf, emitAppFrom } from '../machtzev/generator/capability.mjs';
import { retrieveScreen } from '../machtzev/generator/retrieve-screen.mjs';
import * as R from '../machtzev/root.mjs';

const MAN = path.join(R.ROOT, 'screens-seed/manifests');
// ── מודולי-הזהב (quarry-golden ⇒ golden-fragments.json · render-module.assembleByOps): פלוס לתחום שכותרות-השברים שלו בעברית ──
//    בחירת-מודול לפי צורה: גזעי-מילות-היחידה מול גזעי-כותרות-השברים; גזע שמופיע ב-≥4 מ-9 מודולים אינו מבחין (כמו «מפוזר»). המודול-המאגד (hub) לא נבחר —
//    הוא מפנה למסכי-אחים שאינם בקומפוזיציה (נמדד: 6 שגיאות-מחלקה). קריאה בלבד; הקוד המורכב נכתב רק ל-outDir.
const GOLD = path.join(R.GEN_DIR, 'golden-fragments.json');
let _gold = null;
function goldIndex() {
  if (_gold) return _gold;
  if (!fs.existsSync(GOLD)) return (_gold = { mods: [], stemsOf: new Map(), df: new Map() });
  const c = JSON.parse(fs.readFileSync(GOLD, 'utf8'));
  const heTok = (t) => (String(t).match(/[֐-׿]+/g) || []); const stem = (w) => w.replace(/(ים|ות|ה)$/, '');
  const stemsOf = new Map(), df = new Map();   // stemsOf: מודול ⇒ Map(גזע ⇒ tf = כמה שברים) · df: גזע ⇒ בכמה מודולים
  for (const f of c.fragments) { if (!/[֐-׿]/.test(f.header || '')) continue; const m = stemsOf.get(f.module) || new Map(); for (const w of new Set(heTok(f.header).map(stem))) if (w.length >= 3) m.set(w, (m.get(w) || 0) + 1); stemsOf.set(f.module, m); }
  for (const [, m] of stemsOf) for (const w of m.keys()) df.set(w, (df.get(w) || 0) + 1);
  return (_gold = { mods: [...stemsOf.keys()], stemsOf, df });
}
export function goldModuleFor(label) {
  const { mods, stemsOf, df } = goldIndex(); if (!mods.length) return null;
  const stem = (w) => w.replace(/(ים|ות|ה)$/, '');
  const he = toks(label).filter((w) => /[֐-׿]/.test(w)); if (he.length > 2) return null;   // ≥3 מילים = סעיף, לא דבר (נמדד: «אם הרופא פנוי» ⇒ rooms)
  const ws = [...new Set(he.map(stem).filter((w) => w.length >= 3 && df.has(w)))];
  // ציון = Σ tf(גזע,מודול): המודול שכותרותיו חוזרות על הגזע הכי הרבה. דורש נושא (tf ≥ 2) ומנצח יחיד (שוויון ⇒ null).
  // (נמדד: משקל 1/df עם סף 1 תפס 81 יחידות דרך אזכור-יחיד: «יכול»·«מסך»; תלמיד ב-7 מודולים אבל students:4 > attendance:3.)
  let best = null, bs = 0, second = 0, bw = [];
  for (const m of mods) { if (/\/schoolos\.dart$/.test(m)) continue; const tf = stemsOf.get(m); let sc = 0; const hit = []; for (const w of ws) if (tf.has(w)) { sc += tf.get(w); hit.push(w); } if (sc > bs) { second = bs; bs = sc; best = m; bw = hit; } else if (sc > second) second = sc; }
  return best && bs >= 2 && bs > second ? { module: best, score: bs, words: bw } : null;
}
// (גרעין-מהסכמה הוסר — הכרעת-בעלים 23.9 «לא לגרור כלום»: מצבים/יחסים של סכמת-מאור אינם מהמשפט. העיקרון — שלבים ויחסים — עבר למנוע 2 לפי צורה ⇒ ספק ⇒ app-ds.)
const GEN_SCREEN = path.join(R.ROOT, 'machtzev/assemble/gen-screen.mjs');
function loadManifest(screen) {   // קריאה בלבד (העתק של combine-screens.loadManifest — אינו מיוצא שם)
  const f = path.join(MAN, `screens__${screen}.manifest.json`);
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const g of fs.readdirSync(MAN)) { const m = JSON.parse(fs.readFileSync(path.join(MAN, g), 'utf8')); if (m.screen === screen) return m; }
  return null;
}
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'x';

/** תנאי לפי צורה (העיקרון של capability בלי מרקר-WHEN): בקטע יש מספר, ולפניו (עד אסימון-אות-אחת כמו «ל») מילת-יחס מדקדוק-היחסים הסגור של capability
 *  ⇒ סעיף {x: המילים שלפני היחס (בלי מסגרת), op, n: המספר של הבעלים, trigger: המילים שאחרי המספר}. קטע שכבר יש בו סעיף-טקסט (כש…) לא נבדק שוב. */
const SL_TIME = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8'));
export function clausesByForm(seg, frame = []) {
  if (detectAllClauses(seg).length) return [];
  const ws = toks(seg), F = new Set(frame), out = [];
  const TU = { ...(SL_TIME.timeUnits || {}) }; for (const w of SL_TIME.timeUnitsAsk || []) TU[w] = 'ask';   // יחידות-זמן (דאטה): «מעל 7 ימים» · «מעל שבוע» (יחידה בלי מספר = 1) · «חודש» ⇒ שאלה
  for (let i = 0; i < ws.length; i++) {
    const unitOnly = TU[ws[i]] && !/^\d+$/.test(ws[i - 1] || '');
    if (!/^\d+$/.test(ws[i]) && !unitOnly) continue;
    let j = i - 1; if (j >= 0 && /^[֐-׿]$/.test(ws[j])) j--;   // «מתחת ל 5»: אות-יחס בודדת בין היחס למספר
    const op = j >= 0 ? relOpOf(ws[j]) : null; if (!op) continue;
    const x = ws.slice(0, j).filter((w) => !F.has(w) && !/^\d+$/.test(w)); if (!x.length) continue;
    const n = unitOnly ? 1 : ws[i]; const unit = unitOnly ? TU[ws[i]] : (TU[ws[i + 1]] || null); const after = unitOnly ? i + 1 : (unit ? i + 2 : i + 1);
    out.push({ x: x.join(' '), op, n, y: n, unit, unitWord: unit ? (unitOnly ? ws[i] : ws[i + 1]) : null, trigger: ws.slice(after).filter((w) => !F.has(w)).slice(0, 2).join(' ') });
  }
  return out;
}
/** ניתוב לפי צורה: לכל יחידה — לאיזה מנוע קיים היא הולכת ולמה. */
// הצעות (הכרעת-בעלים 23.9 «לא לגרור כלום»): combine (מסך רשום של אפליקציה אחרת, לפי דמיון-מילים לתוכן שלה) ו-gold (מודול בית-ספר) מביאים **תוכן ממקום אחר**.
// מדדתי: העיקרון של combine (סקציה = אטום עם חיווט מוכח) אינו נפרד מהתוכן — התאמה לפי op בלבד שרירותית (סקציות: action 82 · text 60 · container 40).
// לכן שניהם מסומנים `proposal` ונבנים רק כשהקורא מבקש (proposals: true / --proposals) — מוצעים, לא נכנסים לבד.
export function routeOf(form, answers = {}, { proposals = false } = {}) {
  const spec = specOf(form, answers);
  const entLabels = new Set(spec.spec.split('\n').filter((l) => /^ישות /.test(l)).map((l) => l.replace(/^ישות /, '').split(' עם ')[0].trim()));
  const routes = [];
  const capSegs = new Map();   // קטע ⇒ סעיפים (מהטקסט, או מהצורה)
  for (const seg of form.segments) { const c = detectAllClauses(seg); if (c.length) capSegs.set(seg, { clauses: c, how: 'טקסט' }); else { const f = clausesByForm(seg, form.frame); if (f.length) capSegs.set(seg, { clauses: f, how: 'צורה' }); } }
  const srv = serverDeclOf(form), lk = lookDeclOf(form), head = headOf(form);
  for (const t of form.things) {
    if (head && t.src === form.segments[0] && !(srv && t === srv.thing) && !(lk && t === lk.thing) && !entLabels.has(t.label)) { routes.push({ thing: t.label, route: 'head', why: `ראש-המשפט (לפני הנקודתיים) ⇒ שם-האפליקציה «${head}» + לוח-הבית (אריח לכל ישות)` }); continue; }
    if (srv && t === srv.thing) { routes.push({ thing: t.label, route: 'server', why: `הצהרת-שרת «${srv.value}» ⇒ server.mjs (חבילת-שרת לישויות שנבנו)` }); continue; }
    if (lk && t === lk.thing) { routes.push({ thing: t.label, route: 'look', why: `הצהרת-עיצוב «${lk.value}${lk.extra ? ' ' + lk.extra : ''}» ⇒ app-ds.setLook (עור מהמדף: ds-pure/ds-tokens)` }); continue; }
    if (capSegs.has(t.src)) { const c = capSegs.get(t.src); routes.push({ thing: t.label, route: 'capability', why: c.how === 'טקסט' ? 'סעיף-תנאי מבני בקטע (capability.detectAllClauses)' : `תנאי לפי צורה: «${c.clauses[0].x}» ${c.clauses[0].op} ${c.clauses[0].n}`, seg: t.src, clauses: c.clauses }); continue; }
    if (entLabels.has(t.label)) { routes.push({ thing: t.label, route: 'appds', why: 'דבר עם שדות ⇒ ישות' }); continue; }
    const [b] = retrieveScreen(t.label, 1);
    if (b && b.score > 0) { routes.push({ thing: t.label, route: 'combine', proposal: true, why: `הצעה (תוכן ממקום אחר): דומה במילים למסך רשום ${b.name} (${(+b.score).toFixed(2)})`, screen: b.name, score: +b.score }); continue; }
    const g = goldModuleFor(t.label);   // אחרי combine: תוספת בלבד — לא מחליף מסלול קיים («רק את הפלוסים»)
    if (g) { routes.push({ thing: t.label, route: 'gold', proposal: true, why: `הצעה (תוכן ממקום אחר): כותרות-זהב של ${path.basename(g.module)} חוזרות על «${g.words.join(' ')}» ${g.score} פעמים`, module: g.module }); continue; }
    // «אין» רק אחרי חיפוש (הכרעת-בעלים 23.9): כל מילה ביחידה נבדקת מול המדף (על אילו חלקיקים היא כתובה), מול שדות בגזע, ומול הגדרה זכורה; המסך-הדומה כבר נמדד
    const search = toks(t.label).filter((w) => !form.things.some((x) => x !== t && (sameStem(w, x.label) || (x.fields || []).some((f) => sameStem(w, f.label))))).map((w) => {
      const c = carriersOf(w); const fields = form.things.flatMap((x) => (x.fields || []).filter((f) => sameStem(w, f.label)).map((f) => `${x.label}.${f.label}`)); const rec = recall(w);
      return { word: w, form: c.form, carriers: c.logic.length + c.display.length + c.data.length, logic: c.logic.slice(0, 3), display: c.display.slice(0, 3), fields, remembered: rec ? String(rec.proposal) : null }; });
    const line = search.map((x) => `«${x.word}»: כתוב על ${x.carriers} חלקיקים${x.carriers ? ` (${[...x.logic, ...x.display].slice(0, 3).join(', ')})` : ''} · שדות בגזע ${x.fields.length ? x.fields.join(', ') : 0} · הגדרה זכורה ${x.remembered ? 'כן' : 'לא'}`).join(' | ');
    routes.push({ thing: t.label, route: 'none', search, why: `אין תנאי, אין שדות, מסך דומה ${b ? (+b.score).toFixed(2) : 0} · חיפוש: ${line || '—'} ⇒ שאלה` });
  }
  return { routes, spec: spec.spec, skipped: spec.skipped, builtin: spec.builtin };
}

/** שומר-ניקיון: נתיב-פלט ריק או בתוך new/ (המדף) ⇒ אסור לכתוב. משותף ל-app-ds ול-genesis-gen. */
const inRepo = (p) => !p || path.resolve(p).startsWith(path.resolve(R.ROOT, 'new'));
/** app-ds על ספק (שומר-ניקיון: GEN_OUT/GEN_DATA_OUT מחוץ ל-new/). מחזיר את האפליקציה או null. */
async function runAppDs(spec, files, notes, questions = [], opts = {}) {
  let app = null;
  if (spec && (inRepo(process.env.GEN_OUT) || inRepo(process.env.GEN_DATA_OUT))) { notes.push('⛔ app-ds לא הופעל: GEN_OUT/GEN_DATA_OUT חייבים להצביע מחוץ ל-new/ לפני הייבוא הראשון (שומר-ניקיון)'); }
  else if (spec) { const { buildApp } = await import('../machtzev/generator/app-ds.mjs'); const logs = []; const _l = console.log; console.log = (...a) => logs.push(a.join(' ')); try { app = buildApp(spec, { writePlan: false, ...opts }); } finally { console.log = _l; } for (const l of logs) if (/נמצאו-ומחווטים/.test(l)) notes.push(l.slice(0, 140)); else if (/^⚖️/.test(l)) notes.push(l.slice(0, 400)); files.push({ route: 'appds', screens: app.screens.map((s) => `${s.kind}:${s.name}`) }); }
  if (app) { const { parseLookLine } = await import('../machtzev/generator/app-ds.mjs'); markSilentDefaults(spec, notes, questions, parseLookLine); }
  return app;
}
/** ברירות-מחדל שקטות (הכרעת-בעלים 23.9 «לא דעה קדומה, לא קשיח»): מה שהספק לא אמר ו-app-ds השלים לבד — נהיה שאלה, והפלט מסומן במפורש (defaults.json + שורת-הערה בקובץ-הכניסה).
 *  המילים = מילות שפת-הספק (spec-lang.data.json: עיצוב · אפליקציה) — אפס מילון בדלת. המנוע הקיים לא שונה. */
function markSilentDefaults(spec, notes, questions, parseLookLine = null) {
  let SL; try { SL = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8')); } catch { return; }
  const has = (word) => word && new RegExp('^\\s*' + word + '\\s*:', 'm').test(spec);
  const silent = [];
  const lookLine = SL.lookWord && spec.match(new RegExp('^\\s*' + SL.lookWord + '\\s*:\\s*(.+)$', 'm'));
  if (lookLine && parseLookLine) {   // נאמר — אבל מילה שאינה בדאטה (עור/ערכה לא-מוכרים) ⇒ app-ds היה נופל לברירת-המחדל בשקט ⇒ שאלה
    const lk = parseLookLine(lookLine[1]);
    if (lk.unknownLook) silent.push({ said: lk.unknownLook, what: SL.lookWord, engine: 'app-ds', value: `«${lk.unknownLook}» לא עור מהמדף ⇒ ${SL.defaultLook}`, say: `${SL.lookWord}: ${Object.keys(SL.looks || {}).join(' / ')}` });
    if (lk.unknownTheme) silent.push({ said: lk.unknownTheme, what: SL.lookWord, engine: 'app-ds', value: `«${lk.unknownTheme}» לא ערכת-צבע מהמדף ⇒ ערכת-העור`, say: `${SL.lookWord}: ${lk.look === 'dark' ? SL.defaultLook : Object.keys(SL.looks).find((k) => SL.looks[k] === lk.look)} ${Object.keys(SL.themes || {}).join(' / ')}` });
  }
  if (!has(SL.lookWord)) silent.push({ what: SL.lookWord, engine: 'app-ds', value: `${SL.defaultLook} = ${SL.looks?.[SL.defaultLook]} (spec-lang.defaultLook)`, say: `${SL.lookWord}: ${Object.keys(SL.looks || {}).join(' / ')}` });
  if (!has(SL.appWord)) silent.push({ what: SL.appWord, engine: 'app-ds', value: 'L.appTitle («האפליקציה שלי» — מילון-הכרום של app-ds)', say: `${SL.appWord}: <שם>` });
  if (!silent.length) return;
  for (const s of silent) questions.push({ thing: 'האפליקציה', ask: s.what, q: s.said ? `${s.what} — נאמר «${s.said}» אבל אין כזה במדף; ${s.engine} הניח לבד (${s.value}). לומר: «${s.say}»` : `${s.what} — לא נאמר במשפט; ${s.engine} הניח לבד (${s.value}). לומר: «${s.say}»` });
  const out = R.outDir();
  try {
    fs.writeFileSync(path.join(out, 'defaults.json'), JSON.stringify(silent, null, 1));
    const entry = path.join(out, 'gen_app_main.dart');
    if (fs.existsSync(entry)) fs.writeFileSync(entry, `// ⚠️ ברירת-מחדל של מנוע, לא מהמשפט: ${silent.map((s) => `${s.what} = ${s.value}`).join(' · ')} — ראה defaults.json; המילים שיסירו: ${silent.map((s) => `«${s.say}»`).join(' ')}\n` + fs.readFileSync(entry, 'utf8'));
  } catch {}
  notes.push(`⚠️ ברירות-מחדל שקטות (${silent.length}): ${silent.map((s) => `${s.what}=${s.value}`).join(' · ')} — סומנו ב-defaults.json ובקובץ-הכניסה; נפתחו ${silent.length} שאלות`);
}
/** «בלגן» — האפליקציה-האחת מכל מודולי-הבעלים (apps/*.json שנגזרו מפירוקיו) ⇒ gen_balagan_*.dart ל-GEN_OUT/GEN_DATA_OUT בלבד (בלי אינדקס, בלי קובץ-בדיקה).
 *  balagan קורא את המודולים מהדיסק (apps/ · peruk-index) — כניסה של «כל המודולים», לא של משפט אחד. שומר-ניקיון: רץ רק כשהסביבה מופנית מחוץ ל-new/. */
export async function generateBalagan({ outDir } = {}) {
  const notes = [];
  if (inRepo(process.env.GEN_OUT) || inRepo(process.env.GEN_DATA_OUT)) return { files: [], notes: ['⛔ בלגן לא הופעל: GEN_OUT/GEN_DATA_OUT חייבים להצביע מחוץ ל-new/ (שומר-ניקיון)'] };
  const BG = await import('../machtzev/generator/balagan.mjs');
  const logs = []; const _l = console.log; console.log = (...a) => logs.push(a.join(' '));
  let r = null; try { r = BG.buildBalagan({ writeIndex: false, writeTest: false }); } finally { console.log = _l; }
  for (const l of logs) if (/בלגן/.test(l)) notes.push(l.slice(0, 200));
  const out = R.outDir(); const files = fs.existsSync(out) ? fs.readdirSync(out).filter((f) => /^gen_balagan_.*\.dart$/.test(f)).map((f) => ({ route: 'balagan', file: path.join(out, f) })) : [];
  return { files, notes, modules: r ? r.mods.length : 0, bad: r ? r.bad : [], spec: r ? `(בלגן) ${r.mods.length} מודולים: ${r.mods.map((m) => m.title).join(' · ')}` : '' };
}
/** «כל המוסד» — היכולת של gen/wizard+pass: עץ-המוסד של הבעלים (gen/mosad.data.json: 12 אגפים, נבנה ממשפטיו והעשרותיו) ⇒ ספק לכל אגף (pass.specOf) ⇒ ספק-ds (gen/flutter.toSpecDs).
 *  קריאה בלבד; מחזיר את הספקים — כל אגף נבנה דרך generateFromSpec (אותו app-ds), אגף אחד להרצה (שמות-הקבצים של app-ds אינם ממורחבים בתוך תהליך). */
export async function mosadSpecs() {
  const [PS, FL] = await Promise.all([import('../gen/pass.mjs'), import('../gen/flutter.mjs')]);
  const roles = PS.MOSAD.roles || [];
  return PS.MOSAD.departments.map((dep, i) => ({ i: i + 1, name: dep.name, entities: dep.entities.length, specGen: PS.specOf(dep, roles), spec: FL.toSpecDs(PS.specOf(dep, roles)) }));
}
/** דלת שנייה — מסמך של הבעלים במקום משפט: ספק מוכן (specs-ds/*.txt, נגזר ממסמך-«פירוק») ⇒ app-ds ⇒ outDir. */
export async function generateFromSpec(spec, { outDir, name = 'spec' } = {}) {
  fs.mkdirSync(outDir, { recursive: true }); const files = [], notes = [], questions = [];
  const app = await runAppDs(spec, files, notes, questions);
  return { spec, files, notes, questions, screens: app ? app.screens.map((s) => `${s.kind}:${s.name}`) : [] };
}
/** מסמך-«פירוק» (markdown של הבעלים, שלד peruk-lang) ⇒ peruk.perukToSpec ⇒ ספק ⇒ app-ds. אפס כתיבה ל-specs-ds. */
export async function generateFromDoc(md, { outDir, name = 'doc' } = {}) {
  const { perukToSpec } = await import('../machtzev/generator/peruk.mjs');
  const { spec, node } = perukToSpec(md, name);
  const r = await generateFromSpec(spec, { outDir, name });
  // היכולת של yeshiva/read (הקורא הישיבתי): המסמך מול הספק — מה בפירוק לא הגיע לספק ומה הספק הניח (איכא דאמרי · שיעור · ורמינהו · ייתור …). טהור: check(doc, spec) בזיכרון
  try {
    const RD = await import('./read.mjs');
    const findings = RD.check(RD.parsePeruk(md), RD.parseSpec(spec));
    const qs = findings.filter((f) => f.q), fixes = findings.filter((f) => !f.q && f.kind !== 'ממה נפשך');
    fs.writeFileSync(path.join(outDir, 'doc-check.json'), JSON.stringify(findings, null, 1));
    r.notes.push(`הקורא (מסמך מול ספק): שאלות לבעלים ${qs.length} · תיקונים מכניים ${fixes.length}${qs.length ? ' · ' + qs.slice(0, 3).map((f) => `[${f.kind}] ${f.text.slice(0, 90)}`).join(' ¦ ') : ''}`);
    r.docCheck = { questions: qs.length, fixes: fixes.length, file: path.join(outDir, 'doc-check.json') };
  } catch (e) { r.notes.push(`הקורא לא רץ: ${String(e.message || e).slice(0, 120)}`); }
  // השלמות של peruk (הכרעה-27: שדות-אדם, שלבים — מהדאטה שלו, לא מהמסמך) ⇒ שאלות: תווית שאף מילה שלה (גזע ≥3) אינה במסמך = הושלמה, לא נאמרה
  try {
    const st = (w) => w.replace(/(ים|ות|ה)$/, ''); const docStems = new Set(toks(md).map(st).filter((w) => w.length >= 3));
    const said = (label) => toks(label).map(st).filter((w) => w.length >= 3).some((w) => docStems.has(w));
    const completed = [];
    for (const l of spec.split('\n')) {
      const m = l.match(/^ישות\s+(.+?)\s+עם\s+(.+)$/); if (!m) continue;
      const [fieldsPart, ...secs] = m[2].split(/\s*\|\s*/);
      for (const f of fieldsPart.split(',').map((x) => x.replace(/\{[^}]*\}|\*|\[[^\]]*\]/g, '').trim()).filter(Boolean)) if (!said(f)) completed.push({ entity: m[1], kind: 'שדה', value: f });
      for (const s of secs) { const sm = s.match(/^\S+\s*:?\s*(.+)$/); if (!sm) continue; for (const v of sm[1].split(',').map((x) => x.trim()).filter(Boolean)) if (!said(v)) completed.push({ entity: m[1], kind: 'שלב', value: v }); }
    }
    for (const c of completed) r.questions.push({ thing: c.entity, ask: c.kind, q: `${c.kind} «${c.value}» ב${c.entity} — לא כתוב במסמך; peruk השלים מהדאטה שלו. לאשר, לשנות, או להוריד?` });
    if (completed.length) { r.notes.push(`⚠️ השלמות של peruk שלא נאמרו במסמך: ${completed.length} (${completed.slice(0, 6).map((c) => c.value).join(' · ')}${completed.length > 6 ? ' …' : ''}) — נפתחו כשאלות`); fs.writeFileSync(path.join(outDir, 'defaults-peruk.json'), JSON.stringify(completed, null, 1)); }
  } catch (e) { r.notes.push(`בדיקת-השלמות לא רצה: ${String(e.message || e).slice(0, 120)}`); }
  return { ...r, node };
}
/** הפעלה: כל מסלול למנוע שלו; כתיבה רק ל-outDir. מחזיר את הקבצים שנוצרו ופערים. */
/** הגדרות-מילים (הכרעת-בעלים 23.9 «תפרק את זה ותחבר»): סעיף שלא נכנס («התראה כשתלמיד מתקשה» ⇒ none) ומילה שאינה שדה ולא תנאי —
 *  (א) יש תשובה מהבעלים («מתקשה» = «ציון מתחת ל-55 או היעדרויות מעל 3») ⇒ המילה מוחלפת בהגדרה, «או» = סעיף לכל חלק, והמשפט נקרא שוב באותה דלת;
 *      התשובה נזכרת (remember) ומוצעת בפעם הבאה כהצעה, לא כעובדה (recall ⇒ ברירת-מחדל בשאלה; נכנסת לבד רק עם proposals).
 *  (ב) אין ⇒ שאלה עם מפתח = המילה. אפס פירוש: המילה נמצאת לפי צורה (אחרי מילת-הישות בסעיף), ההגדרה היא משפט של הבעלים. */
/** הכיוון-ההפוך של ההגדרה (הכרעת-בעלים 23.9 «מנוע תמיד יכול לעבוד דו-כיווני»): במקום משפט, הבעלים מסמן אילו דוגמאות הן «מתקשה» («ראובן»).
 *  behavior-plan.valueSearch (החיפוש הרקורסיבי-המוכח על קטלוג-הלוגיקה) מקבל לכל שדה-מספר צורך: פרמטר = ערך-השדה, קבועים = ערכי-הדוגמאות, תשובה = הסימון —
 *  ומוצא בהוכחה-בריצה ב-Dart כלל שמסכים עם כל הדוגמאות. הכיוון (מתחת/מעל) נקרא מהדוגמאות עצמן מול הקבוע; המילים מ-spec-lang (amountAbove/amountBelow).
 *  שדה-מספר יחיד ⇒ ההגדרה נכנסת (וסימון-הסף הוא ערך מהדוגמאות, לא המצאה). כמה שדות ⇒ שאלה סגורה עם הכללים שנמצאו. אפס ⇒ שאלה: עוד דוגמאות. */
async function defineByMarks(w, ans, thing, SL) {
  const keys = new Set((thing.examples || []).map((r) => String(r[0]).trim())); const marks = ans.split(/[,;\s]+/).filter(Boolean);
  if (!marks.length || !marks.every((m) => keys.has(m)) || !keys.size) return null;
  const isNum = (v) => /^-?\d+(\.\d+)?$/.test(String(v).trim());
  const numIdx = thing.fields.map((f, i) => i).filter((i) => i > 0 && thing.examples.every((r) => isNum(r[i])));
  if (!numIdx.length) return { marks, cands: [] };
  const needs = {};
  for (const i of numIdx) { const vals = [...new Set(thing.examples.map((r) => String(r[i]).trim()))];
    needs[`def.${w}.${i}`] = { shape: 'בדיקה', demand: `${thing.label} ${w} ${thing.fields[i].label}`, params: ['num'], ret: 'bool', consts: vals, examples: thing.examples.map((r) => [String(r[i]).trim(), `r == ${marks.includes(String(r[0]).trim())}`]) }; }
  const BP = await import('../machtzev/generator/behavior-plan.mjs'); const P = BP.planNeeds(needs, { prove: true });
  const cands = [];
  for (const i of numIdx) { const p = P[`def.${w}.${i}`]; if (!p || !p.pick || !p.proven) continue;
    const m = String(p.pick).match(/^\w+\(([^)]*)\)$/); const c = m ? m[1].split(',').map((x) => x.trim()).find((x) => isNum(x)) : null; if (c == null) continue;
    const marked = thing.examples.filter((r) => marks.includes(String(r[0]).trim())).map((r) => +r[i]), rest = thing.examples.filter((r) => !marks.includes(String(r[0]).trim())).map((r) => +r[i]);
    const below = marked.every((v) => v < +c) && rest.every((v) => v >= +c), above = marked.every((v) => v > +c) && rest.every((v) => v <= +c);
    if (!below && !above) continue;
    const word = below ? (SL.amountBelow || [])[1] || (SL.amountBelow || [])[0] : (SL.amountAbove || [])[0]; if (!word) continue;
    cands.push({ field: thing.fields[i].label, clause: `${thing.fields[i].label} ${word}${/-$/.test(word) ? '' : ' '}${c}`, ties: p.ties || 0, atom: p.pick }); }
  return { marks, cands };
}
async function expandDefinitions(sentence, form, routed, answers, proposals) {
  let SLd = {}; try { SLd = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8')); } catch {}
  const out = { sentence, changed: false, notes: [], questions: [] };
  let orRe = null; try { const ow = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8')).orWords || []; if (ow.length) orRe = new RegExp('\\s+(?:' + ow.join('|') + ')\\s+'); } catch {}
  const ents = form.things.filter((t) => t.fields && t.fields.length);
  for (const r of routed.routes.filter((x) => x.route === 'none')) {
    const thing = form.things.find((t) => t.label === r.thing); if (!thing) continue;
    const tokens = toks(thing.label);
    let ei = -1, ent = null; tokens.forEach((w, i) => { const e = ents.find((t) => leadOf(w, t.label) != null); if (e) { ei = i; ent = e; } });
    const cands = ei >= 0 ? tokens.slice(ei + 1) : tokens.slice(1).filter((w) => !ents.some((t) => sameStem(w, t.label) || t.fields.some((f) => sameStem(w, f.label))));
    for (const w of cands) {
      let said = typeof answers[w] === 'string' ? answers[w].trim() : '';
      const rec = recall(w);
      if (said && ent) { const bm = await defineByMarks(w, said, ent, SLd);   // התשובה היא סימון-דוגמאות ⇒ הכלל מהמנוע-ההפוך
        if (bm) { if (bm.cands.length === 1) { out.notes.push(`הגדרה «${w}» מהדוגמאות שסימנת (${bm.marks.join(', ')}): «${bm.cands[0].clause}» — ${bm.cands[0].atom} הוכח ב-Dart על ${ent.examples.length} דוגמאות · ${bm.cands[0].ties} שקולים · הסף הוא ערך מהדוגמאות`); said = bm.cands[0].clause; }
          else { out.questions.push({ thing: r.thing, ask: 'define', key: w, q: `«${w}» לפי הסימון (${bm.marks.join(', ')}): ${bm.cands.length ? bm.cands.map((c) => `${c.clause} (${c.ties} שקולים)`).join(' · ') + ' — בחר אחד או חבר ב«או»' : 'אין כלל על שדה-מספר שמסכים עם כל הדוגמאות — סמן עוד דוגמאות או הגדר במשפט'} ⇒ ${bm.cands[0] ? bm.cands[0].clause : '—'}` }); continue; } } }
      const def = said || (proposals && rec ? String(rec.proposal) : '');
      if (!def) { const sx = (r.search || []).find((x) => x.word === w); out.questions.push({ thing: r.thing, ask: 'define', key: w, q: `«${w}» — ${sx ? `כתוב על ${sx.carriers} חלקיקים${sx.carriers ? ` (${[...sx.logic, ...sx.display].slice(0, 3).join(', ')})` : ''}, ` : ''}לא שדה${ent ? ` של «${ent.label}» (${ent.fields.map((f) => f.label).join(', ')})` : ''} ולא תנאי; להגדיר במשפט על שדה ⇒ ${rec ? `${rec.proposal} (נענה ${rec.times} פעמים — הצעה, לא עובדה)` : 'נשאר בלי מסך עד תשובה'}` }); continue; }
      const parts = (orRe ? def.split(orRe) : [def]).map((x) => x.trim()).filter(Boolean);
      const lead = ei >= 0 ? leadOf(tokens[ei], ent.label) : '';
      const clauses = parts.map((p) => ei >= 0 ? [...tokens.slice(0, ei), lead + p].join(' ') : tokens.map((t) => (t === w ? p : t)).join(' '));
      if (!out.sentence.includes(thing.label)) { out.notes.push(`הגדרה «${w}»: הסעיף «${thing.label}» לא נמצא כלשונו במשפט ⇒ לא הוחלף`); continue; }
      out.sentence = out.sentence.replace(thing.label, clauses.join('; ')); out.changed = true;
      out.notes.push(`הגדרה «${w}» = «${def}» (${said ? 'תשובת-הבעלים' : `נזכרה, נענתה ${rec.times} פעמים`}) ⇒ ${clauses.length} סעיפים: ${clauses.map((c) => `«${c}»`).join(' · ')}`);
      if (said && !(rec && String(rec.proposal) === said)) { try { remember(w, said, sentence); } catch {} }
      break;   // מילה אחת לסעיף; השאר נקראות מחדש אחרי ההחלפה
    }
  }
  return out;
}
export async function generateAll(sentence, { answers = {}, outDir, name = 'mavin', proposals = false } = {}) {
  let form = formOf(sentence);
  let routed = routeOf(form, answers, { proposals });
  const defs = await expandDefinitions(sentence, form, routed, answers, proposals);
  if (defs.changed) { sentence = defs.sentence; form = formOf(sentence); routed = routeOf(form, answers, { proposals }); }
  const { routes: allRoutes, skipped } = routed; let spec = routed.spec;
  // הישיבה על המשפט ועל האפיון (הכרעת-בעלים 23.9 «תתחיל לחבר»): (א) המקשה ⇒ קושיות (לא הנחות) · (ב) הפוסק ⇒ מה שהוכרע מוחל, מתגים ⇒ שאלות
  const yesh = { kushyot: [], rulings: [], switches: [], note: null };
  try { const k = askMaimatai(sentence); if (!k.available || !k.ok) yesh.note = `מקשה: ${k.reason}`; else yesh.kushyot = (k.seeds || []).map((x) => ({ kind: x.kind, text: x.text })); } catch (e) { yesh.note = `מקשה: ${String(e.message || e).slice(0, 120)}`; }
  if (spec) { try { const y = yeshivaRule(sentence, spec); yesh.rulings = y.rulings || []; yesh.switches = y.switches || []; if (y.changed && y.spec && y.spec.trim()) spec = y.spec; } catch (e) { yesh.note = (yesh.note ? yesh.note + ' · ' : '') + `פוסק: ${String(e.message || e).slice(0, 120)}`; } }
  // הצעות נבנות רק לפי בקשה; אחרת נרשמות בהערות (מוצע, לא נכנס לבד)
  const routes = proposals ? allRoutes : allRoutes.filter((r) => !r.proposal);
  const held = allRoutes.filter((r) => r.proposal && !proposals);
  fs.mkdirSync(outDir, { recursive: true });
  const files = [], notes = [...defs.notes], questions = [...defs.questions];
  for (const q of yesh.kushyot) questions.push({ thing: 'הישיבה', ask: q.kind, q: `${q.kind}: ${q.text}` });
  for (const sw of yesh.switches) questions.push({ thing: 'הישיבה', ask: sw.move || sw.kind, q: `${sw.move || sw.kind}: ${sw.text}` });
  if (yesh.note) notes.push(yesh.note);
  if (yesh.rulings.length) notes.push(`הפוסק: ${yesh.rulings.filter((r) => r.decided).length} הוכרעו · ${yesh.switches.length} מתגים`);
  for (const r of held) notes.push(`הצעה לא נבנתה («${r.thing}» ⇒ ${r.route}): ${r.why.replace(/^הצעה \(תוכן ממקום אחר\): /, '')} — לבנייה: proposals / --proposals`);
  // 1 · capability — פעם אחת לכל קטע-תנאי
  const capSegs = [...new Map(routes.filter((r) => r.route === 'capability').map((r) => [r.seg, r.clauses])).entries()];
  capSegs.forEach(([seg, clauses], i) => { const cls = `GenCap${i + 1}Screen`; const code = emitAppFrom(clauses, seg, cls); const f = path.join(outDir, `gen_cap${i + 1}.dart`); fs.writeFileSync(f, code); files.push({ route: 'capability', file: f, seg, thresholds: clauses.map((c) => `${c.x} ${c.op} ${c.n ?? '?'}`) }); });
  // 2 · app-ds — כל הישויות בקריאה אחת (GEN_OUT/GEN_DATA_OUT של הקורא)
  // 🔒 שומר-ניקיון: app-ds/render-ds קוראים GEN_OUT/GEN_DATA_OUT **בזמן-טעינה**. אם לא הופנו מחוץ למדף לפני הייבוא הראשון —
  //    הבנייה כותבת ל-new/dart-gen-bs ו-new/dart-data-bs/auto ומוחקת יתומים (קרה 23.9, שוחזר מ-git). כאן: מסרבים, לא מלכלכים.
  const caps = capSegs.map(([seg, clauses], i) => ({ slug: `cap${i + 1}`, cls: `GenCap${i + 1}Screen`, kind: 'capability', name: seg.trim(), icon: '🔔', value: (clauses.find((c) => c.n != null) || {}).n ?? null, clause: clauses.find((c) => c.n != null) || null, sub: clauses.map((c) => { const i = c.x ? seg.indexOf(c.x) : -1; return i >= 0 ? seg.slice(i).trim() : `${c.x || ''} ${c.op || ''} ${c.n ?? ''}`.trim(); }).join(' · ') }));   // המילים של הבעלים («ציון מתחת ל-55»), לא סימן   // מסך-ההתראה ⇒ אריח בלוח-הבית וברכזת (הרכבה: לא קובץ-ליד)
  const app = await runAppDs(spec, files, notes, questions, { extraScreens: caps });
  // 2א · הרכבה (insight.mjs · הכרעת-בעלים 23.9 «תחבר»): התראה עם קישור-נתונים ⇒ מסך-תובנה אחד מהנתונים האמיתיים במקום הדמו של capability
  if (app && Array.isArray(app.liveExtras) && !inRepo(process.env.GEN_OUT)) {
    const IN = await import('../machtzev/generator/insight.mjs');
    for (const x of app.liveExtras) { if (!x.live) { notes.push(x.why || `הרכבה «${x.name}»: אין ישות עם השדה ⇒ נשאר מסך-capability (דמו)`); if (x.ask) questions.push({ thing: x.name, ask: x.ask, q: x.why }); continue; }
      const entLine = spec.split('\n').find((l) => new RegExp(`^ישות\\s+\\S.*\\s+עם\\s`).test(l) && (() => { const m = l.match(/^ישות\s+(.+?)\s+עם\s+(.+)$/); return m && Object.entries({}).length === 0 && x.live.slug && true; })());
      const ents = spec.split('\n').map((l) => l.match(/^ישות\s+(.+?)\s+עם\s+(.+)$/)).filter(Boolean).map((m) => ({ name: m[1].trim(), fields: m[2].split('|')[0].split(/[,،]/).map((f) => f.trim().replace(/\{[^}]*\}$/, '')).filter(Boolean) }));
      const entOfSlug = (sl) => { const m0 = spec.split('\n').map((l) => l.match(/^ישות\s+(.+?)\s+עם\s/)).filter(Boolean).map((m) => m[1].trim()); return ents.find((e) => app.nameToSlug && app.nameToSlug[e.name] === sl) || null; };
      const ent = (x.live.kind === 'refCount' || x.live.kind === 'agg' || x.live.kind === 'aggBy') ? (entOfSlug(x.live.slug) || ents.find((e) => e.fields.includes(x.live.field)) || ents[0]) : (ents.find((e) => e.fields.includes(x.live.field)) || ents[0]);
      // מונה-קשר: רשומות-הבנות מהדוגמאות של ישות-הבת (השדה המצביע ⇐ live.childField); הורה מזוהה לפי השדה הראשון שלו
      const childRecs = (() => { if (x.live.kind !== 'refCount') return null; const ce = ents.find((e) => app.nameToSlug && app.nameToSlug[e.name] === x.live.childSlug); if (!ce) return null; const SLc = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8')); const l = spec.split('\n').find((q) => q.startsWith(`${SLc.exampleWord} ${ce.name}:`)); if (!l) return null; const cfi = ce.fields.indexOf(x.live.childField); return l.slice(l.indexOf(':') + 1).split(';').map((r) => r.split(/[,،]/).map((v) => v.trim())).map((r) => (r[cfi] || '').trim()); })();
      const childCount = (r) => (childRecs ? childRecs.filter((v) => v && v === (r[0] || '').trim()).length : 0);
      // הציפייה מהדוגמאות של הבעלים (אימות מול הייעוד): אילו רשומות עונות לתנאי — לפי הצורה, בלי המצאה
      let expect = null; const SLd = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8'));
      if (ent && SLd.exampleWord) { const exLine = spec.split('\n').find((l) => l.startsWith(`${SLd.exampleWord} ${ent.name}:`)); if (exLine) { const recs = exLine.slice(exLine.indexOf(':') + 1).split(';').map((r) => r.split(/[,،]/).map((v) => v.trim())); const fi = ent.fields.indexOf(x.live.field); const LE0 = await import('../machtzev/generator/live-expr.mjs'); const thr0 = LE0.liveThreshold(x.live); const lt0 = x.live.op === '<';
        const sampleOf = (r) => x.live.kind === 'refCount' ? childCount(r) : LE0.liveSample(x.live, r[fi]);   // מונה-קשר: כמה רשומות-בנות בדוגמאות מצביעות על ההורה
        if (x.live.kind === 'aggBy') { const bi = ent.fields.indexOf(x.live.by); const gs = LE0.liveGroupsSample(x.live, recs, fi, bi).filter((g) => g[1] != null); const rows = gs.filter((g) => (lt0 ? g[1] < thr0 : g[1] > thr0)).map((g) => [g[0], String(g[1])]); expect = { count: rows.length, rows, groups: gs }; }
        else if (x.live.kind === 'agg') { const v = LE0.liveAggSample(x.live, recs, fi); const hit = v != null && (lt0 ? v < thr0 : v > thr0); expect = { count: v == null ? '' : (Math.round(v * 10) / 10).toString(), rows: hit ? recs.map((r) => [r[0] || '', r[fi] || '']) : [], agg: v }; }
        else { const rows = recs.filter((r) => { const v = sampleOf(r); return v != null && (lt0 ? v < thr0 : v > thr0); }).map((r) => [r[0] || '', x.live.kind === 'refCount' ? String(childCount(r)) : (r[fi] || '')]); expect = { count: rows.length, rows }; } } }   // הציפייה בצורת-התנאי (מספר / ותק / מונה-קשר / קבוצה)
      const seedSlug = fs.existsSync(path.join(outDir, 'gen_app_seed.dart')) ? 'app_seed' : null;
      // ההחלטה האחת — אטום מהקטלוג, מוכח בהרצה (behavior-plan) על הדוגמאות של הבעלים + גבול-הסף מצורת היחס («מתחת ל» = ממש מתחת ⇒ 55 אינו חורג)
      let decide = null;
      if (ent && SLd.exampleWord) { const exLine = spec.split('\n').find((l) => l.startsWith(`${SLd.exampleWord} ${ent.name}:`)); const fi = ent.fields.indexOf(x.live.field);
        const LE = await import('../machtzev/generator/live-expr.mjs'); const thr = LE.liveThreshold(x.live);
        const recs0 = exLine ? exLine.slice(exLine.indexOf(':') + 1).split(';').map((r) => r.split(/[,،]/).map((v) => v.trim())) : [];
        const vals = x.live.kind === 'aggBy' ? LE.liveGroupsSample(x.live, recs0, fi, ent.fields.indexOf(x.live.by)).map((g) => g[1]).filter((v) => v != null) : x.live.kind === 'agg' ? [LE.liveAggSample(x.live, recs0, fi)].filter((v) => v != null) : x.live.kind === 'refCount' ? recs0.map((r) => childCount(r)) : (exLine && fi >= 0 ? recs0.map((r) => LE.liveSample(x.live, (r[fi] || '').trim())).filter((v) => v != null) : []);
        if (vals.length) { const lt = x.live.op === '<'; const examples = [...vals.map((v) => [`${v}, ${thr}`, `r == ${lt ? v < thr : v > thr}`]), [`${thr}, ${thr}`, 'r == false']];
          try { const BP = await import('../machtzev/generator/behavior-plan.mjs'); const id = `sev.${x.slug}`; const P = BP.planNeeds({ [id]: { shape: 'מספר', demand: x.sub || x.name, params: ['num', 'num'], ret: 'bool', examples } }, { prove: true, earlyExit: true }); const pr = P[id];
            if (pr && pr.pick && pr.proven) { decide = { name: pr.pick, file: pr.file, proven: true, examples }; notes.push(`החלטה «${x.name}»: ${pr.pick} (${pr.file}) הוכח על ${examples.length} דוגמאות${pr.ties ? ` · ${pr.ties} תיקו` : ''}`); }
            else notes.push(`החלטה «${x.name}»: אין אטום מוכח בקטלוג ⇒ השוואה ביד (מדווח)`); } catch (e) { notes.push(`החלטה «${x.name}»: behavior-plan נכשל — ${String(e.message || e).slice(0, 120)}`); } } }
      try { const r = IN.emitInsight({ slug: x.slug, cls: x.cls, name: x.name, live: x.live, entity: x.live.kind === 'aggBy' ? { name: ent ? ent.name : '', fields: [x.live.by, x.live.field] } : (ent || { name: '', fields: [x.live.field] }), expect, seedSlug, words: x.sub || null, decide }); for (const l of r.ledger) notes.push(l.slice(0, 400)); notes.push(`הרכבה «${x.name}»: ${r.wired}/${r.ops} פעולות עם אטום · לרישום כיכולת: node machtzev/generator/insight.mjs --register ${path.join(outDir, `insight_${x.slug}.json`)}`); notes.push(`הרכבה «${x.name}»: ${r.wired}/${r.ops} פעולות עם אטום${r.missing.length ? ` · בלי אטום: ${r.missing.join(', ')}` : ''} ⇒ ${x.cls} (insight_${x.slug}.json)${r.accept ? ` · מבחן-קבלה: ${expect.count} חורגים ${expect.rows.map((q) => q.join('/')).join(', ')}` : ' · אין דוגמאות ⇒ אין מבחן-קבלה'}`); files.push({ route: 'insight', file: path.join(outDir, `gen_${x.slug}.dart`), cls: x.cls, ops: r.ops, wired: r.wired }); }
      catch (e) { notes.push(`הרכבה «${x.name}» נכשלה: ${String(e.message || e).slice(0, 160)} ⇒ נשאר מסך-capability`); } }
  }
  // 2ב · server — רק כשהספק מצהיר (`שרת: ענן`): חבילת-שרת לישויות שנבנו, בזיכרון ⇒ outDir/server/ (לא server-gen/)
  const SV = await import('../machtzev/generator/server.mjs');
  if (SV.declaredServer(spec)) { const ents = app ? app.screens.filter((s) => s.kind === 'entity').map((s) => s.slug) : [];
    if (!ents.length) notes.push('שרת הוצהר אבל אין ישויות שנבנו ⇒ אין חבילת-שרת');
    else { const sf = SV.serverFiles(slug(name), ents); for (const f of sf) { const p = path.join(outDir, 'server', f.rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, f.content); } files.push({ route: 'server', dir: path.join(outDir, 'server'), count: sf.length, entities: ents }); } }
  // 2ג · התנהגות — רק כשהבעלים נתן דוגמאות (needsFor ⇒ NEEDS): (א) behavior-plan.planNeeds (עומק 3, הוכחה ב-Dart) · (ב) synth.synthesize (הכרעה-35: BFS עומק 4 על תאומים חיים,
  //      קלט-יחיד מושחל כמחרוזת) — מוכיח שני על אותן דוגמאות. תוצאות = הערות + behaviors.json ב-outDir; אפס כתיבה ל-capabilities/specs
  const B = await planBehaviors(form, answers);
  if (B && B.needs && Object.keys(B.needs).length) {
    const SY = await import('../machtzev/generator/synth.mjs'); const out = {};
    for (const [id, n] of Object.entries(B.needs)) {
      const p = (B.picks || {})[id] || {}; const rec = { demand: n.demand, plan: p.proven ? (p.chain || [p.pick]).filter(Boolean) : null, synth: null, synthNote: '' };
      // synth: דוגמה = קלט-יחיד ⇒ פלט; «'a', 'b'» (כמה ארגומנטים) אינו בר-השחלה — מדווח, לא מומצא
      const exs = (n.examples || []).map(([args, want]) => { const a = String(args).trim(), w = String(want).replace(/^r\s*==\s*/, '').trim(); const one = /^'[^']*'$|^"[^"]*"$|^[^,'"]+$/.test(a); return one ? { in: a.replace(/^['"]|['"]$/g, ''), out: w.replace(/^['"]|['"]$/g, '') } : null; });
      if (exs.every(Boolean) && exs.length) { const r = SY.synthesize(n.demand, exs); rec.synth = r ? r.chain : null; rec.synthNote = r ? `הוכח ב-synth: ${r.chain.join('∘')}${r.alts ? ` (+${r.alts} שקולות)` : ''}${r.shortcut ? ' · אטום-יחיד' : ''}` : 'synth: לא נמצאה שרשרת (עומק≤4)'; }
      else rec.synthNote = 'synth: לא חל — הדוגמאות עם כמה ארגומנטים (ההשחלה היא קלט-יחיד)';
      // genesis-gen: שרשרת מוכחת ⇒ ספק-חלקים (שפת genesis: כותרת/אטום/חישוב — knowledge/lexicon.json; הנוסחים מ-self-model.json) ⇒ מסך-Dart עם החישובים מחווטים.
      //   OUT של genesis = GEN_OUT (נתפס בייבוא) ⇒ רץ רק כשהסביבה מופנית מחוץ ל-new/ (אותו שומר-ניקיון של app-ds)
      if (rec.synth && !inRepo(process.env.GEN_OUT) && !inRepo(process.env.GEN_DATA_OUT)) {
        try {
          const GG = await import('../machtzev/generator/genesis-gen.mjs');
          const P = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'knowledge/self-model.json'), 'utf8')).phrases || {};
          const calc = rec.synth.map((fn) => `  חישוב ${(SY.fnsBy.get(fn)?.he || [fn]).join(' ')} (${fn})`);
          const gspec = [`${n.demand}:`, `כותרת ${P.capProofTitle || n.demand}`, `אטום ChipWrap ${n.demand}: ${exs.map((e) => e.in).join(' / ')}`, ...calc, `כותרת ${P.capFreeTitle || n.demand}`, `${P.fieldPrompt || ''} ${n.demand}`.trim(), ...calc].join('\n');
          const gslug = 'beh_' + slug(name) + '_' + (Object.keys(out).length + 1);
          const cls = GG.generate(gslug, gspec);
          rec.genesis = { slug: gslug, cls, file: path.join(R.outDir(), `gen_${gslug}.dart`) };
          files.push({ route: 'genesis', file: rec.genesis.file, cls, need: n.demand, chain: rec.synth });
        } catch (e) { rec.genesisNote = `genesis-gen: ${String(e.message || e).slice(0, 140)}`; }
      }
      out[id] = rec; notes.push(`התנהגות «${n.demand}» · תכנון: ${rec.plan ? rec.plan.join('∘') : 'לא הוכח'} · ${rec.synthNote}${rec.genesis ? ` · מסך: ${rec.genesis.cls}` : rec.genesisNote ? ' · ' + rec.genesisNote : ''}`);
    }
    fs.writeFileSync(path.join(outDir, 'behaviors.json'), JSON.stringify(out, null, 1)); files.push({ route: 'behavior', file: path.join(outDir, 'behaviors.json'), needs: Object.keys(out).length });
  }
  for (const a of (B && B.asks) || []) notes.push(`התנהגות «${a.thing}»: ${a.ask === 'examples' ? 'אין דוגמאות ⇒ שאלה' : a.ask}`);
  // 2ה · gen (המחולל השני, gen/): אותו ספק (ישויות · enum · שלבים · תפקידים) ⇒ הוכחת-אטומים בריצה מול המדף + אפליקציית-HTML בקובץ אחד + 12 עדשות-שאלה לכל ישות.
  //      קריאה בלבד (loadLang({write:false}) · readShelf · runGenerator בזיכרון); app.html · gen-report.json · gen-lenses.json ⇒ outDir. שורות-ספק שגֶן לא מכיר (עיצוב/שרת/חלקיק/דוח/תוכן) מסוננות.
  if (spec) {
    try {
      const [GE, GS, GL, GB, GN] = await Promise.all(['engine', 'shelf', 'lang', 'build', 'lenses'].map((m) => import(`../gen/${m}.mjs`)));
      const ents = spec.split('\n').filter((l) => /^ישות /.test(l));
      const roles = spec.split('\n').filter((l) => /^תפקיד /.test(l));
      const dash = spec.split('\n').filter((l) => /^לוח בקרה עם /.test(l)).map((l) => l.replace(/^לוח בקרה עם\s*/, '').split(',').map((p) => p.trim()).filter((p) => /^\S+?\(.+?\..+?\)$/.test(p))).flat();
      const appLine = spec.split('\n').find((l) => /^[^\s:]+: /.test(l) && !/^(ישות|דוגמה|תפקיד|עיצוב|שרת|דוח|תוכן|חלקיק) /.test(l));   // ראש-המשפט (specOf: «<appWord>: <head>») ⇒ שם-האפליקציה בתאום, לא שם-הריצה
      const genSpec = [appLine || `אפליקציה: ${name}`, ...ents, ...(dash.length ? [`לוח בקרה עם ${dash.join(', ')}`] : []), ...roles].join('\n');
      const { report, app: html } = await GE.runGenerator({ specText: genSpec, slug: slug(name), shelf: GS.readShelf(), NEEDS: GB.NEEDS, LANG: GL.loadLang({ write: false }) });
      fs.writeFileSync(path.join(outDir, 'app.html'), html);
      fs.writeFileSync(path.join(outDir, 'gen-report.json'), JSON.stringify({ ...report, atoms: report.atoms.map(({ src, ...a }) => a) }, null, 1));
      const kpi = new Set(report.dashboard.map((d) => d.entity));
      const lenses = Object.fromEntries(report.entities.map((e) => [e.name, GN.applyLenses(e, { roles: report.roles, automations: [], faces: [], kpiEntities: kpi }).filter((x) => x.open && !x.grammar).map((x) => ({ lens: x.name, q: x.q, why: x.why }))]));
      fs.writeFileSync(path.join(outDir, 'gen-lenses.json'), JSON.stringify(lenses, null, 1));
      const openN = Object.values(lenses).reduce((a, l) => a + l.length, 0);
      files.push({ route: 'gen', file: path.join(outDir, 'app.html'), bytes: html.length, atoms: report.atoms.length, unproven: report.unproven.length, proofs: report.proofs.length, lensesOpen: openN });
      notes.push(`gen (HTML): ${(html.length / 1024).toFixed(0)}KB · אטומים מוכחים ${report.atoms.length}${report.proofs.length ? ` (${report.proofs.map((p) => p.need + (p.chosen ? '⇒' + p.chosen : '⇒—')).join(' · ').slice(0, 160)})` : ''} · לא-מוכחים ${report.unproven.length} · עדשות פתוחות ${openN} על ${report.entities.length} ישויות`);
    } catch (e) { notes.push(`gen (HTML) לא רץ: ${String(e.message || e).slice(0, 160)}`); }
  }
  // 2ד · gold — מודול-זהב מורכב-מחדש מהשברים לישות (render-module.assembleByOps), נכתב רק ל-outDir
  const golds = [...new Map(routes.filter((r) => r.route === 'gold').map((r) => [r.module + '|' + r.thing, r])).values()];
  if (golds.length) { const RM = await import('../machtzev/generator/render-module.mjs'); let gi = 0;
    for (const r of golds) { try { const a = await RM.assembleByOps({ module: r.module, entity: r.thing }); const f = path.join(outDir, `gen_gold${++gi}.dart`); fs.writeFileSync(f, a.code || ''); files.push({ route: 'gold', file: f, thing: r.thing, module: path.basename(r.module), fragments: `${a.fragments}/${a.of}` }); } catch (e) { notes.push(`זהב ${r.thing}: ${String(e.message || e).slice(0, 120)}`); } } }
  // 3 · combine — מיזוג-סקציות בזיכרון ⇒ מניפסט ל-outDir ⇒ gen-screen ⇒ outDir
  const comb = routes.filter((r) => r.route === 'combine');
  if (comb.length) {
    const contentSet = new Set(); const sections = []; const sources = [];
    for (const r of [...new Map(comb.map((r) => [r.screen, r])).values()]) {
      const m = loadManifest(r.screen); if (!m) { notes.push(`מניפסט חסר: ${r.screen}`); continue; }
      for (const c of m.content || []) contentSet.add(c);
      for (const sec of m.sections || []) sections.push({ ...sec, id: sections.some((x) => x.id === sec.id) ? `${r.screen}__${sec.id}` : sec.id });
      sources.push({ screen: r.screen, thing: r.thing, score: r.score, sections: (m.sections || []).length });
    }
    if (sections.length) {
      const merged = { generated: true, src: `mavin:${sentence}`, screen: `gen_${slug(name)}_combined`, content: [...contentSet], sections };
      const mf = path.join(outDir, `${merged.screen}.manifest.json`); fs.writeFileSync(mf, JSON.stringify(merged, null, 1));
      const g = spawnSync(process.execPath, [GEN_SCREEN, mf, outDir], { encoding: 'utf8', cwd: R.ROOT });
      const out = (g.stdout || '') + (g.stderr || ''); const hit = out.match(/הורכב: (\S+)/);
      if (g.status === 0 && hit) files.push({ route: 'combine', file: path.join(R.ROOT, hit[1]), sources, sections: sections.length }); else notes.push(`gen-screen נכשל: ${out.trim().slice(0, 160)}`);
    }
  }
  return { form, routes: allRoutes, held: held.map((r) => r.thing), spec, skipped, files, notes, questions, none: allRoutes.filter((r) => r.route === 'none').map((r) => r.thing) };
}
