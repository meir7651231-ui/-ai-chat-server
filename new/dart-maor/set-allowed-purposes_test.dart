// בדיקת-חוזה (רתמת-זהב) · setAllowedPurposes — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/set-allowed-purposes.test.mjs:
//   1) ['חינוך','רווחה'] ⇒ אותו מערך עצמו (זהות-הפניה, כסדרו)
//   2) []                ⇒ null (מערך-ריק = "אין הגבלה", לא "אסור הכול")
//   3) null              ⇒ null
//   4) undefined         ⇒ null (ב-Dart: null מכסה גם undefined של JS)
//   5) ['_shared_']      ⇒ אותו מערך — הסנטינל עובר כמות-שהוא
// השוואת-מערכים: אורך + איבר-איבר (כלל-8 — לעולם לא join). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/set-allowed-purposes_test.dart ⇒ exit 0
import 'set-allowed-purposes.dart';

// כלל-8: השוואת-מערך = אורך + איבר-איבר.
void _eqList(dynamic got, List<String> want, String label) {
  if (got is! List) {
    throw StateError('FAIL [$label]: הפלט אינו List (got=$got)');
  }
  if (got.length != want.length) {
    throw StateError(
        'FAIL [$label]: אורך ${got.length} != ${want.length}');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError(
          'FAIL [$label]: איבר $i — got=${got[i]} want=${want[i]}');
    }
  }
}

void main() {
  var n = 0;

  // 1) מערך לא-ריק ⇒ הוא-עצמו בזהות-הפניה, כסדרו.
  {
    final p = <String>['חינוך', 'רווחה'];
    final out = setAllowedPurposes(p);
    if (!identical(out, p)) {
      throw StateError('FAIL: מערך לא-ריק חייב לחזור בזהות-הפניה, לא עותק');
    }
    n++;
    _eqList(out, ['חינוך', 'רווחה'], 'סדר-הייעודים');
    n++;
  }

  // 2) מערך-ריק ⇒ null (אין הגבלה — לא "אסור הכול").
  {
    final out = setAllowedPurposes(<String>[]);
    if (out != null) {
      throw StateError('FAIL: מערך-ריק חייב להתנרמל ל-null (got=$out)');
    }
    n++;
  }

  // 3) null ⇒ null.
  {
    final out = setAllowedPurposes(null);
    if (out != null) {
      throw StateError('FAIL: null חייב להישאר null (got=$out)');
    }
    n++;
  }

  // 4) undefined ⇒ null — ב-Dart אין undefined; null מכסה אותו (אותו פלט בדיוק,
  //    כמחויב בדוגמאות 3–4 של החוזה: שני הקלטים ⇒ null).
  {
    final out = setAllowedPurposes(null);
    if (out != null) {
      throw StateError('FAIL: undefined (null ב-Dart) חייב להתנרמל ל-null');
    }
    n++;
  }

  // 5) ערך-הסנטינל _shared_ עובר כמות-שהוא (זהות-הפניה).
  {
    final p = <String>['_shared_'];
    final out = setAllowedPurposes(p);
    if (!identical(out, p)) {
      throw StateError('FAIL: הסנטינל _shared_ חייב לעבור כמות-שהוא');
    }
    n++;
    _eqList(out, ['_shared_'], 'סנטינל _shared_');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(setAllowedPurposes(<String>[]) == null, 'assert-live guard');

  print('OK setAllowedPurposes: $n asserts passed');
}
