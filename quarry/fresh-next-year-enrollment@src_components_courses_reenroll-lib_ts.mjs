/** 🪨 טיוטת-חוט (דרגת-מחצבה) · freshNextYearEnrollment — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/reenroll-lib.ts:207-242 (36 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): freshNextYearEnrollment
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function freshNextYearEnrollment(src, targetCourseId, newId, todayIso, groupOverride) {
    return {
        id: newId,
        memberId: src.memberId,
        courseId: targetCourseId,
        plan: src.plan,
        purchased: 0,
        used: 0,
        // ‏groupOverride: מנהל-העבודה בחר קבוצה ברישום. undefined ⇒ אותה קבוצה של אשתקד.
        group: groupOverride ?? src.group,
        absences: [],
        payments: [],
        totalDue: src.totalDue,
        dueDate: '',
        status: 'active',
        note: '',
        enrolledAt: todayIso,
        // תמחור משוקלל — נשמר כדי שהמחיר יעבור לשנה הבאה כמו שהיה.
        ...(src.freq !== undefined ? { freq: src.freq } : {}),
        ...(src.freqUnit !== undefined ? { freqUnit: src.freqUnit } : {}),
        ...(src.term !== undefined ? { term: src.term } : {}),
        ...(src.termMonths !== undefined ? { termMonths: src.termMonths } : {}),
        ...(src.tier !== undefined ? { tier: src.tier } : {}),
    };
}
/**
 * טיוטת-חוג טהורה לשנה הבאה — עותק של החוג עם תאריכים מוזזים בשנה, תווית-שנה
 * וקישור-לחוג-הקודם. ה-id מוזרק מבחוץ. שומר את ההיסטוריה (החוג הישן לא נגע).
 */
