// 🥇 רתמת-זהב · mergeSupporterRow — Dart ≡ JS.
// דוגמאות-החוזה בדיוק כמקור new/atoms/merge-supporter-row.test.mjs (5 דוגמאות),
// אותם קלטים→פלטים. עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts <קובץ>.
import 'merge-supporter-row.dart';

void main() {
  // שקעים כלשון-החוזה (מקומיים לבדיקה — מייבאת רק את האטום שלה)
  var phoneCalls = 0;
  String fixPhone(String p) {
    phoneCalls++;
    return p.length == 10 ? '${p.substring(0, 3)}-${p.substring(3)}' : p;
  }

  var histCalls = 0;
  Object mergeHist(Object? existing, Object? incoming) {
    histCalls++;
    final ex = (existing as List).cast<Map>();
    final inc = (incoming as List).cast<Map>();
    String key(Map h) => '${h['d']}|${h['a']}|${h['c'] ?? '₪'}';
    final seen = ex.map(key).toSet();
    return [...ex, ...inc.where((h) => !seen.contains(key(h)))];
  }

  Map<String, Object?> sp0(Map<String, Object?> o) => {
        'id': 's1',
        'name': 'דנה',
        'phone': '',
        'email': '',
        'idNum': '',
        'address': '',
        'cat': '',
        'forWho': '',
        'donations': <Object?>[],
        'count': 0,
        'ils': 0,
        ...o,
      };
  Map<String, Object?> row0(Map<String, Object?> o) => {
        'name': '',
        'phone': '',
        'email': '',
        'idNum': '',
        'address': '',
        'cat': '',
        'forWho': '',
        ...o,
      };

  // דוגמה 1 — לא-ריק דורס (עם גזימה)
  {
    final out =
        mergeSupporterRow(sp0({}), row0({'name': ' דנה לוי '}), mergeHist, fixPhone);
    assert(out['name'] == 'דנה לוי', '1 דריסה-גזומה');
  }
  // דוגמה 2 — רווחים = ריק ⇒ הקיים נשמר
  {
    final out = mergeSupporterRow(
        sp0({'email': 'd@x.co'}), row0({'email': '   '}), mergeHist, fixPhone);
    assert(out['email'] == 'd@x.co', '2 ריק-נשמר');
  }
  // דוגמה 3 — טלפון דרך השקע; ריק ⇒ השקע לא נקרא
  {
    phoneCalls = 0;
    final out = mergeSupporterRow(
        sp0({}), row0({'phone': ' 0501234567 '}), mergeHist, fixPhone);
    assert(out['phone'] == '050-1234567', '3 עוצב');
    assert(phoneCalls == 1, '3 שקע-נקרא');
    phoneCalls = 0;
    final kept = mergeSupporterRow(
        sp0({'phone': '050-9998877'}), row0({'phone': ''}), mergeHist, fixPhone);
    assert(kept['phone'] == '050-9998877', '3 ריק-נשמר');
    assert(phoneCalls == 0, '3 שקע-לא-נקרא');
  }
  // דוגמה 4 — hist ממוזג אידמפוטנטית; row בלי hist ⇒ לא נקרא
  {
    histCalls = 0;
    final h1 = {'d': '2026-01-01', 'a': 100};
    final out = mergeSupporterRow(
      sp0({'hist': [h1]}),
      row0({
        'hist': [
          {...h1},
          {'d': '2026-02-01', 'a': 50}
        ]
      }),
      mergeHist,
      fixPhone,
    );
    assert((out['hist'] as List).length == 2, '4 אורך-2');
    assert(histCalls == 1, '4 שקע-נקרא');
    histCalls = 0;
    final kept =
        mergeSupporterRow(sp0({'hist': [h1]}), row0({}), mergeHist, fixPhone);
    assert(
        (kept['hist'] as List).length == 1 &&
            ((kept['hist'] as List)[0] as Map)['a'] == 100,
        '4 hist-נשמר');
    assert(histCalls == 0, '4 שקע-לא-נקרא');
  }
  // דוגמה 5 — הכסף לא זז
  {
    final sp = sp0({
      'donations': [
        {'date': '2026-01-01', 'amount': 100, 'cur': '₪'}
      ],
      'count': 1,
      'ils': 100,
    });
    final out =
        mergeSupporterRow(sp, row0({'name': 'אחר', 'cat': 'VIP'}), mergeHist, fixPhone);
    assert(
        (out['donations'] as List).length == 1 &&
            ((out['donations'] as List)[0] as Map)['amount'] == 100,
        '5 donations');
    assert(out['count'] == 1 && out['ils'] == 100, '5 מונים');
  }

  print('✓ merge-supporter-row (Dart): 5 דוגמאות-חוזה — ירוק');
}
