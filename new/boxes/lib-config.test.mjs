/** בדיקת-קצה · קופסת lib-config — דרך הקופסה בלבד (ownTest). DoD:
 *  `node lib-config.test.mjs` ⇒ exit 0 + שורת-סיכום. הבדיקה נכתבה לפני-הקוד (דיבר 12). */
import * as C from './lib-config.mjs';
const LIB_CONFIG_TERMS = {
  k1: "families",
  k2: "courses",
  k3: "calendar",
  k4: "diary",
  k5: "supporters",
  k6: "reports",
  k7: "tzedaka",
  k8: "shop",
  k9: "shop7",
  k10: "default",
  k11: "or-rishon",
  k12: "receipts",
  k13: "payments",
  k14: "whatsapp",
  k15: "sms",
  k16: "phone",
  k17: "gcal",
  k18: "drive",
  k19: "sheets",
  k20: "maps",
  k21: "esign",
  k22: "campaign",
  k23: "mail",
  k24: "provider",
  k25: "payUrl",
  k26: "pullUrl",
  k27: "solaPullUrl",
  k28: "solaPayUrl",
  k29: "url",
  k30: "spreadsheetId",
  k31: "adminPhone",
  k32: "digestTo",
  k33: "calm",
  k34: "snappy",
  k35: "bold",
  k36: "wa.delivery",
  k37: "wa.payment",
  k38: "wa.birthday",
  k39: "wa.dialer",
  k40: "wa.paylink",
  k41: "maor_org_config",
  k42: "string",
  k43: "function",
  k44: "/config.json",
  k45: "no-cache",
  k46: "./config.json",
  k47: "--accent",
  k48: "link[rel=\"icon\"]",
  k49: "link",
  k50: "icon",
};   // צילום-מקומי (מנוע-הטיהור v6 — מגני-המקור עודכנו לצורה החדשה)
import { readFileSync } from 'node:fs';

let f = 0;
const eq = (a, b, msg) => { const g = JSON.stringify(a), w = JSON.stringify(b); if (g !== w) { console.error(`✗ ${msg} ⇒ ${g} ≠ ${w}`); f = 1; } };
const ok = (c, msg) => { if (!c) { console.error(`✗ ${msg}`); f = 1; } };

// 1) moduleOn / featureOn (שרשור-אבות + מודול-ניווט)
eq(C.moduleOn({ modules: {} }, LIB_CONFIG_TERMS.k8), true, 'moduleOn חסר⇒פעיל');
eq(C.moduleOn({ modules: { shop: false } }, LIB_CONFIG_TERMS.k8), false, 'moduleOn false⇒כבוי');
eq(C.featureOn({ modules: {}, features: {} }, 'a.b.c'), true, 'featureOn חסר⇒פעיל');
eq(C.featureOn({ modules: {}, features: { 'a.b': false } }, 'a.b.c'), false, 'featureOn אב-כבוי');
eq(C.featureOn({ modules: { shop: false }, features: {} }, 'shop.x'), false, 'featureOn מודול-ניווט-כבוי');
eq(C.featureOn({ modules: { shop: false }, features: {} }, 'home.x'), true, 'featureOn home אינו מודול-ניווט');

// 2) גזרי opt-in (חסר=כבוי)
eq(C.donationSplitOn({}), false, 'donationSplit חסר');
eq(C.donationSplitOn({ donationSplit: true }), true, 'donationSplit true');
eq(C.supEnforceOn({ supporterEnforce: true }), true, 'supEnforce true');
eq(C.integrationOn({ integrations: { pay: { enabled: true } } }, 'pay'), true, 'integrationOn');
eq(C.integrationOn({ integrations: { pay: { enabled: false } } }, 'pay'), false, 'integrationOn false');
eq(C.telephonyOn({ telephony: { enabled: true } }), true, 'telephonyOn');
eq(C.integrationSetting({ integrations: { p: { payUrl: '  x ' } } }, 'p', LIB_CONFIG_TERMS.k25), 'x', 'integrationSetting trim');
eq(C.integrationSetting({}, 'p', LIB_CONFIG_TERMS.k25), '', 'integrationSetting חסר⇒ריק');

// 3) safeHttpsUrl / termOf / isSafeAccent
eq(C.safeHttpsUrl('http://x'), null, 'safeHttpsUrl http⇒null');
eq(C.safeHttpsUrl(' https://a.co '), 'https://a.co/', 'safeHttpsUrl https');
eq(C.safeHttpsUrl(''), null, 'safeHttpsUrl ריק');
eq(C.termOf({ terms: { x: '  שלום ' } }, 'x', 'ד'), 'שלום', 'termOf דריסה');
eq(C.termOf({ terms: { x: '   ' } }, 'x', 'ד'), 'ד', 'termOf ריק⇒fallback');
eq(C.termOf({}, 'x', 'ד'), 'ד', 'termOf אין-terms');
eq(C.isSafeAccent('#fff'), true, 'isSafeAccent hex');
eq(C.isSafeAccent("url('http://x')"), false, 'isSafeAccent url⇒false');

