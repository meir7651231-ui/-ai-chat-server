import 'fresh-next-year-enrollment.dart';

/// רתמת-זהב: אותן 5 דוגמאות-חוזה (11 בדיקות) בדיוק מ-
/// new/atoms/fresh-next-year-enrollment.test.mjs. אם עובר — Dart≡JS.
void main() {
  final src = <String, Object?>{
    'id': 'e1', 'memberId': 'm1', 'courseId': 'c1', 'plan': 'card',
    'purchased': 10, 'used': 7, 'group': 'g1',
    'absences': [
      {'date': '2026-01-05'}
    ],
    'payments': [
      {'ils': 100}
    ],
    'totalDue': 1200, 'dueDate': '2026-06-01', 'status': 'ended',
    'note': 'ותיקה', 'enrolledAt': '2025-09-01', 'freq': 2, 'tier': 'מדרגה-ב',
  };
  final out = freshNextYearEnrollment(src, 'c9', 'e77', '2026-09-01');

  // 1) איפוס-היסטוריה + שימור-ליבה
  assert(out['purchased'] == 0 && out['used'] == 0, 'purchased/used לא אופסו');
  assert((out['absences'] as List).isEmpty && (out['payments'] as List).isEmpty,
      'absences/payments לא אופסו');
  assert(out['dueDate'] == '' && out['status'] == 'active' && out['note'] == '',
      'dueDate/status/note לא אופסו');
  assert(out['memberId'] == 'm1' && out['plan'] == 'card' && out['totalDue'] == 1200,
      'ליבה לא נשמרה');
  // 2) יעד/מזהה/תאריך מוזרקים
  assert(out['courseId'] == 'c9' && out['id'] == 'e77' && out['enrolledAt'] == '2026-09-01',
      'הזרקות שגויות');
  // 3) קבוצה — ברירת-מחדל אשתקד, ודריסה
  assert(out['group'] == 'g1', 'group ברירת-מחדל ≠ אשתקד');
  assert(
      freshNextYearEnrollment(src, 'c9', 'e78', '2026-09-01', 'g2')['group'] == 'g2',
      'groupOverride לא דרס');
  // 4) תמחור אופציונלי — קיים מועתק, חסר לא-קיים
  assert(out['freq'] == 2 && out['tier'] == 'מדרגה-ב', 'freq/tier לא הועתקו');
  assert(
      !out.containsKey('termMonths') &&
          !out.containsKey('term') &&
          !out.containsKey('freqUnit'),
      'מפתח-תמחור חסר נוצר בטעות');
  // 5) המקור קדוש
  assert(
      src['used'] == 7 &&
          (src['absences'] as List).length == 1 &&
          src['status'] == 'ended',
      'המקור השתנה');

  print('✓ fresh-next-year-enrollment: 5 דוגמאות-חוזה (11 בדיקות) — ירוק');
}
