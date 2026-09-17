#!/usr/bin/env node
// nl-smoke.mjs — רצפת-§22: כל משפט-חופשי (nl-smoke.txt) ⇒ אפליקציה נבנית בלי-קריסה.
// (ברירת-מחדל: buildApp לא-זורק + מייצר ישויות.)
//
// 🏁 --compile (up-compile · 17.9) — «נבנה» ≠ «מתקמפל»:
//   נמדד שהשערים nlsmoke/nlquality/appgen מוכיחים רק שהמחולל לא זרק. משפט-חופשי חדש
//   («ניהול ספקים עם שם, טלפון, עיר ותאריך הצטרפות») הפיק אפליקציה עם 6 שגיאות-קומפילציה,
//   ו-5 מ-35 משפטי-הקורפוס נכשלו גם הם — והקומפילציה נבדקה רק על המראה **המחויב**
//   (genesis-compile ב-CI), כלומר על מה שכבר עבר, לעולם לא על משפט חדש.
//   כאן הפער נמדד כמנוע: כל משפט ⇒ אפליקציה ⇒ מראה (‏mirror.mjs — **אותה** פונקציה של ship
//   שלב-2, עותק אחד) ⇒ `flutter analyze` פעם אחת על lib/genesis ⇒ דוח פר-משפט עם
//   קובץ:שורה:קוד ⇒ exit 1 אם יש שגיאה. אין flutter/buildsmart ⇒ ⚪ מדולג (exit 2 · yellow),
//   לא ירוק-חלול.
//   --run: בדיקת-עשן **מחוללת** (pumpWidget לכל אפליקציה-ירוקה) ⇒ `flutter test`.
//   ENV: FLUTTER=<נתיב flutter/bin> (או /root/flutter/bin · או flutter ב-PATH) · BUILDSMART=<app_flutter>
//   התקנה: machtzev/RUNBOOK-DART.md §Flutter.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { resolveFlutter, parseAnalyze } from '../dart-bin.mjs';   // פותר-flutter + פרסור-analyze: **עותק אחד** (‏w-goal-flutter · 17.9)
import { buildApp } from '../generator/app-ds.mjs';
import { mirror } from '../generator/mirror.mjs';   // שלב-2 של ship — עותק אחד (לא העתק-ביד)
import * as R from '../root.mjs';

const ARGV = process.argv.slice(2);
const COMPILE = ARGV.includes('--compile');
const RUN = ARGV.includes('--run');
const NS_PREFIX = 'corp';   // מרחב-שמות לאפליקציות-המדידה: gen_app_corpNN_*

// ── ברירת-מחדל (שער nlsmoke, ביט-זהה) ──
if (!COMPILE) {
  const sents = fs.readFileSync((R.GEN_DIR + 'nl-smoke.txt'), 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);
  let fail = 0;
  for (const s of sents) {
    try { buildApp(s, { writePlan: false }); const n = fs.readdirSync((R.outDir() + '/')).filter((f) => /^gen_app_ent\d+\.dart$/.test(f)).length; if (n < 1) { console.log('🚨 אפס-ישויות:', s); fail++; } else console.log('✅', n, 'ישויות ·', s); }
    catch (e) { console.log('🚨 קריסה:', s, '·', e.message); fail++; }
  }
  if (fail) { console.log(`\n🚨 רצפת-§22: ${fail} כשלים`); process.exit(1); }
  console.log('\n✅ רצפת-§22: כל המשפטים-החופשיים בונים אפליקציה');
  process.exit(0);
}

// ══ --compile ══════════════════════════════════════════════════════════════
const ROOT = R.ROOT.replace(/\/$/, '');
const OUT = R.outDir(), DATA = R.dataOutDir();

