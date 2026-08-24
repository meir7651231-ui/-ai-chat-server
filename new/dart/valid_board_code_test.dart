// בדיקת-חוזה · validBoardCode — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/valid_board_code_test.dart
import 'valid_board_code.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
  assert(got == want, 'assert [$label]');
}

void main() {
  var n = 0;

  // — קלט תקין: 4 ספרות עם/בלי מפרידים —
  _eq(validBoardCode('1234'), true, '1 four digits');            n++;
  _eq(validBoardCode('12-34'), true, '2 dash stripped');         n++;
  _eq(validBoardCode('12 34'), true, '3 space stripped');        n++;
  _eq(validBoardCode(' 1 2-3 4 '), true, '4 spaces+dash');       n++;
  _eq(validBoardCode('1-2-3-4'), true, '5 all dashes');          n++;
  _eq(validBoardCode('\t1234\n'), true, '6 tab+newline are \\s'); n++;

  // — קלט פסול: אורך שגוי —
  _eq(validBoardCode('123'), false, '7 three digits');           n++;
  _eq(validBoardCode('12345'), false, '8 five digits');          n++;
  _eq(validBoardCode(''), false, '9 empty');                     n++;
  _eq(validBoardCode('----'), false, '10 all stripped to empty'); n++;

  // — עדשה-עוינת: רק [\s-] מוסר, לא \D (הבחנה מ-waMeDigits) —
  _eq(validBoardCode('12a4'), false, '11 letter not stripped');  n++;
  _eq(validBoardCode('12.34'), false, '12 dot not stripped');    n++;
  _eq(validBoardCode('(12)34'), false, '13 parens not stripped'); n++;
  _eq(validBoardCode('+1234'), false, '14 plus not stripped');   n++;
  _eq(validBoardCode('١٢٣٤'), false, '15 arabic-indic, \\d ASCII only'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(validBoardCode('1234') == true, 'assert-live guard');

  print('OK validBoardCode: $n asserts passed');
}
