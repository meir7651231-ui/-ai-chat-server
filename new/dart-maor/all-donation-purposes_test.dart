// בדיקת-חוזה (רתמת-זהב) · allDonationPurposes — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/all-donation-purposes.test.mjs
// (אותם קלטים→פלטים; השקע p = (s)=>s.tags):
//   1) []                                   ⇒ []      (אפס קריאות-שקע)
//   2) [{tags:['ב','א']},{tags:['ג']}]       ⇒ ['א','ב','ג']
//   3) [{tags:['חתן']},{tags:['חתן','כלה']}] ⇒ ['חתן','כלה']  (דדופ)
//   4) [{tags:[]}]                           ⇒ []
//   5) [{tags:['b']},{tags:['a']}]           ⇒ ['a','b']
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/all-donation-purposes_test.dart  ⇒ exit 0
import 'all-donation-purposes.dart';

// שקע-הבדיקה — מקביל ל-p = (s)=>s.tags במקור-ה-JS.
List<String> _tags(Map<String, List<String>> s) => s['tags']!;

void _eq(List<String> got, List<String> want, String label) {
  final g = got.join('|');
  final w = want.join('|');
  if (g != w) {
    throw StateError('FAIL [$label]:\n got =[$g]\n want=[$w]');
  }
}

void main() {
  var n = 0;

  // 1) רשימה ריקה ⇒ [] — ואפס קריאות-שקע על אף תורם.
  var calls = 0;
  _eq(
    allDonationPurposes<Map<String, List<String>>>([], (s) {
      calls++;
      return _tags(s);
    }),
    [],
    '[] ⇒ []',
  );
  n++;
  if (calls != 0) throw StateError('FAIL: רשימה ריקה קראה לשקע ($calls)');
  n++;

  // 2) מיזוג + מיון עברי.
  _eq(
    allDonationPurposes(<Map<String, List<String>>>[
      {'tags': ['ב', 'א']},
      {'tags': ['ג']},
    ], _tags),
    ['א', 'ב', 'ג'],
    'מיזוג/מיון עברי',
  );
  n++;

  // 3) דדופ — 'חתן' פעם-אחת בלבד (Set).
  _eq(
    allDonationPurposes(<Map<String, List<String>>>[
      {'tags': ['חתן']},
      {'tags': ['חתן', 'כלה']},
    ], _tags),
    ['חתן', 'כלה'],
    'דדופ',
  );
  n++;

  // 4) תורם בלי ייעודים לא תורם דבר.
  _eq(
    allDonationPurposes(<Map<String, List<String>>>[
      {'tags': <String>[]},
    ], _tags),
    [],
    'תורם ריק',
  );
  n++;

  // 5) מיון לטיני.
  _eq(
    allDonationPurposes(<Map<String, List<String>>>[
      {'tags': ['b']},
      {'tags': ['a']},
    ], _tags),
    ['a', 'b'],
    'מיון לטיני',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    allDonationPurposes(<Map<String, List<String>>>[
          {'tags': ['ב', 'א']},
        ], _tags).join('|') ==
        'א|ב',
    'assert-live guard',
  );

  print('OK allDonationPurposes: $n asserts passed');
}
