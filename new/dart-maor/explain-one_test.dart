// בדיקת-חוזה (רתמת-זהב) · explainOne — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/explain-one.test.mjs:
//   1) אימות-נכשל ⇒ הודעה מרוכזת {summary:'⚠️ תצורה לא-תקינה: אין שלוחות · חסר מספר', outcome:'invalid', reason:''}
//   2) בכשל — explainCall/anchorToday **לא** נקראים (short-circuit)
//   3) אימות-עבר ⇒ העברה 1:1 של summary/outcome/reason (שדה-עודף extra נחתך)
//   4) explainCall קיבל את v.tenant/call המקוריים (זהות-הפניה) ו-opts={anchorDate,calendarWindow:400}
//   5) raw הועבר ל-validateTenant בזהות-הפניה; telephonyToTenant קיבל tc/orgName/tenantId
// המרה: ‎===‎ של JS ⇒ identical ב-Dart; JSON.stringify-eq ⇒ ‎_eq‎ עמוק.
// הרצה: dart run --enable-asserts new/dart-maor/explain-one_test.dart  ⇒ exit 0
import 'explain-one.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

bool _eq(dynamic a, dynamic b) {
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_eq(a[k], b[k])) return false;
    }
    return true;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_eq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

void main() {
  var n = 0;

  // 1+2) אימות נכשל ⇒ הודעה מרוכזת; explainCall/anchorToday לא נקראים.
  var simCalls = 0, anchorCalls = 0;
  final r1 = explainOne(
    {},
    'מאור',
    't1',
    {'num': '025000000'},
    (a, b, c) => {'raw': true},
    (r) => {'ok': false, 'errors': ['אין שלוחות', 'חסר מספר']},
    (tn, cl, opts) {
      simCalls++;
      return {};
    },
    () {
      anchorCalls++;
      return '2026-08-24';
    },
  );
  _ok(
    _eq(r1, {
      'summary': '⚠️ תצורה לא-תקינה: אין שלוחות · חסר מספר',
      'outcome': 'invalid',
      'reason': '',
    }),
    'הודעת-הכשל שגויה',
  );
  n++;
  _ok(simCalls == 0 && anchorCalls == 0, 'נכשל אך הסימולטור/העוגן נקראו');
  n++;

  // 3+4+5) אימות עבר ⇒ העברה 1:1 + פרמטרים מדויקים.
  final tc = {'ext': 1};
  final call = {'num': '025000000', 'when': '2026-08-24T10:00'};
  final raw = {'built': 'raw'};
  final tenant = {'built': 'tenant'};
  dynamic seenTn, seenCl, seenOpts, rawSeen;
  List? t2tArgs;
  final r2 = explainOne(
    tc,
    'מאור',
    't1',
    call,
    (a, b, c) {
      t2tArgs = [a, b, c];
      return raw;
    },
    (r) {
      rawSeen = r;
      return {'ok': true, 'errors': [], 'tenant': tenant};
    },
    (tn, cl, opts) {
      seenTn = tn;
      seenCl = cl;
      seenOpts = opts;
      return {
        'summary': 'ניתוב לשלוחה 1',
        'outcome': 'route',
        'reason': 'שעות-פעילות',
        'extra': 'לא-יעבור',
      };
    },
    () => '2026-08-24',
  );
  _ok(
    _eq(r2, {
      'summary': 'ניתוב לשלוחה 1',
      'outcome': 'route',
      'reason': 'שעות-פעילות',
    }),
    'העברה 1:1 נכשלה (או שדה-עודף דלף)',
  );
  n++;
  _ok(
    identical(seenTn, tenant) && identical(seenCl, call),
    'explainCall לא קיבל את v.tenant/call המקוריים',
  );
  n++;
  _ok(
    _eq(seenOpts, {'anchorDate': '2026-08-24', 'calendarWindow': 400}),
    'opts שגוי (עוגן/חלון-400)',
  );
  n++;
  _ok(identical(rawSeen, raw), 'ה-raw לא הועבר ל-validateTenant בזהות-הפניה');
  n++;
  _ok(
    identical(t2tArgs![0], tc) &&
        t2tArgs![1] == 'מאור' &&
        t2tArgs![2] == 't1',
    'telephonyToTenant קיבל ארגומנטים שגויים',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(r1['outcome'] == 'invalid', 'assert-live guard');

  print('OK explainOne: $n asserts passed');
}
