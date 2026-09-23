// מנוע 2 ⇒ מנוע 4 ⇒ מקמפל · משפט ⇒ צורה ⇒ אפיון ⇒ app-ds.buildApp ⇒ מראה למארח-Flutter ⇒ flutter analyze על המסכים שנוצרו.
//   מארח: BS_HOST=<app_flutter> (נוצר ע"י `flutter create --offline --project-name buildsmart`; אין buildsmart אמיתי בעץ הזה).
//   שימוש: BS_HOST=... node knowledge/connect/2026-09-22/build-check.mjs "<משפט>" [--answers f.json] [--spec specs-ds/x.txt | --doc peruk.md] [--verify: pump כל מסך במארח (gen-verify, הכרעה-34)] [--proposals: לבנות גם הצעות (מסך-רשום/זהב — תוכן ממקום אחר)]
//   פלט: אפיון · מסכים · מספר שגיאות-analyze (עם הפקודה). אין flutter/מארח ⇒ ⚪ לא-נמדד (L34: אין-כלי ≠ כשל).
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const args = process.argv.slice(2);
const ai = args.indexOf('--answers'); const answers = ai >= 0 ? JSON.parse(fs.readFileSync(args[ai + 1], 'utf8')) : {};
const si = args.indexOf('--spec'), di = args.indexOf('--doc');   // דלת שנייה: ספק מוכן / מסמך-«פירוק» של הבעלים במקום משפט
const skipIdx = new Set([ai, si, di].filter((x) => x >= 0).map((x) => x + 1));
const sentence = args.filter((a, i) => !a.startsWith('--') && !skipIdx.has(i))[0];
const HOST = process.env.BS_HOST;
const FLUTTER = ['/root/flutter/bin/flutter', process.env.FLUTTER_BIN].find((p) => p && fs.existsSync(p));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mavin-build-'));
process.env.GEN_OUT = path.join(tmp, 'gen'); process.env.GEN_DATA_OUT = path.join(tmp, 'data');
fs.mkdirSync(process.env.GEN_OUT, { recursive: true }); fs.mkdirSync(process.env.GEN_DATA_OUT, { recursive: true });
// קורפוס-המסכים-הרשומים (retrieve-screen) נקרא מ-dataOutDir בזמן-טעינה ⇒ מעתיקים את קובצי-התוכן לסקראצ' **לפני** הייבוא הראשון. אפס כתיבה למדף.
const realData = path.join(ROOT, 'new/dart-data-bs/auto');
for (const f of fs.readdirSync(realData)) if (/^screens__.*_content\.dart$/.test(f)) fs.copyFileSync(path.join(realData, f), path.join(process.env.GEN_DATA_OUT, f));
const { generateAll, generateFromSpec, generateFromDoc } = await import(path.join(ROOT, 'yeshiva/mavin-gen.mjs'));
const { formOf, specOf } = await import(path.join(ROOT, 'yeshiva/mavin.mjs'));
let spec, skipped = [], builtin = [], G0;
if (si >= 0 || di >= 0) {
  const f = args[(si >= 0 ? si : di) + 1], txt = fs.readFileSync(f, 'utf8');
  G0 = si >= 0 ? await generateFromSpec(txt, { outDir: process.env.GEN_OUT, name: 'chk' }) : await generateFromDoc(txt, { outDir: process.env.GEN_OUT, name: 'chk' });
  spec = G0.spec; G0.routes = [];
  const sl = spec.split('\n'); console.log(`«${path.basename(f)}» (${si >= 0 ? 'ספק מוכן' : 'מסמך-פירוק'})\nאפיון (${sl.length} שורות):\n${sl.slice(0, 10).map((l) => '  ' + l.slice(0, 110)).join('\n')}${sl.length > 10 ? '\n  …' : ''}`);
} else {
const form = formOf(sentence);
({ spec, skipped, builtin } = specOf(form, answers));
console.log(`«${sentence}»\nאפיון:\n${spec.split('\n').map((l) => '  ' + l).join('\n') || '  (ריק)'}${skipped.length ? `\n  לא נכנסו (בלי שדות ⇒ שאלה): ${skipped.join(', ')}` : ''}${builtin && builtin.length ? `\n  כבר מובנה במסך-הישות: ${builtin.join(' · ')}` : ''}`);
G0 = await generateAll(sentence, { answers, outDir: process.env.GEN_OUT, name: 'chk', proposals: args.includes('--proposals') });
}
for (const r of G0.routes) console.log(`  מסלול · «${r.thing}» ⇒ ${r.route} · ${r.why}`);
for (const n of G0.notes) console.log('  ' + n);
const appEntry = G0.files.find((f) => f.route === 'appds'); if (appEntry) console.log(`מסכים: ${appEntry.screens.join(' · ')}`);
const sv = G0.files.find((f) => f.route === 'server'); if (sv) console.log(`שרת: ${sv.count} קבצים ב-${sv.dir} · ישויות ${sv.entities.join(', ')}`);
if (G0.node) console.log(`צומת-פירוק: ${G0.node.id ?? '?'} «${G0.node.title || ''}» · שדות ${G0.node.fields ?? '?'} · פלטים ${(G0.node.outputs || []).length}`);
const extra = G0.files.filter((f) => f.file).map((f) => f.file);
if (!spec && !extra.length) { console.log('⚪ אין אפיון ואין מסלול אחר ⇒ אין בנייה. ענה על השאלות ותנסה שוב.'); process.exit(0); }
const gen = fs.readdirSync(process.env.GEN_OUT).filter((f) => /^gen_app_.*\.dart$/.test(f));
if (!HOST || !FLUTTER) { console.log(`⚪ לא-נמדד: ${!FLUTTER ? 'אין flutter' : 'אין BS_HOST'} — נפלטו ${gen.length + extra.length} קבצי Dart ל-${process.env.GEN_OUT}`); process.exit(2); }
// מראה מינימלית: המסכים + התוכן שלהם; עצי-האטומים מועתקים פעם אחת (קיימים ⇒ לא נוגעים)
const G = path.join(HOST, 'lib/genesis');
for (const [src, dst] of [['new/dart-ui-bs', 'dart-ui-bs'], ['new/dart-forge-bs', 'dart-forge-bs'], ['new/dart-maor', 'dart-maor'], ['new/dart-screens-bs', 'dart-screens-bs'], ['new/dart-data-maor', 'dart-data-maor'], ['new/dart', 'dart']])
  if (!fs.existsSync(path.join(G, dst)) && fs.existsSync(path.join(ROOT, src))) fs.cpSync(path.join(ROOT, src), path.join(G, dst), { recursive: true });
