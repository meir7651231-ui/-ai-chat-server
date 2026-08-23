/** 🪨 טיוטת-חוט (דרגת-מחצבה) · supporterPurposes — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/supporters/lib.ts:36-54 (19 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): supporterPurposes
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function supporterPurposes(sup) {
    const set = new Set();
    const fw = (sup.forWho ?? '').trim();
    if (fw)
        set.add(fw);
    for (const d of sup.donations ?? []) {
        const p = (d.purpose ?? '').trim();
        if (p)
            set.add(p);
    }
    return [...set];
}
/**
 * האם התורם גלוי לעובד/ת עם רשימת-ייעודים מותרת. allowed=null ⇒ הכל.
 * הכרעת-בעלים 16.8 (#8, "דרך א׳" — יישור-מסך-לשרת): ראוּת-התורם נקבעת אך-ורק
 * לפי הייעוד-פר-תורם (`forWho`) — **זהה בדיוק ל-skey שהשרת אוכף**. תורם בלי
 * forWho = משותף (גלוי לכל, כמו `skey='_shared_'`). הייעוד-פר-תרומה (`purpose`)
 * אינו קובע ראוּת-תורם — הוא מסנן תרומות בנפרד (כמו `pkey` בשרת, ב-
 * `visibleSupportersForDesignations`) — כך המסך והשרת לעולם לא חלוקים.
 */
