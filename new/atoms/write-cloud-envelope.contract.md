# חוזה · חוט write-cloud-envelope
**תפקיד:** כתיבת ה-envelope (ה-DEK העטוף — הפעלת הצפנת-ענן, פעולת-בעלים) למסמך
‏`_enc/envelope` בתחום-הארגון. **לא failure-safe במכוון:** כשל-כתיבה = זריקה —
בניגוד ל-readCloudEnvelope הבולע (הבעלים חייב לדעת שההפעלה נכשלה).
המעטפה נכתבת **כלשונה** (אותו אובייקט, בלי עיבוד).
**שקעים (חוק-1 — קריאות-החוץ הוזרקו כפרמטרים):**
- ‏db — מסד-הענן (במקור: ‏requireDb()).
- ‏scopedEnv() ⇒ string — נתיב מסמך-ה-envelope בתחום-הארגון (במקור: שכן-מודול
  על envPath(slug, cloudRoot)).
- ‏fs — ערכת-Firestore: ‏{ setDoc, doc }.
**קלט:** ‏env (EncEnvelope — ‏{$enc:2, …}) · השקעים. **פלט:** ‏Promise<void>.
**דוגמאות מחייבות** (‏fs מזויף רושם-קריאות):
1. ‏scopedEnv=()=>'orgs/demo/_enc/envelope' ⇒ ‏scopedEnv נקרא, ‏doc נקרא פעם אחת
   עם ‏(db,'orgs/demo/_enc/envelope'), ו-setDoc נקרא פעם אחת עם ההפניה שהוחזרה.
2. ‏setDoc מקבל **בדיוק** את env (אותה הפניה — ‏{$enc:2, wrapped:'AAA=', salt:'BBB='}
   נכתב כלשונו, בלי עותק/שינוי).
3. ההבטחה נפתרת רק אחרי ש-setDoc נפתר (await אמיתי).
4. ‏setDoc דוחה (Error 'permission-denied') ⇒ הפונקציה **זורקת** — לא בולעת
   (פעולת-בעלים, בניגוד ל-read הבולע).
**מוצא:** maor/src/lib/cloud.ts:471-473 (‏writeCloudEnvelope — הצפנת-ענן, חצי ב׳).
‏requireDb/scopedEnv/setDoc/doc הפכו לשקעים (חוק-1).
