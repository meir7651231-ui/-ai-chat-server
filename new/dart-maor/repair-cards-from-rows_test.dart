// בדיקת-חוזה (רתמת-זהב) · repairCardsFromRows — מייבאת אך ורק את האטום-שלה (חוק-4).
// 7 דוגמאות-החוזה זהות למקור-ה-JS new/atoms/repair-cards-from-rows.test.mjs.
// שקע-המילוי (fill) זהה לחוזה: מוסיף phone רק אם ריק במקור, אחרת אותה הפניה.
// הרצה: dart run --enable-asserts new/dart-maor/repair-cards-from-rows_test.dart ⇒ exit 0
import 'repair-cards-from-rows.dart';

// fill=(sp,row)=> row.phone && !(sp.phone||'').trim() ? {...sp, phone:row.phone} : sp
dynamic fill(dynamic sp, dynamic row) {
  final ph = row['phone'];
  final cur = ((sp['phone'] ?? '') as String).trim();
  if (ph != null && ph != '' && cur == '') {
    return {...sp as Map, 'phone': ph};
  }
  return sp;
}

void main() {
  var n = 0;

  // 1) תיוג-מחדש
  final s1 = <dynamic>[
    {'id': 's1', 'hist': [{'txn': 'T1', 'clearer': 'נדרים'}]}
  ];
  final o1 = repairCardsFromRows(s1, <dynamic>[{'txnId': 'T1'}], 'סולה', fill);
  final sup1 = o1['supporters'] as List;
  if (o1['relabeled'] != 1 || o1['enriched'] != 0) {
    throw StateError('FAIL ex1 counts: ${o1['relabeled']}/${o1['enriched']}');
  }
  if ((sup1[0]['hist'] as List)[0]['clearer'] != 'סולה') {
    throw StateError('FAIL ex1 label');
  }
  n++;

  // 2) אידמפוטנטיות — הרצה שנייה על הפלט ⇒ 0/0, אותה הפניה
  final o2 = repairCardsFromRows(sup1, <dynamic>[{'txnId': 'T1'}], 'סולה', fill);
  if (o2['relabeled'] != 0 || o2['enriched'] != 0) {
    throw StateError('FAIL ex2 counts');
  }
  if (!identical((o2['supporters'] as List)[0], sup1[0])) {
    throw StateError('FAIL ex2 אינה אותה הפניה');
  }
  n++;

  // 3) העשרה — מילוי-אם-ריק
  final o3 = repairCardsFromRows(
      <dynamic>[
        {'id': 's1', 'phone': '', 'hist': [{'txn': 'T1', 'clearer': 'סולה'}]}
      ],
      <dynamic>[{'txnId': 'T1', 'phone': '0501234567'}],
      'סולה',
      fill);
  if (o3['relabeled'] != 0 || o3['enriched'] != 1) {
    throw StateError('FAIL ex3 counts: ${o3['relabeled']}/${o3['enriched']}');
  }
  if ((o3['supporters'] as List)[0]['phone'] != '0501234567') {
    throw StateError('FAIL ex3 phone');
  }
  n++;

  // 4) נפילת-מפתח ל-ref/reference
  final o4 = repairCardsFromRows(
      <dynamic>[
        {'id': 's1', 'hist': [{'ref': 'R9', 'clearer': 'x'}]}
      ],
      <dynamic>[{'txnId': '', 'reference': 'R9'}],
      'סולה',
      fill);
  if (o4['relabeled'] != 1) throw StateError('FAIL ex4');
  n++;

  // 5) רשומות בלי מפתח ⇒ 0/0 והמערך המוחזר === הנכנס
  final s5 = <dynamic>[
    {'id': 's1', 'hist': [{'txn': 'T1'}]}
  ];
  final o5 = repairCardsFromRows(s5, <dynamic>[{'txnId': '', 'reference': ''}], 'סולה', fill);
  if (o5['relabeled'] != 0 || o5['enriched'] != 0) {
    throw StateError('FAIL ex5 counts');
  }
  if (!identical(o5['supporters'], s5)) throw StateError('FAIL ex5 אותו מערך');
  n++;

  // 6) כפילות-מפתח — הראשון גובר
  final o6 = repairCardsFromRows(
      <dynamic>[
        {'id': 's1', 'hist': [{'txn': 'T1', 'clearer': 'סולה'}]}
      ],
      <dynamic>[
        {'txnId': 'T1', 'phone': '050'},
        {'txnId': 'T1', 'phone': '052'}
      ],
      'סולה',
      fill);
  if ((o6['supporters'] as List)[0]['phone'] != '050' || o6['enriched'] != 1) {
    throw StateError('FAIL ex6');
  }
  n++;

  // 7) כרטיס לא-קשור חוזר באותה הפניה
  final s7 = <dynamic>[
    {'id': 's1', 'hist': [{'txn': 'ZZ'}]}
  ];
  final o7 = repairCardsFromRows(s7, <dynamic>[{'txnId': 'T1'}], 'סולה', fill);
  if (!identical((o7['supporters'] as List)[0], s7[0])) {
    throw StateError('FAIL ex7 אינה אותה הפניה');
  }
  n++;

  assert(n == 7, 'assert-live guard');
  print('OK repairCardsFromRows: $n asserts passed');
}
