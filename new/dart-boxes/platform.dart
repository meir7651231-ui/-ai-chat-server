import '../dart-data-maor/slugify.dart';
// 📦 קופסת-חיבורים · platform (Dart) — מחווטת 24 אטומי-Dart. מקבילה ל-new/boxes/platform.mjs.
// חוזה משותף: new/boxes/platform.contract.md. מקור-האמת: maor/src/components/platform/lib.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// הקופסה מייבאת אך-ורק אטומים (חוק-2). כל קריאת-שכן שבמקור = הזרקת-שקע כאן (חוק-1/3):
// normEmail מוזרק ל-isOrgManager/isMember/overrideOf/approveMember/setEmployeeOverride/
// removeMember; ALL_MODULES ל-orgEnabledModules/orgEnabledFeatures/allOffConfig; החוטים
// המחווטים (isOrgManager/overrideOf/orgEnabledModules) ל-effectiveConfigFor/allowedDesignationsFor.
//
// ⚠️ גבול-פלטפורמה (חוק-6): כל ה-IO של לוח-הבקרה (זהות/מיילי-על SUPER_ADMIN/ענן
//   platformOrgs/joinRequests) **אינו** כאן — הוא מוזרק פר-פלטפורמה בלוח-האם (דפדפן:
//   Firestore/localStorage · Flutter: המקבילות). הליבה-הטהורה (סלאג/קודים/הרשאות/תקרה/
//   מוטציות-חברות) חוצה-שפות זהה-ביט, וזו שמוכחת כאן.
import '../dart-maor/slugify.dart' as sl;
import '../dart-maor/is-valid-slug.dart' as ivs;
import '../dart-maor/all-modules.dart' as am;
import '../dart-maor/module-labels.dart' as ml;
import '../dart-maor/all-off-config.dart' as aoc;
import '../dart-maor/org-link.dart' as ol;
import '../dart-maor/norm-email.dart' as ne;
import '../dart-maor/gen-join-code.dart' as gjc;
import '../dart-maor/org-join-link.dart' as ojl;
import '../dart-maor/org-join-full-code.dart' as ojfc;
import '../dart-maor/parse-join-full-code.dart' as pjfc;
import '../dart-maor/is-org-manager.dart' as iom;
import '../dart-maor/org-enabled-modules.dart' as oem;
import '../dart-maor/org-enabled-features.dart' as oef;
import '../dart-maor/is-member.dart' as im;
import '../dart-maor/override-of.dart' as ovr;
import '../dart-maor/grantable-staff-features.dart' as gsf;
import '../dart-maor/is-grantable-feature.dart' as igf;
import '../dart-maor/effective-config-for.dart' as ecf;
import '../dart-maor/allowed-designations-for.dart' as adf;
import '../dart-maor/can-issue-receipt.dart' as cir;
import '../dart-maor/approve-member.dart' as apm;
import '../dart-maor/set-employee-override.dart' as seo;
import '../dart-maor/remove-member.dart' as rm;

// ── שקע-הזרעה (הכרעת-קופסה): קונפיג-הלידה verbatim מ-maor/src/types/config.ts:404-410.
// ברירת-מחדל חיה בקופסה — לא אטום (חוק-6: קונפיג≠חלק-מכונה) ולא IO. ארגון נולד all-off מכאן.
final Map<String, dynamic> defaultConfig = {
  'slug': 'default',
  'orgName': '',
  'theme': 'or-rishon',
  'modules': <String, dynamic>{},
  'features': <String, dynamic>{},
};

// ── שכנים-מחווטים: כל קריאת-שכן שבמקור נבנית כאן כהזרקת-שקע (חוק-1/3) ──────────
bool _wiredIsOrgManager(String email, Map<String, dynamic> org) => iom.isOrgManager(email, org, ne.normEmail);
Map<String, dynamic> _wiredOverrideOf(String email, Map<String, dynamic> org) =>
    Map<String, dynamic>.from(ovr.overrideOf(email, org, ne.normEmail));
