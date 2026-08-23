/** 🪨 טיוטת-חוט (דרגת-מחצבה) · explainOne — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/telephony/lib.ts:199-206 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): explainOne, telephonyToTenant, validateTenant, explainCall, anchorToday
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function explainOne(tc, orgName, tenantId, call) {
    const raw = telephonyToTenant(tc, orgName, tenantId);
    const v = validateTenant(raw);
    if (!v.ok)
        return { summary: '⚠️ תצורה לא-תקינה: ' + v.errors.join(' · '), outcome: 'invalid', reason: '' };
    const e = explainCall(v.tenant, call, { anchorDate: anchorToday(), calendarWindow: 400 });
    return { summary: e.summary, outcome: e.outcome, reason: e.reason };
}
