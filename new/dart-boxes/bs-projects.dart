import '../dart-data/invoice_title-terms.dart' as td_invoice_title;
import '../dart-data/critical_business_kind-terms.dart';
// 📦 קופסת-חיבורים · bs-projects (בנייה-חכמה) — תמחיר/פיננסים של פרויקטי-בנייה.
// חוזה: מקור-האמת buildsmart/app_flutter/lib/logic (invoice · manager_dashboard ·
//        install_engine · customer_score) + lib/domain/connection_schema.dart.
// זו קופסת-בנייה-חכמה שלישית (אחרי bs-matching · bs-workflow) — מחווטת 11 אטומי-בנייה
// מ-../dart/. אף אטום אינו נגוע. שקעים = אח-אטום · ברירת-מחדל-של-האטום · הכרעת-קופסה.
//
// ── ארבעת האשכולות ────────────────────────────────────────────────────────────────
//   A · חשבונית ומע"מ        — invoiceTitle · invoiceVatOf   (שקע-שיעור = הכרעת-קופסה)
//   B · אשראי-קבלן ודירוג    — contractorCredit · band       (סף-דירוג = הכרעת-קופסה)
//   C · הנדסת-תאימות         — boreMeters · compliance · criticalOpen (חיווט-אח + טבלה)
//   D · סכמת-חיבורים         — sizeMatchFrom · sizeTableEq · sizeTableHash
//
// ── פער-הייצוג ──────────────────────────────────────────────────────────────────────
// בשונה מ-bs-workflow (שמונה עותקי-inline של אותו טיפוס ⇒ מודל-קנוני+גשר), כאן כל
// טיפוס-דומיין ייחודי לאטום-שלו (EndType/ConnectorEnd · CriticalKind · SizeMatch) —
// אין כפילות ⇒ הקופסה **מייצאת** אותם כפי-שהם (export show), בלי מתאמי-גשר.
import '../dart/band.dart' as bnd;
import '../dart/bore_meters.dart' as bm;
import '../dart/compliance.dart' as cmp;
import '../dart/contractor_credit.dart' as cc;
import '../dart/critical_business_kind.dart' as cbk;
import '../dart/critical_open.dart' as co;
import '../dart/invoice_title.dart' as it;
import '../dart/invoice_vat_of.dart' as ivo;
import '../dart/size_match_from.dart' as smf;
import '../dart/size_table_eq.dart' as ste;
import '../dart/size_table_hash.dart' as sth;

// ── ייצוא הטיפוסים-הפומביים של האטומים (פער-הייצוג: טיפוס-ייחודי ⇒ ייצוא-ישיר) ──────
export '../dart/bore_meters.dart' show EndType, ConnectorEnd;
export '../dart/critical_business_kind.dart' show CriticalKind;
export '../dart/size_match_from.dart' show SizeMatch;

// ════════════════════════════════════════════════════════════════════════════════════
// A · חשבונית ומע"מ
// ════════════════════════════════════════════════════════════════════════════════════

// ── הכרעת-קופסה: שיעור-המע"מ הקנוני ──────────────────────────────────────────────────
// המקור const `kVatRate` (invoice.dart) **בלתי-בר-שחזור** — קובץ-המקור נמחק מהעץ-החי
// (grep ריק 2026-08-26). הקופסה מכריעה על השיעור התקני-בישראל 18% (דיבר-9: הכרעת-קופסה
// במקום זיוף-ערך). הצרכן שרוצה שיעור-אחר קורא ל-invoiceVatOf-האטום ישירות.
const double _vatRate = 0.18;

/// כותרת-מסמך: 'קבלה — <id>' כאשר receipt=true, אחרת 'חשבונית — <id>'.
/// שקע-`orderId` = ידע-הקשר (במקור order.id) ⇒ נשאר פרמטר (חוק-3, הצרכן מזריק).
String invoiceTitle(String orderId, {required bool receipt}) =>
    it.invoiceTitle(orderId, receipt: receipt, term: (k)=>td_invoice_title.kTerms[k]!);

/// רכיב-המע"מ מסכום-ברוטו (כולל-מע"מ), לאחור. שקע-שיעור מחווט להכרעת-הקופסה `_vatRate`.
int invoiceVatOf(int grossTotal) =>
    ivo.invoiceVatOf(grossTotal, vatRate: _vatRate);

// ════════════════════════════════════════════════════════════════════════════════════
// B · אשראי-קבלן ודירוג
// ════════════════════════════════════════════════════════════════════════════════════

// ── הכרעת-קופסה: ספי-דירוג-האשראי בתוך רצועת-הקבלן [30000,120000] ─────────────────────
// customer_score._band (אטום band) מדרג ל-3 רמות; manager_dashboard (אטום contractorCredit)
// מפיק אשראי ברצועה [30000,120000]. חיבורם = "לאיזו רמת-אשראי שייך קבלן" הוא **ידע-הקשר
// שנעדר מהמקור** (אף קובץ לא משדך אותם) ⇒ הכרעת-קופסה: סף-גבוה 90000 · סף-אמצע 60000
// (חלוקת-הרצועה לשלישים גסים). כמו _fuzzyTolerance ב-bs-matching — מדיניות-קופסה מפורשת.
const int _creditHigh = 90000;
const int _creditMid = 60000;

