# חוזה · חוט write-org-request
**תפקיד:** כתיבת בקשת-הרשמה ממתינה — ‏platformRequests/{uid} — **המסמך היחיד
שנרשם-חדש רשאי לכתוב** (Rules v2: uid==auth.uid; האכיפה בענן, לא כאן).
הכתיבה **מלאה, בלי merge** — שליחה-חוזרת (ריפוי-עצמי של בקשה שאבדה)
מחליפה את המסמך. הבקשה עוברת **עיקור-JSON** (מפיל ‏undefined — כולל שדות-
פרופיל-האשף שלא מולאו — ומנתק הפניה מה-state).
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id) — הפניית-מסמך.
- ‏fs.setDoc(ref, data) ⇒ ‏Promise — הכתיבה.
(שם-האוסף 'platformRequests' — קבוע-הסכמה PLATFORM_REQUESTS מהמקור, מוטבע כלשונו.)
**קלט:** ‏uid · ‏req (‏{orgName?,contactName?,phone?,email?,at?,industry?,size?,needs?}) · ‏fs.
**פלט:** ‏Promise<void> (undefined).
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. עדות-נתיב: ‏('U1',{orgName:'מאור'}) ⇒ ‏doc נקרא בדיוק פעם אחת עם
   ‏(db,'platformRequests','U1'), ו-setDoc עם ההפניה ש-doc החזיר.
2. **בלי merge:** ‏setDoc נקרא עם **שני ארגומנטים בדיוק** (ref, data) —
   החלפת-מסמך מלאה (ריפוי-עצמי, לא הצטברות).
3. פרופיל-אשף מלא: ‏req={orgName:'מאור', industry:'studio', size:'small',
   needs:['crm','receipts']} ⇒ הנכתב ‏deep-equal ל-req (כולל המערך needs)
   אך ‏!== ממנו (עיקור-JSON מנתק הפניה).
4. עיקור-undefined: ‏req={phone:'0501234567', industry:undefined} ⇒ נכתב
   ‏{phone:'0501234567'} — המפתח ‏industry לא קיים כלל (נפילת-5-שדות-בסיס
   של הכתיבה-העמידה נשארת מסמך נקי).
5. ‏setDoc שנדחה (reject 'permission-denied') ⇒ השגיאה מבעבעת — אין בליעה
   (מסך-ההמתנה מציג reqStatus כשל).
**מוצא:** maor/src/lib/cloudConfig.ts:172-175 (‏writeOrgRequest, CLOUD2/SIGNUP3).
‏cloudDb/doc/setDoc הפכו לשקעי-fs (חוק-1).
