/** קופסת-חיבורים · planned — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/components/supporters/planned.ts · קובץ-עצמאי (type-imports בלבד) ⇒ TS→JS ביט-התנהגותי. */
export function isOpenPlan(p) {
    return !p.chargedRid && !p.cancelledAt;
}
/** רק החיובים הפתוחים של הישות. */
export function openPlans(o) {
    return (o.plannedCharges || []).filter(isOpenPlan);
}
/** סכום פתוח בשקלים (חיובים בשקל, לא-חויבו-עדיין ולא-בוטלו). */
export function pendingIls(o) {
    return openPlans(o).filter((p) => p.cur === '₪').reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount : 0), 0);
}
/** סכום פתוח בדולרים. */
export function pendingUsd(o) {
    return openPlans(o).filter((p) => p.cur === '$').reduce((a, p) => a + (Number.isFinite(p.amount) ? p.amount : 0), 0);
}
/** התאריך של החיוב-הפתוח הקרוב-ביותר (ISO); '' = אין פתוחים. */
export function plannedNextDate(o) {
    const open = openPlans(o);
    if (!open.length)
        return '';
    return open.map((p) => p.date).sort()[0];
}
/** חיובים-פתוחים שכבר עבר תאריכם ומעולם לא חויבו (איחור). */
export function overduePlans(o, todayIso) {
    return openPlans(o).filter((p) => p.date < todayIso);
}
/** הבא-בזמן (הקרוב שעדיין לא-עבר). undefined = אין. */
export function nextUpcomingPlan(o, todayIso) {
    return openPlans(o)
        .filter((p) => p.date >= todayIso)
        .sort((a, b) => a.date.localeCompare(b.date))[0];
}
/**
 * הזזת חודשים כלפי-מעלה על תאריך-ISO, עם קלמפ ליום-האחרון-בחודש-היעד:
 * ‏31.1 + 1 = 28/29.2 (לא 3.3). כך פריסת-תשלומים לא בורחת לתחילת החודש הבא.
 */
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
export function addMonthsClamped(iso, months) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const [ys, ms, ds] = iso.split('-').map((s) => parseInt(s, 10));
    const y0 = ys || 1970;
    const m0 = (ms || 1) - 1;
    const d0 = ds || 1;
    // ‏Date עם יום-1 של החודש היעד כדי לא לגלוש (30.1 → יום-31 בחודש-פברואר).
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const target = new Date(y0, m0 + months, 1, 12, 0, 0);
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    target.setDate(Math.min(d0, lastDay));
    const y = target.getFullYear();
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const mm = String(target.getMonth() + 1).padStart(2, '0');
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const dd = String(target.getDate()).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
}
/** זריעת פריסת-תשלומים אחידה — N שורות PlannedCharge בפערים שווים. */
export function planCharges(spec) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const gap = Math.max(1, spec.gapMonths || 1);
    const out = [];
    for (let i = 0; i < spec.count; i++) {
        out.push({
            id: spec.ids[i] || `pc_${i}`,
            // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
            date: i === 0 ? spec.firstDate : addMonthsClamped(spec.firstDate, i * gap),
            amount: spec.amount,
            cur: spec.cur,
            method: spec.method,
            cat: spec.cat,
            installmentOf: spec.groupId,
            ...(spec.note ? { note: spec.note } : {}),
        });
    }
    return out;
}
