// בדיקת-חוזה (רתמת-זהב) · isOrgManager — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/is-org-manager.test.mjs
// (בכולן nrm = (e) => e.trim().toLowerCase()):
//   1) ' A@b.com' · {manager:'a@B.com '} ⇒ true   — נירמול דו-צדדי
//   2) 'a@b.com'  · {manager:'a@b.com'}  ⇒ true   — התאמה ישירה
//   3) 'c@d.com'  · {manager:'a@b.com'}  ⇒ false  — מייל אחר
//   4) 'a@b.com'  · {}                   ⇒ false  — אין מנהל (?? '')
//   5) ''         · {manager:'  '}       ⇒ false  — מנהל-רווחים⇒ריק, המגן !!m חוסם
// המרה: === של JS ⇒ == ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/is-org-manager_test.dart  ⇒ exit 0
import 'is-org-manager.dart';

String _nrm(String e) => e.trim().toLowerCase();

void main() {
  var n = 0;

  // 1) נירמול דו-צדדי — רווחים + case משני הצדדים.
  assert(isOrgManager(' A@b.com', {'manager': 'a@B.com '}, _nrm) == true);
  n++;

  // 2) התאמה ישירה.
  assert(isOrgManager('a@b.com', {'manager': 'a@b.com'}, _nrm) == true);
  n++;

  // 3) מייל אחר ⇒ false.
  assert(isOrgManager('c@d.com', {'manager': 'a@b.com'}, _nrm) == false);
  n++;

  // 4) אין מנהל (מפתח חסר, ?? '') ⇒ false.
  assert(isOrgManager('a@b.com', {}, _nrm) == false);
  n++;

  // 5) מנהל-רווחים מתנרמל לריק, המגן !!m חוסם גם כשהמייל הנבדק ריק.
  assert(isOrgManager('', {'manager': '  '}, _nrm) == false);
  n++;

  print('✓ is-org-manager (Dart): $n דוגמאות-חוזה — ירוק · Dart≡JS');
}