const FLUTTER = resolveFlutter();   // dart-bin — פותר אחד לשני הצרכנים (‏behavior-plan צעד-6 חיפש במקום אחר ⇒ «לא-זמין» כוזב; 17.9)
const APP = R.bsApp();
if (!FLUTTER || !APP) {
  const what = !FLUTTER ? 'flutter' : 'buildsmart';
  console.log(`⚪ מדולג: אין ${what}` + (!FLUTTER ? ' (FLUTTER=<flutter/bin> · /root/flutter/bin · PATH; RUNBOOK-DART.md §Flutter)' : ` (BUILDSMART=<app_flutter>; נוסו: ${['$BUILDSMART', '../buildsmart', '../meir7651231-ui/buildsmart'].join(' · ')})`));
  process.stderr.write(`tool=${what}\n`);   // yellow לפי PROTOCOL §משטרה (exit 2) — לא ירוק-חלול
  process.exit(2);
}
const LIB = path.join(APP, 'lib/genesis');

// ── הקורפוס: שני קובצי-האמת הקיימים (nl-smoke + nl-quality), בסדר, בלי המצאה ──
const readCorpus = (f) => fs.readFileSync(R.GEN_DIR + f, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean).map((s) => ({ s, src: f }));
const CORPUS = [...readCorpus('nl-smoke.txt'), ...readCorpus('nl-quality.txt')];
const ns = (i) => NS_PREFIX + String(i + 1).padStart(2, '0');

// ── ניקוי מרחב-המדידה (גם שאריות מריצה שנפלה) — העץ חייב לחזור לנוח (L14) ──
const wipe = () => {
  const re = new RegExp(`^gen_app_${NS_PREFIX}\\d+_.*\\.dart$`);
  for (const d of [OUT, DATA, path.join(LIB, 'dart-gen-bs'), path.join(LIB, 'dart-data-bs/auto')]) {
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) if (re.test(f)) fs.unlinkSync(path.join(d, f));
  }
  for (const f of fs.readdirSync(R.GEN_DIR)) if (new RegExp(`^(particle|report)-plan-${NS_PREFIX}\\d+\\.(json|md)$`).test(f)) fs.unlinkSync(path.join(R.GEN_DIR, f));
  const APPS = path.join(R.GEN_DIR, 'apps');   // app-ds רושם כרטיס-אפליקציה פר-מרחב (‏apps/<ns>.json — קלט של balagan.mjs); מרחב-המדידה לא נשאר שם
  if (fs.existsSync(APPS)) for (const f of fs.readdirSync(APPS)) if (new RegExp(`^${NS_PREFIX}\\d+\\.json$`).test(f)) fs.unlinkSync(path.join(APPS, f));
};
wipe();

const t0 = Date.now();
const secs = (t) => ((Date.now() - t) / 1000).toFixed(1);
let built = 0, buildFail = [];
const TEST_FILE = path.join(APP, 'test', `zz_nlcompile_${NS_PREFIX}_test.dart`);

