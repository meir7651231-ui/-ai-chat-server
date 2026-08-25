// בדיקת-חוזה (רתמת-זהב) · genRecoveryKey — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/gen-recovery-key.test.mjs:
//   1) בייטים 0..23  ⇒ 'ABCD-EFGH-JKLM-NPQR-STUV-WXYZ'
//   2) 24 אפסים      ⇒ 'AAAA-AAAA-AAAA-AAAA-AAAA-AAAA'
//   3) 24×255 (%32)  ⇒ '9999-9999-9999-9999-9999-9999'
//   4) 24×32 (גלגול) ⇒ 'AAAA-AAAA-AAAA-AAAA-AAAA-AAAA'
//   + צורה: אורך 29 · 6 קבוצות של 4 · בלי I/O/0/1 · rand(24) פעם אחת.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/gen-recovery-key_test.dart  ⇒ exit 0
import 'gen-recovery-key.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — מעקב-קריאות: מוודא ש-rand נקרא בדיוק פעם אחת עם 24 (כמו בבדיקת-ה-JS) —
  final calls = <int>[];

  // 1) בייטים 0..23 — מיפוי-האלפבית המדויק (בלי I,O,0,1)
  final k1 = genRecoveryKey((m) {
    calls.add(m);
    return List<int>.generate(m, (i) => i);
  });
  _eq(k1, 'ABCD-EFGH-JKLM-NPQR-STUV-WXYZ', '1 בייטים 0..23');
  n++;

  // 2) 24 אפסים
  final k2 = genRecoveryKey((m) => List<int>.filled(m, 0));
  _eq(k2, 'AAAA-AAAA-AAAA-AAAA-AAAA-AAAA', '2 אפסים');
  n++;

  // 3) 255 ⇒ '9' (מודולו 32)
  final k3 = genRecoveryKey((m) => List<int>.filled(m, 255));
  _eq(k3, '9999-9999-9999-9999-9999-9999', '3 255-ים');
  n++;

  // 3b) 32 ⇒ 'A' (גלגול)
  final k4 = genRecoveryKey((m) => List<int>.filled(m, 32));
  _eq(k4, 'AAAA-AAAA-AAAA-AAAA-AAAA-AAAA', '4 32-ים');
  n++;

  // 4) צורה: אורך 29
  if (k1.length != 29) throw StateError('FAIL [אורך]: ${k1.length}');
  n++;

  // 6 קבוצות של 4
  final parts = k1.split('-');
  if (parts.length != 6 || !parts.every((g) => g.length == 4)) {
    throw StateError('FAIL [צורה]: לא 6 קבוצות של 4 — $k1');
  }
  n++;

  // בלי I/O/0/1
  if (RegExp('[IO01]').hasMatch(k1 + k2 + k3)) {
    throw StateError('FAIL [תו-מבלבל]: I/O/0/1 הופיע');
  }
  n++;

  // rand נקרא בדיוק פעם אחת עם 24
  if (calls.length != 1 || calls[0] != 24) {
    throw StateError('FAIL [rand]: לא נקרא בדיוק פעם אחת עם 24 — $calls');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    genRecoveryKey((m) => List<int>.generate(m, (i) => i)) ==
        'ABCD-EFGH-JKLM-NPQR-STUV-WXYZ',
    'assert-live guard',
  );

  print('OK genRecoveryKey: $n asserts passed');
}
