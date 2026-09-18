#!/usr/bin/env node
// 📏 meter-100 — מד-«מאה אחוז»: כל משפט בריפו ⇒ באיזה שלב של הסולם הוא נופל.
//
// הפסק (‏knowledge/connect/2026-09-18/sugya_plan.py · 15 מקורות): **מאה אחוז = כל משפט ⇒
// אפליקציה עובדת**, לא «כל השערים ירוקים». ומכאן הפער שהמד הזה סוגר: הדבר שמגדיר מאה
// אחוז — שלב 5, «עובד מול המטרה» — לא נמדד כלל, ושלב 4 נמדד על 35 משפטים שנבחרו ביד.
//
// הסולם (פר-יחידה · הגבוה-ביותר שהושג נרשם, והנפילה נרשמת עם סיבה):
//   1 · המשפט מזוהה כמטרה      תביעת-התנהגות > 0            (yeshiva/purpose · scanOne)
//   2 · צרכים נגזרו             חוזה עם ישות+שקע+דוגמאות     (perokGoal · scanOne)
//   3 · Dart נפלט               behavior-compose ⇒ bh* בקובץ (behavior-plan צעד-6)
//   4 · מתקמפל                  dart analyze · 0 errors      (behavior-plan צעד-7)
//   5 · **עובד מול המטרה**      dart run --enable-asserts    (behavior-plan צעד-7)
//        ‏assert(r == <תשובה-צפויה-מחושבת-מהנתונים>) — `goalExamples` מחשב את התשובה
//        מהליטרלים שבדיסק, לא מניחוש. זו ההגדרה של «עובד», והיא נמדדת בהרצה.
//
// ⚠️ **אפס מנוע חדש** (יקום סגור · הכרעה-22): המד אינו מחשב כלום בעצמו. הוא מריץ את
//    `behavior-plan.mjs` הקיים וקורא את ה-`ledger.json` שהוא ממילא כותב. כל מספר כאן
//    מקורו בפקודה של מנוע קיים, וכל שורה בפנקס נושאת את השלב והסיבה.
//
// 🔴 **המקום הסופי של המד הוא `--meter` בתוך `machtzev/mahulal/nl-smoke.mjs`** (מנוע-היעד
//    לפי המשימה). ‏`nl-smoke.mjs` **נעוץ** (‏pins.sha256), ונגיעה בו דורשת
//    `Allow: pins-write:machtzev/mahulal/nl-smoke.mjs <הכרעה-N>` + `pins-check.mjs --write`
//    באותו קומיט, **ואישור-מנהל מראש**. המנהל לא היה זמין (‏ListAgents ⇒ אין סשן אחר),
//    ולכן המד יושב כקובץ-אח עד האישור. ההעברה מכאנית: הגוף שלמטה נכנס כבלוק
//    `if (METER) {…}` אחרי בלוק-ברירת-המחדל, והייבואים זהים. אין כאן יכולת חדשה —
//    אורקסטרציה בלבד של `scanUnits`/`scanOne`/`runGoal` הקיימים.
//
// שימוש:
//   node machtzev/mahulal/meter-100.mjs            # הסולם המלא (1–5) על כל הקורפוס
//   node machtzev/mahulal/meter-100.mjs --quick    # שלבים 1–2 בלבד (~4s) — לרענון-רצפה
//   node machtzev/mahulal/meter-100.mjs --json     # פלט-מכונה (ל-baseline ולשער-הראצ'ט)
//   node machtzev/mahulal/meter-100.mjs --limit N  # N היחידות-עם-צרכים הראשונות (מדידה-חלקית, מסומנת)
// ENV: DART=<dart> (‏dart-bin.resolveDart אם אין)
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import * as R from '../root.mjs';
import { resolveDart, resolveFlutter } from '../dart-bin.mjs';
import { scanUnits, scanOne } from '../generator/behavior-plan.mjs';

