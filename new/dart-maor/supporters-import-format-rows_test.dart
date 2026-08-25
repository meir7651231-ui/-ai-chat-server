// בדיקת-חוזה (רתמת-זהב) · supportersImportFormatRows — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/supporters-import-format-rows.test.mjs:
//   1) {supporters:[]}            ⇒ שורה אחת — הכותרת בלבד.
//   2) תורם מלא                   ⇒ 2 שורות; השנייה 7 תאים בסדר name…forWho.
//   3) {supporters:[{name:'כהן'}]} ⇒ שורה-1 באורך 7, תא-0 'כהן', השאר null (undefined של JS).
//   4) [{name:'א'},{name:'ב'}]     ⇒ 3 שורות, סדר-המערך נשמר.
// השוואת-מערכים: אורך + איבר-איבר (חוק-8), לעולם לא join.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/supporters-import-format-rows_test.dart ⇒ exit 0
import 'supporters-import-format-rows.dart';

const List<String> _header = ['שם', 'טלפון', 'אימייל', 'ת"ז', 'כתובת', 'קטגוריה', 'עבור'];

// השוואת-שורה: אורך + איבר-איבר (חוק-8).
void _rowEq(List<dynamic> got, List<dynamic> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: length ${got.length} != ${want.length}');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('FAIL [$label]: cell $i: ${got[i]} != ${want[i]}');
    }
  }
}

void main() {
  var n = 0;

  // 1) ריק ⇒ כותרת בלבד.
  {
    final r = supportersImportFormatRows(<String, dynamic>{'supporters': []});
    if (r.length != 1) throw StateError('FAIL [דוגמה 1]: rows ${r.length} != 1');
    _rowEq(r[0], _header, 'דוגמה 1 · כותרת');
    n++;
  }

  // 2) תורם מלא — 7 תאים בסדר.
  {
    final r = supportersImportFormatRows(<String, dynamic>{
      'supporters': [
        {
          'name': 'לוי',
          'phone': '050-1234567',
          'email': 'a@b.c',
          'idNum': '123456789',
          'address': 'ירושלים',
          'cat': 'VIP',
          'forWho': 'ישיבה',
        },
      ],
    });
    if (r.length != 2) throw StateError('FAIL [דוגמה 2]: rows ${r.length} != 2');
    _rowEq(r[0], _header, 'דוגמה 2 · כותרת');
    _rowEq(
      r[1],
      ['לוי', '050-1234567', 'a@b.c', '123456789', 'ירושלים', 'VIP', 'ישיבה'],
      'דוגמה 2 · שורת-תורם',
    );
    n++;
  }

  // 3) שדה חסר עובר כ-null (undefined של JS), אורך 7 נשמר.
  {
    final r = supportersImportFormatRows(<String, dynamic>{
      'supporters': [
        {'name': 'כהן'},
      ],
    });
    if (r[1].length != 7) throw StateError('FAIL [דוגמה 3]: row len ${r[1].length} != 7');
    _rowEq(r[1], ['כהן', null, null, null, null, null, null], 'דוגמה 3 · null-ים');
    n++;
  }

  // 4) סדר-המערך נשמר.
  {
    final r = supportersImportFormatRows(<String, dynamic>{
      'supporters': [
        {'name': 'א'},
        {'name': 'ב'},
      ],
    });
    if (r.length != 3) throw StateError('FAIL [דוגמה 4]: rows ${r.length} != 3');
    if (r[1][0] != 'א' || r[2][0] != 'ב') {
      throw StateError('FAIL [דוגמה 4]: order ${r[1][0]},${r[2][0]}');
    }
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    supportersImportFormatRows(<String, dynamic>{'supporters': []})[0][3] == 'ת"ז',
    'assert-live guard',
  );

  print('OK supportersImportFormatRows: $n asserts passed');
}
