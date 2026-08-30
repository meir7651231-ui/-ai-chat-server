/** קופסת-חיבורים · team-intel — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/components/platform/teamIntel.ts · TS→JS ביט-התנהגותי · שקעים-חיצוניים נפתרו לאטומי-מדף (קופסה→אטום). */
import { S } from '../atoms/team-intel-strings.mjs';
import { M } from '../atoms/team-intel-nums.mjs';
import { RECENT_LIMIT } from '../atoms/team-intel-data.mjs';
export function trendOf(w) {
    if (w.last7 > w.prevWeek)
        return '▲';
    if (w.last7 < w.prevWeek)
        return '▼';
    return '＝';
}

/** ‎YYYY-MM-DD מ-ISO מלא. */
// קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
const dayOf = (iso) => iso.slice(0, 10);
/** האם iso בתוך חלון N-הימים שמסתיים ב-todayIso (כולל). דטרמיניסטי. */
function withinDays(iso, todayIso, days) {
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const d = new Date(dayOf(iso) + 'T12:00:00').getTime();
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const t = new Date(todayIso + 'T12:00:00').getTime();
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const diff = (t - d) / 86400000;
    return diff >= 0 && diff < days;
}
/** נרמול-מייל להשוואה (הלוג כותב את המייל המחובר כמו-שהוא).
 *  תיקון 21.8 (ממצא-נחיל): מקבל unknown — רשומת-לוג ממוזגת-ענן בלי `who`
 *  (cloud-merge מציב meta.audit בלי ולידציה) הפילה את norm ב-TypeError
 *  והלבינה את כל פאנל-המנהל. */
const norm = (e) => String(e ?? '').trim().toLowerCase();
/** סינון-מגן על לוג שהגיע מהענן: רק אובייקטים עם חותמת-`at` מחרוזתית נספרים
 *  (בלעדיה חישובי-הימים היו קורסים). רשומה עקומה מדולגת — לא מפילה מסך. */
function safeAudit(audit) {
    if (!Array.isArray(audit))
        return [];
    return audit.filter((a) => !!a && typeof a === S.k0 && typeof a.at === S.k1);
}
/** מודיעין לעובד/ת אחת — סריקה אחת על הלוג. */
export function workerIntel(audit, email, todayIso) {
    const me = norm(email);
    const mine = safeAudit(audit).filter((a) => norm(a.who) === me);
    const byActMap = {};
    const days = new Set();
    const hours = Array.from({ length: M.m0 }, () => 0);
    const spark14 = Array.from({ length: M.m1 }, () => 0);
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const t = new Date(todayIso + 'T12:00:00').getTime();
    let last7 = 0;
    let prevWeek = 0;
    let today = 0;
    let lastAt = '';
    for (const a of mine) {
        byActMap[a.act] = (byActMap[a.act] ?? 0) + 1;
        days.add(dayOf(a.at));
        if (a.at > lastAt)
            lastAt = a.at;
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        if (withinDays(a.at, todayIso, 7))
            last7++;
        if (dayOf(a.at) === todayIso)
            today++;
        // שבוע-קודם + פס-14-יום — אותו חישוב-ימים דטרמיניסטי (צהריים מקומי)
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        const diff = Math.round((t - new Date(dayOf(a.at) + 'T12:00:00').getTime()) / 86400000);
        if (diff >= 7 && diff < 14)
            prevWeek++;
        if (diff >= 0 && diff < M.m1)
            spark14[M.m2 - diff]++;
        // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
        const h = Number(a.at.slice(11, 13));
        if (Number.isFinite(h) && h >= 0 && h < 24)
            hours[h]++;
    }
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const quietDays = lastAt ? Math.max(0, Math.round((t - new Date(dayOf(lastAt) + 'T12:00:00').getTime()) / 86400000)) : 99;
    const byAct = Object.entries(byActMap)
        .map(([act, n]) => ({ act, n }))
        .sort((a, b) => b.n - a.n || a.act.localeCompare(b.act, 'he'));
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const recent = [...mine].sort((a, b) => b.at.localeCompare(a.at)).slice(0, RECENT_LIMIT);
    const peak = hours.reduce((best, n, h) => (n > hours[best] ? h : best), 0);
    return {
        email,
        actions: mine.length,
        lastAt,
        daysActive: days.size,
        last7,
        today,
        byAct,
        recent,
        peakHour: mine.length ? peak : null,
        prevWeek,
        spark14,
        quietDays,
    };
}
/** מודיעין-צוות: כרטיס לכל מייל, ממוין לפי פעילות-השבוע (ואז סך-הכול). */
export function teamIntel(audit, emails, todayIso) {
    const uniq = [...new Set((Array.isArray(emails) ? emails : []).map((e) => String(e ?? '').trim()).filter(Boolean))];
    return uniq
        .map((e) => workerIntel(safeAudit(audit), e, todayIso))
        .sort((a, b) => b.last7 - a.last7 || b.actions - a.actions || a.email.localeCompare(b.email));
}
/** שורת-סיכום לצוות: סך-פעולות-השבוע + המובילה + כמה פעילים היום. */
export function teamSummary(list) {
    if (!Array.isArray(list))
        return { week: 0, activeToday: 0, top: '' }; // מגן-קלט (21.8)
    const week = list.reduce((t, w) => t + w.last7, 0);
    const activeToday = list.filter((w) => w.today > 0).length;
    const top = list.find((w) => w.last7 > 0)?.email ?? '';
    return { week, activeToday, top };
}
/** העובדות השקטות — quietDays ≥ הסף וגם לא-חדשות-לגמרי בלי כלום מעולם. */
export function quietWorkers(list, minDays = 3) {
    return list.filter((w) => w.quietDays >= minDays);
}
/**
 * 🎯 התקדמות מול יעד-שבועי: אחוז-חסום-ל-100 + סטטוס. goal≤0/חסר ⇒ null.
 */
export function goalProgress(w, goal) {
    if (!goal || goal <= 0)
        return null;
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const pct = Math.min(100, Math.round((w.last7 / goal) * 100));
    return { pct, done: w.last7 >= goal };
}
/** שורות-CSV לדוח-הצוות (שורה ראשונה = כותרות) — לייצוא דרך downloadCsv. */
export function teamCsvRows(list, goals) {
    const rows = [
        [S.k2, S.k3, S.k4, S.k5, S.k6, S.k7, S.k8, S.k9, S.k10, S.k11, S.k12],
    ];
    for (const w of list) {
        const g = goals[w.email];
        const gp = goalProgress(w, g);
        rows.push([
            w.email,
            w.actions,
            w.last7,
            w.prevWeek,
            trendOf(w),
            w.daysActive,
            w.quietDays >= M.m3 ? '' : w.quietDays,
            // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
            w.peakHour == null ? '' : String(w.peakHour).padStart(2, '0') + ':00',
            g ?? '',
            gp ? gp.pct + '%' : '',
            w.byAct[0]?.act ?? '',
        ]);
    }
    return rows;
}
/** תווית "לפני N ימים / היום / אתמול" — דטרמיניסטית מול todayIso. */
export function agoLabel(lastAt, todayIso) {
    if (!lastAt)
        return S.k13;
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const d = new Date(dayOf(lastAt) + 'T12:00:00').getTime();
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const t = new Date(todayIso + 'T12:00:00').getTime();
    // קבוע-מתמטי: יחידת-זמן/אינדקס/אחוז/חודש (מנגנון-ודאי)
    const diff = Math.round((t - d) / 86400000);
    if (diff <= 0)
        return S.k14;
    if (diff === 1)
        return S.k15;
    return `${S.k16}${diff}${S.k17}`;
}
