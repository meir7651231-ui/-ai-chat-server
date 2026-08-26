// 📦 קופסת-חיבורים · vertical-packs (Dart) — מחווטת 3 אטומי-Dart. מקבילה ל-new/boxes/vertical-packs.mjs.
// חוזה משותף: new/boxes/vertical-packs.contract.md (אם קיים). מקור-האמת: maor/src/lib/verticalPacks.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// הכרעות-החיווט (חוק-2 — כאן ורק כאן נפגשים החוטים; האטומים עיוורים זה-לזה):
//   1) השקע `packs` של applyVerticalPack מחווט לאטום-הנתונים המלא verticalPacks (13 חבילות),
//      זהה להזרקה `applyVerticalPack(config, packId, VERTICAL_PACKS)` שבמקור-ה-JS.
//   2) הקופסה מייבאת אך-ורק מאטומים (חוק-2 — אין ייבוא-צד).
//
// גישור פער-הייצוג (Dart קשיח-טיפוס): אטום-הנתונים verticalPacks מחזיר `List<dynamic>`
// שאבריו מפות-const עם ערכי-פנים הומוגניים (`Map<String,String>` / `Map<String,bool>`).
// אטום applyVerticalPack דורש `List<Map<String,dynamic>>` ומבצע `as Map<String,dynamic>?`
// על terms/modules/features — קאסט שהיה נכשל על מפה הומוגנית. לכן הקופסה מיישרת: העתק-עומק
// חד-פעמי (`_deep`) לכל האברים ל-`Map<String,dynamic>` תוך שימור סדר-המפתחות (LinkedHashMap).
import '../dart-maor/vertical-packs.dart' as vp;
import '../dart-maor/commercial-off.dart' as co;
import '../dart-maor/apply-vertical-pack.dart' as avp;

// ── דבק-החיווט (glue · ידע-קופסה, חוק-5) — יישור-טיפוס עמוק, שומר-סדר, טהור ─────
dynamic _deep(dynamic v) {
  if (v is Map) return <String, dynamic>{for (final e in v.entries) '${e.key}': _deep(e.value)};
  if (v is List) return <dynamic>[for (final x in v) _deep(x)];
  return v;
}

// ── שקע-הנתונים המחווט: מילון-החבילות המלא (13), מיושר ל-Map<String,dynamic> ────
// הכרעת-החיווט: השקע packs = אטום-הנתונים המלא (verbatim מ-verticalPacks) — לא רשימה-חלקית.
final List<Map<String, dynamic>> PACKS = // ignore: non_constant_identifier_names
    [for (final p in vp.verticalPacks) (_deep(p) as Map<String, dynamic>)];

// ── מייצוא-מחדש: דגלי-הכיבוי-המסחרי (זהה ל-`export { COMMERCIAL_OFF }` שבמקור) ──
final Map<String, bool> commercialOff = co.commercialOff;

// ── ה-API הפומבי (ביט-זהה לחתימות vertical-packs.mjs) ────────────────────────

/// החלת-חבילה — הממשק-החיצוני של הקופסה (השקע packs מחווט לאטום-הנתונים המלא).
/// packId לא-מוכר ⇒ מוחזר config עצמו (אותה הפניה — identical נשמר).
Map<String, dynamic> applyPack(Map<String, dynamic> config, String packId) =>
    avp.applyVerticalPack(config, packId, PACKS);

/// חבילה לפי-מזהה (לתצוגת-אשף) — null כשלא-קיימת.
Map<String, dynamic>? packOf(String id) {
  for (final p in PACKS) {
    if (p['id'] == id) return p;
  }
  return null;
}
