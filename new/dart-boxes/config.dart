import '../dart-data-maor/employee-sign-up-error-terms.dart';
// 📦 קופסת-חיבורים · config · ליבה-טהורה (Dart) — מקבילה לחלק-הטהור של new/boxes/lib-config.mjs.
// חוזה משותף: new/boxes/lib-config.contract.md. מקור-האמת: maor/src/lib/config.ts.
// זהו ההוכחה ש-מאור(JS) ובנייה-חכמה(Dart) מתחברות לאותה קופסה: אותם קלטים ⇒ אותו פלט.
//
// ⚠️ גבול-פלטפורמה (חוק-6): פונקציות-ה-IO/DOM של הקופסה (loadOrgConfig · applyTheme ·
//   applyFavicon · read/save/clearConfigOverride · cloud-cache) **אינן** כאן — ה-IO
//   מוזרק פר-פלטפורמה בלוח-האם (דפדפן: localStorage/fetch/document · Flutter: המקבילות).
//   הליבה-הטהורה (predicates · normalize · roles) חוצה-שפות זהה-ביט, וזו שמוכחת כאן.
import '../dart-maor/module-on.dart' as mo;
import '../dart-maor/feature-on.dart' as fo;
import '../dart-maor/donation-split-on.dart' as dso;
import '../dart-maor/sup-enforce-on.dart' as seo;
import '../dart-maor/integration-on.dart' as io;
import '../dart-maor/telephony-on.dart' as to;
import '../dart-maor/integration-setting.dart' as iset;
import '../dart-maor/safe-https-url.dart' as shu;
import '../dart-maor/term-of.dart' as tof;
import '../dart-maor/is-safe-accent.dart' as isa;
import '../dart-maor/public-site-on.dart' as pso;
import '../dart-maor/role-of.dart' as ro;
import '../dart-maor/teacher-id-of.dart' as tio;
import '../dart-maor/is-admin-user.dart' as iau;
import '../dart-maor/can-granted-action.dart' as cga;
import '../dart-maor/is-super-admin.dart' as isadm;
import '../dart-maor/sign-up-error.dart' as sue;
import '../dart-maor/employee-sign-up-error.dart' as ese;
import '../dart-maor/cloud-cfg-cache-key.dart' as ccck;
import '../dart-maor/resolve-org-config.dart' as roc;
import '../dart-maor/org-slug-from-url.dart' as osu;
import '../dart-maor/normalize-telephony.dart' as nt;
import '../dart-maor/make-normalize-site.dart' as mns;
import '../dart-maor/make-normalize-config.dart' as mnc;

// ── שקעי-נתונים (הכרעות-הקופסה — allowlists+ברירות-מחדל, verbatim מהמקור) ──────
const List<String> navModuleKeys = ['families', 'courses', 'calendar', 'diary', 'supporters', 'reports', 'tzedaka', 'shop', 'shop7'];
final Map<String, dynamic> DEFAULT_CONFIG = {'slug': 'default', 'orgName': '', 'theme': 'or-rishon', 'modules': {}, 'features': {}}; // ignore: non_constant_identifier_names
const List<String> integrationKeys = ['receipts', 'payments', 'whatsapp', 'sms', 'phone', 'gcal', 'drive', 'sheets', 'maps', 'esign', 'ai', 'campaign', 'mail'];
const Map<String, List<String>> integrationSettingKeys = {
  'payments': ['provider', 'payUrl', 'pullUrl', 'solaPullUrl', 'solaPayUrl'],
  'campaign': ['url'],
  'sheets': ['spreadsheetId'],
  'sms': ['adminPhone'],
  'mail': ['digestTo'],
};
const List<String> motionKeys = ['calm', 'snappy', 'bold'];
const List<String> siteLangs = ['he', 'en', 'yi'];
const List<String> templateKeys = ['wa.delivery', 'wa.payment', 'wa.birthday', 'wa.dialer', 'wa.paylink'];
const String lsConfigKey = 'maor_org_config';

