/** 🪨 טיוטת-חוט (דרגת-מחצבה) · planAddName — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:226-248 (23 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): planAddName, normName, isoToday
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function planAddName(a, rawName, eyes, id) {
    const nm = rawName.trim();
    if (!nm)
        return { ok: false, error: 'הקלידו שם לפני ההוספה' };
    const key = normName(nm);
    if (a.names.some((x) => normName(x.name) === key)) {
        return { ok: false, error: `השם "${nm}" כבר ברשימה` };
    }
    const names = [...a.names, { id, name: nm, eyes, done: false }];
    if (eyes !== '' && eyes != null) {
        return { ok: true, names, log: [{ date: isoToday(), eyes: +eyes, name: nm }, ...a.log] };
    }
    return { ok: true, names };
}
/**
 * שורות הדוח היומי — כל מי שטופל היום (lastTouch או רשומת log מהיום).
 * כותרות עוברות דרך מילון המונחים כדי להישאר כלליות. שורה ראשונה = כותרות.
 */
