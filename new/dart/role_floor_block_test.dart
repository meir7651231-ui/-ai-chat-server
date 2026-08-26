// בדיקת-חוזה · roleFloorBlock — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/role_floor_block_test.dart
import 'role_floor_block.dart';

String? _s({
  required String labelHe,
  required String roleFloor,
  required bool nav,
  required String? persona,
}) =>
    roleFloorBlock(
      labelHe: labelHe,
      roleFloor: roleFloor,
      isNavStructural: nav,
      persona: persona,
      contractorRole: 'contractor',
    );

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  // 1 — גלובלי + מבני-ניווט.
  _eq(
    _s(labelHe: 'תפריט', roleFloor: 'manager', nav: true, persona: null),
    'אי-אפשר להסתיר «תפריט» מכל הפרסונות (כולל קבלן) — רכיב ניווט חייב להישאר גלוי',
    '1 global nav',
  );
  n++;

  // 2 — גלובלי, floor≠קבלן, לא-מבני.
  _eq(
    _s(labelHe: 'דוח', roleFloor: 'manager', nav: false, persona: null),
    'אי-אפשר להסתיר «דוח» מכל הפרסונות — הרכיב חייב להישאר גלוי לתפקיד «manager»',
    '2 global floor',
  );
  n++;

  // 3 — גלובלי, floor=קבלן, לא-מבני ⇒ מותר.
  _eq(_s(labelHe: 'באנר', roleFloor: 'contractor', nav: false, persona: null),
      null, '3 global contractor ok'); n++;

  // 4 — פרסונה-בודדת מסתירה מהתפקיד-הקריטי-של-עצמה.
  _eq(
    _s(labelHe: 'דוח', roleFloor: 'manager', nav: false, persona: 'manager'),
    'אי-אפשר להסתיר «דוח» מהתפקיד «manager» — קריטי לתפקיד זה',
    '4 single critical',
  );
  n++;

  // 5 — פרסונה אחרת ⇒ מותר.
  _eq(_s(labelHe: 'דוח', roleFloor: 'manager', nav: false, persona: 'courier'),
      null, '5 single other ok'); n++;

  // 6 — floor=קבלן במסלול-בודד ⇒ מותר גם כשמסתירים ממנו.
  _eq(_s(labelHe: 'באנר', roleFloor: 'contractor', nav: false, persona: 'contractor'),
      null, '6 single contractor ok'); n++;

  // 7 — persona ריק = גלובלי (isGlobal על מחרוזת ריקה).
  _eq(
    _s(labelHe: 'דוח', roleFloor: 'manager', nav: false, persona: ''),
    'אי-אפשר להסתיר «דוח» מכל הפרסונות — הרכיב חייב להישאר גלוי לתפקיד «manager»',
    '7 empty persona = global',
  );
  n++;

  assert(
    _s(labelHe: 'x', roleFloor: 'contractor', nav: false, persona: null) == null,
    'assert-live guard',
  );
  print('OK roleFloorBlock: $n asserts passed');
}
