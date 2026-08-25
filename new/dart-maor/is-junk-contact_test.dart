// רתמת-זהב · is-junk-contact — בדיוק 6 דוגמאות-החוזה של is-junk-contact.test.mjs.
// עובר ⇒ Dart ≡ JS. הרצה: dart run --enable-asserts is-junk-contact_test.dart
import 'is-junk-contact.dart';

// שקע-digitsOnly זהה למקור-הבדיקה: (s||'').replace(/\D/g,'').
String _dig(dynamic s) => (s == null ? '' : s.toString()).replaceAll(RegExp(r'\D'), '');

void main() {
  // 1. בלי שם ⇒ זבל (גם עם טלפון אמיתי)
  assert(isJunkContact({
        'fullName': '',
        'phones': [
          {'value': '03-6123456'}
        ],
        'emails': []
      }, _dig) ==
      true);

  // 2. שם רווחים-בלבד (trim) ⇒ זבל
  assert(isJunkContact({'fullName': '   ', 'phones': [], 'emails': []}, _dig) == true);

  // 3. טלפון 3 ספרות בלבד ואין מייל ⇒ זבל
  assert(isJunkContact({
        'fullName': 'מוקד חירום',
        'phones': [
          {'value': '100'}
        ],
        'emails': []
      }, _dig) ==
      true);

  // 4. טלפון אמיתי (10 ספרות ≥ 5) ⇒ נשמר
  assert(isJunkContact({
        'fullName': 'ישראל כהן',
        'phones': [
          {'value': '050-1234567'}
        ],
        'emails': []
      }, _dig) ==
      false);

  // 5. אין טלפון אך יש מייל ⇒ נשמר
  assert(isJunkContact({
        'fullName': 'דנה לוי',
        'phones': [],
        'emails': ['dana@x.co.il']
      }, _dig) ==
      false);

  // 6. digitsOnry ⇒ '12345' = בדיוק 5 ספרות (סף >=5 עובר) ⇒ נשמר
  assert(isJunkContact({
        'fullName': 'קו קצר',
        'phones': [
          {'value': '1-23-45'}
        ],
        'emails': []
      }, _dig) ==
      false);

  print('✓ is-junk-contact (Dart): 6 דוגמאות-חוזה — ירוק');
}
