# חוזה · חוט write-org-cloud-doc
**תפקיד:** כתיבת מסמך-ארגון בפלטפורמה — ‏platformOrgs/{slug} — עם
‏merge:true = **עדכון חלקי** (שדות שלא נשלחו לא נגועים; זהו הבסיס של
"מתג בלוח-הבקרה ⇒ הלקוח רואה חי"). הנתונים עוברים **עיקור-JSON**
(‏JSON.parse(JSON.stringify(data))) לפני הכתיבה — Firestore דוחה ‏undefined
ופונקציות; הסבב מפיל אותם ומנתק את ההפניה מה-state שבזיכרון.
לוח-הבקרה = מיילי-על בלבד לפי Rules (אכיפה בענן, לא כאן).
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id) — הפניית-מסמך.
- ‏fs.setDoc(ref, data, opts) ⇒ ‏Promise — הכתיבה.
(שם-האוסף 'platformOrgs' — קבוע-הסכמה PLATFORM_ORGS מהמקור, מוטבע כלשונו.)
**קלט:** ‏slug · ‏data (אובייקט חלקי של מסמך-הארגון) · ‏fs.
**פלט:** ‏Promise<void> (undefined).
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. עדות-נתיב: ‏slug='kehila' ⇒ ‏doc נקרא בדיוק פעם אחת עם
   ‏(db,'platformOrgs','kehila'), ו-setDoc עם ההפניה ש-doc החזיר.
2. ‏data={joinOpen:true, joinCode:'X7'} ⇒ ‏setDoc מקבל **עותק שווה-ערך אך לא
   אותה הפניה** (‏deep-equal, ‏!== — עיקור-JSON מנתק מה-state).
3. עיקור-undefined: ‏data={orgName:'מאור', manager:undefined} ⇒ הנכתב הוא
   ‏{orgName:'מאור'} בלבד — המפתח ‏manager לא קיים בו כלל.
4. ‏merge:true תמיד: הארגומנט השלישי של setDoc הוא ‏{merge:true} — גם
   לאובייקט ריק ‏{} (עדכון-ריק חוקי, לא דריסת-מסמך).
5. ‏setDoc שנדחה (reject 'permission-denied') ⇒ השגיאה מבעבעת — אין בליעה.
**מוצא:** maor/src/lib/cloudConfig.ts:120-123 (‏writeOrgCloudDoc, CLOUD2).
‏cloudDb/doc/setDoc הפכו לשקעי-fs (חוק-1).
