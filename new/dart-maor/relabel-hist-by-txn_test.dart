// בדיקת-חוזה (רתמת-זהב) · relabelHistByTxn — מייבאת אך ורק את האטום-שלה (חוק-4).
// 11 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/relabel-hist-by-txn.test.mjs.
// המרה: === של JS ⇒ identical ב-Dart · undefined ⇒ מפתח-חסר במפה. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/relabel-hist-by-txn_test.dart ⇒ exit 0
import 'relabel-hist-by-txn.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1 — רשימת-מזהים ריקה/רווחים ⇒ אותו מערך, אפס שינוי:
  final arr = [
    {
      'id': 's1',
      'hist': [
        {'txn': 'T1', 'clearer': 'נדרים'}
      ]
    }
  ];
  final e1 = relabelHistByTxn(arr, [], 'סולה');
  _ok(identical(e1.supporters, arr) && e1.changed == 0,
      'txns=[] ⇒ זהות-עצם + changed=0'); n++;
  final e1b = relabelHistByTxn(arr, ['', '  '], 'סולה');
  _ok(identical(e1b.supporters, arr) && e1b.changed == 0,
      "txns=['','  '] ⇒ זהות-עצם + changed=0"); n++;

  // 2 — תיוג-מחדש לפי txn, בלי לגעת בשאר:
  final sp1 = {
    'id': 's1',
    'hist': [
      {'txn': 'T1', 'clearer': 'נדרים'},
      {'txn': 'T9'}
    ]
  };
  final r2 = relabelHistByTxn([sp1], ['T1'], 'סולה');
  _ok(r2.changed == 1, 'changed=${r2.changed} ≠ 1'); n++;
  _ok((r2.supporters[0]['hist'][0] as Map)['clearer'] == 'סולה',
      'hist[0] לא תויג'); n++;
  _ok(identical(r2.supporters[0]['hist'][1], (sp1['hist'] as List)[1]),
      'hist[1] איבד זהות-עצם'); n++;
  _ok(((sp1['hist'] as List)[0] as Map)['clearer'] == 'נדרים',
      'מוטציה של הקלט!'); n++;

  // 3 — נפילה-ל-ref עם trim דו-צדדי:
  final r3 = relabelHistByTxn([
    {
      'id': 's2',
      'hist': [
        {'txn': '', 'ref': ' R7 '}
      ]
    }
  ], ['R7'], 'סולה');
  _ok(r3.changed == 1 && (r3.supporters[0]['hist'][0] as Map)['clearer'] == 'סולה',
      'ref+trim לא נתפס'); n++;

  // 4 — אידמפוטנטיות: כבר-מתויג לא נספר והתומך נשמר בזהות-עצם:
  final sp4 = {
    'id': 's4',
    'hist': [
      {'txn': 'T1', 'clearer': 'סולה'}
    ]
  };
  final r4 = relabelHistByTxn([sp4], ['T1'], 'סולה');
  _ok(r4.changed == 0 && identical(r4.supporters[0], sp4),
      'אידמפוטנטיות נשברה'); n++;

  // 5 — בלי hist / hist ריק ⇒ זהות-עצם:
  final sp5a = {'id': 'a'};
  final sp5b = {'id': 'b', 'hist': []};
  final r5 = relabelHistByTxn([sp5a, sp5b], ['T1'], 'סולה');
  _ok(identical(r5.supporters[0], sp5a) &&
          identical(r5.supporters[1], sp5b) &&
          r5.changed == 0,
      'בלי-hist ⇒ זהות-עצם'); n++;

  // 6 — רשומה בלי txn ובלי ref ⇒ לא נגעת:
  final r6 = relabelHistByTxn([
    {
      'id': 'c',
      'hist': [
        {'amount': 5}
      ]
    }
  ], ['T1'], 'סולה');
  _ok(r6.changed == 0 &&
          !(r6.supporters[0]['hist'][0] as Map).containsKey('clearer'),
      'מפתח-ריק תויג בטעות'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(relabelHistByTxn(arr, [], 'x').changed == 0, 'assert-live guard');

  print('OK relabelHistByTxn: $n asserts passed');
}
