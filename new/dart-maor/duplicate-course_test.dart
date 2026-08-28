import '../dart-data-maor/duplicate-course-terms.dart' as td_duplicate_course;
// בדיקת-חוזה (רתמת-זהב) · duplicateCourse — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/duplicate-course.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/duplicate-course_test.dart ⇒ exit 0
import 'duplicate-course.dart';

int _f = 0;

void _ok(bool cond, String msg) {
  if (!cond) {
    _f = 1;
    print('✗ $msg');
  }
}

void main() {
  final c = <String, dynamic>{
    'id': 'c1',
    'name': 'ציור',
    'start': '2026-01-01',
    'end': '2026-06-30',
    'roomId': 'r9',
    'price': 120,
  };
  final d = duplicateCourse(
      c, 'c2', {'start': '2026-09-01', 'end': '2027-01-31'}, term: (k)=>td_duplicate_course.kTerms[k]!);

  _ok(d['id'] == 'c2', "id ⇒ 'c2'");
  _ok(d['name'] == 'ציור (עותק)', "name ⇒ 'ציור (עותק)'");
  _ok(d['start'] == '2026-09-01' && d['end'] == '2027-01-31', 'תאריכים חדשים');
  _ok(d['roomId'] == 'r9' && d['price'] == 120, 'שדות-אחרים נשמרים');
  _ok(c['id'] == 'c1' && c['name'] == 'ציור' && c['start'] == '2026-01-01',
      'המקור לא השתנה (טהור)');
  _ok(
      duplicateCourse(d, 'c3', {'start': '2027-02-01', 'end': '2027-06-30'}, term: (k)=>td_duplicate_course.kTerms[k]!)[
              'name'] ==
          'ציור (עותק) (עותק)',
      'שכפול-של-עותק מסומן פעמיים');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_f == 0, 'duplicate-course contract examples must be green');

  if (_f != 0) {
    throw StateError('duplicate-course: דוגמאות-חוזה נכשלו');
  }
  print('✓ duplicate-course: 6 דוגמאות-חוזה — ירוק');
}
