/** 🪨 טיוטת-חוט (דרגת-מחצבה) · planSupporterImport — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:598-636 (39 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): planSupporterImport, normName, fillEmpty
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function planSupporterImport(rows, existing) {
    const byName = new Map();
    for (const sp of existing)
        byName.set(normName(sp.name), sp.id);
    const updates = [];
    // קיבוץ-עדכונים פר-id (9.8): קובץ-עסקאות מכיל שורות רבות לאותו תורם קיים —
    // בלעדיו רק השורה האחרונה שרדה (ה-Map בצד-הרכיב) וכל ההיסטוריה אבדה.
    const updateIdx = new Map();
    const inserts = [];
    const insertIdx = new Map();
    for (const r of rows) {
        const nm = r.name.trim();
        if (!nm)
            continue;
        const key = normName(nm);
        const existId = byName.get(key);
        if (existId) {
            const ui = updateIdx.get(existId);
            if (ui != null)
                updates[ui] = { id: existId, row: fillEmpty(updates[ui].row, r) };
            else {
                updateIdx.set(existId, updates.length);
                updates.push({ id: existId, row: r });
            }
            continue;
        }
        const idx = insertIdx.get(key);
        if (idx != null) {
            inserts[idx] = fillEmpty(inserts[idx], r);
            continue;
        }
        insertIdx.set(key, inserts.length);
        inserts.push(r);
    }
    return { updates, inserts };
}
/** החלת שורת ייבוא על תומכת קיימת — ערך לא-ריק בשורה דורס, אחרת נשמר הקיים.
 *  היסטוריה (9.8): מיזוג אידמפוטנטי — בלי קבלות, בלי נגיעה במונים. */
