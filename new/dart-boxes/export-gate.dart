// 📦 קופסת-חיבורים · שער-יציאת-המידע (Dart) — מחווטת 3 אטומי-Dart. מקבילה ל-new/boxes/export-gate.mjs.
// חוזה משותף: new/boxes/export-gate.contract.md. אותם 3 חוטים, אותה לידה-מותרת, אותו API.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// נקודת-החנק היחידה לפני כל הורדה/הדפסה/העתקה (בקשת-בעלים 13.8) — שני משתני-המודול
// של המקור (exportGate.ts:15-16) הם מצב-הקופסה כאן, בדיוק כמו ב-JS.
// שקע-IO: onBlocked (toast) מוזרק ע"י הקורא — הקופסה לא נוגעת ב-DOM (חוק-6).
//
// מתאמי-טיפוס (Dart קשיח-ארינות; ה-JS גמיש): מצב-האטום הוא Map<String,dynamic>;
// לפני חיווט ל-guardExport מיישרים blocked⇒bool ו-notify⇒void Function()? (ההשמה
// הזאת עצמה = חיווט-קופסה, לא אטום — האטומים נשארים טהורים וחסרי-מצב, חוק-1/5).
import '../dart-maor/set-export-blocked.dart' as sb;
import '../dart-maor/export-allowed.dart' as ea;
import '../dart-maor/guard-export.dart' as ge;

// ── החיווט ── (מחלקה = מקבילת-הסגור של createExportGate ב-JS; מחזיקה את מצב-הקופסה)
class ExportGate {
  // הכרעת-הקופסה · לידה-מותרת: blocked=false · notify=null (exportGate.ts:15-16 —
  // חוזה-הדגלים: חסר=מותר, רק false בכרטיס-העובד חוסם).
  Map<String, dynamic> _state = sb.setExportBlocked(false, null);

  /// נקבע מ-App לפי הקונפיג-האפקטיבי; onBlocked (אופציונלי) מריץ toast בסירוב.
  void setExportBlocked(dynamic isBlocked, [void Function()? onBlocked]) {
    _state = sb.setExportBlocked(isBlocked, onBlocked);
  }

  /// האם יציאת-מידע מותרת כרגע (חסר-דגל/ברירת-מחדל ⇒ true) — שקט, בלי toast.
  bool exportAllowed() => ea.exportAllowed(_state['blocked']);

  /// שער לפני כל נתיב-יציאה: מותר ⇒ true; חסום ⇒ מריץ התרעה ומחזיר false.
  bool guardExport() =>
      ge.guardExport(_state['blocked'] as bool, _state['notify'] as void Function()?);
}

ExportGate createExportGate() => ExportGate();

// ── מופע-המודול-היחיד (כמו במקור) + חתימות-המקור ──
final ExportGate gate = createExportGate();
void setExportBlocked(dynamic isBlocked, [void Function()? onBlocked]) =>
    gate.setExportBlocked(isBlocked, onBlocked);
bool exportAllowed() => gate.exportAllowed();
bool guardExport() => gate.guardExport();
