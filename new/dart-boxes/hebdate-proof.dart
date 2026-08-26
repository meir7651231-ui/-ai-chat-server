// 🧪 הוכחת-חוצה-שפות · hebdate (Dart) — אותם קלטים/WANT כמו new/boxes/hebdate.test.mjs.
// מדולג: hebToIso(2.5,...) — day לא-שלם בלתי-אפשרי בטיפוס int של Dart (ארטיפקט-ריצה של JS).
import 'dart:convert';
import 'hebdate.dart' as H;

int n = 0, fails = 0;
void ok(String name, bool c) {
  if (!c) { print('✗ $name'); fails++; } else { n++; }
}

void main() {
  // מילון-החודשים (hebdate.ts:42-49)
  ok("monthHeOf('Av')=='אב'", H.monthHeOf('Av') == 'אב');
  ok("monthHeOf('Foo')==''", H.monthHeOf('Foo') == '');
  ok("monthEnOf('אב')=='Av'", H.monthEnOf('אב') == 'Av');
  ok("monthEnOf('אדר א׳')=='Adar I'", H.monthEnOf('אדר א׳') == 'Adar I');
  ok("monthEnOf('זבל')==null", H.monthEnOf('זבל') == null);

  // הדוגמה שבמקור (hebdate.ts:97): כ״ג אב תשפ״ו = 2026-08-06 — עם golden-jsonEncode
  ok('hebToIso(23,אב,5786)', H.hebToIso(23, 'אב', 5786) == '2026-08-06');
  ok('isoToHebParts(2026-08-06) golden',
      jsonEncode(H.isoToHebParts('2026-08-06')) == '{"day":23,"monthHe":"אב","year":5786}');

  // שעון-מוזרק (hebdate.ts:52-54)
  ok('hebYearNow(24.8.2026)==5786', H.hebYearNow(DateTime(2026, 8, 24, 12)) == 5786);

  // מעוברת/פשוטה (hebdate.ts:79-94)
  ok('5784 מעוברת', H.isHebLeapYear(5784) == true);
  ok('5786 פשוטה', H.isHebLeapYear(5786) == false);
  final m86 = H.hebMonthsOf(5786), m84 = H.hebMonthsOf(5784);
  ok('hebMonthsOf(5786)',
      m86.length == 12 && m86.contains('אדר') && !m86.contains('אדר א׳'));
  ok('hebMonthsOf(5784)',
      m84.length == 13 && m84.contains('אדר א׳') && m84.contains('אדר ב׳') && !m84.contains('אדר'));
  ok('סדר-החודשים',
      m84[0] == 'תשרי' && m84[12] == 'אלול' && m86[0] == 'תשרי' && m86[11] == 'אלול');
  ok('אדר א׳ בפשוטה ⇒ null', H.hebToIso(1, 'אדר א׳', 5786) == null);

  // שמירת-גבולות (hebdate.ts:66-67) — 2.5 מדולג (int-only ב-Dart)
  for (final c in [[0, 'אב', 5786], [31, 'אב', 5786], [15, 'אב', 3999], [15, 'אב', 7001]]) {
    ok('גבול: hebToIso(${c[0]},${c[1]},${c[2]})',
        H.hebToIso(c[0] as int, c[1] as String, c[2] as int) == null);
  }

  // קלט שבור (hebdate.ts:108-110)
  for (final iso in ['junk', '', '2026-8-6']) {
    ok("isoToHebParts('$iso')==null", H.isoToHebParts(iso) == null);
  }
  // ⚠ התנהגות-המקור (L4): '2026-02-30' עובר רג׳קס ומתגלגל ל-2 במרץ — לא null
  ok('גלגול 30.2 ≡ 2.3',
      jsonEncode(H.isoToHebParts('2026-02-30')) == jsonEncode(H.isoToHebParts('2026-03-02')));

  // round-trip על תאריכים קבועים, כולל שנה מעוברת
  for (final iso in ['2026-08-06', '2024-03-24', '2025-03-14', '2026-01-01']) {
    final q = H.isoToHebParts(iso);
    ok('round-trip: $iso',
        q != null && H.hebToIso(q['day'] as int, q['monthHe'] as String, q['year'] as int) == iso);
  }
  // ל׳ חשוון: קיים רק בשנה שלמה — בטווח 5780..5790 חייבים גם null וגם round-trip תקין
  int full = 0, missing = 0;
  for (var y = 5780; y <= 5790; y++) {
    final iso = H.hebToIso(30, 'חשוון', y);
    if (iso == null) { missing++; continue; }
    final q = H.isoToHebParts(iso);
    ok('ל׳ חשוון round-trip: $y',
        q != null && q['day'] == 30 && q['monthHe'] == 'חשוון' && q['year'] == y);
    full++;
  }
  ok('ל׳ חשוון: שלמות=$full חסרות=$missing', full > 0 && missing > 0);

  // ולידציית-CLDR (hebdate.ts:125-137) + שער-מוזרק (hebdate.ts:139-143)
  ok('validateHebMonthNames(5786) ריק', H.validateHebMonthNames(5786).isEmpty);
  ok('validateHebMonthNames(5784) ריק', H.validateHebMonthNames(5784).isEmpty);
  ok('KNOWN_MONTHS_EN==14', H.KNOWN_MONTHS_EN.length == 14);
  int warned = 0;
  ok('cldrGuard תקין — לא הזהיר',
      H.cldrGuard(DateTime(2026, 8, 24, 12), (_) => warned++) == true && warned == 0);
  // שעון-שבור (מיוצג כ-null) ⇒ hebParts month:'' (לא-מוכר) ⇒ warn אחד + false
  ok('cldrGuard שבור — הזהיר פעם',
      H.cldrGuard(null, (_) => warned++) == false && warned == 1);

  if (fails > 0) {
    print('❌ קופסת-hebdate (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('hebdate dart proof failed');
  }
  print('✓ קופסת-hebdate (Dart): $n טענות — מילון-חודשים · המרות דו-כיווניות + round-trip · '
      'מעוברת/פשוטה · גבולות · שער-CLDR מוזרק — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
