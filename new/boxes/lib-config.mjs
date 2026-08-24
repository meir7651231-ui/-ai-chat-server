/** קופסת-חיבורים · lib-config (מנוע-הקונפיגורציה של ה-White-label).
 *  חוזה: lib-config.contract.md · מקור-האמת: maor/src/lib/config.ts (36 חוטים).
 *  זה המקום היחיד שבו חוטי-הקונפיג נפגשים (חוקי-החשמלאי, LAW.md); הקופסה מייבאת
 *  אך ורק אטומים (חוק-2/3) ומחווטת לפי גרף-הקריאות של המקור.
 *
 *  ── הכרעות שחיות כאן (סדר/ברירות-מחדל/allowlists — לא בחוטים) ──
 *   · NAV_MODULE_KEYS — תשעת מודולי-הניווט שכפופים לשרשור featureOn (config.ts:20-30).
 *   · DEFAULT_CONFIG / INTEGRATION_KEYS / INTEGRATION_SETTING_KEYS / MOTION_KEYS /
 *     TEMPLATE_KEYS / SITE_LANGS — allowlists+ברירות-מחדל מ-types/config + templates,
 *     מוזנים כשקעי-נתונים לחוטי-המפעל (make-normalize-*).
 *   · LS_CONFIG_KEY = 'maor_org_config' — מפתח דריסת-הריצה (config.ts:12).
 *   · telStr/telExt — עוזרי-מחרוזת שהמקור החליק פנימה ל-normalizeTelephony וחולצו
 *     ממנו כשקעים; אין להם אטום ייעודי ⇒ ממומשים כאן כמילוי-שקע verbatim (config.ts:153-160).
 *
 *  ── שקעי-IO אמיתיים (מוזרקים ע"י הקורא/לוח-האם — לא ממומשים כאן) ──
 *   · search      — מחרוזת-החיפוש (window.location.search) ⇒ orgSlugFromUrl/loadOrgConfig.
 *   · getItem/setItem/removeItem — localStorage ⇒ קריאת/שמירת דריסה + מטמון-ענן.
 *   · fetch       — טעינת config.json ⇒ loadOrgConfig.
 *   · root        — documentElement-כמו { dataset, style:{setProperty,removeProperty} } ⇒ applyTheme.
 *   · doc         — document-כמו { querySelector, createElement, head:{appendChild} } ⇒ applyFavicon.
 *   · superAdminEmails — רשימת מיילי-העל (זהות = חיווט-הצבה, חוק-6; לא מוטבעת בקופסה) ⇒ isSuperAdmin.
 */
import { moduleOn as atomModuleOn } from '../atoms/module-on.mjs';
import { featureOn as atomFeatureOn } from '../atoms/feature-on.mjs';
import { donationSplitOn as atomDonationSplitOn } from '../atoms/donation-split-on.mjs';
import { supEnforceOn as atomSupEnforceOn } from '../atoms/sup-enforce-on.mjs';
import { integrationOn as atomIntegrationOn } from '../atoms/integration-on.mjs';
import { telephonyOn as atomTelephonyOn } from '../atoms/telephony-on.mjs';
import { integrationSetting as atomIntegrationSetting } from '../atoms/integration-setting.mjs';
import { safeHttpsUrl as atomSafeHttpsUrl } from '../atoms/safe-https-url.mjs';
import { termOf as atomTermOf } from '../atoms/term-of.mjs';
import { normalizeTelephony as atomNormalizeTelephony } from '../atoms/normalize-telephony.mjs';
import { makeNormalizeSite } from '../atoms/make-normalize-site.mjs';
import { makeNormalizeConfig } from '../atoms/make-normalize-config.mjs';
import { publicSiteOn as atomPublicSiteOn } from '../atoms/public-site-on.mjs';
import { roleOf as atomRoleOf } from '../atoms/role-of.mjs';
import { teacherIdOf as atomTeacherIdOf } from '../atoms/teacher-id-of.mjs';
import { isAdminUser as atomIsAdminUser } from '../atoms/is-admin-user.mjs';
import { canGrantedAction as atomCanGrantedAction } from '../atoms/can-granted-action.mjs';
import { isSuperAdmin as atomIsSuperAdmin } from '../atoms/is-super-admin.mjs';
import { signUpError as atomSignUpError } from '../atoms/sign-up-error.mjs';
import { employeeSignUpError as atomEmployeeSignUpError } from '../atoms/employee-sign-up-error.mjs';
import { cloudCfgCacheKey as atomCloudCfgCacheKey } from '../atoms/cloud-cfg-cache-key.mjs';
import { resolveOrgConfig as atomResolveOrgConfig } from '../atoms/resolve-org-config.mjs';
import { orgSlugFromUrl as atomOrgSlugFromUrl } from '../atoms/org-slug-from-url.mjs';
import { isSafeAccent as atomIsSafeAccent } from '../atoms/is-safe-accent.mjs';
import { DEFAULT_FAVICON as ATOM_DEFAULT_FAVICON } from '../atoms/default-favicon.mjs';
import { faviconDataUri as atomFaviconDataUri } from '../atoms/favicon-data-uri.mjs';
import { applyConfig as atomApplyConfig } from '../atoms/apply-config.mjs';

