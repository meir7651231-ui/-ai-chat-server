// רתמת-זהב · dup-field-value — דוגמאות-החוזה של new/atoms/dup-field-value.test.mjs
// אותם קלטים→פלטים בדיוק. עובר ⇒ Dart ≡ JS. הרצה: dart run --enable-asserts.
import 'dup-field-value.dart';

void main() {
  // DEF = { key: 'phone', get: (f) => f.phone || '' }  ⇒  '' / null ⇒ '', אחרת הערך.
  final def = <String, dynamic>{
    'key': 'phone',
    'get': (dynamic f) {
      final p = f['phone'];
      return (p == null || p == '') ? '' : p;
    },
  };
  final fams = [
    {'phone': ''},
    {'phone': '050'},
    {'phone': '052'},
  ];

  // [fams, pick, edit, want] — זהים לבדיקת-ה-JS.
  final cases = [
    [fams, {'phone': 2}, {'phone': '999'}, '999'],
    [fams, {}, {'phone': ''}, ''],
    [fams, {'phone': 2}, {}, '052'],
    [fams, {}, {}, '050'],
    [
      [{}, {}],
      {},
      {},
      ''
    ],
    [fams, {'phone': 0}, {}, ''],
  ];

  for (final c in cases) {
    final famsC = c[0] as List;
    final pick = c[1] as Map;
    final edit = c[2] as Map;
    final want = c[3];
    final got = dupFieldValue(famsC, def, pick, edit);
    assert(got == want,
        'dupFieldValue(pick=$pick, edit=$edit) = $got ≠ $want');
    if (got != want) throw StateError('MISMATCH: $got ≠ $want');
  }
  print('✓ dup-field-value (Dart): 6 דוגמאות-חוזה (edit⇒pick⇒ראשונה-עם-ערך) — ירוק');
}
