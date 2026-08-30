/** קופסת-חיבורים · signals — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/components/supporters/signals.ts · TS→JS ביט-התנהגותי · שקעים-חיצוניים נפתרו לאטומי-מדף (קופסה→אטום). */
import { S } from '../atoms/signals-strings.mjs';
import { M } from '../atoms/signals-nums.mjs';
import { SIGNAL } from '../atoms/signals-data.mjs';
export { SIGNAL } from '../atoms/signals-data.mjs';
import { dayDiff } from '../atoms/intel-day-diff.mjs';
function events(sp, rate) {
    const out = [];
    const push = (date, amount, cur) => {
        if (!date)
            return;
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        out.push({ date: date.slice(0, 10), ils: (cur || '₪') === '$' ? amount * rate : amount });
    };
    const dons = sp.donations;
    for (let i = 0; i < dons.length; i++)
        push(dons[i].date, dons[i].amount, dons[i].cur);
    const hist = sp.hist;
    if (hist)
        for (let i = 0; i < hist.length; i++)
            push(hist[i].d, hist[i].a, hist[i].c);
    out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    return out;
}
/** ספים (מיוצאים לבדיקות/כוונון). */

/** האותות של תורם-יחיד (0 או יותר). */
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
export function donorSignals(sp, todayIso, rate = 3.7) {
    const ev = events(sp, rate);
    if (ev.length === 0)
        return [];
    const id = sp.id, name = sp.name || S.k0;
    const total = ev.reduce((a, e) => a + e.ils, 0);
    const last = ev[ev.length - 1];
    const sinceLast = dayDiff(last.date, todayIso);
    const out = [];
    // תורם-חדש — מתנה יחידה וטרייה (לטיפוח).
    if (ev.length === 1 && sinceLast <= SIGNAL.RECENT_DAYS) {
        out.push({ id, name, kind: S.k1, detail: S.k2, magnitude: M.m0, ils: total });
    }
    if (ev.length >= 2) {
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        const prev = ev.slice(0, -1);
        const prevAvg = prev.reduce((a, e) => a + e.ils, 0) / prev.length;
        const gapBeforeLast = dayDiff(prev[prev.length - 1].date, last.date);
        // חזרה-אחרי-נטישה — פער גדול לפני המתנה-האחרונה, והיא טרייה.
        if (gapBeforeLast >= SIGNAL.GAP_DAYS && sinceLast <= SIGNAL.RECENT_DAYS) {
            out.push({ id, name, kind: S.k3, detail: S.k4 + Math.round(gapBeforeLast / M.m1) + S.k5, magnitude: M.m2, ils: total });
        }
        // נפילת-מתנה — האחרונה קטנה משמעותית מהממוצע (רק על ותק ≥3, לצמצום-רעש).
        if (ev.length >= 3 && prevAvg > 0 && last.ils < prevAvg * SIGNAL.DROP_RATIO) {
            // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
            const pct = Math.round((1 - last.ils / prevAvg) * 100);
            out.push({ id, name, kind: S.k6, detail: S.k7 + pct + S.k8, magnitude: 55 + Math.min(30, pct / 2), ils: total });
        }
        // קפיצה — האחרונה גדולה משמעותית (הזדמנות).
        if (prevAvg > 0 && last.ils > prevAvg * SIGNAL.JUMP_RATIO) {
            const mult = (last.ils / prevAvg).toFixed(1);
            out.push({ id, name, kind: S.k9, detail: S.k10 + mult + S.k11, magnitude: M.m3, ils: total });
        }
        // גולש — תורם-ותיק ששקט הרבה (לא מתנה-בודדת ולא חדש).
        if (sinceLast >= SIGNAL.LAPSING_DAYS) {
            out.push({ id, name, kind: S.k12, detail: S.k13 + Math.round(sinceLast / M.m1) + S.k14, magnitude: M.m4 + Math.min(M.m5, sinceLast / M.m1), ils: total });
        }
    }
    return out;
}
/** אגרגציית-אותות על כל התיק. movers מוגבל ל-limit (ברירת-מחדל 40) לתצוגה. */
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
export function portfolioSignals(supporters, todayIso, rate = 3.7, limit = 40) {
    const counts = { drop: 0, jump: 0, reactivated: 0, firstgift: 0, lapsing: 0 };
    const all = [];
    for (const sp of supporters) {
        const sigs = donorSignals(sp, todayIso, rate);
        for (const s of sigs) {
            counts[s.kind]++;
            all.push(s);
        }
    }
    // דירוג: עוצמה ראשית, ואז כסף — כדי שה"מזיזים" הגדולים יצופו ראשונים.
    all.sort((a, b) => (b.magnitude - a.magnitude) || (b.ils - a.ils));
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    return { counts, movers: all.slice(0, limit), total: all.length };
}
