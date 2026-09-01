/** קופסת-חיבורים · seasonality — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/components/supporters/seasonality.ts · TS→JS ביט-התנהגותי · שקעים-חיצוניים נפתרו לאטומי-מדף (קופסה→אטום). */
const M = (iso) => {
    // YYYY-MM-DD → חודש. זול, בלי Date.
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const m = +iso.slice(5, 7);
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    return m >= 1 && m <= 12 ? m : 0;
};
/** אגרגציית-עונתיות על כל התיק — מעבר-יחיד. */
export function seasonality(supporters, rate = 3.7) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const ils = new Array(13).fill(0); // אינדקס 1–12
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const gifts = new Array(13).fill(0);
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const donorHits = new Array(13).fill(0);
    for (const sp of supporters) {
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        const seen = new Array(13).fill(false);
        const take = (date, amount, cur) => {
            const m = M(date);
            if (!m)
                return;
            ils[m] += (cur || '₪') === '$' ? amount * rate : amount;
            gifts[m]++;
            seen[m] = true;
        };
        const dons = sp.donations;
        for (let i = 0; i < dons.length; i++)
            take(dons[i].date, dons[i].amount, dons[i].cur);
        const hist = sp.hist;
        if (hist)
            for (let i = 0; i < hist.length; i++)
                take(hist[i].d, hist[i].a, hist[i].c);
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        for (let m = 1; m <= 12; m++)
            if (seen[m])
                donorHits[m]++;
    }
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const byMonth = [];
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    let totalIls = 0, peakMonth = 0, peakIls = -1, troughMonth = 0, troughIls = Infinity;
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    for (let m = 1; m <= 12; m++) {
        const v = Math.round(ils[m]);
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        byMonth.push({ month: m, ils: v, gifts: gifts[m], donors: donorHits[m] });
        totalIls += v;
        if (v > peakIls) {
            peakIls = v;
            // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
            peakMonth = m;
        }
        if (gifts[m] > 0 && v < troughIls) {
            troughIls = v;
            // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
            troughMonth = m;
        }
    }
    if (peakIls <= 0)
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        peakMonth = 0;
    return {
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        byMonth,
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        peakMonth,
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        troughMonth,
        totalIls,
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        peakShare: totalIls > 0 && peakMonth ? Math.round((peakIls / totalIls) * 100) : 0,
    };
}
/** קצב-הנתינה של תורם-יחיד — החודש-הדומיננטי והאם הוא עונתי. */
export function donorRhythm(sp, rate = 3.7) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const ils = new Array(13).fill(0);
    let total = 0, count = 0;
    const take = (date, amount, cur) => {
        const m = M(date);
        if (!m)
            return;
        const v = (cur || '₪') === '$' ? amount * rate : amount;
        ils[m] += v;
        total += v;
        count++;
    };
    const dons = sp.donations;
    for (let i = 0; i < dons.length; i++)
        take(dons[i].date, dons[i].amount, dons[i].cur);
    const hist = sp.hist;
    if (hist)
        for (let i = 0; i < hist.length; i++)
            take(hist[i].d, hist[i].a, hist[i].c);
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    let topMonth = 0, topIls = -1;
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    for (let m = 1; m <= 12; m++)
        if (ils[m] > topIls) {
            topIls = ils[m];
            // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
            topMonth = m;
        }
    if (topIls <= 0)
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        return { topMonth: 0, concentration: 0, seasonal: false };
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const concentration = total > 0 ? Math.round((topIls / total) * 100) : 0;
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    return { topMonth, concentration, seasonal: concentration >= 60 && count >= 2 };
}
