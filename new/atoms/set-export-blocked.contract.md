# חוזה · חוט set-export-blocked
**תפקיד:** חישוב **מצב שער-יציאת-המידע** החדש (נקודת-החנק היחידה לפני כל
הורדה/הדפסה/העתקה — בקשת-בעלים 13.8 "כפתור שמבטל לעובד כל הוצאת מידע"):
דגל-חסימה + התרעת-סירוב (toast) ⇒ אובייקט-מצב חדש ‏{blocked, notify}, כאשר
התרעה חסרה מתנרמלת ל-**null** ‏(`?? null` — לא undefined).
**גלגול-המצב (חוק-5):** במקור הערכים הושמו לשני משתני-המודול ‏blocked/‏notify
שהשער (‏guardExport/‏exportAllowed) שואל; ההשמה היא **חיווט-קופסה** — האטום
רק מחשב את ערך-המצב. ברירת-המחדל הבטוחה ‏blocked=false ("חוזה-הדגלים נשמר:
חסר=מותר, רק false בכרטיס-העובד חוסם") שייכת אף היא לקופסה.
**קלט:** ‏isBlocked (boolean) · ‏onBlocked (‏(()=>void) | undefined | null —
אופציונלי). **פלט:** ‏{blocked, notify} — אובייקט חדש; ‏notify = הפונקציה
עצמה (זהות-הפניה) או ‏null.
**דוגמאות מחייבות:**
1. ‏(true, spy) ⇒ ‏{blocked:true, notify:spy} — ההתרעה עוברת **בזהות-הפניה**
   (אותה פונקציה בדיוק), ואינה נקראת (אפס קריאות — הקריאה שייכת ל-guardExport).
2. ‏(false, undefined) ⇒ ‏{blocked:false, notify:null} — התרעה חסרה מתנרמלת
   ל-null.
3. ‏(true, undefined) ⇒ ‏{blocked:true, notify:null} — חסימה בלי toast תקפה.
4. ‏(false, null) ⇒ ‏{blocked:false, notify:null} — ‏null נשאר ‏null ‏(`?? null`).
5. שתי קריאות זהות ⇒ אובייקטים **שונים בהפניה**, שווים בתוכן (אין מצב משותף
   שדולף בין קריאות); בכל פלט בדיוק שני מפתחות — ‏blocked+‏notify.
**מוצא:** maor/src/lib/exportGate.ts:19-24 (‏setExportBlocked — "נקבע מ-App לפי
הקונפיג-האפקטיבי; onBlocked אופציונלי מריץ toast בסירוב"). ההשמה לשני
משתני-המודול עברה לקופסה; הצד-השואל כבר קודם (‏export-allowed · ‏guard-export).
