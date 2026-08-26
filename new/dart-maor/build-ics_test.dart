// gold-test ל-buildIcs (Dart) — 6 דוגמאות-החוזה מ-new/atoms/build-ics.test.mjs
// + דוגמת-ההסגר (24:00 ⇒ אירוע שעתי המתגלגל למחרת, כמו V8). run --enable-asserts.
import 'build-ics.dart';

// שקעים מקומיים לבדיקה — icsEscape אמיתי-מינימלי; foldIcsLine=זהות.
String icsEscape(String s) => s
    .replaceAll('\\', '\\\\')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,')
    .replaceAll(RegExp(r'\r?\n'), '\\n');
List<String> foldIcsLine(String line) => [line];

final now = DateTime.utc(2026, 8, 24, 10, 0, 0);
String B(List<Map<String, String?>> occ, [String name = 'לוח']) =>
    buildIcs(occ, name, now, icsEscape, foldIcsLine);
List<String> linesOf(String s) => s.split('\r\n');

int f = 0;
void ok(String name, bool cond, [String extra = '']) {
  if (!cond) {
    print('✗ $name $extra');
    f = 1;
  }
}

void eq(String name, String got, String want) =>
    ok(name, got == want, '\n  $got\n≠ $want');

void main() {
  // 1 — אפס מופעים
  eq('1 · קובץ-ריק', B([]),
      'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//maor-system//he//\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:לוח\r\nEND:VCALENDAR\r\n');

  // 2 — מופע עם שעה
  final l2 = linesOf(B([
    {'uid': 'u1', 'title': 'פגישה', 'date': '2026-08-24', 'time': '19:30'}
  ]));
  for (final w in ['UID:u1', 'DTSTAMP:20260824T100000Z', 'DTSTART:20260824T193000', 'DTEND:20260824T203000', 'SUMMARY:פגישה']) {
    ok('2 · $w', l2.contains(w));
  }
  ok('2 · בלי DESCRIPTION/LOCATION',
      !l2.any((x) => x.startsWith('DESCRIPTION') || x.startsWith('LOCATION')));

  // 3 — גלגול-חצות
  final l3 = linesOf(B([
    {'uid': 'u1', 'title': 'ליל', 'date': '2026-08-24', 'time': '23:30'}
  ]));
  ok('3 · DTEND למחרת', l3.contains('DTEND:20260825T003000'), l3.toString());

  // 4 — בלי שעה ⇒ יום-שלם
  final l4 = linesOf(B([
    {'uid': 'u1', 'title': 'יום', 'date': '2026-08-24', 'time': ''}
  ]));
  ok('4 · DTSTART יום-שלם', l4.contains('DTSTART;VALUE=DATE:20260824'));
  ok('4 · DTEND יום-המחרת', l4.contains('DTEND;VALUE=DATE:20260825'));

  // 5 — שעות מושחתות ⇒ נפילה בטוחה ליום-שלם
  for (final t in ['25:00', '9:00', '24:01', '12:60']) {
    final l5 = linesOf(B([
      {'uid': 'u1', 'title': 'יום', 'date': '2026-08-24', 'time': t}
    ]));
    ok("5 · '$t' ⇒ יום-שלם",
        l5.contains('DTSTART;VALUE=DATE:20260824') && l5.contains('DTEND;VALUE=DATE:20260825'));
    ok("5 · '$t' בלי DTSTART שעתי", !l5.any((x) => RegExp(r'^DTSTART:\d').hasMatch(x)));
  }

  // 5b — דוגמת-ההסגר: '24:00' תקין ב-V8 ⇒ אירוע שעתי המתגלגל למחרת 00:00
  final l24 = linesOf(B([
    {'uid': 'u1', 'title': 'חצות', 'date': '2026-08-24', 'time': '24:00'}
  ]));
  ok("5b · '24:00' ⇒ DTSTART שעתי-מחרת", l24.contains('DTSTART:20260825T000000'), l24.toString());
  ok("5b · '24:00' ⇒ DTEND +שעה", l24.contains('DTEND:20260825T010000'), l24.toString());
  ok("5b · '24:00' בלי VALUE=DATE", !l24.any((x) => x.startsWith('DTSTART;VALUE=DATE')));

  // 6 — escaping דרך השקע
  final l6 = linesOf(B([
    {'uid': 'u1', 'title': 'א,ב', 'date': '2026-08-24', 'time': '', 'notes': 'שורה1\nשורה2', 'location': 'אולם; ראשי'}
  ]));
  ok('6 · SUMMARY מנוקה', l6.contains('SUMMARY:א\\,ב'));
  ok('6 · DESCRIPTION מנוקה', l6.contains('DESCRIPTION:שורה1\\nשורה2'));
  ok('6 · LOCATION מנוקה', l6.contains('LOCATION:אולם\\; ראשי'));

  if (f != 0) {
    throw StateError('build-ics gold-test נכשל');
  }
  print('✓ build-ics (Dart): 6 דוגמאות-חוזה + הסגר-24:00 — ירוק');
}
