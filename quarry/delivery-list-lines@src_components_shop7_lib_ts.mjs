/** 🪨 טיוטת-חוט (דרגת-מחצבה) · deliveryListLines — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop7/lib.ts:86-113 (28 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): deliveryListLines, statusLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function deliveryListLines(rows) {
    const byVol = new Map();
    for (const r of rows) {
        const arr = byVol.get(r.volunteerName) ?? [];
        arr.push(r);
        byVol.set(r.volunteerName, arr);
    }
    const out = [];
    for (const [volName, list] of byVol) {
        out.push(`🦺 ${volName} (${list.length} מסירות)`);
        for (const r of list) {
            out.push(`  • ${r.familyName} · ${statusLabel(r.status)}` +
                (r.address ? ' · 📍 ' + r.address : '') +
                (r.note ? ' · ' + r.note : ''));
        }
    }
    return out;
}
/**
 * שורות CSV של כל המסירות — תאריך-יום · משפחה · מתנדב · סטטוס · הערה.
 * שקיפות מלאה (כמו בשאר המודולים): מסירות שטרם נמסרו מסומנות בסטטוסן, לא מוסתרות.
 * תצוגה בלבד — אפס כסף/S- (שמירה על בידוד המודול).
 */
