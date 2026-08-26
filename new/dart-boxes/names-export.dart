// 📦 קופסת-חיבורים · כפתור ייצוא-השמות (Dart) — מחווטת 3 אטומי-Dart. מקבילה ל-new/boxes/names-export.mjs.
// חוזה משותף: new/boxes/names-export.contract.md. מקור-האמת: מאור AyinNamesBoard+SupportersView+csvx.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// סדר-החיווט חתום (LAW): שער-ההרשאה (isAdmin) *לפני* ייצור-התוכן (toCsv). שקעי-התוכן
// (LABEL/FILENAME) = ידע-קופסה (חוק-5), לא אטומים.
import '../dart-maor/csv-escape.dart' as ce;
import '../dart-maor/to-csv.dart' as tc;
import '../dart-maor/is-admin.dart' as ia;

// ── שקעי-תוכן (מילון הקופסה; verbatim מהמקור) ────────────────────────────────
const String _label = '⬇ ייצוא CSV';
const String _filename = 'names-report.csv';

// ── מתאם-טיפוס לשקע-ה-escape (toCsv מצפה ל-dynamic; csvEscape מקבל Object?) ────
String _escape(dynamic x) => ce.csvEscape(x);

// ── החיווט (שער ⇒ הגנה ⇒ קובץ) ───────────────────────────────────────────────
// זהה-ביט למקור: לא-מנהל ⇒ {allowed:false} (בלי content/label/filename);
// מנהל ⇒ {allowed:true, label, filename, content: toCsv(rows, csvEscape)}.
Map<String, dynamic> exportNames({
  required dynamic rows,
  required dynamic userEmail,
  required dynamic adminEmails,
}) {
  if (!ia.isAdmin(
      (adminEmails as List?)?.cast<String>(), userEmail as String?)) {
    return {'allowed': false};
  }
  return {
    'allowed': true,
    'label': _label,
    'filename': _filename,
    'content': tc.toCsv(rows, _escape),
  };
}
