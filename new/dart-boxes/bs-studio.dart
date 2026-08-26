import '../dart-data/kind_plural-terms.dart';
// 📦 קופסת-חיבורים · bs-studio (בנייה-חכמה · ניהול-סטודיו + פרומפטי-קופיילוט).
// מקור-האמת: buildsmart/app_flutter/lib/logic/{studio/*, manager_copilot, intel/segments,
//   tasks_gantt, system_division, install_engine}. מחווטת 10 אטומי-בנייה-חכמה מ-../dart/.
// חמישה אשכולות שמתחברים ללוח-האם המאוחד (board.dart):
//   (א) סיווג-טווח-הסטודיו (Stage-A) — רישום-חי ⇒ טוקני-טווח ⇒ פרומפט-בחירה.
//   (ב) דיף-תצוגה — אמוג'י + שם-רבים-עברי פר-סוג-פעולת-קונפיג.
//   (ג) קופיילוט-המנהל — פרומפט-שאלה + פרומפט-תדריך-בוקר.
//   (ד) אינטל-הסטודיו — קוהורטת-נאמנות + פריסת-Gantt של משימות.
//   (ה) קטלוג-בנייה — חלוקת-מערכות-מים + התאמת-טמפרטורה של מוצר.
//
// ── הכרעות-קופסה (חוק-3/8 · ידע-קופסה) ─────────────────────────────────────────
// 1) אוצר-הטווח הלכיד: הערכים המקוריים (kScopeAll/kScopeScreenPrefix/kScopeSinglePrefix)
//    נעדרו מהטיוטות (חוק-8 באטומים ⇒ הורמו לשקעים). הקופסה מכריעה אוצר **אחד לכיד**
//    התואם את bs-actions האחות: studioScopeTokens פולט '<screenPrefix><ns>' ⇒
//    studioScopePrompt צורך '<singlePrefix><id>' מאותו אוצר. שקע scopeTokenHe נשאר
//    caller-injected (תצוגה — שייך ל-bs-actions/הרישום, לא משוכפל כאן).
// 2) type-adapter ל-ConfigOpKind: kind_emoji ו-kind_plural מגדירים כל אחד enum ConfigOpKind
//    נפרד (verbatim מ-diff_preview.dart — 6 ערכים, סדר זהה). הקופסה מייצאת את של
//    kind_emoji כטיפוס-הקנוני, ומתאמת ל-kindPlural לפי .index (מיפוי-אינדקס מדויק כי
//    הסדר זהה). מגן-סחף: הפרוף מאמת שוויון-אורך בין ה-enums.
import '../dart/build_cohort.dart' as bc;
import '../dart/build_tasks_gantt.dart' as btg;
import '../dart/kind_emoji.dart' as ke;
import '../dart/kind_plural.dart' as kp;
import '../dart/manager_copilot_prompt.dart' as mcp;
import '../dart/manager_morning_brief_prompt.dart' as mmb;
import '../dart/product_division_systems.dart' as pds;
import '../dart/product_suitable_for_temp.dart' as pst;
import '../dart/studio_scope_prompt.dart' as ssp;
import '../dart/studio_scope_tokens.dart' as sst;

// ── טיפוסי-הנתונים שהאטומים פועלים עליהם — נחשפים דרך הקופסה (data-shapes) ──────
export '../dart/build_cohort.dart' show RetentionCohort;
export '../dart/build_tasks_gantt.dart' show TaskItem, GanttBar, TasksGanttLayout;
export '../dart/kind_emoji.dart' show ConfigOpKind; // הטיפוס-הקנוני (הכרעת-קופסה 2)
export '../dart/product_division_systems.dart' show WaterSystem;

// ── אוצר-הטווח הלכיד (הכרעת-קופסה 1) — אחד לכל צינור-הסטודיו, תואם bs-actions ──────
const String _scopeAll = 'scope:all';
const String _screenPrefix = 'scope:screen:';
const String _singlePrefix = 'scope:single:';

// ── type-adapter (הכרעת-קופסה 2): הקנוני (kind_emoji) ⇒ enum של kind_plural לפי-אינדקס ──
kp.ConfigOpKind _toKp(ke.ConfigOpKind k) => kp.ConfigOpKind.values[k.index];

// ═══ אשכול א׳ · סיווג טווח-העריכה של הסטודיו (Stage-A) ═══════════════════════════

/// קבוצת-הטוקנים הפתוחה לעריכה: {scopeAll} + '<screenPrefix><ns>' לכל אלמנט בעל מרחב-שם
/// לא-ריק. הקופסה מזריקה את scopeAll/screenPrefix; [elementIds]=הרישום-החי · [namespaceOf]=חילוץ-מרחב.
Set<String> studioScopeTokens({
  required Iterable<String> Function() elementIds,
  required String Function(String id) namespaceOf,
}) =>
    sst.studioScopeTokens(
      elementIds: elementIds,
      namespaceOf: namespaceOf,
      scopeAll: _scopeAll,
      screenPrefix: _screenPrefix,
    );

