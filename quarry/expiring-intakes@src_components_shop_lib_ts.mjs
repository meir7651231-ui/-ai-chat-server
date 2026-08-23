/** 🪨 טיוטת-חוט (דרגת-מחצבה) · expiringIntakes — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:378-405 (28 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): expiringIntakes, setDate, getDate, isoOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function expiringIntakes(db, todayIso, windowDays = SHOP_EXPIRY_WARN_DAYS) {
    const horizon = new Date(todayIso + 'T12:00:00');
    horizon.setDate(horizon.getDate() + windowDays);
    const horizonIso = isoOf(horizon);
    const out = [];
    for (const it of db.shopIntakes) {
        if (!it.expiry || it.expiry > horizonIso)
            continue;
        out.push({
            intake: it,
            itemName: db.shopItems.find((s) => s.id === it.itemId)?.name ?? '—',
            expired: it.expiry < todayIso,
        });
    }
    return out.sort((a, b) => (a.intake.expiry ?? '').localeCompare(b.intake.expiry ?? ''));
}
/* ---------- פגישות קרובות (חנות 23, הכרעה 22) ---------- */
/**
 * הפגישות הקרובות — אירועי meeting פתוחים (done=false) בטווח הימים
 * (ברירת מחדל 2 = היום ומחר), ממוינים תאריך+שעה (בלי שעה — לסוף היום),
 * עם שם המוטב ושם החדר. משטח התזכורות של העמודה (אין תשתית push —
 * לא ממציאים).
 */
