// בדיקת-חוזה (רתמת-זהב) · lockZones — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/lock-zones.test.mjs:
//   SNAP.LOCK_ZONES = '[{"key":"wizard","label":"אשף ההרכבה"},
//     {"key":"settings","label":"הגדרות"},{"key":"supporters","label":"תורמים"},
//     {"key":"reports","label":"דוחות"}]'
//   ⇒ JSON.stringify(LOCK_ZONES) === SNAP.LOCK_ZONES
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/lock-zones_test.dart  ⇒ exit 0
import 'lock-zones.dart';

// צילום-הערך verbatim מ-lock-zones.test.mjs — אותם zווגי key/label, אותו סדר.
const List<Map<String, String>> _SNAP = [
  {'key': 'wizard', 'label': 'אשף ההרכבה'},
  {'key': 'settings', 'label': 'הגדרות'},
  {'key': 'supporters', 'label': 'תורמים'},
  {'key': 'reports', 'label': 'דוחות'},
];

void _eqZones(
    List<Map<String, String>> got, List<Map<String, String>> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: length ${got.length} != ${want.length}');
  }
  for (var i = 0; i < want.length; i++) {
    final g = got[i];
    final w = want[i];
    // השוואת-מבנה: אותם מפתחות, אותם ערכים (מקבילה ל-JSON.stringify זהה).
    if (g.length != w.length) {
      throw StateError('FAIL [$label] @$i: key-count ${g.length} != ${w.length}');
    }
    for (final k in w.keys) {
      if (g[k] != w[k]) {
        throw StateError('FAIL [$label] @$i.$k:\n got =${g[k]}\n want=${w[k]}');
      }
    }
  }
}

void main() {
  var n = 0;

  // — צילום-ערך verbatim: אותם רשומות, אותו סדר, אותם key/label —
  _eqZones(lockZones, _SNAP, 'LOCK_ZONES snapshot');
  n++;

  // — חיזוק ישיר: ארבע רשומות בדיוק, בסדר הנכון —
  if (lockZones.length != 4) {
    throw StateError('FAIL: length ${lockZones.length} != 4');
  }
  n++;
  if (lockZones[0]['key'] != 'wizard') throw StateError('FAIL: [0].key != wizard');
  n++;
  if (lockZones[0]['label'] != 'אשף ההרכבה') {
    throw StateError('FAIL: [0].label mismatch');
  }
  n++;
  if (lockZones[1]['key'] != 'settings') throw StateError('FAIL: [1].key != settings');
  n++;
  if (lockZones[1]['label'] != 'הגדרות') throw StateError('FAIL: [1].label mismatch');
  n++;
  if (lockZones[2]['key'] != 'supporters') {
    throw StateError('FAIL: [2].key != supporters');
  }
  n++;
  if (lockZones[2]['label'] != 'תורמים') throw StateError('FAIL: [2].label mismatch');
  n++;
  if (lockZones[3]['key'] != 'reports') throw StateError('FAIL: [3].key != reports');
  n++;
  if (lockZones[3]['label'] != 'דוחות') throw StateError('FAIL: [3].label mismatch');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    lockZones.map((z) => z['key']).join(',') == 'wizard,settings,supporters,reports',
    'assert-live guard',
  );

  print('OK lockZones: $n asserts passed');
}
