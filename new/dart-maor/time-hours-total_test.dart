// בדיקת-חוזה + ratchet-הסגר ל-time-hours-total.dart.
// הרצה: dart run --enable-asserts time-hours-total_test.dart
import 'time-hours-total.dart';

void _eq(num got, num want, String msg) {
  if (got != want) {
    throw StateError('✗ $msg: got=$got ≠ want=$want');
  }
}

void main() {
  // 6 דוגמאות-החוזה (זהות ל-time-hours-total.test.mjs)
  _eq(timeHoursTotal({'time': [{'hours': 2}, {'hours': 3.5}]}), 5.5, 'סכום');
  _eq(timeHoursTotal({'time': []}), 0, 'ריק');
  _eq(timeHoursTotal({}), 0, 'time-חסר');
  _eq(timeHoursTotal({'time': [{'hours': '4'}]}), 4, 'מחרוזת-מספרית');
  _eq(timeHoursTotal({'time': [{'hours': 'שבור'}, {'hours': 1}]}), 1, 'זבל+מספר');
  _eq(timeHoursTotal({'time': [{}]}), 0, 'hours-חסר');

  // ratchet-הסגר (חוק-18): NEL/רווח-יוניקוד לפני ספרה — JS `+v`=NaN⇒0,
  // בעוד num.tryParse היה גוזם ומחזיר 4. חייב 0.
  _eq(timeHoursTotal({'time': [{'hours': '4'}]}), 0, 'NEL-לפני-ספרה');
  _eq(timeHoursTotal({'time': [{'hours': '᠎5'}]}), 0, 'MongolianVowelSep');
  // רווח-ES רגיל כן נגזם ⇒ נספר (Number(' 4 ')===4)
  _eq(timeHoursTotal({'time': [{'hours': ' 4 '}]}), 4, 'רווח-ES-נגזם');
  // אפס/NaN דרך ||0
  _eq(timeHoursTotal({'time': [{'hours': 0}, {'hours': ''}]}), 0, 'אפס+ריק');
  // time לא-List ⇒ 0
  _eq(timeHoursTotal({'time': 'nope'}), 0, 'time-לא-List');

  print('✓ time-hours-total.dart: 11 בדיקות — ירוק');
}
