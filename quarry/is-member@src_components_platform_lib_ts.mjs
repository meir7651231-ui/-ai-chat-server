/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isMember — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:163-169 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isMember, normEmail, isOrgManager
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isMember(email, org) {
    const e = normEmail(email);
    if (isOrgManager(e, org))
        return true;
    return (org.members ?? []).map((m) => m.trim().toLowerCase()).includes(e);
}
/** כרטיס-העובד של מייל (דריסות אישיות). מנהל/חבר-בלי-כרטיס = ריק (רואה כמו הארגון). */