// 4) תפקידים/הרשאות
const cfgRoles = { adminEmails: ['A@b.co'], roles: { teachers: { 'T@b.co': 't1' } } };
eq(C.roleOf(cfgRoles, 'a@B.CO'), 'admin', 'roleOf admin');
eq(C.roleOf(cfgRoles, 't@b.co'), 'teacher', 'roleOf teacher');
eq(C.roleOf(cfgRoles, 'x@y.z'), 'staff', 'roleOf staff');
eq(C.teacherIdOf(cfgRoles, 'T@B.CO'), 't1', 'teacherIdOf');
eq(C.teacherIdOf(cfgRoles, 'x@y.z'), null, 'teacherIdOf null');
eq(C.isAdminUser({}, null), true, 'isAdminUser אין-רשימה⇒כולם');
eq(C.isAdminUser(cfgRoles, 'x@y.z'), false, 'isAdminUser לא-ברשימה');
// adminEmails מוגדר ⇒ isAdminUser=false לזר, כך שנבדק שער-ההדלקה-פר-עובד לבדו
const cfgGrant = { adminEmails: ['A@b.co'], features: {} };
eq(C.canGrantedAction(cfgGrant, 'x@y.z', true, 'k'), true, 'canGranted מנהל');
eq(C.canGrantedAction({ adminEmails: ['A@b.co'], features: { k: true } }, 'x@y.z', false, 'k'), true, 'canGranted הדלקה-פר-עובד');
eq(C.canGrantedAction(cfgGrant, 'x@y.z', false, 'k'), false, 'canGranted עובד-ללא-הדלקה');

// 5) isSuperAdmin — רשימה מוזרקת (זהות = שקע)
eq(C.isSuperAdmin('boss@x.co', ['boss@x.co']), true, 'isSuperAdmin ברשימה');
eq(C.isSuperAdmin('BOSS@X.CO', ['boss@x.co']), true, 'isSuperAdmin case-insensitive');
eq(C.isSuperAdmin('x@y.z', ['boss@x.co']), false, 'isSuperAdmin מחוץ');

// 6) signUp errors
eq(C.signUpError('', 'a', '0501234567', 'a@b.co', '123456', '123456'), 'שם הארגון הוא שדה חובה', 'signUp orgName');
eq(C.signUpError('ארג', 'איש', '0501234567', 'a@b.co', '123456', '123456'), '', 'signUp תקין');
eq(C.employeeSignUpError('a@b.co', '0501234567', '123456', 'CODE'), '', 'employeeSignUp תקין');
eq(C.employeeSignUpError('bad', '0501234567', '123456', 'CODE'), 'כתובת האימייל אינה תקינה', 'employeeSignUp מייל');

// 7) cloudCfgCacheKey
eq(C.cloudCfgCacheKey('demo'), 'maor_cloudcfg:demo', 'cloudCfgCacheKey');

// 8) normalizeConfig — הלב: זבל/accent/allowlist
eq(C.normalizeConfig(null), null, 'normalizeConfig null');
eq(C.normalizeConfig({ random: 1 }), null, 'normalizeConfig בלי slug/orgName/theme');
{ const c = C.normalizeConfig({ slug: 'demo' }); eq([c.orgName, c.theme, c.modules, c.features, c.terms], ['', LIB_CONFIG_TERMS.k11, {}, {}, {}], 'normalizeConfig ברירות'); }
eq(C.normalizeConfig({ slug: 'd', accent: '#fff' }).accent, '#fff', 'normalizeConfig accent-בטוח נשמר');
ok(!('accent' in C.normalizeConfig({ slug: 'd', accent: "url('http://e')" })), 'normalizeConfig accent-זדוני נזרק');
eq(C.normalizeConfig({ slug: 'd', integrations: { payments: { enabled: true, payUrl: '  https://p.co ', evil: 'z' }, typo: { enabled: true } } }).integrations,
  { payments: { enabled: true, payUrl: 'https://p.co' } }, 'normalizeConfig allowlist-הרחבות');
eq(C.normalizeConfig({ slug: 'd', motion: 'hacker' }).motion, undefined, 'normalizeConfig motion-זר נזרק');
eq(C.normalizeConfig({ slug: 'd', motion: LIB_CONFIG_TERMS.k35 }).motion, LIB_CONFIG_TERMS.k35, 'normalizeConfig motion-חוקי');

