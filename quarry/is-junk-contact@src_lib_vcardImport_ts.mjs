/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isJunkContact — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/vcardImport.ts:229-235 (7 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isJunkContact, digitsOnly
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isJunkContact(c) {
    if (!c.fullName.trim())
        return true;
    const realPhone = c.phones.some((p) => digitsOnly(p.value).length >= 5);
    return !realPhone && c.emails.length === 0;
}
/** אנשי-הקשר הראויים-לייבוא (בניכוי זבל-מערכת). שומר על הסדר. */
