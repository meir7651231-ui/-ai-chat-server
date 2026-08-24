# חוזה · חוט write-org-lead
**תפקיד:** כתיבת ליד "נחזור אליכם" — **בלי חשבון** — לאוסף-הפלטפורמה
‏platformLeads עם **מזהה-אוטומטי** (‏addDoc, לא setDoc — אין uid; כל שליחה =
מסמך חדש). האוסף create-only ציבורי (Rules: allow create בלבד; קריאה
למיילי-על) — לכידת-ליד בטוחה: איש לא קורא/מונה את הלידים חוץ מהבעלים.
הליד עובר **עיקור-JSON** (מפיל ‏undefined, מנתק הפניה מה-state).
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.collection(db, col) — הפניית-אוסף.
- ‏fs.addDoc(colRef, data) ⇒ ‏Promise — הכתיבה עם מזהה-אוטומטי.
(שם-האוסף 'platformLeads' — קבוע-הסכמה PLATFORM_LEADS מהמקור, מוטבע כלשונו.)
**קלט:** ‏lead (‏{contactName?,phone?,preferredTime?,notes?,at?}) · ‏fs.
**פלט:** ‏Promise<void> (undefined — גם ההפניה ש-addDoc מחזיר לא מוחזרת).
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. עדות-נתיב: ‏collection נקרא בדיוק פעם אחת עם ‏(db,'platformLeads') —
   אוסף-שורש, בלי slug — ו-addDoc עם ההפניה ש-collection החזיר.
2. ‏lead={contactName:'דוד', phone:'0521112223', preferredTime:'ערב'} ⇒
   הנכתב ‏deep-equal ל-lead אך ‏!== ממנו (עיקור-JSON מנתק הפניה).
3. עיקור-undefined: ‏lead={phone:'0501234567', notes:undefined} ⇒ נכתב
   ‏{phone:'0501234567'} — המפתח ‏notes לא קיים כלל.
4. הערך המוחזר (אחרי await) הוא ‏undefined — גם כש-addDoc מחזיר הפניית-מסמך.
5. ‏addDoc שנדחה (reject 'unavailable') ⇒ השגיאה מבעבעת — אין בליעה
   (ה-CallbackModal מציג כשל-שליחה).
**מוצא:** maor/src/lib/cloudConfig.ts:317-324 (‏writeOrgLead, SIGNUP מיתוג 3).
‏cloudDb/collection/addDoc הפכו לשקעי-fs (חוק-1).
