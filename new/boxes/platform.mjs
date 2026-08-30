/** קופסת-חיבורים · platform — לוח-הבקרה של הבעלים + היררכיית-ORGADMIN.
 *  חוזה: platform.contract.md · מקור-האמת: maor/src/components/platform/lib.ts.
 *  זה המקום היחיד שבו חוטי-הפלטפורמה נפגשים (חוקי-החשמלאי, LAW.md): קריאת-שכן
 *  שבמקור = הזרקת-שקע כאן. הקופסה מייבאת אך-ורק אטומים (חוק-2). */
import { slugify as __pure_slugify } from '../atoms/slugify.mjs';
import { ORG_SLUG_FROM_URL_T as __d_slugify_SLUGIFY_T } from '../atoms/org-slug-from-url-strings.mjs';
import { HEB2LAT } from '../atoms/slugify-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const slugify = (...a) => __pure_slugify(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), HEB2LAT, __d_slugify_SLUGIFY_T);
import { isValidSlug } from '../atoms/is-valid-slug.mjs';
import { ALL_MODULES } from '../atoms/all-modules.mjs';
import { MODULE_LABELS } from '../atoms/module-labels.mjs';
import { allOffConfig as allOffConfigAtom } from '../atoms/all-off-config.mjs';
import { orgLink as __pure_orgLink } from '../atoms/org-link.mjs';
import { ORG_LINK_T as __d_orgLink_ORG_LINK_T } from '../atoms/org-link-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const orgLink = (...a) => __pure_orgLink(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_orgLink_ORG_LINK_T);
import { normEmail } from '../atoms/norm-email.mjs';
import { genJoinCode as __pure_genJoinCode } from '../atoms/gen-join-code.mjs';
import { GEN_JOIN_CODE_T as __d_gen_join_code_T } from '../atoms/gen-join-code-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const genJoinCode = (...a) => __pure_genJoinCode(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_gen_join_code_T);
import { orgJoinLink as __pure_orgJoinLink } from '../atoms/org-join-link.mjs';
import { ORG_JOIN_LINK_T as __d_orgJoinLink_ORG_JOIN_LINK_T } from '../atoms/org-join-link-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const orgJoinLink = (...a) => __pure_orgJoinLink(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_orgJoinLink_ORG_JOIN_LINK_T);
import { orgJoinFullCode } from '../atoms/org-join-full-code.mjs';
import { parseJoinFullCode as parseJoinFullCodeAtom } from '../atoms/parse-join-full-code.mjs';
import { isOrgManager as isOrgManagerAtom } from '../atoms/is-org-manager.mjs';
import { orgEnabledModules as orgEnabledModulesAtom } from '../atoms/org-enabled-modules.mjs';
import { orgEnabledFeatures as orgEnabledFeaturesAtom } from '../atoms/org-enabled-features.mjs';
import { isMember as isMemberAtom } from '../atoms/is-member.mjs';
import { overrideOf as overrideOfAtom } from '../atoms/override-of.mjs';
import { makeGRANTABLE_STAFF_FEATURES as __pure_makeGRANTABLE_STAFF_FEATURES } from '../atoms/grantable-staff-features.mjs';
import { GRANTABLE_STAFF_FEATURES_T as __d_grantable_staff_features_T } from '../atoms/grantable-staff-features-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const GRANTABLE_STAFF_FEATURES = __pure_makeGRANTABLE_STAFF_FEATURES(__d_grantable_staff_features_T);
import { isGrantableFeature as isGrantableFeatureAtom } from '../atoms/is-grantable-feature.mjs';
import { effectiveConfigFor as effectiveConfigForAtom } from '../atoms/effective-config-for.mjs';
import { allowedDesignationsFor as allowedDesignationsForAtom } from '../atoms/allowed-designations-for.mjs';
import { canIssueReceipt } from '../atoms/can-issue-receipt.mjs';
import { approveMember as approveMemberAtom } from '../atoms/approve-member.mjs';
import { setEmployeeOverride as setEmployeeOverrideAtom } from '../atoms/set-employee-override.mjs';
import { removeMember as removeMemberAtom } from '../atoms/remove-member.mjs';
import { PLATFORM_TERMS } from '../atoms/platform-terms.mjs';

// ── שקע-הזרעה (הכרעת-קופסה): קונפיג-הלידה verbatim מ-maor/src/types/config.ts:404-410.
// ברירת-מחדל חיה בקופסה — לא אטום (חוק-6: קונפיג≠חלק-מכונה) ולא IO. ארגון נולד all-off מכאן.
const DEFAULT_CONFIG = { slug: PLATFORM_TERMS.k1, orgName: '', theme: PLATFORM_TERMS.k2, modules: {}, features: {} };

// ── שכנים-מחווטים: כל קריאת-שכן שבמקור נבנית כאן כהזרקת-שקע (חוק-1/3) ──
const wiredIsOrgManager = (email, org) => isOrgManagerAtom(email, org, normEmail);
const wiredOverrideOf = (email, org) => overrideOfAtom(email, org, normEmail);
const wiredOrgEnabledModules = (orgConfig) => orgEnabledModulesAtom(orgConfig, ALL_MODULES);

// ── החשיפה (חתימות זהות למקור; החוטים הטהורים נחשפים ישירות) ──
export { slugify, isValidSlug, ALL_MODULES, MODULE_LABELS, orgLink, normEmail,
  genJoinCode, orgJoinLink, orgJoinFullCode, canIssueReceipt, GRANTABLE_STAFF_FEATURES };

export const allOffConfig = (slug, orgName) => allOffConfigAtom(slug, orgName, ALL_MODULES, DEFAULT_CONFIG);
export const parseJoinFullCode = (full) => parseJoinFullCodeAtom(full, isValidSlug);
export const isOrgManager = wiredIsOrgManager;
export const overrideOf = wiredOverrideOf;
export const orgEnabledModules = wiredOrgEnabledModules;
export const orgEnabledFeatures = (orgConfig, features) =>
  orgEnabledFeaturesAtom(orgConfig, features, ALL_MODULES, orgEnabledModulesAtom);
export const isMember = (email, org) => isMemberAtom(email, org, normEmail, wiredIsOrgManager);
export const isGrantableFeature = (key) => isGrantableFeatureAtom(key, GRANTABLE_STAFF_FEATURES);
export const effectiveConfigFor = (email, org, orgConfig) =>
  effectiveConfigForAtom(email, org, orgConfig, wiredIsOrgManager, wiredOverrideOf, GRANTABLE_STAFF_FEATURES);
export const allowedDesignationsFor = (email, org) =>
  allowedDesignationsForAtom(email, org, wiredIsOrgManager, wiredOverrideOf);
export const approveMember = (org, email) => approveMemberAtom(org, email, normEmail);
export const setEmployeeOverride = (org, email, override) => setEmployeeOverrideAtom(org, email, override, normEmail);
export const removeMember = (org, email) => removeMemberAtom(org, email, normEmail);
