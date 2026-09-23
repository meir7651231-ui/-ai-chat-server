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
import { formOf, specOf, answerFor, toks, serverDeclOf, lookDeclOf, planBehaviors } from './mavin.mjs';
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
export function clausesByForm(seg, frame = []) {
  if (detectAllClauses(seg).length) return [];
  const ws = toks(seg), F = new Set(frame), out = [];
  for (let i = 0; i < ws.length; i++) {
    if (!/^\d+$/.test(ws[i])) continue;
    let j = i - 1; if (j >= 0 && /^[֐-׿]$/.test(ws[j])) j--;   // «מתחת ל 5»: אות-יחס בודדת בין היחס למספר
    const op = j >= 0 ? relOpOf(ws[j]) : null; if (!op) continue;
    const x = ws.slice(0, j).filter((w) => !F.has(w) && !/^\d+$/.test(w)); if (!x.length) continue;
    out.push({ x: x.join(' '), op, n: ws[i], y: ws[i], trigger: ws.slice(i + 1).filter((w) => !F.has(w)).slice(0, 2).join(' ') });
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
  const srv = serverDeclOf(form), lk = lookDeclOf(form);
  for (const t of form.things) {
    if (srv && t === srv.thing) { routes.push({ thing: t.label, route: 'server', why: `הצהרת-שרת «${srv.value}» ⇒ server.mjs (חבילת-שרת לישויות שנבנו)` }); continue; }
    if (lk && t === lk.thing) { routes.push({ thing: t.label, route: 'look', why: `הצהרת-עיצוב «${lk.value}» ⇒ app-ds.setLook (עור מהמדף: ds-pure/ds-tokens)` }); continue; }
    if (capSegs.has(t.src)) { const c = capSegs.get(t.src); routes.push({ thing: t.label, route: 'capability', why: c.how === 'טקסט' ? 'סעיף-תנאי מבני בקטע (capability.detectAllClauses)' : `תנאי לפי צורה: «${c.clauses[0].x}» ${c.clauses[0].op} ${c.clauses[0].n}`, seg: t.src, clauses: c.clauses }); continue; }
    if (entLabels.has(t.label)) { routes.push({ thing: t.label, route: 'appds', why: 'דבר עם שדות ⇒ ישות' }); continue; }
    const [b] = retrieveScreen(t.label, 1);
    if (b && b.score > 0) { routes.push({ thing: t.label, route: 'combine', proposal: true, why: `הצעה (תוכן ממקום אחר): דומה במילים למסך רשום ${b.name} (${(+b.score).toFixed(2)})`, screen: b.name, score: +b.score }); continue; }
    const g = goldModuleFor(t.label);   // אחרי combine: תוספת בלבד — לא מחליף מסלול קיים («רק את הפלוסים»)
    if (g) { routes.push({ thing: t.label, route: 'gold', proposal: true, why: `הצעה (תוכן ממקום אחר): כותרות-זהב של ${path.basename(g.module)} חוזרות על «${g.words.join(' ')}» ${g.score} פעמים`, module: g.module }); continue; }
    routes.push({ thing: t.label, route: 'none', why: 'אין תנאי, אין שדות, אין מסך דומה ⇒ שאלה' });
  }
  return { routes, spec: spec.spec, skipped: spec.skipped, builtin: spec.builtin };
}

/** שומר-ניקיון: נתיב-פלט ריק או בתוך new/ (המדף) ⇒ אסור לכתוב. משותף ל-app-ds ול-genesis-gen. */
const inRepo = (p) => !p || path.resolve(p).startsWith(path.resolve(R.ROOT, 'new'));
/** app-ds על ספק (שומר-ניקיון: GEN_OUT/GEN_DATA_OUT מחוץ ל-new/). מחזיר את האפליקציה או null. */
async function runAppDs(spec, files, notes) {
  let app = null;
  if (spec && (inRepo(process.env.GEN_OUT) || inRepo(process.env.GEN_DATA_OUT))) { notes.push('⛔ app-ds לא הופעל: GEN_OUT/GEN_DATA_OUT חייבים להצביע מחוץ ל-new/ לפני הייבוא הראשון (שומר-ניקיון)'); }
  else if (spec) { const { buildApp } = await import('../machtzev/generator/app-ds.mjs'); const logs = []; const _l = console.log; console.log = (...a) => logs.push(a.join(' ')); try { app = buildApp(spec, { writePlan: false }); } finally { console.log = _l; } for (const l of logs) if (/נמצאו-ומחווטים/.test(l)) notes.push(l.slice(0, 140)); files.push({ route: 'appds', screens: app.screens.map((s) => `${s.kind}:${s.name}`) }); }
  return app;
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
/** דלת שנייה — מסמך של הבעלים במקום משפט: ספק מוכן (specs-ds/*.txt, נגזר ממסמך-«פירוק») ⇒ app-ds ⇒ outDir. */
export async function generateFromSpec(spec, { outDir, name = 'spec' } = {}) {
  fs.mkdirSync(outDir, { recursive: true }); const files = [], notes = [];
  const app = await runAppDs(spec, files, notes);
  return { spec, files, notes, screens: app ? app.screens.map((s) => `${s.kind}:${s.name}`) : [] };
}
/** מסמך-«פירוק» (markdown של הבעלים, שלד peruk-lang) ⇒ peruk.perukToSpec ⇒ ספק ⇒ app-ds. אפס כתיבה ל-specs-ds. */
export async function generateFromDoc(md, { outDir, name = 'doc' } = {}) {
  const { perukToSpec } = await import('../machtzev/generator/peruk.mjs');
  const { spec, node } = perukToSpec(md, name);
  return { ...(await generateFromSpec(spec, { outDir, name })), node };
}
/** הפעלה: כל מסלול למנוע שלו; כתיבה רק ל-outDir. מחזיר את הקבצים שנוצרו ופערים. */
export async function generateAll(sentence, { answers = {}, outDir, name = 'mavin', proposals = false } = {}) {
  const form = formOf(sentence);
  const { routes: allRoutes, spec, skipped } = routeOf(form, answers, { proposals });
  // הצעות נבנות רק לפי בקשה; אחרת נרשמות בהערות (מוצע, לא נכנס לבד)
  const routes = proposals ? allRoutes : allRoutes.filter((r) => !r.proposal);
  const held = allRoutes.filter((r) => r.proposal && !proposals);
  fs.mkdirSync(outDir, { recursive: true });
  const files = [], notes = [];
  for (const r of held) notes.push(`הצעה לא נבנתה («${r.thing}» ⇒ ${r.route}): ${r.why.replace(/^הצעה \(תוכן ממקום אחר\): /, '')} — לבנייה: proposals / --proposals`);
  // 1 · capability — פעם אחת לכל קטע-תנאי
  const capSegs = [...new Map(routes.filter((r) => r.route === 'capability').map((r) => [r.seg, r.clauses])).entries()];
  capSegs.forEach(([seg, clauses], i) => { const cls = `GenCap${i + 1}Screen`; const code = emitAppFrom(clauses, seg, cls); const f = path.join(outDir, `gen_cap${i + 1}.dart`); fs.writeFileSync(f, code); files.push({ route: 'capability', file: f, seg, thresholds: clauses.map((c) => `${c.x} ${c.op} ${c.n ?? '?'}`) }); });
  // 2 · app-ds — כל הישויות בקריאה אחת (GEN_OUT/GEN_DATA_OUT של הקורא)
  // 🔒 שומר-ניקיון: app-ds/render-ds קוראים GEN_OUT/GEN_DATA_OUT **בזמן-טעינה**. אם לא הופנו מחוץ למדף לפני הייבוא הראשון —
  //    הבנייה כותבת ל-new/dart-gen-bs ו-new/dart-data-bs/auto ומוחקת יתומים (קרה 23.9, שוחזר מ-git). כאן: מסרבים, לא מלכלכים.
  const app = await runAppDs(spec, files, notes);
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
      const genSpec = [`אפליקציה: ${name}`, ...ents, ...(dash.length ? [`לוח בקרה עם ${dash.join(', ')}`] : []), ...roles].join('\n');
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
  return { form, routes: allRoutes, held: held.map((r) => r.thing), spec, skipped, files, notes, none: allRoutes.filter((r) => r.route === 'none').map((r) => r.thing) };
}
