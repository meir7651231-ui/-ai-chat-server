# חוזה · חוט read-cloud-envelope
**תפקיד:** קריאת מעטפת-ההצפנה (ה-DEK העטוף) ממסמך `_enc/envelope` בענן.
**failure-safe מוחלט:** כל שגיאה (Rules לא מתירים `_enc`, רשת, ענן-לא-אותחל) ⇒
‏null ⇒ הקורא ממשיך בנתיב plaintext — הוספת הבדיקה לזרימת-החיבור אינה יכולה
לשבור את הלקוח החי. ‏null = אין הצפנה בארגון. ולידציה רזה: רק אובייקט עם
‏$enc===2 מוחזר; פורמט זר ⇒ null.
**שקעים (חוק-1 — קריאות-החוץ הוזרקו כפרמטרים):**
- ‏db — מסד-הענן (במקור: ‏requireDb()).
- ‏scopedEnv() ⇒ string — נתיב מסמך-המעטפה הסקופי-לארגון.
- ‏fs — ערכת-Firestore: ‏{ getDoc, doc } (‏getDoc אסינכרוני; ‏snap עם
  ‏exists()/data()).
**קלט:** השקעים בלבד. **פלט:** ‏Promise<envelope | null>.
**דוגמאות מחייבות** (בכולן ‏fs מזויף שמתעד קריאות):
1. עדות-נתיב: ‏scopedEnv=()=>'orgs/demo/_enc/envelope' ⇒ ‏doc נקרא בדיוק עם
   ‏(db, 'orgs/demo/_enc/envelope') ו-getDoc עם הערך ש-doc החזיר.
2. המסמך לא קיים (‏exists()=false) ⇒ ‏null.
3. מעטפה תקינה ‏data()={$enc:2, wrapPin:'W1', salt:'S'} ⇒ מוחזר האובייקט עצמו
   (אותן שלוש שדות, ‏$enc===2).
4. פורמט זר ‏data()={$enc:1, wrap:'X'} ⇒ ‏null (מתעלמים).
5. ‏data() מחזיר ‏null (לא-אובייקט) ⇒ ‏null.
6. ‏getDoc זורק ‏Error('permission-denied') ⇒ ‏null — נבלע, לא מחלחל (failure-safe).
**מוצא:** maor/src/lib/cloud.ts:458-470 (‏readCloudEnvelope — הצפנת-ענן, שער
‏needUnlock). חולץ כלשונו; ‏requireDb/scopedEnv/getDoc/doc הפכו לשקעים (חוק-1).
