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
import { formOf, specOf, answerFor, toks } from './mavin.mjs';
import { detectAllClauses, emitApp } from '../machtzev/generator/capability.mjs';
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
const GEN_SCREEN = path.join(R.ROOT, 'machtzev/assemble/gen-screen.mjs');
function loadManifest(screen) {   // קריאה בלבד (העתק של combine-screens.loadManifest — אינו מיוצא שם)
  const f = path.join(MAN, `screens__${screen}.manifest.json`);
  if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const g of fs.readdirSync(MAN)) { const m = JSON.parse(fs.readFileSync(path.join(MAN, g), 'utf8')); if (m.screen === screen) return m; }
  return null;
}
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'x';

/** ניתוב לפי צורה: לכל יחידה — לאיזה מנוע קיים היא הולכת ולמה. */
export function routeOf(form, answers = {}) {
  const spec = specOf(form, answers);
  const entLabels = new Set(spec.spec.split('\n').filter((l) => /^ישות /.test(l)).map((l) => l.replace(/^ישות /, '').split(' עם ')[0].trim()));
  const routes = [];
  const capSegs = new Set();
  for (const seg of form.segments) if (detectAllClauses(seg).length) capSegs.add(seg);
  for (const t of form.things) {
    if (capSegs.has(t.src)) { routes.push({ thing: t.label, route: 'capability', why: 'סעיף-תנאי מבני בקטע (capability.detectAllClauses)', seg: t.src }); continue; }
    if (entLabels.has(t.label)) { routes.push({ thing: t.label, route: 'appds', why: 'דבר עם שדות ⇒ ישות' }); continue; }
    const [b] = retrieveScreen(t.label, 1);
    if (b && b.score > 0) { routes.push({ thing: t.label, route: 'combine', why: `דומה למסך רשום ${b.name} (${(+b.score).toFixed(2)})`, screen: b.name, score: +b.score }); continue; }
    const g = goldModuleFor(t.label);   // אחרי combine: תוספת בלבד — לא מחליף מסלול קיים («רק את הפלוסים»)
    if (g) { routes.push({ thing: t.label, route: 'gold', why: `כותרות-זהב של ${path.basename(g.module)} חוזרות על «${g.words.join(' ')}» ${g.score} פעמים`, module: g.module }); continue; }
    routes.push({ thing: t.label, route: 'none', why: 'אין תנאי, אין שדות, אין מסך דומה ⇒ שאלה' });
  }
  return { routes, spec: spec.spec, skipped: spec.skipped, builtin: spec.builtin };
}

/** הפעלה: כל מסלול למנוע שלו; כתיבה רק ל-outDir. מחזיר את הקבצים שנוצרו ופערים. */
export async function generateAll(sentence, { answers = {}, outDir, name = 'mavin' } = {}) {
  const form = formOf(sentence);
  const { routes, spec, skipped } = routeOf(form, answers);
  fs.mkdirSync(outDir, { recursive: true });
  const files = [], notes = [];
  // 1 · capability — פעם אחת לכל קטע-תנאי
  const capSegs = [...new Set(routes.filter((r) => r.route === 'capability').map((r) => r.seg))];
  capSegs.forEach((seg, i) => { const cls = `GenCap${i + 1}Screen`; const code = emitApp(seg, cls); const f = path.join(outDir, `gen_cap${i + 1}.dart`); fs.writeFileSync(f, code); files.push({ route: 'capability', file: f, seg }); });
  // 2 · app-ds — כל הישויות בקריאה אחת (GEN_OUT/GEN_DATA_OUT של הקורא)
  let app = null;
  // 🔒 שומר-ניקיון: app-ds/render-ds קוראים GEN_OUT/GEN_DATA_OUT **בזמן-טעינה**. אם לא הופנו מחוץ למדף לפני הייבוא הראשון —
  //    הבנייה כותבת ל-new/dart-gen-bs ו-new/dart-data-bs/auto ומוחקת יתומים (קרה 23.9, שוחזר מ-git). כאן: מסרבים, לא מלכלכים.
  const inRepo = (p) => !p || path.resolve(p).startsWith(path.resolve(R.ROOT, 'new'));
  if (spec && (inRepo(process.env.GEN_OUT) || inRepo(process.env.GEN_DATA_OUT))) { notes.push('⛔ app-ds לא הופעל: GEN_OUT/GEN_DATA_OUT חייבים להצביע מחוץ ל-new/ לפני הייבוא הראשון (שומר-ניקיון)'); }
  else if (spec) { const { buildApp } = await import('../machtzev/generator/app-ds.mjs'); const logs = []; const _l = console.log; console.log = (...a) => logs.push(a.join(' ')); try { app = buildApp(spec, { writePlan: false }); } finally { console.log = _l; } for (const l of logs) if (/נמצאו-ומחווטים/.test(l)) notes.push(l.slice(0, 140)); files.push({ route: 'appds', screens: app.screens.map((s) => `${s.kind}:${s.name}`) }); }
  // 2ב · gold — מודול-זהב מורכב-מחדש מהשברים לישות (render-module.assembleByOps), נכתב רק ל-outDir
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
  return { form, routes, spec, skipped, files, notes, none: routes.filter((r) => r.route === 'none').map((r) => r.thing) };
}
