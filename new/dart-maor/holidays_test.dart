// בדיקת-חוזה (רתמת-זהב) · holidays — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/holidays.test.mjs:
//   1 יום-כיפור · 2 פורים בשני האדרים · 3 חנוכה 8 רשומות · 4 ג-טבת לא במפה
//   (undefined→null) · 5 בדיוק 33 מפתחות · 6 פורים-קטן.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/holidays_test.dart  ⇒ exit 0
import 'holidays.dart';

void main() {
  var n = 0;

  // 1. יום כיפור
  assert(HOLIDAYS['Tishri 10'] == 'יום כיפור', '1 יום-כיפור');
  n++;

  // 2. פורים בשני האדרים
  assert(HOLIDAYS['Adar 14'] == 'פורים' && HOLIDAYS['Adar II 14'] == 'פורים',
      '2 פורים בשני האדרים');
  n++;

  // 3. חנוכה — 8 רשומות
  const hanuka = [
    'Kislev 25',
    'Kislev 26',
    'Kislev 27',
    'Kislev 28',
    'Kislev 29',
    'Kislev 30',
    'Tevet 1',
    'Tevet 2',
  ];
  assert(hanuka.every((k) => HOLIDAYS[k] == 'חנוכה'), '3 חנוכה 8 רשומות');
  n++;

  // 4. ג' טבת לא במפה — JS undefined ⇔ Dart null (מפתח-חסר)
  assert(HOLIDAYS['Tevet 3'] == null, '4 ג-טבת לא במפה');
  n++;

  // 5. בדיוק 33 מפתחות
  assert(HOLIDAYS.length == 33, '5 בדיוק 33 מפתחות');
  n++;

  // 6. פורים-קטן
  assert(HOLIDAYS['Adar I 14'] == 'פורים קטן', '6 פורים-קטן');
  n++;

  print('OK holidays: $n asserts passed');
}
