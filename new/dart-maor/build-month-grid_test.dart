// רתמת-זהב · build-month-grid — 5 דוגמאות-החוזה של בדיקת-ה-JS, מומרות ל-Dart.
// אותם קלטים→פלטים בדיוק (new/atoms/build-month-grid.test.mjs). עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/build-month-grid_test.dart
import 'build-month-grid.dart';

// ── שקעים מקומיים לבדיקה (מקבילים לשקעי בדיקת-ה-JS) ─────────────────────────
String _p2(int n) => n.toString().padLeft(2, '0');
String isoOf(DateTime d) => '${d.year}-${_p2(d.month)}-${_p2(d.day)}';

Map<String, dynamic> cellOf(
    DateTime d, bool inMonth, bool hebMode, Map<String, List<Map<String, dynamic>>> byDate) {
  final iso = isoOf(d);
  return {'iso': iso, 'inMonth': inMonth, 'events': byDate[iso] ?? <Map<String, dynamic>>[]};
}

// hpOf — פיקסצ׳ר של Intl en-u-ca-hebrew על טווח-האמת שהאלגוריתם נוגע בו:
// אלול תשפ"ו = 2026-08-14..2026-09-11 (29 יום); א׳ תשרי תשפ"ז = 2026-09-12.
// הערכים זהים לפלט-ה-Intl של בדיקת-ה-JS על אותם תאריכים.
Map<String, dynamic> hpOf(String iso, DateTime d) {
  final start = DateTime.parse('2026-08-14T12:00:00');
  final diff = DateTime.parse('${iso}T12:00:00').difference(start).inDays;
  if (diff >= 0 && diff <= 28) return {'day': diff + 1, 'month': 'Elul', 'year': 5786};
  if (diff == 29) return {'day': 1, 'month': 'Tishri', 'year': 5787};
  throw StateError('hpOf fixture: תאריך מחוץ-לטווח $iso');
}

String gemYear(String y) => 'ג[$y]'; // מקביל ל-(y)=>'ג['+y+']'

// fmtMonthYear — Intl 'he' {month:long, year:numeric}, ספרות-latn.
String fmtMonthYear(DateTime d) {
  const names = ['', 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי',
    'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
  return '${names[d.month]} ${d.year}';
}

// fmtHebMonth — Intl 'he-u-ca-hebrew' {month:long}; נקרא רק על 1.8 ו-31.8.2026.
String fmtHebMonth(DateTime d) {
  const m = {'2026-08-01': 'אב', '2026-08-31': 'אלול'};
  final v = m[isoOf(d)];
  if (v == null) throw StateError('fmtHebMonth fixture: ${isoOf(d)}');
  return v;
}

// fmtHebYear — Intl 'he-u-ca-hebrew' {year:numeric}, ספרות-latn ⇒ '5786'.
String fmtHebYear(DateTime d) => '5786';

// ── עזרי-השוואה עמוקה ───────────────────────────────────────────────────────
bool deepEq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

void eq(String name, dynamic got, dynamic want) {
  if (!deepEq(got, want)) {
    print('✗ $name:\n  got:  $got\n  want: $want');
    throw AssertionError(name);
  }
}

List<Map<String, dynamic>> cellsOf(Map<String, dynamic> g) =>
    (g['cells'] as List).cast<Map<String, dynamic>>();

void main() {
  // 1 — לועזי
  final g1 = buildMonthGrid(<Map<String, dynamic>>[], '2026-08-24', false,
      cellOf, isoOf, hpOf, gemYear, fmtMonthYear, fmtHebMonth, fmtHebYear);
  final c1 = cellsOf(g1);
  eq('1 · 42 תאים', c1.length, 42);
  eq('1 · תא ראשון', c1[0]['iso'], '2026-07-26');
  eq('1 · תא אחרון', c1[41]['iso'], '2026-09-05');
  eq('1 · 31 בתוך-החודש', c1.where((c) => c['inMonth'] == true).length, 31);
  eq('1 · label', g1['label'], 'אוגוסט 2026');
  eq('1 · subLabel', g1['subLabel'], 'אב–אלול');
  eq('1 · prev/next', {'p': g1['prevIso'], 'n': g1['nextIso']},
      {'p': '2026-07-15', 'n': '2026-09-15'});

  // 2 — קיבוץ אירועים; בלי-date מדולג
  final g2 = buildMonthGrid(<Map<String, dynamic>>[
    {'date': '2026-08-24', 't': 'x'},
    {'date': '2026-08-24', 't': 'y'},
    {'t': 'בלי-תאריך'},
  ], '2026-08-24', false, cellOf, isoOf, hpOf, gemYear, fmtMonthYear,
      fmtHebMonth, fmtHebYear);
  final c2 = cellsOf(g2);
  final cell824 = c2.firstWhere((c) => c['iso'] == '2026-08-24');
  eq('2 · שני אירועים בתא',
      (cell824['events'] as List).map((e) => e['t']).toList(), ['x', 'y']);
  eq('2 · חסר-date לא בגריד',
      c2.fold<int>(0, (n, c) => n + (c['events'] as List).length), 2);

  // 3 — עברי: אלול תשפ"ו
  final g3 = buildMonthGrid(<Map<String, dynamic>>[], '2026-08-24', true,
      cellOf, isoOf, hpOf, gemYear, fmtMonthYear, fmtHebMonth, fmtHebYear);
  final c3 = cellsOf(g3);
  eq('3 · 35 תאים', c3.length, 35);
  eq('3 · ריפוד-פתיחה',
      c3.take(5).map((c) => [c['iso'], c['inMonth']]).toList(), [
    ['2026-08-09', false],
    ['2026-08-10', false],
    ['2026-08-11', false],
    ['2026-08-12', false],
    ['2026-08-13', false],
  ]);
  eq('3 · א׳ אלול', [c3[5]['iso'], c3[5]['inMonth']], ['2026-08-14', true]);
  eq('3 · כ"ט אלול', [c3[33]['iso'], c3[33]['inMonth']], ['2026-09-11', true]);
  eq('3 · ריפוד-סוף', [c3[34]['iso'], c3[34]['inMonth']], ['2026-09-12', false]);
  eq('3 · 29 ימי-חודש', c3.where((c) => c['inMonth'] == true).length, 29);
  eq('3 · prev/next', {'p': g3['prevIso'], 'n': g3['nextIso']},
      {'p': '2026-08-13', 'n': '2026-09-12'});

  // 4 — תוויות עבריות
  eq('4 · label', g3['label'], 'Elul ג[5786]');
  eq('4 · subLabel', g3['subLabel'], 'אוגוסט 2026 – ספטמבר 2026');

  // 5 — אירוע בכ"ט אלול מגיע לתא-האחרון-בחודש
  final g5 = buildMonthGrid(<Map<String, dynamic>>[
    {'date': '2026-09-11', 't': 'ערב-ר"ה'},
  ], '2026-08-24', true, cellOf, isoOf, hpOf, gemYear, fmtMonthYear,
      fmtHebMonth, fmtHebYear);
  final c5 = cellsOf(g5);
  eq('5 · אירוע בתא האחרון-בחודש',
      (c5[33]['events'] as List).map((e) => e['t']).toList(), ['ערב-ר"ה']);

  print('✓ build-month-grid (Dart): 5 דוגמאות-חוזה — ירוק · Dart≡JS');
}
