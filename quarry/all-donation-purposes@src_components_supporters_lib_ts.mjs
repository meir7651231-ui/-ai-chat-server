/** 🪨 טיוטת-חוט (דרגת-מחצבה) · allDonationPurposes — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:94-105 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): allDonationPurposes, supporterPurposes
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function allDonationPurposes(supporters) {
    const set = new Set();
    for (const s of supporters)
        for (const p of supporterPurposes(s))
            set.add(p);
    return [...set].sort((a, b) => a.localeCompare(b));
}
/* ── הכרעת-בעלים 9.8 ("לכולל", סוגרת את ‎#14): הצבירה המוצגת של תורם כוללת
   גם את הקובץ ההיסטורי (hist — עסקאות-סליקה/לגאסי ללא קבלה). המונים השמורים
   (count/ils/usd) נשארים קבלות-בלבד — אינווריאנט הענן "מונים רק עולים" לא
   נגוע; הכללה = נגזרת טהורה. הדוח-השנתי-לתורם נשאר קבלות-בלבד (מסמך-מס). ── */
/** סה"כ ₪ כולל היסטוריה. */
