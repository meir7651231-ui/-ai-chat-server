/** 🪨 טיוטת-חוט (דרגת-מחצבה) · deliveriesCsvRows — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:114-135 (22 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): deliveriesCsvRows, termOf, dayDate, famName, famAddr, volName, statusLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function deliveriesCsvRows(db, config) {
    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    const dayDate = (id) => db.distributionDays.find((d) => d.id === id)?.date ?? '';
    const famName = (id) => db.families.find((f) => f.id === id)?.name ?? '';
    const famAddr = (id) => {
        const f = db.families.find((x) => x.id === id);
        return f ? [f.address, f.city].map((s) => (s || '').trim()).filter(Boolean).join(', ') : '';
    };
    const volName = (id) => db.volunteers.find((v) => v.id === id)?.name ?? '';
    // גל ב׳: עמודת כתובת (שדרוג-פורמט מתועד — ה-ratchet עודכן במודע)
    const rows = [['תאריך', T('entity.family', 'משפחה'), 'כתובת', 'מתנדב', 'סטטוס', 'הערה']];
    for (const d of db.deliveries) {
        rows.push([dayDate(d.dayId), famName(d.familyId), famAddr(d.familyId), volName(d.volunteerId), statusLabel(d.status), d.note ?? '']);
    }
    return rows;
}
/**
 * עצירות-המסלול של מתנדב ביום-חלוקה (INTEGRATIONS גל א׳ · הרחבת maps):
 * כתובות המשפחות של המסירות שלו באותו יום, בסדר-הלוח, '[address, city]'
 * מסונן-ריקים; משפחה בלי כתובת מדולגת (אין מה לנווט אליו). תצוגה בלבד.
 */
