/** קופסת-חיבורים · retention — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/components/supporters/retention.ts · TS→JS ביט-התנהגותי · שקעים-חיצוניים נפתרו לאטומי-מדף (קופסה→אטום). */
import { M } from '../atoms/retention-nums.mjs';
import { dayDiff } from '../atoms/intel-day-diff.mjs';
import { donorScan } from '../atoms/intel-donor-scan.mjs';
/**
 * קוהורטות-גיוס. מגביל לשנים עם גיוס-בפועל; שנת-גיוס נלקחת מהמתנה-הראשונה של התורם.
 */
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
export function acquisitionCohorts(supporters, todayIso, rate = 3.7) {
    const map = new Map();
    for (const sp of supporters) {
        const scan = donorScan(sp, todayIso, rate, M.m0);
        if (scan.count === 0 || !scan.first)
            continue;
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        const year = +scan.first.slice(0, 4);
        if (!year)
            continue;
        let row = map.get(year);
        if (!row) {
            row = { year, size: 0, activeNow: 0, retentionPct: 0, ltv: 0 };
            map.set(year, row);
        }
        row.size++;
        row.ltv += scan.ils;
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        if (scan.last && dayDiff(scan.last, todayIso) <= 365)
            row.activeNow++;
    }
    const cohorts = [...map.values()].sort((a, b) => a.year - b.year);
    let totSize = 0, totActive = 0;
    for (const c of cohorts) {
        c.ltv = Math.round(c.ltv);
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        c.retentionPct = c.size > 0 ? Math.round((c.activeNow / c.size) * 100) : 0;
        totSize += c.size;
        totActive += c.activeNow;
    }
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    return { cohorts, overallRetention: totSize > 0 ? Math.round((totActive / totSize) * 100) : 0 };
}
