// בדיקת-חוזה (רתמת-זהב) · studentHistory — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/student-history.test.mjs.
// שקעי-בדיקה כמוגדר בחוזה: academicYearLabel='YL:'+iso (רושם קריאות) ·
// enrollSummary=(e)⇒{sum:e.id}. השוואת-זהות (===) ⇒ identical; השוואת-מערך = אורך+איבר-איבר (כלל-8).
// הרצה: dart run --enable-asserts new/dart-maor/student-history_test.dart ⇒ exit 0 + OK
import 'student-history.dart';

int _f = 0;
void chk(String name, bool ok) {
  if (!ok) {
    print('✗ $name');
    _f = 1;
  }
}

void main() {
  // שקעי-בדיקה כמוגדר בחוזה (הבדיקה מייבאת רק את האטום שלה)
  final ylCalls = <Object?>[];
  Object? academicYearLabel(Object? iso) {
    ylCalls.add(iso);
    return 'YL:$iso';
  }

  Object? enrollSummary(Map<String, Object?> e) => {'sum': e['id']};

  final c1 = <String, Object?>{'id': 'c1', 'name': 'ציור', 'start': '2025-09-01', 'end': '2026-06-30', 'year': ''};
  final c2 = <String, Object?>{'id': 'c2', 'name': 'נגינה', 'start': '2026-09-01', 'year': 'תשפ"ז'};
  final e1 = <String, Object?>{'id': 'e1', 'memberId': 'm1', 'courseId': 'c1', 'enrolledAt': '2025-08-20', 'renewedToId': 'e2'};
  final e2 = <String, Object?>{'id': 'e2', 'memberId': 'm1', 'courseId': 'c2', 'enrolledAt': '2026-08-01'};
  final e3 = <String, Object?>{'id': 'e3', 'memberId': 'm1', 'courseId': 'ghost', 'enrolledAt': '2024-01-01'};
  final eOther = <String, Object?>{'id': 'e9', 'memberId': 'm2', 'courseId': 'c1', 'enrolledAt': '2025-08-20'};
  final db = <String, Object?>{
    'enrollments': [e1, e2, e3, eOther],
    'courses': [c1, c2],
  };

  final h = studentHistory(db, 'm1', academicYearLabel, enrollSummary);

  // 1. שלוש רשומות של m1, e2 ראשון (מהחדש לישן), e3 (בלי start) אחרון
  chk(
      'דוגמה-1: מיון מהחדש לישן',
      h.length == 3 &&
          identical(h[0]['enrollment'], e2) &&
          identical(h[1]['enrollment'], e1) &&
          identical(h[2]['enrollment'], e3));
  // 2. שם-החוג ותאריכיו נשאבים
  chk(
      'דוגמה-2: שאיבת-חוג',
      h[1]['courseName'] == 'ציור' &&
          h[1]['start'] == '2025-09-01' &&
          h[1]['end'] == '2026-06-30');
  // 3. yearLabel: course.year גובר; אחרת השקע על start
  chk(
      'דוגמה-3: yearLabel',
      h[0]['yearLabel'] == 'תשפ"ז' &&
          h[1]['yearLabel'] == 'YL:2025-09-01' &&
          !ylCalls.contains('2026-09-01'));
  // 4. חוג-רפאים
  chk(
      'דוגמה-4: חוג-רפאים',
      h[2]['courseName'] == '—' &&
          h[2]['start'] == '' &&
          h[2]['end'] == '' &&
          h[2]['yearLabel'] == '');
  // 5. סינון לפי memberId
  chk(
      'דוגמה-5: סינון',
      h.every((r) => (r['enrollment'] as Map)['memberId'] == 'm1') &&
          studentHistory(db, 'm-none', academicYearLabel, enrollSummary).isEmpty);
  // 6. חידושים: e1 חודש קדימה, e2 יעד-חידוש; summary מהשקע
  chk(
      'דוגמה-6: חידושים',
      h[1]['renewedForward'] == true &&
          h[1]['fromRenewal'] == false &&
          h[0]['fromRenewal'] == true &&
          h[0]['renewedForward'] == false &&
          (h[0]['summary'] as Map)['sum'] == 'e2');
  // 7. שובר-שוויון: אותו חוג (אותו start), enrolledAt מאוחר ראשון
  final eA = <String, Object?>{'id': 'eA', 'memberId': 'm3', 'courseId': 'c1', 'enrolledAt': '2025-08-01'};
  final eB = <String, Object?>{'id': 'eB', 'memberId': 'm3', 'courseId': 'c1', 'enrolledAt': '2025-08-15'};
  final h7 = studentHistory(
      <String, Object?>{'enrollments': [eA, eB], 'courses': [c1]},
      'm3',
      academicYearLabel,
      enrollSummary);
  chk(
      'דוגמה-7: שובר-שוויון',
      h7.length == 2 &&
          identical(h7[0]['enrollment'], eB) &&
          identical(h7[1]['enrollment'], eA));

  if (_f != 0) throw StateError('student-history: דוגמאות-חוזה נכשלו');
  print('OK ✓ student-history: 7 דוגמאות-חוזה — ירוק');
}
