/** קופסת-חיבורים · telephony — הגשר בין אשף-ההקמה למנוע-הטלפוניה הטהור.
 *  חוזה: telephony.contract.md
 *  מחווטת את 6 חוטי-הגשר (מקור: maor/src/components/telephony/lib.ts). זה המקום
 *  היחיד שבו החוטים נפגשים (חוקי-החשמלאי, LAW.md): החוט telephonyToTenant (בבעלות
 *  הקופסה) מוזרק לשקע-telephonyToTenant של preview/explain — זו הכרעת-החיווט החיה כאן.
 *  שקעי-IO אמיתיים (מנוע-הטלפוניה החיצוני + עוגן-היום התלוי-Date) = פרמטרים-מוזרקים
 *  מתועדים, לא מימוש: validateTenant · buildTenant · explainCall · trustReport ·
 *  hebrewClosedWindows · CITIES (מ-lib/telephony/engine) · anchorToday (Date מקומי). */
import { emptyTelephonyConfig } from '../atoms/empty-telephony-config.mjs';
import { toTenantId } from '../atoms/to-tenant-id.mjs';
import { telephonyToTenant } from '../atoms/telephony-to-tenant.mjs';
import { previewTelephony as previewTelephonyAtom } from '../atoms/preview-telephony.mjs';
import { nextClosure as nextClosureAtom } from '../atoms/next-closure.mjs';
import { explainOne as explainOneAtom } from '../atoms/explain-one.mjs';

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
