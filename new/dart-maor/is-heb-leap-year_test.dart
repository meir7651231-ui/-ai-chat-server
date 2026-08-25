// רתמת-זהב · is-heb-leap-year — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות). אם עובר, Dart≡JS.
import 'is-heb-leap-year.dart';

void main() {
  // שקע-דמה נאמן-ללוח: 'Adar I' קיים ⇔ מעוברת לפי מחזור-19 ((7y+1)%19<7) — כמו בדיקת-ה-JS.
  var calls = 0;
  String? hebToIsoEn(int day, String monthEn, int y) {
    calls++;
    return (monthEn == 'Adar I' && (7 * y + 1) % 19 < 7) ? '2024-02-10' : null;
  }

  // 1) שלוש שנים — 5784 מעוברת · 5786 פשוטה · 5787 מעוברת
  assert(isHebLeapYear(5784, hebToIsoEn) == true, '✗ 5784 מעוברת');
  assert(isHebLeapYear(5786, hebToIsoEn) == false, '✗ 5786 פשוטה');
  assert(isHebLeapYear(5787, hebToIsoEn) == true, '✗ 5787 מעוברת');

  // 2) דין-ה-cache — קריאה חוזרת לא מפעילה את השקע מחדש
  final before = calls;
  assert(isHebLeapYear(5784, hebToIsoEn) == true, '✗ 5784 חוזרת');
  assert(calls == before, '✗ cache — השקע נקרא שוב');

  print('✓ is-heb-leap-year (Dart): 3 שנים + דין-ה-cache — ירוק');
}
