#!/usr/bin/env node
// 🧭 balagan — «בלגן» האפליקציה-האחת (GENMAX · G33 · הכרעה-29): כל המודולים (ספקי specs-ds בעור-נייר, נגזרים מ-peruks/) בתוך אפליקציה אחת.
//   «היום» מאוחד = מיזוג ספקי-ה-Today של כל המודולים (באיחור · היום · ממתין · עשיתי-לבד · מחר) ·
//   «מה קרה?» = מזהה-הרגע: TF-IDF דטרמיניסטי על מסמכי-הפירוקים (כותרת+«הרגע» מוגברים) ⇒ המודול; עובדות (תאריך · סכום · טלפון) ⇒ טופס-השורש ממולא-מראש ·
//   «נושאים» = 8 כפתורי-הנושא של מסמך-המוצר (balagan-topics.data.json) ⇒ המודולים לפי חפיפת-מילים ·
//   «חיבורים» = מפתח-הבינה של הלקוח (חוק-6, במכשיר) ⇒ צילום ⇒ קריאה ⇒ זיהוי.
//   אפס רשימה סגורה: N = מה שיש ב-apps/*.json ∩ peruk-index.json. פירוק חדש ⇒ מודול חדש, בלי יד. אפס מילון-דומייני של המנוע.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeConsts, write, setLook } from './render-ds.mjs';
import { searchOp, wireAtom, pickWired } from './particles.mjs';
import { renderBehavior } from './app-shell.mjs';
import { L, T } from './chrome.mjs';
import * as R from '../root.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APPS = path.join(HERE, 'apps'), PERUKS = path.join(HERE, 'peruks');
const TOPICS = JSON.parse(fs.readFileSync(path.join(HERE, 'balagan-topics.data.json'), 'utf8')).topics;
const clsOf = (slug) => 'Gen' + slug.replace(/(^|_)([a-z0-9])/g, (_, __, c) => c.toUpperCase()) + 'Screen';
const impOf = (w) => `import '../${w.file.startsWith('dart-') ? w.file : 'dart-ui-bs/' + w.file}';`;
const dq = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$')}'`;   // Dart string literal

// ── מילים (עברית): טוקנים ≥2, נורמליזציית סופיות, וגרסה בלי אות-שימוש קדמית (ו/ה/ב/ל/מ/ש/כ) לאורך ≥4 ──
const definal = (w) => w.replace(/ך$/, 'כ').replace(/ם$/, 'מ').replace(/ן$/, 'נ').replace(/ף$/, 'פ').replace(/ץ$/, 'צ');
const heWords = (s) => [...String(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => definal(m[0].replace(/[״׳]/g, ''))).filter((w) => w.length >= 2);
export const variants = (w) => { const out = [w]; if (w.length >= 4 && /^[והבלמשכ]/.test(w)) out.push(w.slice(1)); return out; };

export function loadModules() {
  const index = JSON.parse(fs.readFileSync(path.join(HERE, 'peruk-index.json'), 'utf8'));
  const mods = [];
  for (const node of index) {
    const mp = path.join(APPS, `${node.ns}.json`); if (!fs.existsSync(mp)) continue;
    const m = JSON.parse(fs.readFileSync(mp, 'utf8')); if (!m.home || m.look !== 'paper') continue;
    const doc = fs.existsSync(path.join(PERUKS, `peruk-${String(node.id).padStart(2, '0')}.md`)) ? fs.readFileSync(path.join(PERUKS, `peruk-${String(node.id).padStart(2, '0')}.md`), 'utf8') : '';
    mods.push({ ...m, id: node.id, moment: node.moment || '', category: node.category || '', doc });
  }
  return mods;
}

// ── מזהה-הרגע: TF-IDF על מסמכי-הפירוקים. כותרת+«הרגע» ×3. מילים ב->50% מהמסמכים = 0 (נגזר, לא רשימת-עצירה) ──
export function buildIdentifier(mods) {
  const N = mods.length; const df = new Map();
  const docs = mods.map((m) => {
    const tf = new Map(); const boost = new Set();
    for (const w of heWords(m.title + ' ' + m.moment)) for (const v of variants(w)) boost.add(v);
    for (const w of heWords(m.doc)) for (const v of variants(w)) tf.set(v, (tf.get(v) || 0) + 1);
    for (const v of boost) tf.set(v, (tf.get(v) || 0) + 3);
    for (const v of tf.keys()) df.set(v, (df.get(v) || 0) + 1);
    return { tf, boost };
  });
  const idf = (v) => { const d = df.get(v) || 0; return d > N * 0.5 ? 0 : Math.log((N + 1) / (d + 1)); };
  return mods.map((m, i) => {
    const { tf, boost } = docs[i];
    const w = [...tf.entries()].map(([v, c]) => [v, (1 + Math.log(c)) * idf(v) * (boost.has(v) ? 3 : 1)]).filter(([, s]) => s > 0).sort((a, b) => b[1] - a[1]).slice(0, 140);
    return { ns: m.ns, weights: Object.fromEntries(w.map(([v, s]) => [v, Math.round(s * 100) / 100])) };
  });
}
export function identify(ident, text, k = 3) {
  const toks = new Set(); for (const w of heWords(text)) for (const v of variants(w)) toks.add(v);
  return ident.map((d, i) => ({ i, ns: d.ns, score: [...toks].reduce((s, v) => s + (d.weights[v] || 0), 0) })).filter((x) => x.score > 0).sort((a, b) => b.score - a.score || a.i - b.i).slice(0, k);
}
export function selfTest(mods, ident) {
  const bad = [];
  for (const m of mods) { for (const [what, q] of [['כותרת', m.title], ['הרגע', m.moment]]) { if (!q) continue; const h = identify(ident, q, 1); if (!h.length || h[0].ns !== m.ns) bad.push(`${m.ns} · ${what} ⇒ ${h.length ? h[0].ns : '—'}`); } }
  return bad;
}
const topicOf = (m) => {
  const words = new Set([...heWords(m.title + ' ' + m.category + ' ' + m.moment)].flatMap(variants));
  let best = null;
  for (const t of TOPICS) { const n = t.words.reduce((s, w) => s + (heWords(w).every((x) => words.has(x)) ? 1 : 0), 0); if (n > 0 && (!best || n > best.n)) best = { name: t.name, n }; }
  if (!best) { const all = new Set([...heWords(m.doc)].flatMap(variants)); for (const t of TOPICS) { const n = t.words.reduce((s, w) => s + (heWords(w).every((x) => all.has(x)) ? 1 : 0), 0); if (n > 0 && (!best || n > best.n)) best = { name: t.name, n }; } }
  return best ? best.name : L.topicOther;
};

export function buildBalagan() {
  setLook('paper');
  const mods = loadModules();
  if (!mods.length) { console.log('בלגן: אין מודולי-נייר (apps/*.json) — דלג'); return null; }
  for (const d of [R.outDir(), R.dataOutDir()]) if (fs.existsSync(d)) for (const f of fs.readdirSync(d)) if (/^gen_balagan_[a-z]+(_content)?\.dart$/.test(f)) fs.unlinkSync(path.join(d, f));
  const ident = buildIdentifier(mods);
  const bad = selfTest(mods, ident);
  mods.forEach((m) => { m.topic = topicOf(m); });
  const todayCls = (m) => `${m.home.cls}Today`;

  // ── 1 · moments: נתוני-הזיהוי + identify + facts (Dart טהור) ──
  {
    const slug = 'balagan_moments';
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29) — מזהה-הרגע: TF-IDF דטרמיניסטי מ-${mods.length} מסמכי-פירוק (כותרת+«הרגע» ×3). אפס-בינה, אפס-מילון. אל תערוך ידנית.
class BalaganModule {
  const BalaganModule(this.index, this.ns, this.title, this.moment, this.topic, this.weights, this.dateFields, this.numFields, this.descField, this.longField);
  final int index; final String ns, title, moment, topic; final Map<String, double> weights; final List<String> dateFields, numFields; final String descField, longField;
}
class BalaganHit { const BalaganHit(this.module, this.score); final BalaganModule module; final double score; }

const List<BalaganModule> kBalaganModules = [
${mods.map((m, i) => `  BalaganModule(${i}, '${m.ns}', ${dq(m.title)}, ${dq(m.moment)}, ${dq(m.topic)}, {${Object.entries(ident[i].weights).map(([v, s]) => `${dq(v)}: ${s}`).join(', ')}}, [${m.root.fields.filter((f) => f.type === 'date').map((f) => dq(f.label)).join(', ')}], [${m.root.fields.filter((f) => f.type === 'num').map((f) => dq(f.label)).join(', ')}], ${dq(m.root.descField || '')}, ${dq((m.root.fields.find((f) => f.type === 'multiline') || {}).label || '')}),`).join('\n')}
];

String _definal(String w) => w.replaceAll(RegExp(r'ך\$'), 'כ').replaceAll(RegExp(r'ם\$'), 'מ').replaceAll(RegExp(r'ן\$'), 'נ').replaceAll(RegExp(r'ף\$'), 'פ').replaceAll(RegExp(r'ץ\$'), 'צ');
Set<String> balaganTokens(String s) {
  final out = <String>{};
  for (final m in RegExp(r'[\\u0590-\\u05FF][\\u0590-\\u05FF״׳]*').allMatches(s)) {
    final w = _definal(m.group(0)!.replaceAll(RegExp(r'[״׳]'), '')); if (w.length < 2) continue;
    out.add(w); if (w.length >= 4 && 'והבלמשכ'.contains(w[0])) out.add(w.substring(1));
  }
  return out;
}
/// זיהוי: סכום-משקלים של מילות-הטקסט לכל מודול ⇒ 3 הטובים (ציון > 0). דטרמיניסטי; שוויון ⇒ המוקדם.
List<BalaganHit> balaganIdentify(String text, {int k = 3}) {
  final toks = balaganTokens(text);
  final hits = <BalaganHit>[];
  for (final m in kBalaganModules) { var s = 0.0; for (final t in toks) { s += m.weights[t] ?? 0; } if (s > 0) hits.add(BalaganHit(m, s)); }
  hits.sort((a, b) { final c = b.score.compareTo(a.score); return c != 0 ? c : a.module.index.compareTo(b.module.index); });
  return hits.take(k).toList();
}
/// עובדות מהטקסט (תאריכים · סכומים · טלפון · שורה-ראשונה) ⇒ שדות-השורש לפי טיפוס. אפס-ניחוש-שמות: שדה-תאריך ראשון ⇐ תאריך ראשון, וכן הלאה.
Map<String, String> balaganFacts(String text, BalaganModule m) {
  final out = <String, String>{};
  final dates = <String>[];
  for (final d in RegExp(r'(\\d{4})-(\\d{2})-(\\d{2})').allMatches(text)) { dates.add(d.group(0)!); }
  for (final d in RegExp(r'(\\d{1,2})[./](\\d{1,2})[./](\\d{2,4})').allMatches(text)) { var y = d.group(3)!; if (y.length == 2) y = '20\$y'; dates.add('\$y-\${d.group(2)!.padLeft(2, '0')}-\${d.group(1)!.padLeft(2, '0')}'); }
  final nums = <String>[];
  for (final n in RegExp(r'(?<![\\d-])(\\d{1,3}(?:,\\d{3})+|\\d{3,7})(?![\\d-])').allMatches(text)) { final v = n.group(1)!.replaceAll(',', ''); if (!dates.any((d) => d.contains(v))) nums.add(v); }
  for (var i = 0; i < m.dateFields.length && i < dates.length; i++) { out[m.dateFields[i]] = dates[i]; }
  for (var i = 0; i < m.numFields.length && i < nums.length; i++) { out[m.numFields[i]] = nums[i]; }
  final line = text.trim().split(RegExp(r'[\\n.]')).first.trim();
  if (m.descField.isNotEmpty && line.isNotEmpty && line.length <= 40 && !m.dateFields.contains(m.descField) && !m.numFields.contains(m.descField)) { out[m.descField] = line; }   // שורה קצרה = שם/מתאר; משפט ארוך אינו שם
  if (m.longField.isNotEmpty && text.trim().length > 40) { out[m.longField] = text.trim(); }   // הטקסט המלא ⇒ שדה-הטקסט-הארוך הראשון (multiline), אם יש
  return out;
}
`;
    write(slug, code, '');
  }

  // ── 2 · «היום» המאוחד ──
  {
    const slug = 'balagan_home'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29) — «היום» של בלגן: מיזוג ספקי-ה-Today של ${mods.length} מודולים — באיחור ראשון · היום · הרשומות הפתוחות (3 למעלה, השאר מקופל) · ממתין-לאישורך · עשיתי-לבד · מחר. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_store.dart';
