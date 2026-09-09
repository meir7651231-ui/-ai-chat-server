#!/usr/bin/env node
// 🧭 app-shell — ניווט-מקשרים (GENMAX·G26 · הכרעה-27): אפליקציה, לא רשימת-מסכים.
//   הניווט נגזר מצורת-הדאטה בלבד — גרף-הקשרים: הישות שהכי-הרבה ישויות מצביעות עליה = השורש (מרכז-הכובד);
//   הישויות-הבנות = חלקים בעמוד-השורש (רשימה מסוננת לפי הרשומה + הוספה עם מילוי-מראש); הדוח והשליחה = פעולות על רשומת-השורש;
//   לוח-הבקרה = הבית; כל שאר תוצרי-המנוע (חלקיקים · סקירה · כרטיס · מסך-אמת · מערכת) = מגירת "עוד" (הרכזת הישנה, ביט-זהה).
//   אפס מילון-דומייני: שמות מהספק, אטומים מחיפוש-פתוח (switch לסרגל · group לחלקים · fact(label+value) לעובדות · action לפעולות).
import { makeConsts, write, isPaper } from './render-ds.mjs';
import { searchOp, wireAtom, pickWired, particleWidgets } from './particles.mjs';
import { L, T } from './chrome.mjs';
import fs0 from 'node:fs';
const SL0 = JSON.parse(fs0.readFileSync(new URL('./spec-lang.data.json', import.meta.url), 'utf8'));
const isTimeLabel = (f) => !/^(num|date|bool|multiline)$/.test(f.type || '') && !(f.enumVals && f.enumVals.length) && String(f.label).split(/\s+/).some((w) => (SL0.typeTime || []).includes(w));   // שדה-שעה לפי דקדוק-האפיון

const clsOf = (slug) => 'Gen' + slug.replace(/(^|_)([a-z0-9])/g, (_, __, c) => c.toUpperCase()) + 'Screen';
const impOf = (w) => `import '../${w.file.startsWith('dart-') ? w.file : 'dart-ui-bs/' + w.file}';`;

// השורש = הישות עם הכי-הרבה מצביעים-נכנסים (backRefs); שוויון ⇒ הראשונה בספק. אין מצביעים ⇒ אין שלד (הרכזת נשארת).
export function pickRoot(entMeta, backRefs) {
  let best = null;
  for (const e of entMeta) { const n = (backRefs[e.name] || []).length; if (n > 0 && (!best || n > best.n)) best = { e, n }; }
  if (!best && entMeta.length === 1) return entMeta[0];   // G27 · ישות יחידה = השורש (אין מצביעים, אבל יש מרכז-כובד אחד)
  return best ? best.e : null;
}

