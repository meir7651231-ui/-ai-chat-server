/** 🪨 טיוטת-חוט (דרגת-מחצבה) · applyConfig — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/config.ts:911-915 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): applyConfig, applyTheme, applyFavicon
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function applyConfig(cfg) {
    applyTheme(cfg.theme, cfg.accent, cfg.motion);
    applyFavicon(cfg.emoji);
}
