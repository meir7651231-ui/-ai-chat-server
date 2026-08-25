// בדיקת-חוזה (רתמת-זהב) · pricingTerms — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה של מקור-ה-JS (new/atoms/pricing-terms.test.mjs) היא צילום-JSON יחיד:
//   JSON.stringify(PRICING_TERMS) === SNAP  (סדר-איברים + סדר-מפתחות v→t + טקסט מדויק).
// כאן נבנה מחדש את מחרוזת-ה-JSON מהאטום ידנית (בלי dart:convert — אפס import מעבר ל-core)
// ומשווים לצילום ביט-אחר-ביט; ועוד אימותי-איבר לחיזוק. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/pricing-terms_test.dart  ⇒ exit 0
import 'pricing-terms.dart';

// הצילום המדויק מ-new/atoms/pricing-terms.test.mjs (הערך של SNAP.PRICING_TERMS).
const _snap =
    '[{"v":"once","t":"חד-פעמי"},{"v":"weekly","t":"שבועי"},{"v":"biweekly","t":"דו-שבועי"},{"v":"monthly","t":"חודשי"},{"v":"months","t":"מספר חודשים"},{"v":"half_year","t":"חצי-שנתי"},{"v":"year","t":"שנתי"}]';

// בונה JSON מינימלי מהרשימה — סדר-הכנסת-המפתחות של Dart Map (v לפני t) משוקף כמו-שהוא,
// כדי לשקף בדיוק את JSON.stringify של JS (שמסדר לפי סדר-הכנסה).
String _toJson(List<Map<String, String>> rows) {
  final items = rows.map((row) {
    final pairs = row.entries.map((e) => '"${e.key}":"${e.value}"').join(',');
    return '{$pairs}';
  }).join(',');
  return '[$items]';
}

void main() {
  var n = 0;
  final t = pricingTerms;

  // 1) הצילום המלא זהה-ביט (סדר-איברים + סדר-מפתחות + טקסט) — דוגמת-החוזה של המקור.
  final json = _toJson(t);
  assert(json == _snap, 'FAIL: JSON סטה מהצילום\n  got: $json\n  exp: $_snap');
  n++;

  // 2) אורך 7.
  assert(t.length == 7, 'FAIL: אורך ${t.length} ≠ 7');
  n++;

  // 3) הקוד הראשון = once / תווית 'חד-פעמי'.
  assert(t[0]['v'] == 'once' && t[0]['t'] == 'חד-פעמי', "FAIL: [0] ≠ once/חד-פעמי");
  n++;

  // 4) הקוד האחרון = year / תווית 'שנתי'.
  assert(t[6]['v'] == 'year' && t[6]['t'] == 'שנתי', "FAIL: [6] ≠ year/שנתי");
  n++;

  // 5) 'months' נושא תווית 'מספר חודשים'.
  assert(t[4]['v'] == 'months' && t[4]['t'] == 'מספר חודשים',
      "FAIL: [4] ≠ months/מספר חודשים");
  n++;

  // 6) כל איבר = מפה עם בדיוק שני מפתחות v,t בסדר הזה.
  for (var i = 0; i < t.length; i++) {
    final keys = t[i].keys.toList();
    assert(keys.length == 2 && keys[0] == 'v' && keys[1] == 't',
        "FAIL: [$i] מפתחות ≠ [v,t]");
  }
  n++;

  // 7) אין קודי-v כפולים.
  final codes = t.map((r) => r['v']).toList();
  assert(codes.toSet().length == codes.length, 'FAIL: קוד-v כפול');
  n++;

  print('OK pricingTerms: $n asserts passed');
}