const ARGV = process.argv.slice(2);
const QUICK = ARGV.includes('--quick');
const JSONOUT = ARGV.includes('--json');
const LIMIT = ARGV.includes('--limit') ? +ARGV[ARGV.indexOf('--limit') + 1] : Infinity;
const GATE = ARGV.includes('--gate');
const WRITE = ARGV.includes('--write-baseline');
// ‏--seal: חותם רצפה מה-JSON של ריצה-מלאה **שכבר הושלמה** (‏meter-100.json), בלי למדוד שוב
//   16 דק׳. מאמת שהריצה הייתה מלאה (‏quick=false · limit=null) ואחרת מסרב — רצפה חלקית
//   אינה רצפה. זו חתימה בלבד; **השער עצמו (`--gate`) תמיד מודד טרי** (פסק ישן = ירוק-חלול).
const SEAL = ARGV.includes('--seal');
const BASELINE = path.join(R.MACH, 'mahulal/meter-100-baseline.json');
const NS = 'meter';                                   // מרחב-המדידה: gen_goal_meterNNN*
const BP = path.join(R.GEN_DIR, 'behavior-plan.mjs');
const GOALS = path.join(R.GEN_DIR, 'goals');
const OUT = R.outDir();
const t0 = Date.now();
const secs = (t) => ((Date.now() - t) / 1000).toFixed(1);
const log = (s) => { if (!JSONOUT) console.log(s); };

// ── ניקוי מרחב-המדידה משני הצדדים (גם שאריות ריצה שנפלה) — העץ חוזר לנוח (L14) ──
const wipe = () => {
  const re = new RegExp(`^gen_goal_${NS}\\d+(_proof)?\\.dart$`);
  // ‏`behavior-plan` כותב ל-`R.NEW/dart-gen-bs` קשיח, ו-`R.outDir()` עשוי להצביע למקום אחר
  //   (‏GEN_OUT). מנקים את **שניהם**, אחרת שארית-מדידה נשארת בעץ ונכנסת לשער הבא.
  for (const d of new Set([OUT, path.join(R.NEW, 'dart-gen-bs')])) {
    try { for (const f of fs.readdirSync(d)) if (re.test(f)) fs.unlinkSync(path.join(d, f)); } catch {}
  }
  try { for (const d of fs.readdirSync(GOALS)) if (new RegExp(`^${NS}\\d+$`).test(d)) fs.rmSync(path.join(GOALS, d), { recursive: true, force: true }); } catch {}
};

// ── סיבת-הנפילה: מילות-המנוע עצמו (ownerKinds מ-perokGoal), לא ניסוח שלי ──
const whyFell = (r) => r.error ? `קריסת-פירוק: ${r.error}`
  : r.noBehavior ? 'אין תביעת-התנהגות (אין פועל-מטרה במשפט)'
  : (r.ownerKinds || []).length ? (r.ownerKinds || []).join('/')
  : 'תביעה בלי חוזה';

