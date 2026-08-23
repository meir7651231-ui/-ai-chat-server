/** 🪨 טיוטת-חוט (דרגת-מחצבה) · volunteerRouteStops — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:136-148 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): volunteerRouteStops
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function volunteerRouteStops(db, dayId, volunteerId) {
    const out = [];
    for (const d of db.deliveries) {
        if (d.dayId !== dayId || d.volunteerId !== volunteerId)
            continue;
        const fam = db.families.find((f) => f.id === d.familyId);
        if (!fam)
            continue;
        const stop = [fam.address, fam.city].map((s) => (s || '').trim()).filter(Boolean).join(', ');
        if (stop)
            out.push(stop);
    }
    return out;
}
/** סינון מתנדבים (שם/טלפון/אזור) דרך smartFilter. */
