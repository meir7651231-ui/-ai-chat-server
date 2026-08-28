import '../dart-data-maor/audit-cat-colors-terms.dart' as td_audit_cat_colors;
import '../dart-data-maor/audit-report-lines-terms.dart';
// 📦 קופסת-חיבורים · audit (Dart) — מחווטת אטומי-Dart. מקבילה ל-new/boxes/audit.mjs.
// חוזה משותף: new/boxes/audit.contract.md. מקור-האמת: maor/src/lib/audit.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
// חמשת חוטי audit.ts מחווטים לפי גרף-המקור: runAudit ⇐ termOf · normName · validIsraeliId ·
// phoneIssue · ageOf · supporterAggregates (שקע-deps); normName ⇐ normSearch (תפר validate.ts:66);
// שאר החוטים עצמאיים. שקע-IO יחיד: שעון-המכונה — runAudit מקבל now מוזרק (ברירת-מחדל
// DateTime.now(), נאמן-למקור families/lib.ts:30). todayIso נשאר פרמטר-מוזרק כלשון-המקור.
// דבק-החיווט (wiredNormName, מתאמי-הטיפוס לשקעים) = ידע-קופסה (חוק-5), לא אטומים.
import '../dart-maor/audit-cat-colors.dart' as acc;
import '../dart-maor/audit-categories.dart' as acat;
import '../dart-maor/phone-issue.dart' as pi;
import '../dart-maor/run-audit.dart' as ra;
import '../dart-maor/audit-report-lines.dart' as arl;
import '../dart-maor/term-of.dart' as to;
import '../dart-maor/norm-name.dart' as nn;
import '../dart-maor/norm-search.dart' as ns;
import '../dart-maor/valid-israeli-id.dart' as vii;
import '../dart-maor/age-of.dart' as ao;
import '../dart-maor/supporter-aggregates.dart' as sa;

// ── תפר-הנרמול: normName של המקור = normSearch + הסרת-רווחים (validate.ts:65-67) ──
// דבק-חיווט module-private (חוק-5), מקביל ל-wiredNormName ב-audit.mjs.
String _wiredNormName(dynamic t) => nn.normName(t, ns.normSearch);

// ── ה-API הפומבי (ביט-זהה לחתימות audit.ts / audit.mjs) ──────────────────────
// קבועי-התצוגה — חוטים בלי-שקעים, מוגשים כמות-שהם (החיווט: בחירת-האטום בלבד).
final Map<String, List<String>> AUDIT_CAT_COLORS = acc.auditCatColors(term: (k)=>td_audit_cat_colors.kTerms[k]!); // ignore: non_constant_identifier_names
const List<String> AUDIT_CATEGORIES = acat.auditCategories; // ignore: constant_identifier_names

String? phoneIssue(String? p) => pi.phoneIssue(p);

List<String> auditReportLines(String? orgName, Iterable<Map<String, String>> issues, String nowLabel) =>
    arl.auditReportLines(orgName, issues, nowLabel, term: (k)=>kTerms[k]!);

// הכרעות-ברירת-המחדל חיות כאן, כלשון חתימת-המקור (audit.ts:78):
// todayIso = '' (⇒ בדיקת יעד-הקשר מדולגת) · extra = true (הביקורת המורחבת דלוקה).
// now — ברירת-מחדל DateTime.now() (Dart: פרמטר-ברירת-מחדל חייב const ⇒ ננקב-null-then-fill,
// שקול-סמנטית ל-`now = new Date()` של המקור, נאמן ל-families/lib.ts:30 ששולף שעון בעצמו).
List runAudit(dynamic db,
    [dynamic todayIso = '', dynamic extra = true, dynamic config, DateTime? now]) {
  final n = now ?? DateTime.now();
  return ra.runAudit(db, todayIso, extra, config, {
    'termOf': (dynamic cfg, dynamic k, dynamic fb) => to.termOf(cfg, k, fb),
    'normName': _wiredNormName,
    'validIsraeliId': (dynamic id) => vii.validIsraeliId(id),
    'phoneIssue': (dynamic p) => pi.phoneIssue(p as String?),
    'ageOf': (dynamic birth) => ao.ageOf(birth as String?, n),
    'supporterAggregates': (dynamic sp) => sa.supporterAggregates(sp),
  });
}
