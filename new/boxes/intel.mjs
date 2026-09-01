/** קופסת-חיבורים · intel — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/components/supporters/intel.ts · TS→JS ביט-התנהגותי · שקעים-חיצוניים נפתרו לאטומי-מדף (קופסה→אטום). */
import { S } from '../atoms/intel-strings.mjs';
import { M } from '../atoms/intel-nums.mjs';
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
const MS_DAY = 86_400_000;
/**
 * הזזת תאריך-ISO ב-N ימים — חשבון-לוח **מקומי** (Date(y,m,d+N) בצהריים), פורמט ידני.
 // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
 * 🐛 (21.8): הדפוס הישן `new Date(ms).toISOString().slice(0,10)` עבר round-trip דרך
 * UTC — בהיסטי-אזור-זמן קיצוניים היום מתהפך, וזו גם עקיפה של כלל אין-toISOString
 * של הפרויקט. עזר משותף יחיד לשלושת המנועים (intel/portfolio/timemachine); טהור,
 * דטרמיניסטי, בלי Date.now. days שברי (קצב-נתינה ממוצע) מעוגל ליום השלם הקרוב.
 */
export function shiftIso(iso, days) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const y = +iso.slice(0, 4), m = +iso.slice(5, 7), d = +iso.slice(8, 10);
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const dt = new Date(y, m - 1, d + Math.round(days), 12, 0, 0);
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const p2 = (n) => String(n).padStart(2, '0');
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    return dt.getFullYear() + '-' + p2(dt.getMonth() + 1) + '-' + p2(dt.getDate());
}
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
/** הפרש-ימים בין תאריך-ISO ליום המוזרק (חיובי = בעבר). Infinity לריק/לא-תקין. */
export function dayDiff(iso, todayIso) {
    if (!iso)
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        return Infinity;
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const a = Date.parse(iso.slice(0, 10) + 'T12:00:00');
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const b = Date.parse(todayIso.slice(0, 10) + 'T12:00:00');
    if (Number.isNaN(a) || Number.isNaN(b))
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        return Infinity;
    return Math.floor((b - a) / MS_DAY);
}
/** אינדקס-חודש: כמה חודשים לפני חודש-היום (0 = החודש הנוכחי). ללא Date. */
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
function monthsBefore(iso, todayIso) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    // YYYY-MM → שנה*12+חודש, הפרש שלם — זול ומדויק בלי פרסור-תאריך.
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const y = +iso.slice(0, 4), m = +iso.slice(5, 7);
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const ty = +todayIso.slice(0, 4), tm = +todayIso.slice(5, 7);
    if (!y || !m || !ty || !tm)
        return -1;
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    return ty * 12 + tm - (y * 12 + m);
}
/**
 * מעבר יחיד על כל אירועי-הנתינה של תורם. הבסיס לכל שאר הפונקציות — קוראים אותו
 * פעם-אחת ומחשבים ממנו, כדי לא לסרוק את ההיסטוריה חמש פעמים לכל תורם.
 */
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
export function donorScan(sp, todayIso, rate = 3.7, months = 12) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const monthly = new Array(months).fill(0);
    let count = 0, ils = 0, first = '', last = '';
    const take = (date, amount, cur) => {
        if (!date)
            return;
        count++;
        const v = (cur || '₪') === '$' ? amount * rate : amount;
        ils += v;
        if (!first || date < first)
            first = date;
        if (!last || date > last)
            last = date;
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        const mb = monthsBefore(date, todayIso);
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        if (mb >= 0 && mb < months)
            // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
            monthly[months - 1 - mb] += v;
    };
    const dons = sp.donations;
    for (let i = 0; i < dons.length; i++)
        take(dons[i].date, dons[i].amount, dons[i].cur);
    const hist = sp.hist;
    if (hist)
        for (let i = 0; i < hist.length; i++)
            take(hist[i].d, hist[i].a, hist[i].c);
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    return { count, ils, first, last, monthly };
}
/* ---------- ספי ה-RFM — verbatim מ-supScore (עקביות עם הדרגה הקיימת) ---------- */
function rScore(days) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    return days <= 30 ? 350 : days <= 90 ? 280 : days <= 180 ? 200 : days <= 365 ? 120 : 40;
}
function fScore(cnt) {
    return cnt >= M.m0 ? M.m1 : cnt >= 5 ? M.m2 : cnt >= 3 ? M.m3 : cnt >= 2 ? M.m4 : M.m5;
}
function mScore(tot) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    return tot >= 5000 ? 350 : tot >= 2000 ? 280 : tot >= 1000 ? 210 : tot >= 500 ? 140 : tot >= 100 ? 80 : 40;
}
/** פירוק ה-RFM מתוך scan מוכן (בלי לסרוק שוב). */
export function rfmFromScan(scan, todayIso) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const days = scan.last ? dayDiff(scan.last, todayIso) : 99999;
    const r = rScore(days), f = fScore(scan.count), m = mScore(scan.ils);
    return {
        r, f, m, score: r + f + m,
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        rPct: Math.round((r / 350) * 100),
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        fPct: Math.round((f / 300) * 100),
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        mPct: Math.round((m / 350) * 100),
    };
}
/**
 * סיכון-נטישה 0–100 (דטרמיניסטי). מבוסס טריות מול קצב-הנתינה האישי: מי שנותן כל
 * חודש ושתק חודשיים = סיכון גבוה; מי שנותן פעם-בשנה ושתק חודשיים = נמוך. אפס
 * אירועים ⇒ 0 (לא-תורם, לא "בסיכון").
 */
