// רתמת-זהב · term-label — assert-ים = 6 דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// שקע-terms מקומי לבדיקה (מוסכמת-המרה: אובייקט-JS ⇒ Map).
import 'term-label.dart';

void _eq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  final terms = [
    {'v': 'once', 't': 'חד-פעמי'},
    {'v': 'monthly', 't': 'חודשי'},
    {'v': 'year', 't': 'שנתי'},
  ];

  // 1) תווית מהרשימה
  _eq(termLabel('monthly', null, terms), 'חודשי', 'תווית-חודשי שגויה');

  // 2) months לא משפיע כש-term אינו 'months'
  _eq(termLabel('year', 5, terms), 'שנתי', 'months השפיע שלא-כדין');

  // 3) 'months' עם מספר
  _eq(termLabel('months', 3, terms), '3 חודשים', 'מספר-חודשים שגוי');

  // 4) 'months' בלי מספר ⇒ 1
  _eq(termLabel('months', null, terms), '1 חודשים', 'חסר לא נפל ל-1');

  // 5) 'months' עם אפס ⇒ 1
  _eq(termLabel('months', 0, terms), '1 חודשים', 'אפס לא נפל ל-1');

  // 6) term לא-מוכר ⇒ ''
  _eq(termLabel('daily', null, terms), '', 'לא-מוכר לא החזיר ריק');

  print('OK');
}