try {
  // ── 1 · בנייה: משפט ⇒ אפליקציה במרחב-שמות משלה (תת-תהליך = NS משלו; writePlan=false כמו בשער) ──
  const tBuild = Date.now();
  const APPDS = 'file://' + path.join(ROOT, 'machtzev/generator/app-ds.mjs');
  const DRIVER = `import { buildApp } from ${JSON.stringify(APPDS)};\nbuildApp(process.env.NL_SENT, { writePlan: false });\n`;
  for (let i = 0; i < CORPUS.length; i++) {
    const r = spawnSync(process.execPath, ['--input-type=module', '-e', DRIVER, '--', '--name', ns(i)],
      { cwd: ROOT, env: { ...process.env, NL_SENT: CORPUS[i].s }, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    if (r.status !== 0) buildFail.push({ i, why: (r.stderr || '').trim().split('\n').filter(Boolean).pop() || ('exit ' + r.status) });
    else built++;
  }
  const buildS = secs(tBuild);
  console.log(`🏗️  בנייה: ${built}/${CORPUS.length} אפליקציות · ${buildS}s`);
  for (const b of buildFail) console.log(`🚨 ${ns(b.i)} · קריסת-בנייה · ${CORPUS[b.i].s}\n     ${b.why}`);

  // ── 2 · מראה (אותה פונקציה של ship שלב-2) ──
  const tMir = Date.now();
  mirror(ROOT, APP, (m) => console.log('   ' + m));
  const mirrored = fs.readdirSync(path.join(LIB, 'dart-gen-bs'));
  const genN = mirrored.filter((f) => /^gen_.*\.dart$/.test(f)).length;
  // 🔴 «ירוק» חייב להיות ירוק **על הקוד שנבדק**. בלי הבדיקה הזו אפליקציה שלא הגיעה למראה
  //    (ריצה מקבילה שמחקה את מרחב-המדידה · מסנן-מראה שהשתנה) פשוט לא מייצרת שגיאות —
  //    ו-analyze מחזיר בדיוק את מספרי-הבסיס. נמדד: ריצה שנייה במקביל דיווחה **35/35 ירוקים ·
  //    0 שגיאות** כשאף קובץ-corp לא היה בעץ. עכשיו: מי שאינו במראה אינו ירוק.
  const inMirror = new Set(mirrored.map((f) => (f.match(new RegExp(`^gen_app_(${NS_PREFIX}\\d+)_`)) || [])[1]).filter(Boolean));
  console.log(`🪞 מראה ⇒ ${LIB} · ${genN} קובצי-gen · ${inMirror.size}/${built} מרחבי-מדידה במראה · ${secs(tMir)}s`);

  // ── 3 · analyze פעם אחת (הקריטריון של ship: רק `error •` מפיל) ──
  const tAn = Date.now();
  const an = spawnSync(FLUTTER, ['analyze', '--no-fatal-infos', '--no-fatal-warnings', 'lib/genesis'], { cwd: APP, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const anS = secs(tAn);
  const { errs, warnN, infoN, issues, miscount } = parseAnalyze(an.stdout + an.stderr, an.status, an.error);
  console.log(`🔎 analyze: ${errs.length} שגיאות · ${warnN} אזהרות · ${infoN} infos · ${issues ?? '?'} issues found · ${anS}s`);
  if (miscount) console.log(miscount);
  console.log('');

  // ── 4 · דוח פר-משפט (השיוך לפי מרחב-השמות שבנתיב-הקובץ) ──
  const byNs = new Map();
  let orphan = [];
  for (const e of errs) { const m = e.file.match(new RegExp(`gen_app_(${NS_PREFIX}\\d+)_`)); if (m) { if (!byNs.has(m[1])) byNs.set(m[1], []); byNs.get(m[1]).push(e); } else orphan.push(e); }
  let red = 0, missing = 0; const green = [];
  for (let i = 0; i < CORPUS.length; i++) {
    const id = ns(i), es = byNs.get(id) || [], bf = buildFail.find((b) => b.i === i);
    if (bf) { red++; continue; }   // כבר דווח למעלה
    if (!inMirror.has(id)) { red++; missing++; console.log(`🚨 ${id} · **אינו במראה** — לא נבדק, ולכן אינו ירוק · ${CORPUS[i].s}`); continue; }
    if (es.length) {
      red++;
      console.log(`🚨 ${id} · ${es.length} שגיאות · ${CORPUS[i].s}`);
      for (const e of es) console.log(`     ${e.file}:${e.line}:${e.col} · ${e.code} · ${e.msg}`);
    } else { green.push({ i, id }); console.log(`✅ ${id} · 0 שגיאות · ${CORPUS[i].s}`); }
  }
  if (orphan.length) { console.log(`\n🚨 ${orphan.length} שגיאות **מחוץ** למרחב-המדידה (הבסיס עצמו אינו ירוק):`); for (const e of orphan.slice(0, 12)) console.log('     ' + e.raw); }

  // ── 5 · --run: בדיקת-עשן מחוללת (pumpWidget) על האפליקציות-הירוקות ──
  let runLine = '';
  if (RUN) {
    const pkg = (fs.readFileSync(path.join(APP, 'pubspec.yaml'), 'utf8').match(/^name:\s*(\S+)/m) || [])[1];
    const cases = [];
    for (const g of green) {
      const mainF = path.join(LIB, 'dart-gen-bs', `gen_app_${g.id}_main.dart`);
      if (!fs.existsSync(mainF)) continue;
      const cls = (fs.readFileSync(mainF, 'utf8').match(/runApp\(const (\w+)\(\)\)/) || [])[1];   // שורש-האפליקציה מהבייטים, לא מניחוש-שם
      if (cls) cases.push({ id: g.id, cls, sent: CORPUS[g.i].s });
    }
    if (!cases.length) runLine = '⚪ --run: אין אפליקציה ירוקה לבדוק';
    else {
      const code = `// ✨ מחולל ע"י machtzev/mahulal/nl-smoke.mjs --compile --run — בדיקת-עשן: כל משפט-קורפוס עולה כאפליקציה (pumpWidget · אפס-חריגה). זמני: נמחק בסוף הריצה.\nimport 'package:flutter_test/flutter_test.dart';\n`
        + cases.map((c) => `import 'package:${pkg}/genesis/dart-gen-bs/gen_app_${c.id}_main.dart' show ${c.cls};`).join('\n')
        + `\n\nvoid main() {\n`
        + cases.map((c) => `  testWidgets(${JSON.stringify(c.id + ' · ' + c.sent)}, (t) async {\n    await t.pumpWidget(const ${c.cls}());\n    await t.pump();\n  });`).join('\n')
        + `\n}\n`;
      fs.writeFileSync(TEST_FILE, code);
      const tRun = Date.now();
      const tr = spawnSync(FLUTTER, ['test', 'test/' + path.basename(TEST_FILE)], { cwd: APP, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
      const sum = (tr.stdout + tr.stderr).split(/\r|\n/).filter((l) => /All tests passed|Some tests failed/.test(l)).pop() || ('exit ' + tr.status);
      runLine = `${tr.status === 0 ? '✅' : '🚨'} --run: ${cases.length} אפליקציות · ${sum.trim().replace(/^\d\d:\d\d /, '')} · ${secs(tRun)}s`;
      if (tr.status !== 0) { red++; console.log((tr.stdout + tr.stderr).split(/\r|\n/).filter((l) => /\[E\]|Expected|thrown|Exception/.test(l)).slice(0, 15).join('\n')); }
    }
    console.log('\n' + runLine);
  }

  // ── 6 · פסק ──
  const tot = errs.length + buildFail.length + missing + (miscount ? 1 : 0);
  console.log(`\n📊 §22-קומפילציה · ${CORPUS.length} משפטים · ${CORPUS.length - red} ירוקים · ${red} אדומים · ${errs.length} שגיאות-analyze · ${buildFail.length} קריסות-בנייה · ${missing} לא-במראה`);
  console.log(`   זמנים: בנייה ${buildS}s · analyze ${anS}s · סה"כ ${secs(t0)}s · flutter ${FLUTTER} · buildsmart ${APP}`);
  // ⚠️ `process.exit()` כאן **מדלג על ה-finally** (Node מסיים מיידית) — וזה בדיוק מה שקרה בריצה
  //    הראשונה: 35 אפליקציות-מדידה נשארו בעץ. קוד-היציאה נקבע, והיציאה עצמה אחרי הניקוי.
  if (tot || red) console.log(`\n🚨 §22: משפט-חופשי ⇒ אפליקציה שאינה מתקמפלת (${red} משפטים)`);
  else console.log('\n✅ §22-קומפילציה: כל משפט-חופשי ⇒ אפליקציה שמתקמפלת (0 errors)');
  process.exitCode = (tot || red) ? 1 : 0;
} finally {
  // העץ חוזר לנוח: מרחב-המדידה יורד משני הצדדים (גנסיס + המראה), ובדיקת-העשן נמחקת
  fs.rmSync(TEST_FILE, { force: true });
  wipe();
}
