#!/usr/bin/env node
// 🏁 golden-harness — רתמת-הזהב של המחולל (GENMAX · G4 · הכרעה-24): המודול המורכב-מחדש מהקטלוג עובר את **בדיקות-הזהב המקוריות** בלי שינוי-בדיקה.
//   לכל מודול-זהב: assemble(compose+declared, חלקיקי-המודול) ⇒ מוחלף במראה של buildsmart (lib/genesis/dart-gen-bs/<module>) ⇒
//   `flutter test test/genesis_<name>_test.dart` ⇒ שחזור-המראה (git checkout) — תמיד, גם בכשל.
//   מדד: golden-regenerated N/9 · tests K/84 — ראצ׳ט רק-עולה (render-module-baseline.json). מדולג (ledger=skipped) כשאין buildsmart/flutter
//   **או כשקובצי-בדיקת-הזהב אינם בעץ-היעד** — חֶסֶר-מקור מדווח כ-∅, לא כנסיגה (L57); חֶסֶר-חלקי = אדום.
//   ⚠️ אין git ב-genesis כאן; ב-buildsmart רק `checkout -- <file>` לשחזור קובץ שהרתמה עצמה דרסה.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import * as R from '../root.mjs';
import { assemble, PARTICLE_IDS } from './render-module.mjs';

const ROOT = R.ROOT, GEN = path.join(ROOT, 'machtzev/generator');
const BS = R.bsApp() || path.resolve(ROOT, '../buildsmart/app_flutter');
const FLUTTER = process.env.FLUTTER || (fs.existsSync('/home/user/flutter/bin/flutter') ? '/home/user/flutter/bin/flutter' : 'flutter');
const BASE = path.join(GEN, 'render-module-baseline.json');
// מודול-זהב ⇒ קובצי-הבדיקה שלו (schoolos.dart = מסך-המלאי + ניווט-ההאב)
const TESTS = { 'schoolos.dart': ['genesis_inventory_states_test.dart', 'genesis_schoolos_nav_test.dart'] };
const testsOf = (m) => TESTS[m] || [`genesis_${m.replace(/^schoolos_/, '').replace(/\.dart$/, '')}_test.dart`];
const particlesOf = (m) => { const k = m.replace(/\.dart$/, ''); const p = { schoolos_students: 'stu.', schoolos_attendance: 'att.', schoolos_courses: 'crs.', schoolos_teachers: 'tch.', schoolos_rooms: 'rm.', schoolos_fees: 'fee.', schoolos_parents: 'par.', schoolos_dashboard: 'dash.' }[k]; return PARTICLE_IDS.filter((id) => (p ? id.startsWith(p) : !id.includes('.'))); };

