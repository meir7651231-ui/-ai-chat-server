/** 🪨 טיוטת-חוט (דרגת-מחצבה) · fillCardFromCharge — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/nedarimSync.ts:303-321 (19 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): fillCardFromCharge, normPhone, normId
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function fillCardFromCharge(sp, charge) {
    const fill = {};
    // 🐛 נחיל-סולה C12: טלפון שלא שורד נורמליזציה (קצר/דמה) לא ממלא שדה ריק —
    // אחרת הוא חוסם השלמה אמיתית עתידית (מילוי-אם-ריק לא דורס).
    const rawPhone = (charge.phone || '').trim();
    const phone = normPhone(rawPhone).length >= 7 ? rawPhone : '';
    const email = (charge.email || '').trim();
    const zeout = normId(charge.zeout || '');
    const name = (charge.name || '').trim();
    if (phone && !(sp.phone || '').trim())
        fill.phone = phone;
    if (email && !(sp.email || '').trim())
        fill.email = email;
    if (zeout && !(sp.idNum || '').trim())
        fill.idNum = zeout;
    if (name && !(sp.name || '').trim())
        fill.name = name;
    return Object.keys(fill).length ? { ...sp, ...fill } : sp;
}
/** חיבור-ידני של עסקה לכרטיס נבחר — מוסיף chargeToHist ל-hist (דדופ לפי txn)
 *  + מילוי-אם-ריק של פרטי-הקשר מהעסקה.
 *  מחזיר { supporters, added }; added=false אם הכרטיס לא-נמצא או העסקה כבר קיימת. */
