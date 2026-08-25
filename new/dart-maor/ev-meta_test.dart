// בדיקת-חוזה (רתמת-זהב) · evMeta — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/ev-meta.test.mjs:
//   1) Object.keys(M).length === 8
//   2) כל שמונת המפתחות קיימים
//   3) reminder: label='תזכורת', bg='#efe7f3', c='#7c3aed'
//   4) call: label='טלפון', c='#0f766e'
//   5) wedding.bg='#fdeee0'
//   6) bday.bg===anniversary.bg && bday.c===anniversary.c
//   7) bday.label='יום הולדת', anniversary.label='יום נישואים'
//   8) org/custom זהים: label='אירוע', bg='#e7edf5', c='#3a5a86'
//   9) לכל סוג: bg ו-c תואמים /^#[0-9a-f]{6}$/
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/ev-meta_test.dart  ⇒ exit 0
import 'ev-meta.dart';

void main() {
  var n = 0;
  final m = evMeta;

  // 1) מספר סוגים = 8.
  assert(m.length == 8, 'FAIL: מספר סוגים ${m.length} ≠ 8');
  n++;

  // 2) כל שמונת המפתחות קיימים.
  for (final k in const [
    'reminder',
    'call',
    'wedding',
    'memorial',
    'anniversary',
    'bday',
    'org',
    'custom'
  ]) {
    assert(m.containsKey(k), 'FAIL: חסר סוג $k');
    n++;
  }

  // 3) reminder שלם.
  assert(
      m['reminder']!['label'] == 'תזכורת' &&
          m['reminder']!['bg'] == '#efe7f3' &&
          m['reminder']!['c'] == '#7c3aed',
      'FAIL: reminder שבור');
  n++;

  // 4) call: label + c.
  assert(m['call']!['label'] == 'טלפון' && m['call']!['c'] == '#0f766e',
      'FAIL: call שבור');
  n++;

  // 5) wedding.bg.
  assert(m['wedding']!['bg'] == '#fdeee0', 'FAIL: wedding.bg שבור');
  n++;

  // 6) bday/anniversary — פיגמנטים זהים.
  assert(
      m['bday']!['bg'] == m['anniversary']!['bg'] &&
          m['bday']!['c'] == m['anniversary']!['c'],
      'FAIL: bday/anniversary פיגמנטים אמורים להיות זהים');
  n++;

  // 7) תוויות bday/anniversary.
  assert(
      m['bday']!['label'] == 'יום הולדת' &&
          m['anniversary']!['label'] == 'יום נישואים',
      'FAIL: תוויות bday/anniversary');
  n++;

  // 8) org/custom זהים ובעלי ערכים מדויקים.
  assert(
      m['org']!['label'] == 'אירוע' &&
          m['custom']!['label'] == 'אירוע' &&
          m['org']!['bg'] == m['custom']!['bg'] &&
          m['org']!['c'] == m['custom']!['c'] &&
          m['org']!['bg'] == '#e7edf5' &&
          m['org']!['c'] == '#3a5a86',
      'FAIL: org/custom אמורים להיות זהים');
  n++;

  // 9) כל bg ו-c הם hex-7 תקין (#רצף-6 hex קטן).
  final hex = RegExp(r'^#[0-9a-f]{6}$');
  m.forEach((k, v) {
    assert(hex.hasMatch(v['bg']!), 'FAIL: $k.bg אינו hex-7');
    n++;
    assert(hex.hasMatch(v['c']!), 'FAIL: $k.c אינו hex-7');
    n++;
  });

  print('OK evMeta: $n asserts passed');
}
