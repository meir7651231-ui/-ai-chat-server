/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sortSupportThreads — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/supportChat.ts:104-116 (13 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sortSupportThreads, supportUnread
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function sortSupportThreads(threads) {
    return [...threads].sort((a, b) => {
        const ua = supportUnread(a, 'admin');
        const ub = supportUnread(b, 'admin');
        if ((ua > 0) !== (ub > 0))
            return ua > 0 ? -1 : 1; // לא-נקרא ראשון
        const la = a.lastAt ?? '';
        const lb = b.lastAt ?? '';
        return la < lb ? 1 : la > lb ? -1 : 0; // חדש ראשון
    });
}