// ── עמוד-השורש (רשומה אחת): עובדות · חלק-לכל-ישות-בת (רשומות + הוספה) · דוח · (השליחה בתוך הדוח) ──
export function renderRootPage(slug, { root, children, report, title }) {
  const { k, dump } = makeConsts(slug);
  const imports = new Set([`import 'gen_${root.slug}.dart';`]);
  const firstWired = (pick, ctx) => { const w = pickWired([...pick.atoms, ...pick.alts], (c) => wireAtom(c, ctx)); if (w) imports.add(impOf(w)); return w; };
  const goal = `${root.name} ${title}`;
  const notes = [];
  // עובדות: שדות-השורש (בלי מקוננים) — אטום label+value (חיפוש fact עם צורך label+value ⇒ שורת מפתח-ערך, לא שבב)
  const factFields = root.schema.filter((f) => !(f.members && f.members.length));
  // עובדה-בכרטיס = label+value בלי גליף (אריח-KPI דורש glyph ⇒ נפסל; נשאר שורת מפתח-ערך) — משפחת-stat, צלילה ל-12 חלופות
  const facts = factFields.map((f) => firstWired(searchOp('magnitude', goal, ['label', 'value'], 12), { label: k(f.label), value: { str: f.type === 'num' ? `_fmtNum(r0[${k(f.label)}] ?? '')` : f.type === 'date' ? `_fmtDate(r0[${k(f.label)}] ?? '')` : `(r0[${k(f.label)}] ?? '')`, num: `(num.tryParse(r0[${k(f.label)}] ?? '') ?? 0)` }, sub: k(''), tone: 0, must: ['value'] }));
  if (facts.some((w) => !w)) notes.push(L.rootNoFact);
  const factRows = factFields.map((f, i) => facts[i] ? `if ((r0[${k(f.label)}] ?? '').trim().isNotEmpty) ${facts[i].call}` : null).filter(Boolean);
  const sectionOf = (label, children) => { const g = firstWired(searchOp('group', goal), { label, children, sub: label, tone: 0 }); return g ? (/children:/.test(g.call) ? g.call : `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${g.call}, ${children.join(', ')}])`) : `Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [${children.join(', ')}])`; };
  const blocks = [];
  const paper = isPaper();   // G28 · נייר: העובדות מקופלות («פרטים (n)», PLAN §3.2) אחרי הבנות והדוח — המסך מציג מה-לעשות, לא טבלה
  if (factRows.length && !paper) blocks.push(sectionOf(k(L.rootFacts), factRows));
  for (const c of children) {
    imports.add(`import 'gen_${c.slug}.dart';`);
    const recs = `appStore.referencing('${c.slug}', ${k(c.link)}, id)`;
    const disp = c.descField ? `(r[${k(c.descField)}] ?? '')` : `appStore.displayOf('${c.slug}', r[AppStore.idKey] ?? '')`;
    const sub = c.subField ? `(r[${k(c.subField)}] ?? '')` : `''`;
    const open = `() => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${c.cls}(scopeField: ${k(c.link)}, scopeId: id)))`;
    const add = firstWired(searchOp('action', `${c.name} ${goal}`), { label: k(T('rootAdd', { ent: c.name })), nav: open, glyph: k('➕') });
    if (!add) notes.push(`${c.name}: ${L.rootNoAction}`);
    const rows = `for (final r in ${recs}) DsNavTile(glyph: ${k(c.icon || '🗂️')}, title: ${disp}, sub: ${sub}, onTap: ${open})`;
    blocks.push(sectionOf(`${k(c.name)} + ' · ' + ${recs}.length.toString()`, [rows, ...(add ? [add.call] : [])]));
  }
  if (report) {
    imports.add(`import 'gen_${report.slug}.dart';`);
    const rep = firstWired(searchOp('action', `${L.rootReport} ${goal}`), { label: k(L.rootReport), nav: `() => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${report.cls}(initialId: id)))`, glyph: k('📄') });
    if (rep) blocks.push(rep.call); else notes.push(`${L.rootReport}: ${L.rootNoAction}`);
  }
  if (factRows.length && paper) blocks.push(`DsFold(title: ${k(T('foldLabel', { n: factRows.length }))}, details: [${factRows.join(', ')}])`);
  const phoneLabels = root.schema.filter((f) => !/^(num|date|bool|multiline)$/.test(f.type || '') && String(f.label).split(/\s+/).some((w) => (SL0.typePhone || []).includes(w))).map((f) => f.label);   // שדה-טלפון ⇒ «התקשר» · «וואטסאפ» (tel: · wa.me, אפס-מפתח)
  if (paper && phoneLabels.length) blocks.push(`(() { final ph = [${phoneLabels.map((l) => `(r0[${k(l)}] ?? '')`).join(', ')}].map((x) => x.replaceAll(RegExp(r'[^0-9+]'), '')).firstWhere((x) => x.length >= 9, orElse: () => ''); if (ph.isEmpty) return const SizedBox.shrink(); final intl = ph.startsWith('+') ? ph.substring(1) : (ph.startsWith('0') ? '972' + ph.substring(1) : ph); return Padding(padding: const EdgeInsets.only(bottom: 10), child: Row(children: [DsChipButton(label: ${k(L.callLabel)}, onTap: () => launchUrl(Uri.parse('tel:' + ph), mode: LaunchMode.externalApplication)), const SizedBox(width: 8), DsChipButton(label: ${k(L.waLabel)}, onTap: () => launchUrl(Uri.parse('https://wa.me/' + intl), mode: LaunchMode.externalApplication))])); })()`);
  const locLabels = root.schema.filter((f) => !/^(num|date|bool|multiline)$/.test(f.type || '') && String(f.label).split(/\s+/).some((w) => (SL0.typeLocation || []).includes(w))).map((f) => f.label);   // שדה-מקום ⇒ «ניווט» (maps, אפס-מפתח)
  if (paper && locLabels.length) blocks.push(`(() { final loc = [${locLabels.map((l) => `(r0[${k(l)}] ?? '')`).join(', ')}].map((x) => x.trim()).firstWhere((x) => x.length >= 3, orElse: () => ''); if (loc.isEmpty) return const SizedBox.shrink(); return Padding(padding: const EdgeInsets.only(bottom: 10), child: Row(children: [DsChipButton(label: ${k(L.navLabel)} + ' · ' + (loc.length > 24 ? loc.substring(0, 24) + '…' : loc), onTap: () => launchUrl(Uri.parse('https://maps.google.com/?q=' + Uri.encodeComponent(loc)), mode: LaunchMode.externalApplication))])); })()`);
  if (paper) blocks.push(`Padding(padding: const EdgeInsets.only(bottom: 10), child: DsQuickAdd(hint: ${k(L.noteAddHint)}, onSubmit: (t) { final v = t.trim(); if (v.isEmpty) return; final prev = r0['__note'] ?? ''; final stamp = DateTime.now().toIso8601String().substring(0, 10); appStore.update('${root.slug}', id, {'__note': (prev.isEmpty ? '' : prev + '\\n') + stamp + ' · ' + v}); appStore.logAction('auto', ${k(L.noteAddLog)}.replaceAll('{who}', appStore.displayOf('${root.slug}', id)), entity: '${root.slug}', rid: id, field: '__note', prev: prev); }))`);   // «מה קרה מאז?» — הערה מתוארכת נצברת ב«מה כתבת», עם החזר
  const lastStage = root.stages && root.stages.length ? root.stages.length - 1 : -1;
  if (paper && lastStage >= 0) blocks.push(`(appStore.stageOf('${root.slug}', id) >= ${lastStage} ? const SizedBox.shrink() : Padding(padding: const EdgeInsets.only(bottom: 10), child: Row(children: [DsChipButton(label: ${k(L.closeLabel)}, onTap: () { final prev = r0[AppStore.stageKey] ?? '0'; appStore.update('${root.slug}', id, {AppStore.stageKey: '${lastStage}'}); appStore.logAction('auto', ${k(L.closeLog)}.replaceAll('{who}', appStore.displayOf('${root.slug}', id)), entity: '${root.slug}', rid: id, field: AppStore.stageKey, prev: prev); })])))`);   // «סגור תיק» = השלב-האחרון, עם החזר (השלב חוזר)
  if (paper) blocks.push(`Padding(padding: const EdgeInsets.only(bottom: 10), child: Row(children: [DsChipButton(label: ${k(L.deleteLabel)}, onTap: () { final snap = Map<String, String>.from(r0); appStore.removeById('${root.slug}', id); appStore.logAction('del', ${k(L.delLog)}.replaceAll('{who}', snap.values.take(2).join(' · ')), entity: '${root.slug}', rid: id, prev: jsonEncode(snap)); Navigator.of(context).pop(); })]))`);   // «מחק» עם החזר (הרשומה חוזרת כמו שהייתה) — «עשיתי לבד» מציג
  if (paper) blocks.push(`Padding(padding: const EdgeInsets.only(bottom: 10), child: Row(children: [DsChipButton(label: ${k(L.editLabel)}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${root.cls}(editId: id))))]))`);   // «ערוך» = מסך-הישות פתוח על הרשומה הזו (תיקון שדה בלי לחפש)
  if (paper && !report) blocks.push(`Padding(padding: const EdgeInsets.only(bottom: 10), child: Row(children: [DsChipButton(label: ${k(L.shareLabel)}, onTap: () { final lines = <String>[appStore.displayOf('${root.slug}', id)]; for (final e in r0.entries) { if (e.key.startsWith('__') || e.value.trim().isEmpty) continue; lines.add(e.key + ': ' + e.value.trim()); } launchUrl(Uri.parse('https://wa.me/?text=' + Uri.encodeComponent(lines.join('\\n'))), mode: LaunchMode.externalApplication); })]))`);   // מודול בלי דוח: «שתף» = הרשומה כטקסט (wa.me, הנמען נבחר שם)
  if (paper) blocks.push(`((r0['__note'] ?? '').trim().isNotEmpty ? DsFold(title: ${k(L.origText)}, details: [Text(_noteText(r0['__note'] ?? ''), style: TextStyle(color: DsLook.of(context).ink, fontSize: 15, height: 1.5))]) : const SizedBox.shrink())`);   // הטקסט המקורי
  if (paper) blocks.push(`((r0['__doc'] ?? '').startsWith('data:image') ? DsFold(title: ${k(L.docTitle)}, details: [ClipRRect(borderRadius: BorderRadius.circular(12), child: Image.memory(base64Decode((r0['__doc'] ?? '').split(',').last), fit: BoxFit.fitWidth))]) : const SizedBox.shrink())`);   // G33 · מחסנית-מסמכים: הצילום שנשמר עם הרשומה
  const stageSub = root.stages && root.stages.length ? `const [${root.stages.map((s) => k(s)).join(', ')}][appStore.stageOf('${root.slug}', id).clamp(0, ${root.stages.length - 1})]` : k(root.name);
  const cls = clsOf(slug);
  const code = `// 🧭 חולל ע"י ניווט-מקשרים (app-shell · G26 · הכרעה-27) — עמוד-השורש: עובדות · ישויות-בנות (מסוננות לרשומה) · דוח. אל תערוך ידנית.
${notes.map((n) => '//   ⚪ ' + n).join('\n')}
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
${[...imports].sort().join('\n')}
${paper ? "import 'dart:convert';" : ''}
${paper && (phoneLabels.length || locLabels.length || !report) ? "import 'package:url_launcher/url_launcher.dart';" : ''}
import 'package:flutter/material.dart';

/// 8000 ⇒ 8,000 · 12.5 ⇒ 12.5 — סכום קריא בתיק (רק תצוגה; הרשומה נשארת ספרות)
/// ב׳-מג · תאריך בתיק כמו שאומרים: היום (9.9) · מחר (10.9) · יום שני 21.9 · 3.10.2027 — ISO נשאר בנתונים
String _fmtDate(String s) { final t = s.trim(); final d = DateTime.tryParse(t.length == 10 ? '\${t}T12:00:00' : t); if (d == null) return t; final now = DateTime.now(); final n = DateTime(d.year, d.month, d.day).difference(DateTime(now.year, now.month, now.day)).inDays; final dm = '\${d.day}.\${d.month}'; if (n == 0) return ${k(L.homeToday)} + ' (' + dm + ')'; if (n == 1) return ${k(L.homeTomorrow)} + ' (' + dm + ')'; if (n == -1) return ${k(L.dayYesterday)} + ' (' + dm + ')'; if (n.abs() <= 6) return ${k(L.dayPrefix)}.replaceAll('{day}', ${k(L.dayNames)}.split(',')[d.weekday % 7]) + ' ' + dm; return dm + '.\${d.year}'; }
/// ב׳-נד · שורות «מה קרה מאז?» — «2026-09-01 · טקסט» ⇒ «יום שלישי 1.9 · טקסט»
String _noteText(String s) => s.split('\\n').map((l) { final m = RegExp(r'^(\\d{4}-\\d{2}-\\d{2}) · (.*)$').firstMatch(l); return m == null ? l : _fmtDate(m.group(1)!) + ' · ' + m.group(2)!; }).join('\\n');
String _fmtNum(String s) { final t = s.trim(); final v = num.tryParse(t.replaceAll(',', '')); if (v == null) return t; final parts = t.replaceAll(',', '').split('.'); final ip = parts[0].replaceAllMapped(RegExp(r'\\B(?=(\\d{3})+(?!\\d))'), (m) => ','); return parts.length > 1 ? ip + '.' + parts[1] : ip; }

class ${cls} extends StatelessWidget {
  const ${cls}({required this.id, super.key});
  final String id;   // ignore: unused_element
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final r0 = appStore.byId('${root.slug}', id);
    if (r0 == null) return DsScaffold(title: ${k(root.name)}, subtitle: ${k(L.rootMissing)}, icon: ${k('🗂️')}, children: const []);
    return DsScaffold(title: appStore.displayOf('${root.slug}', id), subtitle: ${stageSub}, icon: ${k(root.icon || '🗂️')}, children: [
${blocks.map((b) => `      Padding(padding: const EdgeInsets.only(bottom: 12), child: ${b}),`).join('\n')}
    ]);
  });
}
`;
  write(slug, code, dump());
  return { slug, cls, notes };
}

