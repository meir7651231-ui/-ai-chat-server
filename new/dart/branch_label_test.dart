import '../dart-data/branch_label-terms.dart' as td_branch_label;
// בדיקת-חוזה · branchLabel — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/branch_label_test.dart
import 'branch_label.dart';

// שקע-הבדיקה: ערכי-המקור verbatim (install_engine.dart:934).
const List<String> _letters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י'];

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — ענף-האותיות (i < length) —
  _eq(branchLabel(0, letters: _letters, term: (k)=>td_branch_label.kTerms[k]!), 'ענף א', '1 i=0');   n++;
  _eq(branchLabel(1, letters: _letters, term: (k)=>td_branch_label.kTerms[k]!), 'ענף ב', '2 i=1');   n++;
  _eq(branchLabel(2, letters: _letters, term: (k)=>td_branch_label.kTerms[k]!), 'ענף ג', '3 i=2');   n++;
  _eq(branchLabel(9, letters: _letters, term: (k)=>td_branch_label.kTerms[k]!), 'ענף י', '4 i=9 last'); n++;

  // — ענף-המספר (i >= length) —
  _eq(branchLabel(10, letters: _letters, term: (k)=>td_branch_label.kTerms[k]!), 'ענף 11', '5 i=10');  n++;
  _eq(branchLabel(11, letters: _letters, term: (k)=>td_branch_label.kTerms[k]!), 'ענף 12', '6 i=11');  n++;
  _eq(branchLabel(99, letters: _letters, term: (k)=>td_branch_label.kTerms[k]!), 'ענף 100', '7 i=99'); n++;

  // — עדשה-עוינת: רשימה-ריקה / קטנה —
  _eq(branchLabel(0, letters: const [], term: (k)=>td_branch_label.kTerms[k]!), 'ענף 1', '8 empty->1');   n++;
  _eq(branchLabel(0, letters: const ['ז'], term: (k)=>td_branch_label.kTerms[k]!), 'ענף ז', '9 single hit'); n++;
  _eq(branchLabel(1, letters: const ['ז'], term: (k)=>td_branch_label.kTerms[k]!), 'ענף 2', '10 single overflow'); n++;

  // — עדשה-עוינת: i שלילי ⇒ RangeError (נאמנות-מקור, אין מגן-שלילי) —
  var threw = false;
  try {
    branchLabel(-1, letters: _letters, term: (k)=>td_branch_label.kTerms[k]!);
  } on RangeError {
    threw = true;
  }
  if (!threw) throw StateError('FAIL [11 negative]: expected RangeError');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(branchLabel(0, letters: _letters, term: (k)=>td_branch_label.kTerms[k]!) == 'ענף א', 'assert-live guard');

  print('OK branchLabel: $n asserts passed');
}