${mods.map((m) => `import 'gen_${m.home.slug}.dart';`).join('\n')}
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

typedef _Items = List<DsTodayItem> Function(DateTime today, {required int dayDelta});
typedef _Props = List<Widget> Function(BuildContext context, DateTime today);
typedef _Card = Widget Function(BuildContext context, Map<String, String> r);
class _Mod { const _Mod(this.name, this.open, this.items, this.proposals, this.card, this.autopilot); final String name; final List<Map<String, String>> Function() open; final _Items items; final _Props proposals; final _Card card; final void Function() autopilot; }

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  static const _mods = <_Mod>[
${mods.map((m) => `    _Mod(${todayCls(m)}.module, ${todayCls(m)}.open, ${todayCls(m)}.items, ${todayCls(m)}.proposals, ${todayCls(m)}.card, ${todayCls(m)}.autopilot),`).join('\n')}
  ];
  static DateTime _day(DateTime d) => DateTime(d.year, d.month, d.day);
  static String _iso(DateTime d) => d.toIso8601String().substring(0, 10);

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
  void _autopilotAll() { for (final m in _mods) { m.autopilot(); } }
  @override
  void initState() { super.initState(); WidgetsBinding.instance.addPostFrameCallback((_) { _autopilotAll(); }); appStore.addListener(_onStore); }
  void _onStore() { WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted) _autopilotAll(); }); }
  @override
  void dispose() { appStore.removeListener(_onStore); super.dispose(); }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) {
    final today = _day(DateTime.now());
    final all0 = <DsTodayItem>[for (final m in _mods) ...m.items(today, dayDelta: 0)]..sort((a, b) => a.due.compareTo(b.due));
    final overdue = all0.where((x) => x.overdue).toList();
    final todayItems = all0.where((x) => !x.overdue).toList();
    final tomorrow = <DsTodayItem>[for (final m in _mods) ...m.items(today, dayDelta: 1)]..sort((a, b) => a.due.compareTo(b.due));
    final pending = <Widget>[for (final m in _mods) ...m.proposals(context, today)];
    final cards = <Widget>[for (final m in _mods) for (final r in m.open()) m.card(context, r)];
    final did = appStore.log.where((e) => (e['kind'] == 'decide' || e['kind'] == 'auto' || e['kind'] == 'next') && e['undone'] != '1').take(5).toList();
    final n = overdue.length + todayItems.length + pending.length;
    final lead = n == 0 && cards.isEmpty ? ${k(L.homeNone)} : n <= 1 ? ${k(L.homeOne)} : ${k(L.homeMany)}.replaceAll('{n}', n.toString());
    final hardToday = todayItems.where((x) => x.hard && x.due == today).length;
    WidgetsBinding.instance.addPostFrameCallback((_) { _digest(lead, hardToday); });
    final lk = DsLook.of(context);
    final empty = n == 0 && cards.isEmpty;
    return DsScaffold(title: ${k(L.navToday)}, subtitle: empty ? ${k(L.askSub)} : lead, icon: ${k('')}, children: [
      if (!empty) DsLoadMeter(count: n, label: ${k(L.loadOf)}.replaceAll('{n}', n.toString()), stateLabels: [${k(L.loadOk)}, ${k(L.loadWarn)}, ${k(L.loadBad)}]),
      Padding(padding: const EdgeInsets.only(top: 16, bottom: 12), child: Text(lead, style: TextStyle(color: lk.ink, fontSize: 28, fontWeight: FontWeight.w600, height: 1.2))),
      if (overdue.isNotEmpty) DsSection(title: ${k(L.homeOverdue)}, tone: 2, children: [for (final it in overdue) DsActionRow(title: it.title, sub: it.sub + ' · ' + it.module, tone: 2, actions: it.actions, onAct: it.act)]),   // D6/P6/P7 · באיחור ראשון
      if (todayItems.isNotEmpty) DsSection(title: ${k(L.homeToday)}, children: [for (final it in todayItems) DsActionRow(title: it.title, sub: it.sub + ' · ' + it.module, actions: it.actions, onAct: it.act)]),
      ...cards.take(3),   // 3 למעלה
      if (cards.length > 3) DsFold(title: ${k(L.homeMore)}.replaceAll('{n}', (cards.length - 3).toString()), details: cards.skip(3).toList()),
      if (pending.isNotEmpty) DsSection(title: ${k(L.homePending)} + ' · ' + pending.length.toString(), children: pending),   // D5
      if (did.isNotEmpty) DsSection(title: ${k(L.homeDid)} + ' · ' + did.length.toString(), children: [for (final e in did) DsLogRow(text: e['what'] ?? '', undoLabel: ${k(L.undo)}, onUndo: () => appStore.undo(e['id'] ?? ''))]),   // T2
      if (tomorrow.isNotEmpty) DsFold(title: ${k(L.homeTomorrow)} + ' (' + tomorrow.length.toString() + ')', details: [for (final it in tomorrow) DsActionRow(title: it.title, sub: it.sub + ' · ' + it.module)]),   // D8
      if (!empty && overdue.isEmpty && todayItems.isEmpty && pending.isEmpty) Padding(padding: const EdgeInsets.only(top: 12), child: Text(${k(L.homeAll)}, style: TextStyle(color: lk.muted, fontSize: 14))),
      if (empty) DsNote(message: ${k(L.homeEmptyWay)}, label: '', tone: 0),
    ]);
  });
}
`;
    write(slug, code, dump());
  }

  // ── 3 · «מה קרה?» ──
  {
    const slug = 'balagan_ask'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29) — «מה קרה?»: שורה/הדבקה/צילום ⇒ זיהוי-הרגע (דטרמיניסטי) ⇒ «הבנתי כך?» ⇒ טופס-השורש של המודול ממולא-מראש. צילום נקרא רק עם מפתח-הלקוח (ds_ai). אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_ai.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'gen_balagan_moments.dart';
${mods.map((m) => `import 'gen_${m.root.slug}.dart';`).join('\n')}
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

Widget balaganOpen(int index, Map<String, String> initial) {
  switch (index) {
${mods.map((m, i) => `    case ${i}: return ${m.root.cls}(initial: initial);`).join('\n')}
    default: return const SizedBox.shrink();
  }
}

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  final _c = TextEditingController();
  List<BalaganHit> _hits = const [];
  Map<String, String> _extra = const {};
  bool _asked = false, _busy = false;
  String _note = '';

  void _go() { setState(() { _asked = true; _hits = balaganIdentify(_c.text); _note = _hits.isEmpty ? ${k(L.askNone)} : ''; }); }
  void _skip() { setState(() { _hits = _hits.length > 1 ? _hits.sublist(1) : const []; if (_hits.isEmpty) _note = ${k(L.askNone)}; }); }
  void _open(BuildContext context, BalaganHit h) {
    final facts = {...balaganFacts(_c.text, h.module), ..._extra}..removeWhere((key, v) => v.trim().isEmpty || !(h.module.dateFields.contains(key) || h.module.numFields.contains(key) || key == h.module.descField || key == h.module.longField));
    Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => balaganOpen(h.module.index, facts)));
  }
  Future<void> _photo() async {
    final key = appStore.setting('ai.key');
    if (key.isEmpty) { setState(() => _note = ${k(L.askNoKey)}); return; }
    final x = await ImagePicker().pickImage(source: kIsWeb ? ImageSource.gallery : ImageSource.camera, imageQuality: 85);
    if (x == null) return;
    setState(() { _busy = true; _note = ${k(L.askReading)}; });
    final bytes = await x.readAsBytes();
    final r = await dsAiExtract(apiKey: key, image: bytes, imageMime: x.mimeType ?? 'image/jpeg', fields: const ['תאריך', 'סכום', 'שם'], model: appStore.setting('ai.model', 'claude-sonnet-5'));
    if (!mounted) return;
    if (r == null) { setState(() { _busy = false; _note = ${k(L.askFailed)}; }); return; }
    final text = (r['_text'] ?? '').trim();
    setState(() { _busy = false; _note = ''; if (text.isNotEmpty) _c.text = text; _extra = {for (final e in r.entries) if (e.key != '_text' && e.value.trim().isNotEmpty) e.key: e.value}; });
    _go();
  }

  @override
  Widget build(BuildContext context) {
    final lk = DsLook.of(context);
    final top = _hits.isNotEmpty ? _hits.first : null;
    return DsScaffold(title: ${k(L.askTitle)}, subtitle: ${k(L.askSub)}, icon: ${k('')}, children: [
      Container(
        decoration: BoxDecoration(border: Border.all(color: lk.line), borderRadius: BorderRadius.circular(lk.r)),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: TextField(controller: _c, minLines: 3, maxLines: 8, autofocus: true, style: TextStyle(color: lk.ink, fontSize: 16, height: 1.5), decoration: InputDecoration(border: InputBorder.none, hintText: ${k(L.askHint)}, hintStyle: TextStyle(color: lk.faint)), onSubmitted: (_) => _go()),
      ),
      Padding(padding: const EdgeInsets.only(top: 10), child: Row(children: [
        Expanded(child: DsPrimaryButton(label: ${k(L.askGo)}, onTap: _busy ? null : _go)),
        const SizedBox(width: 8),
        GestureDetector(onTap: _busy ? null : _photo, child: Container(padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9), decoration: BoxDecoration(border: Border.all(color: lk.line), borderRadius: BorderRadius.circular(9)), child: Text(${k(L.askPhoto)}, style: TextStyle(color: lk.ink, fontSize: 14, fontWeight: FontWeight.w600)))),
      ])),
      if (_note.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 10), child: DsNote(message: _note, label: '', tone: 0)),
      if (_asked && top != null) DsSection(title: ${k(L.askUnderstood)}, children: [
        DsApproveCard(question: ${k(L.askIs)}.replaceAll('{title}', top.module.title).replaceAll('{moment}', top.module.moment), source: _c.text.length > 80 ? _c.text.substring(0, 80) : _c.text, okLabel: ${k(L.askOpen)}, noLabel: ${k(L.askNot)}, onOk: () => _open(context, top), onNo: _skip),
        if (_hits.length > 1) DsFold(title: ${k(L.askAlso)} + ' (' + (_hits.length - 1).toString() + ')', details: [for (final h in _hits.skip(1)) DsNavTile(glyph: '', title: h.module.title, sub: h.module.moment, onTap: () => _open(context, h))]),
      ]),
    ]);
  }
}
`;
    write(slug, code, dump());
  }

  // ── 4 · «חיבורים» (מפתחות-הלקוח) · «נושאים» · «התנהגות» ──
  const bh = renderBehavior('balagan_behavior');
  {
    const slug = 'balagan_keys'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29 · חוק-6) — «חיבורים»: המפתחות של הלקוח, במכשיר בלבד. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import '../dart-ui-bs/ds/ds_field.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});
  @override
  Widget build(BuildContext context) => AnimatedBuilder(animation: appStore, builder: (context, _) => DsScaffold(title: ${k(L.keysTitle)}, subtitle: ${k(L.keysSub)}, icon: ${k('')}, children: [
    DsField(label: ${k(L.aiKeyLabel)}, hint: ${k(L.aiKeyHint)}, value: appStore.setting('ai.key'), onChanged: (v) => appStore.setSetting('ai.key', v.trim())),
    DsField(label: ${k(L.aiModelLabel)}, hint: ${k(L.aiModelHint)}, value: appStore.setting('ai.model'), onChanged: (v) => appStore.setSetting('ai.model', v.trim())),
    Padding(padding: const EdgeInsets.only(top: 12), child: DsNote(message: ${k(L.keysNote)}, label: '', tone: 0)),
    Padding(padding: const EdgeInsets.only(top: 8), child: DsNote(message: ${k(L.keysSoon)}, label: '', tone: 0)),
  ]));
}
`;
    write(slug, code, dump());
  }
  {
    const slug = 'balagan_topics'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    const order = [...TOPICS.map((t) => t.name), L.topicOther].filter((t) => mods.some((m) => m.topic === t));
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29) — «נושאים»: ${order.length} נושאים (מסמך-המוצר §7) ⇒ ${mods.length} מודולים לפי חפיפת-מילים · חיבורים · התנהגות. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import 'gen_balagan_behavior.dart';
import 'gen_balagan_keys.dart';
${mods.map((m) => `import 'gen_${m.root.slug}.dart';`).join('\n')}
import 'package:flutter/material.dart';

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});
  @override
  Widget build(BuildContext context) => DsScaffold(title: ${k(L.topicsTitle)}, subtitle: ${k(L.topicsSub)}, icon: ${k('')}, children: [
${order.map((t) => `    DsSection(title: ${k(t)}, children: [
${mods.filter((m) => m.topic === t).map((m) => `      DsNavTile(glyph: '', title: ${k(m.title)}, sub: ${k(m.moment)}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${m.root.cls}()))),`).join('\n')}
    ]),`).join('\n')}
    DsSection(title: ${k(L.topicsSystem)}, children: [
      DsNavTile(glyph: '', title: ${k(L.keysTitle)}, sub: ${k(L.keysSub)}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${clsOf('balagan_keys')}()))),
      DsNavTile(glyph: '', title: ${k(L.behaviorTitle)}, sub: ${k(L.behaviorSub)}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${bh.cls}()))),
    ]),
  ]);
}
`;
    write(slug, code, dump());
  }

  // ── 5 · השלד: היום · מה קרה? · נושאים + מקשים + פלטה ──
  {
    const slug = 'balagan_shell'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    const imports = new Set();
    const firstWired = (pick, ctx) => { const w = pickWired([...pick.atoms, ...pick.alts], (c) => wireAtom(c, ctx)); if (w) imports.add(impOf(w)); return w; };
    const labels = [L.navToday, L.navAsk, L.navTopics];
    const nav = firstWired(searchOp('switch', `${L.balaganTitle} ${labels.join(' ')}`, ['items', 'selected', 'onSelect'], 12), { items: `[${labels.map((l) => k(l)).join(', ')}]`, selected: '_t', onSelect: '(i) => setState(() => _t = i)', bare: true, must: ['items', 'selected', 'onSelect'] });
    const paletteItems = `[DsPaletteItem(label: ${k(L.navAsk)}, sub: ${k(L.askSub)}, onTap: () => setState(() => _t = 1)), ${mods.map((m) => `DsPaletteItem(label: ${k(m.title)}, sub: ${k(m.moment)}, onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const ${m.root.cls}())))`).join(', ')}]`;
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29) — השלד של בלגן: היום · מה קרה? · נושאים. T/A/N · Ctrl/Cmd+K. אל תערוך ידנית.
${nav ? '' : '//   ⚪ ' + L.shellNoNav}
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds.dart';
import 'gen_balagan_ask.dart';
import 'gen_balagan_home.dart';
import 'gen_balagan_topics.dart';
${mods.map((m) => `import 'gen_${m.root.slug}.dart';`).join('\n')}
${[...imports].sort().join('\n')}
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ${cls} extends StatefulWidget {
  const ${cls}({super.key});
  @override
  State<${cls}> createState() => _${cls}State();
}

