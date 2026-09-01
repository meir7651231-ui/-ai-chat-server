import '../dart-data-maor/parse-supporter-grid-sockets.dart' as sk_parse_supporter_grid;
// בדיקת-חוזה (רתמת-זהב) · parseSupporterGrid — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/parse-supporter-grid.test.mjs.
// מימושי-השקע (supNameKeys/parseAnyDate/excelSerialToIso) = ההתנהגות-המוצהרת-בחוזה.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/parse-supporter-grid_test.dart  ⇒ exit 0
import 'parse-supporter-grid.dart';

// שקעים — כמו בבדיקת-ה-JS.
const supNameKeys = ['שם', 'תורם'];
String parseAnyDate(String s) => s == '09/08/26' ? '2026-08-09' : '';
String excelSerialToIso(num n) => n == 45878 ? '2025-08-09' : '';

List<Map<String, dynamic>> run(List<List<Object?>> rows) =>
    parseSupporterGrid(rows, supNameKeys, parseAnyDate, excelSerialToIso, sk_parse_supporter_grid.parseSupporterGrid_T);

// השוואה-עמוקה: מספרים דרך == (3≡3.0), רשימות/מפות איבר-איבר + זהות-מפתחות.
bool deepEq(Object? a, Object? b) {
  if (a is num && b is num) return a == b;
  if (a is String && b is String) return a == b;
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k)) return false;
      if (!deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  return a == b;
}

void main() {
  var n = 0;

  // 1. ריק ⇒ ריק.
  assert(deepEq(run([]), []), 'FAIL 1: ריק');
  n++;

  // 2. כותרות מלאות בשורה-1 — מיפוי לפי הכלה, אין hist.
  assert(
      deepEq(
          run([
            ['שם', 'טלפון', 'אימייל', 'ת"ז', 'כתובת', 'קטגוריה', 'עבור'],
            ['דוד', '050', 'a@b', '123', 'רח 1', 'כללי', 'משה'],
          ]),
          [
            {
              'name': 'דוד',
              'phone': '050',
              'email': 'a@b',
              'idNum': '123',
              'address': 'רח 1',
              'cat': 'כללי',
              'forWho': 'משה'
            }
          ]),
      'FAIL 2: כותרות מלאות');
  n++;

  // 3. בלי כותרות — סדר-עמודות קבוע והשורה הראשונה נקלטת.
  assert(
      deepEq(
          run([
            ['דוד', '050', 'a@b', '1', 'כ', 'ק', 'ע']
          ]),
          [
            {
              'name': 'דוד',
              'phone': '050',
              'email': 'a@b',
              'idNum': '1',
              'address': 'כ',
              'cat': 'ק',
              'forWho': 'ע'
            }
          ]),
      'FAIL 3: בלי כותרות');
  n++;

  // 4. יצוא-סליקה עם שורות-פתיח — כותרת בשורה-3, hist מלא.
  final g4 = run([
    ['יצוא'],
    ['טווח'],
    ['שם', 'סכום', 'תאריך', 'מטבע', 'תשלומים', 'סטטוס', 'אסמכתא'],
    ['דוד', '1,234.567', '09/08/26 00:36', 'דולר', '3', 'שולם', 'REF1'],
  ]);
  assert(g4.length == 1, 'FAIL 4: אורך ${g4.length} ≠ 1');
  n++;
  assert(
      deepEq(g4[0]['hist'], [
        {'d': '2026-08-09', 'a': 1234.57, 'c': '\$', 'ref': 'REF1', 'pays': 3, 'status': 'שולם'}
      ]),
      'FAIL 4: hist=${g4[0]['hist']}');
  n++;
  // מטא שלא קיים — המפתח נעדר.
  assert(!(g4[0]['hist'][0] as Map).containsKey('brand'), "FAIL 4: 'brand' קיים");
  n++;

  // 5. תאריך כמספר-סריאל של Excel ⇒ המרה מסריאל.
  final g5 = run([
    ['שם', 'סכום', 'תאריך'],
    ['שרה', '100', '45878'],
  ]);
  assert(
      deepEq(g5[0]['hist'], [
        {'d': '2025-08-09', 'a': 100}
      ]),
      'FAIL 5: hist=${g5[0]['hist']}');
  n++;

  // 6. עסקה פסולה (סכום 0 / תאריך שבור) ⇒ שורה בלי hist.
  final g6 = run([
    ['שם', 'סכום', 'תאריך'],
    ['דוד', '0', '09/08/26'],
    ['לוי', '50', 'אבג'],
  ]);
  assert(g6.length == 2, 'FAIL 6: אורך ${g6.length} ≠ 2');
  n++;
  assert(!g6[0].containsKey('hist'), "FAIL 6: hist קיים ב-[0]");
  n++;
  assert(!g6[1].containsKey('hist'), "FAIL 6: hist קיים ב-[1]");
  n++;

  // 7. סולק 'נדרים פלוס' ⇒ 'נדרים' · שורה עם שם ריק מדולגת.
  final g7 = run([
    ['שם', 'סכום', 'תאריך', 'סולק'],
    ['דוד', '50', '09/08/26', 'נדרים פלוס'],
    ['', '10', '09/08/26', ''],
  ]);
  assert(g7.length == 1, 'FAIL 7: אורך ${g7.length} ≠ 1');
  n++;
  assert(
      deepEq(g7[0]['hist'], [
        {'d': '2026-08-09', 'a': 50, 'clearer': 'נדרים'}
      ]),
      'FAIL 7: hist=${g7[0]['hist']}');
  n++;

  print('OK parseSupporterGrid: $n asserts passed (7 דוגמאות-חוזה)');
}
