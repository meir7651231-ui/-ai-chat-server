/** 🪨 טיוטת-חוט (דרגת-מחצבה) · filterAssignments — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:504-537 (34 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): filterAssignments, upcomingHolidays, pendingCount, smartFilter, famName, progressOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function filterAssignments(db, q, status, pendingOnly, productId, sort, todayIso) {
    const holidays = todayIso ? upcomingHolidays(todayIso, SHOP_HOLIDAY_DUE_DAYS) : undefined;
    let list = [...db.shopAssignments];
    if (status)
        list = list.filter((a) => a.status === status);
    if (productId)
        list = list.filter((a) => a.productId === productId);
    if (pendingOnly)
        list = list.filter((a) => pendingCount(db, a, holidays) > 0);
    list = smartFilter(q, list, (a) => {
        const fam = db.families.find((f) => f.id === a.famId);
        const product = db.shopProducts.find((p) => p.id === a.productId);
        return [fam?.name ?? '', ...(fam?.name.split(/\s+/) ?? []), product?.name ?? ''];
    });
    const famName = (a) => db.families.find((f) => f.id === a.famId)?.name ?? '';
    const cmp = {
        pending: (a, b) => {
            const pa = pendingCount(db, a, holidays) > 0 ? 0 : 1;
            const pb = pendingCount(db, b, holidays) > 0 ? 0 : 1;
            if (pa !== pb)
                return pa - pb; // ממתינים קודם; ממומש-כולו אחרון
            return (a.since || '9999').localeCompare(b.since || '9999'); // הכי-ותיק-ממתין ראשון
        },
        name: (a, b) => famName(a).localeCompare(famName(b), 'he'),
        progress: (a, b) => progressOf(db, a, holidays) - progressOf(db, b, holidays),
    };
    return list.sort(cmp[sort]);
}
/** סינון החבילות בקטלוג — q על שם/תיאור; פעילות בלבד (רשות). */
