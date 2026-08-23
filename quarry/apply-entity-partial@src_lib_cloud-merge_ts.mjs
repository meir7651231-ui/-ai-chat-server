/** 🪨 טיוטת-חוט (דרגת-מחצבה) · applyEntityPartial — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud-merge.ts:73-105 (33 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): applyEntityPartial, sanitizeIncoming, mergeDonationsPreserving
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function applyEntityPartial(db, col, docs) {
    if (!ENTITY_COLLECTIONS.includes(col))
        return db;
    const key = col;
    const list = db[key];
    const deleted = new Set(docs.filter((d) => d.deleted).map((d) => d.id));
    const incoming = new Map(docs
        .filter((d) => !d.deleted)
        .map((d) => [d.id, sanitizeIncoming(col, { ...d.data, id: d.id })]));
    // עדכונים במקומם (שומר סדר), חדשים לראש הרשימה — כמו upsertIn של ה-store
    const kept = list
        .filter((x) => !deleted.has(x.id))
        .map((x) => {
        const inc = incoming.get(x.id);
        if (inc) {
            incoming.delete(x.id);
            // איחוד-תרומות חסין-אובדן (פריט ח') — לתומכים בלבד; שאר האוספים כרגיל.
            const merged = mergeDonationsPreserving(col, x, inc);
            return merged;
        }
        return x;
    });
    const next = [...incoming.values(), ...kept];
    if (JSON.stringify(next) === JSON.stringify(list))
        return db;
    return { ...db, [key]: next };
}
/** מיזוג מסמך meta/org מרוחק — שדות שאינם ישויות; seq תמיד המקסימום. */
