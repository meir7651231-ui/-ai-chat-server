/// בדיקת-חוזה · term-of — דריסה/נפילה/ריק/רווחים/חוסר-terms (שיקוף term-of.test.mjs).
import 'term-of.dart';

void expectEq(dynamic actual, dynamic expected, String label) {
  if (actual != expected) {
    throw StateError('$label: ציפינו "$expected" קיבלנו "$actual"');
  }
}

void main() {
  // דריסה קיימת ⇒ הדריסה
  expectEq(
      termOf({
        'terms': {'member': 'תלמידה'}
      }, 'member', 'חבר'),
      'תלמידה',
      'דריסה');
  // trim
  expectEq(
      termOf({
        'terms': {'member': '  תלמידה  '}
      }, 'member', 'חבר'),
      'תלמידה',
      'trim');
  // רווחים-בלבד = אין דריסה
  expectEq(
      termOf({
        'terms': {'member': '   '}
      }, 'member', 'חבר'),
      'חבר',
      'רווחים');
  // terms ריק
  expectEq(termOf({'terms': {}}, 'member', 'חבר'), 'חבר', 'terms ריק');
  // terms חסר — לא זורק (ערבות 3)
  expectEq(termOf({}, 'member', 'חבר'), 'חבר', 'terms חסר');
  // לא-מחרוזת ⇒ fallback
  expectEq(
      termOf({
        'terms': {'member': 7}
      }, 'member', 'חבר'),
      'חבר',
      'לא-מחרוזת');
  // חוק-16: ‏U+0085 (NEL) אינו נגזם ב-JS ⇒ הדריסה נשמרת כלשונה
  expectEq(
      termOf({
        'terms': {'member': ''}
      }, 'member', 'חבר'),
      '',
      'NEL לא נגזם (חוק-16)');
  // חוק-16: ‏NBSP+BOM כן נגזמים ⇒ רווחים-בלבד = fallback
  expectEq(
      termOf({
        'terms': {'member': ' ﻿'}
      }, 'member', 'חבר'),
      'חבר',
      'NBSP+BOM נגזמים');

  print('OK');
}