fs.mkdirSync(path.join(G, 'dart-gen-bs'), { recursive: true }); fs.mkdirSync(path.join(G, 'dart-data-bs/auto'), { recursive: true });
if (!fs.existsSync(path.join(G, 'dart-gen-bs/gen_behaviors.dart')) && fs.existsSync(path.join(ROOT, 'new/dart-gen-bs/gen_behaviors.dart'))) fs.copyFileSync(path.join(ROOT, 'new/dart-gen-bs/gen_behaviors.dart'), path.join(G, 'dart-gen-bs/gen_behaviors.dart'));
for (const f of fs.readdirSync(path.join(G, 'dart-gen-bs'))) if (/^gen_app_/.test(f)) fs.unlinkSync(path.join(G, 'dart-gen-bs', f));
for (const f of fs.readdirSync(path.join(G, 'dart-data-bs/auto'))) if (/^gen_app_/.test(f)) fs.unlinkSync(path.join(G, 'dart-data-bs/auto', f));
for (const f of gen) fs.copyFileSync(path.join(process.env.GEN_OUT, f), path.join(G, 'dart-gen-bs', f));
const extraTargets = [];
for (const f of extra) { const dst = /\.g\.dart$/.test(f) ? path.join(G, 'dart-screens-bs', path.basename(f)) : path.join(G, 'dart-gen-bs', path.basename(f)); fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(f, dst); extraTargets.push(path.relative(HOST, dst)); }
for (const f of fs.readdirSync(process.env.GEN_DATA_OUT)) fs.copyFileSync(path.join(process.env.GEN_DATA_OUT, f), path.join(G, 'dart-data-bs/auto', f));
const targets = [...gen.filter((f) => !/bind|wizard|audit|flags/.test(f)).map((f) => 'lib/genesis/dart-gen-bs/' + f), ...extraTargets];   // מסכי-המערכת המשותפים (bind/wizard/audit/flags) תלויים ב-buildsmart האמיתי — לא מדד של המשפט
const cmd = `flutter analyze --no-fatal-infos --no-fatal-warnings ${targets.join(' ')}`;
const r = spawnSync(FLUTTER, ['analyze', '--no-fatal-infos', '--no-fatal-warnings', ...targets], { cwd: HOST, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const lines = (r.stdout + r.stderr).split('\n');
const errors = lines.filter((l) => /^\s*error •/.test(l)), others = lines.filter((l) => /^\s*(warning|info) •/.test(l));
console.log(`מתקמפל: ${errors.length === 0 ? '✅' : '❌'} · שגיאות ${errors.length} · אזהרות/מידע ${others.length} · ${targets.length} קבצים · (cd ${HOST} && ${cmd})`);
for (const e of errors.slice(0, 8)) console.log('  ' + e.trim().slice(0, 160));
for (const e of others.slice(0, 4)) console.log('  ' + e.trim().slice(0, 160));
// --verify · העיקרון של gen-verify על פלטי-הדלת (הכרעה-34): analyze ירוק ≠ מסך שעובד ⇒ pump כל מסך במארח, אפס-חריגות, ספירת אטומי-תצוגה, סריקת-טאפים (strict)
if (args.includes('--verify') && errors.length === 0) {
  const GV = await import(path.join(ROOT, 'machtzev/generator/gen-verify.mjs'));
  const dir = path.join(G, 'dart-gen-bs'); const only = targets.filter((t) => t.startsWith('lib/genesis/dart-gen-bs/')).map((t) => path.basename(t));
  const live = GV.screensIn(dir, only);
  if (!live.length) console.log('⚪ מוצג-בפועל: אין מסך-מחולל בלי פרמטרי-חובה לבדוק');
  else {
    const testPath = path.join(HOST, 'test/genesis_gen_verify_test.dart'); fs.mkdirSync(path.dirname(testPath), { recursive: true });
    fs.writeFileSync(testPath, GV.verifyDart(live, { strict: () => true }));
    const t = spawnSync(FLUTTER, ['test', 'test/genesis_gen_verify_test.dart', '--reporter', 'compact'], { cwd: HOST, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const out = (t.stdout || '') + (t.stderr || ''); try { fs.unlinkSync(testPath); } catch {}
    const { rows, passed, failed, compileErr } = GV.parseVerify(out);
    for (const s of live) { const row = rows.find((x) => x.file === s.file); const atoms = row ? Object.keys(row.types).filter((x) => GV.DISPLAY.has(x)) : [];
      console.log(`${row && !row.tapErrors ? '✓' : '✗'} ${s.file} · ${row ? `רונדר · אטומי-תצוגה ${atoms.length} (${atoms.slice(0, 6).join(', ')}) · widgets ${Object.values(row.types).reduce((a, b) => a + b, 0)} · טאפים ${row.taps ?? 0} · שגיאות-טאפ ${row.tapErrors ?? 0}` : 'לא רונדר'}`);
      if (row && row.tapErrorAt && row.tapErrorAt.length) console.log('   ✗ ' + row.tapErrorAt.join(' ¦ ').slice(0, 300)); }
    console.log(`מוצג-בפועל: ${rows.length}/${live.length} מסכים · עבר ${passed} · נכשל ${failed}${compileErr.length ? ' · קומפילציה: ' + compileErr.slice(0, 2).join(' ¦ ') : ''} · (cd ${HOST} && flutter test test/genesis_gen_verify_test.dart)`);
    if (!rows.length) console.log('   פלט-הבדיקה (זנב): ' + out.trim().split('\n').slice(-4).join(' ¦ ').slice(0, 400));
  }
}
process.exit(errors.length ? 1 : 0);