class _${cls}State extends State<${cls}> {
  int _t = 0;
  @override
  Widget build(BuildContext context) => CallbackShortcuts(
    bindings: <ShortcutActivator, VoidCallback>{
      const SingleActivator(LogicalKeyboardKey.keyT): () => setState(() => _t = 0),
      const SingleActivator(LogicalKeyboardKey.keyA): () => setState(() => _t = 1),
      const SingleActivator(LogicalKeyboardKey.keyN): () => setState(() => _t = 2),
      const SingleActivator(LogicalKeyboardKey.keyK, control: true): () => DsPalette.show(context, hint: ${k(L.paletteHint)}, items: ${paletteItems}),
      const SingleActivator(LogicalKeyboardKey.keyK, meta: true): () => DsPalette.show(context, hint: ${k(L.paletteHint)}, items: ${paletteItems}),
    },
    child: Focus(autofocus: true, child: Scaffold(
      backgroundColor: DsLook.of(context).bg,
      body: IndexedStack(index: _t.clamp(0, 2), children: const [${clsOf('balagan_home')}(), ${clsOf('balagan_ask')}(), ${clsOf('balagan_topics')}()]),
      bottomNavigationBar: ${nav ? `SafeArea(child: Padding(padding: const EdgeInsets.fromLTRB(12, 6, 12, 10), child: Center(heightFactor: 1.0, child: ${nav.call})))` : 'null'},
    )));
}
`;
    write(slug, code, dump());
  }

  // ── 6 · main: PureScope נייר + רישום קשרי כל המודולים ──
  {
    const slug = 'balagan_main'; const { k, dump } = makeConsts(slug); const cls = clsOf(slug);
    const rel = mods.filter((m) => m.relations);
    const code = `// 🧭 חולל ע"י balagan (G33 · הכרעה-29) — שורש בלגן: אפליקציה אחת, ${mods.length} מודולים, חנות אחת. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_${slug}_content.dart';
