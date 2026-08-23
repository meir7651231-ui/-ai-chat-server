/** 🪨 טיוטת-חוט (דרגת-מחצבה) · campaignProgress — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/publicSite.ts:218-241 (24 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): campaignProgress, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function campaignProgress(c, nowMs) {
    const goal = typeof c?.goal === 'number' && c.goal > 0 ? c.goal : 0;
    const raised = typeof c?.raised === 'number' && c.raised > 0 ? c.raised : 0;
    const pct = goal > 0 ? Math.max(0, Math.min(100, Math.round((raised / goal) * 100))) : 0;
    let daysLeft = null;
    if (c?.end) {
        // חצות-מקומי של יום-היעד (חלק-התאריך בלבד) — ספירת ימים קלנדרית: מ-1.9 ל-11.9
        // = 10 (ולא 11 שנוצר מחישוב סוף-יום). עבר ⇒ 0.
        const t = Date.parse(c.end.slice(0, 10) + 'T00:00:00');
        if (Number.isFinite(t)) {
            const diff = Math.ceil((t - nowMs) / 86_400_000);
            daysLeft = diff > 0 ? diff : 0;
        }
    }
    return { goal, raised, pct, currency: c?.currency || '₪', daysLeft, show: goal > 0 };
}
/**
 * האם להציג את האתר-הציבורי: יש תוכן-site ולא-כובה במפורש (enabled!==false).
 * הגידור על הדגל (shell.publicsite) ועל בקשת-הכתובת (‎?site‎) נעשה ב-App.
 */
