// בדיקת-חוזה (רתמת-זהב) · buildIcs — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/build-ics.test.mjs (6 דוגמאות).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/build-ics_test.dart  ⇒ exit 0
import 'build-ics.dart';

// — שקעים מקומיים לבדיקה, verbatim מ-build-ics.test.mjs —
// icsEscape אמיתי-מינימלי; foldIcsLine=זהות (הקיפול נבדק באטום שלו).
String icsEscape(String s) => s
    .replaceAll('\\', '\\\\')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,')
    .replaceAll(RegExp(r'\r?\n'), '\\n');

List<String> foldIcsLine(String line) => [line];

// now = Date.UTC(2026, 7, 24, 10, 0, 0) ב-JS ⇒ month-index 7 = אוגוסט;
// ב-Dart DateTime.utc month 1-בסיס ⇒ 8 (המרת getMonth 0↔1 גם בקלט-הבדיקה).
final now = DateTime.utc(2026, 8, 24, 10, 0, 0);

String b(List<Map<String, String?>> occ, [String name = 'לוח']) =>
    buildIcs(occ, name, now, icsEscape, foldIcsLine);

List<String> linesOf(String s) => s.split('\r\n');

int _n = 0;

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n  got : $got\n  want: $want');
  }
  _n++;
}

void _has(List<String> lines, String item, String label) {
  if (!lines.contains(item)) {
    throw StateError('FAIL [$label]: line "$item" missing in\n  $lines');
  }
  _n++;
}

void _true(bool cond, String label) {
  if (!cond) throw StateError('FAIL [$label]');
  _n++;
}

void main() {
  // 1 — אפס מופעים
  _eq(
    b([]),
    'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//maor-system//he//\r\n'
        'CALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:לוח\r\nEND:VCALENDAR\r\n',
    '1 · קובץ-ריק',
  );

  // 2 — מופע עם שעה
  final l2 = linesOf(b([
    {'uid': 'u1', 'title': 'פגישה', 'date': '2026-08-24', 'time': '19:30'}
  ]));
  for (final w in [
    'UID:u1',
    'DTSTAMP:20260824T100000Z',
    'DTSTART:20260824T193000',
    'DTEND:20260824T203000',
    'SUMMARY:פגישה'
  ]) {
    _has(l2, w, '2 · $w');
  }
  _true(
    !l2.any((x) => x.startsWith('DESCRIPTION') || x.startsWith('LOCATION')),
    '2 · בלי DESCRIPTION/LOCATION',
  );

  // 3 — גלגול-חצות
  final l3 = linesOf(b([
    {'uid': 'u1', 'title': 'ליל', 'date': '2026-08-24', 'time': '23:30'}
  ]));
  _has(l3, 'DTEND:20260825T003000', '3 · DTEND למחרת');

  // 4 — בלי שעה ⇒ יום-שלם
  final l4 = linesOf(b([
    {'uid': 'u1', 'title': 'יום', 'date': '2026-08-24', 'time': ''}
  ]));
  _has(l4, 'DTSTART;VALUE=DATE:20260824', '4 · DTSTART יום-שלם');
  _has(l4, 'DTEND;VALUE=DATE:20260825', '4 · DTEND יום-המחרת');

  // 5 — שעות מושחתות ⇒ נפילה בטוחה ליום-שלם
  for (final t in ['25:00', '9:00']) {
    final l5 = linesOf(b([
      {'uid': 'u1', 'title': 'יום', 'date': '2026-08-24', 'time': t}
    ]));
    _true(
      l5.contains('DTSTART;VALUE=DATE:20260824') &&
          l5.contains('DTEND;VALUE=DATE:20260825'),
      "5 · '$t' ⇒ יום-שלם",
    );
    _true(
      !l5.any((x) => RegExp(r'^DTSTART:\d').hasMatch(x)),
      "5 · '$t' בלי DTSTART שעתי",
    );
  }

  // 6 — escaping דרך השקע
  final l6 = linesOf(b([
    {
      'uid': 'u1',
      'title': 'א,ב',
      'date': '2026-08-24',
      'time': '',
      'notes': 'שורה1\nשורה2',
      'location': 'אולם; ראשי'
    }
  ]));
  _has(l6, 'SUMMARY:א\\,ב', '6 · SUMMARY מנוקה');
  _has(l6, 'DESCRIPTION:שורה1\\nשורה2', '6 · DESCRIPTION מנוקה');
  _has(l6, 'LOCATION:אולם\\; ראשי', '6 · LOCATION מנוקה');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(b([]).startsWith('BEGIN:VCALENDAR'), 'assert-live guard');

  print('OK buildIcs: $_n asserts passed — 6 דוגמאות-חוזה verbatim, Dart≡JS');
}