const gate = process.argv.includes('--gate');
const only = (() => { const i = process.argv.indexOf('--module'); return i > -1 ? [process.argv[i + 1]] : null; })();
if (!fs.existsSync(path.join(BS, 'pubspec.yaml'))) { console.log(`⚪ goldenharness: אין buildsmart ב-${BS} — מדולג`); process.exit(0); }
const allModules = only || ['schoolos_attendance.dart', 'schoolos_rooms.dart', 'schoolos_teachers.dart', 'schoolos_parents.dart', 'schoolos_dashboard.dart', 'schoolos_fees.dart', 'schoolos_students.dart', 'schoolos_courses.dart', 'schoolos.dart'];
// 🔎 **חסר-מקור ≠ נסיגה** (L57 · נמדד 17.9). קובצי-בדיקת-הזהב אינם מחוללים — הם יושבים
// בעץ-היעד. בקלון שאין בו אותם, `flutter test` נכשל על כל מודול, הספירה יוצאת 0/0,
// והשער הכריז «נסיגה מ-baseline 9/87 ⇒ 0/0» — כלומר **האשים את המחולל בהיעדר-פיגום**.
// עכשיו: אין ולו קובץ-זהב אחד ⇒ מדולג עם השמות; חלק-מהם חסר ⇒ **אדום**, כי מחיקת-קובץ
// לא תהיה דרך להשתיק שער.
const missingOf = (m) => testsOf(m).filter((t) => !fs.existsSync(path.join(BS, 'test', t)));
const modules = allModules.filter((m) => missingOf(m).length === 0);
const absent = allModules.filter((m) => missingOf(m).length > 0);
if (modules.length === 0) {
  console.log(`⚪ goldenharness: אין קובצי-בדיקת-זהב ב-${path.join(BS, 'test')} — מדולג`);
  console.log(`   ${allModules.length} מודולי-זהב · חסרים: ${[...new Set(allModules.flatMap(missingOf))].join(' · ')}`);
  console.log('   הפיגום יושב בעץ-היעד ואינו מחולל — קלון בלי הענף שנושא אותו אינו מודד כלום.');
  // הדוח נכתב כ-**מדולג**, לא כ-0/0: קובץ-דוח שנקרא כמדידה הוא בדיוק איך «אין פיגום»
  // הפך ל«המחולל נסוג» — 0 שנכתב לקובץ נראה אחר-כך כמספר שנמדד.
  if (!only) fs.writeFileSync(path.join(GEN, 'golden-harness-report.json'),
    JSON.stringify({ skipped: 'אין קובצי-בדיקת-זהב בעץ-היעד', at: BS, missing: [...new Set(allModules.flatMap(missingOf))], modules: allModules.length, rows: [] }, null, 1));
  process.exit(0);
}
const rows = []; let regenerated = 0, passed = 0, total = 0;
for (const m of modules) {
  const mirror = path.join(BS, 'lib/genesis/dart-gen-bs', m);
  const r = assemble({ module: m, particles: particlesOf(m), mode: 'compose', declared: true });
  const src = fs.readFileSync(path.join(ROOT, 'new/dart-gen-bs', m), 'utf8');
  const dead = r.unselected.filter((u) => !/^\/\//.test(u.first));
  // סחף-מראה (לקח 4.9: מורים במראה היה 3 גלים לפני genesis — "ביט-זהה ועדיין אדום"): המראה חייב להיות ≡ המקור לפני ההחלפה, אחרת הבדיקות מודדות קובץ אחר
  const before = fs.existsSync(mirror) ? fs.readFileSync(mirror, 'utf8') : null;   // צילום-בייטים לשחזור
  const drift = before !== null && before !== src;
  fs.writeFileSync(mirror, r.code);
  let ok = 0, n = 0, failMsg = '';
  try {
    for (const t of testsOf(m)) {
      const res = spawnSync(FLUTTER, ['test', 'test/' + t, '--reporter', 'compact'], { cwd: BS, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: { ...process.env, PATH: path.dirname(FLUTTER) + ':' + process.env.PATH } });
      const out = (res.stdout || '') + (res.stderr || '');
      const last = [...out.matchAll(/\+(\d+)(?:\s+-(\d+))?:/g)].pop();
      const p = last ? +last[1] : 0, f = last && last[2] ? +last[2] : 0;
      ok += p; n += p + f; if (res.status !== 0) failMsg += ` ${t}:${res.status}`;
    }
  } finally {
    // ♻️ **שחזור-בבייטים, לא בתקווה** (נמדד 17.9). קודם: `git checkout -- <path>`.
    // אבל `lib/genesis/` **אינו מעוקב** בעץ-היעד (הוא מוזרק), אז git החזיר
    // «did not match any file(s) known to git», הפלט לא נקרא — ו-3 מודולים נשארו
    // דרוסים. רשת-ביטחון שאינה מאומתת אינה רשת. עכשיו משחזרים מצילום-הבייטים.
    spawnSync('git', ['checkout', '--', 'lib/genesis/dart-gen-bs/' + m], { cwd: BS, encoding: 'utf8' });
    const now = fs.existsSync(mirror) ? fs.readFileSync(mirror, 'utf8') : null;
    if (now !== before) {
      if (before === null) fs.rmSync(mirror, { force: true }); else fs.writeFileSync(mirror, before);
      const after = fs.existsSync(mirror) ? fs.readFileSync(mirror, 'utf8') : null;
      if (after !== before) throw new Error(`goldenharness: שחזור-המראה נכשל ל-${m} — עצור לפני נזק`);
    }
  }
  const green = n > 0 && ok === n && !failMsg && !drift;
  if (drift) failMsg += ' סחף-מראה(mirror≠genesis)';
  if (green) regenerated++; passed += ok; total += n;
  rows.push({ module: m, fragments: `${r.fragments}/${r.of}`, identical: r.code === src, dead: dead.map((d) => d.cls + '.' + (d.first.match(/(\w+)\s*(?:\(|=>|=|\{)/) || [])[1]), tests: `${ok}/${n}`, green, fail: failMsg.trim() });
  console.log(`${green ? '✓' : '✗'} ${m.padEnd(26)} שברים ${rows.at(-1).fragments.padEnd(8)} ${r.code === src ? 'ביט-זהה' : 'שונה (מת: ' + rows.at(-1).dead.join(',') + ')'}`.padEnd(95) + ` בדיקות ${ok}/${n}${failMsg}`);
}
const summary = { regenerated, modules: modules.length, tests: passed, testsTotal: total };
console.log(`golden-regenerated ${regenerated}/${modules.length} · tests ${passed}/${total}`);
if (!only) fs.writeFileSync(path.join(GEN, 'golden-harness-report.json'), JSON.stringify({ ...summary, rows }, null, 1));
if (gate) {
  const base = fs.existsSync(BASE) ? JSON.parse(fs.readFileSync(BASE, 'utf8')) : { regenerated: 0, tests: 0 };
  if (only) process.exit(0);
  if (absent.length) { console.log(`🔴 goldenharness: ${absent.length} מודולי-זהב בלי קובץ-בדיקה בעץ-היעד (${absent.join(' · ')}) — חֶסֶר-חלקי אינו פטור`); process.exit(1); }
  if (regenerated < base.regenerated || passed < base.tests) { console.log(`🔴 goldenharness: נסיגה מ-baseline ${base.regenerated}/${base.tests} ⇒ ${regenerated}/${passed}`); process.exit(1); }
  console.log(`✓ goldenharness: ${regenerated}/${modules.length} מודולי-זהב מורכבים-מחדש עוברים את בדיקותיהם · ${passed}/${total} בדיקות`);
} else if (!only && (process.argv.includes('--write-baseline') || !fs.existsSync(BASE))) fs.writeFileSync(BASE, JSON.stringify(summary));
