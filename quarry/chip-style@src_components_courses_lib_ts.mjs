/** 🪨 טיוטת-חוט (דרגת-מחצבה) · chipStyle — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:432-452 (21 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): chipStyle
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function chipStyle(bg, c) {
    return {
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        background: bg,
        color: c,
        whiteSpace: 'nowrap',
    };
}
/* ── סינון שיבוץ חכם (P1.7, feature courses.enroll.smartfilter) — הכרעה 3:
   היכולת הדטרמיניסטית של אשף הלגאסי (התאמת חוג לפי גיל/מגדר/יום) נכנסת דרך
   סינון רך בזרימת השיבוץ + מתג "הצג הכל" + אזהרת התנגשות לו"ז — לא כ-UI אשף. ── */
/** האם החוג מתאים לפי מגדר וגיל — נתון חסר אינו מסנן (סינון רך, לא חוסם). */
/* ---------- טווח כיתות (P2 פער 28, feature courses.gradeimg) ---------- */
/** סולם הכיתות — גן ואז א׳–י"ב. */
