// בדיקת-חוזה (רתמת-זהב) · reencryptDb — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/reencrypt-db.test.mjs.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/reencrypt-db_test.dart  ⇒ exit 0
import 'dart:convert' show utf8; // סטנדרט — לפענוח הבייטים חזרה בשקע-הבדיקה בלבד
import 'reencrypt-db.dart';

// מימוש-שקע לבדיקה — כמוגדר בחוזה: מתעד את ה-DEK ומפענח את הבייטים חזרה לטקסט.
// מקבילי-ביט ל-JS: (dek, bytes) => {tag:'ENC', key:dek, text:TextDecoder.decode(bytes)}.
Future<Map<String, dynamic>> aesEnc(dynamic dek, List<int> bytes) async =>
    {'tag': 'ENC', 'key': dek, 'text': utf8.decode(bytes)};

var _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ $msg');
    _f = 1;
  }
}

Future<void> main() async {
  final env = <String, dynamic>{
    r'$enc': 2,
    'saltPass': 'SP',
    'wrapPass': 'WP',
    'saltRec': 'SR',
    'wrapRec': 'WR',
    'iter': 600000,
    'data': 'OLD',
  };

  final out = await reencryptDb(env, 'DEK1', '{"a":1}', aesEnc);
  final data = out['data'] as Map<String, dynamic>;

  // 1 — ה-data החדש הוא הצפנת ה-JSON בדיוק, עם ה-DEK שהוזרק:
  _ok(
    data['tag'] == 'ENC' && data['key'] == 'DEK1' && data['text'] == '{"a":1}',
    'data: $data',
  );

  // 2 — שאר שדות-המעטפת ביט-זהים:
  _ok(
    out[r'$enc'] == 2 &&
        out['saltPass'] == 'SP' &&
        out['wrapPass'] == 'WP' &&
        out['saltRec'] == 'SR' &&
        out['wrapRec'] == 'WR' &&
        out['iter'] == 600000,
    'שדות-מעטפת השתנו',
  );

  // 3 — אפס-מוטציה של הקלט + עותק חדש:
  _ok(env['data'] == 'OLD', 'env.data שונה במקור');
  _ok(!identical(out, env), 'out === env — לא עותק');

  // 4 — קידוד-UTF-8 עגול לעברית:
  final heb = await reencryptDb(env, 'DEK1', 'שָׁלוֹם', aesEnc);
  final hebData = heb['data'] as Map<String, dynamic>;
  _ok(hebData['text'] == 'שָׁלוֹם', 'עברית: ${hebData['text']}');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(data['text'] == '{"a":1}', 'assert-live guard');

  if (_f != 0) {
    throw StateError('reencrypt-db golden: יש דוגמאות אדומות');
  }
  // ignore: avoid_print
  print('✓ reencrypt-db: 5 דוגמאות-חוזה — ירוק');
}
