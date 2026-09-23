// מנוע 2 ⇒ מנוע 4 ⇒ מקמפל · משפט ⇒ צורה ⇒ אפיון ⇒ app-ds.buildApp ⇒ מראה למארח-Flutter ⇒ flutter analyze על המסכים שנוצרו.
//   מארח: BS_HOST=<app_flutter> (נוצר ע"י `flutter create --offline --project-name buildsmart`; אין buildsmart אמיתי בעץ הזה).
//   שימוש: BS_HOST=... node knowledge/connect/2026-09-22/build-check.mjs "<משפט>" [--answers f.json]
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
const sentence = args.filter((a, i) => !a.startsWith('--') && !(ai >= 0 && i === ai + 1))[0];
const HOST = process.env.BS_HOST;
const FLUTTER = ['/root/flutter/bin/flutter', process.env.FLUTTER_BIN].find((p) => p && fs.existsSync(p));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mavin-build-'));
process.env.GEN_OUT = path.join(tmp, 'gen'); process.env.GEN_DATA_OUT = path.join(tmp, 'data');
fs.mkdirSync(process.env.GEN_OUT, { recursive: true }); fs.mkdirSync(process.env.GEN_DATA_OUT, { recursive: true });
const { formOf, specOf } = await import(path.join(ROOT, 'yeshiva/mavin.mjs'));
const { buildApp } = await import(path.join(ROOT, 'machtzev/generator/app-ds.mjs'));
const form = formOf(sentence);
const { spec, skipped, builtin } = specOf(form, answers);
console.log(`«${sentence}»\nאפיון:\n${spec.split('\n').map((l) => '  ' + l).join('\n') || '  (ריק)'}${skipped.length ? `\n  לא נכנסו (בלי שדות ⇒ שאלה): ${skipped.join(', ')}` : ''}${builtin && builtin.length ? `\n  כבר מובנה במסך-הישות: ${builtin.join(' · ')}` : ''}`);
if (!spec) { console.log('⚪ אין אפיון ⇒ אין בנייה. ענה על השדות ותנסה שוב.'); process.exit(0); }
const logs = []; const _log = console.log; console.log = (...a) => logs.push(a.join(' ')); let app; try { app = buildApp(spec, { writePlan: false }); } finally { console.log = _log; }
for (const l of logs) if (/נמצאו-ומחווטים|ייצוא|דוח/.test(l)) console.log(l.slice(0, 160));
console.log(`מסכים: ${app.screens.map((s) => `${s.kind}:${s.name}${s.sub ? ` (${s.sub})` : ''}`).join(' · ')}`);
const gen = fs.readdirSync(process.env.GEN_OUT).filter((f) => /^gen_app_.*\.dart$/.test(f));
if (!HOST || !FLUTTER) { console.log(`⚪ לא-נמדד: ${!FLUTTER ? 'אין flutter' : 'אין BS_HOST'} — נפלטו ${gen.length} קבצי Dart ל-${process.env.GEN_OUT}`); process.exit(2); }
// מראה מינימלית: המסכים + התוכן שלהם; עצי-האטומים מועתקים פעם אחת (קיימים ⇒ לא נוגעים)
const G = path.join(HOST, 'lib/genesis');
for (const [src, dst] of [['new/dart-ui-bs', 'dart-ui-bs'], ['new/dart-forge-bs', 'dart-forge-bs'], ['new/dart-maor', 'dart-maor'], ['new/dart-screens-bs', 'dart-screens-bs'], ['new/dart-data-maor', 'dart-data-maor']])
  if (!fs.existsSync(path.join(G, dst)) && fs.existsSync(path.join(ROOT, src))) fs.cpSync(path.join(ROOT, src), path.join(G, dst), { recursive: true });
fs.mkdirSync(path.join(G, 'dart-gen-bs'), { recursive: true }); fs.mkdirSync(path.join(G, 'dart-data-bs/auto'), { recursive: true });
if (!fs.existsSync(path.join(G, 'dart-gen-bs/gen_behaviors.dart')) && fs.existsSync(path.join(ROOT, 'new/dart-gen-bs/gen_behaviors.dart'))) fs.copyFileSync(path.join(ROOT, 'new/dart-gen-bs/gen_behaviors.dart'), path.join(G, 'dart-gen-bs/gen_behaviors.dart'));
for (const f of fs.readdirSync(path.join(G, 'dart-gen-bs'))) if (/^gen_app_/.test(f)) fs.unlinkSync(path.join(G, 'dart-gen-bs', f));
for (const f of fs.readdirSync(path.join(G, 'dart-data-bs/auto'))) if (/^gen_app_/.test(f)) fs.unlinkSync(path.join(G, 'dart-data-bs/auto', f));
for (const f of gen) fs.copyFileSync(path.join(process.env.GEN_OUT, f), path.join(G, 'dart-gen-bs', f));
for (const f of fs.readdirSync(process.env.GEN_DATA_OUT)) fs.copyFileSync(path.join(process.env.GEN_DATA_OUT, f), path.join(G, 'dart-data-bs/auto', f));
const targets = gen.filter((f) => !/bind|wizard|audit|flags/.test(f)).map((f) => 'lib/genesis/dart-gen-bs/' + f);   // מסכי-המערכת המשותפים (bind/wizard/audit/flags) תלויים ב-buildsmart האמיתי — לא מדד של המשפט
const cmd = `flutter analyze --no-fatal-infos --no-fatal-warnings ${targets.join(' ')}`;
const r = spawnSync(FLUTTER, ['analyze', '--no-fatal-infos', '--no-fatal-warnings', ...targets], { cwd: HOST, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const lines = (r.stdout + r.stderr).split('\n');
const errors = lines.filter((l) => /^\s*error •/.test(l)), others = lines.filter((l) => /^\s*(warning|info) •/.test(l));
console.log(`מתקמפל: ${errors.length === 0 ? '✅' : '❌'} · שגיאות ${errors.length} · אזהרות/מידע ${others.length} · ${targets.length} קבצים · (cd ${HOST} && ${cmd})`);
for (const e of errors.slice(0, 8)) console.log('  ' + e.trim().slice(0, 160));
for (const e of others.slice(0, 4)) console.log('  ' + e.trim().slice(0, 160));
process.exit(errors.length ? 1 : 0);
