/** 🪨 טיוטת-חוט (דרגת-מחצבה) · approveMember — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/platform/lib.ts:249-255 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): approveMember, normEmail
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function approveMember(org, email) {
    const e = normEmail(email);
    const members = [...new Set([...(org.members ?? []).map((m) => m.trim().toLowerCase()), e])];
    return { members };
}
/** קביעת כרטיס-עובד (טהור) — כותב/מעדכן את דריסות המייל. */
