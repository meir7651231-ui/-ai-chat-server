/** 🪨 טיוטת-חוט (דרגת-מחצבה) · removeMember — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:266-276 (11 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): removeMember, normEmail
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function removeMember(org, email) {
    const e = normEmail(email);
    const members = (org.members ?? []).map((m) => m.trim().toLowerCase()).filter((m) => m !== e);
    const memberConfigs = { ...org.memberConfigs };
    delete memberConfigs[e];
    return { members, memberConfigs };
}
