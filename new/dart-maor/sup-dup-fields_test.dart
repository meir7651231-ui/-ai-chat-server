// בדיקת-חוזה (רתמת-זהב) · supDupFields — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת את בדיקת-ה-JS new/atoms/sup-dup-fields.test.mjs: צילום-ערך —
// ‏JSON.stringify(SUP_DUP_FIELDS) (הפונקציות נשמטות ⇒ נשארים key/label בלבד)
// מושווה לצילום ביט-אחר-ביט. כאן: השוואת-מערך = אורך + איבר-איבר (כלל-8)
// וגם ‏jsonEncode מלא מול מחרוזת-הצילום המקורית.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/sup-dup-fields_test.dart  ⇒ exit 0
import '../dart-data-maor/sup-dup-fields-sockets.dart' as sk_sdf;
import 'dart:convert' show jsonEncode;

import 'sup-dup-fields.dart';

final List<SupDupField> supDupFields = makeSupDupFields(sk_sdf.supDupFields_T);

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ $msg');
    _f = 1;
  }
}

void main() {
  // הצילום מהבדיקה-המקורית (JSON.stringify משמיט את get): זוגות key/label בסדר-המקור.
  const snap = <List<String>>[
    ['name', 'שם'],
    ['phone', 'טלפון'],
    ['email', 'אימייל'],
    ['idNum', 'ת"ז'],
    ['city', 'עיר'],
    ['address', 'כתובת'],
    ['cat', 'קטגוריה'],
    ['forWho', 'ייעוד'],
    ['notes', 'הערות'],
  ];

  // 1) אורך (כלל-8: קודם אורך).
  ok(supDupFields.length == snap.length,
      'אורך ${supDupFields.length} ≠ ${snap.length}');

  // 2) איבר-איבר (כלל-8): key+label זהים לצילום, באותו סדר.
  for (var i = 0; i < snap.length && i < supDupFields.length; i++) {
    ok(supDupFields[i].key == snap[i][0],
        'שדה $i: key ${supDupFields[i].key} ≠ ${snap[i][0]}');
    ok(supDupFields[i].label == snap[i][1],
        'שדה $i: label ${supDupFields[i].label} ≠ ${snap[i][1]}');
  }

  // 3) צילום-JSON מלא ביט-אחר-ביט — שקול ל-JSON.stringify של הבדיקה-המקורית
  //    (‏jsonEncode ו-JSON.stringify: אותם escaping ל-`"` ואפס-רווחים; עברית לא-מקודדת).
  const snapJson =
      '[{"key":"name","label":"שם"},{"key":"phone","label":"טלפון"},'
      '{"key":"email","label":"אימייל"},{"key":"idNum","label":"ת\\"ז"},'
      '{"key":"city","label":"עיר"},{"key":"address","label":"כתובת"},'
      '{"key":"cat","label":"קטגוריה"},{"key":"forWho","label":"ייעוד"},'
      '{"key":"notes","label":"הערות"}]';
  final encoded = jsonEncode(
      supDupFields.map((d) => {'key': d.key, 'label': d.label}).toList());
  ok(encoded == snapJson, 'צילום-JSON סטה: $encoded');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל, ומאמת את ה-get-ים
  // (סמנטיקת `s.x || ''` — ערך-קיים, מפתח-חסר, ריק/אפס-falsy):
  assert(supDupFields[0].get({'name': 'כהן'}) == 'כהן', 'get name ערך-קיים');
  assert(supDupFields[1].get(<String, dynamic>{}) == '', 'get phone מפתח-חסר ⇒ ריק');
  assert(supDupFields[8].get({'notes': ''}) == '', 'get notes ריק ⇒ ריק');

  if (_f != 0) throw StateError('sup-dup-fields: צילום-הערך סטה');
  // ignore: avoid_print
  print('OK ✓ sup-dup-fields: צילום-ערך תואם — ירוק');
}
