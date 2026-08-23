/** 🪨 טיוטת-חוט (דרגת-מחצבה) · resolveEnrollFamily — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:540-559 (20 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): normNameLocal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function resolveEnrollFamily(families, famSel, newFamName) {
    const existing = families.find((f) => f.id === famSel);
    if (existing)
        return { fam: existing, create: false };
    if (famSel === ENROLL_NEW_FAMILY && newFamName.trim()) {
        const dup = families.find((f) => normNameLocal(f.name) === normNameLocal(newFamName));
        if (dup)
            return { fam: dup, create: false };
        return { fam: null, create: true };
    }
    return { fam: null, create: false };
}
/* ── punchConfirm (P1.3, feature courses.punch.confirm) — אישור כפול לניקוב ──
   ratchet: legacy-main-script.js:330-342 (punch) — לחיצה ראשונה מזיינת
   ("לאשר ניקוב?"), timeout ‏3 שניות מפרק את הזריון; לחיצה שנייה על אותו שיבוץ
   בתוך החלון מבצעת. לחיצה על שיבוץ אחר מזיינת אותו מחדש. דגל כבוי = ביצוע מיידי. */
