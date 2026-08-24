// בדיקת-חוזה (רתמת-זהב) · holidayNames — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/holiday-names.test.mjs:
//   1 ריק · 2 דדופ · 3 ‏400-קריאות · 4 סדר-הופעה (עוגן 2026-01-01) · 5 ‏12-חודשים.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/holiday-names_test.dart  ⇒ exit 0
import 'holiday-names.dart';

void _eqList(List<String> got, List<String> want, String label) {
  var ok = got.length == want.length;
  if (ok) {
    for (var i = 0; i < got.length; i++) {
      if (got[i] != want[i]) {
        ok = false;
        break;
      }
    }
  }
  if (!ok) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

// iso — שיקוף של ה-iso בבדיקת-ה-JS: getMonth()+1 ⇒ d.month (Dart 1-מבוסס), ריפוד-2.
String _iso(DateTime d) {
  final m = d.month.toString().padLeft(2, '0');
  final day = d.day.toString().padLeft(2, '0');
  return '${d.year}-$m-$day';
}

void main() {
  var n = 0;

  // 1. אין חגים ⇒ []
  _eqList(holidayNames((d) => null), <String>[], '1 ריק');
  n++;

  // 2. דדופ — אותו שם 400 פעם ⇒ פעם אחת
  _eqList(holidayNames((d) => 'חנוכה'), ['חנוכה'], '2 דדופ');
  n++;

  // 3. בדיוק 400 קריאות
  var calls = 0;
  holidayNames((d) {
    calls++;
    return null;
  });
  if (calls != 400) {
    throw StateError('FAIL [3 400-קריאות]: got=$calls want=400');
  }
  n++;

  // 4. סדר-הופעה, העוגן הוא 2026-01-01
  _eqList(
    holidayNames((d) => _iso(d) == '2026-01-01'
        ? 'א'
        : _iso(d) == '2026-03-03'
            ? 'ב'
            : null),
    ['א', 'ב'],
    '4 סדר-הופעה',
  );
  n++;

  // 5. ‏12 חודשים בסדר ינו→דצמ (400 יום מכסים את כל 2026)
  final mm = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];
  _eqList(holidayNames((d) => mm[d.month - 1]), mm, '5 ‏12-חודשים');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(holidayNames((d) => 'חנוכה').length == 1, 'assert-live guard');

  print('OK holidayNames: $n asserts passed');
}
