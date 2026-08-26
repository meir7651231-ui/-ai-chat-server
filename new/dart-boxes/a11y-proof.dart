// 🧪 הוכחת-חוצה-שפות · נגישות (a11y) — אותם קלטים/WANT כמו new/boxes/a11y.test.mjs.
// ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה: 3 קבועים + 4 מתגים · clampScale
//   (8 קצוות) · stepScale (שרשרת 0.8→1.6 בלי שאריות-float) · parseAcc (9 קלטים) — זהי-ביט.
//
// דילוגים (מתועדים):
//  • 3 "מגני-ההכרעה" של בדיקת-ה-JS קוראים את מקור-ה-mjs עצמו (readFileSync + regex על
//    טקסט-הקובץ) — אלה מגני-מקור-JS, לא התנהגות חוצה-שפות ⇒ מדולגים (חוק מגני-מקור-JS).
//  • `clampScale(undefined)` של-ה-JS ⇒ כאן `null` (ל-Dart אין undefined); שניהם נופלים
//    לאותו מסלול "לא-מספרי ⇒ 1" — התאמת-טיפוס, לא שינוי-התנהגות.
import 'dart:convert';
import 'a11y.dart' as A;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  } else {
    n++;
  }
}

/// מחרוזת-מספר בסמנטיקת-JS (Number.prototype.toString): ערך-שלם ⇒ בלי נקודה
/// (‏JS: `String(1.0) === '1'`); אחרת toString של Dart (זהה ל-JS על 0.8/0.9/1.1…).
/// דרוש רק לשרשרת-הזום, שבה JS עושה `stops.join(',')` והתחנה 1.0 מודפסת "1".
String _jsStr(num x) =>
    (x.isFinite && x == x.roundToDouble()) ? x.toInt().toString() : x.toString();

void main() {
  // ── קבועי-הסולם (a11y.ts:13-15) ──
  eq('SCALE_MIN', A.scaleMin, 0.8);
  eq('SCALE_MAX', A.scaleMax, 1.6);
  eq('SCALE_STEP', A.scaleStep, 0.1);

  // ── 4 המתגים בסדר ובנוסח הלגאסי (a11y.ts:27-32 · legacy script:3185) ──
  const wantToggles = [
    ['contrast', 'ניגודיות גבוהה'],
    ['links', 'הדגשת כפתורים וקישורים'],
    ['noanim', 'עצירת אנימציות ותנועה'],
    ['spacing', 'ריווח טקסט מוגדל'],
  ];
  eq('A11Y_FAB_TOGGLES verbatim', A.a11yFabToggles, wantToggles);

  // ── clampScale — הכרעה 1 (a11y.ts:35-38) ──
  eq('clampScale(2) תקרה', A.clampScale(2), 1.6);
  eq('clampScale(0.5) רצפה', A.clampScale(0.5), 0.8);
  eq('clampScale(1.2) בתחום', A.clampScale(1.2), 1.2);
  eq('clampScale(NaN) ⇒ ברירת-מחדל', A.clampScale(double.nan), 1);
  eq('clampScale(Infinity) ⇒ ברירת-מחדל', A.clampScale(double.infinity), 1);
  eq('clampScale(-Infinity) ⇒ ברירת-מחדל', A.clampScale(double.negativeInfinity), 1);
  eq("clampScale('1.2') מחרוזת ⇒ ברירת-מחדל", A.clampScale('1.2'), 1);
  eq('clampScale(undefined→null) ⇒ ברירת-מחדל', A.clampScale(null), 1);

  // ── stepScale — הכרעה 2 (a11y.ts:44-46; העיגול נגד שאריות float) ──
  eq('stepScale(1,+1)', A.stepScale(1, 1), 1.1);
  eq('stepScale(1.1,+1) === 1.2 בדיוק (לא 1.2000000000000002)', A.stepScale(1.1, 1), 1.2);
  eq('רוויה בתקרה', A.stepScale(1.6, 1), 1.6);
  eq('רוויה ברצפה', A.stepScale(0.8, -1), 0.8);
  eq('stepScale(1.2,-1)', A.stepScale(1.2, -1), 1.1);
  eq('לא-מספרי ⇒ 1 ⇒ צעד אחד', A.stepScale(double.nan, 1), 1.1);
  eq('מעל-התקרה נצמד ואז רווי', A.stepScale(99, 1), 1.6);
  // שרשרת-צעדים מלאה: 0.8 → … → 1.6 ב-8 צעדים בדיוק, כל תחנה בעשירית נקייה
  {
    num v = 0.8;
    final stops = <num>[v];
    for (var i = 0; i < 8; i++) {
      v = A.stepScale(v, 1) as num;
      stops.add(v);
    }
    eq('שרשרת-הזום המלאה בלי שאריות float', stops.map(_jsStr).join(','),
        '0.8,0.9,1,1.1,1.2,1.3,1.4,1.5,1.6');
    eq('צעד-נוסף בתקרה נשאר 1.6', A.stepScale(v, 1), 1.6);
  }

  // ── parseAcc (a11y.ts:49-58) ──
  Map<String, bool> off() =>
      {'contrast': false, 'noanim': false, 'links': false, 'spacing': false};
  eq('parseAcc(null)', A.parseAcc(null), off());
  eq("parseAcc('')", A.parseAcc(''), off());
  eq('חלקי ⇒ השאר false', A.parseAcc('{"contrast":true}'),
      {...off(), 'contrast': true});
  eq('JSON שבור ⇒ הכול-כבוי בשקט', A.parseAcc('לא-JSON{'), off());
  eq('JSON שאינו אובייקט ⇒ הכול-כבוי', A.parseAcc('"עברית"'), off());
  eq("parseAcc('null')", A.parseAcc('null'), off());
  eq('מערך ⇒ הכול-כבוי', A.parseAcc('[1,2]'), off());
  eq('כפיית-!! על ערכים לא-בוליאניים', A.parseAcc('{"contrast":1,"links":"כן"}'),
      {...off(), 'contrast': true, 'links': true});
  eq('הכול-דלוק', A.parseAcc('{"contrast":true,"noanim":true,"links":true,"spacing":true}'),
      {'contrast': true, 'noanim': true, 'links': true, 'spacing': true});

  if (fails > 0) {
    print('❌ קופסת-הנגישות (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('a11y dart proof failed');
  }
  print('✓ קופסת-הנגישות (Dart): $n טענות — 3 קבועים + 4 מתגים verbatim · clampScale '
      '(8 קצוות) · stepScale (שרשרת 0.8→1.6 בלי float) · parseAcc (9 קלטים) — '
      'פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
