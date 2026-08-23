/** 🪨 טיוטת-חוט (דרגת-מחצבה) · contactToRow — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/vcardImport.ts:255-266 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): contactToRow
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function contactToRow(c) {
    const notes = [c.org ? '🏢 ' + c.org : '', c.title, c.note].filter(Boolean).join(' · ');
    return {
        name: c.fullName.trim(),
        phone: c.phones[0]?.value || '',
        phone2: c.phones[1]?.value || '',
        email: c.emails[0] || '',
        address: c.address,
        notes,
    };
}
