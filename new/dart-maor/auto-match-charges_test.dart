// בדיקת-חוזה (רתמת-זהב) · autoMatchCharges — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/auto-match-charges.test.mjs.
// שקע keysOf — נאמן למקור (nedarimSync.ts keysOf): המרת JS→Dart של אותו נירמול.
// הרצה: dart run --enable-asserts new/dart-maor/auto-match-charges_test.dart ⇒ exit 0
import 'auto-match-charges.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// מימוש-שקע לבדיקה — נאמן למקור (JS keysOf):
List<String> keysOf(Map<String, Object?> o) {
  final ks = <String>[];
  final ext = ((o['extId'] ?? '') as String).trim();
  if (ext.isNotEmpty) ks.add('ext:$ext');
  final id = (o['idNum'] ?? o['zeout'] ?? '').toString().replaceAll(RegExp(r'\D'), '');
  if (id.isNotEmpty) ks.add('id:$id');
  final ph = (o['phone'] ?? '').toString().replaceAll(RegExp(r'\D'), '');
  if (ph.length >= 7) ks.add('ph:$ph');
  final em = ((o['email'] ?? '') as String).trim().toLowerCase();
  if (em.isNotEmpty) ks.add('em:$em');
  return ks;
}

void main() {
  var n = 0;

  final supporters = <Map<String, Object?>>[
    {'id': 's1', 'extId': 'E1'},
    {'id': 's2', 'phone': '050-1234567'},
    {'id': 's3', 'email': 'A@b.com'},
    {'id': 's4', 'phone': '050-1234567'}, // טלפון-כפול — s2 גובר
  ];
  final charges = <Map<String, Object?>>[
    {'toremId': 'E1'},
    {'phone': '0501234567'},
    {'email': 'a@B.com'},
    {'zeout': '999'}, // אין-התאמה — לא-בפלט
    {'toremId': 'E1', 'phone': '0501234567'}, // ext חזק מ-ph
  ];

  final out = autoMatchCharges(charges, supporters, keysOf);

  _ok(out.length == 4, 'אורך ${out.length} ≠ 4'); n++;
  _ok(out[0]['supId'] == 's1' && identical(out[0]['charge'], charges[0]),
      'toremId E1 → s1'); n++;
  _ok(out[1]['supId'] == 's2',
      'טלפון-כפול: הראשון-במערך (s2) גובר — קיבלנו ${out[1]['supId']}'); n++;
  _ok(out[2]['supId'] == 's3',
      'אימייל lowercase → s3 — קיבלנו ${out[2]['supId']}'); n++;
  _ok(!out.any((m) => identical(m['charge'], charges[3])),
      'חיוב בלי-התאמה לא-בפלט'); n++;
  _ok(out[3]['supId'] == 's1',
      'ext חזק מ-ph → s1 — קיבלנו ${out[3]['supId']}'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(out.length == 4, 'assert-live guard');

  print('OK autoMatchCharges: $n asserts passed');
}
