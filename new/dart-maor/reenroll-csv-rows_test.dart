// בדיקת-חוזה (רתמת-זהב) · reenrollCsvRows — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/reenroll-csv-rows.test.mjs.
// הרצה: dart run --enable-asserts new/dart-maor/reenroll-csv-rows_test.dart ⇒ exit 0
import 'reenroll-csv-rows.dart';

bool _deepEq(Object? a, Object? b) {
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    print('✗ $msg');
    _f = 1;
  }
}

void main() {
  final r1 = <String, Object?>{
    'memberName': 'דוד',
    'familyName': 'כהן',
    'courseName': 'ציור',
    'summary': {'presents': 12, 'absences': 2, 'balance': 150, 'statusLabel': 'פעיל'},
    'decision': 'yes',
    'renewed': true,
    'e': {'renewNote': 'ממשיך בשמחה'},
  };
  final r2 = <String, Object?>{
    'memberName': 'רות',
    'familyName': 'לוי',
    'courseName': 'מוזיקה',
    'summary': {'presents': 0, 'absences': 5, 'balance': -80, 'statusLabel': 'בסיכון'},
    'decision': 'hold',
    'renewed': false,
    'e': <String, Object?>{},
  };

  final R = reenrollCsvRows([r1, r2]);

  ok(
      _deepEq(R[0], [
        'תלמיד/ה', 'משפחה', 'חוג', 'נוכחות', 'חיסורים', 'יתרה ₪', 'סטטוס', 'החלטה', 'נרשם לשנה הבאה', 'הערה'
      ]),
      'כותרת: ${R[0]}');
  ok(_deepEq(R[1], ['דוד', 'כהן', 'ציור', '12', '2', '150', 'פעיל', 'ממשיך', 'כן', 'ממשיך בשמחה']), 'שורה 1: ${R[1]}');
  ok(_deepEq(R[2], ['רות', 'לוי', 'מוזיקה', '0', '5', '-80', 'בסיכון', 'בהמתנה', '', '']), 'שורה 2: ${R[2]}');

  // 'no' ⇒ 'לא ממשיך'; חסר ⇒ '':
  final rNo = <String, Object?>{...r2, 'decision': 'no'};
  ok(reenrollCsvRows([rNo])[1][7] == 'לא ממשיך', "decision 'no'");
  final rUndecided = <String, Object?>{...r2}..remove('decision'); // decision undefined ⇒ ''
  ok(reenrollCsvRows([rUndecided])[1][7] == '', 'decision חסר ⇒ ריק (לא "טרם הוחלט")');

  // ריק ⇒ כותרת בלבד:
  ok(reenrollCsvRows([]).length == 1, 'rows=[] ⇒ אורך 1');

  if (_f != 0) throw StateError('reenroll-csv-rows: דוגמאות-חוזה נכשלו');
  print('✓ reenroll-csv-rows: 6 דוגמאות-חוזה — ירוק');
}
