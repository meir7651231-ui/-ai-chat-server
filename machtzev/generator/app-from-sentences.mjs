#!/usr/bin/env node
// 🏗️ app-from-sentences — משפטים-בעברית ⇒ אפליקציה (GENMAX · G9 · §22 "משפט ⇒ אפליקציה עובדת"): N משפטים ⇒ N מודולי-ישות (sentence⇒entity⇒pickModule⇒retarget: labels·core·columns)
//   + רכזת-ניווט מחוללת (כמו schoolos.dart: DsScaffold + DsNavTile + Navigator.push) + בדיקת-ניווט מחוללת ל-buildsmart (בית ⇒ כל מודול מרונדר וחוזר, אפס-חריגות).
//   קלט: --spec app-golden.json ({name, sentences[]}) או --name X --text "…" (חוזר). פלט: new/dart-gen-bs/gen_app_<name>.dart + מודולים · test/genesis_gen_app_<name>_test.dart (במראה).
//   --gate: הרכזת+המודולים ≡ טריים (דטרמיניזם) · --test: מריץ את בדיקת-הניווט המחוללת ב-buildsmart (push).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as R from '../root.mjs';
import { fromSentence } from './sentence.mjs';
import { termsFor } from './retarget.mjs';

const ROOT = R.ROOT, GEN = path.join(ROOT, 'machtzev/generator'), DIR = path.join(ROOT, 'new/dart-gen-bs');
const BS = process.env.BUILDSMART || path.resolve(ROOT, '../buildsmart/app_flutter');
const FLUTTER = process.env.FLUTTER || (fs.existsSync('/home/user/flutter/bin/flutter') ? '/home/user/flutter/bin/flutter' : 'flutter');
const pascal = (s) => s.replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')).replace(/^./, (c) => c.toUpperCase());
const q = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$')}'`;
export function buildApp({ name, sentences }) {
  const N = pascal(name), mods = [], skipped = [];
  for (const text of sentences) {
    const r = fromSentence(text);
    if (!r.entity) { skipped.push({ text, reason: r.reason }); continue; }
    if (mods.some((m) => m.entity === r.entity)) { skipped.push({ text, reason: `ישות חוזרת (${r.entity})` }); continue; }
    const t = termsFor(r.entity);
    mods.push({ text, entity: r.entity, module: r.module, file: path.basename(r.out), screen: `${r.entity.replace(/[^A-Za-z0-9]/g, '')}Screen`, title: t ? (t.plural || t.singular) : r.entity, code: r.code, pick: r.pick, facts: r.facts });
  }
  const hub = [`// 🏗️ ${N}App — אפליקציה ממשפטים (GENMAX·G9 · §22): ${mods.length} מודולים · מחולל דטרמיניסטי: app-from-sentences.mjs (sentence⇒entity⇒pickModule⇒retarget) — כל מודול חצוב מהזהב, לא נכתב`,
    ...mods.map((m) => `//   "${m.text}" ⇒ ${m.entity} ⇐ ${m.module} (${m.pick.strength} · שמות ${m.pick.names}/${m.pick.fields})`),
    ...skipped.map((s) => `//   ⚪ "${s.text}" ⇒ ${s.reason}`),
    `//   G9b · KPI-רכזת נגזר: כל אריח = ${'<E>'}Facts של המודול (count חי של הזרע · hero = המדד שהזהב הכריז/צבע-סכנה) — אפס ערך מומצא: ${mods.map((m) => `${m.facts.cls}.${m.facts.heroKey}`).join(' · ')}`,
    `import 'package:flutter/material.dart';`, `import '../dart-ui-bs/ds/ds.dart';`, `import '../dart-ui-bs/premium/dataviz/kpi_tile.dart';`,
    ...mods.map((m) => `import '${m.file}';`), '',
    `class ${N}App extends StatelessWidget {`, `  const ${N}App({super.key});`, '  @override',
    `  Widget build(BuildContext context) => MaterialApp(title: ${q(name)}, debugShowCheckedModeBanner: false, theme: ThemeData(brightness: Brightness.dark, useMaterial3: true), home: const ${N}HubScreen());`, '}', '',
    `class ${N}HubScreen extends StatefulWidget {`, `  const ${N}HubScreen({super.key});`, '  @override', `  State<${N}HubScreen> createState() => _${N}HubScreenState();`, '}', '',
    `class _${N}HubScreenState extends State<${N}HubScreen> {`,
    `  static void _go(BuildContext c, Widget screen) => Navigator.push(c, MaterialPageRoute(builder: (_) => screen));`,
    `  static const modules = <String>[${mods.map((m) => q(m.title)).join(', ')}]; // ${mods.length} מסכים מחווטים`,
    '  @override',
    `  Widget build(BuildContext context) => DsScaffold(title: ${q(name)}, subtitle: '${mods.length} מודולים ממשפטים · כל אחד חצוב מהזהב', icon: '🧬', children: [`,
    `    Wrap(spacing: 12, runSpacing: 12, children: [ // KPI-רכזת (G9b): עובדות-אמת בלבד — כמו _Home של הזהב (מסכים-מחוברים + הדחוף של כל מודול)`,
    `      SizedBox(width: 168, child: KpiTile(glyph: '🧬', value: '${'$'}{modules.length}', label: 'מסכים מחוברים')),`,
    ...mods.map((m) => `      SizedBox(width: 168, child: KpiTile(glyph: '🧬', value: ${m.facts.cls}.hero, label: ${m.facts.cls}.heroLabel)), // ${m.entity} · ${m.facts.heroHow}`),
    '    ]),', '    const SizedBox(height: 8),', `    DsSection(title: 'כלים', children: [`,
    ...mods.map((m) => `      DsNavTile(glyph: '🧬', title: ${q(m.title)}, sub: ${m.facts.count ? `'${'$'}{${m.facts.cls}.count} ${'$'}{${m.facts.cls}.label} · ${q(m.text).slice(1, -1)}'` : q(m.text)}, onTap: () => _go(context, const ${m.screen}())),`),
    '    ]),', '  ]);', '}', ''].join('\n');
  const test = [`// מחולל ע"י machtzev/generator/app-from-sentences.mjs — בדיקת-ניווט של ${N}App: בית ⇒ כל מודול מרונדר וחוזר, אפס-חריגות`,
    `import 'package:buildsmart/genesis/dart-gen-bs/gen_app_${name.toLowerCase()}.dart';`, ...mods.map((m) => `import 'package:buildsmart/genesis/dart-gen-bs/${m.file}';`),
    `import 'package:buildsmart/genesis/dart-ui-bs/ds/ds.dart';`, `import 'package:flutter/material.dart';`, `import 'package:flutter_test/flutter_test.dart';`, '',
    'void main() {',
    `  testWidgets('${N}App · בית: ${mods.length} אריחים', (tester) async {`,
    `    tester.view.physicalSize = const Size(800, 2400); tester.view.devicePixelRatio = 1.0; addTearDown(tester.view.reset);`,
    `    await tester.pumpWidget(const ${N}App()); await tester.pump(const Duration(milliseconds: 300));`,
    `    expect(find.byType(DsNavTile), findsNWidgets(${mods.length})); expect(tester.takeException(), isNull);`,
    `    expect(find.text('${mods.length}'), findsWidgets); // KPI מסכים-מחוברים = עובדה`,
    ...mods.flatMap((m) => [
      `    expect(${m.facts.cls}.metricDefs.length, ${m.facts.cls}.metrics.length); expect(${m.facts.cls}.heroKey == 'count' || ${m.facts.cls}.metrics.containsKey(${m.facts.cls}.heroKey), isTrue); // ${m.entity}: תפר-העובדות עקבי`,
      `    expect(find.text(${m.facts.cls}.hero), findsWidgets); expect(find.text(${m.facts.cls}.heroLabel), findsWidgets); // ה-hero של ${m.entity} מרונדר ברכזת מהביטוי-החי, לא מליטרל`,
      ...(m.facts.count ? [`    expect(find.textContaining('${'$'}{${m.facts.cls}.count} ${'$'}{${m.facts.cls}.label}'), findsOneWidget); // count חי של הזרע-הראשי (${m.facts.count.list} · ${m.facts.count.how})`] : []),
    ]),
    '  });',
    ...mods.flatMap((m) => [
      `  testWidgets('${N}App · בית ⇒ ${m.title} (${m.entity}) מרונדר וחוזר', (tester) async {`,
      `    tester.view.physicalSize = const Size(800, 2400); tester.view.devicePixelRatio = 1.0; addTearDown(tester.view.reset);`,
      `    await tester.pumpWidget(const ${N}App()); await tester.pump(const Duration(milliseconds: 300));`,
      `    await tester.tap(find.text(${q(m.title)}).last); await tester.pump(); await tester.pump(const Duration(milliseconds: 600));`,
      `    expect(find.byType(${m.screen}), findsOneWidget); expect(tester.takeException(), isNull);`,
      `    tester.state<NavigatorState>(find.byType(Navigator).first).pop(); await tester.pump(); await tester.pump(const Duration(milliseconds: 600)); expect(find.byType(DsNavTile), findsNWidgets(${mods.length})); // DsScaffold ללא AppBar ⇒ pop דרך ה-Navigator, לא pageBack`,
      '  });']),
    '}', ''].join('\n');
  return { name, N, mods, skipped, hub, test, hubFile: `gen_app_${name.toLowerCase()}.dart`, testFile: `genesis_gen_app_${name.toLowerCase()}_test.dart` };
}
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
const arg = (k) => { const i = process.argv.indexOf(k); return i > -1 ? process.argv[i + 1] : null; };
const args = (k) => process.argv.flatMap((a, i) => (a === k ? [process.argv[i + 1]] : []));
const SPEC = path.join(GEN, 'app-golden.json');
if (isMain) {
  const spec = arg('--spec') || (!arg('--name') && fs.existsSync(SPEC) ? SPEC : null);
  const req = spec ? JSON.parse(fs.readFileSync(spec, 'utf8')) : { name: arg('--name'), sentences: args('--text') };
  const app = buildApp(req);
  const write = !process.argv.includes('--gate') || process.argv.includes('--write');
  const errs = [];
  for (const m of app.mods) { const f = path.join(DIR, m.file); if (write) fs.writeFileSync(f, m.code); else if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== m.code) errs.push(`${m.file} ≠ טרי`); }
  const hf = path.join(DIR, app.hubFile); if (write) fs.writeFileSync(hf, app.hub); else if (!fs.existsSync(hf) || fs.readFileSync(hf, 'utf8') !== app.hub) errs.push(`${app.hubFile} ≠ טרי`);
  const tf = path.join(BS, 'test', app.testFile); if (write && fs.existsSync(path.join(BS, 'pubspec.yaml'))) fs.writeFileSync(tf, app.test);
  if (process.argv.includes('--gate')) {
    if (errs.length) { console.log('🔴 appgen: ' + errs.join(' · ') + ' (הרץ app-from-sentences.mjs --gate --write)'); process.exit(1); }
    if (process.argv.includes('--test') && fs.existsSync(path.join(BS, 'pubspec.yaml'))) {
      for (const m of app.mods) fs.copyFileSync(path.join(DIR, m.file), path.join(BS, 'lib/genesis/dart-gen-bs', m.file));
      fs.copyFileSync(hf, path.join(BS, 'lib/genesis/dart-gen-bs', app.hubFile)); fs.writeFileSync(tf, app.test);
      const res = spawnSync(FLUTTER, ['test', 'test/' + app.testFile, '--reporter', 'compact'], { cwd: BS, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: { ...process.env, PATH: path.dirname(FLUTTER) + ':' + process.env.PATH } });
      const out = (res.stdout || '') + (res.stderr || ''); const last = [...out.matchAll(/\+(\d+)(?:\s+-(\d+))?:/g)].pop(); const p = last ? +last[1] : 0, f = last && last[2] ? +last[2] : 0;
      if (res.status !== 0 || f) { console.log(`🔴 appgen: בדיקת-הניווט של ${app.N}App נכשלה (${p} passed · ${f} failed)`); console.log(out.split('\n').filter((l) => /Error|Exception|Expected|Actual/.test(l)).slice(0, 6).join('\n')); process.exit(1); }
      console.log(`✓ appgen: ${app.N}App — ${app.mods.length} מודולים ממשפטים · רכזת+בדיקת-ניווט מחוללות · flutter test ${p}/${p} (בית ⇒ כל מודול ⇒ חזרה, אפס-חריגות)`); process.exit(0);
    }
    console.log(`✓ appgen: ${app.N}App — ${app.mods.length} מודולים + רכזת ≡ מחולל-טרי (${app.skipped.length} משפטים בלי-ישות מדווחים)`); process.exit(0);
  }
  console.log(`✓ ${app.N}App ⇒ ${app.hubFile} · ${app.mods.length} מודולים: ${app.mods.map((m) => `${m.title}(${m.entity}⇐${m.module.replace('schoolos_', '').replace('.dart', '')})`).join(' · ')} · בדיקה: test/${app.testFile}${app.skipped.length ? ' · ⚪ ' + app.skipped.map((s) => `"${s.text}": ${s.reason}`).join(' · ') : ''}`);
}
