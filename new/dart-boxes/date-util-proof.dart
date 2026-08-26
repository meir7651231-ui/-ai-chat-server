// 🧪 הוכחת-חוצה-שפות · כלי-התאריך (Dart) — אותם קלטים/WANT כמו new/boxes/date-util.test.mjs.
// (מקרה Date('junk')⇒'NaN-NaN-NaN' של ה-JS מדולג — ארטיפקט-ריצה של JS; ל-Dart אין DateTime לא-תקין.)
import 'date-util.dart' as D;

int n = 0, fails = 0;
void ok(String name, bool c) {
  if (!c) { print('✗ $name'); fails++; } else { n++; }
}

void main() {
  // 1) isoLocal — מקומי + ריפוד + בליעת-שעה
  ok('isoLocal 2026-08-24', D.isoLocal(DateTime(2026, 8, 24)) == '2026-08-24');
  ok('isoLocal 2026-01-05', D.isoLocal(DateTime(2026, 1, 5)) == '2026-01-05');
  ok('isoLocal 1999-12-31', D.isoLocal(DateTime(1999, 12, 31)) == '1999-12-31');
  ok('isoLocal בליעת-שעה', D.isoLocal(DateTime(2026, 3, 1, 23, 59)) == '2026-03-01');

  // 2) isoToday — הזרקת-שעון דטרמיניסטית + פורמט + עקביות מול isoLocal(עכשיו)
  ok('isoToday אחרי-חצות', D.isoToday(DateTime(2026, 8, 24, 0, 30)) == '2026-08-24');
  ok('isoToday סוף-שנה', D.isoToday(DateTime(2026, 12, 31, 23, 59)) == '2026-12-31');
  ok('isoToday() פורמט', RegExp(r'^\d{4}-\d{2}-\d{2}$').hasMatch(D.isoToday()));
  {
    final a = D.isoLocal(DateTime.now());
    final got = D.isoToday();
    final b = D.isoLocal(DateTime.now());
    ok('isoToday()≡isoLocal(עכשיו)', got == a || got == b);
  }

  // 3) isoDaysAgo — יחסית-לשעון (סנדוויץ' חסין-חצות)
  String shifted(int days) => D.isoLocal(DateTime.now().subtract(Duration(days: days)));
  for (final days in [0, 7, 31, -1]) {
    final before = shifted(days);
    final got = D.isoDaysAgo(days);
    final after = shifted(days);
    ok('isoDaysAgo($days)', got == before || got == after);
  }

  // 4) dateInRange — כוללני + קצה-ריק=פתוח
  final cases = [
    ['2026-08-24', '2026-08-01', '2026-08-31', true],
    ['2026-08-01', '2026-08-01', '2026-08-31', true],
    ['2026-08-31', '2026-08-01', '2026-08-31', true],
    ['2026-07-31', '2026-08-01', '2026-08-31', false],
    ['2026-09-01', '2026-08-01', '2026-08-31', false],
    ['1999-01-01', '', '2026-08-31', true],
    ['2999-01-01', '2026-08-01', '', true],
    ['0000-00-00', '', '', true],
  ];
  for (final c in cases) {
    ok('dateInRange(${c[0]},${c[1]},${c[2]})',
        D.dateInRange(c[0] as String, c[1] as String, c[2] as String) == c[3]);
  }
  ok('dateInRange ריק-כולו', D.dateInRange('', '', '') == true);

  if (fails > 0) {
    print('❌ קופסת-כלי-התאריך (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('date-util dart proof failed');
  }
  print('✓ קופסת-כלי-התאריך (Dart): $n טענות — פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
