// רתמת-זהב · course-fits-member — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות). אם עובר, Dart≡JS.
import 'course-fits-member.dart';

void main() {
  final yes = (dynamic c, dynamic g) => true;

  // 1) מגדר לא תואם
  assert(
      courseFitsMember({'gender': 'f'}, 'm', null, null, yes) == false,
      '✗ 1 מגדר לא תואם');

  // 2) 'all' פתוח
  assert(
      courseFitsMember({'gender': 'all'}, 'm', null, null, yes) == true,
      "✗ 2 'all' פתוח");

  // 3) מגדר לא ידוע (gender undefined)
  assert(
      courseFitsMember({'gender': 'f'}, null, null, null, yes) == true,
      '✗ 3 מגדר לא ידוע');

  final cAge = {'ageMin': 6, 'ageMax': 12};

  // 4a) גיל 5 מתחת
  assert(courseFitsMember(cAge, 'm', 5, null, yes) == false, '✗ 4a גיל 5 מתחת');
  // 4b) גיל 6 גבול
  assert(courseFitsMember(cAge, 'm', 6, null, yes) == true, '✗ 4b גיל 6 גבול');
  // 4c) גיל 12 גבול
  assert(courseFitsMember(cAge, 'm', 12, null, yes) == true, '✗ 4c גיל 12 גבול');
  // 4d) גיל 13 מעל
  assert(courseFitsMember(cAge, 'm', 13, null, yes) == false, '✗ 4d גיל 13 מעל');

  // 5) גיל null מדלג
  assert(
      courseFitsMember(cAge, 'm', null, null, yes) == true, '✗ 5 גיל null מדלג');

  // 6) כיתה פוסלת (gradeFits ⇒ false)
  assert(
      courseFitsMember({}, 'm', 8, 'ג', (dynamic c, dynamic g) => false) ==
          false,
      '✗ 6 כיתה פוסלת');

  // 7) השקע מקבל (c, grade)
  List<dynamic>? got;
  courseFitsMember({'gradeMin': 'א'}, 'm', 8, 'ג', (dynamic c, dynamic g) {
    got = [c['gradeMin'], g];
    return true;
  });
  assert(got != null && got![0] == 'א' && got![1] == 'ג',
      '✗ 7 השקע מקבל (c,grade)');

  print('✓ course-fits-member (Dart): 7 דוגמאות-חוזה (שקע gradeFits) — ירוק');
}
