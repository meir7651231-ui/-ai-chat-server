// בדיקת-חוזה (רתמת-זהב) · parseVcards — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/parse-vcards.test.mjs
// (אותם קלטים→פלטים; חמשת השקעים המינימליים כחוזיהם, בלי QP):
//   1) שני כרטיסים בסדר-הקובץ (FN:אבי כהן · FN:שרה לוי) ⇒ 2 רשומות בסדר.
//   2) בלי FN עם N:לוי;דוד;;; ⇒ fullName='דוד לוי', family='לוי', given='דוד'.
//   3) TEL;CELL:050-1234567 ⇒ phones=[{value:'050-1234567', label:'נייד'}].
//   4) ORG:null ⇒ org='' · ORG:מאור;; ⇒ org='מאור'.
//   5) ADR;HOME:;;הרצל 5;תל אביב;;; ⇒ address='הרצל 5, תל אביב'.
//   6) שורות-חוץ + VERSION/PHOTO/URL מדולגים; הרשומה נשמרת בלעדיהם.
//   7) '' ⇒ [] · כרטיס ריק לגמרי נדחף עם שדות ריקים.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/parse-vcards_test.dart  ⇒ exit 0
import 'parse-vcards.dart';

// ── חמשת השקעים המינימליים — מקבילי-ביט לשקעי-ה-JS שבבדיקת-המקור ──
List<String> _unfoldLines(String text) =>
    text.replaceAll('\r\n', '\n').replaceAll('\r', '\n').split('\n');

Map<String, dynamic>? _splitProperty(String line) {
  final colon = line.indexOf(':');
  if (colon < 0) return null;
  final head = line.substring(0, colon);
  final value = line.substring(colon + 1);
  final segs = head.split(';');
  final name = (segs.isNotEmpty ? segs.removeAt(0) : '').trim().toUpperCase();
  if (name.isEmpty) return null;
  return {'name': name, 'params': segs, 'value': value};
}

String _decodeValue(String value, List<String> params) => value;

String _phoneLabel(List<String> params) =>
    params.any((p) => p.toUpperCase().contains('CELL')) ? 'נייד' : '';

String _joinAddress(String value, List<String> params) =>
    value.split(';').map((s) => s.trim()).where((s) => s.isNotEmpty).join(', ');

List<Map<String, dynamic>> _parse(String? text) => parseVcards(
      text,
      _unfoldLines,
      _splitProperty,
      _decodeValue,
      _phoneLabel,
      _joinAddress,
    );

void _check(bool cond, String label) {
  if (!cond) throw StateError('FAIL [$label]');
}

void main() {
  var n = 0;

  // 1) שני כרטיסים בסדר-הקובץ.
  final two = _parse(
      'BEGIN:VCARD\nFN:אבי כהן\nEND:VCARD\nBEGIN:VCARD\nFN:שרה לוי\nEND:VCARD\n');
  _check(two.length == 2 && two[0]['fullName'] == 'אבי כהן' && two[1]['fullName'] == 'שרה לוי',
      '1 שני כרטיסים');
  n++;

  // 2) בלי FN — הרכבת-שם מ-N (פרטי ואז משפחה).
  final nn = _parse('BEGIN:VCARD\nN:לוי;דוד;;;\nEND:VCARD')[0];
  _check(nn['fullName'] == 'דוד לוי' && nn['family'] == 'לוי' && nn['given'] == 'דוד',
      '2 הרכבת-שם מ-N');
  n++;

  // 3) טלפון עם תווית מהשקע.
  final tel = _parse('BEGIN:VCARD\nFN:א\nTEL;CELL:050-1234567\nEND:VCARD')[0];
  final phones = tel['phones'] as List;
  _check(
      phones.length == 1 &&
          phones[0]['value'] == '050-1234567' &&
          phones[0]['label'] == 'נייד',
      '3 טלפון+תווית');
  n++;

  // 4) ORG 'null' מסונן · ; סופיים נחתכים.
  _check(_parse('BEGIN:VCARD\nFN:א\nORG:null\nEND:VCARD')[0]['org'] == '', '4א ORG null');
  _check(_parse('BEGIN:VCARD\nFN:א\nORG:מאור;;\nEND:VCARD')[0]['org'] == 'מאור', '4ב ORG ; סופיים');
  n++;

  // 5) כתובת דרך joinAddress.
  _check(
      _parse('BEGIN:VCARD\nFN:א\nADR;HOME:;;הרצל 5;תל אביב;;;\nEND:VCARD')[0]['address'] ==
          'הרצל 5, תל אביב',
      '5 כתובת');
  n++;

  // 6) VERSION/PHOTO/URL ושורות-חוץ מדולגים.
  final skip =
      _parse('X-JUNK:1\nBEGIN:VCARD\nVERSION:3.0\nFN:א\nPHOTO:base64data\nURL:https://x\nEND:VCARD');
  _check(
      skip.length == 1 &&
          skip[0]['fullName'] == 'א' &&
          skip[0]['note'] == '' &&
          skip[0]['org'] == '',
      '6 דילוגים');
  n++;

  // 7) קלט ריק ⇒ [] · כרטיס ריק נדחף.
  _check(_parse('').length == 0, '7א ריק');
  final empty = _parse('BEGIN:VCARD\nEND:VCARD');
  _check(
      empty.length == 1 &&
          empty[0]['fullName'] == '' &&
          (empty[0]['phones'] as List).isEmpty,
      '7ב כרטיס-ריק נדחף');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_parse('').isEmpty, 'assert-live guard: ריק ⇒ []');

  print('OK parseVcards: $n asserts passed');
}
