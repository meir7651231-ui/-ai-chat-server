import '../dart-data-maor/families-import-format-rows-terms.dart';
// בדיקת-חוזה (רתמת-זהב) · familiesImportFormatRows — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/families-import-format-rows.test.mjs
// (אותם קלטים→פלטים; ערכי-JS הומרו למפות-Dart):
//   1) {families:[]}                        ⇒ [HDR]  (13 תאים)
//   2) משפחה מלאה 'נשוי'                     ⇒ עמודת-אלמן ריקה
//   3) 'אלמן ל"ע'⇒'אלמן' · 'אלמנה'(נ רגילה)⇒''
//   4) {} (חסר-סטטוס)                        ⇒ '' בלי קריסה
//   5) שתי משפחות                            ⇒ 3 שורות, סדר-מקור
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/families-import-format-rows_test.dart ⇒ exit 0
import 'families-import-format-rows.dart';

const hdr = [
  'שם', 'ת"ז אב', 'טלפון', 'שם האם', 'ת"ז אם', 'טלפון 2',
  'עיר', 'כתובת', '', 'אלמן', 'קהילה', '', 'הערות',
];

// השוואת-שורה עמוקה — null≡null (מקביל ל-undefined ב-JSON.stringify של המקור).
String _enc(dynamic v) {
  if (v == null) return '∅';
  if (v is List) return '[${v.map(_enc).join(',')}]';
  return v.toString();
}

void _eq(dynamic got, dynamic want, String label) {
  final g = _enc(got);
  final w = _enc(want);
  if (g != w) {
    throw StateError('FAIL [$label]:\n got =$g\n want=$w');
  }
}

void main() {
  var n = 0;

  // 1) ריק ⇒ כותרת בלבד, 13 תאים.
  final r1 = familiesImportFormatRows({'families': []}, term: (k)=>kTerms[k]!);
  _eq(r1, [hdr], 'כותרת שגויה');
  n++;
  if ((r1[0]).length != 13) throw StateError('FAIL: הכותרת אינה בת 13 תאים');
  n++;

  // 2) משפחה מלאה, 'נשוי' ⇒ עמודת-אלמן ריקה.
  final fam2 = {
    'name': 'כהן', 'fatherId': '123', 'phone': '050', 'mother': 'רחל',
    'motherId': '456', 'phone2': '052', 'city': 'צפת', 'address': 'הר',
    'maritalStatus': 'נשוי', 'community': 'חסידי', 'notes': 'הערה',
  };
  _eq(
    familiesImportFormatRows({'families': [fam2]}, term: (k)=>kTerms[k]!)[1],
    ['כהן', '123', '050', 'רחל', '456', '052', 'צפת', 'הר', '', '', 'חסידי', '', 'הערה'],
    'שורת-משפחה שגויה',
  );
  n++;

  // 3) הכלה: 'אלמן ל"ע' ⇒ 'אלמן'; 'אלמנה' (נו"ן רגילה) ⇒ '' — כלשון-המקור.
  _eq(
    familiesImportFormatRows({'families': [{'maritalStatus': 'אלמן ל"ע'}]}, term: (k)=>kTerms[k]!)[1][9],
    'אלמן',
    'הכלת-אלמן לא זוהתה',
  );
  n++;
  _eq(
    familiesImportFormatRows({'families': [{'maritalStatus': 'אלמנה'}]}, term: (k)=>kTerms[k]!)[1][9],
    '',
    'אלמנה נתפסה בטעות (נו"ן סופית)',
  );
  n++;

  // 4) maritalStatus חסר ⇒ '' בלי קריסה.
  _eq(
    familiesImportFormatRows({'families': [<String, dynamic>{}]}, term: (k)=>kTerms[k]!)[1][9],
    '',
    'חסר-סטטוס קרס/שגוי',
  );
  n++;

  // 5) שתי משפחות ⇒ 3 שורות, סדר-המקור.
  final r5 = familiesImportFormatRows({'families': [{'name': 'א'}, {'name': 'ב'}]}, term: (k)=>kTerms[k]!);
  if (r5.length != 3 || r5[1][0] != 'א' || r5[2][0] != 'ב') {
    throw StateError('FAIL: סדר/מספר שורות שגוי');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    familiesImportFormatRows({'families': [{'maritalStatus': 'אלמן ל"ע'}]}, term: (k)=>kTerms[k]!)[1][9] == 'אלמן',
    'assert-live guard',
  );

  print('OK familiesImportFormatRows: $n asserts passed');
}