/// פרומפט Stage-A לבחירת-טווח: הטוקנים הממוינים (token = תיאור), שורת-הבודד, הבקשה
/// המחוטאת והוראת-הבחירה-הסגורה. הקופסה מזריקה את singlePrefix מהאוצר-הלכיד.
/// [safeText]=חיטוי-הבקשה · [scopeTokens]=ספק-הטוקנים (בד"כ () => studioScopeTokens(...)) ·
/// [scopeTokenHe]=טוקן ⇒ תיאור-עברי (caller-injected · תצוגה).
String studioScopePrompt(
  String utterance, {
  required String Function(String) safeText,
  required Set<String> Function() scopeTokens,
  required String Function(String) scopeTokenHe,
}) =>
    ssp.studioScopePrompt(
      utterance,
      safeText: safeText,
      scopeTokens: scopeTokens,
      scopeTokenHe: scopeTokenHe,
      singlePrefix: _singlePrefix,
    );

// ═══ אשכול ב׳ · דיף-תצוגה — מונחי סוג-פעולת-קונפיג ═══════════════════════════════

/// אמוג'י מייצג לסוג-פעולה (✏️/🙂/🙈/↕️/🎨/⚙️). switch ממצה.
String kindEmoji(ke.ConfigOpKind kind) => ke.kindEmoji(kind);

/// שם-עצם עברי ברבים לספירת-קבוצה פר-סוג-פעולה; setStyle=='צבעים' רק כש-[styleAllColor],
/// אחרת 'עיצובים'. מותאם-טיפוס לאותו ConfigOpKind קנוני (הכרעת-קופסה 2).
String kindPlural(ke.ConfigOpKind kind, bool styleAllColor) =>
    kp.kindPlural(_toKp(kind), styleAllColor, term: (k)=>kTerms[k]!);

// ═══ אשכול ג׳ · קופיילוט-המנהל — פרומפטים ════════════════════════════════════════

/// פרומפט-קופיילוט: מצב-העסק [context] + שאלת-הבעלים [question] מחוטאת (maxLen 400).
/// [promptSafeText]=שקע-החיטוי (הקורא כובל maxLen).
String managerCopilotPrompt(
  String context,
  String question, {
  required String Function(String text, {int maxLen}) promptSafeText,
}) =>
    mcp.managerCopilotPrompt(context, question, promptSafeText: promptSafeText);

/// פרומפט-תדריך-בוקר: מצב-אמת [context] + הנחיית 3-4 נקודות-תבליט (אפס-שקע).
String managerMorningBriefPrompt(String context) =>
    mmb.managerMorningBriefPrompt(context);

// ═══ אשכול ד׳ · אינטל-הסטודיו — קוהורטה + Gantt ══════════════════════════════════

/// קוהורטת-נאמנות ליום-בסיס [day]: לכל offset-ימים קדימה, כמה קבוצות-חברים חזרו.
bc.RetentionCohort buildCohort(DateTime day, List<Set<DateTime>> members) =>
    bc.buildCohort(day, members);

/// פריסת-Gantt: משימות-מעוגנות ⇒ GanttBar (startDay יחסי, lenDays≥1, מיון startDay→taskId),
/// spanDays, ומשימות-לא-מעוגנות בנפרד. [daysBetweenDst]=הפרש-ימים DST-בטוח · [donePercent]=אחוז-השלמה.
btg.TasksGanttLayout buildTasksGantt(
  List<btg.TaskItem> tasks, {
  required int Function(DateTime a, DateTime b) daysBetweenDst,
  required int Function(btg.TaskItem t) donePercent,
}) =>
    btg.buildTasksGantt(tasks, daysBetweenDst: daysBetweenDst, donePercent: donePercent);

// ═══ אשכול ה׳ · קטלוג-בנייה — מערכות-מים + טמפרטורה ══════════════════════════════

/// לאיזו מערכת-מים שייך מוצר: [verifiedEndSystems] לא-ריק גובר; אחרת [brand] מכריע
/// (פולירול ⇒ אספקה, אחרת ⇒ ניקוז).
Set<pds.WaterSystem> productDivisionSystems(
  String brand, {
  required Set<pds.WaterSystem>? verifiedEndSystems,
}) =>
    pds.productDivisionSystems(brand, verifiedEndSystems: verifiedEndSystems);

/// האם המוצר עומד בטמפרטורת-הקו [tempC]: אין דירוג ([maxTempC]==null) ⇒ תמיד true;
/// אחרת tempC <= maxTempC.
bool productSuitableForTemp(int tempC, {required int? maxTempC}) =>
    // האטום עבר לצורת-שקע-פונקציה (maxTempCOf); הקופסה מזריקה את הערך הסקלרי.
    // התנהגות זהה-ביט: t==null ⇒ true, אחרת tempC ≤ t.
    pst.productSuitableForTemp<Object?>(null, tempC,
        maxTempCOf: (_) => maxTempC?.toDouble());

// ── מגן-סחף לטיפוס-האדפטר (הכרעת-קופסה 2) — נצרך ע"י הפרוף לאימות שוויון-אורך ה-enums ──
int get configOpKindCount => ke.ConfigOpKind.values.length;
int get configOpKindCountPlural => kp.ConfigOpKind.values.length;