export function churnFromScan(scan, todayIso) {
    if (scan.count === 0 || !scan.last)
        return 0;
    const daysSince = dayDiff(scan.last, todayIso);
    const span = scan.first && scan.first !== scan.last ? dayDiff(scan.first, scan.last) : 0;
    const cadence = scan.count >= 2 && span > 0 ? span / (scan.count - 1) : M.m6;
    const expected = Math.max(M.m7, cadence * 1.5); // חלון-חסד
    const ratio = daysSince / expected; // 1 = הגיע-הזמן · 2 = איחר-פי-2
    return Math.max(0, Math.min(M.m4, Math.round(ratio * M.m5)));
}
/** תחזית-המתנה-הבאה מתוך scan מוכן. null כשאין מספיק היסטוריה (0 אירועים). */
export function forecastFromScan(scan, todayIso) {
    if (scan.count === 0 || !scan.last)
        return null;
    const avg = Math.round(scan.ils / scan.count);
    const span = scan.first && scan.first !== scan.last ? dayDiff(scan.first, scan.last) : 0;
    const cadence = scan.count >= 2 && span > 0 ? span / (scan.count - 1) : M.m6;
    const dueIso = shiftIso(scan.last, cadence);
    // ביטחון: עולה עם מספר-המתנות, יורד כשכבר איחרו הרבה מעבר לקצב.
    const daysSince = dayDiff(scan.last, todayIso);
    const overdue = cadence > 0 ? Math.max(0, daysSince / cadence - 1) : 0;
    const confidence = Math.max(M.m8, Math.min(M.m9, Math.round(M.m7 + scan.count * 7 - overdue * M.m10)));
    return { amount: avg, dueIso, confidence };
}
/** מגמת-נתינה: מחצית-חדשה מול מחצית-ישנה של הסדרה-החודשית. */
export function trendFromScan(scan) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const mo = scan.monthly, n = mo.length, h = Math.floor(n / 2);
    let older = 0, newer = 0;
    for (let i = 0; i < h; i++)
        older += mo[i];
    for (let i = n - h; i < n; i++)
        newer += mo[i];
    if (older === 0 && newer === 0)
        return { dir: S.k0, pct: 0 };
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const pct = older === 0 ? 100 : Math.round(((newer - older) / older) * 100);
    const dir = pct > 8 ? 'up' : pct < -8 ? S.k1 : S.k0;
    return { dir, pct };
}
/**
 * כל המודיעין של תורם — **מעבר יחיד** ואז נגזרות זולות. זו נקודת-הכניסה שה-UI קורא
 * פר-תורם (במקום 5 פונקציות שכל אחת סורקת מחדש).
 */
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
export function donorIntel(sp, todayIso, rate = 3.7, months = 12) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const scan = donorScan(sp, todayIso, rate, months);
    return {
        scan,
        rfm: rfmFromScan(scan, todayIso),
        churn: churnFromScan(scan, todayIso),
        forecast: forecastFromScan(scan, todayIso),
        trend: trendFromScan(scan),
        ltv: Math.round(scan.ils),
        avgGift: scan.count ? Math.round(scan.ils / scan.count) : 0,
    };
}
