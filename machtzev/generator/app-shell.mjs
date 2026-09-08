#!/usr/bin/env node
// 🧭 app-shell — ניווט-מקשרים (GENMAX·G26 · הכרעה-27): אפליקציה, לא רשימת-מסכים.
//   הניווט נגזר מצורת-הדאטה בלבד — גרף-הקשרים: הישות שהכי-הרבה ישויות מצביעות עליה = השורש (מרכז-הכובד);
//   הישויות-הבנות = חלקים בעמוד-השורש (רשימה מסוננת לפי הרשומה + הוספה עם מילוי-מראש); הדוח והשליחה = פעולות על רשומת-השורש;
//   לוח-הבקרה = הבית; כל שאר תוצרי-המנוע (חלקיקים · סקירה · כרטיס · מסך-אמת · מערכת) = מגירת "עוד" (הרכזת הישנה, ביט-זהה).
//   אפס מילון-דומייני: שמות מהספק, אטומים מחיפוש-פתוח (switch לסרגל · group לחלקים · fact(label+value) לעובדות · action לפעולות).
import { makeConsts, write, isPaper } from './render-ds.mjs';
import { searchOp, wireAtom, pickWired, particleWidgets } from './particles.mjs';
import { L, T } from './chrome.mjs';

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
  const facts = factFields.map((f) => firstWired(searchOp('magnitude', goal, ['label', 'value'], 12), { label: k(f.label), value: { str: `(r0[${k(f.label)}] ?? '')`, num: `(num.tryParse(r0[${k(f.label)}] ?? '') ?? 0)` }, sub: k(''), tone: 0, must: ['value'] }));
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
  const stageSub = root.stages && root.stages.length ? `const [${root.stages.map((s) => k(s)).join(', ')}][appStore.stageOf('${root.slug}', id).clamp(0, ${root.stages.length - 1})]` : k(root.name);
  const cls = clsOf(slug);
  const code = `// 🧭 חולל ע"י ניווט-מקשרים (app-shell · G26 · הכרעה-27) — עמוד-השורש: עובדות · ישויות-בנות (מסוננות לרשומה) · דוח. אל תערוך ידנית.
${notes.map((n) => '//   ⚪ ' + n).join('\n')}
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';

class ${cls} extends StatelessWidget {
  const ${cls}({required this.id, super.key});
  final String id;
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
export function renderHome(slug, { root, rootPage, report, message, title, chain = [] }) {   // G32 · chain = השרשרת מהפירוק (צעד-הבא בשלב-האחרון)
  const { k, dump } = makeConsts(slug);
  const imports = new Set([`import 'gen_${rootPage.slug}.dart';`, `import '../dart-data-bs/auto/gen_${slug}_content.dart';`, `import '../dart-ui-bs/ds/ds.dart';`, `import '../dart-ui-bs/ds/ds_store.dart';`]);   // G32 · קבוצה אחת ⇒ אין כפל-ייבוא
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
  Future<void> _send(BuildContext context, Map<String, String> r0, String id0) async {
    final text = ${report.textFn}(r0, id0);
    final dynamic url = ${report.export.linkRaw.replace(/__K\(("[^"]*")\)/g, (_, j) => k(JSON.parse(j)))};
    if (url is String && url.isNotEmpty) { await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication); return; }
    await Share.share(text);
  }`;
    const b = firstWired(searchOp('action', `${L.homeSend} ${root.name}`), { label: k(L.homeSend), nav: `() => _send(context, r, r[AppStore.idKey] ?? '')`, glyph: k('') });
    if (b) sendBtn = b.call; else notes.push(L.rootNoAction);
  }
  const openBtn = firstWired(searchOp('action', `${L.homeOpen} ${root.name}`), { label: k(L.homeOpen), nav: `() => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => ${rootPage.cls}(id: r[AppStore.idKey] ?? '')))`, glyph: k('') });
  const stageSub = root.stages && root.stages.length ? `const [${root.stages.map((s) => k(s)).join(', ')}][appStore.stageOf('${root.slug}', r[AppStore.idKey] ?? '').clamp(0, ${root.stages.length - 1})]` : k(root.name);
  const cls = clsOf(slug);
  // G32 · שדות-התאריך של השורש (חובה = hard-deadline, P8) · השלב האחרון · השרשרת
  const dateFields = root.schema.filter((f) => f.type === 'date').map((f) => ({ label: f.label, hard: !!f.required }));
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
class _Item { const _Item(this.title, this.sub, this.rid, this.field, this.due, this.hard, this.overdue); final String title, sub, rid, field; final DateTime due; final bool hard, overdue; }

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {${sendFn2}
  static const _dates = ${dateList};
  static DateTime _day(DateTime d) => DateTime(d.year, d.month, d.day);
  static DateTime? _parse(String s) { final t = s.trim(); if (t.isEmpty) return null; try { return _day(DateTime.parse(t.length == 10 ? '\${t}T12:00:00' : t)); } catch (_) { return null; } }
  static List<int> _offsets() => appStore.setting('offsets', '3,1,0').split(',').map((x) => int.tryParse(x.trim()) ?? 0).toList();
  static DateTime _shift(DateTime d, bool hard) => hard ? d : (d.weekday == DateTime.saturday ? d.add(const Duration(days: 1)) : d);   // P8 · soft לא בשבת
  static String _iso(DateTime d) => d.toIso8601String().substring(0, 10);
  static String _remKey(String rid, String field) => 'rem:\$rid:\$field';
  List<Map<String, String>> get _open => ${openRecs};

  // P3 · נגזרות-היום: לכל רשומה פתוחה × שדה-תאריך ⇒ באיחור (D < היום) · תזכורת (D − offset == היום/מחר, רק כשאושרה)
  List<_Item> _items(DateTime today, {required int dayDelta}) {
    final out = <_Item>[];
    for (final r in _open) {
      final rid = r[AppStore.idKey] ?? ''; final who = appStore.displayOf('${root.slug}', rid);
      for (final f in _dates) {
        final d = _parse(r[f.label] ?? ''); if (d == null) continue;
        if (appStore.decision('ign:\$rid:\${f.label}') == 'no') continue;
        if (dayDelta == 0 && d.isBefore(today)) { out.add(_Item('\${f.label} · \$who', ${k(L.remWas)}.replaceAll('{date}', _iso(d)), rid, f.label, d, f.hard, true)); continue; }
        if (appStore.decision(_remKey(rid, f.label)) != 'ok') continue;
        for (final off in _offsets()) {
          final fire = _shift(d.subtract(Duration(days: off)), f.hard);
          if (fire == today.add(Duration(days: dayDelta))) { out.add(_Item('\${f.label} · \$who', off == 0 ? ${k(L.remToday)} : ${k(L.remIn)}.replaceAll('{n}', off.toString()), rid, f.label, d, f.hard, false)); break; }
        }
      }
    }
    out.sort((a, b) => a.due.compareTo(b.due));   // P2 · מועד קרוב ראשון
    return out;
  }

  // P11/P13 · הצעות: תזכורת לכל תאריך שטרם הוכרע · צעד-הבא בשלב-האחרון (P14) · תזכורת-אחרי-שליחה (P12) — הכל עם קטע-המקור
  List<Widget> _proposals(BuildContext context, DateTime today) {
    final out = <Widget>[];
    final days = _offsets().map((o) => '−\$o').join('/');
    for (final r in _open) {
      final rid = r[AppStore.idKey] ?? ''; final who = appStore.displayOf('${root.slug}', rid);
      for (final f in _dates) {
        final d = _parse(r[f.label] ?? ''); if (d == null || d.isBefore(today)) continue;
        if (appStore.decision(_remKey(rid, f.label)).isNotEmpty) continue;
        out.add(DsApproveCard(question: ${k(L.remAsk)}.replaceAll('{field}', f.label).replaceAll('{days}', days).replaceAll('{date}', _iso(d)), source: who, okLabel: ${k(L.actOk)}, noLabel: ${k(L.actNo)}, alwaysLabel: ${k(L.actAlways)},
          onOk: () => appStore.decide(_remKey(rid, f.label), 'ok'), onNo: () => appStore.decide(_remKey(rid, f.label), 'no'),
          onAlways: () { appStore.setSetting('always:rem', '1'); appStore.decide(_remKey(rid, f.label), 'ok'); }));
      }
      ${sendFn ? `final last = appStore.lastLog('send', rid);   // P12 · טיוטה, לא שליחה: אחרי 3 ימים בלי שינוי-שלב ⇒ הצעה; השליחה עצמה רק בהקשה (T5)
      if (last != null && appStore.decision('fu:\$rid:\${last['id']}').isEmpty) { final at = DateTime.tryParse(last['at'] ?? ''); final n = at == null ? 0 : today.difference(_day(at)).inDays; if (n >= 3 && (last['prev'] ?? '') == appStore.stageOf('${root.slug}', rid).toString()) out.add(DsApproveCard(question: ${k(L.followAsk)}.replaceAll('{n}', n.toString()), source: who, okLabel: ${k(L.homeSend)}, noLabel: ${k(L.actNo)}, onOk: () { appStore.decide('fu:\$rid:\${last['id']}', 'ok'); _send(context, r, rid); }, onNo: () => appStore.decide('fu:\$rid:\${last['id']}', 'no'))); }` : ''}
      ${nextName && lastStage >= 0 ? `if (appStore.stageOf('${root.slug}', rid) >= ${lastStage} && appStore.decision('next:\$rid').isEmpty) out.add(DsApproveCard(question: ${k(L.nextAsk)}.replaceAll('{next}', ${nextName}), source: who, okLabel: ${k(L.actOk)}, noLabel: ${k(L.actNo)}, onOk: () { appStore.decide('next:\$rid', 'ok'); appStore.logAction('next', ${k(L.nextDid)}.replaceAll('{next}', ${nextName}), entity: '${root.slug}', rid: rid, field: 'next:\$rid'); }, onNo: () => appStore.decide('next:\$rid', 'no')));` : ''}
    }
    return out;
  }

  // «תמיד אשר» ⇒ לבד: הכרעות-תזכורת פתוחות נסגרות ונרשמות ביומן עם החזר (T2). אחרי הפריים, לא בתוך build. לעולם לא שולח (T5). P5: לא נוגע בתאריכים.
  void _autopilot() {
    if (appStore.setting('always:rem') != '1') return;
    final today = _day(DateTime.now());
    for (final r in _open) {
      final rid = r[AppStore.idKey] ?? ''; final who = appStore.displayOf('${root.slug}', rid);
      for (final f in _dates) {
        final d = _parse(r[f.label] ?? ''); if (d == null || d.isBefore(today)) continue;
        if (appStore.decision(_remKey(rid, f.label)).isNotEmpty) continue;
        appStore.decide(_remKey(rid, f.label), 'ok');
        appStore.logAction('decide', ${k(L.remDid)}.replaceAll('{field}', f.label).replaceAll('{who}', who), entity: '${root.slug}', rid: rid, field: _remKey(rid, f.label));
      }
    }
  }

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
  void initState() { super.initState(); WidgetsBinding.instance.addPostFrameCallback((_) { _autopilot(); }); appStore.addListener(_onStore); }
  void _onStore() { WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) _autopilot(); }); }
  @override
  void dispose() { appStore.removeListener(_onStore); super.dispose(); }

  void _act(_Item it, int i, DateTime today) {
    final labels = it.overdue ? [${k(L.actDone)}, ${k(L.actSnooze)}, ${k(L.actIgnore)}] : (it.due == today ? [${k(L.actDone)}] : [${k(L.actDone)}, ${k(L.actSnooze)}]);   // P4 · ביום-ההכרעה אין דחייה
    final a = labels[i.clamp(0, labels.length - 1)];
    if (a == ${k(L.actDone)}) { ${lastStage >= 0 ? `appStore.advance('${root.slug}', it.rid, ${lastStage + 1});` : `appStore.decide('ign:\${it.rid}:\${it.field}', 'no');`} }
    else if (a == ${k(L.actSnooze)}) { final r = appStore.byId('${root.slug}', it.rid); if (r != null) { final prev = r[it.field] ?? ''; appStore.update('${root.slug}', it.rid, {it.field: _iso(it.due.add(const Duration(days: 1)))}); appStore.logAction('auto', ${k(L.actSnooze)} + ' · ' + it.title, entity: '${root.slug}', rid: it.rid, field: it.field, prev: prev); } }   // נגיעה-ידנית (P5) — נרשמת עם החזר
    else { appStore.decide('ign:\${it.rid}:\${it.field}', 'no'); }
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final today = _day(DateTime.now());
    final open = _open;
    final overdue = _items(today, dayDelta: 0).where((x) => x.overdue).toList();
    final todayItems = _items(today, dayDelta: 0).where((x) => !x.overdue).toList();
    final tomorrow = _items(today, dayDelta: 1);
    final pending = _proposals(context, today);
    final did = appStore.log.where((e) => (e['kind'] == 'decide' || e['kind'] == 'auto' || e['kind'] == 'next') && e['undone'] != '1').take(5).toList();
    final n = overdue.length + todayItems.length + pending.length;   // הדברים שדורשים אותו היום (הכרעה-29: לא סופרים רשומות פתוחות פעמיים)
    final lead = n == 0 && open.isEmpty ? ${k(L.homeNone)} : n <= 1 ? ${k(L.homeOne)} : ${k(L.homeMany)}.replaceAll('{n}', n.toString());
    final hardToday = todayItems.where((x) => x.hard && x.due == today).length;
    WidgetsBinding.instance.addPostFrameCallback((_) { _digest(lead, hardToday); });
    final lk = DsLook.of(context);
    return DsScaffold(title: ${k(title)}, subtitle: lead, icon: ${k('')}, children: [
      DsLoadMeter(count: n, label: ${k(L.loadOf)}.replaceAll('{n}', n.toString()), stateLabels: [${k(L.loadOk)}, ${k(L.loadWarn)}, ${k(L.loadBad)}]),
      Padding(padding: const EdgeInsets.only(top: 16, bottom: 12), child: Text(lead, style: TextStyle(color: lk.ink, fontSize: 28, fontWeight: FontWeight.w600, height: 1.2))),
      if (overdue.isNotEmpty) DsSection(title: ${k(L.homeOverdue)}, tone: 2, children: [for (final it in overdue) DsActionRow(title: it.title, sub: it.sub, tone: 2, actions: [${k(L.actDone)}, ${k(L.actSnooze)}, ${k(L.actIgnore)}], onAct: (i) => _act(it, i, today))]),   // D6/P6/P7 · באיחור ראשון
      if (todayItems.isNotEmpty) DsSection(title: ${k(L.homeToday)}, children: [for (final it in todayItems) DsActionRow(title: it.title, sub: it.sub, actions: it.due == today ? [${k(L.actDone)}] : [${k(L.actDone)}, ${k(L.actSnooze)}], onAct: (i) => _act(it, i, today))]),
      for (final r in open) DsSection(title: ${dispR} + ' · ' + ${stageSub}, children: [
        ${msgW ? `${msgW},` : ''}
        Padding(padding: const EdgeInsets.only(top: 8), child: Row(children: [${sendBtn ? `Expanded(child: ${sendBtn}), const SizedBox(width: 8), ` : ''}${openBtn ? openBtn.call : 'const SizedBox.shrink()'}])),
      ]),
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
export function renderBehavior(slug) {
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
    DsToggleTile(label: ${k(L.autoLabel)}, value: appStore.setting('always:rem') == '1' ? 'true' : 'false', onChanged: (v) => appStore.setSetting('always:rem', v == 'true' ? '1' : '')),
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
