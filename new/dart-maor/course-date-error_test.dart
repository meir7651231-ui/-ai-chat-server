// רתמת-זהב · course-date-error — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// שקע termOf מקומי לבדיקה (3 ארגומנטים כמו במקור; undefined⇒null).
import 'course-date-error.dart';

void main() {
  // termHeb של ה-JS מתעלם מהארגומנטים ומחזיר 'שיעור'.
  String termHeb(Object c, String k, String d) => 'שיעור';

  // 1 — הפוך, בלי config
  assert(
      courseDateError('2026-09-01', '2026-08-01', null, termHeb) ==
          'תאריך הסיום מוקדם מתאריך ההתחלה — החוג לא יופיע בלוח. תקנו את התאריכים',
      '✗ 1 הפוך בלי config');

  // 2 — הפוך עם config ומונח מותאם
  assert(
      (courseDateError('2026-09-01', '2026-08-01',
                  <String, Object>{'terms': <String, Object>{}}, termHeb) ??
              '')
          .contains('— השיעור לא'),
      '✗ 2 מונח מותאם');

  // 3–6 — תקין/שווה/חסר ⇒ null
  assert(courseDateError('2026-08-01', '2026-09-01', null, termHeb) == null,
      '✗ 3 טווח תקין');
  assert(courseDateError('2026-08-01', '2026-08-01', null, termHeb) == null,
      '✗ 4 שווים');
  assert(courseDateError('', '2026-08-01', null, termHeb) == null,
      '✗ 5 start ריק');
  assert(courseDateError('2026-09-01', '', null, termHeb) == null,
      '✗ 6 end ריק');

  // 7 — בלי config השקע termOf לא נקרא
  var called = 0;
  courseDateError('2026-09-01', '2026-08-01', null, (c, k, d) {
    called++;
    return 'X';
  });
  assert(called == 0, '✗ 7 termOf לא נקרא בלי config');

  print('✓ course-date-error (Dart): 7 דוגמאות-חוזה (שקע termOf) — ירוק');
}
