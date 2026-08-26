// בדיקת-חוזה ל-sheetRoster — 5 דוגמאות-המקור (sheet-roster.test.mjs) + רגרסיית-ההסגר
// (כלל-2: courseId חסר מול null). הרצה: dart run --enable-asserts sheet-roster_test.dart
import 'sheet-roster.dart';

void main() {
  // 1) active+frozen נכנסים; ended+wait בחוץ
  {
    final list = [
      {'courseId': 'c1', 'status': 'active'},
      {'courseId': 'c1', 'status': 'frozen'},
      {'courseId': 'c1', 'status': 'ended'},
      {'courseId': 'c1', 'status': 'wait'},
    ];
    final out = sheetRoster(list, 'c1');
    assert(out.length == 2, 'חייבים בדיוק 2 — פעיל+מוקפא (בפועל: ${out.length})');
    assert(out[0]['status'] == 'active' && out[1]['status'] == 'frozen',
        'ended/wait אסור שייכנסו לגיליון');
  }
  // 2) חוג אחר מסונן
  {
    assert(
        sheetRoster([
          {'courseId': 'c2', 'status': 'active'}
        ], 'c1').length ==
            0,
        'שיבוץ של חוג אחר דלף לגיליון');
  }
  // 3) סטטוס חסר נכלל (שיבוץ-עבר)
  {
    final e = {'courseId': 'c1'};
    final out = sheetRoster([e], 'c1');
    assert(out.length == 1 && identical(out[0], e),
        'שיבוץ בלי status חייב להיכלל — פעיל');
  }
  // 4) מערך ריק ⇒ [] חדש
  {
    final out = sheetRoster([], 'c1');
    assert(out.isEmpty, 'מערך ריק חייב להחזיר []');
  }
  // 5) סדר נשמר + זהות-הפניה
  {
    final a = {'courseId': 'c1', 'status': 'active'};
    final b = {'courseId': 'c2', 'status': 'active'};
    final c = {'courseId': 'c1', 'status': 'frozen'};
    final out = sheetRoster([a, b, c], 'c1');
    assert(out.length == 2 && identical(out[0], a) && identical(out[1], c),
        'הסדר המקורי והאיברים-עצמם חייבים להישמר');
  }
  // 6) רגרסיית-הסגר · courseId חסר מול null (כלל-2):
  //    JS: e.courseId === null אמת רק על מפתח-קיים-בערך-null. שורה-חסרת-מפתח בחוץ.
  {
    final missing = {'n': 1};
    final nullCourse = {'courseId': null};
    final out = sheetRoster([missing, nullCourse], null);
    assert(out.length == 1 && identical(out[0], nullCourse),
        'courseId=null: מפתח-חסר חייב להיות מוחרג; רק ערך-null נכלל (בפועל: ${out.length})');
  }

  print('✓ sheet-roster (Dart): 6 בדיקות — ירוק (5 חוזה + רגרסיית-כלל-2)');
}
