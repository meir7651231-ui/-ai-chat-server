# חוזה · חוט write-mail-outbox
**תפקיד:** הכנסת מייל ל**תור-השליחה** של הארגון בענן (הרחבת mail, ROADMAP-100 ‏#1) —
מוסיף מסמך לאוסף ‏mailOutbox הסקופי-לארגון; ה-Function בענן (nodemailer) שולח
ומעדכן סטטוס. המסמך: ‏{to, subject, text, status:'pending', at:זמן-הכתיבה ISO}.
‏status תמיד 'pending' — האטום רק מתייק, לעולם לא שולח. כשל-הוספה = זריקה
(הקורא מחליט על כשל-רך).
**שקעים (חוק-1 — קריאות-החוץ הוזרקו כפרמטרים):**
- ‏db — מסד-הענן (במקור: ‏requireDb()).
- ‏scopedCol(name) ⇒ string — שם-אוסף ⇒ נתיב סקופי-לארגון (שכן-מודול).
- ‏fs — ערכת-Firestore: ‏{ addDoc, collection }.
(‏new Date().toISOString() — שעון-השפה, מותר לאטום; לא שקע.)
**קלט:** ‏to · subject · text (מחרוזות) · השקעים. **פלט:** ‏Promise<void>.
**דוגמאות מחייבות** (‏fs מזויף רושם-קריאות):
1. ‏scopedCol=(c)=>'orgs/demo/'+c ⇒ ‏scopedCol נקרא עם 'mailOutbox' בדיוק,
   ‏collection נקרא פעם אחת עם ‏(db,'orgs/demo/mailOutbox'), ‏addDoc פעם אחת
   על ההפניה שהוחזרה.
2. ‏('a@b.com','קבלה R-123','תודה על תרומתך') ⇒ המסמך שנכתב מכיל בדיוק את
   חמשת השדות: ‏to='a@b.com' · subject='קבלה R-123' · text='תודה על תרומתך' ·
   ‏status='pending' · at.
3. ‏at = זמן-הכתיבה ב-ISO: ‏Date.parse(at) תקין ונמצא בין לפני-הקריאה לאחריה.
4. ‏addDoc דוחה (Error 'permission-denied') ⇒ הפונקציה **זורקת** — לא בולעת
   (כשל-רך הוא החלטת-הקורא, כמו במקור).
**מוצא:** maor/src/lib/cloud.ts:762-771 (‏writeMailOutbox — צרור-הלילה, תור-המייל).
‏requireDb/scopedCol/addDoc/collection הפכו לשקעים (חוק-1).
