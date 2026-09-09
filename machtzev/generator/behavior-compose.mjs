#!/usr/bin/env node
// 🧩 behavior-compose — שכבת-ההרכבה (G34ב · הכרעה-30): התנהגויות = חלקיקים-נבחרים מורכבים **במקום אחד** — gen_behaviors.dart.
//   הקלט = behavior-plan.json (החלקיק המוכח לכל צורך). הפלט = פונקציות bh* (ISO/מחרוזות/מספרים, טהורות) שכל קובץ-מחולל קורא להן:
//   דחייה (בסיס-מועד ⇒ הוספת-ימים ⇒ לא-בשבת) · תזכורות-שלפנינו · תווית-תאריך (חלקים) · «לפני» (חלקים) · תחילת-תוכנית · נרמול-שם/חיפוש/טלפון ·
//   שאילתת-ספרות · קידומת-חיפוש · ספירת-פתוחים · מפרידי-אלפים. אף קובץ-מחולל אחר אינו מייבא חלקיק ישירות (שער behavior ה).
//   בדיקה מחוללת: genesis_gen_behaviors_test.dart. אל תערוך ידנית.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as R from '../root.mjs';
import { readPlan } from './behavior-plan.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const P = readPlan(); const N = (id) => { const p = P[id]; if (!p || !p.pick) throw new Error(`behavior-compose: אין חלקיק מוכח לצורך ${id}`); return p.pick; };
const files = [...new Set(Object.values(P).filter((p) => p.pick).map((p) => p.file))].sort();
const code = `// 🧩 חולל ע"י behavior-compose (G34ב · הכרעה-30) — שכבת-ההרכבה: התנהגויות מחלקיקים מוכחים (behavior-plan.json), במקום אחד. אל תערוך ידנית.
${files.map((f) => `import '../${f}';`).join('\n')}
import '../dart-data-maor/norm-search-sockets.dart';
import '../dart-data-maor/gematria-sockets.dart';
import '../dart-data-maor/heb-month-he-sockets.dart';

String bhIso(DateTime d) => d.toIso8601String().substring(0, 10);
String bhIsoT(DateTime d) => d.toIso8601String().substring(0, 19);
DateTime bhDate(String iso) => DateTime(int.parse(iso.substring(0, 4)), int.parse(iso.substring(5, 7)), int.parse(iso.substring(8, 10)));
/// ימים מאז iso עד todayIso (חיובי = עבר) — חלקיק ${N('iso.daysSince')}; לא-תקין ⇒ 0
int bhDaysSince(String iso, String todayIso) { final n = ${N('iso.daysSince')}(iso, todayIso); return n.isFinite ? n.toInt() : 0; }
String bhWeekStart(String iso) => bhIso(${N('week.start')}(bhDate(iso)));
/// יום-בשבוע 0=ראשון…6=שבת = הרכבה: תחילת-השבוע (${N('week.start')}) + ימים-מאז
int bhWeekday(String iso) => bhDaysSince(bhWeekStart(iso), iso);
String bhPlusDays(String iso, int n) => ${N('iso.addDays')}(iso, n);
/// P8 · רך לא נוחת בשבת
String bhSoftShift(String iso, bool hard) => hard || bhWeekday(iso) != 6 ? iso : bhPlusDays(iso, 1);
/// ב׳-פו · «דחה למחר» מבאיחור = מחר: הבסיס = היום כשהמועד עבר (${N('task.overdue')})
String bhDueBase(String dueIso, String todayIso) => ${N('task.overdue')}({'due': dueIso}, todayIso) ? todayIso : dueIso;
/// ב׳-צא · היסטי-תזכורת שיום-הירי שלהם עוד לפנינו (${N('iso.inRange')})
List<int> bhAheadOffsets(String dueIso, bool hard, String todayIso, List<int> offsets) => [for (final o in offsets) if (${N('iso.inRange')}(bhSoftShift(bhPlusDays(dueIso, -o), hard), (from: todayIso, to: null))) o];
String bhDayMonth(String iso, bool withYear) => int.parse(iso.substring(8, 10)).toString() + '.' + int.parse(iso.substring(5, 7)).toString() + (withYear ? '.' + iso.substring(0, 4) : '');
/// ב׳-מא · תאריך כמו שאומרים — חלקים [סוג, יום-בשבוע, יום.חודש]; המונחים מולבשים בקורא
List<String> bhDayLabelParts(String iso, String todayIso) { final n = -bhDaysSince(iso, todayIso); final wd = bhWeekday(iso).toString(); final dm = bhDayMonth(iso, iso.substring(0, 4) != todayIso.substring(0, 4)); if (n == 0) return ['today', wd, dm]; if (n == 1) return ['tomorrow', wd, dm]; if (n == -1) return ['yesterday', wd, dm]; return [n.abs() <= 6 ? 'weekday' : 'date', wd, dm]; }
/// ב׳-מח · מתי זה קרה — חלקים [סוג, n] (${N('time.minutesBetween')})
List<String> bhAgoParts(String atIsoT, String nowIsoT) { final m = ${N('time.minutesBetween')}(atIsoT, nowIsoT); if (m < 1) return ['now', '0']; if (m < 60) return ['min', m.toString()]; final h = m ~/ 60; if (h < 2) return ['hour', '1']; if (atIsoT.substring(0, 10) == nowIsoT.substring(0, 10)) return ['hours', h.toString()]; return ['day', atIsoT.substring(0, 10)]; }
/// ב׳-צח · תחילת-התוכנית: תחילת-היום, ואם היום התקדם — מעכשיו מעוגל ל-5 דק׳ (${N('time.toMin')}) ⇒ 'HH:MM'
String bhPlanStart(String todayIso, int startHour, String nowIsoT) { final base = startHour * 60; if (nowIsoT.length < 16 || nowIsoT.substring(0, 10) != todayIso) return _hm(base); final tm = ${N('time.toMin')}(nowIsoT.substring(11, 16)); final nowMin = tm is num && tm.isFinite ? tm.toInt() : base; if (nowMin <= base) return _hm(base); return _hm(((nowMin + 4) ~/ 5) * 5); }
String _hm(int m) => (m ~/ 60).toString().padLeft(2, '0') + ':' + (m % 60).toString().padLeft(2, '0');
String bhNormSearch(String s) => ${N('text.normSearch')}(s, normSearch_T);
String bhNormName(String s) => ${N('name.norm')}(s, (t) => ${N('text.normSearch')}(t, normSearch_T));
String bhPhoneDigits(String? s) => ${N('phone.digits')}(s);
/// ב׳-צה · שורה של ספרות («1250» · «052-123») = חיפוש; מחזירה את השורה או ריק
String bhDigitsQuery(String q) { final t = q.trim(); return RegExp(r'^[0-9][0-9,.\\- ]*\$').hasMatch(t) && bhPhoneDigits(t).length >= 2 ? t : ''; }
/// ב׳-צז · «איפה X» ⇒ X (${N('prefix.rule')})
String bhPrefixRest(String s, List<String> words) { final t = s.trim(); for (final w in words) { if (w.isNotEmpty && ${N('prefix.rule')}(w + ' ', t) != null && t.length > w.length + 2) return t.substring(w.length + 1).trim(); } return ''; }
/// ב׳-נב · כמה פתוחים (שלב לפני האחרון; בלי שלבים = הכל) — ${N('count.by')}
int bhOpenCount(List<Map<String, String>> records, int stages) { var n = 0; for (final e in ${N('count.by')}(records, (r) => stages == 0 || (int.tryParse(((r as Map)['__stage'] ?? '0').toString()) ?? 0) < stages - 1 ? 'open' : 'closed')) { if (e[0] == 'open') n = e[1] as int; } return n; }
/// ב׳-קב · ציון-חיפוש סלחן: מדויק 100 (${N('search.exact')}) · קידומת 80 (${N('prefix.rule')}) · מכיל 62 (${N('search.contains')}) · מילה במרחק-עריכה ≤1 (≥5 אותיות: ≤2) ⇒ 50−d·10 (${N('text.distance')}); 0 = לא מתאים
int bhSearchScore(String q, String text) { final nq = bhNormSearch(q), nt = bhNormSearch(text); if (nq.isEmpty || nt.isEmpty) return 0; final e = ${N('search.exact')}(nq, nt); if (e != null) return e.toInt(); final p = ${N('prefix.rule')}(nq, nt); if (p != null) return p; final c = ${N('search.contains')}(nq, nt); if (c != null) return c; if (nq.length < 3) return 0; final lim = nq.length >= 5 ? 2 : 1; var best = 0; for (final w in nt.split(' ')) { if (w.length < nq.length - lim || w.length > nq.length + lim) continue; final d = ${N('text.distance')}(nq, w); if (d <= lim && 50 - d * 10 > best) best = 50 - d * 10; } return best; }
/// ב׳-קג · אותו-אדם? שמות דומים (${N('name.matches')} על נרמול-חיפוש שומר-רווחים): «רות לוי» ≈ «לוי רות» · «ר. לוי» ≠
bool bhSameName(String a, String b) => ${N('name.matches')}(a, b, bhNormSearch);
/// ב׳-קד · תאריך עברי מלא מ-ISO (${N('heb.dateFull')} ← ${N('heb.parts')} · ${N('heb.gem')} · ${N('heb.gemYear')} · שמות-חודשים); ריק/שבור ⇒ ''
String _bhGem(num n) => ${N('heb.gem')}(n, gematria_U, gematria_T, gematria_H, gematria_T2);
String bhHebDate(String iso) => ${N('heb.dateFull')}(iso, _bhGem, (y) => ${N('heb.gemYear')}(y, _bhGem), (d) => ${N('heb.parts')}(d), hebMonthHe_monthNames);
/// ב׳-קה · איחוד היסטי-תזכורת של כמה מועדים — כל היסט שלפחות מועד-אחד שלו עוד לפנינו (דרך bhAheadOffsets)
List<int> bhAheadOffsetsUnion(List<String> dueIsos, bool hard, String todayIso, List<int> offsets) => [for (final o in offsets) if (dueIsos.any((d) => bhAheadOffsets(d, hard, todayIso, offsets).contains(o))) o];
/// ב׳-קה · שורות-קבוצה: רשומות לפי מפתח-קבוצה (ריק = יחידה) ⇒ [[מפתח, n]…] בסדר-ההופעה (${N('count.by')})
List<List<Object>> bhGroupRows(List<Map<String, String>> rows, String key) => ${N('count.by')}(rows, (r) => ((r as Map)[key] ?? '').toString());
/// ב׳-קו · מפתח-טלפון קנוני (${N('phone.key')}): 052-123-4567 · +972521234567 · 00972… ⇒ 521234567
String bhPhoneKey(String? ph) => ${N('phone.key')}(ph);
/// ב׳-קט · טלפון ל-wa.me = 972 + המפתח-הקנוני; בלי ספרות ⇒ ''
String bhWaPhone(String? ph) { final k = bhPhoneKey(ph); return k.isEmpty ? '' : '972' + k; }
/// ב׳-קו · אותו-אדם בכמה שמות: קבוצות של שמות שחולקים טלפון (מפתח-קנוני) או שם-מנורמל (${N('dup.groups')} — רכיבי-קשירות)
List<List<String>> bhPersonGroups(List<String> names, Map<String, List<String>> phonesOf) => ${N('dup.groups')}([for (final n in names) <String, dynamic>{'id': n, 'phones': phonesOf[n] ?? const <String>[]}], (f) => [for (final p in (f['phones'] as List)) if (bhPhoneKey(p.toString()).isNotEmpty) bhPhoneKey(p.toString())], (f) => bhNormName(f['id'] as String));
/// ב׳-קז · «התכוונת ל…?» — המועמד הקרוב ביותר במרחק-עריכה ≤1 (≥5 אותיות: ≤2) על נרמול-חיפוש (${N('text.distance')}); אין ⇒ ''
String bhClosest(String q, List<String> cands) { final nq = bhNormSearch(q); if (nq.length < 3) return ''; final lim = nq.length >= 5 ? 2 : 1; var best = ''; var bd = lim + 1; for (final c in cands) { final nc = bhNormSearch(c); if (nc.isEmpty) continue; for (final w in [nc, ...nc.split(' ')]) { if (w == nq) { bd = -1; break; } if (w.length < nq.length - lim || w.length > nq.length + lim) continue; final d = ${N('text.distance')}(nq, w); if (d < bd) { bd = d; best = c; } } if (bd < 0) return ''; } return best; }   // גם מילה-בתוך-הכותרת («ליקוים» ⇒ «ליקויים אחרי כניסה…»); שוויון-מלא = אין הצעה
/// ב׳-קח · חלונות-פנויים בין בלוקים תפוסים ([['HH:MM','HH:MM']…] ממוינים) מ-fromHM עד toHM, רק ≥ minMin דק׳ (${N('time.toMin')})
List<List<String>> bhFreeWindows(List<List<String>> busy, String fromHM, String toHM, int minMin) { int mn(String t) { final v = ${N('time.toMin')}(t); return v.isFinite ? v.toInt() : 0; } final out = <List<String>>[]; var cur = mn(fromHM); final end = mn(toHM); for (final b in busy) { final a = mn(b[0]), e = mn(b[1]); if (a - cur >= minMin) out.add([_hm(cur), _hm(a)]); if (e > cur) cur = e; } if (end - cur >= minMin) out.add([_hm(cur), _hm(end)]); return out; }
/// ב׳-קי · מפתח-חודש (${N('iso.monthKey')}) · אותו-חודש
String bhMonthKey(String iso) => ${N('iso.monthKey')}(iso);
bool bhSameMonth(String a, String b) => a.length >= 7 && b.length >= 7 && bhMonthKey(a) == bhMonthKey(b);
/// ב׳-קיא · «נראה חוזר»: כל המרווחים בין המועדים הממוינים (bhDaysSince) באותו קצב ⇒ קוד-חזרה d1/w1/w2/m1/m2/y1; פחות מ-3 מועדים, מרווח-לא-מוכר או קצב-מעורב ⇒ ''
String bhRecurCode(List<String> isos) { final s = [...isos]..sort(); if (s.length < 3) return ''; String code(int g) => g == 1 ? 'd1' : g >= 6 && g <= 8 ? 'w1' : g >= 13 && g <= 15 ? 'w2' : g >= 26 && g <= 35 ? 'm1' : g >= 55 && g <= 65 ? 'm2' : g >= 360 && g <= 370 ? 'y1' : ''; String? c; for (var i = 1; i < s.length; i++) { final k = code(bhDaysSince(s[i - 1], s[i])); if (k.isEmpty || (c != null && c != k)) return ''; c = k; } return c ?? ''; }   // כל המרווחים באותו קצב — אחרת אין הצעה
/// ב׳-קיב · ימים בלי תשובה מאז שליחה (bhDaysSince): פעולה מאוחרת על אותו תיק ⇒ −1 (נענה/טופל)
int bhSilentDays(String sentAt, String? laterAt, String todayIso) { if (sentAt.length < 10) return -1; if (laterAt != null && laterAt.length >= 10 && laterAt.compareTo(sentAt) > 0) return -1; return bhDaysSince(sentAt.substring(0, 10), todayIso); }
/// ב׳-קיד · סכום-לפי-מפתח: קבוצות (bhGroupRows ⇐ count.by) + צבירת שדה-מספר ⇒ [[מפתח, n, סכום]…] בסדר-המונה
List<List<Object>> bhSumBy(List<Map<String, String>> rows, String key, String numKey) => [for (final g in bhGroupRows(rows, key)) [g[0], g[1], rows.where((r) => (r[key] ?? '') == g[0]).fold<double>(0, (a, r) => a + (double.tryParse((r[numKey] ?? '').replaceAll(',', '').trim()) ?? 0))]];
/// ב׳-קטו · חציון-שלמים (ריק ⇒ 0)
int bhMedianInt(List<int> xs) { if (xs.isEmpty) return 0; final s = [...xs]..sort(); return s[s.length ~/ 2]; }
/// ב׳-קטז · רצף-ימים: כמה ימים רצופים (מהיום או מאתמול אחורה) יש בהם לפחות תאריך אחד (bhPlusDays)
int bhStreakDays(List<String> dates, String todayIso) { final set = {for (final d in dates) if (d.length >= 10) d.substring(0, 10)}; var day = set.contains(todayIso) ? todayIso : bhPlusDays(todayIso, -1); var n = 0; while (set.contains(day)) { n++; day = bhPlusDays(day, -1); } return n; }
/// מפרידי-אלפים בלי ₪ (${N('money.fmt')})
String bhThousands(num v) => ${N('money.fmt')}(v).replaceFirst('₪', '');
`;
fs.writeFileSync(path.join(R.outDir(), 'gen_behaviors.dart'), code);
const test = `// 🧩 חולל ע"י behavior-compose — בדיקת שכבת-ההרכבה (היום = 2026-09-08 יום-שלישי). אל תערוך ידנית.
import 'package:buildsmart/genesis/dart-gen-bs/gen_behaviors.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('יום-בשבוע · לא-בשבת · בסיס-דחייה · הוספת-ימים', () {
    expect(bhWeekday('2026-09-08'), 2); expect(bhWeekday('2026-09-12'), 6); expect(bhWeekday('2026-09-13'), 0);
    expect(bhSoftShift('2026-09-12', false), '2026-09-13'); expect(bhSoftShift('2026-09-12', true), '2026-09-12');
    expect(bhDueBase('2026-09-01', '2026-09-08'), '2026-09-08'); expect(bhDueBase('2026-09-20', '2026-09-08'), '2026-09-20');
    expect(bhPlusDays('2026-09-30', 1), '2026-10-01'); expect(bhDaysSince('2026-09-05', '2026-09-08'), 3);
  });
  test('תזכורות-שלפנינו · תווית-תאריך · לפני · תחילת-תוכנית', () {
    expect(bhAheadOffsets('2026-09-09', true, '2026-09-08', [3, 1, 0]), [1, 0]);
    expect(bhDayLabelParts('2026-09-13', '2026-09-08'), ['weekday', '0', '13.9']); expect(bhDayLabelParts('2027-10-03', '2026-09-08')[2], '3.10.2027'); expect(bhDayLabelParts('2026-09-09', '2026-09-08')[0], 'tomorrow');
    expect(bhAgoParts('2026-09-08T09:55:00', '2026-09-08T10:00:00'), ['min', '5']); expect(bhAgoParts('2026-09-08T09:59:40', '2026-09-08T10:00:10')[0], 'now');
    expect(bhPlanStart('2026-09-08', 9, '2026-09-08T15:03:00'), '15:05'); expect(bhPlanStart('2026-09-08', 9, '2026-09-08T07:00:00'), '09:00');
  });
  test('נרמול · ספרות · קידומת · פתוחים · אלפים', () {
    expect(bhNormName('רות לוי'), 'רותלוי'); expect(bhNormSearch('שלום'), 'שלומ');
    expect(bhDigitsQuery('1,250'), '1,250'); expect(bhDigitsQuery('ארנונה 1250'), '');
    expect(bhPrefixRest('איפה הפיקדון', ['איפה', 'חפש']), 'הפיקדון'); expect(bhPrefixRest('הפיקדון איפה', ['איפה']), '');
    expect(bhOpenCount([{'__stage': '0'}, {'__stage': '2'}, {}], 3), 2); expect(bhThousands(1650), '1,650');
  });
  test('G35 · חיפוש-סלחן · אותו-שם · תאריך-עברי · איחוד-היסטים · שורות-קבוצה', () {
    expect(bhSearchScore('ארנונה', 'ארנונה'), 100); expect(bhSearchScore('ארנ', 'ארנונה 1250'), 80); expect(bhSearchScore('1250', 'ארנונה 1250'), 62);
    expect(bhSearchScore('ארנונא', 'ארנונה לעירייה'), 40); expect(bhSearchScore('ארנונא', 'חשמל'), 0); expect(bhSearchScore('אר', 'ארט'), 80); expect(bhSearchScore('קק', 'חשמל'), 0);
    expect(bhSameName('רות לוי', 'לוי רות'), true); expect(bhSameName('רות לוי', 'רות כהן'), false); expect(bhSameName('נועה', 'נועה'), true); expect(bhSameName('', 'נועה'), false);
    expect(bhHebDate('2026-09-08'), 'כ״ו אלול תשפ״ו'); expect(bhHebDate(''), '');
    expect(bhAheadOffsetsUnion(['2026-09-09', '2026-09-12'], true, '2026-09-08', [3, 1, 0]), [3, 1, 0]); expect(bhAheadOffsetsUnion(['2026-09-09'], true, '2026-09-08', [3, 1, 0]), [1, 0]);
    expect(bhGroupRows([{'group': 'g1'}, {'group': 'g1'}, {}], 'group'), [['g1', 2], ['', 1]]);
  });
  test('G36 · מפתח-טלפון · wa · קבוצות-אדם · התכוונת · חלונות-פנויים', () {
    expect(bhPhoneKey('052-123-4567'), '521234567'); expect(bhWaPhone('+972 52-123-4567'), '972521234567'); expect(bhWaPhone('abc'), '');
    final g = bhPersonGroups(['רות לוי', 'רותי לוי', 'דן כהן', 'רות  לוי'], {'רות לוי': ['052-1234567'], 'רותי לוי': ['+972521234567'], 'דן כהן': ['03-5551234']});
    expect(g.length, 1); expect(g.first.toSet(), {'רות לוי', 'רותי לוי', 'רות  לוי'});
    expect(bhClosest('ארנונא', ['ארנונה', 'חשמל']), 'ארנונה'); expect(bhClosest('ליקוים', ['ליקויים אחרי כניסה לדירה', 'חשמל']), 'ליקויים אחרי כניסה לדירה'); expect(bhClosest('חשמל', ['חשמל']), ''); expect(bhClosest('זזזז', ['ארנונה']), ''); expect(bhClosest('אר', ['ארט']), '');
    expect(bhFreeWindows([['10:00', '10:30'], ['12:00', '13:00']], '09:00', '18:00', 30), [['09:00', '10:00'], ['10:30', '12:00'], ['13:00', '18:00']]);
    expect(bhFreeWindows([['09:00', '09:20']], '09:00', '09:40', 30), <List<String>>[]); expect(bhFreeWindows(const [], '09:00', '10:00', 30), [['09:00', '10:00']]);
  });
  test('G37 · מפתח-חודש · נראה-חוזר · ימים-בלי-תשובה', () {
    expect(bhMonthKey('2026-09-08'), '2026-09'); expect(bhSameMonth('2026-09-08', '2026-09-30'), true); expect(bhSameMonth('2026-09-08', '2026-10-01'), false); expect(bhSameMonth('', '2026-10-01'), false);
    expect(bhRecurCode(['2026-07-15', '2026-08-15', '2026-09-15']), 'm1'); expect(bhRecurCode(['2026-09-01', '2026-09-08', '2026-09-15', '2026-09-22']), 'w1'); expect(bhRecurCode(['2026-09-01', '2026-09-03', '2026-09-30']), ''); expect(bhRecurCode(['2026-09-01', '2026-10-01']), '');
    expect(bhSilentDays('2026-09-05T10:00:00', null, '2026-09-08'), 3); expect(bhSilentDays('2026-09-05T10:00:00', '2026-09-06T09:00:00', '2026-09-08'), -1); expect(bhSilentDays('', null, '2026-09-08'), -1);
  });
  test('G38 · סכום-לפי · חציון · רצף-ימים', () {
    expect(bhSumBy([{'t': 'דירה', 'n': '8,000'}, {'t': 'דירה', 'n': '3000'}, {'t': 'משימות', 'n': '1,250'}], 't', 'n'), [['דירה', 2, 11000.0], ['משימות', 1, 1250.0]]);
    expect(bhMedianInt([7, 1, 4]), 4); expect(bhMedianInt([]), 0); expect(bhMedianInt([2, 9]), 9);
    expect(bhStreakDays(['2026-09-08', '2026-09-07', '2026-09-06', '2026-09-03'], '2026-09-08'), 3); expect(bhStreakDays(['2026-09-07', '2026-09-06'], '2026-09-08'), 2); expect(bhStreakDays(['2026-09-05'], '2026-09-08'), 0); expect(bhStreakDays(const [], '2026-09-08'), 0);
  });
}
`;
const bsTest = path.join(R.ROOT, '..', 'buildsmart', 'app_flutter', 'test'); if (fs.existsSync(path.join(bsTest, '..', 'pubspec.yaml'))) fs.writeFileSync(path.join(bsTest, 'genesis_gen_behaviors_test.dart'), test);
console.log(`🧩 gen_behaviors.dart · ${files.length} חלקיקים מוכחים ⇒ ${(code.match(/^\w[^\n]* bh\w+\(/gm) || []).length} התנהגויות-מורכבות + בדיקה מחוללת`);
