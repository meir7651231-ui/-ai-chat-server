import '../dart-data-maor/group-options-of-sockets.dart' as sk_group_options_of;
// בדיקת-חוזה (רתמת-זהב) · groupOptionsOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/group-options-of.test.mjs:
//   1) שני מפגשים בלי תוויות              ⇒ [{v:'קבוצה 1',t:'... ראשון 16:00'},{v:'קבוצה 2',...שלישי 17:30}]
//   2) תווית מפורשת + בלי שעה (נגזם)       ⇒ [{v:'בוגרים',...שני 10:00},{v:'קבוצה 2',t:'... חמישי'}]
//   3) מפגש יחיד                          ⇒ []
//   4) לגאסי בלי sessions ⇒ מפגש-יחיד     ⇒ []
// השקעים (sessionsOf/groupLabelOf/DAY_NAMES) הומרו ל-Dart verbatim מהבדיקה.
// הרצה: dart run --enable-asserts new/dart-maor/group-options-of_test.dart  ⇒ exit 0
import 'group-options-of.dart';

const dayNames = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];

// sessionsOf: c.sessions && c.sessions.length ? c.sessions : [{day:c.weekday, time:c.time, label:''}]
dynamic sessionsOf(dynamic c) {
  final ss = c['sessions'];
  return (ss != null && (ss as List).isNotEmpty)
      ? ss
      : [
          {'day': c['weekday'], 'time': c['time'], 'label': ''}
        ];
}

// groupLabelOf: s.label || 'קבוצה ' + (i+1)
String groupLabelOf(dynamic s, int i) {
  final l = s['label'];
  return (l != null && l is String && l.isNotEmpty) ? l : 'קבוצה ${i + 1}';
}

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// השוואת-עומק (כלל-8: איבר-איבר, לא join) של List<Map{'v','t'}>.
bool _eq(List<dynamic> a, List<dynamic> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    final ma = a[i] as Map;
    final mb = b[i] as Map;
    if (ma['v'] != mb['v'] || ma['t'] != mb['t']) return false;
  }
  return true;
}

void main() {
  var n = 0;

  // 1) שני מפגשים בלי תוויות.
  final r1 = groupOptionsOf({
    'sessions': [
      {'day': 0, 'time': '16:00'},
      {'day': 2, 'time': '17:30'},
    ]
  }, sessionsOf, groupLabelOf, dayNames, sk_group_options_of.groupOptionsOf_T);
  _ok(
      _eq(r1, [
        {'v': 'קבוצה 1', 't': 'קבוצה 1 · יום ראשון 16:00'},
        {'v': 'קבוצה 2', 't': 'קבוצה 2 · יום שלישי 17:30'},
      ]),
      'שני מפגשים בלי תוויות ⇒ $r1');
  n++;

  // 2) תווית מפורשת + בלי שעה (נגזם).
  final r2 = groupOptionsOf({
    'sessions': [
      {'day': 1, 'time': '10:00', 'label': 'בוגרים'},
      {'day': 4, 'time': ''},
    ]
  }, sessionsOf, groupLabelOf, dayNames, sk_group_options_of.groupOptionsOf_T);
  _ok(
      _eq(r2, [
        {'v': 'בוגרים', 't': 'בוגרים · יום שני 10:00'},
        {'v': 'קבוצה 2', 't': 'קבוצה 2 · יום חמישי'},
      ]),
      'תווית מפורשת + בלי שעה ⇒ $r2');
  n++;

  // 3) מפגש יחיד ⇒ [].
  final r3 = groupOptionsOf({
    'sessions': [
      {'day': 3, 'time': '12:00'},
    ]
  }, sessionsOf, groupLabelOf, dayNames, sk_group_options_of.groupOptionsOf_T);
  _ok(_eq(r3, []), 'מפגש יחיד ⇒ $r3');
  n++;

  // 4) לגאסי בלי sessions ⇒ מפגש-יחיד ⇒ [].
  final r4 = groupOptionsOf({'weekday': 5, 'time': '09:00'}, sessionsOf, groupLabelOf, dayNames, sk_group_options_of.groupOptionsOf_T);
  _ok(_eq(r4, []), 'לגאסי בלי sessions ⇒ $r4');
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_eq(r3, []), 'assert-live guard');

  print('OK groupOptionsOf: $n asserts passed');
}
