// בדיקת-חוזה · supDupFieldValue — 6 דוגמאות-החוזה מהמקור + ratchet חוק-18.
import 'sup-dup-field-value.dart';

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    _f = 1;
    print('✗ $msg');
  }
}

void main() {
  final def = {'key': 'phone', 'get': (dynamic s) => (s?['phone'] ?? '')};
  final AB = [
    {'phone': 'A'},
    {'phone': 'B'}
  ];

  // 1) עריכה גוברת על הכול — גם כש-pick קיים
  ok(supDupFieldValue(AB, def, {'phone': 1}, {'phone': '050-1111111'}) == '050-1111111',
      'edit גובר גם על pick');

  // 2) עריכה ריקה = מחיקה מפורשת (!= null)
  ok(supDupFieldValue(AB, def, {'phone': 1}, {'phone': ''}) == '',
      'מחרוזת ריקה ב-edit גוברת (מחיקה מכוונת)');

  // 3) בחירה מצביעה על רשומה 1
  ok(supDupFieldValue(AB, def, {'phone': 1}, {}) == 'B', 'pick=1 ⇒ B');

  // 4) אינדקס 0 הוא בחירה תקפה (?? ולא ||)
  ok(supDupFieldValue(AB, def, {'phone': 0}, {}) == 'A', 'pick=0 ⇒ A');

  // 5) בלי pick ⇒ הראשונה עם ערך
  ok(
      supDupFieldValue([
            {'phone': ''},
            {'phone': 'C'}
          ], def, {}, {}) ==
          'C',
      'בלי pick ⇒ הרשומה הראשונה שיש לה ערך');

  // 6) אף אחת בלי ערך ⇒ נופל ל-sups[0] (findIndex=-1 ⇒ 0)
  ok(supDupFieldValue([{}, {}], def, {}, {}) == '', 'אף ערך ⇒ sups[0] ⇒ ריק');

  // ratchet חוק-18: pick עם U+0085 (NEL) אחרי הספרה — ב-JS Number('1')=NaN
  // ⇒ idx>=0 שקר ⇒ נפילה לאינדקס 0 (A). Dart tryParse היה גוזם NEL ומחזיר 1 (B).
  ok(supDupFieldValue(AB, def, {'phone': '1'}, {}) == 'A',
      'pick="1\\u0085" ⇒ NaN ⇒ אינדקס-0 ⇒ A (חוק-18)');

  // ratchet: pick כמחרוזת-אינדקס-קנונית "1" ⇒ B (sups["1"]≡sups[1])
  ok(supDupFieldValue(AB, def, {'phone': '1'}, {}) == 'B', 'pick="1" ⇒ B');

  if (_f != 0) {
    throw StateError('בדיקות נכשלו');
  }
  print('✓ sup-dup-field-value: 6 דוגמאות-חוזה + 2 ratchet — ירוק');
}