// 9) normalizeSite / normalizeTelephony
eq(C.normalizeSite({ enabled: true, gallery: ['http://x', 'https://ok'] }), { enabled: true, gallery: ['https://ok/'] }, 'normalizeSite https-בלבד');
eq(C.normalizeSite('x'), undefined, 'normalizeSite לא-אובייקט⇒undefined');
{ const t = C.normalizeTelephony({ enabled: true, officeExt: 'ab12cd' }); eq([t.enabled, t.officeExt, t.officeStart], [true, '12', '09:00'], 'normalizeTelephony ספרות+ברירות'); }
eq(C.normalizeTelephony(null), undefined, 'normalizeTelephony null⇒undefined');

// 10) resolveOrgConfig — ענן>סטטי, slug מהסטטי, firebase נשמר
{ const fb = { apiKey: 'K', authDomain: 'a', projectId: 'p', appId: 'i' };
  const r = C.resolveOrgConfig({ slug: 'root', orgName: 's', theme: 't', firebase: fb }, { slug: 'x', orgName: 'cloud', theme: 't' });
  eq([r.slug, r.orgName, r.firebase], ['root', 'cloud', fb], 'resolveOrgConfig מיזוג'); }
{ const s = { slug: 'root', orgName: 's', theme: 't' }; eq(C.resolveOrgConfig(s, null), s, 'resolveOrgConfig ענן-לא-שמיש⇒סטטי'); }

// 11) orgSlugFromUrl (שקע-search)
eq(C.orgSlugFromUrl('?org=demo'), 'demo', 'orgSlugFromUrl תקין');
eq(C.orgSlugFromUrl('?org=BAD!'), null, 'orgSlugFromUrl פסול⇒null');
eq(C.orgSlugFromUrl('?x=1'), null, 'orgSlugFromUrl אין-org⇒null');

// 12) חוטי-IO עם שקעים-מזויפים
{ // localStorage מזויף
  const store = {};
  const getItem = (k) => (k in store ? store[k] : null);
  const setItem = (k, v) => { store[k] = v; };
  const removeItem = (k) => { delete store[k]; };
  C.saveConfigOverride({ slug: 'demo', orgName: 'x', theme: 't', modules: {}, features: {} }, setItem);
  eq(C.readConfigOverride(getItem).slug, 'demo', 'readConfigOverride round-trip');
  C.clearConfigOverride(removeItem);
  eq(C.readConfigOverride(getItem), null, 'clearConfigOverride ⇒ null');
  eq(C.readConfigOverride(() => 'not-json{'), null, 'readConfigOverride JSON-פגום⇒null');
  C.writeCloudConfigCache('demo', { slug: 'demo', orgName: 'x', theme: 't', modules: {}, features: {} }, setItem);
  eq(store['maor_cloudcfg:demo'] ? C.readCloudConfigCache('demo', getItem).slug : 'MISS', 'demo', 'cloud-cache round-trip');
  eq(C.readCloudConfigCache('other', getItem), null, 'cloud-cache slug-לא-תואם⇒null');
}

// 13) loadOrgConfig — סדר-רזולוציה עם שקעים מזויפים
{
  const noLS = () => null;
  const fetch404 = async () => ({ ok: false });
  const cfg = await C.loadOrgConfig({ search: '', getItem: noLS, fetch: fetch404 });
  eq(cfg, C.DEFAULT_CONFIG, 'loadOrgConfig אין-כלום⇒DEFAULT');
  const fetchClient = async (u) => (u.includes('/c/demo/') ? { ok: true, json: async () => ({ slug: 'demo', orgName: 'D', theme: 't' }) } : { ok: false });
  const c2 = await C.loadOrgConfig({ search: '?org=demo', getItem: noLS, fetch: fetchClient });
  eq([c2.slug, c2.orgName], ['demo', 'D'], 'loadOrgConfig ‏?org⇒קובץ-לקוח');
}

// 14) applyTheme / applyFavicon / applyConfig — DOM מזויף
{
  const root = { dataset: {}, style: { props: {}, setProperty(k, v) { this.props[k] = v; }, removeProperty(k) { delete this.props[k]; } } };
  C.applyTheme(LIB_CONFIG_TERMS.k11, '#123456', LIB_CONFIG_TERMS.k35, root);
  eq([root.dataset.theme, root.style.props[LIB_CONFIG_TERMS.k47], root.dataset.motion], [LIB_CONFIG_TERMS.k11, '#123456', LIB_CONFIG_TERMS.k35], 'applyTheme בטוח');
  C.applyTheme('', "url('http://e')", 'zzz', root);
  eq([root.dataset.theme, root.style.props[LIB_CONFIG_TERMS.k47], root.dataset.motion], [LIB_CONFIG_TERMS.k11, undefined, undefined], 'applyTheme accent-זדוני/motion-זר נזרקים');
  const links = [];
  const doc = { _icon: null, querySelector: (s) => (s.includes(LIB_CONFIG_TERMS.k50) ? doc._icon : null), createElement: () => ({ set rel(v) { this._rel = v; } }), head: { appendChild: (l) => { doc._icon = l; links.push(l); } } };
  C.applyFavicon('🏗️', doc);
  ok(doc._icon && doc._icon.href.startsWith('data:image/svg+xml,'), 'applyFavicon אימוג׳י⇒SVG');
  C.applyFavicon(undefined, doc);
  eq(doc._icon.href, C.DEFAULT_FAVICON, 'applyFavicon חסר⇒דיפולט');
  const root2 = { dataset: {}, style: { props: {}, setProperty(k, v) { this.props[k] = v; }, removeProperty(k) { delete this.props[k]; } } };
  C.applyConfig({ theme: LIB_CONFIG_TERMS.k11, accent: '#abc', motion: LIB_CONFIG_TERMS.k33, emoji: '🏢' }, root2, doc);
  eq([root2.dataset.theme, root2.style.props[LIB_CONFIG_TERMS.k47], root2.dataset.motion], [LIB_CONFIG_TERMS.k11, '#abc', LIB_CONFIG_TERMS.k33], 'applyConfig מפזר-לערכה');
}