// ── שקעי-נתונים (הכרעות-הקופסה) — מיושרים ביט-לביט למקור ──
// תשעת מודולי-הניווט הכפופים לטוגל-מודול (maor/src/types + config.ts:20-30).
const NAV_MODULE_KEYS = ['families', 'courses', 'calendar', 'diary', 'supporters', 'reports', 'tzedaka', 'shop', 'shop7'];
// ברירת-המחדל של הקונפיג (types/config.ts:404-410).
const DEFAULT_CONFIG = { slug: 'default', orgName: '', theme: 'or-rishon', modules: {}, features: {} };
// allowlist-ההרחבות (types/config.ts:385-388).
const INTEGRATION_KEYS = ['receipts', 'payments', 'whatsapp', 'sms', 'phone', 'gcal', 'drive', 'sheets', 'maps', 'esign', 'ai', 'campaign', 'mail'];
// הגדרות-מחרוזת מותרות פר-הרחבה (types/config.ts:395-402).
const INTEGRATION_SETTING_KEYS = {
  payments: ['provider', 'payUrl', 'pullUrl', 'solaPullUrl', 'solaPayUrl'],
  campaign: ['url'],
  sheets: ['spreadsheetId'],
  sms: ['adminPhone'],
  mail: ['digestTo'],
};
// סגנונות-תנועה מותרים (types/config.ts:21).
const MOTION_KEYS = ['calm', 'snappy', 'bold'];
// שפות-האתר-הציבורי המוכרות (types/config.ts:65).
const SITE_LANGS = ['he', 'en', 'yi'];
// מפתחות-התבניות (templates.ts TEMPLATE_DEFS.map(d=>d.key), סדר-ההגדרה).
const TEMPLATE_KEYS = ['wa.delivery', 'wa.payment', 'wa.birthday', 'wa.dialer', 'wa.paylink'];
// מפתח דריסת-הריצה בדפדפן (config.ts:12).
const LS_CONFIG_KEY = 'maor_org_config';

// ── מילוי-שקע: עוזרי-הטלפוניה (config.ts:153-160 verbatim; אין אטום ייעודי) ──
/** מחרוזת נקייה מתווי-בקרה (Unicode Cc), מגוזמת (לא-מחרוזת ⇒ ''). */
const telStr = (v, max) => (typeof v === 'string' ? v.replace(/\p{Cc}/gu, '').trim().slice(0, max) : '');
/** שלוחה — ספרות בלבד עד 8; ריק ⇒ ברירת-המחדל שנמסרה. */
const telExt = (v, def) => {
  const s = typeof v === 'string' ? v.replace(/\D/g, '').slice(0, 8) : '';
  return s || def;
};

// ── חיווט חוטי-המפעל (factory-atoms) ──
// normalizeSite = makeNormalizeSite(safeHttpsUrl, SITE_LANGS) — safeHttpsUrl הוא האטום.
const wiredNormalizeSite = makeNormalizeSite(atomSafeHttpsUrl, SITE_LANGS);
// 🔧 מילוי-שקע חופשי: make-normalize-config מפנה `isSafeAccent` כמשתנה-חופשי (במקור
// היה שכן-מודול; החילוץ השאיר אותו לא-מוצהר). איני רשאי לתקן אטום קיים ⇒ ממלא את
// השקע דרך globalThis בערך-האטום עצמו, כך שהסגור פותר אותו זהה-למקור (accent-בטוח
// נשמר, accent-זדוני נזרק). זו הכרעת-חיווט בקופסה, אפס-נגיעה בקובץ-אטום.
if (typeof globalThis.isSafeAccent !== 'function') globalThis.isSafeAccent = atomIsSafeAccent;
const wiredNormalizeConfig = makeNormalizeConfig({
  DEFAULT_CONFIG,
  INTEGRATION_KEYS,
  INTEGRATION_SETTING_KEYS,
  MOTION_KEYS,
  TEMPLATE_KEYS,
  normalizeSite: wiredNormalizeSite,
  normalizeTelephony: (raw) => atomNormalizeTelephony(raw, telStr, telExt),
});