List<String> _wiredOrgEnabledModules(Map orgConfig) => oem.orgEnabledModules(orgConfig, am.allModules);

// ── החשיפה: חוטים טהורים נחשפים ישירות (מתאמי-טיפוס בלבד) ─────────────────────
dynamic slugify(dynamic orgName, dynamic taken) => sl.slugify(orgName, taken, heb2lat: kHeb2lat);
bool isValidSlug(String slug) => ivs.isValidSlug(slug);
List<String> get ALL_MODULES => am.allModules; // ignore: non_constant_identifier_names
Map<String, String> get MODULE_LABELS => ml.MODULE_LABELS; // ignore: non_constant_identifier_names
String orgLink(String origin, String basePath, String slug) => ol.orgLink(origin, basePath, slug);
String normEmail(String email) => ne.normEmail(email);
String genJoinCode(String seed) => gjc.genJoinCode(seed);
String orgJoinLink(String origin, String basePath, String slug, String code) =>
    ojl.orgJoinLink(origin, basePath, slug, code);
String orgJoinFullCode(String slug, String code) => ojfc.orgJoinFullCode(slug, code);
// canIssueReceipt: המקור-JS חושף אטום המקבל אובייקט `p`; אטום-ה-Dart משתמש בפרמטרים
// named — מתאם-טיפוס כאן מיישר את פער-הייצוג (Map ⇒ named), עיוור-חסר=falsy כמו truthiness ה-JS.
bool canIssueReceipt(Map<String, dynamic> p) => cir.canIssueReceipt(
      superAdmin: p['superAdmin'] == true,
      isManager: p['isManager'] == true,
      cloudRoot: p['cloudRoot'] == true,
      cloudConnected: p['cloudConnected'] == true,
    );
Set<String> get GRANTABLE_STAFF_FEATURES => gsf.grantableStaffFeatures; // ignore: non_constant_identifier_names

// ── החשיפה: חוטים מחווטים (חתימות זהות למקור-ה-JS) ───────────────────────────
Map<String, dynamic> allOffConfig(String slug, String orgName) =>
    aoc.allOffConfig(slug, orgName, am.allModules, defaultConfig);
Map<String, String>? parseJoinFullCode(String full) => pjfc.parseJoinFullCode(full, ivs.isValidSlug);
bool isOrgManager(String email, Map<String, dynamic> org) => _wiredIsOrgManager(email, org);
Map<String, dynamic> overrideOf(String email, Map<String, dynamic> org) => _wiredOverrideOf(email, org);
List<String> orgEnabledModules(Map orgConfig) => _wiredOrgEnabledModules(orgConfig);
List<Map<String, dynamic>> orgEnabledFeatures(Map<String, dynamic> orgConfig, List<Map<String, dynamic>> features) =>
    oef.orgEnabledFeatures(orgConfig, features, am.allModules, oem.orgEnabledModules);
bool isMember(String email, Map<String, dynamic> org) => im.isMember(email, org, ne.normEmail, _wiredIsOrgManager);
bool isGrantableFeature(String key) => igf.isGrantableFeature(key, gsf.grantableStaffFeatures);
Map<String, dynamic> effectiveConfigFor(String email, Map<String, dynamic> org, Map<String, dynamic> orgConfig) =>
    ecf.effectiveConfigFor(email, org, orgConfig, _wiredIsOrgManager, _wiredOverrideOf, gsf.grantableStaffFeatures);
List<dynamic>? allowedDesignationsFor(String email, Map<String, dynamic> org) =>
    adf.allowedDesignationsFor(email, org, _wiredIsOrgManager, _wiredOverrideOf);
Map<String, List<String>> approveMember(Map<String, dynamic> org, String email) =>
    apm.approveMember(org, email, ne.normEmail);
Map<String, dynamic> setEmployeeOverride(Map<String, dynamic> org, String email, dynamic override) =>
    seo.setEmployeeOverride(org, email, override, ne.normEmail);
Map<String, dynamic> removeMember(Map<String, dynamic> org, String email) => rm.removeMember(org, email, ne.normEmail);
