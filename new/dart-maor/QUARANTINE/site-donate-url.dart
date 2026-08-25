// ⚛️ אטום-Dart (דרגת-חוזה) · siteDonateUrl — קישור-התרומה האפקטיבי של עמוד-השיווק.
// מוצא: maor/src/lib/publicSite.ts:247-254 · המקור: new/atoms/site-donate-url.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart:core). חוק-4 — התנהגות
//        זהה-ביט למקור-ה-JS (המקור קדוש). טהור, אפס שקעים (כמו במקור).
//
// תפקיד: site.donateUrl הישיר (רק מחרוזת לא-ריקה) גובר; נפילה ל-
//        integrations.payments.payUrl (רק מחרוזת לא-ריקה); אחרת null.
//
// הערות-המרה (מקור→Dart):
//  • `config.site?.donateUrl` → ‎_get(_get(config,'site'),'donateUrl')‎ — גישת-שדה
//    נאמנת-JS: על לא-Map (כולל null/מספר/מחרוזת) ⇒ null, כמו undefined ב-JS
//    (optional-chaining + property-על-פרימיטיב שניהם ⇒ undefined).
//  • `typeof direct === 'string' && direct` → `direct is String && direct.isNotEmpty`
//    ('' falsy ב-JS ⇒ נפסל — דוגמה 2 בחוזה).
//  • `pay && typeof pay.payUrl === 'string'` → ‎_truthy(pay) && raw is String‎ —
//    כלל-7 (truthiness): שקע ‎_falsy/_truthy‎ מפורש, לא if(x) של Dart.
//    (‏_get על pay-falsy מחזיר null ממילא — קריאה בטוחה, בלי גישת-שדה שזורקת.)
//  • `payUrl || null` → payUrl תמיד String בנקודה זו ⇒ ריק=null, אחרת המחרוזת.
//  • פלט dynamic: String או null — כמו במקור.

/// גישת-שדה נאמנת-JS: Map ⇒ הערך (חסר ⇒ null≡undefined); כל דבר אחר ⇒ null.
dynamic _get(dynamic obj, String key) => obj is Map ? obj[key] : null;

/// truthiness של JS (כלל-7): null/false/0/-0/NaN/'' = falsy; כל השאר truthy.
bool _truthy(dynamic v) {
  if (v == null || v == false) return false;
  if (v is num) return !(v == 0 || v.isNaN);
  if (v is String) return v.isNotEmpty;
  return true;
}

/// The effective donation link of the public marketing page:
/// site.donateUrl (non-empty string only), falling back to
/// integrations.payments.payUrl (non-empty string only), else null.
/// Verbatim port of new/atoms/site-donate-url.mjs (`siteDonateUrl`).
dynamic siteDonateUrl(dynamic config) {
  final direct = _get(_get(config, 'site'), 'donateUrl');
  if (direct is String && direct.isNotEmpty) return direct;
  final pay = _get(_get(config, 'integrations'), 'payments');
  final raw = _get(pay, 'payUrl');
  final payUrl = _truthy(pay) && raw is String ? raw : '';
  return payUrl.isNotEmpty ? payUrl : null;
}