// ── החשיפה: גזרים טהורים (בלי IO) ──
export const moduleOn = (cfg, m) => atomModuleOn(cfg, m);
export const featureOn = (cfg, key) => atomFeatureOn(cfg, key, NAV_MODULE_KEYS, atomModuleOn);
export const donationSplitOn = (cfg) => atomDonationSplitOn(cfg);
export const supEnforceOn = (cfg) => atomSupEnforceOn(cfg);
export const integrationOn = (cfg, key) => atomIntegrationOn(cfg, key);
export const telephonyOn = (cfg) => atomTelephonyOn(cfg);
export const integrationSetting = (cfg, key, field) => atomIntegrationSetting(cfg, key, field);
export const safeHttpsUrl = (raw) => atomSafeHttpsUrl(raw);
export const termOf = (cfg, key, fallback) => atomTermOf(cfg, key, fallback);
export const isSafeAccent = (a) => atomIsSafeAccent(a);
export const publicSiteOn = (cfg) => atomPublicSiteOn(cfg, featureOn);
export const roleOf = (cfg, email) => atomRoleOf(cfg, email);
export const teacherIdOf = (cfg, email) => atomTeacherIdOf(cfg, email);
export const isAdminUser = (cfg, email) => atomIsAdminUser(cfg, email);
export const canGrantedAction = (cfg, email, isManager, key) => atomCanGrantedAction(cfg, email, isManager, key, atomIsAdminUser);
export const signUpError = (orgName, contactName, phone, email, password, password2) =>
  atomSignUpError(orgName, contactName, phone, email, password, password2);
export const employeeSignUpError = (email, phone, password, code) => atomEmployeeSignUpError(email, phone, password, code);
export const cloudCfgCacheKey = (slug) => atomCloudCfgCacheKey(slug);
// isSuperAdmin: רשימת-המיילים מוזרקת (זהות = חיווט-הצבה, חוק-6) — לא מוטבעת בקופסה.
export const isSuperAdmin = (email, superAdminEmails) => atomIsSuperAdmin(email, superAdminEmails);

// ── החשיפה: מנרמלים (טהורים) ──
export const normalizeTelephony = (raw) => atomNormalizeTelephony(raw, telStr, telExt);
export const normalizeSite = (raw) => wiredNormalizeSite(raw);
export const normalizeConfig = (raw) => wiredNormalizeConfig(raw);
// מיזוג-עדיפויות (ענן > סטטי) — טהור, מחווט את normalizeConfig.
export const resolveOrgConfig = (staticCfg, cloudRaw) => atomResolveOrgConfig(staticCfg, cloudRaw, wiredNormalizeConfig);

// ── החשיפה: חוטי-IO (שקעים מוזרקים ע"י הקורא/לוח-האם) ──
// slug מ-‎?org=<slug>‎; search = window.location.search אצל הקורא.
export const orgSlugFromUrl = (search) => atomOrgSlugFromUrl(search);