// ── G30 · «היום» (נייר): הרשומות הפתוחות של השורש ⇒ כרטיס-אחד לכל אחת: משפט בגוף-ראשון · בורר-הנוסחים (חלקיק-ההודעה) · שלח · פתח.
//    ≤2 הקשות מהמסך-הראשי לפעולה-הראשית (בחר-נוסח + שלח), אפס-הקלדה. הכל מחלקיקים קיימים (message · export) — אין קוד-דומייני.
export function renderHome(slug, { root, rootPage, report, message, title, chain = [], appTitle = '' }) {   // G33 · appTitle = שם-המודול ב«היום» המאוחד   // G32 · chain = השרשרת מהפירוק (צעד-הבא בשלב-האחרון)
  const { k, dump } = makeConsts(slug);
  const imports = new Set([`import 'gen_${rootPage.slug}.dart';`, `import '../dart-data-bs/auto/gen_${slug}_content.dart';`, `import '../dart-ui-bs/ds/ds.dart';`, `import '../dart-ui-bs/ds/ds_store.dart';`, `import 'package:url_launcher/url_launcher.dart';`]);   // G32 · קבוצה אחת ⇒ אין כפל-ייבוא
  const firstWired = (pick, ctx) => { const w = pickWired([...pick.atoms, ...pick.alts], (c) => wireAtom(c, ctx)); if (w) imports.add(impOf(w)); return w; };
  const notes = [];
  const disp = root.descField ? `(r[${k(root.descField)}] ?? '')` : `appStore.displayOf('${root.slug}', r[AppStore.idKey] ?? '')`;
  const openRecs = root.stages && root.stages.length ? `appStore.records('${root.slug}').where((r) => appStore.stageOf('${root.slug}', r[AppStore.idKey] ?? '') < ${root.stages.length - 1}).toList()` : `appStore.records('${root.slug}')`;
  // חלקיק-ההודעה של הדוח (אם יש) — אותו חיווט, רשומה-אחת
  let msgW = null, msgImports = new Set();
  if (message) { const w = particleWidgets({ entity: message.entity, plan: [message.p], k, recs: '[r]' }); msgImports = w.imports; if (w.widgets.length) msgW = w.widgets[0]; else notes.push(...w.notes); }
  for (const i of msgImports) imports.add(i);
  // שליחה: הטקסט של הדוח + המנוע-המקשר (waLink…) — כמו הייצוא של הדוח
  let sendFn = '', sendBtn = '';
  if (report && report.export) {
    imports.add(`import 'gen_${report.slug}.dart';`); for (const f of report.export.files) imports.add(`import '../${f}';`);
    imports.add(`import 'package:share_plus/share_plus.dart';`); imports.add(`import 'package:url_launcher/url_launcher.dart';`);
    sendFn = `
  static Future<void> send(BuildContext context, Map<String, String> r0, String id0) async {
    final text = ${report.textFn}(r0, id0);
    final dynamic url = ${report.export.linkRaw.replace(/__K\(("[^"]*")\)/g, (_, j) => k(JSON.parse(j)))};
    if (url is String && url.isNotEmpty) { await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication); return; }
    await Share.share(text);
  }`;
    const b = firstWired(searchOp('action', `${L.homeSend} ${root.name}`), { label: k(L.homeSend), nav: `() => send(context, r, r[AppStore.idKey] ?? '')`, glyph: k('') });
    if (b) sendBtn = b.call; else notes.push(L.rootNoAction);
  }
  const openBtn = firstWired(searchOp('action', `${L.homeOpen} ${root.name}`), { label: k(L.homeOpen), nav: `() => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${rootPage.cls}(id: r[AppStore.idKey] ?? '')))`, glyph: k('') });
  const stageSub = root.stages && root.stages.length ? `const [${root.stages.map((s) => k(s)).join(', ')}][appStore.stageOf('${root.slug}', r[AppStore.idKey] ?? '').clamp(0, ${root.stages.length - 1})]` : k(root.name);
  const cls = clsOf(slug);
  // G32 · שדות-התאריך של השורש (חובה = hard-deadline, P8) · השלב האחרון · השרשרת
  const dateFields = root.schema.filter((f) => f.type === 'date').map((f) => ({ label: f.label, hard: !!f.required }));
  const phoneList = `[${root.schema.filter((f) => !/^(num|date|bool|multiline)$/.test(f.type || '') && String(f.label).split(/\s+/).some((w) => (SL0.typePhone || []).includes(w))).map((f) => k(f.label)).join(', ')}]`;   // ב׳-לח · שדות-טלפון ⇒ «התקשר» על שורת-היום
  const numList = `[${root.schema.filter((f) => f.type === 'num' && !String(f.label).split(/\s+/).some((w) => (SL0.typePercent || []).includes(w))).map((f) => k(f.label)).join(', ')}]`;   // ב׳-מ · שדה-הסכום הראשי (לא אחוז) ⇒ ₪ על השורה
  const timeList = `[${root.schema.filter(isTimeLabel).map((f) => k(f.label)).join(', ')}]`;   // שדות-שעה ⇒ השעה על שורת-היום והתוכנית מקבעת אותה
  const lastStage = root.stages && root.stages.length ? root.stages.length - 1 : -1;
  const dispR = disp;
  const dateList = `[${dateFields.map((f) => `_D(${k(f.label)}, ${f.hard ? 'true' : 'false'})`).join(', ')}]`;
  const nextName = chain.length ? k(chain[0]) : null;
  const sendLog = sendFn ? `appStore.logAction('send', ${k(L.sendDid)}.replaceAll('{who}', appStore.displayOf('${root.slug}', id0)), entity: '${root.slug}', rid: id0, prev: appStore.stageOf('${root.slug}', id0).toString());` : '';
  const sendFn2 = sendFn.replace('    final text = ', `    ${sendLog}\n    final text = `);
  const code = `// 🧭 חולל ע"י ניווט-מקשרים (app-shell · G30+G32 · הכרעה-28) — «היום»: מונה-עומס · באיחור · היום · ממתין-לאישורך · עשיתי-לבד · מחר (מקופל) · דבר-אחד לכל רשומה פתוחה.
//   הכל נגזר ברינדור מהרשומות ומשדות-התאריך (P3) · תזכורות −N ימים (P1, עריך) · soft לא בשבת (P8) · יום-ההכרעה = בלי דחייה (P4) · שאל-לפני-פעולה (P11) · «תמיד אשר» ⇒ לבד + יומן + החזר (T2) · שליחה רק בהקשה (T5). אל תערוך ידנית.
${notes.map((n) => '//   ⚪ ' + n).join('\n')}
${[...imports].sort().join('\n')}
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class _D { const _D(this.label, this.hard); final String label; final bool hard; }

// G33 · ספק-«היום» של המודול (הכרעה-29): נגזרות · הצעות · כרטיס-רשומה · טייס-אוטומטי — ציבורי, כדי ש«היום» המאוחד של «בלגן» ימזג את כל המודולים
class ${cls}Today {
  static const module = ${k(appTitle || title)};
  static const _dates = ${dateList};
  static const List<String> _times = ${timeList};
  static const List<String> _phones = ${phoneList};
  static const List<String> _nums = ${numList};
  static String _moneyOf(Map<String, String> r) { if (_nums.isEmpty) return ''; final v = double.tryParse((r[_nums.first] ?? '').replaceAll(',', '').trim()); if (v == null || v <= 0) return ''; final s = v.round().toString(); final b = StringBuffer(); for (var i = 0; i < s.length; i++) { if (i > 0 && (s.length - i) % 3 == 0) b.write(','); b.write(s[i]); } return '₪ ' + b.toString(); }   // ב׳-מ · הכסף של התיק, על השורה (אותו שדה-ראשי של כסף-במבט)
  static String _phoneOf(Map<String, String> r) { for (final l in _phones) { final v = (r[l] ?? '').replaceAll(RegExp(r'[^0-9+]'), ''); if (v.length >= 9) return v; } return ''; }   // ב׳-לח · הטלפון של התיק (הראשון שנראה כמו טלפון)
  /// חזרה («כל חודש» = m1 · «כל שבועיים» = w2 · «כל 3 ימים» = d3 · «כל שנה» = y1): המועד-הבא מהמועד שנסגר; חודש עם פחות ימים ⇒ היום-האחרון
  static DateTime nextRepeat(DateTime d, String code) {
    final n = int.tryParse(code.substring(1)) ?? 1;
    switch (code.isEmpty ? '' : code[0]) {
      case 'd': return DateTime(d.year, d.month, d.day + n);
      case 'w': return DateTime(d.year, d.month, d.day + 7 * n);
      case 'm': { final t = DateTime(d.year, d.month + n, 1); final last = DateTime(t.year, t.month + 1, 0).day; return DateTime(t.year, t.month, d.day > last ? last : d.day); }
      case 'y': { final t = DateTime(d.year + n, d.month, 1); final last = DateTime(t.year, t.month + 1, 0).day; return DateTime(t.year, t.month, d.day > last ? last : d.day); }
      default: return d;
    }
  }
  static String _timeOf(Map<String, String> r) { for (final l in _times) { final v = (r[l] ?? '').trim(); if (RegExp(r'^\\d{1,2}:\\d{2}\$').hasMatch(v)) return v.padLeft(5, '0'); } return ''; }
  static DateTime _day(DateTime d) => DateTime(d.year, d.month, d.day);
  static DateTime? _parse(String s) { final t = s.trim(); if (t.isEmpty) return null; try { return _day(DateTime.parse(t.length == 10 ? '\${t}T12:00:00' : t)); } catch (_) { return null; } }
  static List<int> _offsets() => appStore.setting('offsets', '3,1,0').split(',').map((x) => int.tryParse(x.trim()) ?? 0).toList();
  static DateTime _shift(DateTime d, bool hard) => hard ? d : (d.weekday == DateTime.saturday ? d.add(const Duration(days: 1)) : d);   // P8 · soft לא בשבת
  static String _iso(DateTime d) => d.toIso8601String().substring(0, 10);
  /// ב׳-מא · תאריך כמו שאומרים אותו: היום · מחר · אתמול · יום שלישי 8.9 (עד שבוע) · 15.9 · 3.10.2027 (שנה אחרת)
  static String _dayLabel(DateTime d, DateTime today) { final n = _day(d).difference(_day(today)).inDays; if (n == 0) return ${k(L.homeToday)}; if (n == 1) return ${k(L.homeTomorrow)}; if (n == -1) return ${k(L.dayYesterday)}; final dm = '\${d.day}.\${d.month}' + (d.year == today.year ? '' : '.\${d.year}'); return n.abs() <= 6 ? ${k(L.dayPrefix)}.replaceAll('{day}', ${k(L.dayNames)}.split(',')[d.weekday % 7]) + ' ' + dm : dm; }
  static String _remKey(String rid, String field) => 'rem:\$rid:\$field';
  static List<Map<String, String>> open() => ${openRecs};${sendFn2}

  static DsTodayItem _mk(String title, String sub, String rid, String field, DateTime d, bool hard, bool overdue, DateTime today, [String time = '', bool rep = false, String phone = '', String money = '']) {
    final acts = <String>[...(overdue ? [${k(L.actDone)}, ${k(L.actSnooze)}, ${k(L.actSnoozeWeek)}, ${k(L.actIgnore)}] : (d == today ? [${k(L.actDone)}, ${k(L.actCal)}] : [${k(L.actDone)}, ${k(L.actSnooze)}, ${k(L.actCal)}])), if (phone.isNotEmpty) ${k(L.callLabel)}];   /* ב׳-לח · תיק עם טלפון ⇒ «התקשר» מהשורה, הקשה אחת */   // P4 · ביום-ההכרעה אין דחייה · «ליומן» = קישור-יומן, אפס-מפתח
    return DsTodayItem(title: (rep ? '↻ ' : '') + title, sub: [time, sub, money].where((x) => x.isNotEmpty).join(' · '), rid: rid, field: field, due: d, hard: hard, overdue: overdue, module: module, actions: acts, act: (i) => _act(rid, field, d, acts, i), time: time);   /* ב׳-מ · מה · מתי · כמה — באותה שורה */
  }
  static void _act(String rid, String field, DateTime due, List<String> acts, int i) {
    final a = acts[i.clamp(0, acts.length - 1)];
    if (a == ${k(L.actDone)}) {
      final r0 = appStore.byId('${root.slug}', rid); final rep = (r0 == null ? '' : (r0['__repeat'] ?? '')).trim();
      final prevStage = r0 == null ? '' : (r0[AppStore.stageKey] ?? '0');
      ${lastStage >= 0 ? `appStore.advance('${root.slug}', rid, ${lastStage + 1});` : ''}
      appStore.decide('ign:\$rid:\$field', 'no');   // השורה של התאריך הזה טופלה — לא חוזרת מחר כ«באיחור»
      appStore.logAction('done', ${k(L.doneLog)}.replaceAll('{what}', field + ' · ' + appStore.displayOf('${root.slug}', rid)), entity: '${root.slug}', rid: rid, field: field, prev: prevStage);   // «עשיתי» + החזר (השורה חוזרת, השלב חוזר)
      if (r0 != null && rep.isNotEmpty) {   // ↻ רגע חוזר: «סיים» יוצר את הבא לבד (המועד-הבא בשדה שנסגר), עם החזר
        final next = <String, String>{for (final e in r0.entries) if (!e.key.startsWith('__') || e.key == '__repeat' || e.key == '__note') e.key: e.value};
        next[field] = _iso(nextRepeat(due, rep)); ${lastStage >= 0 ? `next['__stage'] = '0';` : ''}
        final nid = appStore.add('${root.slug}', next);
        appStore.logAction('add', ${k(L.repeatLog)}.replaceAll('{title}', appStore.displayOf('${root.slug}', nid) + ' · ' + next[field]!), entity: '${root.slug}', rid: nid);
      }
    }
    else if (a == ${k(L.actSnooze)}) { final r = appStore.byId('${root.slug}', rid); if (r != null) { final prev = r[field] ?? ''; appStore.update('${root.slug}', rid, {field: _iso(_shift(due.add(const Duration(days: 1)), false))}); /* «דחה למחר» לא נוחת בשבת (אותו _shift של תזכורת-רכה) */ appStore.logAction('auto', ${k(L.actSnooze)} + ' · ' + field, entity: '${root.slug}', rid: rid, field: field, prev: prev); } }   // נגיעה-ידנית (P5) — נרשמת עם החזר
    else if (a == ${k(L.actSnoozeWeek)}) { final r = appStore.byId('${root.slug}', rid); if (r != null) { final prev = r[field] ?? ''; appStore.update('${root.slug}', rid, {field: _iso(_shift(due.add(const Duration(days: 7)), false))}); appStore.logAction('auto', ${k(L.actSnoozeWeek)} + ' · ' + field, entity: '${root.slug}', rid: rid, field: field, prev: prev); } }   /* «דחה לשבוע» — נגיעה-ידנית עם החזר, לא בשבת */
    else if (a == ${k(L.actCal)}) {   // «ליומן»: עם שעה ⇒ אירוע בשעתו (אורך = בלוק-ההגדרה); בלי ⇒ יום-שלם
      final r = appStore.byId('${root.slug}', rid); final tm = r == null ? '' : _timeOf(r); final d = _iso(due).replaceAll('-', '');
      String z(DateTime x) => x.toIso8601String().substring(0, 16).replaceAll(RegExp(r'[-:]'), '') + '00';
      final block = (int.tryParse(appStore.setting('blockMin', '30')) ?? 30).clamp(5, 240);
      final dates = tm.isEmpty ? d + '/' + d : () { final a0 = DateTime(due.year, due.month, due.day, int.parse(tm.substring(0, 2)), int.parse(tm.substring(3, 5))); return z(a0) + '/' + z(a0.add(Duration(minutes: block))); }();
      launchUrl(Uri.parse('https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + Uri.encodeComponent(field + ' · ' + appStore.displayOf('${root.slug}', rid)) + '&dates=' + dates), mode: LaunchMode.externalApplication);
    }
    else if (a == ${k(L.callLabel)}) { final r = appStore.byId('${root.slug}', rid); final ph = r == null ? '' : _phoneOf(r); if (ph.isNotEmpty) launchUrl(Uri.parse('tel:' + ph), mode: LaunchMode.externalApplication); }
    else { appStore.decide('ign:\$rid:\$field', 'no'); appStore.logAction('decide', ${k(L.ignoredLog)}.replaceAll('{what}', field + ' · ' + appStore.displayOf('${root.slug}', rid)), entity: '${root.slug}', rid: rid, field: 'ign:\$rid:\$field'); }   /* ב׳-לב · «התעלם» נרשם ביומן ⇒ החזר (kind=decide: field = מפתח-ההכרעה) — שום דבר לא בלתי-הפיך */
  }

  // P3 · נגזרות-היום: לכל רשומה פתוחה × שדה-תאריך ⇒ באיחור (D < היום) · תזכורת (D − offset == היום/מחר, רק כשאושרה)
  static List<DsTodayItem> items(DateTime today, {required int dayDelta}) {
    final out = <DsTodayItem>[];
    for (final r in open()) {
      final rid = r[AppStore.idKey] ?? ''; final who = appStore.displayOf('${root.slug}', rid); final tm = _timeOf(r); final rep = (r['__repeat'] ?? '').trim().isNotEmpty; final ph = _phoneOf(r); final mo = _moneyOf(r);
      for (final f in _dates) {
        final d = _parse(r[f.label] ?? ''); if (d == null) continue;
        if (appStore.decision('ign:\$rid:\${f.label}') == 'no') continue;
        if (dayDelta == 0 && d.isBefore(today)) { final ago = today.difference(d).inDays; out.add(_mk(_dates.length == 1 ? who : '\${f.label} · \$who', ${k(L.remWas)}.replaceAll('{date}', _dayLabel(d, today)) + ' · ' + (ago == 1 ? ${k(L.agoOne)} : ${k(L.agoDays)}.replaceAll('{n}', ago.toString())), rid, f.label, d, f.hard, true, today, tm, rep, ph, mo)); continue; }
        final okRem = appStore.decision(_remKey(rid, f.label)) == 'ok';   // תזכורת-מוקדמת (−3/−1) = הצעה שדורשת אישור; יום-ההכרעה עצמו = עובדה — מוצג בלי אישור
        for (final off in _offsets()) {
          if (off > 0 && !okRem) continue;
          final fire = _shift(d.subtract(Duration(days: off)), f.hard);
          if (fire == today.add(Duration(days: dayDelta))) { out.add(_mk(_dates.length == 1 ? who : '\${f.label} · \$who', off == 0 ? '' : ${k(L.remIn)}.replaceAll('{n}', off.toString()), rid, f.label, d, f.hard, false, today, off == 0 ? tm : '', rep, ph, mo)); break; }
        }
      }
    }
    out.sort((a, b) => a.due.compareTo(b.due));   // P2 · מועד קרוב ראשון
    return out;
  }

  // ב׳-כח · תיקים בלי שום מועד — נעלמים מ«היום»; «בלגן» מציע לקבוע (מחר / בעוד שבוע) או להתעלם. אפס-אוטומטי: רק בהקשה, עם החזר.
  static List<DsTodayItem> undated(DateTime today) {
    if (_dates.isEmpty) return const [];
    final out = <DsTodayItem>[];
    final f = _dates.firstWhere((x) => x.hard, orElse: () => _dates.first);   // השדה שנקבע = הקשה (חובה) אם יש, אחרת הראשון
    for (final r in open()) {
      final rid = r[AppStore.idKey] ?? '';
      if (_dates.any((x) => _parse(r[x.label] ?? '') != null)) continue;
      if (appStore.decision('undated:\$rid') == 'no') continue;
      final acts = [${k(L.actSetTomorrow)}, ${k(L.actSetWeek)}, ${k(L.actIgnore)}];
      out.add(DsTodayItem(title: appStore.displayOf('${root.slug}', rid), sub: [f.label, _moneyOf(r)].where((x) => x.isNotEmpty).join(' · '), rid: rid, field: f.label, due: today, hard: f.hard, overdue: false, module: module, actions: acts, act: (i) => _setDate(rid, f.label, today, acts, i)));
    }
    return out;
  }
  static void _setDate(String rid, String field, DateTime today, List<String> acts, int i) {
    final a = acts[i.clamp(0, acts.length - 1)];
    if (a == ${k(L.actIgnore)}) { appStore.decide('undated:\$rid', 'no'); appStore.logAction('decide', ${k(L.ignoredLog)}.replaceAll('{what}', appStore.displayOf('${root.slug}', rid)), entity: '${root.slug}', rid: rid, field: 'undated:\$rid'); return; }
    final r = appStore.byId('${root.slug}', rid); if (r == null) return;
    final prev = r[field] ?? '';
    appStore.update('${root.slug}', rid, {field: _iso(_shift(today.add(Duration(days: a == ${k(L.actSetWeek)} ? 7 : 1)), false))});   /* «קבע» לא נוחת בשבת */
    appStore.logAction('auto', a + ' · ' + field, entity: '${root.slug}', rid: rid, field: field, prev: prev);
  }

  // ב׳-ל · נשכחים: תיק פתוח ש«היום» הפסיק לדבר עליו (כל מועד עבר ונדחה-בהתעלם / בלי מועד והתעלמו) ו-14 יום בלי נגיעה — לא נעלם; מוצע: סגור · קבע למחר · התעלם. הכל בהקשה, אפס-אוטומטי
  static DateTime? _touched(Map<String, String> r, String rid) {
    final at = r['__at'] ?? ''; DateTime? t = _parse(at.length >= 10 ? at.substring(0, 10) : '');
    for (final e in appStore.log) { if (e['rid'] != rid || e['undone'] == '1') continue; final a = DateTime.tryParse(e['at'] ?? ''); if (a != null && (t == null || a.isAfter(t))) t = _day(a); }
    return t;
  }
  static List<DsTodayItem> stale(DateTime today) {
    if (_dates.isEmpty) return const [];
    final out = <DsTodayItem>[];
    for (final r in open()) {
      final rid = r[AppStore.idKey] ?? '';
      if (appStore.decision('stale:\$rid') == 'no') continue;
      var visible = false, any = false;
      for (final f in _dates) { final d = _parse(r[f.label] ?? ''); if (d == null) continue; any = true; if (!d.isBefore(today) || appStore.decision('ign:\$rid:\${f.label}') != 'no') { visible = true; break; } }
      if (!any && appStore.decision('undated:\$rid') != 'no') visible = true;
      if (visible) continue;
      final t = _touched(r, rid); if (t == null) continue; final n = today.difference(t).inDays; if (n < 14) continue;
      final acts = [${lastStage >= 0 ? `${k(L.closeLabel)}, ` : ''}${k(L.actSetTomorrow)}, ${k(L.actIgnore)}];
      out.add(DsTodayItem(title: appStore.displayOf('${root.slug}', rid), sub: [${k(L.staleSub)}.replaceAll('{n}', n.toString()), _moneyOf(r)].where((x) => x.isNotEmpty).join(' · '), rid: rid, field: '', due: t, hard: false, overdue: false, module: module, actions: acts, act: (i) => _staleAct(rid, today, acts, i)));
    }
    out.sort((a, b) => a.due.compareTo(b.due));   // הישן ביותר ראשון
    return out;
  }
  static void _staleAct(String rid, DateTime today, List<String> acts, int i) {
    final a = acts[i.clamp(0, acts.length - 1)];
    final r = appStore.byId('${root.slug}', rid); if (r == null) return;
    if (a == ${k(L.actSetTomorrow)}) { final f = _dates.firstWhere((x) => x.hard, orElse: () => _dates.first); appStore.decide('ign:\$rid:\${f.label}', ''); appStore.decide('undated:\$rid', ''); _setDate(rid, f.label, today, [a], 0); return; }   /* המועד החדש חוזר ל«היום» — ההתעלמות הישנה נמחקת */
    ${lastStage >= 0 ? `if (a == ${k(L.closeLabel)}) { final prev = r[AppStore.stageKey] ?? '0'; appStore.update('${root.slug}', rid, {AppStore.stageKey: '${lastStage}'}); appStore.logAction('auto', ${k(L.closeLog)}.replaceAll('{who}', appStore.displayOf('${root.slug}', rid)), entity: '${root.slug}', rid: rid, field: AppStore.stageKey, prev: prev); return; }` : ''}
    appStore.decide('stale:\$rid', 'no'); appStore.logAction('decide', ${k(L.ignoredLog)}.replaceAll('{what}', appStore.displayOf('${root.slug}', rid)), entity: '${root.slug}', rid: rid, field: 'stale:\$rid');
  }

  // ב׳-לז · המועדים הקרובים שטרם הוכרעה להם תזכורת — ל«בלגן», שמרכז n כרטיסים לאחד (שאלה אחת, הכרעה אחת, החזר אחד)
  static List<DsTodayItem> remPending(DateTime today) {
    final out = <DsTodayItem>[];
    for (final r in open()) {
      final rid = r[AppStore.idKey] ?? ''; final who = appStore.displayOf('${root.slug}', rid);
      for (final f in _dates) {
        final d = _parse(r[f.label] ?? ''); if (d == null || d.isBefore(today) || d == today) continue;
        if (appStore.decision(_remKey(rid, f.label)).isNotEmpty) continue;
        out.add(DsTodayItem(title: who, sub: '', rid: rid, field: f.label, due: d, hard: f.hard, overdue: false, module: module, actions: const [], act: (_) {}));
      }
    }
    return out;
  }

  // P11/P13 · הצעות: תזכורת לכל תאריך שטרם הוכרע · צעד-הבא בשלב-האחרון (P14) · תזכורת-אחרי-שליחה (P12) — הכל עם קטע-המקור
  static List<Widget> proposals(BuildContext context, DateTime today, {bool chain = true, bool rem = true}) {   // rem=false: «בלגן» מרכז את התזכורות לכרטיס אחד (ב׳-לז)   // chain=false: «בלגן» מרנדר את כרטיס-הצעד-הבא בעצמו (חוצה-מודולים)
    final out = <Widget>[];
    final days = _offsets().map((o) => o == 0 ? ${k(L.offDay)} : o == 1 ? ${k(L.offOne)} : ${k(L.offN)}.replaceAll('{n}', o.toString())).join(' · ');   /* ב׳-מב · «3 ימים לפני · יום לפני · ביום» במקום (−3/−1/−0) */
    for (final r in open()) {
      final rid = r[AppStore.idKey] ?? ''; final who = appStore.displayOf('${root.slug}', rid);
      if (rem) for (final f in _dates) {
        final d = _parse(r[f.label] ?? ''); if (d == null || d.isBefore(today) || d == today) continue;   // היום עצמו כבר ב«היום» — אין מה להציע
        if (appStore.decision(_remKey(rid, f.label)).isNotEmpty) continue;
        out.add(DsApproveCard(question: ${k(L.remAsk)}.replaceAll('{field}', f.label).replaceAll('{days}', days).replaceAll('{date}', _dayLabel(d, today)), source: module + ' · ' + who, okLabel: ${k(L.actOk)}, noLabel: ${k(L.actNo)}, alwaysLabel: ${k(L.actAlways)},
          onOk: () => appStore.decide(_remKey(rid, f.label), 'ok'), onNo: () => appStore.decide(_remKey(rid, f.label), 'no'),
          onAlways: () { appStore.setSetting('always:rem', '1'); appStore.decide(_remKey(rid, f.label), 'ok'); }));
      }
      ${sendFn ? `final last = appStore.lastLog('send', rid);   // P12 · טיוטה, לא שליחה: אחרי 3 ימים בלי שינוי-שלב ⇒ הצעה; השליחה עצמה רק בהקשה (T5)
      if (last != null && appStore.decision('fu:\$rid:\${last['id']}').isEmpty) { final at = DateTime.tryParse(last['at'] ?? ''); final n = at == null ? 0 : today.difference(_day(at)).inDays; if (n >= 3 && (last['prev'] ?? '') == appStore.stageOf('${root.slug}', rid).toString()) out.add(DsApproveCard(question: ${k(L.followAsk)}.replaceAll('{n}', n.toString()), source: module + ' · ' + who, okLabel: ${k(L.homeSend)}, noLabel: ${k(L.actNo)}, onOk: () { appStore.decide('fu:\$rid:\${last['id']}', 'ok'); send(context, r, rid); }, onNo: () => appStore.decide('fu:\$rid:\${last['id']}', 'no'))); }` : ''}
    }
    ${nextName && lastStage >= 0 ? `if (chain) for (final r in appStore.records('${root.slug}')) {   // P14 · הצעד-הבא: רשומה שהגיעה לשלב-האחרון (סגורה — לא ב-open) ובלי הכרעה
      final rid = r[AppStore.idKey] ?? ''; final who = appStore.displayOf('${root.slug}', rid);
      if (appStore.stageOf('${root.slug}', rid) >= ${lastStage} && appStore.decision('next:\$rid').isEmpty) out.add(DsApproveCard(question: ${k(L.nextAsk)}.replaceAll('{next}', ${nextName}), source: module + ' · ' + who, okLabel: ${k(L.actOk)}, noLabel: ${k(L.actNo)}, onOk: () { appStore.decide('next:\$rid', 'ok'); appStore.logAction('next', ${k(L.nextDid)}.replaceAll('{next}', ${nextName}), entity: '${root.slug}', rid: rid, field: 'next:\$rid'); }, onNo: () => appStore.decide('next:\$rid', 'no')));
    }` : ''}
    return out;
  }
  /// רשומות שהגיעו לשלב-האחרון ובלי הכרעת-צעד-הבא — ל«בלגן» (שרשרת חוצת-מודולים)
  static List<Map<String, String>> done() => ${lastStage >= 0 ? `appStore.records('${root.slug}').where((r) => appStore.stageOf('${root.slug}', r[AppStore.idKey] ?? '') >= ${lastStage} && appStore.decision('next:\${r[AppStore.idKey] ?? ''}').isEmpty).toList()` : 'const []'};

  // כרטיס-הרשומה (G30): נוסחים · שלח · פתח — ≤2 הקשות
  static Widget card(BuildContext context, Map<String, String> r) => DsSection(title: module + ' · ' + ((${dispR}).trim().isEmpty ? ${k(root.name)} : ${dispR}), trailing: Text(${stageSub}, style: TextStyle(color: DsLook.of(context).muted, fontSize: 13)), children: [
        ${msgW ? `${msgW},` : ''}
        Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [${isPaper() ? `${sendFn ? `Expanded(child: DsPrimaryButton(label: ${k(L.homeSend)}, onTap: () => send(context, r, r[AppStore.idKey] ?? ''))), const SizedBox(width: 8), ` : ''}DsChipButton(label: ${k(L.homeOpen)}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${rootPage.cls}(id: r[AppStore.idKey] ?? ''))))` : `${sendBtn ? `Expanded(child: ${sendBtn}), const SizedBox(width: 8), ` : ''}${openBtn ? openBtn.call : 'const SizedBox.shrink()'}`}])),
      ]);

  // «תמיד אשר» ⇒ לבד: הכרעות-תזכורת פתוחות נסגרות ונרשמות ביומן עם החזר (T2). אחרי הפריים, לא בתוך build. לעולם לא שולח (T5). P5: לא נוגע בתאריכים.
  static void autopilot() {
    if (appStore.setting('always:rem') != '1') return;
    final today = _day(DateTime.now());
    for (final r in open()) {
      final rid = r[AppStore.idKey] ?? ''; final who = appStore.displayOf('${root.slug}', rid);
      for (final f in _dates) {
        final d = _parse(r[f.label] ?? ''); if (d == null || d.isBefore(today)) continue;
        if (appStore.decision(_remKey(rid, f.label)).isNotEmpty) continue;
        appStore.decide(_remKey(rid, f.label), 'ok');
        appStore.logAction('decide', ${k(L.remDid)}.replaceAll('{field}', f.label).replaceAll('{who}', who), entity: '${root.slug}', rid: rid, field: _remKey(rid, f.label));
      }
    }
  }
}

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  static DateTime _day(DateTime d) => DateTime(d.year, d.month, d.day);
  static String _iso(DateTime d) => d.toIso8601String().substring(0, 10);

  // P9/P10 · תקציר-בוקר: התראה אחת ביום אחרי שעת-התקציר (עריכה) + הכרעה-קשה-היום — ורק אלה. web = אין התראות (השער ⇒ המסך עצמו).
  Future<void> _digest(String lead, int hardToday) async {
    if (kIsWeb) return;
    final now = DateTime.now(); final hour = int.tryParse(appStore.setting('digestHour', '8')) ?? 8; final key = _iso(_day(now));
    if (now.hour < hour || appStore.setting('digestShown') == key) return;
    try {
      final n = FlutterLocalNotificationsPlugin();
      await n.initialize(const InitializationSettings(android: AndroidInitializationSettings('@mipmap/ic_launcher'), iOS: DarwinInitializationSettings()));
      await n.show(1, ${k(L.digestTitle)}, lead, const NotificationDetails(android: AndroidNotificationDetails('balagan_digest', 'digest')));
      if (hardToday > 0) await n.show(2, ${k(L.homeToday)}, '\$hardToday', const NotificationDetails(android: AndroidNotificationDetails('balagan_hard', 'hard')));
      appStore.setSetting('digestShown', key);
    } catch (_) {}
  }

  @override
  void initState() { super.initState(); WidgetsBinding.instance.addPostFrameCallback((_) { ${cls}Today.autopilot(); }); appStore.addListener(_onStore); }
  void _onStore() { WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) ${cls}Today.autopilot(); }); }
  @override
  void dispose() { appStore.removeListener(_onStore); super.dispose(); }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final today = _day(DateTime.now());
    final open = ${cls}Today.open();
    final all0 = ${cls}Today.items(today, dayDelta: 0);
    final overdue = all0.where((x) => x.overdue).toList();
    final todayItems = all0.where((x) => !x.overdue).toList();
    final tomorrow = ${cls}Today.items(today, dayDelta: 1);
    final pending = ${cls}Today.proposals(context, today);
    final did = appStore.log.where((e) => (e['kind'] == 'decide' || e['kind'] == 'auto' || e['kind'] == 'next') && e['undone'] != '1').take(5).toList();
    final n = overdue.length + todayItems.length + pending.length;   // הדברים שדורשים אותו היום (הכרעה-29: לא סופרים רשומות פתוחות פעמיים)
    final lead = n == 0 && open.isEmpty ? ${k(L.homeNone)} : n <= 1 ? ${k(L.homeOne)} : ${k(L.homeMany)}.replaceAll('{n}', n.toString());
    final hardToday = todayItems.where((x) => x.hard && x.due == today).length;
    WidgetsBinding.instance.addPostFrameCallback((_) { _digest(lead, hardToday); });
    final lk = DsLook.of(context);
    return DsScaffold(title: ${k(title)}, subtitle: lead, icon: ${k('')}, children: [
      DsLoadMeter(count: n, label: ${k(L.loadOf)}.replaceAll('{n}', n.toString()), stateLabels: [${k(L.loadOk)}, ${k(L.loadWarn)}, ${k(L.loadBad)}]),
      Padding(padding: const EdgeInsets.only(top: 16, bottom: 12), child: Text(lead, style: TextStyle(color: lk.ink, fontSize: 28, fontWeight: FontWeight.w600, height: 1.2))),
      if (overdue.isNotEmpty) DsSection(title: ${k(L.homeOverdue)}, tone: 2, children: [for (final it in overdue) DsActionRow(title: it.title, sub: it.sub, tone: 2, actions: it.actions, onAct: it.act)]),   // D6/P6/P7 · באיחור ראשון
      if (todayItems.isNotEmpty) DsSection(title: ${k(L.homeToday)}, children: [for (final it in todayItems) DsActionRow(title: it.title, sub: it.sub, actions: it.actions, onAct: it.act)]),
      for (final r in open) ${cls}Today.card(context, r),
      if (pending.isNotEmpty) DsSection(title: ${k(L.homePending)} + ' · ' + pending.length.toString(), children: pending),   // D5 · תיבה ≠ היום
      if (did.isNotEmpty) DsSection(title: ${k(L.homeDid)} + ' · ' + did.length.toString(), children: [for (final e in did) DsLogRow(text: e['what'] ?? '', undoLabel: ${k(L.undo)}, onUndo: () => appStore.undo(e['id'] ?? ''))]),   // T2
      if (tomorrow.isNotEmpty) DsFold(title: ${k(L.homeTomorrow)} + ' (' + tomorrow.length.toString() + ')', details: [for (final it in tomorrow) DsActionRow(title: it.title, sub: it.sub)]),   // D8 · יום-יחיד; מחר מקופל
      if (overdue.isEmpty && todayItems.isEmpty && pending.isEmpty) Padding(padding: const EdgeInsets.only(top: 12), child: Text(${k(L.homeRest)} + ' ' + ${k(L.homeCalm)}, style: TextStyle(color: lk.muted, fontSize: 14))),
    ]);
  });
}
`;
  write(slug, code, dump());
  return { slug, cls, notes };
}

