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
import { normSearch } from '../../new/atoms/norm-search.mjs';
import { NORM_SEARCH_T } from '../../new/atoms/norm-search-strings.mjs';

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
    `//   G10a · אריח-hero ⇒ טאפ פותח את המודול על הרשומה-הראשונה של המדד (<E>Facts.heroFirstId ⇒ <E>Screen(initialPanelId)) — תפר-כניסה חצוב מצורת initialPanel של זהב-המורים: ${mods.map((m) => `${m.entity}:${m.facts.entrySeam || '∅'}`).join(' · ')}`,
    `//   G9b · KPI-רכזת נגזר: כל אריח = ${'<E>'}Facts של המודול (count חי של הזרע · hero = המדד שהזהב הכריז/צבע-סכנה) — אפס ערך מומצא: ${mods.map((m) => `${m.facts.cls}.${m.facts.heroKey}`).join(' · ')}`,
    `import 'package:flutter/material.dart';`, `import '../dart-ui-bs/ds/ds.dart';`, `import '../dart-ui-bs/premium/dataviz/kpi_tile.dart';`,
    `import '../dart-ui-bs/ds/ds_search.dart'; // איתור: חיפוש-מבוקר (value+onChanged)`, `import '../dart-ui-bs/premium/feedback/empty_state.dart'; // אין-תוצאות`,
    `import '../dart-maor/smart-filter.dart'; // איתור: סינון+מיון-לפי-ציון (מדף)`, `import '../dart-maor/smart-score.dart'; // איתור: ניקוד רב-מילתי AND (מדף)`,
    `import '../dart-maor/norm-search.dart'; // איתור: נרמול-חיפוש עברי (מדף)`, `import '../dart-data-maor/norm-search-strings.dart'; // NORM_SEARCH_T (אטום-דאטה)`,
    ...mods.map((m) => `import '${m.file}' show ${m.screen}, ${m.facts.cls}; // רק התפר הציבורי (מסך+עובדות) — מחלקות-ציבוריות אחרות של הזהב (DashInput) לא מתנגשות`), '',
    `class ${N}App extends StatelessWidget {`, `  const ${N}App({super.key});`, '  @override',
    `  Widget build(BuildContext context) => MaterialApp(title: ${q(name)}, debugShowCheckedModeBanner: false, theme: ThemeData(brightness: Brightness.dark, useMaterial3: true), home: const ${N}HubScreen());`, '}', '',
    `class ${N}HubScreen extends StatefulWidget {`, `  const ${N}HubScreen({super.key});`, '  @override', `  State<${N}HubScreen> createState() => _${N}HubScreenState();`, '}', '',
    `class _${N}HubScreenState extends State<${N}HubScreen> {`,
    `  static void _go(BuildContext c, Widget screen) => Navigator.push(c, MaterialPageRoute(builder: (_) => screen));`,
    `  static const modules = <String>[${mods.map((m) => q(m.title)).join(', ')}]; // ${mods.length} מסכים מחווטים`,
    `  String _q = ''; // חיפוש-רכזת נגזר (G9c): DsSearch ⊕ smartFilter ⊕ smartScore ⊕ normSearch — צורת-האיתור של הזהב (23-ג), לא .contains שטוח`,
    `  static String _norm(dynamic q) => normSearch(q, NORM_SEARCH_T);`,
    `  static Iterable _expand(dynamic q, dynamic norm) => [norm(q)];`,
    `  static num _score(dynamic exp, dynamic term) => _norm(term).contains('${'$'}exp') ? 100 : 0;`,
    `  static num _scoreOf(dynamic q, dynamic terms) => smartScore(q, terms, _norm, _expand, _score) as num;`,
    `  static bool _hasQuery(dynamic q) => (q as String).trim().isNotEmpty;`,
    `  // שורות-החיפוש = נגזרת של תפר-העובדות: כותרת · מונח-הישות · המשפט · תוויות-המדדים — אפס דאטה-חדש`,
    `  static final rows = <Map<String, dynamic>>[`,
    ...mods.map((m, i) => `    {'i': ${i}, 'title': ${q(m.title)}, 'label': ${m.facts.cls}.label, 'text': ${q(m.text)}, 'terms': [for (final d in ${m.facts.cls}.metricDefs) '${'$'}{d['label']}']},`),
    '  ];',
    `  static List<String> termsOf(Map<String, dynamic> r) => ['${'$'}{r['title']}', '${'$'}{r['label']}', '${'$'}{r['text']}', ...(r['terms'] as List).cast<String>()];`,
    `  static List<Map<String, dynamic>> searchModules(List<Map<String, dynamic>> rs, String q) => (smartFilter(q, rs, (it) => termsOf(it as Map<String, dynamic>), _hasQuery, _scoreOf) as List).cast<Map<String, dynamic>>();`,
    '  @override',
    `  Widget build(BuildContext context) {`,
    `    final vis = searchModules(rows, _q).map((r) => r['i'] as int).toSet();`,
    `    return DsScaffold(title: ${q(name)}, subtitle: '${mods.length} מודולים ממשפטים · כל אחד חצוב מהזהב', icon: '🧬', children: [`,
    `      DsSearch(value: _q, onChanged: (v) => setState(() => _q = v)),`,
    `      const SizedBox(height: 8),`,
    `      Wrap(spacing: 12, runSpacing: 12, children: [ // KPI-רכזת (G9b): עובדות-אמת בלבד — כמו _Home של הזהב (מסכים-מחוברים + הדחוף של כל מודול)`,
    `        SizedBox(width: 168, child: KpiTile(glyph: '🧬', value: '${'$'}{vis.length}/${'$'}{modules.length}', label: 'מסכים מחוברים')),`,
    ...mods.map((m, i) => m.facts.entrySeam
      ? `        if (vis.contains(${i})) GestureDetector(key: const ValueKey('hero-${m.entity}'), onTap: () { final id = ${m.facts.cls}.heroFirstId; _go(context, id == null ? const ${m.screen}() : ${m.screen}(${m.facts.entrySeam}: id)); }, child: SizedBox(width: 168, child: KpiTile(glyph: '🧬', value: ${m.facts.cls}.hero, label: ${m.facts.cls}.heroLabel))), // ${m.entity} · ${m.facts.heroHow} · טאפ ⇒ המודול פתוח על רשומת-ה-hero הראשונה (G10a)`
      : `        if (vis.contains(${i})) SizedBox(key: const ValueKey('hero-${m.entity}'), width: 168, child: KpiTile(glyph: '🧬', value: ${m.facts.cls}.hero, label: ${m.facts.cls}.heroLabel)), // ${m.entity} · ${m.facts.heroHow} · אין תפר-כניסה (אין זרע/פאנל)`),
    '      ]),', '      const SizedBox(height: 8),',
    `      if (vis.isEmpty) const EmptyState(glyph: '🔍', message: 'אין מודול שתואם לחיפוש') else DsSection(title: 'כלים · ${'$'}{vis.length}', children: [`,
    ...mods.map((m, i) => `        if (vis.contains(${i})) DsNavTile(glyph: '🧬', title: ${q(m.title)}, sub: ${m.facts.count ? `'${'$'}{${m.facts.cls}.count} ${'$'}{${m.facts.cls}.label} · ${q(m.text).slice(1, -1)}'` : q(m.text)}, onTap: () => _go(context, const ${m.screen}())),`),
    '      ]),', '    ]);', '  }', '}', ''].join('\n');
  const test = [`// מחולל ע"י machtzev/generator/app-from-sentences.mjs — בדיקת-ניווט של ${N}App: בית ⇒ כל מודול מרונדר וחוזר, אפס-חריגות`,
    `import 'package:buildsmart/genesis/dart-gen-bs/gen_app_${name.toLowerCase()}.dart';`, ...mods.map((m) => `import 'package:buildsmart/genesis/dart-gen-bs/${m.file}' show ${m.screen}, ${m.facts.cls};`),
    `import 'package:buildsmart/genesis/dart-ui-bs/ds/ds.dart';`, `import 'package:buildsmart/genesis/dart-ui-bs/premium/feedback/empty_state.dart';`, `import 'package:flutter/material.dart';`, `import 'package:flutter_test/flutter_test.dart';`, '',
    'void main() {',
    `  testWidgets('${N}App · בית: ${mods.length} אריחים', (tester) async {`,
    `    tester.view.physicalSize = const Size(800, 2400); tester.view.devicePixelRatio = 1.0; addTearDown(tester.view.reset);`,
    `    await tester.pumpWidget(const ${N}App()); await tester.pump(const Duration(milliseconds: 300));`,
    `    expect(find.byType(DsNavTile), findsNWidgets(${mods.length})); expect(tester.takeException(), isNull);`,
    `    expect(find.text('${mods.length}/${mods.length}'), findsWidgets); // KPI מסכים-מחוברים = עובדה (נראים/כולם)`,
    ...mods.flatMap((m) => [
      `    expect(${m.facts.cls}.metricDefs.length, ${m.facts.cls}.metrics.length); expect(${m.facts.cls}.heroKey == 'count' || ${m.facts.cls}.metrics.containsKey(${m.facts.cls}.heroKey), isTrue); // ${m.entity}: תפר-העובדות עקבי`,
      `    expect(find.text(${m.facts.cls}.hero), findsWidgets); expect(find.text(${m.facts.cls}.heroLabel), findsWidgets); // ה-hero של ${m.entity} מרונדר ברכזת מהביטוי-החי, לא מליטרל`,
      ...(m.facts.count ? [`    expect(find.textContaining('${'$'}{${m.facts.cls}.count} ${'$'}{${m.facts.cls}.label}'), findsOneWidget); // count חי של הזרע-הראשי (${m.facts.count.list} · ${m.facts.count.how})`] : []),
    ]),
    '  });',
    ...(() => { // G9c · חיפוש-רכזת: הצפי מחושב באותו מנוע-מדף (norm-search.mjs = מקור התאום-Dart): שאילתה-חד-מילתית ⇒ מודול נראה אם אחד ממונחיו מכיל אותה מנורמלת
      const nz = (w) => normSearch(w, NORM_SEARCH_T);
      const termsOf = (m) => [m.title, m.facts.label, m.text, ...m.facts.metrics.map((d) => d.label)];
      const probe = mods[0].title, expectN = mods.filter((m) => termsOf(m).some((t) => nz(t).includes(nz(probe)))).length;
      return [`  testWidgets('${N}App · חיפוש-רכזת נגזר: "${probe}" ⇒ ${expectN}/${mods.length} · ג׳יבריש ⇒ EmptyState · ריק ⇒ הכול', (tester) async {`,
        `    tester.view.physicalSize = const Size(800, 2400); tester.view.devicePixelRatio = 1.0; addTearDown(tester.view.reset);`,
        `    await tester.pumpWidget(const ${N}App()); await tester.pump(const Duration(milliseconds: 300));`,
        `    await tester.enterText(find.byType(TextField).first, ${q(probe)}); await tester.pump(const Duration(milliseconds: 300));`,
        `    expect(find.byType(DsNavTile), findsNWidgets(${expectN})); expect(find.text('${expectN}/${mods.length}'), findsWidgets); expect(tester.takeException(), isNull);`,
        `    await tester.enterText(find.byType(TextField).first, 'zzqqxx'); await tester.pump(const Duration(milliseconds: 300));`,
        `    expect(find.byType(DsNavTile), findsNothing); expect(find.byType(EmptyState), findsOneWidget); expect(find.text('0/${mods.length}'), findsWidgets);`,
        `    await tester.enterText(find.byType(TextField).first, ''); await tester.pump(const Duration(milliseconds: 300));`,
        `    expect(find.byType(DsNavTile), findsNWidgets(${mods.length})); expect(find.byType(EmptyState), findsNothing); expect(tester.takeException(), isNull);`,
        '  });'];
    })(),
    ...mods.filter((m) => m.facts.entrySeam).flatMap((m) => [
      `  testWidgets('${N}App · אריח-hero ⇒ ${m.title} (${m.entity}) נפתח על רשומת-ה-hero${m.facts.coreWired ? ' + מקטע-הגרעין על הרשומה' : ''}', (tester) async {`,
      `    tester.view.physicalSize = const Size(800, 2400); tester.view.devicePixelRatio = 1.0; addTearDown(tester.view.reset);`,
      `    await tester.pumpWidget(const ${N}App()); await tester.pump(const Duration(milliseconds: 300));`,
      `    await tester.tap(find.byKey(const ValueKey('hero-${m.entity}'))); await tester.pump(); await tester.pump(const Duration(milliseconds: 600)); await tester.pump(const Duration(milliseconds: 600));`,
      `    expect(find.byType(${m.screen}), findsOneWidget); expect(tester.takeException(), isNull);`,
      `    final id = ${m.facts.cls}.heroFirstId; // null ⇒ ל-hero אין שורות (מדד בלי צורת where, או 0) — המסך נפתח רגיל; אחרת הכרטיס פתוח`,
      `    if (id != null) { expect(find.byType(BottomSheet), findsOneWidget); ${m.facts.coreWired ? "expect(find.textContaining('מחזור-חיים · רשומה'), findsWidgets); " : ''}}`,
      `    // ignore: avoid_print`,
      `    print('hero-jump ${m.entity}: id=${'$'}id rows=${'$'}{${m.facts.cls}.heroRows(${m.facts.cls}.heroKey).length} panel=${'$'}{find.byType(BottomSheet).evaluate().length}');`,
      '  });']),
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
const SPECS = fs.readdirSync(GEN).filter((f) => /^app-golden(?:-\d+)?\.json$/.test(f)).sort().map((f) => path.join(GEN, f)); // G9c: כל אפליקציות-הזהב (app-golden.json · app-golden-2.json …)
if (isMain) {
  const specs = arg('--spec') ? [arg('--spec')] : arg('--name') ? [null] : SPECS;
  const results = [];
  for (const spec of specs) {
  const req = spec ? JSON.parse(fs.readFileSync(spec, 'utf8')) : { name: arg('--name'), sentences: args('--text') };
  const app = buildApp(req); results.push(app);
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
      app.tested = p; continue;
    }
    continue;
  }
  console.log(`✓ ${app.N}App ⇒ ${app.hubFile} · ${app.mods.length} מודולים: ${app.mods.map((m) => `${m.title}(${m.entity}⇐${m.module.replace('schoolos_', '').replace('.dart', '')})`).join(' · ')} · בדיקה: test/${app.testFile}${app.skipped.length ? ' · ⚪ ' + app.skipped.map((s) => `"${s.text}": ${s.reason}`).join(' · ') : ''}`);
  }
  if (process.argv.includes('--gate')) { console.log(`✓ appgen: ${results.map((a) => `${a.N}App ${a.mods.length} מודולים${a.tested != null ? ` · flutter test ${a.tested}/${a.tested}` : ''}`).join(' · ')} — רכזות+מודולים ≡ מחולל-טרי${process.argv.includes('--test') ? ' · ניווט+חיפוש-רכזת עוברים בפועל' : ''} (${results.reduce((n, a) => n + a.skipped.length, 0)} משפטים בלי-ישות מדווחים)`); process.exit(0); }
}
