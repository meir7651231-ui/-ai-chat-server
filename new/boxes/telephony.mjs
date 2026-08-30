/** קופסת-חיבורים · telephony — הגשר בין אשף-ההקמה למנוע-הטלפוניה הטהור.
 *  חוזה: telephony.contract.md
 *  מחווטת את 6 חוטי-הגשר (מקור: maor/src/components/telephony/lib.ts). זה המקום
 *  היחיד שבו החוטים נפגשים (חוקי-החשמלאי, LAW.md): החוט telephonyToTenant (בבעלות
 *  הקופסה) מוזרק לשקע-telephonyToTenant של preview/explain — זו הכרעת-החיווט החיה כאן.
 *  שקעי-IO אמיתיים (מנוע-הטלפוניה החיצוני + עוגן-היום התלוי-Date) = פרמטרים-מוזרקים
 *  מתועדים, לא מימוש: validateTenant · buildTenant · explainCall · trustReport ·
 *  hebrewClosedWindows · CITIES (מ-lib/telephony/engine) · anchorToday (Date מקומי). */
import { emptyTelephonyConfig as __pure_emptyTelephonyConfig } from '../atoms/empty-telephony-config.mjs';
import { EMPTY_TELEPHONY_CONFIG_T as __d_emptyTelephonyConfig_EMPTY_TELEPHONY_CONFIG_T } from '../atoms/empty-telephony-config-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const emptyTelephonyConfig = (...a) => __pure_emptyTelephonyConfig(...a, ...Array(Math.max(0, 0 - a.length)).fill(undefined), __d_emptyTelephonyConfig_EMPTY_TELEPHONY_CONFIG_T);
import { toTenantId as __pure_toTenantId } from '../atoms/to-tenant-id.mjs';
import { TO_TENANT_ID_T as __d_toTenantId_TO_TENANT_ID_T } from '../atoms/to-tenant-id-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const toTenantId = (...a) => __pure_toTenantId(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_toTenantId_TO_TENANT_ID_T);
import { telephonyToTenant } from '../atoms/telephony-to-tenant.mjs';
import { previewTelephony as __pure_previewTelephony } from '../atoms/preview-telephony.mjs';
import { PREVIEW_TELEPHONY_T as __d_previewTelephony_PREVIEW_TELEPHONY_T } from '../atoms/preview-telephony-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const previewTelephonyAtom = (...a) => __pure_previewTelephony(...a, ...Array(Math.max(0, 9 - a.length)).fill(undefined), __d_previewTelephony_PREVIEW_TELEPHONY_T);
import { nextClosure as __pure_nextClosure } from '../atoms/next-closure.mjs';
import { NEXT_CLOSURE_T as __d_nextClosure_NEXT_CLOSURE_T } from '../atoms/next-closure-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const nextClosureAtom = (...a) => __pure_nextClosure(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_nextClosure_NEXT_CLOSURE_T);
import { explainOne as __pure_explainOne } from '../atoms/explain-one.mjs';
import { EXPLAIN_ONE_T as __d_explainOne_EXPLAIN_ONE_T } from '../atoms/explain-one-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const explainOneAtom = (...a) => __pure_explainOne(...a, ...Array(Math.max(0, 8 - a.length)).fill(undefined), __d_explainOne_EXPLAIN_ONE_T);

// ── החשיפה: חוטים טהורים (בלי שקע) עוברים כלשונם ──
export { emptyTelephonyConfig, toTenantId, telephonyToTenant };

// ── החיווט (ההכרעות החיות בקופסה) ──
// preview/explain: הקופסה מספקת את החוט-שלה telephonyToTenant לשקע; שאר השקעים
// (מנוע-הטלפוניה + anchorToday) נשארים מוזרקים ע"י הצרכן דרך אובייקט io.

/** תצוגה-מקדימה חיה. io = {anchorToday, validateTenant, buildTenant, explainCall, trustReport}. */
export function previewTelephony(tc, orgName, tenantId, io) {
  return previewTelephonyAtom(
    tc, orgName, tenantId,
    telephonyToTenant,           // ← חוט-הקופסה ממלא את שקע-ההמרה
    io.anchorToday,
    io.validateTenant, io.buildTenant, io.explainCall, io.trustReport,
  );
}

/** תיאור-שיחה יחיד. io = {anchorToday, validateTenant, explainCall}. */
export function explainOne(tc, orgName, tenantId, call, io) {
  return explainOneAtom(
    tc, orgName, tenantId, call,
    telephonyToTenant,           // ← אותו חוט-הקופסה לשקע-ההמרה
    io.validateTenant, io.explainCall, io.anchorToday,
  );
}

/** הסגירה ההלכתית הבאה (ווידג'ט-בית). io = {hebrewClosedWindows, CITIES}. */
export function nextClosure(config, todayIso, io) {
  return nextClosureAtom(config, todayIso, io.hebrewClosedWindows, io.CITIES);
}
