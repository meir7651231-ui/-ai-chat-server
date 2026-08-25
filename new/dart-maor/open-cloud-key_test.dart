// בדיקת-חוזה (רתמת-זהב) · openCloudKey — מייבאת אך ורק את האטום-שלה (חוק-4).
// שלוש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/open-cloud-key.test.mjs:
//   1) שקע-מרגל שמחזיר זקיף S ⇒ openCloudKey({iter:1000},'סוד','pass',spy)===S,
//      והמרגל נקרא פעם-אחת עם בדיוק ({iter:1000},'סוד','pass') — אותן רפרנסים.
//   2) via='rec' מועבר כלשונו: המרגל מקבל 'rec'.
//   3) שקע שמחזיר Future.value(null) ⇒ הפלט (אחרי await) === null (סוד-שגוי מחלחל).
// המרה: === של JS ⇒ identical ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/open-cloud-key_test.dart  ⇒ exit 0
import 'open-cloud-key.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

Future<void> main() async {
  var n = 0;

  // 1. האצלה שקופה — אותם ארגומנטים, אותו ערך-מוחזר (===), קריאה יחידה.
  final S = {'sentinel': true};
  final calls = <List<Object?>>[];
  dynamic spy(Object? a, Object? b, Object? c) {
    calls.add([a, b, c]);
    return S;
  }

  final env = {'iter': 1000};
  _ok(identical(openCloudKey(env, 'סוד', 'pass', spy), S),
      'מחזיר בדיוק את פלט-השקע'); n++;
  _ok(calls.length == 1, 'קריאה יחידה'); n++;
  _ok(identical(calls[0][0], env) &&
          calls[0][1] == 'סוד' &&
          calls[0][2] == 'pass',
      'ארגומנטים כלשונם (רפרנסים)'); n++;

  // 2. via='rec' מועבר כלשונו.
  openCloudKey(env, 'מפתח', 'rec', spy);
  _ok(calls[1][2] == 'rec', "via='rec' עובר"); n++;

  // 3. null (סוד שגוי) מחלחל — Future.value(null) מוחזרת בלי עטיפה.
  final res = await openCloudKey(
      env, 'רע', 'pass', (a, b, c) => Future<Object?>.value(null));
  _ok(res == null, 'null מחלחל'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(openCloudKey(env, 'x', 'pass', spy), S), 'assert-live guard');

  print('OK openCloudKey: $n asserts passed');
}
