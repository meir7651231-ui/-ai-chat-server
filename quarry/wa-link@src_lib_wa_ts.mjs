/** 🪨 טיוטת-חוט (דרגת-מחצבה) · waLink — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/wa.ts:32-51 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): waLink, waDigits, encodeURIComponent, orgOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function waLink(phone, text = '') {
    const digits = waDigits(phone);
    if (!digits)
        return null;
    const t = text.trim();
    return 'https://wa.me/' + digits + (t ? '?text=' + encodeURIComponent(t) : '');
}
function orgOf(orgName) {
    return orgName.trim() || 'העמותה';
}
/** הודעת-מסירה (חלוקה): נשלחת למשפחה כשהמשלוח יוצא/בדרך. */
