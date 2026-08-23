/** 🪨 טיוטת-חוט (דרגת-מחצבה) · pushNav — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/navhist.ts:28-33 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): pushNav
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function pushNav(hist, prev) {
    const h = [...hist, prev];
    return h.length > NAV_HIST_MAX ? h.slice(h.length - NAV_HIST_MAX) : h;
}
/** קידום משפחה לראש "נפתחו לאחרונה" — ייחודי, עד 6 (legacy:344-346). */
