# חוזה · חוט write-org-secrets
**תפקיד:** כתיבת כספת-המפתחות פר-ארגון (בקשת-בעלים 9.8: "כל מנהל יש את
הסודות שלו") — כתיבה **דו-מסמכית** ב-merge: ‏orgSecrets/{slug} = הערכים
עצמם (Rules: מנהל כותב, **איש לא קורא מהדפדפן** — read:false, רק
functions ב-Admin-SDK) · ‏orgSecretsMeta/{slug} = מדדי-"מוגדר ✓" בוליאניים
בלבד + ‏updatedAt. סמנטיקת-patch: מפתח שנשלח עם ערך מלא ⇒ נשמר (אחרי
trim); ‏'' (או null/undefined שנשלח מפורשות) ⇒ **נמחק** מהכספת
(‏deleteField) והמטא ‏false; מפתח שלא נשלח ⇒ לא נגוע. **allowlist:** רק
מפתחות מרשימת-הסודות המוכרת נכנסים — כל השאר נזרק; patch בלי אף מפתח
מוכר ⇒ **אפס כתיבות**. חוק-6: הסודות עצמם הם קונפיגורציית-הצבה שעוברת
דרך הפרמטרים — אין סוד מוטבע באטום.
**שקעים (חוק-1):**
- ‏keys — רשימת-המפתחות המוכרת (במקור: הקבוע-השכן ‏ORG_SECRET_KEYS —
  קודם כאטום ‏org-secret-keys; החיווט בקופסה).
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id) — הפניית-מסמך.
- ‏fs.setDoc(ref, data, opts) ⇒ ‏Promise — הכתיבה.
- ‏fs.deleteField() ⇒ סנטינל-מחיקת-שדה של Firestore.
(‏'orgSecrets' / 'orgSecretsMeta' — קבועי-הסכמה מהמקור, מוטבעים כלשונם.)
**קלט:** ‏slug · ‏patch (אובייקט חלקי מפתח⇒מחרוזת) · ‏keys · ‏fs.
**פלט:** ‏Promise<void> (undefined).
**דוגמאות מחייבות** (‏keys=['yemotToken','nedarimMosad','nedarimApiPass','smsApiKey','smtpUrl','solaXKey']; שקעים מזויפים רושמי-קריאות):
1. ‏patch={smtpUrl:' smtp://u:p@h '} ⇒ שתי כתיבות בסדר הזה: ‏doc ראשון
   ‏(db,'orgSecrets','kehila') עם ‏{smtpUrl:'smtp://u:p@h'} (trim!) ואופציות
   ‏{merge:true}; ‏doc שני ‏(db,'orgSecretsMeta','kehila') עם
   ‏{smtpUrl:true, updatedAt:<ISO>} ו-merge:true.
2. מחיקה: ‏patch={smsApiKey:''} ⇒ בכספת ‏smsApiKey=**הסנטינל ש-deleteField
   החזיר**; במטא ‏smsApiKey:false.
3. ‏null נשלח-מפורשות: ‏patch={yemotToken:null} ⇒ כמו '' — סנטינל-מחיקה
   בכספת ו-false במטא (‏?? '' ואז trim).
4. allowlist: ‏patch={hack:'evil', smtpUrl:'x'} ⇒ ‏hack לא מופיע באף כתיבה;
   רק ‏smtpUrl נכתב. מפתח מוכר שלא נשלח (למשל solaXKey) לא מופיע כלל —
   לא נגוע.
5. אפס-כתיבות: ‏patch={} וגם ‏patch={hack:'evil'} ⇒ ‏setDoc לא נקרא כלל
   (0 קריאות) והפלט undefined.
6. ‏updatedAt במטא הוא מחרוזת-ISO (‏new Date().toISOString() —
   ‏YYYY-MM-DDTHH:mm:ss.sssZ), והמטא לא מכיל את ערכי-הסודות עצמם.
7. ‏setDoc של הכספת נדחה (reject 'permission-denied') ⇒ השגיאה מבעבעת
   וכתיבת-המטא לא מתרחשת (סדר: כספת קודם).
**מוצא:** maor/src/lib/cloudConfig.ts:141-155 (‏writeOrgSecrets, כספת 9.8).
‏ORG_SECRET_KEYS ⇒ שקע keys · ‏cloudDb/doc/setDoc/deleteField ⇒ שקעי-fs (חוק-1).
