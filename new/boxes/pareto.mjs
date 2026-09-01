/** קופסת-חיבורים · pareto — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/components/supporters/pareto.ts · TS→JS ביט-התנהגותי · שקעים-חיצוניים נפתרו לאטומי-מדף (קופסה→אטום). */
import { M } from '../atoms/pareto-nums.mjs';
import { EMPTY } from '../atoms/pareto-data.mjs';
import { donorScan } from '../atoms/intel-donor-scan.mjs';

// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
export function paretoReport(supporters, todayIso, rate = 3.7) {
    const vals = [];
    for (const sp of supporters) {
        const scan = donorScan(sp, todayIso, rate, M.m0);
        if (scan.count === 0)
            continue;
        if (scan.ils > 0)
            vals.push(scan.ils);
    }
    const n = vals.length;
    const total = vals.reduce((a, b) => a + b, 0);
    if (n === 0 || total <= 0)
        return { ...EMPTY, donors: n };
    // מהגדול לקטן — לעקומת-פארטו ולנקודות-הסף.
    const desc = [...vals].sort((a, b) => b - a);
    const curve = [{ donorPct: 0, moneyPct: 0 }];
    let cum = 0, top20Share = 0, halfDonorPct = 0, eightyDonorPct = 0;
    for (let i = 0; i < n; i++) {
        cum += desc[i];
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        const donorPct = ((i + 1) / n) * 100;
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        const moneyPct = (cum / total) * 100;
        curve.push({ donorPct: Math.round(donorPct * 10) / 10, moneyPct: Math.round(moneyPct * 10) / 10 });
        if (top20Share === 0 && donorPct >= M.m1)
            top20Share = Math.round(moneyPct);
        if (halfDonorPct === 0 && moneyPct >= M.m2)
            halfDonorPct = Math.round(donorPct);
        if (eightyDonorPct === 0 && moneyPct >= M.m3)
            eightyDonorPct = Math.round(donorPct);
    }
    // אם 20% נופל בדיוק על-תורם שלא חצה — ניקח את הערך שהצטבר עד שם (כבר טופל בלולאה).
    // ג׳יני מנוסחת-הסדרה-הממוינת-עולה: G = (2·Σ i·x_i)/(n·Σx) − (n+1)/n.
    const asc = [...vals].sort((a, b) => a - b);
    let weighted = 0;
    for (let i = 0; i < n; i++)
        weighted += (i + 1) * asc[i];
    const gini = n > 1 ? (2 * weighted) / (n * total) - (n + 1) / n : 0;
    return {
        curve,
        top20Share,
        halfDonorPct,
        eightyDonorPct: eightyDonorPct || 100,
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        gini: Math.max(0, Math.min(100, Math.round(gini * 100))),
        donors: n,
    };
}