// ── G32 · «התנהגות» (עוד): שעת-התקציר · ימים-לפני · לפעול-לבד · יומן-הפעולות המלא עם החזר ──
export function renderBehavior(slug, { extraFields = [] } = {}) {   // extraFields = [[key, default, L-key]] — שדות-הגדרה נוספים (בלגן: דקות-שנחסכות), מרונדרים עם ה-k של המסך
  const { k, dump } = makeConsts(slug);
  const cls = clsOf(slug);
  const code = `// 🧭 חולל ע"י ניווט-מקשרים (app-shell · G32 · הכרעה-28) — התנהגות: הגדרות-הטריגרים ויומן-הפעולות. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_toggle_tile.dart';
import 'package:flutter/material.dart';

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});
  static String _short(String s) { final t = s.replaceFirst('T', ' '); return t.length > 16 ? t.substring(0, 16) : t; }
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) => DsScaffold(title: ${k(L.behaviorTitle)}, subtitle: ${k(L.behaviorSub)}, icon: ${k('')}, children: [
    DsField(label: ${k(L.digestHourLabel)}, hint: '8', value: appStore.setting('digestHour', '8'), onChanged: (v) => appStore.setSetting('digestHour', v)),
    DsField(label: ${k(L.offsetsLabel)}, hint: '3,1,0', value: appStore.setting('offsets', '3,1,0'), onChanged: (v) => appStore.setSetting('offsets', v)),
    DsField(label: ${k(L.dayStartLabel)}, hint: '9', value: appStore.setting('dayStart', '9'), onChanged: (v) => appStore.setSetting('dayStart', v)),
    DsField(label: ${k(L.blockMinLabel)}, hint: '30', value: appStore.setting('blockMin', '30'), onChanged: (v) => appStore.setSetting('blockMin', v)),
${extraFields.map(([key, def, lbl]) => `    DsField(label: ${k(L[lbl])}, hint: '${def}', value: appStore.setting('${key}', '${def}'), onChanged: (v) => appStore.setSetting('${key}', v)),\n`).join('')}    DsToggleTile(label: ${k(L.autoLabel)}, value: appStore.setting('always:rem') == '1' ? 'true' : 'false', onChanged: (v) => appStore.setSetting('always:rem', v == 'true' ? '1' : '')),
    DsSection(title: ${k(L.logTitle)}, children: [for (final e in appStore.log) DsLogRow(text: e['what'] ?? '', sub: _short(e['at'] ?? ''), undoLabel: e['undone'] == '1' ? '' : ${k(L.undo)}, onUndo: e['undone'] == '1' ? null : () => appStore.undo(e['id'] ?? ''))]),
  ]));
}
`;
  write(slug, code, dump());
  return { slug, cls };
}

