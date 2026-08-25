// בדיקת-חוזה (רתמת-זהב) · supScore — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sup-score.test.mjs
// (שהוא-עצמו מתרגם את הדוגמאות המחייבות של sup-score.contract.md):
//   1) {ils:6000, count:12, last:'2026-08-24'}        ⇒ 350+300+350 = 1000 (המקסימום)
//   2) {}                                             ⇒  40+ 50+ 40 =  130 (המינימום)
//   3) {ils:800, count:3, last:'2026-07-01'} (54 ימים) ⇒ 280+160+140 =  580
//   4) {ils:150, count:2, last:'2025-01-01'} (מעל שנה) ⇒  40+100+ 80 =  220
//   5) {ils:100, count:1, last:'2026-07-25'} (בדיוק 30) ⇒ 350+ 50+ 80 =  480
//   6) {usd:135, count:1, last:'2026-08-24'}: ‏rate=4 ⇒ tot=540 ⇒ 540;
//      ברירת-מחדל 3.7 ⇒ tot=499.5 ⇒ 480 (השער זורם לשקע; השמטה = undefined של JS).
// שקעי-הבדיקה כמוגדר בחוזה: ‏totIls=(sp,r)⇒(sp.ils||0)+(sp.usd||0)×r ·
// ‏last=(sp)⇒sp.last||'' · ‏cnt=(sp)⇒sp.count||0 (|| של JS ⇒ עוזר-falsy מפורש).
// "עכשיו" קבוע — חצות-יום מקומי 2026-08-24, אותה בניית-תאריך כמו באטום ⇒ דטרמיניסטי
// בכל אזור-זמן. הפלט מספר סקלרי (לא מערך) ⇒ שוויון ישיר; כלל-8 (אורך+איבר-איבר)
// אינו חל. כשל ⇒ StateError.
// הרצה: dart run --enable-asserts new/dart-maor/sup-score_test.dart ⇒ OK + exit 0
import 'sup-score.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// JS falsy: undefined/null (⇒ null ב-Dart) · '' · 0 · false · NaN.
bool _falsy(dynamic v) =>
    v == null || v == '' || v == 0 || v == false || (v is double && v.isNaN);

// ‏(sp.ils || 0) + (sp.usd || 0) * r — שקע-השווי מהחוזה.
dynamic _totIls(dynamic sp, dynamic r) {
  final ils = (sp as Map)['ils'];
  final usd = sp['usd'];
  return ((_falsy(ils) ? 0 : ils) as num) +
      ((_falsy(usd) ? 0 : usd) as num) * (r as num);
}

// ‏sp.last || '' — שקע-התאריך מהחוזה.
dynamic _last(dynamic sp) {
  final v = (sp as Map)['last'];
  return _falsy(v) ? '' : v;
}

// ‏sp.count || 0 — שקע-המונה מהחוזה.
dynamic _cnt(dynamic sp) {
  final v = (sp as Map)['count'];
  return _falsy(v) ? 0 : v;
}

void main() {
  // NOW = new Date('2026-08-24T12:00:00').getTime() — מקומי בשתי השפות.
  final now = DateTime.parse('2026-08-24T12:00:00').millisecondsSinceEpoch;

  // ‏sc(sp) של ה-JS ⇒ rate=undefined ⇒ ברירת-המחדל 3.7 של האטום; בדארט —
  // השמטת ה-named (הערוץ היחיד לברירת-מחדל, כלל-2: null-מפורש איננו "לא-הועבר").
  int sc(Map sp) => supScore(sp,
      nowMs: now, supTotalIls: _totIls, supLast: _last, supCount: _cnt);
  int scRate(Map sp, dynamic rate) => supScore(sp,
      rate: rate,
      nowMs: now,
      supTotalIls: _totIls,
      supLast: _last,
      supCount: _cnt);

  var n = 0;

  // 1) המקסימום.
  _ok(sc({'ils': 6000, 'count': 12, 'last': '2026-08-24'}) == 1000,
      'דוגמה 1: ≠ 1000');
  n++;
  // 2) המינימום — תורם ריק.
  _ok(sc(<String, dynamic>{}) == 130, 'דוגמה 2: ≠ 130');
  n++;
  // 3) 54 ימים · 3 תרומות · 800 ₪.
  _ok(sc({'ils': 800, 'count': 3, 'last': '2026-07-01'}) == 580,
      'דוגמה 3: ≠ 580');
  n++;
  // 4) מעל שנה · 2 תרומות · 150 ₪.
  _ok(sc({'ils': 150, 'count': 2, 'last': '2025-01-01'}) == 220,
      'דוגמה 4: ≠ 220');
  n++;
  // 5) גבול-הטריות — בדיוק 30 ימים ⇒ עדיין 350.
  _ok(sc({'ils': 100, 'count': 1, 'last': '2026-07-25'}) == 480,
      'דוגמה 5: ≠ 480');
  n++;
  // 6) השער זורם לשקע: rate=4 ⇒ 540; ברירת-מחדל 3.7 ⇒ 480 (‏499.5 < 500).
  _ok(scRate({'usd': 135, 'count': 1, 'last': '2026-08-24'}, 4) == 540,
      'דוגמה 6א: ≠ 540');
  n++;
  _ok(sc({'usd': 135, 'count': 1, 'last': '2026-08-24'}) == 480,
      'דוגמה 6ב: ≠ 480');
  n++;

  // תוספת דטרמיניסטית לענף ‏nowMs-מושמט (Date.now של המקור): תורם ריק ⇒ ‏last=''
  // ⇒ 9999 ימים בלי תלות ב"עכשיו" ⇒ 130 — זהה ב-JS עם שעון חי.
  _ok(supScore(<String, dynamic>{},
          supTotalIls: _totIls, supLast: _last, supCount: _cnt) ==
      130, 'ענף Date.now: ריק ≠ 130');
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(sc({'ils': 6000, 'count': 12, 'last': '2026-08-24'}) == 1000,
      'assert-live guard');

  print('OK supScore: $n asserts passed');
}
