/** קופסת-חיבורים · tier-migration — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/components/supporters/tierMigration.ts · TS→JS ביט-התנהגותי · שקעים-חיצוניים נפתרו לאטומי-מדף (קופסה→אטום). */
import { TIER_RANK, TIER_ORDER } from '../atoms/tier-migration-data.mjs';
import { supTier } from '../atoms/sup-tier.mjs';
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
const MS_DAY = 86_400_000;
/** דירוג-דרגה להשוואת עלייה/ירידה (גבוה=טוב יותר). */

/* ספי-RFM — verbatim מ-supScore (עקביות עם הדרגה החיה). */
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
function rScore(days) { return days <= 30 ? 350 : days <= 90 ? 280 : days <= 180 ? 200 : days <= 365 ? 120 : 40; }
function fScore(c) { return c >= 10 ? 300 : c >= 5 ? 230 : c >= 3 ? 160 : c >= 2 ? 100 : 50; }
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
function mScore(t) { return t >= 5000 ? 350 : t >= 2000 ? 280 : t >= 1000 ? 210 : t >= 500 ? 140 : t >= 100 ? 80 : 40; }
/**
 * דרגת-התורם נכון-ל-asOfIso — סופר רק נתינות עד אותו יום, וטריות יחסית-אליו.
 * null = לא-היה-תורם עדיין (אין נתינה עד אותו יום).
 */
export function tierAsOf(sp, asOfIso, rate = 3.7) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const cut = asOfIso.slice(0, 10);
    const asMs = Date.parse(cut + 'T12:00:00');
    let count = 0, ils = 0, last = '';
    const take = (date, amount, cur) => {
        if (!date)
            return;
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        const d = date.slice(0, 10);
        if (d > cut)
            return; // אחרי נקודת-הזמן — לא קיים עדיין
        count++;
        ils += (cur || '₪') === '$' ? amount * rate : amount;
        if (!last || d > last)
            last = d;
    };
    const dons = sp.donations;
    for (let i = 0; i < dons.length; i++)
        take(dons[i].date, dons[i].amount, dons[i].cur);
    const hist = sp.hist;
    if (hist)
        for (let i = 0; i < hist.length; i++)
            take(hist[i].d, hist[i].a, hist[i].c);
    if (count === 0)
        return null;
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const days = last ? Math.floor((asMs - Date.parse(last + 'T12:00:00')) / MS_DAY) : 99999;
    const score = rScore(days) + fScore(count) + mScore(ils);
    return supTier(score).label;
}
/** הזזת-תאריך אחורה ב-N חודשים (ללא Date.now).
 *  🐛 (21.8): היום נגרר-מילולית ⇒ 2024-02-29 מינוס 12 חודשים הפיק "2023-02-29"
 // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
 *  (תאריך לא-קיים) ⇒ Date.parse=NaN ⇒ dayDiff=Infinity ⇒ כל דרגות-הבסיס קרסו
 *  בשקט לדלי-הגרוע. עכשיו היום נקטם לאורך חודש-היעד (29.2 ⇒ 28.2, 31 ⇒ 30/28). */
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
function shiftMonths(iso, monthsBack) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const y = +iso.slice(0, 4), m = +iso.slice(5, 7), d = +iso.slice(8, 10);
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const tot = y * 12 + (m - 1) - monthsBack;
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const ny = Math.floor(tot / 12), nm = (tot % 12) + 1;
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const maxD = new Date(ny, nm, 0).getDate(); // היום-האחרון של חודש-היעד (דטרמיניסטי)
    const nd = Math.min(d, maxD);
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    return ny + '-' + String(nm).padStart(2, '0') + '-' + String(nd).padStart(2, '0');
}
/**
 // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
 * מטריצת-מעברי-דרגה אמיתית: דרגה לפני monthsBack חודשים מול היום.
 */
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
export function tierMigration(supporters, todayIso, monthsBack = 12, rate = 3.7) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const fromIso = shiftMonths(todayIso.slice(0, 10), monthsBack);
    const flowMap = new Map();
    let promoted = 0, demoted = 0, stable = 0, newDonors = 0;
    for (const sp of supporters) {
        const to = tierAsOf(sp, todayIso, rate);
        if (!to)
            continue; // לא-תורם היום ⇒ לא רלוונטי
        const from = tierAsOf(sp, fromIso, rate);
        if (!from) {
            newDonors++;
            continue;
        }
        const diff = TIER_RANK[to] - TIER_RANK[from];
        if (diff > 0)
            promoted++;
        else if (diff < 0)
            demoted++;
        else
            stable++;
        if (from !== to) {
            const key = from + '→' + to;
            const row = flowMap.get(key);
            if (row)
                row.count++;
            else
                flowMap.set(key, { from, to, count: 1 });
        }
    }
    const flows = [...flowMap.values()].sort((a, b) => b.count - a.count);
    return { promoted, demoted, stable, newDonors, flows, fromIso };
}
export { TIER_ORDER };
