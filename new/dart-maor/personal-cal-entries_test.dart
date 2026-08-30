import '../dart-data-maor/personal-cal-entries-sockets.dart' as sk_personal_cal_entries;
// בדיקת-חוזה (רתמת-זהב) · personalCalEntries — מייבאת אך ורק את האטום-שלה (חוק-4).
// 9 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/personal-cal-entries.test.mjs.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/personal-cal-entries_test.dart ⇒ exit 0
import 'personal-cal-entries.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  List<Map<String, dynamic>> donEvents(Map _) => [
        {'date': '2026-08-01', 'amount': 180, 'cur': '₪', 'src': 'קבלה D-7', 'rid': 'D-7'}
      ];
  final sp = {
    'nextDate': '2026-09-01',
    'ayin': {
      'log': [
        {'date': '2026-08-10', 'eyes': 4, 'name': 'משה'},
        {'date': '2026-08-09', 'eyes': 2},
      ],
      'answers': [
        {'date': '2026-08-12', 'note': 'התקבלה'},
      ],
      'nextTalk': '2026-08-20',
    },
  };

  final r = personalCalEntries(sp, donEvents, sk_personal_cal_entries.personalCalEntries_T);

  _ok(r.length == 6, 'אורך=6, בפועל ${r.length}'); n++;

  // [0] הקרנה בלי rid.
  _ok(
      r[0]['date'] == '2026-08-01' &&
          r[0]['amount'] == 180 &&
          r[0]['cur'] == '₪' &&
          r[0]['src'] == 'קבלה D-7' &&
          !r[0].containsKey('rid'),
      '[0] הקרנה בלי rid: ${r[0]}');
  n++;

  // [1] תאריך-יעד.
  _ok(
      r[1]['src'] == '🎯 תאריך יעד לקשר הבא' &&
          r[1]['date'] == '2026-09-01' &&
          r[1]['amount'] == 0 &&
          r[1]['cur'] == '',
      '[1] תאריך-יעד: ${r[1]}');
  n++;

  // [2] log עם name.
  _ok(r[2]['src'] == '🧿 4 — משה', "[2]='🧿 4 — משה', בפועל ${r[2]['src']}"); n++;

  // [3] log בלי name.
  _ok(r[3]['src'] == '🧿 2', "[3]='🧿 2' (log בלי name), בפועל ${r[3]['src']}"); n++;

  // [4] תשובה.
  _ok(r[4]['src'] == '📞 תשובה: התקבלה' && r[4]['date'] == '2026-08-12',
      '[4] תשובה: ${r[4]}'); n++;

  // [5] לדבר-שוב.
  _ok(
      r[5]['date'] == '2026-08-20' &&
          r[5]['amount'] == 0 &&
          r[5]['cur'] == '' &&
          r[5]['src'] == '🔁 לדבר שוב',
      '[5] לדבר-שוב: ${r[5]}');
  n++;

  // תומך ריק והשקע ריק ⇒ [].
  _ok(personalCalEntries({}, (_) => [], sk_personal_cal_entries.personalCalEntries_T).length == 0, 'תומך ריק ⇒ []'); n++;

  // רשומת-log עם date='' מסוננת.
  final r2 = personalCalEntries({'ayin': {'log': [{'date': '', 'eyes': 7}], 'answers': []}}, (_) => [], sk_personal_cal_entries.personalCalEntries_T);
  _ok(r2.length == 0, "log עם date='' ⇒ מסונן"); n++;

  // assert חי — מוכיח ש---enable-asserts פעיל.
  assert(r.length == 6, 'assert-live guard');

  print('OK personalCalEntries: $n asserts passed');
}
