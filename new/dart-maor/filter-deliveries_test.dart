// 🏅 רתמת-זהב · filterDeliveries — דוגמאות-החוזה זהות ביט-אחר-ביט לבדיקת-ה-JS
// (new/atoms/filter-deliveries.test.mjs): 12 הקלטות-Golden (q ריק ⇒ rows כמות-שהם)
// + שקע-smartFilter (statusLabel המוטמע). עובר ⇒ Dart ≡ JS (חוק-4).
// הרצה: dart run --enable-asserts new/dart-maor/filter-deliveries_test.dart ⇒ exit 0.
import 'filter-deliveries.dart';

void main() {
  // שקע-דמה: 12 ההקלטות מזרימות q ריק ⇒ smartFilter לעולם לא נקרא.
  dynamic neverFilter(String q, dynamic rows, List<dynamic> Function(dynamic) g) {
    throw StateError('smartFilter נקרא כש-q ריק — סתירה למקור');
  }

  // 12 הקלטות-Golden: q="" ⇒ rows מוחזר כמות-שהוא (זהה ל-JSON.stringify במקור).
  const goldRows = <String>[
    '',
    'אבג',
    'כהן לוי',
    'abc',
    'a@b.com',
    '2026-08-24',
    '2026-08-24T12:00:00',
    '0501234567',
    '03-1234567',
    'https://x.co',
    'שלום עולם',
    '12',
  ];
  for (final r in goldRows) {
    final got = filterDeliveries(r, '', neverFilter);
    assert(got == r, 'Golden · rows="$r" ⇒ $got ≠ $r');
  }

  // שקע smartFilter (חוק-3) + statusLabel מוטמע (חוק-1): pickup⇒'איסוף' תופס שורה ראשונה בלבד.
  final rows = <Map<String, dynamic>>[
    {'familyName': 'כהן', 'volunteerName': 'לוי', 'status': 'pickup'},
    {'familyName': 'לוי', 'volunteerName': 'דוד', 'status': 'delivered'},
  ];
  dynamic stubFilter(
      String q, dynamic items, List<dynamic> Function(dynamic) getTerms) {
    return (items as List)
        .where((it) => getTerms(it).any((t) => t.toString().contains(q)))
        .toList();
  }

  final gotSock = filterDeliveries(rows, 'איסוף', stubFilter) as List;
  assert(gotSock.length == 1 && identical(gotSock[0], rows[0]),
      'socket/statusLabel ⇒ $gotSock ≠ [rows[0]]');

  print('✓ filter-deliveries (Dart): 12 הקלטות-Golden + שקע-smartFilter — ירוק · Dart ≡ JS');
}
