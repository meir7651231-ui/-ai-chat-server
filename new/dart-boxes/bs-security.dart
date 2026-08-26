// 📦 קופסת-חיבורים · bs-security (בנייה-חכמה) — ולידציה · הרשאות · ביקורת.
// מקור-האמת: buildsmart/app_flutter/lib/logic (input_validators · install_engine ·
//   studio/component_palette · studio/rules_model · studio/edit_safety · data_quality).
// מחווטת 11 אטומי-בנייה-חכמה מ-../dart/ (snake_case) לשלוש חזיתות-אבטחה:
//   (1) ולידציית-קלט  — validEmail · validIsraeliMobile · validBusinessId ·
//                        validBoardCode · validPositiveAmount · validateCondition.
//   (2) הרשאות-הרכבה  — canConnect (התאמת-מוצרים) · canPlace (שחרור-לתוך-מיכל).
//   (3) עקבת-ביקורת   — auditLine · auditTrail/renderAuditTrail (חסימות) · auditRows (איכות-קטלוג).
//
// שקעי-האטומים נסגרים כאן במדיניות-קופסה (הכרעת-קופסה · חוק-5) כדי לחשוף API-נקי, ללא-שקעים:
//   • validateCondition — allowlist שדות/אופרטורים + מפעל-SecCondition (מדיניות-קופסה).
//   • canConnect        — מפת verified-specs ⇒ שקע-האימות (מתאם-טיפוס; חסר ⇒ name-inference).
//   • canPlace          — פלטת-הרשאות ברירת-מחדל (verbatim component_palette.dart:167,189).
//   • auditTrail        — שקע-הרינדור מחווט לאטום-האח auditLine דרך BlockedEntry.
//   • auditRows         — שקע-normName = נרמול-אמת (verbatim name-matches/norm_name).
// דבקי-החיווט, הטיפוסים-הבית (BlockedEntry/SecCondition) והמדיניות = ידע-קופסה (חוק-5), לא אטומים.
import '../dart/valid_email.dart' as ve;
import '../dart/valid_israeli_mobile.dart' as vim;
import '../dart/valid_business_id.dart' as vbi;
import '../dart/valid_board_code.dart' as vbc;
import '../dart/valid_positive_amount.dart' as vpa;
import '../dart/validate_condition.dart' as vcnd;
import '../dart/can_connect.dart' as cc;
import '../dart/can_place.dart' as cp;
import '../dart/audit_line.dart' as al;
import '../dart/audit_trail.dart' as at;
import '../dart/audit_rows.dart' as ar;

// ── טיפוסי-האטום שנחשפים ב-API (מתאמי-שם דרך typedef; חוק-5) ──────────────────
typedef ConnPart = cc.ConnPart; // מחזיק-קלט של canConnect
typedef QualityRow = ar.QualityRow; // שורת-קלט לסריקת-איכות
typedef QualityWarning = ar.QualityWarning; // אזהרת-איכות בודדת
typedef QualityReport = ar.QualityReport; // דוח-סריקה מלא

// ══ (1) ולידציית-קלט ═════════════════════════════════════════════════════════
// חמשת הבודקים חסרי-השקע — מוגשים כמות-שהם (החיווט = בחירת-האטום בלבד).
bool validEmail(String input) => ve.validEmail(input);
bool validIsraeliMobile(String input) => vim.validIsraeliMobile(input);
bool validBusinessId(String input) => vbi.validBusinessId(input);
bool validBoardCode(String input) => vbc.validBoardCode(input);
bool validPositiveAmount(num? value) => vpa.validPositiveAmount(value);

/// תנאי-כלל מאומת (טיפוס-בית של הקופסה — המקור RuleCondition נעדר מעץ-העבודה).
class SecCondition {
  final String field;
  final String op;
  final num value;
  const SecCondition(this.field, this.op, this.value);
  @override
  String toString() => 'SecCondition($field $op $value)';
}

// מדיניות-קופסה (הכרעת-קופסה · חוק-5): allowlist שדות/אופרטורים מספריים לתנאי-כלל.
// המקור (rules_model.dart) מגדיר את הסטים כ-enums נעדרים ⇒ נבחרה קבוצה-מספרית שמרנית.
const Set<String> _conditionFields = {
  'age', 'total', 'count', 'amount', 'qty', 'income', 'size', 'price', 'budget',
};
const Set<String> _conditionOps = {'gt', 'lt', 'gte', 'lte', 'eq', 'ne'};
String? _matchField(String s) => _conditionFields.contains(s) ? s : null;
String? _matchOp(String s) => _conditionOps.contains(s) ? s : null;
SecCondition _makeCondition(String f, String o, num v) => SecCondition(f, o, v);

