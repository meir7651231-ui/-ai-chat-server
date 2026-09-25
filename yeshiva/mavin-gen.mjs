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
import { formOf, specOf, answerFor, toks, serverDeclOf, sourceDeclsOf, rulesDeclOf, lookDeclOf, headOf, planBehaviors, sameStem, leadOf, recall, remember, carriersOf } from './mavin.mjs';
import { askMaimatai } from './kashe.mjs';   // המקשה (18 גלאים) — שאלות על המשפט, לא הנחות
import { rule as yeshivaRule } from './purpose.mjs';   // הפוסק (9 מהלכים) על האפיון שיצא
import { detectAllClauses, detectLevelsClause, relOpOf, emitAppFrom } from '../machtzev/generator/capability.mjs';
import { retrieveScreen } from '../machtzev/generator/retrieve-screen.mjs';
import { resolveEin } from './ein.mjs';
import { bufferDeclsOf } from './buffer.mjs';
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
  // צורת-מדרגות: ראש «<תווית> לפי <שדה>» + הקטע הבא «<n>, <n>» (הדלת פיצלה על נקודתיים) — רק כשהשדה קיים באיזו ישות (אחרת נשאר none עם החיפוש)
  form.segments.forEach((seg, i) => { const lv = detectLevelsClause(seg, form.segments[i + 1]); if (!lv) return; const has = form.things.some((t) => (t.fields || []).some((f) => sameStem(lv.x, f.label) || f.label === lv.x)); if (!has) return; capSegs.set(seg, { clauses: [lv], how: 'מדרגות' }); capSegs.set(form.segments[i + 1], { clauses: [lv], how: 'מדרגות', tail: seg }); });
  const srv = serverDeclOf(form), lk = lookDeclOf(form), head = headOf(form);
  const SRC = sourceDeclsOf(form); const srcThings = new Set(SRC.flatMap((x) => x.things));
  const RUL = rulesDeclOf(form); const ruleThings = new Set(RUL ? RUL.things : []);
  const BUF = bufferDeclsOf(form); const bufThings = new Set(BUF.flatMap((x) => x.things));   // אזור-המתנה עם תקרה ושחרור במנות   // חוקים על האפליקציה ⇒ דברי-הקטעים = הצהרה   // מקור מבחוץ ⇒ דברי-הקטע = הצהרה, לא ישות ולא «אין»
  const SHP = answers.__shape || null;   // חיפוש-לפי-צורה אושר (ein.shapeSearch) ⇒ דברי-הקטע = מסך-צורה, לא ישות ולא «אין»
  for (const t of form.things) {
    if (bufThings.has(t.label)) { const x = BUF.find((y) => y.things.includes(t.label)); routes.push({ thing: t.label, route: 'buffer', why: `אזור-המתנה של «${x.ent}» (${x.field}) · תקרה ${x.ceiling} · מנה ${x.batch} כל ${x.everyMin} דק׳` }); continue; }
    if (ruleThings.has(t.label)) { routes.push({ thing: t.label, route: 'rules', why: `חוק על האפליקציה (מצבים/תפקידים) ⇒ gen_app_rules` }); continue; }
    if (srcThings.has(t.label)) { const x = SRC.find((y) => y.things.includes(t.label)); routes.push({ thing: t.label, route: 'source', ent: x.ent, why: `מקור מבחוץ: השורות של «${x.ent}» מגיעות מהשרת (api/feed) ⇒ האפליקציה מושכת` }); continue; }
    if (SHP && SHP.things.includes(t.label)) { routes.push({ thing: t.label, route: 'shape', why: `צורת «${SHP.ent}» ⇒ ${SHP.atom} (מאושר) ⇒ מסך` }); continue; }
    if (head && t.src === form.segments[0] && !(srv && t === srv.thing) && !(lk && t === lk.thing) && !entLabels.has(t.label)) { routes.push({ thing: t.label, route: 'head', why: `ראש-המשפט (לפני הנקודתיים) ⇒ שם-האפליקציה «${head}» + לוח-הבית (אריח לכל ישות)` }); continue; }
    if (srv && t === srv.thing) { routes.push({ thing: t.label, route: 'server', why: `הצהרת-שרת «${srv.value}» ⇒ server.mjs (חבילת-שרת לישויות שנבנו)` }); continue; }
    if (lk && t === lk.thing) { routes.push({ thing: t.label, route: 'look', why: `הצהרת-עיצוב «${lk.value}${lk.extra ? ' ' + lk.extra : ''}» ⇒ app-ds.setLook (עור מהמדף: ds-pure/ds-tokens)` }); continue; }
    if (capSegs.has(t.src)) { const c = capSegs.get(t.src); routes.push({ thing: t.label, route: 'capability', tail: c.tail || null, why: c.how === 'טקסט' ? 'סעיף-תנאי מבני בקטע (capability.detectAllClauses)' : c.how === 'מדרגות' ? `מדרגות (capability.detectLevelsClause): «${c.clauses[0].label}» לפי «${c.clauses[0].x}» — ${(c.clauses[0].thresholds || [c.clauses[0].high, c.clauses[0].mid]).join(', ')}` : `תנאי לפי צורה: «${c.clauses[0].x}» ${c.clauses[0].op} ${c.clauses[0].n}`, seg: t.src, clauses: c.clauses }); continue; }
    if (entLabels.has(t.label)) { routes.push({ thing: t.label, route: 'appds', why: 'דבר עם שדות ⇒ ישות' }); continue; }
    const [b] = retrieveScreen(t.label, 1);
    /* דבר עם דוגמאות קלט⇒פלט = התנהגות (ein.examplesIO) — דמיון-מילים למסך רשום לא גובר עליו */ if (!(t.ioExamples && t.ioExamples.length) && b && b.score > 0) { routes.push({ thing: t.label, route: 'combine', proposal: true, why: `הצעה (תוכן ממקום אחר): דומה במילים למסך רשום ${b.name} (${(+b.score).toFixed(2)})`, screen: b.name, score: +b.score }); continue; }
    const g = (t.ioExamples && t.ioExamples.length) ? null : goldModuleFor(t.label);   // אחרי combine: תוספת בלבד — לא מחליף מסלול קיים («רק את הפלוסים»)
    if (g) { routes.push({ thing: t.label, route: 'gold', proposal: true, why: `הצעה (תוכן ממקום אחר): כותרות-זהב של ${path.basename(g.module)} חוזרות על «${g.words.join(' ')}» ${g.score} פעמים`, module: g.module }); continue; }
    // «אין» רק אחרי חיפוש (הכרעת-בעלים 23.9): כל מילה ביחידה נבדקת מול המדף (על אילו חלקיקים היא כתובה), מול שדות בגזע, ומול הגדרה זכורה; המסך-הדומה כבר נמדד
    const search = toks(t.label).filter((w) => !form.things.some((x) => x !== t && (sameStem(w, x.label) || (x.fields || []).some((f) => sameStem(w, f.label))))).map((w) => {
      const c = carriersOf(w); const fields = form.things.flatMap((x) => (x.fields || []).filter((f) => sameStem(w, f.label)).map((f) => `${x.label}.${f.label}`)); const rec = recall(w);
      return { word: w, form: c.form, carriers: c.logic.length + c.display.length + c.data.length, logic: c.logic.slice(0, 3), display: c.display.slice(0, 3), fields, remembered: rec ? String(rec.proposal) : null }; });
    const line = search.map((x) => `«${x.word}»: כתוב על ${x.carriers} חלקיקים${x.carriers ? ` (${[...x.logic, ...x.display].slice(0, 3).join(', ')})` : ''} · שדות בגזע ${x.fields.length ? x.fields.join(', ') : 0} · הגדרה זכורה ${x.remembered ? 'כן' : 'לא'}`).join(' | ');
    routes.push({ thing: t.label, route: 'none', search, why: `אין תנאי, אין שדות, מסך דומה ${b ? (+b.score).toFixed(2) : 0} · חיפוש: ${line || '—'} ⇒ שאלה` });
  }
  // דבר שנקרא כישות אבל הקטע שלו הוא סעיף-תנאי («התראה כשציון מתחת ל-55 וגם היעדרויות מעל 3» ⇒ «ישות התראה… עם היעדרויות מעל») — לא ישות: שורות-הספק שלו נמחקות
  const capThings = new Set(routes.filter((r) => r.route === 'capability').map((r) => r.thing));
  const specLines = spec.spec.split('\n').filter((l) => { const m = l.match(/^(\S+)\s+(.+?)(?:\s+עם\s|:)/); if (bufThings.size && [...bufThings].some((x) => new RegExp(`^\\S+\\s+${x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|:|$)`).test(l))) return false; if (ruleThings.size && [...ruleThings].some((x) => new RegExp(`^\\S+\\s+${x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|:|$)`).test(l))) return false; if (srcThings.size && [...srcThings].some((x) => new RegExp(`^\\S+\\s+${x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|:|$)`).test(l))) return false; if (SHP && SHP.things.some((x) => new RegExp(`^\\S+\\s+${x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|:|$)`).test(l))) return false; return !(m && capThings.has(m[2].trim()) && entLabels.has(m[2].trim())); });
  return { routes, spec: specLines.join('\n'), skipped: spec.skipped, builtin: spec.builtin };
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
export async function generateFromDoc(md, { outDir, name = 'doc', answers = {}, corpus = null } = {}) {
  const { perukToSpec } = await import('../machtzev/generator/peruk.mjs');
  const DS = await import('../machtzev/generator/doc-shape.mjs');   // 📐 קריאה לפי צורה (הכרעת-בעלים 24.9): peruk מכיר רק את שלד-הפירוק שלו
  const pk = perukToSpec(DS.htmlToMd(md), name); const shp = DS.docToSpec(md); const perukRead = Number((pk.node && pk.node.fields) || 0);
  const byShape = !!shp.spec && perukRead === 0;   // peruk קרא 0 שדות והמסמך מכיל טבלת-ישויות ⇒ הצורה קובעת (נמדד: מירון/72 ⇒ «תיק» כללי מהדאטה של peruk)
  const spec = byShape ? shp.spec : pk.spec; const node = byShape ? { ...(pk.node || {}), reader: 'doc-shape', fields: shp.ents.reduce((a, e) => a + e.fields.length, 0), entities: shp.ents.length, links: shp.links.length } : pk.node;
  // 🔁 המסמך עובר באותו צינור כמו משפט (לולאת ein · קושיות · חיפוש-צורה · התראות): דלת-המסמך רק מתרגמת — לא נתקעת ועוצרת
  // ⛏️ הכורה (yeshiva/koreh — בדפוס mine.py): קורפוס-הבעלים (תרחישים) מול שמות-הישויות ⇒ ערכים שחוזרים בכמה מקורות ⇒ שאלה «לאיזה שדה?» ⇒ שדה-בחירה
  const enums = {}; const mined = []; const rowsBy = {}; const newEnts = []; const extra = {}; const ruleTables = []; const ruleRes = {}; const gaps = []; const extraStages = {};
  if (byShape && corpus) { const K = await import('./koreh.mjs'); const res = K.mine(await K.corpusOf(corpus), shp.ents.map((e) => e.name)); K.ledger(res); mined.__units = res.units.map((u) => u.unit);
    for (const e of shp.ents) { const vals = res.candidates.filter((c) => c.ent === e.name && c.sources >= 3).slice(0, 8); if (vals.length < 2) continue; const key = `ערכים ${e.name}`;
      const said = typeof answers[key] === 'string' ? answers[key].trim() : ''; const f = e.fields.find((x) => x.name === said);
      if (f) { (enums[e.name] ??= {})[f.name] = vals.map((c) => c.name); mined.push(`${e.name}.${f.name} ⇐ ${vals.map((c) => c.name).join('/')}`); }
      else if (!said) mined.push({ q: { thing: 'כורה', ask: 'mined', key, q: `⛏️ בתרחישים (${res.corpus} מקורות) חוזרים ערכים של «${e.name}»: ${vals.map((c) => `${c.name} (${c.sources})`).join(' · ')}. לאיזה שדה הם שייכים? (${e.fields.map((x) => x.name).join(' · ')}) — ענה בשם השדה, או «לא»` } }); }
    // 🔢 יחידה ⇒ שדה (הכרעת-בעלים 24.9 «3»: הוא שואל פעם אחת וזוכר): «איש» אחרי מספר, ליד «נקודה» ⇒ «איזה שדה?» ⇒ K.rememberUnit ⇒ שורות-דוגמה
    const SLu = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8'));
    const umap = K.unitMap(); const shapeOf = (n) => shp.ents.find((x) => x.name === n);
    for (const u of res.units.filter((x) => x.sources >= 3 && x.ents.length).slice(0, 12)) { const key = `יחידה ${u.unit}`; const said = typeof answers[key] === 'string' ? answers[key].trim() : '';
      if (umap[u.unit]) continue; if (said) { const [se, sf] = said.split('.'); const XWu = SLu.extraFieldWord || 'שדה נוסף'; const isTable = (n) => !!shapeOf(n) || answers[`${SLu.newTableWord || 'טבלה'} ${n}`] === 'כן';
        // תשובה = «לא» · ישות.שדה (גם שדה שהבעלים הוסיף: «שדה נוסף ישות») · שם-טבלה = היחידה היא ספירת-שורות של הטבלה («ילדים» = מונה ילד)
        const ok = said === 'לא' || (sf ? (!!shapeOf(se) && (shapeOf(se).fields.some((f) => f.name === sf) || String(answers[`${XWu} ${se}`] || '').split(/\s*,\s*/).includes(sf))) : isTable(said)); if (ok) { K.rememberUnit(u.unit, said); umap[u.unit] = said; continue; } }
      const opts = u.ents.slice(0, 3).flatMap((x) => (shapeOf(x.ent) || { fields: [] }).fields.map((f) => `${x.ent}.${f.name}`)).slice(0, 16);
      mined.push({ q: { thing: 'כורה', ask: 'unit', key, q: `🔢 «${u.unit}» בא אחרי מספר ב-${u.sources} תרחישים${u.sample ? ` (למשל «${u.sample}»)` : ''}, ליד ${u.ents.slice(0, 3).map((x) => `«${x.ent}»`).join(' · ')}. איזה שדה זה? (${opts.join(' · ')}) — ענה ישות.שדה, או «לא»` } }); }
    // ⇄ הכיוון-ההפוך (תרחישים ⇒ מודל · הכרעות-בעלים 23.9 / 25.9): טבלה חסרה / הרחבת-טבלה ⇒ שאלה אחת לכל הצעה; «כן» ⇒ נכנס למודל
    { const SLg = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8')); const COg = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'knowledge/conditions.json'), 'utf8')); const skip = SLg.durationWords || [];
      const C = await K.corpusOf(corpus); const names = shp.ents.map((e) => e.name);
      const RL = K.rulesOf(C, names, { subjects: res.units.map((u) => u.unit).filter((u) => !skip.includes(u)), skip, instances: Object.fromEntries(res.candidates.map((x) => [x.name, x.ent])), when: COg.when || [] });
      const G = K.modelGaps(C, names, RL); const TW = SLg.newTableWord || 'טבלה', XW = SLg.extraFieldWord || 'שדה נוסף';
      for (const t of G.tables) { const key = `${TW} ${t.name}`; const said = typeof answers[key] === 'string' ? answers[key].trim() : ''; const saidF = typeof answers[`שדות ${t.name}`] === 'string' ? answers[`שדות ${t.name}`].split(/\s*,\s*/).filter(Boolean) : []; if (saidF.length) t.fields = [...new Set([...(t.fields || []), ...saidF])];
        if (said === 'כן') { { const fs0 = [...(t.fields || []), ...t.links.filter((l) => !(t.fields || []).includes(l))]; if (fs0.length) newEnts.push({ name: t.name, fields: fs0 }); else mined.push({ q: { thing: 'כורה', ask: 'newTableFields', key: `שדות ${t.name}`, q: `🆕 «${t.name}»: המחקר לא מונה שדות — אילו? (למשל: א, ב, ג)` } }); } mined.push(`🆕 ${t.name} ⇐ טבלה חדשה (תשובת-הבעלים) · קשרים ${t.links.join(', ') || '—'} · ${t.rules.length} כללים`); }
        gaps.push({ kind: 'table', key, name: t.name, q: `🆕 «${t.name}» חוזר ב-${t.sources} תרחישים ואין לו טבלה. כללים: ${t.rules.slice(0, 2).join(' · ') || '—'}${t.links.length ? ` · ליד ${t.links.join(', ')}` : ''}. לפתוח טבלה? (כן / לא)` }); }
      // 🔔 כללי-התרחישים ⇒ משפטי-התראה בשפה הקיימת (ruleClauses) — לטבלאות שאושרו ולטבלאות המסמך; מה שלא מתורגם ⇒ מדווח עם הסיבה
      ruleTables.push(...G.tables.filter((t) => newEnts.some((n) => n.name === t.name)).map((t) => ({ name: t.name, fields: newEnts.find((n) => n.name === t.name).fields })), ...shp.ents.map((e) => ({ name: e.name, alias: e.alias, fields: e.fields.map((f) => f.name.replace(/_/g, ' ')) })));
      ruleRes.R = RL; ruleRes.C = C;
      for (const x of G.extensions) { const key = `הרחבה ${x.ent}: ${x.add}`; const said = typeof answers[key] === 'string' ? answers[key].trim() : '';
        if (said === 'כן') { const f = x.add.split(/\s+[—–-]\s+/)[0].replace(/[.,]+$/, '').trim(); (extra[x.ent] ??= []).push(f); mined.push(`➕ ${x.ent} + ${f} (תשובת-הבעלים)`); }
        else if (said === (SLg.enumAnswerWord || 'ערך')) { const f = x.add.split(/\s+[—–-]\s+/)[0].replace(/[.,]+$/, '').trim(); const E = shp.ents.find((e) => e.name === x.ent); const kf = E && (E.fields.find((q) => /^kind$|^סוג$/.test(q.name)) || null);   // «מצב → שרב» = סוג-מצב, לא שדה
          if (kf) { const cur = (enums[x.ent] ??= {})[kf.name] || []; enums[x.ent][kf.name] = [...new Set([...cur, f])]; mined.push(`➕ ${x.ent}.${kf.name} ⇐ ${f} (ערך, תשובת-הבעלים)`); } else mined.push({ q: { thing: 'כורה', ask: 'extend', key, q: `«${x.ent}» אין לו שדה-סוג — «${f}» כשדה? (כן / לא)` } }); }
        gaps.push({ kind: 'extend', key, name: x.ent, q: `➕ המחקר כותב: «${x.ent} → ${x.add}» (${String(x.ex).split(':')[0]}). להוסיף ל«${x.ent}»? (כן / לא)` }); } }
    for (const e of shp.ents) { const rw = K.rowsOf(res, e, e.fields.map((f) => f.name), { enumField: Object.keys(enums[e.name] || {})[0] || null, map: umap }); if (rw.length) { rowsBy[e.name] = rw; mined.push(`${e.name}: ${rw.length} שורות-דוגמה`); } } }
  // ✍️ תשובות-הבעלים לשאלות הזרימה: «flow ratio» ⇒ ביטוי (מפתח-השאלה עצמו) · «שדה נוסף <ישות>» ⇒ שדה שהמסמך לא מנה (למשל מה שהמונים מודדים)
  const defs = {}; if (byShape) { const SLx = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8')); const XW = SLx.extraFieldWord || '';
    for (const f of shp.flows || []) { const k = f.field.replace(/_/g, ' '); if (typeof answers[k] === 'string' && answers[k].trim()) { defs[k] = answers[k].trim(); mined.push(`✍️ «${k}» = «${defs[k]}» (תשובת-הבעלים)`); } }
    for (const [k, v] of Object.entries(answers)) if (XW && k.startsWith(XW + ' ') && typeof v === 'string' && v.trim()) { const en = k.slice(XW.length + 1).trim(); extra[en] = v.split(/\s*,\s*/).filter(Boolean); mined.push(`✍️ ${en} + ${extra[en].join(', ')} (תשובת-הבעלים)`); } }
  let ruleCl = []; const effects = []; if (ruleRes.R) { const K2 = await import('./koreh.mjs'); const SLx0 = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8'));
    // שלבים לטבלה חדשה — רק מתשובת-הבעלים («שלבים ילד»: נמצא, בנקודה, נאסף); טבלאות-המסמך — מהמסמך
    for (const t of ruleTables) { let sd = answers[`שלבים ${t.name}`]; if (sd === 'כן') { const q = (ruleRes.R[t.name] || []).find((r) => r.type === 'seq' && r.seq); sd = q ? q.seq.join(', ') : ''; }   // «כן» = מחזור-החיים שבמחקר
      { const adj = Object.entries(answers).filter(([k, v]) => k.startsWith(`תואר ${t.name}: `) && typeof v === 'string' && !['לא', SLx0.descWord || 'תיאור'].includes(v.trim()) && !/ (מעל|מתחת ל?|הוא|היא) /.test(v)).map(([, v]) => v.trim()); if (adj.length) sd = [...(typeof sd === 'string' && sd.trim() ? sd.split(/\s*,\s*/) : []), ...adj].join(', '); }   // «תואר T: X» = שלב חדש (תשובת-הבעלים)
      const ne = newEnts.find((n) => n.name === t.name); if (typeof sd === 'string' && sd.trim() && ne) { ne.stages = sd.split(/\s*,\s*/).filter(Boolean); t.stages = ne.stages; } else if (typeof sd === 'string' && sd.trim()) { extraStages[t.name] = sd.split(/\s*,\s*/).filter(Boolean); t.stages = [...new Set([...(shp.ents.find((e) => e.name === t.name) || { states: [] }).states, ...extraStages[t.name]])]; } else if (!t.stages) { const E = shp.ents.find((e) => e.name === t.name); t.stages = E ? E.states : []; } }
    // 🕳️⇒🔁 ערוץ-החסרים (yeshiva/chaser): כל כלל של כל טבלה · כל טבלה/הרחבה חסרה ⇒ פותרים ⇒ משפט | שאלה | נבנה | מוצהר — לא נכתב-ונעצר
    for (const t of ruleTables) for (const r of (ruleRes.R[t.name] || ruleRes.R[t.name + 'ים'] || ruleRes.R[t.name.replace(/ה$/, 'ות')] || [])) gaps.push({ kind: 'rule', table: t, rule: r });
    const CH = await import('./chaser.mjs'); const CS = await import('./chaser-sources.mjs'); CS.registerAll(CH); const CAP = await import('../machtzev/generator/capability.mjs');
    const SLc = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8'));
    const seqBy = {}; for (const [t, rs] of Object.entries(ruleRes.R)) { const q = rs.find((r) => r.type === 'seq' && r.seq && r.seq.length >= 2); if (q) seqBy[t] = q.seq; }   // מחזור-חיים מהמחקר לכל טבלה
    // ⇄ «שדה <טבלה>: <מילה>» = שם שדה חדש (לא קיים) ⇒ שדה נוסף לטבלה (כמו «שדה נוסף») — תשובה לשאלת-חלק מההרכבה
    for (const [k, v] of Object.entries(answers)) { const mm = typeof v === 'string' && k.match(/^שדה (\S+): /); const t = mm && ruleTables.find((x) => x.name === mm[1]); if (!t || !v.trim() || v.trim() === 'לא' || t.fields.includes(v.trim())) continue; t.fields.push(v.trim()); (extra[t.name] ??= []).push(v.trim()); mined.push(`✍️ ${t.name} + ${v.trim()} (תשובת-הבעלים, קיבוץ)`); }
    // ✍️ כלל שהבעלים כתב («כלל <טבלה> <n>» = «תנאי → פעולה») נכנס לאותו ערוץ כמו כללי-המחקר — לא נשאר בקובץ-הסיכום
    for (const [k, v] of Object.entries(answers)) { const mm = k.match(new RegExp(`^${SLc.ownerRuleWord || 'כלל'} (\\S+)`)); if (!mm || typeof v !== 'string' || !v.trim()) continue; const [cond, act] = v.split(/\s*→\s*/);
      gaps.push({ kind: 'rule', owner: k, table: ruleTables.find((x) => x.name === mm[1]) || { name: mm[1], fields: [], stages: [] }, rule: { cond: cond.trim(), act: (act || SLc.alertWord || 'התראה').trim(), type: 'rule' } }); }
    for (const t of ruleTables) { const xs = String(answers[`${SLc.extraFieldWord || 'שדה נוסף'} ${t.name}`] || '').split(/\s*,\s*/).filter(Boolean); for (const x of xs) if (!t.fields.includes(x)) t.fields.push(x); }   // שדה שהבעלים הוסיף — גם הפותרים רואים אותו
    const CSx = await import('./chaser-sources.mjs'); const docRefs = {}; for (const e of shp.ents) for (const f of e.fields) for (const n of CSx.refNums(f.raw)) (docRefs[n] ??= []).push({ table: e.name, field: f.name.replace(/_/g, ' ') });   // 🔢 מספר-תרחיש ⇒ טבלה.שדה (המסמך)
    const docRaw = Object.fromEntries(shp.ents.map((e) => [e.name, e.fields.map((f) => ({ field: f.name.replace(/_/g, ' '), raw: f.raw }))]));
    const docTables = shp.ents.map((e) => ({ name: e.name, fields: e.fields.map((f) => f.name) }));
    const cctx = { docTables, actorWords: SLc.actorWords || [], actorFieldWords: SLc.actorFieldWords || [], condFieldWords: SLc.condFieldWords || [], decideVerbs: SLc.decideVerbs || [], docRaw, docRefs, glossary: SLc.glossary || {}, typeFieldWords: SLc.typeFieldWords || [], corpus: ruleRes.C, subs: [], descWord: SLc.descWord || 'תיאור', compareWords: SLc.compareWords || [], stateChangeWords: SLc.stateChangeWords || [], roleFieldWords: SLc.roleFieldWords || [], edgeFields: SLc.edgeFields || {}, reachWords: SLc.reachWords || [], effectVerbs: SLc.effectVerbs || [] };
    const done = await CH.resolveAll(gaps, { ...cctx, K: K2, answers, asked: new Set(), seqBy, tables: ruleTables, sinceWord: (SLc.sinceWords || ['זמן מאז'])[0], detect: CAP.detectAllClauses, alertWord: SLc.alertWord || 'התראה', whenWord: 'כש', aboveWord: 'מעל', belowWord: 'מתחת ל' });
    // 🌧️ השפעות-מצב שנבנו (תשובת-הבעלים = מקדם) ⇒ app-ds (עלה-שדה × מקדם כשמצב מהסוג פעיל) · הסוג נכנס לסוגי-המצב
    // 📋 כללים שהם שורות בטבלת-המסמך («תנאי → מי מחליט» ⇒ החלטה) ⇒ שורות-דוגמה (אותו מנגנון של הכורה)
    { const seen = new Set(); for (const x of done.filter((y) => y.outcome === 'built' && y.row)) { const key = x.row.values.join('|'); if (seen.has(key)) continue; seen.add(key); (rowsBy[x.row.table] ??= []).push(x.row.values); }
      if (seen.size) mined.push(`📋 ${seen.size} כללי «תנאי → מי מחליט» ⇒ שורות ב«${[...new Set(done.filter((y) => y.row).map((y) => y.row.table))].join(', ')}»`); }
    for (const x of done.filter((y) => y.outcome === 'built' && y.effect)) { effects.push(x.effect); const ME = shp.ents.find((e) => (SLc.modeEntityWords || []).includes(e.name)); const kf = ME && ME.fields.find((q) => /^kind$|^סוג$/.test(q.name)); if (kf) { const cur = (enums[ME.name] ??= {})[kf.name] || []; enums[ME.name][kf.name] = [...new Set([...cur, x.effect.kind])]; } mined.push(`🌧️ במצב ${x.effect.kind}: ${x.effect.ent}.${x.effect.field} × ${x.effect.n}`); }
    ruleCl = done.filter((x) => x.outcome === 'clause').filter((x, i, a) => a.findIndex((y) => y.clause === x.clause) === i);
    for (const x of done.filter((y) => y.outcome === 'question' && !y.dup)) mined.push({ q: { thing: 'כורה', ask: x.kind, key: x.key, q: x.q } });
    const SM = CH.summary(done); const TY = {}; for (const x of done.filter((y) => y.type)) TY[x.type] = (TY[x.type] || 0) + 1; mined.push(`🕳️ ערוץ-החסרים: ${done.length} חסרים ⇒ ${ruleCl.length} התראות · ${SM.question || 0} שאלות · ${SM.built || 0} נבנו · ${SM.declared || 0} מוצהרים (מתוכם לפי סוג-החץ: ${Object.entries(TY).map(([k, v]) => `${k} ${v}`).join(' · ') || '—'}) (rules-declared.json) · 🗂️ ${Object.entries(done.filter((x) => x.cls).reduce((a, x) => ((a[x.cls.split(' — ')[0]] = (a[x.cls.split(' — ')[0]] || 0) + 1), a), {})).map(([k, v]) => `${k} ${v}`).join(' · ')} · 🧩 ${cctx.subs.length} חלקים ⇒ ${JSON.stringify(CH.summary(cctx.subs))}${CH.silent([...done, ...cctx.subs]).length ? ` · ⛔ ${CH.silent([...done, ...cctx.subs]).length} שקטים` : ''}`);
    if (ruleCl.length) mined.push(`🔔 ${ruleCl.length} כללים ⇒ התראות: ${ruleCl.map((x) => `«${x.clause.replace(/^התראה כש/, '')}» → ${String(x.act || '').slice(0, 30)}`).join(' · ')}`);
    try { fs.mkdirSync(outDir, { recursive: true }); fs.writeFileSync(path.join(outDir, 'rules-declared.json'), JSON.stringify(done.filter((x) => x.outcome === 'declared').map((x) => ({ kind: x.kind, table: x.table && x.table.name, cls: x.cls || x.type || null, rule: x.rule && `${x.rule.cond} → ${x.rule.act}`, why: x.why })), null, 1)); } catch {} }
  const sen = byShape ? DS.docToSentence(md, { enums, rows: rowsBy, defs, extra, newEnts, extraStages, clauses: ruleCl.map((x) => x.clause) }) : null;
  const r = sen ? await generateAll(sen.sentence, { answers: { ...answers, __effects: effects, __corpus: corpus || null, __docEnts: shp.ents.map((e) => e.name), __subjects: (mined.__units || []) }, outDir, name }) : await generateFromSpec(spec, { outDir, name });
  if (corpus && byShape) { r.notes.push(`⛏️ כורה: ${mined.filter((m) => typeof m === 'string').length} שדות-בחירה מהתרחישים${mined.some((m) => typeof m === 'string') ? ' — ' + mined.filter((m) => typeof m === 'string').join(' · ') : ''} · ${mined.filter((m) => m.q).length} שאלות «לאיזה שדה»`); for (const m of mined) if (m.q) r.questions.push(m.q); }
  // 🔌 התראה מכלל שלא מחוברת לנתונים (מסך-הדגמה עם סליידר) אינה התראה — נמדד 25.9: 2 מתוך 9 נפלו בשקט לסליידר. כל כלל-התראה נבדק בקובץ שנוצר
  if (ruleCl.length && outDir) { const dir = path.join(outDir); const caps = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => /^gen_cap\d+\.dart$/.test(f)).map((f) => fs.readFileSync(path.join(dir, f), 'utf8')) : [];
    const norm = (t) => String(t).replace(/\s+/g, ' ').trim(); const statics = caps.filter((c) => !c.includes('appStore.records')).map((c) => norm((c.split('\n')[0].match(/: "(.*)"/) || [])[1] || ''));   // מסך בלי נתונים = מסך-הדגמה (הכותרת נושאת את המשפט)
    const dead = ruleCl.filter((x) => statics.some((t) => t && t.includes(norm(x.clause))));
    r.notes.push(`🔌 התראות-כללים מחוברות לנתונים: ${ruleCl.length - dead.length}/${ruleCl.length}`);
    for (const x of dead) r.questions.push({ thing: 'מנוע', ask: 'notLive', q: `⛔ «${x.clause}» נבנתה כמסך-הדגמה (סליידר), לא מחוברת לנתונים — המנוע לא יודע לחבר את הצורה הזו עדיין` }); }
  if (sen) { r.notes.push(`🔁 המסמך תורגם למשפט (${sen.ents.length} ישויות · ${sen.flows.length} זרימות ⇒ ${sen.flows.map((f) => `«${f.clause}»`).join(' · ') || '—'}) ⇒ אותו צינור כמו משפט`); r.docSentence = sen.sentence; }
  if (byShape && !sen) { r.notes.push(`📐 קריאה לפי צורה: שלד-הפירוק קרא 0 שדות ⇒ טבלת-ישויות במסמך: ${shp.ents.length} ישויות · ${node.fields} שדות · ${shp.links.length} קישורים לפי השמות שהמסמך נותן (${shp.links.slice(0, 5).map((l) => `${l.ent}.${l.field}→${l.to}`).join(' · ')}${shp.links.length > 5 ? ' …' : ''})`);
    for (const f of shp.flows) r.questions.push({ thing: 'זרימה', ask: 'flow', q: `זרימה «${f.ent}.${f.field} ${f.op} ${f.n}${f.unit} → ${f.then.slice(0, 60)}» נקראה — לא נבנתה: ${f.field} ${shp.ents.some((e) => e.fields.some((x) => x.name === f.field)) ? 'שדה בטבלה, אבל אין בדלת-המסמך בניית-התראות' : 'אינו שדה באף טבלה (ערך מחושב — מנוע)'} ` }); }
  else if (!byShape && perukRead === 0) r.questions.push({ thing: 'מסמך', ask: 'read', q: `⚠️ המסמך לא נקרא: שלד-הפירוק קרא 0 שדות ואין טבלת-ישויות — האפליקציה בנויה מברירות-המחדל של peruk, לא מהמסמך` });
  // 🔎 הקורא: כמה ישויות המסמך מתאר מול כמה נבנו — אובדן = שאלה, לא «0 שאלות»
  { const want = shp.ents.map((e) => e.name); const got = new Set(spec.split('\n').map((l) => (l.match(/^ישות\s+(.+?)\s+עם\s/) || [])[1]).filter(Boolean)); const lost = want.filter((w) => !got.has(w));
    if (lost.length) r.questions.push({ thing: 'מסמך', ask: 'lost', q: `המסמך מתאר ${want.length} ישויות, נבנו ${want.length - lost.length}: חסרות ${lost.join(' · ')}` }); }
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
    const latin = new Set((md.match(/[A-Za-z_]+/g) || []).map((w) => w.toLowerCase())); const said = (label) => toks(label).map(st).filter((w) => w.length >= 3).some((w) => docStems.has(w)) || (label.match(/[A-Za-z_]+/g) || []).some((w) => latin.has(w.toLowerCase()));   // גם מילים לועזיות (נמדד: «ok» במירון/72 סומן «לא נאמר»)
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
export async function generateAll(sentence, { answers = {}, outDir, name = 'mavin', proposals = false } = {}) {
  let form = formOf(sentence);
  let routed = routeOf(form, answers, { proposals });
  // 🕳️ «אין» ⇒ סוג ⇒ מפרק ⇒ מרכיב ⇒ שוב (yeshiva/ein.mjs · הכרעת-בעלים 23.9 «צא לדרך»): הגדרות, סימון-דוגמאות, דוגמאות קלט⇒פלט — עד שאין שינוי
  const defs = await resolveEin({ sentence, form, routed, answers, proposals, formOf, routeOf });
  sentence = defs.sentence; form = defs.form; routed = defs.routed;
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
  // ⚖️⇒🔎 כל קושיה עוברת במרכז-החיפוש (yeshiva/kushya · הכרעת-בעלים 25.9): כל מקור שנרשם שם מחפש; קושיית-חיפוש שלא חיפשה ⇒ ⛔
  const KU = await import('./kushya.mjs'); const KS = await import('./kushya-sources.mjs'); KS.registerAll(KU);
  const answered = await KU.answerAll(yesh.kushyot, { answers, outDir, notes });
  for (const q of answered) { const tag = q.searched.length ? ` ⇒ 🔎 ${q.searched.join('+')}: ${q.summary.join(' · ') || 'לא נמצא'}` : q.why === 'noSource' ? ' ⇒ 🔎 אין מקור בריצה הזו' : '';
    questions.push({ thing: 'הישיבה', ask: q.kind, q: `${q.kind}: ${q.text}${tag}` }); }
  for (const q of KU.unsearched(answered)) notes.push(`⛔ קושיה בלי חיפוש: ${q.kind} — יש לה מחפש רשום אבל אף מקור לא רץ`);
  yesh.answered = answered;
  for (const sw of yesh.switches) questions.push({ thing: 'הישיבה', ask: sw.move || sw.kind, q: `${sw.move || sw.kind}: ${sw.text}` });
  if (yesh.note) notes.push(yesh.note);
  if (yesh.rulings.length) notes.push(`הפוסק: ${yesh.rulings.filter((r) => r.decided).length} הוכרעו · ${yesh.switches.length} מתגים`);
  for (const r of held) notes.push(`הצעה לא נבנתה («${r.thing}» ⇒ ${r.route}): ${r.why.replace(/^הצעה \(תוכן ממקום אחר\): /, '')} — לבנייה: proposals / --proposals`);
  // 1 · capability — פעם אחת לכל קטע-תנאי
  const capSegs = [...new Map(routes.filter((r) => r.route === 'capability' && !r.tail).map((r) => [r.seg, r.clauses])).entries()];   // מדרגות: קטע-הזנב («90, 60») שייך לראש
  capSegs.forEach(([seg, clauses], i) => { const cls = `GenCap${i + 1}Screen`; if (clauses.every((c) => c.kind === 'levels')) return; const code = emitAppFrom(clauses.filter((c) => c.kind !== 'levels'), seg, cls); const f = path.join(outDir, `gen_cap${i + 1}.dart`); fs.writeFileSync(f, code); files.push({ route: 'capability', file: f, seg, thresholds: clauses.map((c) => `${c.x} ${c.op} ${c.n ?? '?'}`) }); });
  // 2 · app-ds — כל הישויות בקריאה אחת (GEN_OUT/GEN_DATA_OUT של הקורא)
  // 🔒 שומר-ניקיון: app-ds/render-ds קוראים GEN_OUT/GEN_DATA_OUT **בזמן-טעינה**. אם לא הופנו מחוץ למדף לפני הייבוא הראשון —
  //    הבנייה כותבת ל-new/dart-gen-bs ו-new/dart-data-bs/auto ומוחקת יתומים (קרה 23.9, שוחזר מ-git). כאן: מסרבים, לא מלכלכים.
  const caps = capSegs.map(([seg, clauses], i) => ({ slug: `cap${i + 1}`, cls: `GenCap${i + 1}Screen`, kind: 'capability', name: seg.trim(), icon: '🔔', value: (clauses.find((c) => c.n != null) || {}).n ?? (clauses.find((c) => c.kind === 'levels') || {}).high ?? null, clause: (() => { const ok = (c) => c.n != null || ((c.op === '=' || String(c.op || '')[0] === '@') && c.y); const main = clauses.find((c) => c.kind === 'levels') || clauses.find((c) => ok(c) && !c.and && !c.or) || clauses.find(ok) || null; const ands = clauses.filter((c) => c !== main && c.and && ok(c)), ors = clauses.filter((c) => c !== main && c.or && ok(c)); /* שוויון: סף = מילה, לא מספר */ return main ? { ...main, ...(ands.length ? { and: ands } : {}), ...(ors.length ? { or: ors } : {}) } : null; })(), sub: clauses.map((c) => { const i = c.x ? seg.indexOf(c.x) : -1; return i >= 0 ? seg.slice(i).trim() : `${c.x || ''} ${c.op || ''} ${c.n ?? ''}`.trim(); }).join(' · ') }));   // המילים של הבעלים («ציון מתחת ל-55»), לא סימן   // מסך-ההתראה ⇒ אריח בלוח-הבית וברכזת (הרכבה: לא קובץ-ליד)
  // ⚖️ נקודת-כיבוי מהבעלים (תשובה לשאלת-השופט «כיבוי <סעיף>») ⇒ clause.off ⇒ התראה עם היסטרזיס; כיוון לא-נכון ⇒ נשאל שוב
  const offOf = (seg, c) => { const raw = String(answers[`כיבוי ${seg.trim()}`] ?? '').trim(); if (!raw) return null; const v = Number(raw);   /* ריק ≠ 0 */ return c && c.n != null && Number.isFinite(v) && (c.op === '>' ? v < +c.n : c.op === '<' ? v > +c.n : false) ? v : null; };
  for (const cp of caps) if (cp.clause && offOf(cp.name, cp.clause) != null) cp.clause = { ...cp.clause, off: offOf(cp.name, cp.clause) };
  const BUF0 = bufferDeclsOf(form); BUF0.forEach((b, i) => caps.push({ slug: `buf${i + 1}`, cls: `GenBuf${i + 1}Screen`, kind: 'capability', name: b.seg, icon: '🚦', sub: `${b.ceiling} · ${b.batch}/${b.everyMin}`, value: null, clause: null, shape: true }));   // אזור-המתנה ⇒ אריח
  const SHP0 = answers.__shape || null; if (SHP0) caps.push({ slug: 'shape1', cls: 'GenShape1Screen', kind: 'capability', name: SHP0.seg, icon: '📋', sub: SHP0.atom, value: null, clause: null, shape: true });   // מסך-הצורה ⇒ אריח ברכזת
  const feeds = [...new Set(routes.filter((r) => r.route === 'source').map((r) => r.ent))]; if (feeds.length) notes.push(`מקור מבחוץ: ${feeds.join(', ')} ⇒ השרת מקבל שורות (POST <בנייה>/api/feed/<ישות>) · האפליקציה מושכת כל 3 שניות`);
  const rules = rulesDeclOf(form); if (rules) notes.push(`חוקים על האפליקציה: מצבים ${rules.modes.join(', ') || '—'} · תפקידים ${rules.roles.join(', ') || '—'} · ${Object.entries(rules.hide).map(([m, e]) => `במצב ${m} מוסתר ${e.join(', ')}`).concat(Object.entries(rules.only).map(([m, e]) => `במצב ${m} רק ${e.join(', ')}`), Object.entries(rules.see).map(([r, e]) => `${r} רואה רק ${e.join(', ')}`)).join(' · ') || 'בלי חוקים'}`);
  const derived = SHP0 && SHP0.linked ? [{ name: String(SHP0.seg).trim().split(/\s+/)[0], ent: SHP0.ent, parentKey: SHP0.fields[0], terms: SHP0.calc.terms, out: SHP0.out }] : [];   // 🔗 תוצאת-הקשר = שדה של האב (המילה הראשונה בסעיף: «צפי» / «יתרה»)
  const app = await runAppDs(spec, files, notes, questions, { feeds, rules, extraScreens: caps, derived, effects: Array.isArray(answers.__effects) ? answers.__effects : [], server: routes.some((r) => r.route === 'server') });   // «שרת בענן» ⇒ האפליקציה מסתנכרנת מהשרת (gen_app_sync)
  // 2א · הרכבה (insight.mjs · הכרעת-בעלים 23.9 «תחבר»): התראה עם קישור-נתונים ⇒ מסך-תובנה אחד מהנתונים האמיתיים במקום הדמו של capability
  if (app && Array.isArray(app.liveExtras) && !inRepo(process.env.GEN_OUT)) {
    const IN = await import('../machtzev/generator/insight.mjs');
    for (const x of app.liveExtras) { if (x.shape) continue; if (!x.live) { notes.push(x.why || `הרכבה «${x.name}»: אין ישות עם השדה ⇒ נשאר מסך-capability (דמו)`); if (x.ask) questions.push({ thing: x.name, ask: x.ask, q: x.why }); else if (!x.why && x.clause && x.clause.x) questions.push({ thing: x.name, ask: 'field', key: x.clause.x, q: `«${x.clause.x}» (ב«${x.name}») אינו שדה באף טבלה ⇒ נבנה מסך-דמו. מה זה: שדה של טבלה, או חישוב משדות קיימים?` }); continue; }   // נתקע ⇒ שאלה, לא דמו בשקט
      const entLine = spec.split('\n').find((l) => new RegExp(`^ישות\\s+\\S.*\\s+עם\\s`).test(l) && (() => { const m = l.match(/^ישות\s+(.+?)\s+עם\s+(.+)$/); return m && Object.entries({}).length === 0 && x.live.slug && true; })());
      const ents = spec.split('\n').map((l) => l.match(/^ישות\s+(.+?)\s+עם\s+(.+)$/)).filter(Boolean).map((m) => ({ name: m[1].trim(), fields: m[2].split('|')[0].split(/[,،]/).map((f) => f.trim().replace(/\{[^}]*\}$/, '')).filter(Boolean) }));
      const entOfSlug = (sl) => { const m0 = spec.split('\n').map((l) => l.match(/^ישות\s+(.+?)\s+עם\s/)).filter(Boolean).map((m) => m[1].trim()); return ents.find((e) => app.nameToSlug && app.nameToSlug[e.name] === sl) || null; };
      const ent = (x.live.kind === 'refCount' || x.live.kind === 'agg' || x.live.kind === 'aggBy' || x.live.kind === 'linked' || x.live.kind === 'expr') ? (entOfSlug(x.live.slug) || ents.find((e) => e.fields.includes(x.live.field)) || ents[0]) : (ents.find((e) => e.fields.includes(x.live.field)) || ents[0]);
      // מונה-קשר: רשומות-הבנות מהדוגמאות של ישות-הבת (השדה המצביע ⇐ live.childField); הורה מזוהה לפי השדה הראשון שלו
      const childRecs = (() => { if (x.live.kind !== 'refCount') return null; const ce = ents.find((e) => app.nameToSlug && app.nameToSlug[e.name] === x.live.childSlug); if (!ce) return null; const SLc = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8')); const l = spec.split('\n').find((q) => q.startsWith(`${SLc.exampleWord} ${ce.name}:`)); if (!l) return null; const cfi = ce.fields.indexOf(x.live.childField); return l.slice(l.indexOf(':') + 1).split(';').map((r) => r.split(/[,،]/).map((v) => v.trim())).map((r) => (r[cfi] || '').trim()); })();
      const childCount = (r) => (childRecs ? childRecs.filter((v) => v && v === (r[0] || '').trim()).length : 0);
      const linkedOf = (r) => { const d = derived.find((q) => q.name === (x.live.base || x.live.field)); const o = d && d.out.find((q) => q.key === (r[0] || '').trim()); if (!o) return null; if (!x.live.arith) return o.value;
        const fi2 = ent ? ent.fields.indexOf(x.live.arith.field) : -1; const fv = fi2 >= 0 ? parseFloat(r[fi2]) : NaN; if (!Number.isFinite(fv)) return null; const v = x.live.arith.op === '/' ? o.value / fv : x.live.arith.op === '*' ? o.value * fv : o.value + fv; return Math.round(v * 1000) / 1000; };   // ⊕ אותה פעולה כמו ב-Dart   // 🔗 הערך שהקשר חישב על הדוגמאות
      // הציפייה מהדוגמאות של הבעלים (אימות מול הייעוד): אילו רשומות עונות לתנאי — לפי הצורה, בלי המצאה
      let expect = null; const SLd = JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'spec-lang.data.json'), 'utf8'));
      if (x.live.window) notes.push(`חלון-זמן «${x.name}»: ${x.live.window} דקות אחרונות — לדוגמאות במשפט אין זמן-כניסה ⇒ הקבלה נבדקת במבחן-המקור (שורות שנכנסות עכשיו)`);
      if (x.live.agg === 'trend') notes.push(`צפי «${x.name}»: קו-מגמה על קריאות עם זמן ⇒ הערך בעוד ${x.live.horizon || 0} דקות — לדוגמאות אין זמן ⇒ הקבלה במבחן-המקור (קריאות פרושות על האופק)`);
      if (ent && SLd.exampleWord && !x.live.window && x.live.agg !== 'trend') { const exLine = spec.split('\n').find((l) => l.startsWith(`${SLd.exampleWord} ${ent.name}:`)); if (exLine) { const LE0 = await import('../machtzev/generator/live-expr.mjs'); const recs = exLine.slice(exLine.indexOf(':') + 1).split(';').map((r) => r.split(/[,،]/).map((v) => v.trim())).filter((r) => LE0.livePreOk(x.live, r, (f) => ent.fields.indexOf(f))); const fi = ent.fields.indexOf(x.live.field); const thr0 = LE0.liveThreshold(x.live); const lt0 = x.live.op === '<';
        let qctx = null; if (x.live.kind === 'expr' && LE0.exprHasQueue(x.live.tree)) {   // 🌉 «המתנה צפויה»: אותו מנוע (systems-engine) מריץ את הדוגמאות ⇒ ציפייה אמיתית + הערה לבעלים
          const tuples = []; const coll = (t, r) => { if (!t) return; if (t.queue) { const a = t.queue.map((q) => LE0.exprJs(q, r)); if (a.every((v) => v != null)) tuples.push(a); } coll(t.a, r); coll(t.b, r); }; for (const r of recs) coll(x.live.tree, r);
          const J = await import('./shofet.mjs'); const sw = J.simWaitJs(tuples);
          if (sw.values) { const m = new Map(tuples.map((a, i) => [a.join('|'), sw.values[i]])); qctx = { queue: (a) => m.get(a.join('|')) }; notes.push(`🌉 «${x.name}» (סימולציית-תור, מנוע-המערכות): ${recs.map((r) => { const v = LE0.exprJs(x.live.tree, r, qctx); return `${r[0] || '?'} ${v == null ? '?' : Number.isFinite(v) ? v.toFixed(2) : '∞'}`; }).join(' · ')}`); }
          else notes.push(`🌉 «${x.name}»: ${sw.reason || sw.error || '?'}`); }
        const sampleOf = (r) => x.live.kind === 'refCount' ? childCount(r) : x.live.kind === 'linked' ? linkedOf(r) : x.live.kind === 'expr' ? LE0.exprJs(x.live.tree, r, qctx) : LE0.liveSample(x.live, r[fi]);   // מונה-קשר: כמה רשומות-בנות בדוגמאות מצביעות על ההורה
        if (x.live.kind === 'levels') { const gs = LE0.liveGroupsSample(x.live, recs, fi, -1).filter((g) => g[0] !== '' && g[1] != null); const rows = gs.sort((a, b) => (b[0] > a[0] ? 1 : -1)).map((g) => [g[0], String(g[1])]); expect = { count: rows.length, rows, groups: gs }; }
        else if (x.live.kind === 'aggBy') { const bi = ent.fields.indexOf(x.live.by); const gs = LE0.liveGroupsSample(x.live, recs, fi, bi).filter((g) => g[1] != null); const rows = gs.filter((g) => LE0.liveHit(x.live, g[1])).map((g) => [g[0], String(g[1])]); expect = { count: rows.length, rows, groups: gs }; }
        else if (x.live.kind === 'agg') { const v = LE0.liveAggSample(x.live, recs, fi); const hit = v != null && LE0.liveHit(x.live, v); expect = { count: v == null ? '' : (Math.round(v * 10) / 10).toString(), rows: hit ? recs.map((r) => [r[0] || '', r[fi] || '']) : [], agg: v }; }
        else { const rows = recs.filter((r) => { const v = sampleOf(r); return (v != null && LE0.liveHit(x.live, v)) || LE0.liveAltOk(x.live, r, (f) => ent.fields.indexOf(f)); }).map((r) => [r[0] || '', x.live.kind === 'refCount' ? String(childCount(r)) : x.live.kind === 'linked' ? (x.live.arith ? linkedOf(r).toFixed(2) : String(linkedOf(r))) : x.live.kind === 'expr' ? ((v) => qctx && !Number.isFinite(v) ? '∞' : v.toFixed(Number.isInteger(+x.live.n) ? 0 : 2))(LE0.exprJs(x.live.tree, r, qctx)) : (r[fi] || '')]); expect = { count: rows.length, rows }; }
          if (x.live.kind === 'expr' && (LE0.exprNeedsAge(x.live.tree) || LE0.exprHasLinked(x.live.tree))) { expect = null; notes.push(`⊕⊕ «${x.name}»: ביטוי עם ${LE0.exprNeedsAge(x.live.tree) ? 'זמן-מאז (תלוי-שעון ושלב)' : 'תוצאת-קשר'} ⇒ הקבלה בבדיקת-מארח, לא מהדוגמאות`); } } }   // הציפייה בצורת-התנאי (מספר / ותק / מונה-קשר / קבוצה)
      const seedSlug = fs.existsSync(path.join(outDir, 'gen_app_seed.dart')) ? 'app_seed' : null;
      // ההחלטה האחת — אטום מהקטלוג, מוכח בהרצה (behavior-plan) על הדוגמאות של הבעלים + גבול-הסף מצורת היחס («מתחת ל» = ממש מתחת ⇒ 55 אינו חורג)
      let decide = null;
      if (ent && SLd.exampleWord) { const exLine = spec.split('\n').find((l) => l.startsWith(`${SLd.exampleWord} ${ent.name}:`)); const fi = ent.fields.indexOf(x.live.field);
        const LE = await import('../machtzev/generator/live-expr.mjs'); const thr = LE.liveThreshold(x.live);
        const recs0 = exLine ? exLine.slice(exLine.indexOf(':') + 1).split(';').map((r) => r.split(/[,،]/).map((v) => v.trim())) : [];
        const vals = x.live.kind === 'aggBy' ? LE.liveGroupsSample(x.live, recs0, fi, ent.fields.indexOf(x.live.by)).map((g) => g[1]).filter((v) => v != null) : x.live.kind === 'agg' ? [LE.liveAggSample(x.live, recs0, fi)].filter((v) => v != null) : x.live.kind === 'refCount' ? recs0.map((r) => childCount(r)) : x.live.kind === 'linked' ? recs0.map((r) => linkedOf(r)).filter((v) => v != null) : x.live.kind === 'expr' ? recs0.map((r) => LE.exprJs(x.live.tree, r)).filter((v) => v != null) : (exLine && fi >= 0 ? recs0.map((r) => LE.liveSample(x.live, (r[fi] || '').trim())).filter((v) => v != null) : []);
        if (String(x.live.op || '')[0] === '@') { decide = { name: x.live.op.slice(1), file: x.live.atomFile, proven: true, examples: [] }; notes.push(`החלטה «${x.name}»: ${decide.name} (${decide.file}) — היחס שנלמד מהסימון (הוכח בלימוד מול הדוגמאות, תאום מאומת מול Dart)`); }
        else if (x.live.kind === 'levels' && exLine && fi >= 0) {   // מדרגות: אטום-ההחלטה = מי שמחזיר את המדרגה לפי הצורה (≥גבוה ⇒ 2 · ≥בינוני ⇒ 1 · 0) על הדוגמאות — הוכחה-בריצה, לא שם
          const lv = recs0.map((r) => parseFloat(r[fi])).filter((v) => !isNaN(v)); const examples = lv.map((v) => [`${Math.trunc(v)}, ${x.live.high}, ${x.live.mid}`, `r == ${LE.levelOf(x.live, v)}`]);
          if (examples.length) { try { const BP = await import('../machtzev/generator/behavior-plan.mjs'); const id = `lvl.${x.slug}`; const P = BP.planNeeds({ [id]: { shape: 'מספר', demand: x.sub || x.name, params: ['int', 'int', 'int'], ret: 'int', examples } }, { prove: true, earlyExit: true }); const pr = P[id];
            if (pr && pr.pick && pr.proven) { decide = { name: pr.pick, file: pr.file, proven: true, examples }; notes.push(`החלטה «${x.name}»: ${pr.pick} (${pr.file}) הוכח על ${examples.length} דוגמאות${pr.ties ? ` · ${pr.ties} תיקו` : ''}`); }
            else notes.push(`החלטה «${x.name}»: אין אטום-מדרגות מוכח בקטלוג ⇒ השוואה ביד (מדווח)`); } catch (e) { notes.push(`החלטה «${x.name}»: behavior-plan נכשל — ${String(e.message || e).slice(0, 120)}`); } } }
        else if (vals.length && x.live.agg !== 'trend') { const isEq = x.live.kind === 'eq'; const q = (v) => (isEq ? `'${String(v).replace(/'/g, "\\'")}'` : v); const examples = [...vals.map((v) => [`${q(v)}, ${q(thr)}`, `r == ${LE.liveHit(x.live, v)}`]), [`${q(thr)}, ${q(thr)}`, `r == ${isEq}`], ...(isEq && String(thr).trim() ? [[`'', ${q(thr)}`, 'r == false'], [`${q(String(thr) + String(thr))}, ${q(thr)}`, 'r == false']] : [])];   // שוויון: הריק לעולם אינו שווה לסף (צורה) — מפריד שוויון מ-≤
          try { const BP = await import('../machtzev/generator/behavior-plan.mjs'); const id = `sev.${x.slug}`; const P = BP.planNeeds({ [id]: { shape: 'מספר', demand: x.sub || x.name, params: isEq ? ['String', 'String'] : ['num', 'num'], ret: 'bool', examples } }, { prove: true, earlyExit: true }); const pr = P[id];
            if (pr && pr.pick && pr.proven) { decide = { name: pr.pick, file: pr.file, proven: true, examples }; notes.push(`החלטה «${x.name}»: ${pr.pick} (${pr.file}) הוכח על ${examples.length} דוגמאות${pr.ties ? ` · ${pr.ties} תיקו` : ''}`); }
            else notes.push(`החלטה «${x.name}»: אין אטום מוכח בקטלוג ⇒ השוואה ביד (מדווח)`); } catch (e) { notes.push(`החלטה «${x.name}»: behavior-plan נכשל — ${String(e.message || e).slice(0, 120)}`); } } }
      try { const r = IN.emitInsight({ slug: x.slug, cls: x.cls, name: x.name, live: x.live, entity: x.live.kind === 'aggBy' ? { name: ent ? ent.name : '', fields: [x.live.by, x.live.field] } : (ent || { name: '', fields: [x.live.field] }), expect, seedSlug, words: x.sub || null, decide }); for (const l of r.ledger) notes.push(l.slice(0, 400)); notes.push(`הרכבה «${x.name}»: ${r.wired}/${r.ops} פעולות עם אטום · לרישום כיכולת: node machtzev/generator/insight.mjs --register ${path.join(outDir, `insight_${x.slug}.json`)}`); notes.push(`הרכבה «${x.name}»: ${r.wired}/${r.ops} פעולות עם אטום${r.missing.length ? ` · בלי אטום: ${r.missing.join(', ')}` : ''} ⇒ ${x.cls} (insight_${x.slug}.json)${r.accept ? ` · מבחן-קבלה: ${expect.count} חורגים ${expect.rows.map((q) => q.join('/')).join(', ')}` : ' · אין דוגמאות ⇒ אין מבחן-קבלה'}`); files.push({ route: 'insight', file: path.join(outDir, `gen_${x.slug}.dart`), cls: x.cls, ops: r.ops, wired: r.wired }); }
      catch (e) { notes.push(`הרכבה «${x.name}» נכשלה: ${String(e.message || e).slice(0, 160)} ⇒ נשאר מסך-capability`); } }
  }
  // 🌉 מסך שמייבא את מנוע-המערכות («המתנה צפויה») ⇒ הקובץ נכתב עכשיו מה-TS (emitTs) ליד המסכים; אין מנוע ⇒ שאלה, לא קובץ מזויף
  { const dirs = [...new Set([R.outDir(), process.env.GEN_OUT].filter(Boolean))]; const LEq = await import('../machtzev/generator/live-expr.mjs');
    const uses = dirs.some((d) => fs.existsSync(d) && fs.readdirSync(d).some((f) => f.endsWith('.dart') && f !== 'gen_sim_engine.dart' && fs.readFileSync(path.join(d, f), 'utf8').includes(LEq.SIM_IMPORT)));
    if (uses) { const J = await import('./shofet.mjs'); const se = await J.simEngineDart();
      if (se.available) { const f = path.join(R.outDir(), 'gen_sim_engine.dart'); fs.writeFileSync(f, se.code); files.push({ route: 'sim', file: f }); notes.push(`🌉 מנוע-המערכות ⇒ Dart (${Math.round(se.code.length / 1024)}KB, emitTs) · המתנה צפויה מחושבת בסימולציה באפליקציה`); }
      else questions.push({ thing: 'מנוע-המערכות', q: `«המתנה צפויה» צריכה את מנוע-המערכות: ${se.reason}` }); }
    // 🔗 אותו דפוס למנוע-התלות (systems-engine/sensors/graph.reach) — «נופלים איתו»
    const usesG = dirs.some((d) => fs.existsSync(d) && fs.readdirSync(d).some((f) => f.endsWith('.dart') && f !== 'gen_graph_engine.dart' && fs.readFileSync(path.join(d, f), 'utf8').includes(LEq.GRAPH_IMPORT)));
    if (usesG) { const J = await import('./shofet.mjs'); const ge = await J.graphEngineDart();
      if (ge.available) { const f = path.join(R.outDir(), 'gen_graph_engine.dart'); fs.writeFileSync(f, ge.code); files.push({ route: 'graph', file: f }); notes.push(`🔗 מנוע-התלות ⇒ Dart (graph.reach, emitTs) · «נופלים איתו» מחושב באפליקציה`); }
      else questions.push({ thing: 'מנוע-התלות', q: `«נופלים איתו» צריך את מנוע-המערכות: ${ge.reason}` }); } }
  // 2א'' · מקור מבחוץ: מבחן-קבלה — שורה (מהדוגמאות של הבעלים, לא ממציאים) נכנסת דרך ingestFeed ⇒ הטבלה גדלה והערך בה
  if (feeds.length && app && app.nameToSlug && fs.existsSync(path.join(R.outDir(), 'gen_app_feed.dart')) && !inRepo(process.env.GEN_OUT)) {
    const lit = (v) => "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$') + "'";
    const tests = feeds.map((en) => { const t = form.things.find((x) => x.label === en); const row = t && t.examples && t.examples[0]; const sl = app.nameToSlug[en]; if (!row || !sl) return null;
      return [`  test(${lit(`מקור מבחוץ: «${en}» ⇒ שורה נכנסת לטבלה`)}, () {`, `    final before = appStore.records('${sl}').length;`, `    expect(ingestFeed('${sl}', ${lit(JSON.stringify([row]))}), 1);`, `    expect(appStore.records('${sl}').length, before + 1);`, `    expect(appStore.records('${sl}').any((r) => r.values.contains(${lit(row[0])})), isTrue);`, '  });'].join('\n'); }).filter(Boolean);
    // חלון-זמן: השורות של הבעלים נכנסות עכשיו (חותמת מלאה) ⇒ מסך-התנאי מחשב רק עליהן ⇒ הערך הצפוי מאותה צורה (live-expr) בצד-JS — נבדק ראשון (החנות משותפת לכל הבדיקות בקובץ)
    const LEw = await import('../machtzev/generator/live-expr.mjs'); const imps = new Set(); const winTests = [];
    for (const x of (app.liveExtras || [])) { if (!x.live || x.live.agg !== 'trend' || !x.cls) continue; const en = Object.keys(app.nameToSlug).find((n) => app.nameToSlug[n] === x.live.slug); if (!en || !feeds.includes(en)) continue;
      const t = form.things.find((y) => y.label === en); const rows = (t && t.examples) || []; const fi = t ? t.fields.findIndex((f) => f.label === x.live.field) : -1; if (rows.length < 2 || fi < 0) continue;
      const H = x.live.horizon || 0, span = Math.max(1, H || 30), mins = rows.map((r, i) => Math.round(span - (span * i) / (rows.length - 1)));   // הקריאות פרושות על פני האופק (הישנה ראשונה) — הזמנים נקבעים בזמן-הריצה של הבדיקה
      const v = LEw.trendAt(rows.map((r, i) => [-mins[i], parseFloat(r[fi])]).filter((p) => !isNaN(p[1])), H); if (!Number.isFinite(v)) continue; const want = String(Math.round(v * 10) / 10);
      imps.add(`import 'package:buildsmart/genesis/dart-gen-bs/gen_${x.slug}.dart';`); imps.add(`import 'dart:convert';`);
      winTests.push([`  testWidgets(${lit(`צפי: «${x.name}» — ${rows.length} קריאות על ${span} דקות ⇒ בעוד ${H} דקות ${want}`)}, (tester) async {`, '    final now = DateTime.now();', `    ingestFeed('${x.live.slug}', jsonEncode({'rows': ${JSON.stringify(rows).replace(/'/g, "\\'").replace(/"/g, "'")}, 'at': [${mins.map((m) => `now.subtract(const Duration(minutes: ${m})).toIso8601String()`).join(', ')}]}));`, `    await tester.pumpWidget(MaterialApp(home: ${x.cls}()));`, '    await tester.pump();', `    expect(find.textContaining(${lit(want)}), findsWidgets, reason: ${lit(`קו-המגמה על הקריאות ⇒ בעוד ${H} דקות ${want}`)});`, '  });'].join('\n')); }
    for (const x of (app.liveExtras || [])) { if (!x.live || !x.live.window || !x.cls) continue; const en = Object.keys(app.nameToSlug).find((n) => app.nameToSlug[n] === x.live.slug); if (!en || !feeds.includes(en)) continue;
      const t = form.things.find((y) => y.label === en); const rows = (t && t.examples) || []; if (!rows.length) continue; const fi = t.fields.findIndex((f) => f.label === x.live.field);
      let want = null; if (x.live.kind === 'agg') { const v = LEw.liveAggSample(x.live, rows, fi); if (v != null) want = String(Math.round(v * 10) / 10); } else if (fi >= 0) want = String(rows.filter((r) => { const v = LEw.liveSample(x.live, r[fi]); return v != null && LEw.liveHit(x.live, v); }).length);
      if (want == null) continue; imps.add(`import 'package:buildsmart/genesis/dart-gen-bs/gen_${x.slug}.dart';`);
      winTests.push([`  testWidgets(${lit(`חלון-זמן: «${x.name}» על שורות שנכנסו עכשיו ⇒ ${want}`)}, (tester) async {`, `    ingestFeed('${x.live.slug}', ${lit(JSON.stringify(rows))});`, `    await tester.pumpWidget(MaterialApp(home: ${x.cls}()));`, '    await tester.pump();', `    expect(find.textContaining(${lit(want)}), findsWidgets, reason: ${lit(`ב-${x.live.window} הדקות האחרונות נכנסו ${rows.length} שורות ⇒ ${want}`)});`, '  });'].join('\n')); }
    if (tests.length) fs.writeFileSync(path.join(R.outDir(), 'gen_app_feed_accept_test.dart'), [`// 🎯 מבחן-קבלה (מקור מבחוץ): שורה שמגיעה מבחוץ נכנסת לטבלה · חלון-זמן על מה שנכנס עכשיו. חולל; אל תערוך.`, `import 'package:flutter/material.dart';`, `import 'package:flutter_test/flutter_test.dart';`, `import 'package:buildsmart/genesis/dart-gen-bs/gen_app_feed.dart';`, `import 'package:buildsmart/genesis/dart-ui-bs/ds/ds_store.dart';`, ...imps, 'void main() {', ...winTests, ...tests, '}', ''].join('\n'));
  }
  // 2א''' · חוקים על האפליקציה: מבחן-קבלה — מצב שמסתיר ⇒ האריח נעלם מהרכזת ו-visibleOf=false; תפקיד שרואה רק ⇒ האחרים לא נראים
  if (rules && app && app.nameToSlug && fs.existsSync(path.join(R.outDir(), 'gen_app_rules.dart')) && !inRepo(process.env.GEN_OUT)) {
    const lit = (v) => "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$') + "'"; const sl = (n) => app.nameToSlug[n];
    const hubCls = ((fs.readFileSync(path.join(R.outDir(), 'gen_app_hub.dart'), 'utf8').match(/^class (\w+Screen) extends/m)) || [])[1]; const T0 = [];
    for (const [m, es] of Object.entries(rules.hide)) for (const e of es) if (sl(e)) T0.push([`  testWidgets(${lit(`במצב ${m} מסתירים ${e}`)}, (tester) async {`, `    appStore.setSetting('mode', ${lit(rules.modes[0] || '')}); appStore.setRole(0);`, ...(hubCls ? [`    await tester.pumpWidget(const MaterialApp(home: ${hubCls}()));`, '    await tester.pump();', `    expect(find.text(${lit(e)}), findsWidgets);`] : []), `    expect(visibleOf('${sl(e)}'), isTrue);`, `    appStore.setSetting('mode', ${lit(m)});`, ...(hubCls ? ['    await tester.pump();', `    expect(find.text(${lit(e)}), findsNothing, reason: ${lit(`במצב ${m} האריח «${e}» מוסתר`)});`] : []), `    expect(visibleOf('${sl(e)}'), isFalse);`, `    appStore.setSetting('mode', ${lit(rules.modes[0] || '')});`, '  });'].join('\n'));
    for (const [r, es] of Object.entries(rules.see)) { const ri = rules.roles.indexOf(r); const others = Object.keys(app.nameToSlug).filter((n) => !es.includes(n)); if (ri < 0) continue;
      T0.push([`  test(${lit(`${r} רואה רק ${es.join(', ')}`)}, () {`, `    appStore.setSetting('mode', ${lit(rules.modes[0] || '')}); appStore.setRole(${ri});`, ...es.filter(sl).map((e) => `    expect(visibleOf('${sl(e)}'), isTrue, reason: ${lit(`${r} רואה ${e}`)});`), ...others.filter(sl).map((e) => `    expect(visibleOf('${sl(e)}'), isFalse, reason: ${lit(`${r} לא רואה ${e}`)});`), '    appStore.setRole(0);', '  });'].join('\n')); }
    if (T0.length) fs.writeFileSync(path.join(R.outDir(), 'gen_app_rules_accept_test.dart'), [`// 🎯 מבחן-קבלה (חוקים על האפליקציה): מצב שמסתיר · תפקיד שרואה רק. חולל; אל תערוך.`, `import 'package:flutter/material.dart';`, `import 'package:flutter_test/flutter_test.dart';`, `import 'package:buildsmart/genesis/dart-gen-bs/gen_app_rules.dart';`, ...(hubCls ? [`import 'package:buildsmart/genesis/dart-gen-bs/gen_app_hub.dart';`] : []), `import 'package:buildsmart/genesis/dart-ui-bs/ds/ds_store.dart';`, 'void main() {', ...T0, '}', ''].join('\n'));
  }
  // 2א'''' · אזור-המתנה (yeshiva/buffer): מסך + מבחן-קבלה (הסכום · שחרור מנה · קצב)
  if (BUF0.length && app && app.nameToSlug && !inRepo(process.env.GEN_OUT)) { const BM = await import('./buffer.mjs'); const seedSlug = fs.existsSync(path.join(outDir, 'gen_app_seed.dart')) ? 'app_seed' : null;
    BUF0.forEach((b, i) => { const es = app.nameToSlug[b.ent]; if (!es) return; const slug = `buf${i + 1}`, cls = `GenBuf${i + 1}Screen`; const e = BM.emit(b, { cls, slug, entSlug: es, seedSlug });
      fs.writeFileSync(path.join(R.outDir(), `gen_${slug}.dart`), e.code); if (e.test) fs.writeFileSync(path.join(R.outDir(), `gen_${slug}_accept_test.dart`), e.test);
      files.push({ route: 'buffer', file: path.join(R.outDir(), `gen_${slug}.dart`), cls }); notes.push(`אזור-המתנה «${b.seg}»: ${b.ent}.${b.field} · תקרה ${b.ceiling} · מנה ${b.batch} כל ${b.everyMin} דק׳ · על הדוגמאות הגיעו ${b.sum} ⇒ בפנים ${e.in0}${e.out0 ? `, בחוץ ${e.out0}` : ''} (כניסה רק כשיש מקום — לפי הפסק) ⇒ אחרי מנה ${e.after1}`); }); }
  // 2א' · מסך-הצורה (yeshiva/shape): הרשומות החיות ⇒ האטום שנמצא לפי הצורה ⇒ טבלה; מבחן-קבלה מתוצאת-התאום על הדוגמאות
  if (SHP0 && app && app.nameToSlug && app.nameToSlug[SHP0.ent] && !inRepo(process.env.GEN_OUT)) { const SHm = await import('./shape.mjs'); const seedSlug = fs.existsSync(path.join(outDir, 'gen_app_seed.dart')) ? 'app_seed' : null;
    const e = SHP0.linked ? SHm.emitLinked({ shp: SHP0, cls: 'GenShape1Screen', entSlug: app.nameToSlug[SHP0.ent], slugOf: (n) => app.nameToSlug[n], title: SHP0.seg, seedSlug }) : SHm.emit({ shp: SHP0, cls: 'GenShape1Screen', entSlug: app.nameToSlug[SHP0.ent], title: SHP0.seg, seedSlug });
    fs.writeFileSync(path.join(R.outDir(), 'gen_shape1.dart'), e.code); if (e.test) fs.writeFileSync(path.join(R.outDir(), 'gen_shape1_accept_test.dart'), e.test);
    files.push({ route: 'shape', file: path.join(R.outDir(), 'gen_shape1.dart'), cls: 'GenShape1Screen', atom: SHP0.atom }); notes.push(`מסך-צורה «${SHP0.seg}» ⇒ ${SHP0.atom} על הרשומות של «${SHP0.ent}» · עמודות: ${e.cols.join(', ')} · מבחן-קבלה: ${e.expect.length} ערכים`); }
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
      // 🐣 מדף-הנולדים (yeshiva/born.mjs · הכרעת-בעלים 24.9 «תסגור»): (א) נולד שמוכיח בהרצה ⇒ בלי BFS · (ב) synth · (ג) נולד כחוליה-ראשונה + synth (עומק מעבר ל-4)
      //   (ד) שלב-ביניים מהבעלים (mid) ⇒ שני חיפושים קצרים · הצלחה מהרכבה (שרשרת ≥2 / ג / ד) ⇒ נולדת. כישלון ⇒ שאלה על שלב-ביניים, לא «אין» יבש.
      if (exs.every(Boolean) && exs.length) { const BN = await import('./born.mjs'); const hit = BN.find(SY, exs);
        if (hit) { rec.synth = hit.chain; rec.born = 'found'; rec.synthNote = `נמצא במדף-הנולדים: ${hit.chain.join('∘')} (נולד ${String(hit.at).slice(0, 10)} ל«${hit.thing}») — הוכח בהרצה על ${exs.length} הדוגמאות, בלי חיפוש`; }
        else { let r = SY.synthesize(n.demand, exs), how = r ? `הוכח ב-synth: ${r.chain.join('∘')}${r.alts ? ` (+${r.alts} שקולות)` : ''}${r.shortcut ? ' · אטום-יחיד' : ''}` : '';
          if (!r) { const c = BN.compose(SY, n.demand, exs); if (c) { r = { chain: c.chain }; how = `הוכח מנולד «${c.via.thing}» (${c.via.chain.join('∘')}) + synth: ${c.chain.join('∘')} — עומק ${c.chain.length}`; } }
          if (!r && n.mid) { const st = BN.steps(SY, n.demand, exs, n.mid); if (st && st.chain) { r = { chain: st.chain }; how = `הוכח משלב-הביניים שנתת (${n.mid.join(', ')}): ${st.chain.join('∘')}`; } else how = `שלב-הביניים (${n.mid.join(', ')}) לא נסגר: ${st && st.failed === 'first' ? 'קלט ⇒ ביניים' : st && st.failed === 'second' ? 'ביניים ⇒ פלט' : 'השרשרת המלאה'} לא נמצא`; }
          rec.synth = r ? r.chain : null; rec.synthNote = r ? how : (how || 'synth: לא נמצאה שרשרת (עומק≤4)');
          if (r && (r.chain.length >= 2 || !/^הוכח ב-synth/.test(how))) { BN.add({ thing: n.thing || n.demand, demand: n.demand, chain: r.chain, behavior: n.behavior || { examples: n.examples, params: n.params, ret: n.ret }, how }); rec.born = 'new'; rec.synthNote += ' · 🐣 נולד למדף-הנולדים'; }
          if (!r && !rec.plan) questions.push({ thing: n.thing || n.demand, ask: 'mid', key: n.thing || n.demand, q: `«${n.thing || n.demand}»: אין אטום ואין הרכבה עד עומק 4 — תן שלב-ביניים: לכל דוגמה (${exs.map((e) => e.in).join(' / ')}) הערך שבאמצע הדרך ⇒ שני חיפושים קצרים ⇒ אטום חדש נולד` }); } }
      else { rec.synthNote = 'synth: לא חל — הדוגמאות עם כמה ארגומנטים (ההשחלה היא קלט-יחיד) ⇒ מנוע-התכנון (Dart, רב-פרמטרי)';
        // מסך רב-קלט: העץ שמנוע-התכנון הוכיח ⇒ ביטוי-Dart (אטום · פרמטר · קבוע) ⇒ שדה לכל קלט + התוצאה חיה. צומת אחר (זמן/שקע/תנאי) ⇒ מדווח, בלי מסך
        const tree = p.proven ? (B.trees || {})[id] : null;
        if (tree && !inRepo(process.env.GEN_OUT)) { const files0 = new Set(); const dartOf = (v) => v.k === 'p' ? `p${v.i}` : v.k === 'c' ? v.dart : (v.k === 'a' || v.k === 'f') ? (files0.add(v.file), `${v.id}(${v.args.map(dartOf).join(', ')})`) : null;
          let expr = null; try { expr = dartOf(tree); if (/null/.test(String(expr)) && !/null/.test(JSON.stringify(tree))) expr = null; } catch { expr = null; }
          if (expr && [...files0].every(Boolean)) { const k = (n.params || []).length; const gslug = 'beh_' + slug(name) + '_' + (Object.keys(out).length + 1); const cls = 'Gen' + gslug.split('_').map((w) => w[0].toUpperCase() + w.slice(1)).join('') + 'Screen';
            const parse = (t, i) => (t === 'int' ? `int.tryParse(_c[${i}].text.trim()) ?? 0` : t === 'num' || t === 'double' ? `num.tryParse(_c[${i}].text.trim()) ?? double.nan` : `_c[${i}].text`);
            const lit = (v) => "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$') + "'";
            const code = [`// 🧬 חולל ע"י הדלת (mavin-gen · התנהגות רב-קלט) — דוגמאות ⇒ עץ מוכח ב-Dart (behavior-plan) ⇒ מסך. אל תערוך ידנית.`, `// 🧬 עץ: ${expr}`,
              ...[...files0].sort().map((f) => `import '../${f}';`), `import 'package:flutter/material.dart';`, '',
              `class ${cls} extends StatefulWidget {`, `  const ${cls}({super.key});`, '  @override', `  State<${cls}> createState() => _${cls}State();`, '}', '',
              `class _${cls}State extends State<${cls}> {`, `  final List<TextEditingController> _c = List.generate(${k}, (_) => TextEditingController());`,
              `  String _out() { try { ${(n.params || []).map((t, i) => `final p${i} = ${parse(t, i)};`).join(' ')} return (${expr}).toString(); } catch (_) { return ''; } }`,
              '  @override', '  void dispose() { for (final c in _c) { c.dispose(); } super.dispose(); }',
              '  @override', `  Widget build(BuildContext context) => Scaffold(`, `        appBar: AppBar(title: Text(${lit(n.demand)})),`,
              '        body: ListView(padding: const EdgeInsets.all(16), children: [', `          for (var i = 0; i < ${k}; i++) Padding(padding: const EdgeInsets.only(bottom: 8), child: TextField(key: Key('beh-in-\$i'), controller: _c[i], decoration: InputDecoration(labelText: '\${i + 1}'), onChanged: (_) => setState(() {}))),`,
              `          Text(_out(), key: const Key('beh-out'), style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w700)),`, '        ]),', '      );', '}', ''].join('\n');
            const f = path.join(R.outDir(), `gen_${gslug}.dart`); fs.writeFileSync(f, code); rec.genesis = { slug: gslug, cls, file: f }; files.push({ route: 'genesis', file: f, cls, need: n.demand, tree: expr });
            // 🎯 מבחן-קבלה: כל דוגמה של הבעלים — מקלידים את הקלטים, התוצאה על המסך חייבת להיות הפלט (אותו מנגנון *_accept_test שהמארח מריץ)
            const unq = (v) => String(v).trim().replace(/^'(.*)'$/, '$1'); const lines = (n.examples || []).map(([a, w]) => { const ins = String(a).split(/\s*,\s*/).map(unq); const o = unq(String(w).replace(/^r\s*==\s*/, ''));
              return [`  testWidgets(${lit(`${n.demand}: ${ins.join(', ')} ⇒ ${o}`)}, (tester) async {`, `    await tester.pumpWidget(const MaterialApp(home: ${cls}()));`, ...ins.map((v, i) => `    await tester.enterText(find.byKey(const Key('beh-in-${i}')), ${lit(v)});`), '    await tester.pump();', `    expect(tester.widget<Text>(find.byKey(const Key('beh-out'))).data, ${lit(o)}, reason: ${lit(`הדוגמה דורשת «${o}»`)});`, '  });'].join('\n'); });
            fs.writeFileSync(path.join(R.outDir(), `gen_${gslug}_accept_test.dart`), [`// 🎯 מבחן-קבלה מהדוגמאות של הבעלים (התנהגות רב-קלט). חולל; אל תערוך.`, `import 'package:flutter/material.dart';`, `import 'package:flutter_test/flutter_test.dart';`, `import 'package:buildsmart/genesis/dart-gen-bs/gen_${gslug}.dart';`, 'void main() {', ...lines, '}', ''].join('\n'));
          } else rec.genesisNote = 'מסך רב-קלט: העץ כולל צומת שאינו אטום/פרמטר/קבוע ⇒ בלי מסך (מדווח)'; } }
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
  // ⚖️ השופט (systems-engine · הכרעת-בעלים 24.9 «כמו הישיבה — חלק מהמחולל»): המחולל עונה על שאלות-המבנה מתוך מה שבנה
  //    (עובדות בלבד) ⇒ pureJudge ⇒ הפסק כמו שהוא: שורה בהערות (מהלך + איסור ראשון) + judge.md מלא ליד הקבצים. אין שופט ⇒ «לא-נמדד».
  { const J = await import('./shofet.mjs'); /* «מתנדנד» הוא עובדה רק על ערך שעולה ויורד חי (נמדד: «ציון מעל 81» — ציון קבוע; «תאריך מעל 7 ימים» — עולה בלבד; «בין 60 ל-90» — כבר שני ספים ⇒ לא).
       חי = מחושב מטבלאות אחרות (linked) · נכנס מבחוץ (מקור) · בחלון-זמן · קו-מגמה. תנאי מורכב (וגם/או) — לא מסומן. */
    const LEj = await import('../machtzev/generator/live-expr.mjs');
    const fedSlugs = new Set(feeds.map((en) => app && app.nameToSlug && app.nameToSlug[en]).filter(Boolean));
    const swings = (lv) => lv && /^[<>]$/.test(lv.op || '') && !(lv.pre || []).length && !(lv.alt || []).length && lv.kind !== 'age' && lv.kind !== 'levels' && (lv.kind === 'linked' || (lv.kind === 'expr' && LEj.exprHasLinked(lv.tree)) || !!lv.window || lv.agg === 'trend' || fedSlugs.has(lv.slug));
    const alerts = ((app && app.liveExtras) || []).filter((x) => x.live && swings(x.live)).map((x) => ({ seg: String(x.name).trim(), n: x.live.n, op: x.live.op, off: offOf(String(x.name), x.live) }));
    for (const a of alerts.filter((x) => x.off != null)) { notes.push(`⚖️ «${a.seg}»: נקודת-כיבוי נפרדת — נכנס ${a.op === '>' ? 'מעל' : 'מתחת ל'} ${a.n}, יוצא רק ${a.op === '>' ? 'מתחת ל' : 'מעל'} ${a.off} (היסטרזיס, לפי הפסק)`);
      const sm = J.simulateHysteresis({ n: a.n, off: a.off, op: a.op });   /* 🎲 הוכחת-המהלך בהרצה — רעש סינתטי מוצהר, לא נתונים */
      if (sm.error) notes.push(`🎲 סימולציה «${a.seg}»: שגיאה — ${sm.error}`); else if (sm.available) notes.push(`🎲 סימולציה «${a.seg}» (systems-engine · רעש סינתטי סביב ${a.n}, סטיית-תקן ${sm.sd}, ${sm.steps} צעדים, זרע ${sm.seed}): בלי פער ${sm.without} הדלקות · עם הפער ${sm.with}`); }
    for (const a of alerts.filter((x) => x.off == null)) questions.push({ thing: a.seg, ask: 'off', key: `כיבוי ${a.seg}`, q: `⚖️ השופט: «${a.seg}» נדלקת ונכבית באותה נקודה (${a.n}) ⇒ תתנדנד. באיזה ערך לכבות אותה? (מספר ${a.op === '>' ? 'מתחת ל' : 'מעל '}${a.n})` });
    const cases = J.casesOf({ app: (form.things.find((t) => !t.fields || !t.fields.length) || {}).label || name, alerts: alerts.filter((x) => x.off == null), buffers: BUF0, feeds });
    // 🧭 שני מקורות לאותו מספר (שדה «X=מוחלט(א-ב)») ⇒ מנוע אי-הידיעה (אח של השופט): מה אסור להחליט ומה הבדיקה הזולה
    { const ABS = (JSON.parse(fs.readFileSync(path.join(R.GEN_DIR, 'chrome.data.json'), 'utf8')).fnAbs) || null;
      for (const t of form.things) for (const f of t.fields || []) { const m = ABS && f.formula && f.formula.match(new RegExp(`^${ABS}\\((.+?)-(.+)\\)$`)); if (!m) continue;
        if (!J.judgeHome()) { notes.push(`🧭 אי-ידיעה: לא-נמדד — ${J.judgeHome.reason}`); break; }
        const r = J.judgeWith('uncertainty', J.twoSourceCase({ app: name, ent: t.label, a: m[1].trim(), b: m[2].trim(), field: f.label })); if (r.error || !r.result) { notes.push(`🧭 אי-ידיעה «${t.label}.${f.label}»: ${r.error || r.reason}`); continue; }
        const o = r.result.output || {}; const mv = typeof o.move === 'string' ? o.move : (o.move && (o.move.text || o.move.move)) || '';
        notes.push(`🧭 אי-ידיעה «${m[1].trim()} מול ${m[2].trim()} ב${t.label}»: ${o.fields ? o.fields.decision : ''} · אסור: ${(o.forbidden || []).map((x) => x.text).join(' · ')}${mv ? ` · מהלך: ${mv}` : ''}${r.rejected ? ' · 🐞 הבודק פסל' : ''}`);
        if (r.text) fs.appendFileSync(path.join(outDir, 'judge.md'), `\n## 🧭 ${m[1].trim()} מול ${m[2].trim()} (${t.label})\n\n${r.text}\n`); } }
    if (cases.length) { if (!J.judgeHome()) notes.push(`⚖️ שופט: לא-נמדד — ${J.judgeHome.reason}`);
      else { const md = []; for (const c of cases) { const r = J.judge(c); if (r.error) { notes.push(`⚖️ שופט «${c.where}»: שגיאה — ${r.error}`); continue; }
          const v = r.verdict || {}; notes.push(`⚖️ שופט ${c.where}: ${Object.keys(c.structure).join('+')} ⇒ ${v.status === 'refused' ? `מסרב להכריע: ${(v.refusal || {}).reason || ''} · יציאה: ${(v.refusal || {}).exit_condition || (v.refusal || {}).exit || ''}` : `מהלך: ${v.leverage_move || v.needs_one_question || '—'}`}${(v.forbidden || []).length ? ` · אסור: ${v.forbidden[0].text || v.forbidden[0]}` : ''}${r.rejected ? ` · 🐞 הבודק של השופט פסל (${r.violations.map((x) => x.rule).join(',')}) — באג במנוע` : ''}`);
          md.push(`## ${c.where}\n\nמבנה (מהמחולל): ${Object.keys(c.structure).join(', ')}\n\n${r.text || ''}`); }
        if (md.length) fs.writeFileSync(path.join(outDir, 'judge.md'), `# ⚖️ השופט על האפליקציה\n\n${md.join('\n\n')}\n`); } } }
  return { form, routes: allRoutes, held: held.map((r) => r.thing), spec, skipped, files, notes, questions, none: allRoutes.filter((r) => r.route === 'none').map((r) => r.thing) };
}
