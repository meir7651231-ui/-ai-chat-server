// בדיקת-חוזה (רתמת-זהב) · bulkWaRecipients — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/bulk-wa-recipients.test.mjs
// (אותם קלטים→פלטים; השקע waDigits = המימוש-inline של חוזה wa-digits מהבדיקה):
//   1) [a,b,c,d,e] ⇒ length 2 (סינון '12' ובלי-טלפון + דדופ אותן-ספרות)
//   2) r[0].id=='a' · r[0].digits=='972501234567' (הראשון-מנצח + ספרות-בינ"ל)
//   3) r[0].phone=='050-123-4567' (phone מקורי נשמר)
//   4) r[1].digits=='972529998877'
//   5) [] ⇒ length 0
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/bulk-wa-recipients_test.dart  ⇒ exit 0
import 'bulk-wa-recipients.dart';

// שקע-הבדיקה — מקביל ביט-אחר-ביט ל-waDigits ה-inline במקור-ה-JS
// (בדיקת-אטום לא מייבאת אטום — חוק-חיווט; `phone || ''` = truthiness ⇒ _f).
bool _f(dynamic v) =>
    v == null || v == false || (v is String && v.isEmpty) || (v is num && (v == 0 || v.isNaN));

String? _waDigits(dynamic phone) {
  var d = (_f(phone) ? '' : phone as String).replaceAll(RegExp(r'\D'), '');
  if (d.isEmpty) return null;
  if (d.startsWith('00972')) {
    d = '972${d.substring(5)}';
  } else if (d.startsWith('00')) {
    d = d.substring(2);
  }
  if (d.startsWith('9720')) d = '972${d.substring(4)}';
  if (!d.startsWith('972') && !d.startsWith('0') && (d.length == 8 || d.length == 9)) {
    d = '0$d';
  }
  if (d.startsWith('0')) {
    if (d.length == 9 || d.length == 10) {
      d = '972${d.substring(1)}';
    } else {
      return null;
    }
  }
  if (d.length < 8 || d.length > 15) return null;
  return d;
}

void _chk(bool ok, String label) {
  if (!ok) throw StateError('FAIL [$label]');
}

void main() {
  var n = 0;

  final r = bulkWaRecipients([
    {'id': 'a', 'name': 'אבי', 'phone': '050-123-4567'},
    {'id': 'b', 'name': 'בני', 'phone': '0501234567'}, // אותן ספרות — דדופ
    {'id': 'c', 'name': 'גדי', 'phone': '12'}, // לא-תקין — מסונן
    {'id': 'd', 'name': 'דנה'}, // בלי טלפון — מסונן
    {'id': 'e', 'name': 'הדס', 'phone': '052-999-8877'},
  ], _waDigits);

  // 1) סינון+דדופ ⇒ 2.
  _chk(r.length == 2, '1 סינון+דדופ ⇒ 2');
  n++;

  // 2) הראשון-מנצח + ספרות-בינ"ל.
  _chk(r[0]['id'] == 'a' && r[0]['digits'] == '972501234567', '2 הראשון + ספרות-בינ"ל');
  n++;

  // 3) phone מקורי נשמר.
  _chk(r[0]['phone'] == '050-123-4567', '3 phone מקורי נשמר');
  n++;

  // 4) השני.
  _chk(r[1]['digits'] == '972529998877', '4 השני');
  n++;

  // 5) ריק ⇒ ריק.
  _chk(bulkWaRecipients([], _waDigits).isEmpty, '5 ריק');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(r[1]['id'] == 'e' && r[1]['name'] == 'הדס', 'assert-live guard');

  print('OK bulkWaRecipients: $n asserts passed');
}