// ── מילוי-שקע: עוזרי-הטלפוניה (config.ts:153-160 verbatim; אין אטום ייעודי) ──────
String _telStr(dynamic v, int max) {
  if (v is! String) return '';
  final c = v.replaceAll(RegExp(r'\p{Cc}', unicode: true), '').trim();
  return c.length > max ? c.substring(0, max) : c;
}
String _telExt(dynamic v, String def) {
  final s = v is String ? v.replaceAll(RegExp(r'\D'), '') : '';
  final clip = s.length > 8 ? s.substring(0, 8) : s;
  return clip.isEmpty ? def : clip;
}

// ── חיווט חוטי-המפעל (factory-atoms) ─────────────────────────────────────────
final Map<String, dynamic>? Function(dynamic) _normalizeSite = mns.makeNormalizeSite(shu.safeHttpsUrl, siteLangs);
final Map<String, dynamic>? Function(dynamic) _normalizeConfig = mnc.makeNormalizeConfig(
  DEFAULT_CONFIG: DEFAULT_CONFIG,
  INTEGRATION_KEYS: integrationKeys,
  INTEGRATION_SETTING_KEYS: integrationSettingKeys,
  MOTION_KEYS: motionKeys,
  TEMPLATE_KEYS: templateKeys,
  normalizeSite: _normalizeSite,
  normalizeTelephony: (raw) => nt.normalizeTelephony(raw, _telStr, _telExt),
);

// ── החשיפה: גזרים טהורים ─────────────────────────────────────────────────────
bool moduleOn(Map<String, dynamic> cfg, String m) => mo.moduleOn(cfg, m);
bool featureOn(Map<String, dynamic> cfg, String key) => fo.featureOn(cfg, key, navModuleKeys, mo.moduleOn);
bool donationSplitOn(Map<String, dynamic> cfg) => dso.donationSplitOn(cfg);
bool supEnforceOn(dynamic cfg) => seo.supEnforceOn(cfg);
bool integrationOn(Map? cfg, String key) => io.integrationOn(cfg, key);
bool telephonyOn(dynamic cfg) => to.telephonyOn(cfg);
String integrationSetting(dynamic cfg, String key, String field) => iset.integrationSetting(cfg, key, field);
String? safeHttpsUrl(dynamic raw) => shu.safeHttpsUrl(raw);
dynamic termOf(dynamic cfg, dynamic key, dynamic fallback) => tof.termOf(cfg, key, fallback);
bool isSafeAccent(String a) => isa.isSafeAccent(a);
bool publicSiteOn(dynamic cfg) => pso.publicSiteOn(cfg, (c, k) => featureOn(c as Map<String, dynamic>, k));
String roleOf(dynamic config, dynamic email) => ro.roleOf(config, email);
dynamic teacherIdOf(dynamic config, dynamic email) => tio.teacherIdOf(config, email);
bool isAdminUser(Map<String, dynamic> config, String? email) => iau.isAdminUser(config, email);
bool canGrantedAction(Map<String, dynamic> config, String email, bool isManager, String key) =>
    cga.canGrantedAction(config, email, isManager, key, iau.isAdminUser);
String signUpError(String orgName, String contactName, String phone, String email, String password, String password2) =>
    sue.signUpError(orgName, contactName, phone, email, password, password2);
String employeeSignUpError(String email, String phone, String password, String code) =>
    ese.employeeSignUpError(email, phone, password, code, term: (k)=>kTerms[k]!);
String cloudCfgCacheKey(String slug) => ccck.cloudCfgCacheKey(slug);
bool isSuperAdmin(String? email, List<String> superAdminEmails) => isadm.isSuperAdmin(email, superAdminEmails);

// ── החשיפה: מנרמלים (טהורים) ─────────────────────────────────────────────────
Map<String, dynamic>? normalizeTelephony(dynamic raw) => nt.normalizeTelephony(raw, _telStr, _telExt);
Map<String, dynamic>? normalizeSite(dynamic raw) => _normalizeSite(raw);
Map<String, dynamic>? normalizeConfig(dynamic raw) => _normalizeConfig(raw);
dynamic resolveOrgConfig(dynamic staticCfg, dynamic cloudRaw) => roc.resolveOrgConfig(staticCfg, cloudRaw, _normalizeConfig);
dynamic orgSlugFromUrl(dynamic search) => osu.orgSlugFromUrl(search);
