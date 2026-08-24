// 🏅 רתמת-זהב · filterVolunteers — דוגמאות-החוזה זהות ביט-אחר-ביט לבדיקת-ה-JS
// (new/atoms/filter-volunteers.test.mjs): 12 הקלטות-Golden (q ריק ⇒ vols כמות-שהם)
// + שקע-smartFilter (getTerms=[name,phone,area]). עובר ⇒ Dart ≡ JS (חוק-4).
// הרצה: dart run --enable-asserts new/dart-maor/filter-volunteers_test.dart ⇒ exit 0.
import 'filter-volunteers.dart';

void main() {
  // שקע-דמה: 12 ההקלטות מזרימות q ריק ⇒ smartFilter לעולם לא נקרא.
  dynamic neverFilter(String q, dynamic vols, List<dynamic> Function(dynamic) g) {
    throw StateError('smartFilter נקרא כש-q ריק — סתירה למקור');
  }

  // 12 הקלטות-Golden: q="" ⇒ vols מוחזר כמות-שהוא (זהה ל-JSON.stringify במקור).
  const goldVols = <String>[
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
  for (final v in goldVols) {
    final got = filterVolunteers(v, '', neverFilter);
    assert(got == v, 'Golden · vols="$v" ⇒ $got ≠ $v');
  }

  // שקע smartFilter (חוק-3): getTerms=[name,phone,area]; 'לוי' תופס רק את השורה השנייה (שם).
  final vols = <Map<String, dynamic>>[
    {'name': 'כהן', 'phone': '050', 'area': 'צפון'},
    {'name': 'לוי', 'phone': '052', 'area': 'דרום'},
  ];
  dynamic stubFilter(
      String q, dynamic items, List<dynamic> Function(dynamic) getTerms) {
    return (items as List)
        .where((it) => getTerms(it).any((t) => t.toString().contains(q)))
        .toList();
  }

  final gotSock = filterVolunteers(vols, 'לוי', stubFilter) as List;
  assert(gotSock.length == 1 && identical(gotSock[0], vols[1]),
      'socket/smartFilter ⇒ $gotSock ≠ [vols[1]]');

  print('✓ filter-volunteers (Dart): 12 הקלטות-Golden + שקע-smartFilter — ירוק · Dart ≡ JS');
}