/** שלבים 3–5 ליחידה אחת: מריץ את המנוע הקיים וקורא את הלדג'ר שהוא כותב. */
function climb(u, i) {
  const ns = NS + String(i + 1).padStart(3, '0');
  const dir = path.join(GOALS, ns);
  const tmp = path.join(dir, '_unit.txt');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(tmp, u.text.replace(/\r/g, '') + '\n');
  const t = Date.now();
  const r = spawnSync(process.execPath, [BP, '--goal', tmp, '--ns', ns],
    { cwd: R.ROOT, encoding: 'utf8', timeout: 900000, maxBuffer: 64 * 1024 * 1024, env: { ...process.env, DART: process.env.DART || resolveDart() || '' } });
  const ms = Date.now() - t;
  let L = null;
  try { L = JSON.parse(fs.readFileSync(path.join(dir, 'ledger.json'), 'utf8')); } catch {}
  if (!L) {
    // שורת-השגיאה **המשמעותית**, לא השורה האחרונה: ‏`Node.js v22.x` הוא התחתית של כל
    // stack-trace, ולקחת אותה כ«סיבה» מסתיר את הסיבה האמיתית מהפנקס.
    const errLines = String(r.stderr || '').split('\n').map((l) => l.trim()).filter(Boolean);
    const why = errLines.find((l) => /^[A-Za-z]*Error\b|Error:|RangeError|TypeError|heap out of memory|FATAL/.test(l))
      || errLines.find((l) => !/^(at |Node\.js v|\^+$)/.test(l)) || errLines.pop() || '';
    return { stage: 2, ms, why: `הלדג'ר לא נכתב (exit ${r.status}${r.signal ? ' · signal ' + r.signal : ''}): ${why}`.slice(0, 200) };
  }

  // 🔴 פער-מנוע שהמדידה חשפה (‏18.9): `runGoal` קורא **שורה אחת** מקובץ-המטרה
  //   (`raw.split('\n').filter(l => l.trim())[0]`), בעוד `perokGoal`/`scanOne` פועלים על
  //   **כל** טקסט-היחידה. ליחידה רב-שורתית (‏`ב·specs`, קובץ=יחידה) שלבים 3–5 היו נמדדים
  //   על השורה הראשונה בלבד — מדידה שאינה של היחידה. נרשם, לא מוסתר ולא «מתוקן» ע"י
  //   שיטוח-הטקסט (זה היה כיפוף-קוד כדי שמספר ייראה טוב).
  const nLines = u.text.split('\n').filter((l) => l.trim()).length;
  if (nLines > 1) return { stage: 2, ms, lines: nLines,
    why: `יחידה רב-שורתית (${nLines} שורות) · runGoal קורא שורה-אחת מקובץ-המטרה ⇒ שלבים 3–5 אינם מדידים ליחידה הזו (פער-מנוע, behavior-plan.mjs:runGoal)` };

  // ‏0 צרכים בריצה-המלאה ⇒ `ledger0` נכתב **בלי** `summary` (מסלול «כל התביעות מתגי-בעלים»).
  //   בלי השומר הזה `path.join(NEW,'')` הוא תיקייה ⇒ readFileSync זורק EISDIR והמד מת באמצע.
  if (!L.summary) { const s2 = (L.steps || []).find((s) => s.step === 2);
    return { stage: 2, ms, why: `0 צרכים בריצה-המלאה: ${s2 ? String(s2.detail).slice(0, 120) : 'אין summary בלדג׳ר'}` }; }

  // שלב 3 · Dart נפלט: צעד-6 עבר **וגם** הקובץ בדיסק נושא לפחות התנהגות אחת.
  //   בלי בדיקת-הבייטים, תוכנית עם 0 picks מפיקה קובץ-ריק וקובץ-הוכחה בלי asserts —
  //   ואז שלב 5 «עובר» בריק. ירוק-חלול נחסם כאן, בשורש.
  const step6 = (L.steps || []).find((s) => s.step === 6);
  const file = path.join(R.NEW, String(L.summary.file || '').replace(/^new\//, ''));
  const src = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  const bh = (src.match(/^\s*\S[^\n]*\s(bh[A-Z]\w*)\s*\(/gm) || []).length;
  const solved = L.summary.solved || 0;
  if (!step6 || step6.status !== 'עבר' || !bh || !solved) {
    return { stage: 2, ms, needs: L.summary.needs, solved,
      why: `לא נפלט Dart: ${step6 ? step6.status + ' — ' + String(step6.detail).slice(0, 90) : 'אין צעד-6'}${bh ? '' : ' · 0 התנהגויות בקובץ'}` };
  }
  const ck = (name) => (L.checks || []).find((c) => c.name === name) || null;

  // שלב 4 · מתקמפל: dart analyze על הקובץ-המחולל.
  const an = ck('dart analyze');
  if (!an || an.status !== 'עבר') return { stage: 3, ms, bh, solved, why: `analyze: ${an ? an.status + ' — ' + String(an.out).slice(0, 110) : 'לא רץ'}` };

  // שלב 5 · עובד מול המטרה: dart run --enable-asserts על קובץ-ההוכחה.
  //   ‏assert(r == <תשובה-צפויה>) לכל דוגמה. **שומר אנטי-ריק**: «✓ N דוגמאות · M התנהגויות»
  //   חייב N≥1 ו-M≥1 — תוכנית בלי דוגמאות עוברת את `dart run` בלי לבדוק דבר.
  const pr = ck('dart run --enable-asserts (הוכחת-ההרכבה)');
  if (!pr || pr.status !== 'עבר') return { stage: 4, ms, bh, solved, why: `הוכחה: ${pr ? pr.status + ' — ' + String(pr.out).slice(0, 110) : 'לא רץ'}` };
  const m = String(pr.out || '').match(/✓\s*(\d+)\s*דוגמאות\s*·\s*(\d+)\s*התנהגויות/);
  const ex = m ? +m[1] : 0, beh = m ? +m[2] : 0;
  const needN = L.summary.needs || 0;
  if (!ex || !beh) return { stage: 4, ms, bh, solved, needs: needN, why: `הוכחה ריקה (${ex} דוגמאות · ${beh} התנהגויות) — «עבר» בלי לבדוק דבר` };

  // 🔴 «עובד מול המטרה» = **המטרה**, לא חלק ממנה. מטרה שנגזרו לה 4 צרכים ורק 1 קיבל
  //   התנהגות-מוכחת אינה עושה את מה שהמשפט ביקש — ההוכחה שעברה מעידה רק על מה שנפלט.
  //   לכן שלב 5 דורש `solved === needs`: כל צורך שנגזר קיבל התנהגות שעוברת את דוגמאותיו.
  //   חלקי ⇒ נעצר בשלב 4 עם היחס, והפנקס מראה כמה חסר. (אחרת «100%» היה נמדד על תת-קבוצה.)
  if (solved !== needN) return { stage: 4, ms, bh, solved, needs: needN, examples: ex,
    why: `חלקי: ${solved}/${needN} צרכים קיבלו התנהגות-מוכחת — ההוכחה עברה על מה שנפלט, לא על המטרה` };
  return { stage: 5, ms, bh, solved, needs: needN, examples: ex, behaviors: beh, why: null };
}

// ── --seal · חתימת-רצפה מריצה-מלאה שהושלמה (בלי מדידה מחדש) ────────────────
if (SEAL) {
  const jf = path.join(R.ROOT, 'knowledge/connect/2026-09-18/meter-100.json');
  if (!fs.existsSync(jf)) { console.log(`🚨 --seal: אין ${path.relative(R.ROOT, jf)} — הרץ מדידה מלאה קודם`); process.exit(2); }
  const J = JSON.parse(fs.readFileSync(jf, 'utf8')); const S = J.summary || {};
  if (S.quick || S.limit != null || S.notMeasured) { console.log(`🚨 --seal: הריצה לא הייתה מלאה (quick=${!!S.quick} · limit=${S.limit} · לא-נמדדו=${S.notMeasured}) — רצפה חלקית אינה רצפה`); process.exit(2); }
  if (!S.units || !S.at || S.at[5] == null) { console.log('🚨 --seal: ה-JSON אינו נושא חמישה שלבים מלאים'); process.exit(2); }
  fs.writeFileSync(BASELINE, JSON.stringify({ at: J.at, units: S.units, at5: S.at, ms: J.ms, from: path.relative(R.ROOT, jf), cmd: 'node machtzev/mahulal/meter-100.mjs --gate' }, null, 1) + '\n');
  console.log(`✍️  רצפה ⇒ ${path.relative(R.ROOT, BASELINE)} · ${S.units} יחידות · ${[1,2,3,4,5].map((k) => k + ':' + S.at[k]).join(' · ')}`);
  process.exit(0);
}

// ══ הריצה ══════════════════════════════════════════════════════════════════
wipe();
const units = scanUnits();
log(`📏 מד-100 · ${units.length} יחידות (${[...new Set(units.map((u) => u.src))].join(' · ')})`);

const rows = [];
try {
  // ── שלבים 1–2 · על **כל** יחידה (‏scanOne — אותו מנוע של --perok-scan) ──
  const t12 = Date.now();
  for (const u of units) {
    const r = await scanOne(u);
    rows.push({ src: u.src, id: u.id, at: u.at, text: u.text.replace(/\s+/g, ' ').trim().slice(0, 120),
      claims: r.claims, needs: r.needs, stage: r.claims ? (r.needs ? 2 : 1) : 0, why: r.needs ? null : whyFell(r), ms12: r.ms });
  }
  const s12 = secs(t12);
  log(`   שלבים 1–2: ${s12}s`);

  // ── שלבים 3–5 · רק על מי שהגיע לשלב 2. השאר אינו יכול לפלוט Dart-מטרה, ונרשם בפנקס. ──
  const climbers = rows.filter((r) => r.stage === 2).slice(0, LIMIT);
  if (QUICK) for (const r of rows) if (r.stage === 2) r.why = 'לא-נמדד (--quick: שלבים 3–5 לא רצו)';
  else for (const r of rows.filter((r) => r.stage === 2).slice(LIMIT)) r.why = 'לא-נמדד (--limit)';
  const skipped = rows.filter((r) => r.stage === 2).length - climbers.length;
  if (!QUICK) {
    log(`   שלבים 3–5 על ${climbers.length} יחידות-עם-צרכים${skipped ? ` (‏${skipped} לא-נמדדו · --limit)` : ''}:`);
    climbers.forEach((row, i) => {
      const c = climb(units.find((u) => u.id === row.id && u.src === row.src), i);
      Object.assign(row, { stage: c.stage, why: c.why, bh: c.bh, examples: c.examples, lines: c.lines, solved: c.solved, ms35: c.ms });
      log(`     ${String(i + 1).padStart(3)}/${climbers.length} ${['','','',' 3',' 4','✅5'][c.stage] || c.stage} ${row.src} ${row.id} · ${(c.ms / 1000).toFixed(1)}s${c.why ? ' · ' + c.why : ` · ${c.examples} דוגמאות`}`);
    });
  }

  // ── חמשת האחוזים ──────────────────────────────────────────────────────────
  const N = rows.length;
  const at = (k) => rows.filter((r) => r.stage >= k).length;
  const pct = (n) => (n * 100 / N).toFixed(1);
  const NAMES = ['המשפט מזוהה כמטרה', 'צרכים נגזרו', 'Dart נפלט', 'מתקמפל (dart analyze)', '**עובד מול המטרה**'];
  const measured = QUICK ? 2 : 5;
  const summary = { units: N, at: {}, quick: QUICK, limit: isFinite(LIMIT) ? LIMIT : null, notMeasured: skipped };
  log('');
  log(`📊 הסולם · ${N} יחידות`);
  log('| שלב | מה זה אומר | יחידות | אחוז |');
  log('|---|---|---|---|');
  for (let k = 1; k <= 5; k++) {
    summary.at[k] = k <= measured ? at(k) : null;
    log(`| ${k} | ${NAMES[k - 1]} | ${k <= measured ? at(k) : '—'} | ${k <= measured ? pct(at(k)) + '%' : '⚪ לא-נמדד (--quick)'} |`);
  }

  // ── הראצ'ט (מדד-היציאה 2) · **רק-עולה** לכל חמשת השלבים ─────────────────────
  //   אנטי-משחק: המכנה נעול גם הוא. אסור להעלות אחוז ע"י **צמצום-הנמדד** (להוריד
  //   יחידות מהקורפוס) — מכנה שקטן מהבסיס מפיל את השער בדיוק כמו אחוז שירד.
  //   ‏0 יחידות ⇒ exit 2 «הכלי שבור, לא הנתונים» (fail-closed, כמו שער-hamtzaa).
  if (!N) { console.log('🚨 מד-100: 0 יחידות — הכלי שבור, לא הנתונים'); process.exitCode = 2; }
  else if (WRITE) {
    if (QUICK || isFinite(LIMIT)) { console.log('🚨 --write-baseline דורש מדידה **מלאה** (בלי --quick/--limit) — רצפה חלקית אינה רצפה'); process.exitCode = 2; }
    else { fs.writeFileSync(BASELINE, JSON.stringify({ at: new Date().toISOString(), units: N, at5: summary.at, cmd: 'node machtzev/mahulal/meter-100.mjs --gate' }, null, 1) + '\n');
      log(`✍️  רצפה ⇒ ${path.relative(R.ROOT, BASELINE)} · ${[1,2,3,4,5].map((k) => k + ':' + at(k)).join(' · ')}`); }
  } else if (GATE) {
    if (QUICK || isFinite(LIMIT)) { console.log('🚨 --gate דורש מדידה **מלאה** (בלי --quick/--limit)'); process.exitCode = 2; }
    else if (!fs.existsSync(BASELINE)) { console.log(`🚨 אין רצפה (${path.relative(R.ROOT, BASELINE)}) — הרץ --write-baseline`); process.exitCode = 2; }
    else {
      const B = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));
      const bad = [];
      if (N < B.units) bad.push(`המכנה ירד: ${N} < ${B.units} יחידות (צמצום-הנמדד אסור)`);
      for (let k = 1; k <= 5; k++) { const now = at(k), was = (B.at5 || {})[k] ?? 0;
        if (now < was) bad.push(`שלב ${k}: ${now} < ${was} (${(now * 100 / N).toFixed(1)}% < ${(was * 100 / B.units).toFixed(1)}%)`); }
      log('');
      if (bad.length) { console.log(`🚨 מד-100 · ראצ'ט (רק-עולה) נשבר:\n   ${bad.join('\n   ')}`); process.exitCode = 1; }
      else log(`✅ מד-100 · ראצ'ט: ${[1,2,3,4,5].map((k) => k + ':' + at(k)).join(' · ')} ≥ רצפה ${[1,2,3,4,5].map((k) => k + ':' + ((B.at5 || {})[k] ?? 0)).join(' · ')} · ${N} יחידות`);
    }
  }

  // ── מסלול-הטפסים: שלב 3–4 של `nl-smoke --compile`. אין flutter ⇒ ⚪ עם הסיבה, לא ירוק. ──
  const fl = resolveFlutter(), bs = R.bsApp();
  summary.forms = (fl && bs) ? { available: true, cmd: 'node machtzev/mahulal/nl-smoke.mjs --compile' }
    : { available: false, reason: `flutter=${fl || '—'} · buildsmart=${bs || '—'}` };
  log('');
  log(summary.forms.available
    ? `🧾 מסלול-הטפסים (שלב 3–4 על מסכי-app-ds): ${summary.forms.cmd}`
    : `⚪ מסלול-הטפסים (שלב 3–4 על מסכי-app-ds): לא-נמדד · אין ${!fl ? 'flutter' : 'buildsmart'} (${summary.forms.reason}) — tool=${!fl ? 'flutter' : 'buildsmart'}, לא ירוק-חלול (L27)`);

  // ── הפנקס: לכל יחידה — שלב-הנפילה והסיבה (מפת-העבודה של שלבים 1–6) ──
  const outDirK = path.join(R.ROOT, 'knowledge/connect/2026-09-18');
  fs.mkdirSync(outDirK, { recursive: true });
  const tsv = ['מקור\tיחידה\tשלב\tתביעות\tצרכים\tנפתרו\tהתנהגויות\tדוגמאות\tms\tסיבת-הנפילה\tמשפט',
    ...rows.map((r) => [r.src, r.id, r.stage, r.claims, r.needs, r.solved ?? '', r.bh ?? '', r.examples ?? '', (r.ms12 || 0) + (r.ms35 || 0), r.why || '', r.text].join('\t'))].join('\n') + '\n';
  fs.writeFileSync(path.join(outDirK, 'meter-100.tsv'), tsv);
  const json = { at: new Date().toISOString(), ms: Date.now() - t0, cmd: 'node machtzev/mahulal/meter-100.mjs', summary, rows };
  fs.writeFileSync(path.join(outDirK, 'meter-100.json'), JSON.stringify(json, null, 1) + '\n');

  // ── פילוח סיבות-הנפילה (מפת-העבודה: מה לתקן קודם) ──
  const by = new Map();
  for (const r of rows) if (r.stage < 5) { const k = `${r.stage} ⇒ נפל בשלב ${r.stage + 1} · ${r.why || '—'}`; by.set(k, (by.get(k) || 0) + 1); }
  log('');
  log('🧭 הפנקס · איפה נופלים (‏knowledge/connect/2026-09-18/meter-100.tsv)');
  for (const [k, n] of [...by.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12)) log(`   ${String(n).padStart(4)} · הגיע לשלב ${k}`);
  log('');
  log(`⏱️  ${secs(t0)}s · dart ${resolveDart() || '—'}`);
  if (JSONOUT) console.log(JSON.stringify(json, null, 1));
} finally {
  wipe();   // העץ חוזר לנוח — מרחב-המדידה יורד משני הצדדים
}
