# חוזה · חוט write-sms-outbox
**תפקיד:** הכנסת SMS ל**תור-השליחה** של הארגון בענן (הרחבת sms) — מוסיף מסמך
לאוסף ‏smsOutbox הסקופי-לארגון; ה-Function בענן (smsOutbox, רץ כל דקה) שולח
ומעדכן סטטוס. המסמך: ‏{to, text, status:'pending', at:זמן-הכתיבה ISO}.
‏status תמיד 'pending' — האטום רק מתייק, לעולם לא שולח. כשל-הוספה = זריקה
(הקורא מחליט על כשל-רך).
**שקעים (חוק-1 — קריאות-החוץ הוזרקו כפרמטרים):**
- ‏db — מסד-הענן (במקור: ‏requireDb()).
- ‏scopedCol(name) ⇒ string — שם-אוסף ⇒ נתיב סקופי-לארגון (שכן-מודול).
- ‏fs — ערכת-Firestore: ‏{ addDoc, collection }.
(‏new Date().toISOString() — שעון-השפה, מותר לאטום; לא שקע.)
**קלט:** ‏to · text (מחרוזות) · השקעים. **פלט:** ‏Promise<void>.
**דוגמאות מחייבות** (‏fs מזויף רושם-קריאות):
1. ‏scopedCol=(c)=>'orgs/demo/'+c ⇒ ‏scopedCol נקרא עם 'smsOutbox' בדיוק,
   ‏collection נקרא פעם אחת עם ‏(db,'orgs/demo/smsOutbox'), ‏addDoc פעם אחת
   על ההפניה שהוחזרה.
2. ‏('0501234567','תזכורת: חוג מחר ב-17:00') ⇒ המסמך שנכתב מכיל בדיוק את
   ארבעת השדות: ‏to='0501234567' · text='תזכורת: חוג מחר ב-17:00' ·
   ‏status='pending' · at.
3. ‏at = זמן-הכתיבה ב-ISO: ‏Date.parse(at) תקין ונמצא בין לפני-הקריאה לאחריה.
4. ‏addDoc דוחה (Error 'permission-denied') ⇒ הפונקציה **זורקת** — לא בולעת
   (כשל-רך הוא החלטת-הקורא, כמו במקור).
**מוצא:** maor/src/lib/cloud.ts:752-759 (‏writeSmsOutbox — הרחבת sms, תור-SMS).
‏requireDb/scopedCol/addDoc/collection הפכו לשקעים (חוק-1).
