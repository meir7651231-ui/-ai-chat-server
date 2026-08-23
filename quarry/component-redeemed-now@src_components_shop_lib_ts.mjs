/** 🪨 טיוטת-חוט (דרגת-מחצבה) · componentRedeemedNow — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:466-503 (38 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): componentRedeemedNow, itemOf, holidayAllowed, assignmentRedeemed, pendingCount, progressOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function componentRedeemedNow(db, a, comp, holidays) {
    if (holidays) {
        const ri = itemOf(db, comp);
        if (ri.kind === 'holidayGift') {
            // חגים נבחרים (הכרעה 17) — רק חג שסומן על הפריט רלוונטי
            const next = holidays.find((h) => holidayAllowed(ri, h.name));
            if (next)
                return assignmentRedeemed(a, comp.id, next);
        }
    }
    return assignmentRedeemed(a, comp.id);
}
/** כמה רכיבים בשיוך עדיין ממתינים (לא-מומשים; מבוטל = ממתין; מתנת-חג — פר-חג-ושנה). */
function pendingCount(db, a, holidays) {
    const product = db.shopProducts.find((p) => p.id === a.productId);
    if (!product)
        return 0;
    return product.components.filter((c) => !componentRedeemedNow(db, a, c, holidays)).length;
}
/** התקדמות המימוש 0..1 (בלי רכיבים = 1 — אין מה לממש). */
function progressOf(db, a, holidays) {
    const product = db.shopProducts.find((p) => p.id === a.productId);
    const total = product?.components.length ?? 0;
    if (!total)
        return 1;
    return (total - pendingCount(db, a, holidays)) / total;
}
/**
 * סינון+מיון השיוכים: q על שם המשפחה/החבילה (smartFilter); 'pending'
 * (ברירת המחדל) = יש-רכיב-ממתין קודם, ובתוכם since עולה — הכי-ותיק-ממתין
 * ראשון; ממומש-כולו אחרון. todayIso (רשות, swarm-audit): מפעיל את דין
 * מתנת-החג פר-שנה-עברית (componentRedeemedNow) — בלעדיו ההתנהגות ההיסטורית.
 */
