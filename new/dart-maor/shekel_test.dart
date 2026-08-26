// בדיקת-חוזה (ratchet) לאטום shekel — הרצה:
//   dart run --enable-asserts shekel_test.dart
// כוללת את 12 הקלטות-ה-Golden (new/atoms/shekel.test.mjs) + הקלטות-ההסגר
// (שליליים ו--0) שתפס האימות-העוין: `toLocaleString('he-IL')` מזריק U+200E
// לפני המינוס, וגם -0 (Math.round של [-0.5,0)) מקבל '‎-0'.

import 'shekel.dart';

const String lrm = '‎'; // U+200E — סימן-שמאל-לימין (הזרקת he-IL לפני מינוס)

void _eq(Object? input, String want, String label) {
  final String got = shekel(input);
  if (got != want) {
    throw StateError('✗ $label: shekel(${input is String ? '"$input"' : input}) '
        '⇒ "$got" ≠ "$want"');
  }
}

void main() {
  // ── 12 הקלטות-Golden (זהות ל-shekel.test.mjs) ──────────────────────────────
  _eq('', '₪0', 'golden/empty');
  _eq('אבג', '₪NaN', 'golden/hebrew-word');
  _eq('כהן לוי', '₪NaN', 'golden/hebrew-name');
  _eq('abc', '₪NaN', 'golden/latin');
  _eq('a@b.com', '₪NaN', 'golden/email');
  _eq('2026-08-24', '₪NaN', 'golden/date');
  _eq('2026-08-24T12:00:00', '₪NaN', 'golden/datetime');
  _eq('0501234567', '₪501,234,567', 'golden/phone-as-number');
  _eq('03-1234567', '₪NaN', 'golden/phone-dashed');
  _eq('https://x.co', '₪NaN', 'golden/url');
  _eq('שלום עולם', '₪NaN', 'golden/hebrew-sentence');
  _eq('12', '₪12', 'golden/small-int');

  // ── הקלטות-ההסגר: שליליים + -0 עם סימן-RTL (הבאג שנפל באימות-העוין) ─────────
  _eq(-1, '₪${lrm}-1', 'quarantine/neg-1');
  _eq(-1000, '₪${lrm}-1,000', 'quarantine/neg-1000');
  _eq(-1234567, '₪${lrm}-1,234,567', 'quarantine/neg-1234567');
  _eq(-0.5, '₪${lrm}-0', 'quarantine/round-to-neg-zero');
  _eq(-0.0, '₪${lrm}-0', 'quarantine/neg-zero');

  // ── שפיות נוספת: חיובי מקובץ, עיגול-חצי-מעלה, אפס-חיובי ────────────────────
  _eq(1234567, '₪1,234,567', 'sanity/pos-grouped');
  _eq(2.5, '₪3', 'sanity/round-half-up');
  _eq(0, '₪0', 'sanity/pos-zero');
  _eq(1000, '₪1,000', 'sanity/thousand');

  print('✓ shekel: כל ההקלטות (Golden + הסגר + שפיות) — ירוק');
}