// ── השלד: סרגל-תחתון (בית · שורש · עוד) על IndexedStack — כל לשונית מסך שלם ──
export function renderShell(slug, { title, root, rootPage, dashboard, hub, questions = {}, home = null }) {   // G30 · home = מסך «היום» (נייר) במקום לוח-הבקרה בלשונית-הבית   // G28 · questions.list = השאלה שמסך-הרשימה עונה עליה (PLAN §1: מסך = שאלה אחת)
  const { k, dump } = makeConsts(slug);
  const imports = new Set([`import 'gen_${hub.slug}.dart';`, `import 'gen_${root.slug}.dart';`, `import 'gen_${rootPage.slug}.dart';`]);
  if (dashboard) imports.add(`import 'gen_${dashboard.slug}.dart';`);
  const firstWired = (pick, ctx) => { const w = pickWired([...pick.atoms, ...pick.alts], (c) => wireAtom(c, ctx)); if (w) imports.add(impOf(w)); return w; };
  const notes = [];
  const labels = [dashboard ? L.shellHome : null, root.name, L.shellMore].filter(Boolean);
  const nav = firstWired(searchOp('switch', `${title} ${labels.join(' ')}`, ['items', 'selected', 'onSelect']), { items: `[${labels.map((l) => k(l)).join(', ')}]`, selected: '_t', onSelect: '(i) => setState(() => _t = i)', label: k(title), bare: true, must: ['items', 'selected', 'onSelect'] });   // G28 · הצורך מפורש: פריטים+נבחר+בחירה — בורר שלא יודע לבחור אינו סרגל
  if (!nav) notes.push(L.shellNoNav);
  const add = firstWired(searchOp('action', `${root.name} ${title}`), { label: k(T('rootAdd', { ent: root.name })), nav: `() => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${root.cls}()))`, glyph: k('➕') });
  const empty = isPaper() ? firstWired(searchOp('empty', `${root.name} ${title}`), { message: k(T('emptyCalm', { action: T('rootAdd', { ent: root.name }) })), label: k(root.name), glyph: k('') }) : null;   // G29 · מצב-ריק מרגיע (T6): משפט + הפעולה הראשית
  const disp = root.descField ? `(r[${k(root.descField)}] ?? '')` : `appStore.displayOf('${root.slug}', r[AppStore.idKey] ?? '')`;
  const sub = root.subField ? `(r[${k(root.subField)}] ?? '')` : `''`;
  if (home) imports.add(`import 'gen_${home.slug}.dart';`);
  const tabs = [home ? `const ${home.cls}()` : dashboard ? `const ${dashboard.cls}()` : null, `_RootTab()`, `const ${hub.cls}()`].filter(Boolean);
  const paper = isPaper();
  const quick = paper && root.descField ? `DsQuickAdd(hint: ${k(T('quickAddHint', { action: T('rootAdd', { ent: root.name }) }))}, onSubmit: (s) => appStore.add('${root.slug}', {${k(root.descField)}: s}))` : null;   // G30 · D2: יצירה = טקסט בלבד
  const paletteItems = `[DsPaletteItem(label: ${k(T('rootAdd', { ent: root.name }))}, sub: ${k(L.keysHint)}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${root.cls}()))), for (final r in appStore.records('${root.slug}')) DsPaletteItem(label: ${disp}, sub: ${sub}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${rootPage.cls}(id: r[AppStore.idKey] ?? ''))))]`;
  const cls = clsOf(slug);
  const code = `// 🧭 חולל ע"י ניווט-מקשרים (app-shell · G26 · הכרעה-27) — השלד: סרגל-תחתון בית · ${root.name} · עוד. השורש נגזר מגרף-הקשרים. אל תערוך ידנית.
${notes.map((n) => '//   ⚪ ' + n).join('\n')}
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';
${paper ? "import 'package:flutter/services.dart';" : ''}

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  int _t = 0;
  @override
  Widget build(BuildContext context) => ${paper ? `CallbackShortcuts(   // G30 · D3/D4: ≤3 מקשים — T היום · I רשימה · A הוספה · Ctrl/Cmd+K פלטה
    bindings: <ShortcutActivator, VoidCallback>{
      const SingleActivator(LogicalKeyboardKey.keyT): () => setState(() => _t = 0),
      const SingleActivator(LogicalKeyboardKey.keyI): () => setState(() => _t = ${tabs.length > 2 ? 1 : 0}),
      const SingleActivator(LogicalKeyboardKey.keyA): () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${root.cls}())),
      const SingleActivator(LogicalKeyboardKey.keyK, control: true): () => DsPalette.show(context, hint: ${k(L.paletteHint)}, items: ${paletteItems}),
      const SingleActivator(LogicalKeyboardKey.keyK, meta: true): () => DsPalette.show(context, hint: ${k(L.paletteHint)}, items: ${paletteItems}),
    },
    child: Focus(autofocus: true, child: ` : ''}Scaffold(
    backgroundColor: DsLook.of(context).bg,
    body: IndexedStack(index: _t.clamp(0, ${tabs.length - 1}), children: [${tabs.join(', ')}]),
    bottomNavigationBar: ${nav ? `SafeArea(child: Padding(padding: const EdgeInsets.fromLTRB(12, 6, 12, 10), child: Center(heightFactor: 1.0, child: ${nav.call})))` : 'null'},   // heightFactor: Center ללא-גובה מתפשט לכל הגובה שה-Scaffold מציע ⇒ הגוף נעלם
  )${paper ? '))' : ''};
}

class _RootTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final rs = appStore.records('${root.slug}');
    return DsScaffold(title: ${k(questions.list || root.name)}, subtitle: rs.length.toString() + ' ' + ${k(root.name)}, icon: ${k(root.icon || '🗂️')}, children: [
      ${add ? `Padding(padding: const EdgeInsets.only(bottom: 10), child: ${add.call}),` : ''}
      ${quick ? `Padding(padding: const EdgeInsets.only(bottom: 6), child: ${quick}),` : ''}
      ${empty ? `if (rs.isEmpty) ${empty.call},` : ''}
      for (final r in rs) DsNavTile(glyph: ${k(root.icon || '🗂️')}, title: ${disp}, sub: ${sub}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${rootPage.cls}(id: r[AppStore.idKey] ?? '')))),
    ]);
  });
}
`;
  write(slug, code, dump());
  return { slug, cls, notes, nav: nav ? nav.cand : null };
}