/// אשראי יציב (₪) לקבלן לפי שמו — hash דטרמיניסטי ברצועה [30000,120000], מעוגל ל-₪100.
int contractorCredit(String name) => cc.contractorCredit(name);

/// מדרג ערך-מספרי ל-3 רמות (0/1/2) לפי שני ספים. verbatim customer_score._band.
int band(int value, int high, int mid) => bnd.band(value, high, mid);

/// דירוג-אשראי-הקבלן (0/1/2): מזין את אשראי-הקבלן ל-`band` עם ספי-הקופסה.
/// חיווט-אח (חוק-3): contractorCreditTier → contractorCredit + band. ‏0=רגיל · 1=טוב · 2=מעולה.
int contractorCreditTier(String name) =>
    band(contractorCredit(name), _creditHigh, _creditMid);

// ════════════════════════════════════════════════════════════════════════════════════
// C · הנדסת-תאימות
// ════════════════════════════════════════════════════════════════════════════════════

// ── הכרעת-קופסה: טבלת-BSP הקנונית (אינץ׳→מ״מ) ────────────────────────────────────────
// שקע-boreMeters `bspInchToMm` = מקור-אמת-יחיד. הקופסה מחזיקה את הטבלה-המאומתת verbatim
// מ-lipskey_verified_connections.dart:32-35 (הכרעת-קופסה — הטבלה הקנונית של הדומיין).
const Map<String, int> _bspInchToMm = {
  '1/4': 8,
  '3/8': 10,
  '1/2': 15,
  '3/4': 20,
  '1': 25,
  '1-1/4': 32,
  '1-1/2': 40,
  '2': 50,
  '2-1/2': 65,
};

/// קוטר-פנים במטרים לקצה-מחבר, או null כשהמידה לא-ניתנת-לפענוח / הברגה לא-מוכרת.
/// שקע-הטבלה מחווט להכרעת-הקופסה `_bspInchToMm`.
double? boreMeters(bm.ConnectorEnd e) =>
    bm.boreMeters(e, bspInchToMm: _bspInchToMm);

/// צ'ק-ליסט-תאימות לתוכנית ב-[tempC] — מסירת-דרך טהורה אל השקע [checklist].
/// שני השקעים (items · checklist) = ידע-הקשר ⇒ נשארים פרמטרים (חוק-3, הצרכן מזריק).
List<C> compliance<P, C>(
  int tempC, {
  required List<P> items,
  required List<C> Function(List<P> items, int tempC, Set<String> accessories)
      checklist,
  Set<String> accessories = const {},
}) =>
    cmp.compliance<P, C>(tempC,
        items: items, checklist: checklist, accessories: accessories);

/// רשומת-פריט-תאימות: מסופק? · קריטי? — צורת-הפלט של [checklist] כשמזינים ל-criticalOpen.
typedef ComplianceRow = ({bool satisfied, bool critical});

/// ספירת פריטי-תאימות קריטיים-שאינם-מסופקים בקו — שער "אפס-קריטי-חסר".
/// **חיווט-אח (חוק-3):** שקע-ה-compliance של האטום criticalOpen מחווט לאטום-האח
/// `compliance` (כמו bs-workflow: wfAdvanceLabel→wfStageLabel). criticalOpen מזין
/// (tempC, accessories) → compliance(tempC, items, checklist, accessories) → סינון קריטי-פתוח.
int criticalOpen<P>(
  int tempC, {
  required List<P> items,
  required List<ComplianceRow> Function(
          List<P> items, int tempC, Set<String> accessories)
      checklist,
  Set<String> accessories = const {},
}) =>
    co.criticalOpen(
      tempC,
      accessories: accessories,
      compliance: (t, a) => cmp.compliance<P, ComplianceRow>(t,
          items: items, checklist: checklist, accessories: a),
    );

/// סיווג רכיב-ממשק כ"קריטי-עסקית" (אישור-הזמנה / מחיר) לפי id+תווית, אחרת null.
cbk.CriticalKind? criticalBusinessKind(
        {required String id, required String labelHe}) =>
    cbk.criticalBusinessKind(id: id, labelHe: labelHe, term: (k)=>kTerms[k]!);

// ════════════════════════════════════════════════════════════════════════════════════
// D · סכמת-חיבורים
// ════════════════════════════════════════════════════════════════════════════════════

/// מפענח-סובלני: ה-SizeMatch ש-`.name` שווה בדיוק ל-[v]; לא-מוכר/null/לא-String ⇒ exactSame.
smf.SizeMatch sizeMatchFrom(Object? v) => smf.sizeMatchFrom(v);

/// שוויון-ערך של שתי טבלאות-מידה. שקע-`rowEq` נשאר עם ברירת-המחדל של האטום (listEquals-שקול).
bool sizeTableEq(
  List<List<String>>? a,
  List<List<String>>? b, {
  bool Function(List<String> x, List<String> y)? rowEq,
}) =>
    rowEq == null
        ? ste.sizeTableEq(a, b)
        : ste.sizeTableEq(a, b, rowEq: rowEq);

/// גיבוב-מבני רגיש-סדר של טבלת-מידות nullable. `null → 0`.
int sizeTableHash(List<List<String>>? t) => sth.sizeTableHash(t);
