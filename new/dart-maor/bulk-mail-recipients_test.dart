// בדיקת-חוזה (רתמת-זהב) · bulkMailRecipients — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/bulk-mail-recipients.test.mjs
// (אותם קלטים→פלטים; השקע norm = (s) => (s||'').trim().toLowerCase()):
//   1) [אבי ' Avi@X.co ', בני 'avi@x.co', גדי בלי-מייל, דנה 'not-an-email', הדס 'h@y.co']
//      ⇒ אורך 2 (סינון+דדופ)
//   2) הראשון-שורד: r1[0].id=='a' וגם r1[0].email=='Avi@X.co' (trim בלבד, לא lowercase)
//   3) סדר-שימור: r1[1].id=='e'
//   4) [] ⇒ אורך 0
//   5) שם-חסר ('') ⇒ name==''
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/bulk-mail-recipients_test.dart  ⇒ exit 0
import 'bulk-mail-recipients.dart';

// שקע-הבדיקה — מקביל ל-norm = (s) => (s || '').trim().toLowerCase() במקור-ה-JS.
String _norm(String s) => s.trim().toLowerCase();

void _check(bool cond, String label) {
  if (!cond) throw StateError('FAIL [$label]');
}

void main() {
  var n = 0;

  final r1 = bulkMailRecipients([
    {'id': 'a', 'name': 'אבי', 'email': ' Avi@X.co '},
    {'id': 'b', 'name': 'בני', 'email': 'avi@x.co'}, // דדופ — אותה כתובת מנורמלת
    {'id': 'c', 'name': 'גדי'}, // בלי מייל — מסונן
    {'id': 'd', 'name': 'דנה', 'email': 'not-an-email'}, // בלי @ — מסונן
    {'id': 'e', 'name': 'הדס', 'email': 'h@y.co'},
  ], _norm);

  // 1) סינון+דדופ ⇒ 2
  _check(r1.length == 2, '1 סינון+דדופ ⇒ 2');
  n++;

  // 2) הראשון-שורד + trim בלבד (לא lowercase)
  _check(r1[0]['id'] == 'a' && r1[0]['email'] == 'Avi@X.co',
      '2 הראשון-שורד + trim בלבד (לא lowercase)');
  n++;

  // 3) סדר-שימור
  _check(r1[1]['id'] == 'e', '3 סדר-שימור');
  n++;

  // 4) ריק
  _check(bulkMailRecipients([], _norm).isEmpty, '4 ריק');
  n++;

  // 5) שם-חסר ⇒ ריק
  _check(
      bulkMailRecipients([
            {'id': 'x', 'name': '', 'email': 'a@b.c'}
          ], _norm)[0]['name'] ==
          '',
      '5 שם-חסר ⇒ ריק');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(r1[0]['name'] == 'אבי', 'assert-live guard');

  print('OK bulkMailRecipients: $n דוגמאות-חוזה — ירוק');
}