/** דריסת-הריצה השמורה (localStorage) — getItem מוזרק; ‏JSON פגום ⇒ null. */
export function readConfigOverride(getItem) {
  try {
    const raw = getItem(LS_CONFIG_KEY);
    return raw ? wiredNormalizeConfig(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}
/** שמירת דריסת-ריצה — setItem מוזרק; כשל-localStorage נבלע (נוחות בלבד). */
export function saveConfigOverride(cfg, setItem) {
  try {
    setItem(LS_CONFIG_KEY, JSON.stringify(cfg));
  } catch {
    /* localStorage חסום — הקונפיג יחזיק עד רענון */
  }
}
/** מחיקת דריסת-הריצה — removeItem מוזרק. */
export function clearConfigOverride(removeItem) {
  try {
    removeItem(LS_CONFIG_KEY);
  } catch {
    /* localStorage חסום */
  }
}
/** קריאת מטמון-הקונפיג-מהענן לסלאג — getItem מוזרק; null כשאין/פגום/slug-לא-תואם. */
export function readCloudConfigCache(slug, getItem) {
  try {
    const raw = getItem(atomCloudCfgCacheKey(slug));
    const cfg = raw ? wiredNormalizeConfig(JSON.parse(raw)) : null;
    return cfg && cfg.slug === slug ? cfg : null;
  } catch {
    return null;
  }
}
/** כתיבת מטמון-הקונפיג-מהענן — setItem מוזרק. */
export function writeCloudConfigCache(slug, cfg, setItem) {
  try {
    setItem(atomCloudCfgCacheKey(slug), JSON.stringify(cfg));
  } catch {
    /* localStorage חסום/מלא — מטמון = נוחות בלבד */
  }
}

/**
 * טעינת קונפיגורציית-הארגון לפי סדר-הרזולוציה של המקור (config.ts:821-862):
 *   1. ‏?org=<slug> ⇒ מטמון-ענן לסלאג (אם קיים).
 *   2. ‏?org=<slug> ⇒ ‏fetch(./c/<slug>/config.json).
 *   3. דריסת-ריצה (localStorage) אם תואמת-slug.
 *   4. ‏fetch(./config.json) — קונפיג-השורש; ל-slug≠default מורידים cloudRoot.
 *   5. ‏DEFAULT_CONFIG (עם slug מהכתובת אם יש).
 * שקעים מוזרקים: { search, getItem, fetch } (fetch מחזיר { ok, json() }).
 */
export async function loadOrgConfig({ search, getItem, fetch }) {
  const slug = atomOrgSlugFromUrl(search);
  if (slug) {
    const cached = readCloudConfigCache(slug, getItem);
    if (cached) return cached;
  }
  if (slug) {
    try {
      const res = await fetch(`./c/${slug}/config.json`, { cache: 'no-cache' });
      if (res.ok) {
        const cfg = wiredNormalizeConfig(await res.json());
        if (cfg) return { ...cfg, slug };
      }
    } catch {
      /* קובץ-הלקוח חסר — נמשיך בשרשרת */
    }
  }
  const override = readConfigOverride(getItem);
  if (override && (!slug || override.slug === slug)) return override;
  try {
    const res = await fetch('./config.json', { cache: 'no-cache' });
    if (res.ok) {
      const cfg = wiredNormalizeConfig(await res.json());
      // slug זר לא יורש cloudRoot (ראה הערת-המקור config.ts:848-855).
      if (cfg) return slug ? { ...cfg, slug, cloudRoot: slug === 'default' ? cfg.cloudRoot : false } : cfg;
    }
  } catch {
    /* אין קובץ/רשת — נמשיך לברירת-המחדל */
  }
  return slug ? { ...DEFAULT_CONFIG, slug, ...(slug !== 'default' ? { cloudRoot: false } : {}) } : DEFAULT_CONFIG;
}

/**
 * החלת ערכה+צבע(+תנועה) על ה-DOM — root מוזרק (documentElement-כמו):
 * { dataset:{}, style:{ setProperty, removeProperty } }. מחווט את isSafeAccent (אטום).
 * מקור: config.ts:875-883 כלשונו.
 */
export function applyTheme(theme, accent, motion, root) {
  root.dataset.theme = theme || DEFAULT_CONFIG.theme;
  if (accent && atomIsSafeAccent(accent.trim())) root.style.setProperty('--accent', accent.trim());
  else root.style.removeProperty('--accent');
  if (motion && MOTION_KEYS.includes(motion)) root.dataset.motion = motion;
  else delete root.dataset.motion;
}
/** ה-favicon הדיפולטי (אטום). */
export const DEFAULT_FAVICON = ATOM_DEFAULT_FAVICON;
/** ‏data-URI ל-favicon מאימוג'י (אטום). */
export const faviconDataUri = (emoji) => atomFaviconDataUri(emoji);
/**
 * החלת אייקון-הארגון על ה-favicon — doc מוזרק (document-כמו):
 * { querySelector, createElement, head:{ appendChild } }. מקור: config.ts:899-908.
 */
export function applyFavicon(emoji, doc) {
  if (!doc) return;
  let link = doc.querySelector('link[rel="icon"]');
  if (!link) {
    link = doc.createElement('link');
    link.rel = 'icon';
    doc.head.appendChild(link);
  }
  link.href = emoji ? atomFaviconDataUri(emoji) : ATOM_DEFAULT_FAVICON;
}
/** החלת קונפיג שלם (ערכה+צבע+תנועה+אייקון) — root+doc מוזרקים; מחווט את apply-config. */
export function applyConfig(cfg, root, doc) {
  atomApplyConfig(cfg, (t, a, m) => applyTheme(t, a, m, root), (e) => applyFavicon(e, doc));
}

// ── קבועי-חיווט חשופים לקריאה (אשף/בדיקות צורכים גם אותם) ──
export { NAV_MODULE_KEYS, DEFAULT_CONFIG, INTEGRATION_KEYS, INTEGRATION_SETTING_KEYS, MOTION_KEYS, SITE_LANGS, TEMPLATE_KEYS, LS_CONFIG_KEY };
