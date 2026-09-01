import '../dart-data-maor/cloud-db-sockets.dart' as sk_cloud_db;
// בדיקת-חוזה (רתמת-זהב) · cloudDb — מייבאת אך ורק את האטום-שלה (חוק-4).
// 4 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/cloud-db.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// המרה: JS undefined אינו קיים ב-Dart ⇒ דוגמה-3 מדגימה falsy-נוסף ('') שב-JS
//        שקול ל-undefined (שניהם `!x`==true) ⇒ אותה זריקה בדיוק (כלל-7).
// הרצה: dart run --enable-asserts new/dart-maor/cloud-db_test.dart  ⇒ exit 0
import 'cloud-db.dart';

int _f = 0;
void _chk(String name, bool cond) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ ' + name);
    _f = 1;
  }
}

const _msg = 'הענן לא אותחל — פנו למנהל המערכת';

String _throwMsg(Object? arg) {
  try {
    cloudDb(arg, sk_cloud_db.cloudDb_T);
    return '';
  } on StateError catch (e) {
    return e.message;
  }
}

void main() {
  // 1) ידית קיימת ⇒ זהות-הפניה (===)
  final handle = <String, Object?>{'app': 'maor'};
  _chk('1 מחזיר את אותו אובייקט (===)', identical(cloudDb(handle, sk_cloud_db.cloudDb_T), handle));

  // 2) null ⇒ throw בעברית מדויקת
  _chk('2 null ⇒ הודעה עברית מדויקת', _throwMsg(null) == _msg);

  // 3) falsy נוסף (שקול-undefined ב-JS) ⇒ אותו throw
  _chk('3 undefined/falsy ⇒ אותו throw', _throwMsg('') == _msg);

  // 4) טהור — קריאה חוזרת זהה
  _chk('4 טהור: קריאה שנייה זהה', identical(cloudDb(handle, sk_cloud_db.cloudDb_T), handle));

  if (_f != 0) {
    // ignore: avoid_print
    throw StateError('cloud-db: דוגמת-חוזה נכשלה');
  }
  // ignore: avoid_print
  print('✓ cloud-db: 4 דוגמאות-חוזה (שער-ידית + throw עברי) — ירוק');
}
