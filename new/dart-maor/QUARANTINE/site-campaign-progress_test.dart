// רתמת-זהב · site-campaign-progress — כל 9 דוגמאות-החוזה (= 12 בדיקות-ה-JS
// מ-new/atoms/site-campaign-progress.test.mjs) + קצוות-המרה שאומתו מול node.
// מייבאת אך ורק את האטום-שלה (חוק-4). השוואת-Map = מפתח-מפתח מפורש (רוח כלל-8 —
// לא השוואת-JSON-מחרוזתית). כשל ⇒ StateError. הרצה:
//   dart run --enable-asserts new/dart-maor/site-campaign-progress_test.dart ⇒ OK
import 'site-campaign-progress.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

/// השוואת-פלט מלאה: אותם 6 מפתחות, ערך-ערך (רוח כלל-8 — אין join/JSON).
void _eqOut(Map<String, dynamic> got, Map<String, dynamic> want, String msg) {
  const keys = ['goal', 'raised', 'pct', 'currency', 'daysLeft', 'show'];
  _ok(got.length == want.length && got.length == keys.length,
      '$msg: מספר-מפתחות ${got.length} ≠ ${want.length}');
  for (final k in keys) {
    _ok(got.containsKey(k), '$msg: מפתח חסר "$k"');
    _ok(got[k] == want[k], '$msg: $k ⇒ ${got[k]} ≠ ${want[k]}');
  }
}

void main() {
  var n = 0;
  // חצות-מקומי (בלי Z) — פרסור TZ-סימטרי כמו בבדיקת-ה-JS: ההפרש חסין-אזור.
  final now = DateTime.parse('2026-09-01T00:00:00').millisecondsSinceEpoch;

  // 1) אחוז בסיסי + פלט מלא
  _eqOut(campaignProgress({'goal': 1000, 'raised': 250}, now), {
    'goal': 1000, 'raised': 250, 'pct': 25, 'currency': '₪',
    'daysLeft': null, 'show': true,
  }, 'בסיסי'); n++;

  // 2) חריגה מהיעד — חסום ל-100
  _ok(campaignProgress({'goal': 1000, 'raised': 1500}, now)['pct'] == 100,
      'חסימת-100'); n++;

  // 3) ספירה-לאחור קלנדרית 1.9→11.9 = 10
  _ok(
      campaignProgress(
              {'goal': 1000, 'raised': 250, 'end': '2026-09-11'}, now)['daysLeft'] ==
          10,
      'ימים-נותרו'); n++;

  // 4) תאריך-יעד שעבר ⇒ 0
  _ok(campaignProgress({'goal': 1000, 'end': '2026-08-01'}, now)['daysLeft'] == 0,
      'עבר⇒0'); n++;

  // 5) בלי goal ⇒ 0 + show=false
  _eqOut(campaignProgress({'raised': 250}, now), {
    'goal': 0, 'raised': 250, 'pct': 0, 'currency': '₪',
    'daysLeft': null, 'show': false,
  }, 'בלי-יעד'); n++;

  // 6) מטבע מותאם
  _ok(
      campaignProgress(
              {'goal': 1000, 'raised': 250, 'currency': r'$'}, now)['currency'] ==
          r'$',
      'מטבע'); n++;

  // 7) undefined לגמרי (⇒ null ב-Dart)
  _eqOut(campaignProgress(null, now), {
    'goal': 0, 'raised': 0, 'pct': 0, 'currency': '₪',
    'daysLeft': null, 'show': false,
  }, 'undefined'); n++;

  // 8) תאריך-שבור ⇒ daysLeft null
  _ok(
      campaignProgress(
              {'goal': 1000, 'raised': 250, 'end': 'זבל'}, now)['daysLeft'] ==
          null,
      'תאריך-שבור'); n++;

  // 9) עיגול round לא floor
  _ok(campaignProgress({'goal': 1000, 'raised': 335}, now)['pct'] == 34,
      'round-335'); n++;
  _ok(campaignProgress({'goal': 1000, 'raised': 333}, now)['pct'] == 33,
      'round-333'); n++;

  // קצה: goal/raised לא-חיוביים נפסלים ל-0
  _eqOut(campaignProgress({'goal': -5, 'raised': -9}, now), {
    'goal': 0, 'raised': 0, 'pct': 0, 'currency': '₪',
    'daysLeft': null, 'show': false,
  }, 'שליליים'); n++;

  // — קצוות-המרה, כולם אומתו מול node (V8) על מקור-ה-JS: —
  // יום-גולש-בלוח מתגלגל קדימה כמו V8 (כלל-4): ‏31.9 ⇒ 1.10 ⇒ ‏daysLeft 30
  _ok(
      campaignProgress(
              {'goal': 1000, 'raised': 250, 'end': '2026-09-31'}, now)['daysLeft'] ==
          30,
      'גלגול-יום 31.9⇒1.10'); n++;
  // ‏end ארוך — slice(0,10) גוזר את חלק-התאריך בלבד
  _ok(
      campaignProgress({'goal': 1000, 'raised': 250, 'end': '2026-09-11T15:30:00'},
              now)['daysLeft'] ==
          10,
      'end-ארוך⇒חלק-תאריך'); n++;
  // מטבע ריק '' = falsy ⇒ ברירת-מחדל ₪ (כלל-7 — || ולא ??)
  _ok(
      campaignProgress(
              {'goal': 1000, 'raised': 250, 'currency': ''}, now)['currency'] ==
          '₪',
      "מטבע-''⇒₪"); n++;
  // מחר ⇒ 1
  _ok(
      campaignProgress(
              {'goal': 1000, 'raised': 1, 'end': '2026-09-02'}, now)['daysLeft'] ==
          1,
      'מחר⇒1'); n++;
  // חודש/יום לקסיקלית-מחוץ-לטווח ⇒ NaN ב-V8 ⇒ null (אומת מול node)
  for (final bad in ['2026-13-01', '2026-00-10', '2026-01-00', '2026-01-32']) {
    _ok(
        campaignProgress(
                {'goal': 1000, 'raised': 250, 'end': bad}, now)['daysLeft'] ==
            null,
        'תאריך-פסול $bad⇒null'); n++;
  }

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(campaignProgress({'goal': 1000, 'raised': 250}, now)['pct'] == 25,
      'assert-live guard');

  print('OK site-campaign-progress: $n בדיקות (9 דוגמאות-חוזה + קצוות-המרה) — ירוק');
}
