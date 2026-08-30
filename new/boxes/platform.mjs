/** קופסת-חיבורים · platform — לוח-הבקרה של הבעלים + היררכיית-ORGADMIN.
 *  חוזה: platform.contract.md · מקור-האמת: maor/src/components/platform/lib.ts.
 *  זה המקום היחיד שבו חוטי-הפלטפורמה נפגשים (חוקי-החשמלאי, LAW.md): קריאת-שכן
 *  שבמקור = הזרקת-שקע כאן. הקופסה מייבאת אך-ורק אטומים (חוק-2). */
import { slugify as __pure_slugify } from '../atoms/slugify.mjs';
import { HEB2LAT } from '../atoms/slugify-data.mjs';
// עטיפת-כריכה (מנוע-הטיהור v2): הדאטה נכרכת כאן — ה-API החיצוני זהה
const slugify = (...a) => __pure_slugify(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), HEB2LAT);
import { isValidSlug } from '../atoms/is-valid-slug.mjs';
import { ALL_MODULES } from '../atoms/all-modules.mjs';
import { MODULE_LABELS } from '../atoms/module-labels.mjs';
import { allOffConfig as allOffConfigAtom } from '../atoms/all-off-config.mjs';
import { orgLink } from '../atoms/org-link.mjs';
import { normEmail } from '../atoms/norm-email.mjs';
import { genJoinCode } from '../atoms/gen-join-code.mjs';
import { orgJoinLink } from '../atoms/org-join-link.mjs';
import { orgJoinFullCode } from '../atoms/org-join-full-code.mjs';
import { parseJoinFullCode as parseJoinFullCodeAtom } from '../atoms/parse-join-full-code.mjs';
import { isOrgManager as isOrgManagerAtom } from '../atoms/is-org-manager.mjs';
import { orgEnabledModules as orgEnabledModulesAtom } from '../atoms/org-enabled-modules.mjs';
import { orgEnabledFeatures as orgEnabledFeaturesAtom } from '../atoms/org-enabled-features.mjs';
import { isMember as isMemberAtom } from '../atoms/is-member.mjs';
import { overrideOf as overrideOfAtom } from '../atoms/override-of.mjs';
import { GRANTABLE_STAFF_FEATURES } from '../atoms/grantable-staff-features.mjs';
import { isGrantableFeature as isGrantableFeatureAtom } from '../atoms/is-grantable-feature.mjs';
import { effectiveConfigFor as effectiveConfigForAtom } from '../atoms/effective-config-for.mjs';
import { allowedDesignationsFor as allowedDesignationsForAtom } from '../atoms/allowed-designations-for.mjs';
import { canIssueReceipt } from '../atoms/can-issue-receipt.mjs';
import { approveMember as approveMemberAtom } from '../atoms/approve-member.mjs';
import { setEmployeeOverride as setEmployeeOverrideAtom } from '../atoms/set-employee-override.mjs';
import { removeMember as removeMemberAtom } from '../atoms/remove-member.mjs';

// ── שקע-הזרעה (הכרעת-קופסה): קונפיג-הלידה verbatim מ-maor/src/types/config.ts:404-410.
// ברירת-מחדל חיה בקופסה — לא אטום (חוק-6: קונפיג≠חלק-מכונה) ולא IO. ארגון נולד all-off מכאן.
const DEFAULT_CONFIG = { slug: 'default', orgName: '', theme: 'or-rishon', modules: {}, features: {} };

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