/* 🛡 מגן-הכרעה: קריאת מקור-הקופסה ואימות ההכרעות verbatim (דפוס theme.test). */
const src = readFileSync(new URL('./lib-config.mjs', import.meta.url), 'utf8');
const must = [
  ["const NAV_MODULE_KEYS = [LIB_CONFIG_TERMS.k1, LIB_CONFIG_TERMS.k2, LIB_CONFIG_TERMS.k3, LIB_CONFIG_TERMS.k4, LIB_CONFIG_TERMS.k5, LIB_CONFIG_TERMS.k6, LIB_CONFIG_TERMS.k7, LIB_CONFIG_TERMS.k8, LIB_CONFIG_TERMS.k9]", 'NAV_MODULE_KEYS'],
  ["const LS_CONFIG_KEY = LIB_CONFIG_TERMS.k41", 'LS_CONFIG_KEY'],
  ["const DEFAULT_CONFIG = { slug: LIB_CONFIG_TERMS.k10, orgName: '', theme: LIB_CONFIG_TERMS.k11, modules: {}, features: {} }", 'DEFAULT_CONFIG'],
  ["const INTEGRATION_KEYS = [LIB_CONFIG_TERMS.k12, LIB_CONFIG_TERMS.k13, LIB_CONFIG_TERMS.k14, LIB_CONFIG_TERMS.k15, LIB_CONFIG_TERMS.k16, LIB_CONFIG_TERMS.k17, LIB_CONFIG_TERMS.k18, LIB_CONFIG_TERMS.k19, LIB_CONFIG_TERMS.k20, LIB_CONFIG_TERMS.k21, 'ai', LIB_CONFIG_TERMS.k22, LIB_CONFIG_TERMS.k23]", 'INTEGRATION_KEYS'],
  ["const MOTION_KEYS = [LIB_CONFIG_TERMS.k33, LIB_CONFIG_TERMS.k34, LIB_CONFIG_TERMS.k35]", 'MOTION_KEYS'],
  ["const SITE_LANGS = ['he', 'en', 'yi']", 'SITE_LANGS'],
  ["const TEMPLATE_KEYS = [LIB_CONFIG_TERMS.k36, LIB_CONFIG_TERMS.k37, LIB_CONFIG_TERMS.k38, LIB_CONFIG_TERMS.k39, LIB_CONFIG_TERMS.k40]", 'TEMPLATE_KEYS'],
  ["atomFeatureOn(cfg, key, NAV_MODULE_KEYS, atomModuleOn)", 'חיווט-featureOn'],
  ["makeNormalizeSite(atomSafeHttpsUrl, SITE_LANGS)", 'חיווט-normalizeSite'],
  ["atomNormalizeTelephony(raw, telStr, telExt)", 'חיווט-telephony'],
  ["globalThis.isSafeAccent = atomIsSafeAccent", 'מילוי-שקע-חופשי isSafeAccent'],
];
for (const [needle, name] of must) if (!src.includes(needle)) { console.error(`✗ מגן: הכרעה שונתה — ${name}`); f = 1; }
// אין Date.now() פנימי — אין רכיב-זמן בקונפיג; זמן/IO מוזרקים בלבד
if (/Date\.now\s*\(/.test(src)) { console.error('✗ מגן: Date.now() פנימי'); f = 1; }
// telStr/telExt הם מילוי-שקע verbatim מהמקור
if (!src.includes("v.replace(/\\p{Cc}/gu, '').trim().slice(0, max)")) { console.error('✗ מגן: telStr שונה מהמקור'); f = 1; }

if (f) process.exit(1);
console.log('✓ קופסת lib-config: 24 גזרים + 10 חוטי-IO · דוגמאות-חוזה ירוקות · מגן-הכרעה מאושר');
