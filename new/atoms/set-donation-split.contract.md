# חוזה · חוט set-donation-split
**תפקיד:** חישוב ערך **מצב-הפיצול** החדש של סנכרון-התרומות (מסלול-B, דגל-אב
off-by-default, מגודר גם מ-cloudRoot): הדגל הנכנס עובר **כמות-שהוא** — הוא
הערך שהצד-הדוחף ישאל דרך ‏donationSplitActive לפני push.
**גלגול-המצב (חוק-5):** במקור הערך הושם למשתנה-המודול ‏splitOn (שנקבע
מ-connectCloud לפי ‏donationSplitOn(config)); ההשמה היא **חיווט-קופסה** —
האטום רק מחשב (מעביר) את הערך החדש. ברירת-המחדל הבטוחה ‏splitOn=false
("אף קוד לא מדליק ⇒ ביט-זהה להיום") שייכת אף היא לקופסה.
**קלט:** ‏on — boolean. **פלט:** אותו boolean — ערך-המצב החדש.
**דוגמאות מחייבות:**
1. ‏setDonationSplit(true) ⇒ ‏true — הפיצול הודלק (הצד-הדוחף יתחיל לשאול).
2. ‏setDonationSplit(false) ⇒ ‏false — כיבוי מפורש (זהה לברירת-המחדל של הקופסה).
3. הערך עובר **כמות-שהוא, בלי כפייה** (בקוד-המקור ההשמה verbatim; טיפוס-boolean
   מובטח ב-TS אצל הקורא): ‏setDonationSplit(true)===true ו-typeof הפלט 'boolean'
   כששולחים boolean.
4. דטרמיניסטי וחסר-מצב: שתי קריאות ‏setDonationSplit(true) מחזירות אותו ערך —
   אין דבר שדולף בין קריאות.
**מוצא:** maor/src/lib/cloud.ts:100-103 (‏setDonationSplit — נקבע מ-connectCloud
לפי ‏donationSplitOn(config)). ההשמה למשתנה-המודול עברה לקופסה.
