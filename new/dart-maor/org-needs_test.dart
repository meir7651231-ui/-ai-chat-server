// בדיקת-חוזה (רתמת-זהב) · orgNeeds — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/org-needs.test.mjs
// (אותם קלטים→פלטים; n.id/n.emoji/n.label ב-JS ⇒ n['id']/n['emoji']/n['label']):
//   1) אורך = 7
//   2) הרשומה הראשונה = {crm,👥,ניהול לקוחות ואנשי קשר}
//   3) הרשומה האחרונה = {backup,🔒,גיבוי ואבטחת מידע}
//   4) סדר-ה-id = crm,billing,schedule,inventory,reports,multi,backup
//   5) billing = {🧾,גבייה, תשלומים וקבלות}
//   6) ייחודיות (7 id-ים שונים) + כל השדות מלאים
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/org-needs_test.dart  ⇒ exit 0
import 'org-needs.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;
  final needs = orgNeeds;

  // 1) בדיוק 7
  _ok(needs.length == 7, 'length ≠ 7');
  n++;

  // 2) הראשון
  _ok(
    needs[0]['id'] == 'crm' &&
        needs[0]['emoji'] == '👥' &&
        needs[0]['label'] == 'ניהול לקוחות ואנשי קשר',
    'הרשומה הראשונה שגויה',
  );
  n++;

  // 3) האחרון
  _ok(
    needs[6]['id'] == 'backup' &&
        needs[6]['emoji'] == '🔒' &&
        needs[6]['label'] == 'גיבוי ואבטחת מידע',
    'הרשומה האחרונה שגויה',
  );
  n++;

  // 4) סדר-ה-id המחייב
  _ok(
    needs.map((x) => x['id']).join(',') ==
        'crm,billing,schedule,inventory,reports,multi,backup',
    'סדר-ה-id שגוי',
  );
  n++;

  // 5) billing
  final billing = needs.firstWhere((x) => x['id'] == 'billing');
  _ok(
    billing['emoji'] == '🧾' && billing['label'] == 'גבייה, תשלומים וקבלות',
    'billing שגוי',
  );
  n++;

  // 6) ייחודיות + שדות מלאים
  _ok(needs.map((x) => x['id']).toSet().length == 7, 'id כפול');
  _ok(
    needs.every(
      (x) =>
          x['id'] is String &&
          x['id']!.isNotEmpty &&
          x['emoji'] is String &&
          x['emoji']!.isNotEmpty &&
          x['label'] is String &&
          x['label']!.isNotEmpty,
    ),
    'שדה חסר/ריק',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    orgNeeds.map((x) => x['id']).join(',') ==
        'crm,billing,schedule,inventory,reports,multi,backup',
    'assert-live guard',
  );

  print('OK orgNeeds: $n asserts passed');
}
