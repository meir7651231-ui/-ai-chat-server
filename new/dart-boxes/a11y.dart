// 📦 קופסת-חיבורים · נגישות (a11y) — מחווטת 7 אטומי-Dart. מקבילה ל-new/boxes/a11y.mjs.
// חוזה משותף: new/boxes/a11y.contract.md. מקור-האמת: maor/src/lib/a11y.ts
//   (P2 פער 31; legacy-main-script.js:3184-3194).
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// הקופסה טהורה כמו המקור (a11y.ts:8-9) — ההחלה על DOM/localStorage
// (components/settings/a11yApply.ts) = שקעי-לוח-אם של הצרכן, לא כאן (חוק-6).
//
// כל החיווט — כולל התאמות-טיפוס ל-Dart הקשיח-ארינות — חי בקופסה בלבד. אף אטום
// לא מייבא אטום (חוק-1/2). סדר-ההצתה · ברירות-המחדל · דבקי-החיווט · הקבועים —
// verbatim כמו a11y.mjs.
import '../dart-maor/scale-min.dart' as smin;
import '../dart-maor/scale-max.dart' as smax;
import '../dart-maor/scale-step.dart' as sstep;
import '../dart-maor/a11y-fab-toggles.dart' as fab;
import '../dart-maor/clamp-scale.dart' as cs;
import '../dart-maor/step-scale.dart' as ss;
import '../dart-maor/parse-acc.dart' as pa;

// ── קבועי-הסולם והמילון — מיוצאים מהחוטים כלשונם (a11y.ts:13-15,27-32) ─────────
//   ‏a11y.mjs עושה `export { SCALE_MIN, SCALE_MAX, SCALE_STEP, A11Y_FAB_TOGGLES }`;
//   ב-Dart אין re-export של const-חוצה-ספרייה בשם זהה, לכן חושפים final-כינוי
//   שערכו הוא קבוע-החוט (ביט-זהה, אפס-שכפול-ליטרל).
final double scaleMin = smin.scaleMin;
final double scaleMax = smax.scaleMax;
final double scaleStep = sstep.scaleStep;
final List<List<String>> a11yFabToggles = fab.a11yFabToggles;

/// הכרעה 1: גבולות-הזום של הלגאסי מוזרקים לחוט-ההצמדה (a11y.ts:35-38);
/// לא-מספרי ⇒ 1 (ברירת-המחדל חיה בחוט).
/// ‏JS: `clampScaleAtom(v, SCALE_MIN, SCALE_MAX)` — כאן זהה, עם קבועי-החוטים.
num clampScale(dynamic v) => cs.clampScale(v, smin.scaleMin, smax.scaleMax);

/// הכרעה 2: צעד אחד למעלה/למטה — הצעד = SCALE_STEP וההצמדה דרך clampScale
/// המחווט-כאן (a11y.ts:44-46); העיגול-לעשירית נגד שאריות float חי בחוט.
/// ‏JS: `stepScaleAtom(v, dir, clampScale, SCALE_STEP)` — אותו סדר-שקעים בדיוק:
///   השקע-המוזרק הוא clampScale של-הקופסה (החד-ארגומנטי), לא האטום החשוף.
dynamic stepScale(dynamic v, dynamic dir) =>
    ss.stepScale(v, dir, clampScale, sstep.scaleStep);

/// פענוח JSON ההעדפות — קלט פגום/חלקי ⇒ הכול-כבוי בשקט (a11y.ts:49-58).
Map<String, bool> parseAcc(dynamic raw) => pa.parseAcc(raw);
