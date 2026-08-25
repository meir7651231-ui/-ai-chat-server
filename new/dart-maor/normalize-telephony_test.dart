// בדיקת-חוזה (רתמת-זהב) · normalizeTelephony — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע קבוצות דוגמאות-חוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/normalize-telephony.test.mjs.
// השקעים telStr/telExt = העתק-מקור (config.ts:153-160), מוזרקים כאן כמו בבדיקת-ה-JS.
// השוואת-עומק דרך jsonEncode (LinkedHashMap שומר סדר-הכנסה ⇒ שקול ל-JSON.stringify של המקור;
// כלל-8: לא join — jsonEncode מבחין גבול-איבר ומבנה).
// הרצה: dart run --enable-asserts new/dart-maor/normalize-telephony_test.dart  ⇒ exit 0
import 'dart:convert';
import 'normalize-telephony.dart';

// מימושי-השקעים — העתק-מקור maor/src/lib/config.ts:153-160.
final RegExp _cc = RegExp(r'\p{Cc}', unicode: true);
final RegExp _nonDigit = RegExp(r'\D');
String telStr(dynamic v, int max) {
  if (v is! String) return '';
  final s = v.replaceAll(_cc, '').trim();
  return s.length <= max ? s : s.substring(0, max);
}

String telExt(dynamic v, String def) {
  final s = v is String ? _sliceMax8(v.replaceAll(_nonDigit, '')) : '';
  return s.isNotEmpty ? s : def;
}

String _sliceMax8(String s) => s.length <= 8 ? s : s.substring(0, 8);

Map<String, dynamic>? N(dynamic raw) => normalizeTelephony(raw, telStr, telExt);
bool eq(dynamic a, dynamic b) => jsonEncode(a) == jsonEncode(b);

void main() {
  var n = 0;

  // 1. חסר/לא-אובייקט/מערך ⇒ undefined(=null).
  assert(N(null) == null, 'FAIL: null⇒null');
  assert(N('x') == null, "FAIL: 'x'⇒null");
  assert(N([1]) == null, 'FAIL: [1]⇒null');
  n += 3;

  // 2. {} ⇒ ברירות-מחדל מלאות, בלי enabled.
  final d = N(<String, dynamic>{});
  assert(
      eq(d, <String, dynamic>{
        'numbers': [],
        'officeDays': [0, 1, 2, 3, 4],
        'officeStart': '09:00',
        'officeEnd': '17:00',
        'officeExt': '101',
        'managerExt': '201',
        'vmBox': '100',
        'city': '',
        'kosherMode': false,
        'hebrewCalendar': true,
        'zmanim': false,
        'shabbat': true,
        'fasts': false,
        'voicemail': true,
      }),
      'FAIL: {} ברירות-מחדל');
  assert(!d!.containsKey('enabled'), 'FAIL: {} בלי מפתח enabled');
  n += 2;

  // 3. enabled — opt-in: רק true בדיוק.
  assert(N(<String, dynamic>{'enabled': true})!['enabled'] == true, 'FAIL: enabled:true נשמר');
  assert(!N(<String, dynamic>{'enabled': 'yes'})!.containsKey('enabled'), "FAIL: enabled:'yes' מושמט");
  n += 2;

  // 4. חיטוי מספרים.
  final nums = N(<String, dynamic>{
    'numbers': [
      {'e164': '03-123x4567!', 'label': 'משרד', 'kind': 'זבל', 'kosher': true},
      7,
    ],
  })!['numbers'] as List;
  assert(nums.length == 1, 'FAIL: מספר יחיד (לא-אובייקט נזרק)');
  assert(
      eq(nums[0], <String, dynamic>{
        'id': 'n1',
        'e164': '03-1234567',
        'label': 'משרד',
        'kind': 'sim',
        'kosher': true,
      }),
      'FAIL: מספר מחוטא');
  final nk = (N(<String, dynamic>{
    'numbers': [
      {'kosher': 'true'},
    ],
  })!['numbers'] as List)[0] as Map;
  assert(!nk.containsKey('kosher') && nk['label'] == 'n1' && nk['e164'] == '',
      "FAIL: kosher:'true' מושמט + label נופל ל-id");
  n += 3;

  // 5. officeDays — ייחוד+טווח+מיון.
  assert(
      eq(N(<String, dynamic>{'officeDays': [3, 1, 3, 9, -1, 'a', 2]})!['officeDays'], [1, 2, 3]),
      'FAIL: officeDays מחוטא');
  assert(
      eq(N(<String, dynamic>{'officeDays': 'x'})!['officeDays'], [0, 1, 2, 3, 4]),
      'FAIL: officeDays לא-מערך ⇒ ברירת-מחדל');
  n += 2;

  // 6. שעות HH:MM.
  assert(N(<String, dynamic>{'officeStart': '25:00'})!['officeStart'] == '09:00', "FAIL: '25:00'⇒'09:00'");
  assert(N(<String, dynamic>{'officeStart': '08:30'})!['officeStart'] == '08:30', "FAIL: '08:30' נשמר");
  n += 2;

  // 7. עיר — [a-z] בלבד, 2–20.
  assert(N(<String, dynamic>{'city': 'Tel-Aviv6'})!['city'] == 'telaviv', "FAIL: 'Tel-Aviv6'⇒'telaviv'");
  assert(N(<String, dynamic>{'city': 'a'})!['city'] == '', "FAIL: 'a'⇒''");
  assert(N(<String, dynamic>{'city': 'a' * 21})!['city'] == '', "FAIL: 21 תווים⇒''");
  n += 3;

  print('OK normalizeTelephony: $n asserts passed (7 קבוצות דוגמאות-חוזה, שקעים telStr/telExt)');
}
