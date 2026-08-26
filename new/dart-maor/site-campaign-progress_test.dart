// בדיקת-הסגר · site-campaign-progress — פורט נאמן של
// new/atoms/site-campaign-progress.test.mjs + כיסוי תיקון-ההסגר (צורות-תאריך קצרות).
// הרצה: dart run --enable-asserts site-campaign-progress_test.dart

import 'site-campaign-progress.dart';

int _f = 0;

String _j(dynamic v) {
  if (v is Map) {
    final e = v.entries.map((e) => '"${e.key}":${_j(e.value)}').join(',');
    return '{$e}';
  }
  if (v is String) return '"$v"';
  return '$v';
}

void eq(dynamic a, dynamic b, String msg) {
  final g = _j(a), w = _j(b);
  if (g != w) {
    print('✗ $msg ⇒ $g ≠ $w');
    _f = 1;
  }
}

void main() {
  // חצות-מקומי (בלי Z) — סימטרי לפרסור האטום, ההפרש חסין-אזור
  final now = DateTime(2026, 9, 1).millisecondsSinceEpoch;

  // 1) אחוז בסיסי + פלט מלא
  eq(campaignProgress({'goal': 1000, 'raised': 250}, now),
      {'goal': 1000, 'raised': 250, 'pct': 25, 'currency': '₪', 'daysLeft': null, 'show': true},
      'בסיסי');

  // 2) חריגה מהיעד — חסום ל-100
  eq(campaignProgress({'goal': 1000, 'raised': 1500}, now)['pct'], 100, 'חסימת-100');

  // 3) ספירה-לאחור קלנדרית 1.9→11.9 = 10
  eq(campaignProgress({'goal': 1000, 'raised': 250, 'end': '2026-09-11'}, now)['daysLeft'], 10, 'ימים-נותרו');

  // 4) תאריך-יעד שעבר ⇒ 0
  eq(campaignProgress({'goal': 1000, 'end': '2026-08-01'}, now)['daysLeft'], 0, 'עבר⇒0');

  // 5) בלי goal ⇒ 0 + show=false
  eq(campaignProgress({'raised': 250}, now),
      {'goal': 0, 'raised': 250, 'pct': 0, 'currency': '₪', 'daysLeft': null, 'show': false},
      'בלי-יעד');

  // 6) מטבע מותאם
  eq(campaignProgress({'goal': 1000, 'raised': 250, 'currency': '\$'}, now)['currency'], '\$', 'מטבע');

  // 7) undefined לגמרי
  eq(campaignProgress(null, now),
      {'goal': 0, 'raised': 0, 'pct': 0, 'currency': '₪', 'daysLeft': null, 'show': false},
      'undefined');

  // 8) תאריך-שבור ⇒ daysLeft null
  eq(campaignProgress({'goal': 1000, 'raised': 250, 'end': 'זבל'}, now)['daysLeft'], null, 'תאריך-שבור');

  // 9) עיגול round לא floor
  eq(campaignProgress({'goal': 1000, 'raised': 335}, now)['pct'], 34, 'round-335');
  eq(campaignProgress({'goal': 1000, 'raised': 333}, now)['pct'], 33, 'round-333');

  // קצה: goal/raised לא-חיוביים נפסלים ל-0
  eq(campaignProgress({'goal': -5, 'raised': -9}, now),
      {'goal': 0, 'raised': 0, 'pct': 0, 'currency': '₪', 'daysLeft': null, 'show': false},
      'שליליים');

  // תיקון-ההסגר · צורות-תאריך קצרות (V8 מקבל, בודה חודש/יום ל-1, מקומי)
  // "2026-05" ⇒ חצות-מקומי 1.5.2026 (עבר) ⇒ 0
  eq(campaignProgress({'goal': 1000, 'end': '2026-05'}, now)['daysLeft'], 0, 'קצר-YYYY-MM-עבר');
  // "2027" ⇒ חצות-מקומי 1.1.2027 (עתיד) ⇒ אינו null
  final short = campaignProgress({'goal': 1000, 'end': '2027'}, now)['daysLeft'];
  if (short == null || short <= 0) {
    print('✗ קצר-YYYY-עתיד ⇒ daysLeft=$short (ציפייה: חיובי)');
    _f = 1;
  }
  // אימות ספירה מדויקת מול חישוב DateTime מקומי (חסין-אזור)
  final expShort = ((DateTime(2027, 1, 1).millisecondsSinceEpoch - now) / 86400000).ceil();
  eq(short, expShort, 'קצר-YYYY-ספירה');

  if (_f != 0) {
    throw StateError('כשל');
  }
  print('✓ site-campaign-progress.dart: פורט + תיקון-הסגר צורות-תאריך — ירוק');
}
