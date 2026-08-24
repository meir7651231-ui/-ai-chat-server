// בדיקת-חוזה (רתמת-זהב) · detectRecurringHok — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/detect-recurring-hok.test.mjs.
// השקעים (modeStr/modeOf/monthsAgo) — המרת-JS נאמנה של מימושי-המקור (nedarimSync.ts).
// הרצה: dart run --enable-asserts new/dart-maor/detect-recurring-hok_test.dart ⇒ exit 0
import 'detect-recurring-hok.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// --- השקעים — מימושי-המקור (nedarimSync.ts), מומרים JS→Dart ---
final clearingProviders = <String>['נדרים', 'סולה'];

num modeOf(List<num> nums) {
  final c = <num, int>{};
  num best = nums.isNotEmpty ? nums[0] : 1;
  var bestN = 0;
  for (final n in nums) {
    final k = (c[n] ?? 0) + 1;
    c[n] = k;
    if (k > bestN) {
      bestN = k;
      best = n;
    }
  }
  return best;
}

String modeStr(List<String> strs) {
  final c = <String, int>{};
  var best = strs.isNotEmpty ? strs[0] : '';
  var bestN = 0;
  for (final s in strs) {
    final k = (c[s] ?? 0) + 1;
    c[s] = k;
    if (k > bestN) {
      bestN = k;
      best = s;
    }
  }
  return best;
}

int monthsAgo(String dateIso, String todayIso) {
  final a = dateIso.substring(0, 7).split('-');
  final b = todayIso.substring(0, 7).split('-');
  final y1 = int.tryParse(a[0]) ?? 0, m1 = int.tryParse(a[1]) ?? 0;
  final y2 = int.tryParse(b[0]) ?? 0, m2 = int.tryParse(b[1]) ?? 0;
  if (y1 == 0 || m1 == 0 || y2 == 0 || m2 == 0) return 999;
  return (y2 - y1) * 12 + (m2 - m1);
}

Map<String, Object?> run(List<Map<String, Object?>> sps, [int min = 3]) =>
    detectRecurringHok(sps, '2026-08-24', min, clearingProviders, modeStr, modeOf, monthsAgo);

void main() {
  // 1) תבנית 3 חודשים ⇒ הו"ק מזוהה
  final sp1 = <String, Object?>{
    'id': 's1',
    'hist': <Map<String, Object?>>[
      {'a': 100, 'c': '₪', 'd': '2026-05-10', 'clearer': 'נדרים'},
      {'a': 100, 'c': '₪', 'd': '2026-06-10', 'clearer': 'נדרים'},
      {'a': 100, 'c': '₪', 'd': '2026-07-10', 'clearer': 'נדרים'},
    ],
  };
  final r1 = run([sp1]);
  _ok(r1['detected'] == 1, '1: detected ≠ 1');
  final sup1 = (r1['supporters'] as List)[0] as Map<String, Object?>;
  final h1 = sup1['hok'] as Map<String, Object?>;
  _ok(h1['amount'] == 100 && h1['cur'] == '₪' && h1['day'] == 10 && h1['method'] == 'card',
      '1: amount/cur/day/method שגויים');
  _ok(h1['note'] == 'הו״ק נדרים (זוהה מהיסטוריה · 3 חודשים)', '1: note שגוי: ${h1['note']}');
  _ok(h1['active'] == true, '1: active ≠ true (חודש אחרון 2026-07)');
  _ok(h1['startedAt'] == '2026-05-10' && h1['kevaId'] == 'auto', '1: startedAt/kevaId שגויים');
  _ok(!identical(sup1, sp1), '1: התורם לא שוכפל');

  // 2) רק 2 חודשים בלי kevaId ⇒ לא מזוהה, אותה רפרנס
  final sp2 = <String, Object?>{
    'id': 's2',
    'hist': <Map<String, Object?>>[
      {'a': 100, 'c': '₪', 'd': '2026-05-10', 'clearer': 'נדרים'},
      {'a': 100, 'c': '₪', 'd': '2026-06-10', 'clearer': 'נדרים'},
    ],
  };
  final r2 = run([sp2]);
  _ok(r2['detected'] == 0 && identical((r2['supporters'] as List)[0], sp2),
      '2: זוהה בטעות / לא אותה רפרנס');

  // 3) חיוב-בודד עם kevaId ⇒ ודאי; active=false (6 חודשים)
  final sp3 = <String, Object?>{
    'id': 's3',
    'hist': <Map<String, Object?>>[
      {'a': 52, 'c': '\$', 'd': '2026-02-15', 'clearer': 'סולה', 'kevaId': 'K9'},
    ],
  };
  final r3 = run([sp3]);
  final h3 = ((r3['supporters'] as List)[0] as Map<String, Object?>)['hok'] as Map<String, Object?>;
  _ok(r3['detected'] == 1, '3: detected ≠ 1');
  _ok(h3['amount'] == 52 && h3['cur'] == '\$' && h3['day'] == 15, '3: amount/cur/day שגויים');
  _ok(h3['note'] == 'הו״ק סולה · K9' && h3['kevaId'] == 'K9', '3: note/kevaId שגויים: ${h3['note']}');
  _ok(h3['active'] == false && h3['startedAt'] == '2026-02-15', '3: active/startedAt שגויים');

  // 4) הו"ק ידני (בלי kevaId) לא נדרס
  final sp4 = <String, Object?>{
    'id': 's4',
    'hok': <String, Object?>{'amount': 50},
    'hist': sp1['hist'],
  };
  final r4 = run([sp4]);
  _ok(r4['detected'] == 0 && identical((r4['supporters'] as List)[0], sp4), '4: הו"ק ידני נדרס');

  // 5) כבילת-יום: יום-30 ⇒ 28
  final sp5 = <String, Object?>{
    'id': 's5',
    'hist': <Map<String, Object?>>[
      {'a': 200, 'c': '₪', 'd': '2026-03-30', 'clearer': 'נדרים'},
      {'a': 200, 'c': '₪', 'd': '2026-04-30', 'clearer': 'נדרים'},
      {'a': 200, 'c': '₪', 'd': '2026-05-30', 'clearer': 'נדרים'},
    ],
  };
  final h5 = ((run([sp5])['supporters'] as List)[0] as Map<String, Object?>)['hok'] as Map<String, Object?>;
  _ok(h5['day'] == 28, '5: day לא נכבל ל-28');

  // 6) clearer לא-מוכר ⇒ לא נוגעים
  final sp6 = <String, Object?>{
    'id': 's6',
    'hist': <Map<String, Object?>>[
      {'a': 100, 'c': '₪', 'd': '2026-05-10', 'clearer': 'מזומן'},
      {'a': 100, 'c': '₪', 'd': '2026-06-10', 'clearer': 'מזומן'},
      {'a': 100, 'c': '₪', 'd': '2026-07-10', 'clearer': 'מזומן'},
    ],
  };
  final r6 = run([sp6]);
  _ok(r6['detected'] == 0 && identical((r6['supporters'] as List)[0], sp6), '6: clearer זר זוהה בטעות');

  print('✓ detect-recurring-hok (Dart): 6 דוגמאות-חוזה — ירוק');
}
