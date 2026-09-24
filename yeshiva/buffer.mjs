// ══════════════════════════════════════════════════════════════════════════
//  yeshiva/buffer.mjs — 🚦 **אזור-המתנה עם תקרה ושחרור במנות** (צומת-טנדם / אגירת-ביניים / שירות-באצוות).
//  הכרעת-בעלים 24.9 «תנסה»: «אזור המתנה של הגעות עד 120, משחררים 50 כל 2 דקות» ⇒ מסך: כמה ממתינים (סכום שדה-המספר
//  של הישות פחות מה ששוחרר) · תקרה + התראה מ-90% · כפתור «שחרר מנה» שנפתח רק אחרי הקצב (שחרור מדורג, לא «כולם יחד»)
//  · כל שחרור נשמר (הגדרות החנות: כמה שוחרר, מתי). צורה בלבד: מילות-תקרה/שחרור/קצב מ-spec-lang, הישות לפי גזע.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import * as R from '../machtzev/root.mjs';
import { toks, sameStem } from './mavin.mjs';
export function bufferDeclsOf(form) {
  let SL = {}; try { SL = JSON.parse(fs.readFileSync(R.GEN_DIR + 'spec-lang.data.json', 'utf8')); } catch { return []; }
  const alt = (ws) => (ws || []).map((w) => String(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'); if (!alt(SL.releaseWords)) return [];
  const MU = SL.minuteUnits || {}; const ents = form.things.filter((t) => t.fields && t.fields.length && t.examples && t.examples.length); const out = [];
  for (const seg of form.segments) {
    const rm = seg.match(new RegExp(`(?:${alt(SL.releaseWords)})\\s+(\\d+)\\s+(?:${alt(SL.everyWords)})\\s+(?:(\\d+(?:\\.\\d+)?)\\s+)?(\\S+)`)); if (!rm || !MU[rm[3]]) continue;
    const cm = seg.slice(0, rm.index).match(new RegExp(`(?:${alt(SL.bufferWords)})\\s+(\\d+)`)); if (!cm) continue;
    const ent = ents.find((e) => toks(seg.slice(0, cm.index)).some((w) => sameStem(w, e.label))); if (!ent) continue;
    const fi = ent.fields.findIndex((f, i) => i > 0 && ent.examples.every((r) => /^-?\d+(\.\d+)?$/.test(String(r[i] ?? '').trim()))); if (fi < 0) continue;
    out.push({ seg, ent: ent.label, field: ent.fields[fi].label, ceiling: +cm[1], batch: +rm[1], everyMin: (rm[2] ? +rm[2] : 1) * MU[rm[3]], things: form.things.filter((t) => t.src === seg).map((t) => t.label), sum: ent.examples.reduce((a, r) => a + (parseFloat(r[fi]) || 0), 0) });
  }
  return out;
}
const lit = (v) => "'" + String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$') + "'";
export function emit(b, { cls, slug, entSlug, seedSlug = null, pkg = 'buildsmart' }) {
  const key = (k) => `'${slug}_${k}'`;
  const code = [`// 🚦 חולל ע"י הדלת (yeshiva/buffer · אזור-המתנה עם תקרה ושחרור במנות). אל תערוך ידנית.`, `import 'dart:math' as math;`, `import '../dart-ui-bs/ds/ds_store.dart';`, `import 'package:flutter/material.dart';`, '',
    `class ${cls} extends StatefulWidget {`, `  const ${cls}({super.key});`, '  @override', `  State<${cls}> createState() => _${cls}State();`, '}', '',
    `class _${cls}State extends State<${cls}> {`,
    `  static const num ceiling = ${b.ceiling}, batch = ${b.batch}, everyMin = ${b.everyMin};`,
    `  num get _total => appStore.records('${entSlug}').fold<num>(0, (a, r) => a + (num.tryParse((r[${lit(b.field)}] ?? '').trim()) ?? 0));`,
    `  num get _released => num.tryParse(appStore.setting(${key('released')}, '0')) ?? 0;`,
    // ⚖️ השופט (יתרון: «להגביל את מספר הפריטים הפתוחים … כך שחדש נכנס רק כשאחד יוצא» · מגבלות WIP / משיכה): בפנים לעולם לא יותר מהתקרה;
    //    מי שמעבר לה ממתין בחוץ, ונכנס לבד רק כשמשתחרר מקום (נכנסו = min(הגיעו, שוחררו + תקרה)).
    `  num get _admitted => math.min(_total, _released + ceiling);`,
    `  num get _fill => math.max(0, _admitted - _released);`,
    `  num get _outside => math.max(0, _total - _admitted);`,
    `  double get _waitMin { final last = DateTime.tryParse(appStore.setting(${key('last')}, '')); if (last == null) return 0; return math.max(0, everyMin - DateTime.now().difference(last).inSeconds / 60.0); }`,
    `  void _release() { final m = math.min(batch, _fill); if (m <= 0) return; appStore.setSetting(${key('released')}, '\${_released + m}'); appStore.setSetting(${key('last')}, DateTime.now().toIso8601String()); }`,
    '  @override', `  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {`,
    '        final fill = _fill, wait = _waitMin, can = fill > 0 && wait <= 0;',
    `        return Scaffold(appBar: AppBar(title: Text(${lit(b.seg)})), body: ListView(padding: const EdgeInsets.all(16), children: [`,
    `          Text('\$fill / \$ceiling', key: const Key('buf-fill'), style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w700)),`,
    `          const SizedBox(height: 8), LinearProgressIndicator(value: (fill / ceiling).clamp(0, 1).toDouble()),`,
    `          if (fill >= ceiling) Text(${lit('מלא — הכניסה סגורה עד שמשתחרר מקום')}, key: const Key('buf-over')) else if (fill >= ceiling * 0.9) Text(${lit('קרוב לתקרה')}, key: const Key('buf-near')),`,
    `          if (_outside > 0) Text('${'ממתינים בחוץ (ייכנסו כשיתפנה מקום)'}: \${_outside}', key: const Key('buf-out')),`,
    `          const SizedBox(height: 16), FilledButton(key: const Key('buf-release'), onPressed: can ? _release : null, child: Text(${lit(`שחרר מנה (${b.batch})`)})),`,
    `          if (wait > 0) Text('${'שחרור הבא בעוד'} \${wait.ceil()} ${'דק׳'}', key: const Key('buf-next')),`,
    `          Text('${'שוחררו עד עכשיו'}: \${_released}', key: const Key('buf-released')),`,
    '        ]));', '      });', '}', ''].join('\n');
  const in0 = Math.min(b.sum, b.ceiling), out0 = b.sum - in0;   // בפנים עד התקרה, השאר בחוץ
  const adm1 = Math.min(b.sum, Math.min(b.batch, in0) + b.ceiling); const after1 = adm1 - Math.min(b.batch, in0), out1 = b.sum - adm1;   // אחרי מנה: מי שבחוץ נכנס עד התקרה
  const test = seedSlug ? [`// 🎯 מבחן-קבלה (אזור-המתנה): הדוגמאות ⇒ בפנים עד התקרה, השאר בחוץ · שחרור מנה מוריד ומכניס מבחוץ · שחרור שני מיד — חסום (קצב). חולל; אל תערוך.`,
    `import 'package:flutter/material.dart';`, `import 'package:flutter_test/flutter_test.dart';`, `import 'package:${pkg}/genesis/dart-gen-bs/gen_${seedSlug}.dart';`, `import 'package:${pkg}/genesis/dart-gen-bs/gen_${slug}.dart';`,
    'void main() {', `  testWidgets(${lit(`אזור-המתנה: ${b.sum} ממתינים, תקרה ${b.ceiling}, מנה ${b.batch} כל ${b.everyMin} דק׳`)}, (tester) async {`,
    '    seedExamples();', `    await tester.pumpWidget(const MaterialApp(home: ${cls}()));`, '    await tester.pump();',
    `    expect(find.text('${in0} / ${b.ceiling}'), findsOneWidget, reason: ${lit(`הגיעו ${b.sum} · בפנים לעולם לא יותר מ-${b.ceiling}`)});`,
    ...(out0 > 0 ? [`    expect(find.byKey(const Key('buf-out')), findsOneWidget, reason: ${lit(`${out0} ממתינים בחוץ`)});`] : []),
    ...(in0 >= b.ceiling ? [`    expect(find.byKey(const Key('buf-over')), findsOneWidget);`] : in0 >= b.ceiling * 0.9 ? [`    expect(find.byKey(const Key('buf-near')), findsOneWidget);`] : []),
    `    await tester.tap(find.byKey(const Key('buf-release'))); await tester.pump();`,
    `    expect(find.text('${after1} / ${b.ceiling}'), findsOneWidget, reason: ${lit(`שחרור מנה: ${in0} ⇒ ${in0 - Math.min(b.batch, in0)}, ומבחוץ נכנסים ${adm1 - in0} ⇒ ${after1}`)});`,
    ...(out1 === 0 && out0 > 0 ? [`    expect(find.byKey(const Key('buf-out')), findsNothing, reason: ${lit('כל מי שחיכה בחוץ נכנס')});`] : []),
    `    await tester.tap(find.byKey(const Key('buf-release')), warnIfMissed: false); await tester.pump();`,
    `    expect(find.text('${after1} / ${b.ceiling}'), findsOneWidget, reason: ${lit(`שחרור שני מיד — חסום עד ${b.everyMin} דק׳`)});`,
    `    expect(find.byKey(const Key('buf-next')), findsOneWidget);`, '  });', '}', ''].join('\n') : null;
  return { code, test, after1, in0, out0 };
}
