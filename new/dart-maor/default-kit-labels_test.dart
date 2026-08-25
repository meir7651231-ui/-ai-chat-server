// בדיקת-חוזה (רתמת-זהב) · DEFAULT_KIT_LABELS — מייבאת אך ורק את האטום-שלה (חוק-4).
// הצילום זהה ביט-אחר-ביט למקור-ה-JS new/atoms/default-kit-labels.test.mjs:
//   JSON.stringify(DEFAULT_KIT_LABELS) === '["הטמעת התוצר בסביבת-הלקוח","בדיקת-קבלה מול
//   הלקוח","מסירת חומרי-הדרכה","גיבוי + הרשאות-גישה","חתימת-מסירה"]'
// אותם 5 איברים, אותו סדר. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/default-kit-labels_test.dart  ⇒ exit 0
import 'default-kit-labels.dart';

void _eq(List<String> got, List<String> want, String label) {
  final g = got.join('|');
  final w = want.join('|');
  if (g != w) {
    throw StateError('FAIL [$label]:\n got =[$g]\n want=[$w]');
  }
}

void main() {
  var n = 0;

  // הצילום המלא — חמשת האיברים בסדר-המקור.
  const want = [
    'הטמעת התוצר בסביבת-הלקוח',
    'בדיקת-קבלה מול הלקוח',
    'מסירת חומרי-הדרכה',
    'גיבוי + הרשאות-גישה',
    'חתימת-מסירה',
  ];
  _eq(defaultKitLabels, want, 'צילום-ערך מלא');
  n++;

  // אורך — בדיוק 5.
  if (defaultKitLabels.length != 5) {
    throw StateError('FAIL: אורך=${defaultKitLabels.length}, צפוי 5');
  }
  n++;

  // איבר-איבר (מבחין גבול-איבר, לא רק join — עקרון-המוטציה).
  if (defaultKitLabels[0] != 'הטמעת התוצר בסביבת-הלקוח') {
    throw StateError('FAIL: איבר 0');
  }
  n++;
  if (defaultKitLabels[3] != 'גיבוי + הרשאות-גישה') {
    throw StateError('FAIL: איבר 3 (עם +)');
  }
  n++;
  if (defaultKitLabels[4] != 'חתימת-מסירה') {
    throw StateError('FAIL: איבר 4');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    defaultKitLabels.join('|') ==
        'הטמעת התוצר בסביבת-הלקוח|בדיקת-קבלה מול הלקוח|מסירת חומרי-הדרכה|'
            'גיבוי + הרשאות-גישה|חתימת-מסירה',
    'assert-live guard',
  );

  print('OK DEFAULT_KIT_LABELS: $n asserts passed');
}
