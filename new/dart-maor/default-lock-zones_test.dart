// בדיקת-חוזה (רתמת-זהב) · defaultLockZones — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/default-lock-zones.test.mjs:
//   assert.deepStrictEqual(DEFAULT_LOCK_ZONES, ['wizard', 'settings']);
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/default-lock-zones_test.dart  ⇒ exit 0
import 'default-lock-zones.dart';

// צילום-הערך verbatim מ-default-lock-zones.test.mjs.
const List<String> _SNAP = ['wizard', 'settings'];

void _eqList(List<String> got, List<String> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: length ${got.length} != ${want.length}');
  }
  for (var i = 0; i < want.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('FAIL [$label] @$i:\n got =${got[i]}\n want=${want[i]}');
    }
  }
}

void main() {
  var n = 0;

  // — deepStrictEqual verbatim: אותם איברים, אותו סדר —
  _eqList(defaultLockZones, _SNAP, 'DEFAULT_LOCK_ZONES snapshot'); n++;

  // — חיזוק ישיר: שני איברים בדיוק, בסדר הנכון —
  if (defaultLockZones.length != 2) {
    throw StateError('FAIL: length ${defaultLockZones.length} != 2');
  }
  n++;
  if (defaultLockZones[0] != 'wizard') throw StateError('FAIL: [0] != wizard');
  n++;
  if (defaultLockZones[1] != 'settings') throw StateError('FAIL: [1] != settings');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(defaultLockZones.join(',') == 'wizard,settings', 'assert-live guard');

  print('OK defaultLockZones: $n asserts passed');
}
