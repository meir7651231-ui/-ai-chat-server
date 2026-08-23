/** 🪨 טיוטת-חוט (דרגת-מחצבה) · relabelHistByTxn — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/nedarimSync.ts:344-366 (23 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): relabelHistByTxn
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function relabelHistByTxn(supporters, txns, label) {
    const set = new Set(txns.map((t) => t.trim()).filter(Boolean));
    if (!set.size)
        return { supporters, changed: 0 };
    let changed = 0;
    const out = supporters.map((sp) => {
        const hist = sp.hist;
        if (!hist?.length)
            return sp;
        let touched = false;
        const next = hist.map((h) => {
            const key = (h.txn || '').trim() || (h.ref || '').trim();
            if (!key || !set.has(key) || h.clearer === label)
                return h;
            touched = true;
            changed++;
            return { ...h, clearer: label };
        });
        return touched ? { ...sp, hist: next } : sp;
    });
    return { supporters: out, changed };
}
/** 🔧 ריפוי-כרטיסים מרשומות-ספק (23.8): לכל כרטיס שמחזיק ב-hist עסקאות של
 *  הספק (לפי txn/ref) — (א) תיקון תווית-הסליקה, (ב) מילוי-אם-ריק של פרטי-הקשר
 *  מהעסקאות ("שם יכנס לשם, טלפון לטלפון"). אידמפוטנטי; לעולם לא דורס ערך קיים. */
