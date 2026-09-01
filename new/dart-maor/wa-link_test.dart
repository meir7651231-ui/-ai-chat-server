// בדיקת wa-link — כל דוגמאות-החוזה + אימות-השקע מבדיקת-ה-JS (wa-link.test.mjs).
// כשל ⇒ StateError; סיום ירוק ⇒ OK.
import 'wa-link.dart';

void ok(bool cond, String msg) {
  if (!cond) throw StateError('✗ ' + msg);
}

void main() {
  // שקע-דמה לפי החוזה: '050-123-4567' ⇒ '972501234567', כל השאר ⇒ null
  dynamic dig(dynamic p) => p == '050-123-4567' ? '972501234567' : null;

  // 6 דוגמאות-החוזה המחייבות (זהות לבדיקת-ה-JS)
  final cases = [
    ['050-123-4567', '', 'https://wa.me/972501234567'],
    ['לא-טלפון', 'היי', null],
    [
      '050-123-4567',
      'שלום',
      'https://wa.me/972501234567?text=%D7%A9%D7%9C%D7%95%D7%9D'
    ],
    [
      '050-123-4567',
      '  היי  ',
      'https://wa.me/972501234567?text=%D7%94%D7%99%D7%99'
    ],
    ['050-123-4567', '   ', 'https://wa.me/972501234567'],
    ['050-123-4567', 'hi there', 'https://wa.me/972501234567?text=hi%20there'],
  ];
  for (final c in cases) {
    final got = waLink(c[0], c[1], dig);
    ok(got == c[2], 'waLink(${c[0]}, ${c[1]}) ⇒ $got ≠ ${c[2]}');
  }

  // השקע מקבל את phone כלשונו
  dynamic seen;
  waLink('050-123-4567', '', (p) {
    seen = p;
    return null;
  });
  ok(seen == '050-123-4567', 'השקע לא קיבל את phone כלשונו: $seen');

  // חוק-16: ‏U+0085 אינו רווח-ES — אסור שייגזם (String.trim של Dart היה גוזם)
  final u85 = waLink('050-123-4567', '', dig);
  ok(u85 == 'https://wa.me/972501234567?text=%C2%85',
      'U+0085 נגזם בטעות או קודד שגוי: $u85');

  // חוק-7: שקע שמחזיר '' (falsy ב-JS) ⇒ null
  ok(waLink('כל-דבר', '', (p) => '') == null, "שקע-'' לא נפל ל-null");

  print('OK — wa-link: 6 דוגמאות-חוזה + שקע-כלשונו + ES-trim + falsy — ירוק');
}