import '../dart-ui-bs/ds/ds_pure.dart';
import '../dart-ui-bs/ds/ds_seam.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'gen_balagan_shell.dart';
${rel.map((m) => `import 'gen_app_${m.ns}_relations.dart' as r_${m.ns};`).join('\n')}
import 'package:flutter/material.dart';

void main() {
${rel.map((m) => `  r_${m.ns}.registerAppRelations(appStore);`).join('\n')}
  runApp(const ${cls}());
}

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
        title: ${k(L.balaganTitle)},
        debugShowCheckedModeBanner: false,
        theme: ThemeData(useMaterial3: true, brightness: Brightness.light, fontFamily: 'Heebo', scaffoldBackgroundColor: DsPure.skins['paper']!.canvas, colorScheme: ColorScheme.fromSeed(seedColor: DsPure.themes['t-balagan']!.a, brightness: Brightness.light)),
        builder: (context, child) => PureScope(theme: DsPure.themes['t-balagan']!, skin: DsPure.skins['paper']!, fonts: DsPure.fontSets['heebo']!, child: Directionality(textDirection: TextDirection.rtl, child: child ?? const SizedBox.shrink())),
        home: const ${clsOf('balagan_shell')}(),
      );
}
`;
    write(slug, code, dump());
  }
  fs.writeFileSync(path.join(HERE, 'balagan-index.json'), JSON.stringify({ modules: mods.map((m, i) => ({ index: i, ns: m.ns, title: m.title, topic: m.topic, home: m.home.cls, root: m.root.cls, dates: m.root.fields.filter((f) => f.type === 'date').length })), selfTest: bad }, null, 1));
  console.log(`🧭 בלגן: ${mods.length} מודולים ⇒ אפליקציה אחת (היום · מה קרה? · נושאים ${[...new Set(mods.map((m) => m.topic))].length}) · מזהה-הרגע: ${bad.length ? '🔴 ' + bad.join(' · ') : '✓ כותרת+הרגע ⇒ עצמו ב-' + mods.length + '/' + mods.length}`);
  return { mods, bad };
}

const __isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (__isMain) { const r = buildBalagan(); if (r && r.bad.length) process.exit(1); }
