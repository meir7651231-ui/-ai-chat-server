// בדיקת-חוזה (רתמת-זהב) · validateHebMonthNames — מייבאת אך ורק את האטום-שלה.
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS
// new/atoms/validate-heb-month-names.test.mjs (5 דוגמאות). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/validate-heb-month-names_test.dart ⇒ exit 0
import 'validate-heb-month-names.dart';

// השוואת-מערך = אורך + איבר-איבר (חוק-8 — לעולם לא join).
void _eqList(List<Object?> got, List<Object?> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: length ${got.length} != ${want.length} ⇒ $got');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('FAIL [$label]: [$i] "${got[i]}" != "${want[i]}"');
    }
  }
}

final Set<Object?> _known = <Object?>{
  'Tishri', 'Heshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar',
  'Adar I', 'Adar II', 'Nisan', 'Iyar', 'Sivan', 'Tamuz', 'Av', 'Elul',
};

void main() {
  var n = 0;

  // 1) כל החודשים מוכרים ⇒ []
  _eqList(
    validateHebMonthNames(
      5786,
      (d) => {'year': 5786, 'month': 'Tishri', 'day': 1},
      _known,
    ),
    <Object?>[],
    'דוגמה 1: תקין',
  );
  n++;

  // 2) איות-CLDR זר — מדווח פעם אחת (דדופ) למרות 440 הופעות
  _eqList(
    validateHebMonthNames(
      5786,
      (d) => {'year': 5786, 'month': 'Tishrei', 'day': 1},
      _known,
    ),
    <Object?>['Tishrei'],
    'דוגמה 2: דדופ',
  );
  n++;

  // 3) ימים של שנה עברית אחרת מדולגים
  {
    var i = 0;
    Map<String, Object?> hebParts(DateTime d) => i++ < 100
        ? {'year': 5785, 'month': 'Weird', 'day': 1}
        : {'year': 5786, 'month': 'Elul', 'day': 1};
    _eqList(validateHebMonthNames(5786, hebParts, _known), <Object?>[],
        'דוגמה 3: שנה אחרת מדולגת');
  }
  n++;

  // 4) עוגן-הסריקה: קריאה ראשונה = Date(2025,7,1,12) של JS — כלומר
  //    DateTime(2025, 8, 1, 12) ב-Dart (חודש-JS ‏0-based) — ובסך-הכול 440 קריאות.
  {
    final dates = <DateTime>[];
    validateHebMonthNames(5786, (d) {
      dates.add(d);
      return {'year': 5786, 'month': 'Av', 'day': 1};
    }, _known);
    if (dates.length != 440) {
      throw StateError('FAIL [דוגמה 4]: ${dates.length} קריאות במקום 440');
    }
    final d0 = dates[0];
    if (d0.year != 2025 || d0.month != 8 || d0.day != 1 || d0.hour != 12) {
      throw StateError('FAIL [דוגמה 4]: עוגן שגוי ⇒ $d0');
    }
  }
  n++;

  // 5) סדר-הופעה נשמר
  {
    var i = 0;
    const seq = <String>['Foo', 'Bar'];
    Map<String, Object?> hebParts(DateTime d) {
      final m = i < seq.length ? seq[i] : 'Nisan';
      return {'year': 5786, 'month': m, 'day': 1 + i++};
    }

    _eqList(validateHebMonthNames(5786, hebParts, _known),
        <Object?>['Foo', 'Bar'], 'דוגמה 5: סדר-הופעה');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      validateHebMonthNames(
              5786, (d) => {'year': 5786, 'month': 'Tishri', 'day': 1}, _known)
          .isEmpty,
      'assert-live guard');

  print('OK validateHebMonthNames: $n asserts passed');
}
