// בדיקת-חוזה · auditLine — מייבאת אך ורק את האטום-שלה (חוק-4).
// golden אפיון: הפלטים נקבעו מהתנהגות-המקור (edit_safety.dart:484-488) —
// התבנית '⛔ $opTag · $opId · $reasonHe' (⛔=U+26D4, תיחום=' · ' עם U+00B7).
// הרצה: dart run --enable-asserts new/dart/audit_line_test.dart
import 'audit_line.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — מסלול-טיפוסי: כל שדה מלא —
  _eq(
    auditLine(opTag: 'setText', opId: 'nav.home', reasonHe: 'נעול לתפקיד'),
    '⛔ setText · nav.home · נעול לתפקיד',
    '1 typical',
  );
  n++;
  _eq(
    auditLine(
        opTag: 'setHidden', opId: 'btn.confirmOrder', reasonHe: 'רצפת-תפקיד'),
    '⛔ setHidden · btn.confirmOrder · רצפת-תפקיד',
    '2 hidden',
  );
  n++;

  // — כל 6 תגיות-הפעולה (ConfigOp variants) עוברות אחיד דרך opTag —
  _eq(auditLine(opTag: 'setEmoji', opId: 'x', reasonHe: 'r'),
      '⛔ setEmoji · x · r', '3 setEmoji');
  n++;
  _eq(auditLine(opTag: 'setStyle', opId: 'x', reasonHe: 'r'),
      '⛔ setStyle · x · r', '4 setStyle');
  n++;
  _eq(auditLine(opTag: 'setAction', opId: 'x', reasonHe: 'r'),
      '⛔ setAction · x · r', '5 setAction');
  n++;

  // — קצה: opId ריק ⇒ שני רווחים סביב-הריק (' · ' + '' + ' · ') —
  _eq(auditLine(opTag: 'setOrder', opId: '', reasonHe: 'r'),
      '⛔ setOrder ·  · r', '6 empty id');
  n++;

  // — קצה: reasonHe ריק ⇒ מתחם-נגרר ואז ריק —
  _eq(auditLine(opTag: 'setEmoji', opId: 'x', reasonHe: ''),
      '⛔ setEmoji · x · ', '7 empty reason');
  n++;

  // — עדשה-עוינת: תו-המתחם בתוך ערך נשמר verbatim (אין escaping) —
  _eq(auditLine(opTag: 'setStyle', opId: 'id1', reasonHe: 'a · b'),
      '⛔ setStyle · id1 · a · b', '8 separator-in-value');
  n++;

  // — קצה קיצוני: כל השדות ריקים ⇒ שלד-התבנית בלבד —
  _eq(auditLine(opTag: '', opId: '', reasonHe: ''),
      '⛔  ·  · ', '9 all empty');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    auditLine(opTag: 'setText', opId: 'nav.home', reasonHe: 'נעול לתפקיד') ==
        '⛔ setText · nav.home · נעול לתפקיד',
    'assert-live guard',
  );

  print('OK auditLine: $n asserts passed');
}