/// מאמת Map-תנאי גולמי ל-SecCondition, או null בכל שער-כשל (fail-closed):
/// לא-Map · שדה-לא-מוכר · אופרטור-לא-מוכר · ערך-לא-מספרי.
SecCondition? validateCondition(Object? raw) =>
    vcnd.validateCondition<String, String, SecCondition>(
      raw,
      matchConditionField: _matchField,
      matchRuleOp: _matchOp,
      makeCondition: _makeCondition,
    );

// ══ (2) הרשאות-הרכבה ═════════════════════════════════════════════════════════
// מתאם-טיפוס: מפת verified-specs (sku ⇒ קבוצת-skus תואמים) ⇒ שקע-האימות של canConnect.
// חסר-מפה ⇒ null ⇒ נפילה ל-name-inference; לא-לשניהם ספק ⇒ null; אחרת חברות-בקבוצה.
bool? Function(String, String) _verifiedFrom(Map<String, Set<String>>? specs) =>
    (String a, String b) {
      if (specs == null) return null;
      final va = specs[a], vb = specs[b];
      if (va == null || vb == null) return null; // לא לשני-הצדדים ספק-מאומת
      return va.contains(b);
    };

/// האם שני מוצרי-אינסטלציה יכולים להתחבר. `verifiedSpecs` (אופציונלי) גובר על
/// ההיסק-לפי-שם כשלשני ה-skus ספק-מאומת; חסר ⇒ name-inference (חפיפת-גדלים/מין/שיטה).
bool canConnect(ConnPart a, ConnPart b, {Map<String, Set<String>>? verifiedSpecs}) =>
    cc.canConnect(a, b, verifiedCompat: _verifiedFrom(verifiedSpecs));

// מדיניות-קופסה: פלטת-ההרשאות של הסטודיו — verbatim component_palette.dart:167,189
// (כל תבנית allowedContainers = {container, list}). הכרעת-קופסה — המפה-המקורית נעדרת.
const Map<String, Set<String>> _placePalette = {
  'button': {'container', 'list'},
  'divider': {'container', 'list'},
  'text': {'container', 'list'},
  'image': {'container', 'list'},
};
Set<String>? _allowedContainersFor(String type) => _placePalette[type];

/// האם רכיב מסוג `type` מותר לשחרור לתוך מיכל מסוג `container`.
/// fail-closed: סוג-לא-מוכר בפלטה ⇒ false.
bool canPlace(String type, String container) =>
    cp.canPlace<String, String>(type, container, allowedContainersFor: _allowedContainersFor);

// ══ (3) עקבת-ביקורת ══════════════════════════════════════════════════════════
/// רשומת-חסימה אחת (טיפוס-בית — BlockedEntry/ConfigOp נעדרים ⇒ שלושת-השדות-הנצרכים).
class BlockedEntry {
  final String opTag; // תגית-הפעולה (setText/setEmoji/…)
  final String opId; // מזהה-הרכיב שנחסם
  final String reasonHe; // נימוק-החסימה בעברית
  const BlockedEntry({required this.opTag, required this.opId, required this.reasonHe});
}

/// מרנדר רשומת-חסימה אחת לשורת-ביקורת ('⛔ opTag · opId · reasonHe').
String auditLine(BlockedEntry e) =>
    al.auditLine(opTag: e.opTag, opId: e.opId, reasonHe: e.reasonHe);

/// כל רשימת-החסימות כשורות-ביקורת (שקע-הרינדור מחווט ל-auditLine דרך BlockedEntry).
List<String> auditTrail(List<BlockedEntry> blocked) =>
    at.auditTrail<BlockedEntry>(blocked, auditLine: auditLine);

/// עקבת-הביקורת כבלוק-טקסט אחד מופרד-'\n' (בלי שורה-נגררת).
String renderAuditTrail(List<BlockedEntry> blocked) =>
    at.renderAuditTrail<BlockedEntry>(blocked, auditLine: auditLine);

// שקע-נרמול-האיכות: verbatim מ-name-matches/norm_name (ידע-קופסה · חוק-5) —
// הסרת-ניקוד → פיסוק ["'.,-()] לרווח → כיווץ-רווחים → trim → lowercase.
final RegExp _niqqud = RegExp('[֑-ׇ]');
final RegExp _punct = RegExp(r"""["'.,\-()]""");
final RegExp _ws = RegExp(r'\s+');
String _normName(String s) => s
    .replaceAll(_niqqud, '')
    .replaceAll(_punct, ' ')
    .replaceAll(_ws, ' ')
    .trim()
    .toLowerCase();

/// סורק שורות-קטלוג לשמות-כפולים (מק"ט שונה) ומק"טים-כמעט-זהים (רישיות/רווח בלבד),
/// עם שקע-הנרמול מחווט למדיניות-הקופסה. מחזיר QualityReport (אזהרות + מספר-שורות).
QualityReport auditRows(List<QualityRow> rows) =>
    ar.auditRows(rows, normName: _normName);
