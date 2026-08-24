# חוזה · חוט read-org-secrets-meta
**תפקיד:** קריאת מדדי-"מוגדר" של כספת-סודות-הארגון ממסמך ‏orgSecretsMeta/{slug}
בענן — לכל מפתח-סוד רק ‏boolean "האם הוגדר" (‏{smtpUrl:true,…}); **הסודות
עצמם לא קריאים מהלקוח לעולם** (חוק-6 — הערכים חיים באוסף נפרד שה-Rules
חוסמים). ‏failure-safe מוחלט: מסמך חסר / שגיאת-Rules / רשת ⇒ ‏{} — מסך
המפתחות פשוט מציג "לא הוגדר" (בניגוד ל-read-ics-feed-token המבעבע).
המסמך מוחזר כמות-שהוא (כולל ‏updatedAt אם קיים) — הסינון-לתצוגה אצל הקורא.
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id) — הפניית-מסמך.
- ‏fs.getDoc(ref) ⇒ ‏Promise<snap> — ‏snap עם ‏exists()/data().
(שם-האוסף ‏'orgSecretsMeta' — הקבוע ORG_SECRETS_META מהמקור, מוטבע כלשונו.)
**קלט:** ‏slug · ‏fs. **פלט:** ‏Promise<object> (לעולם אובייקט — אף פעם לא
זריקה ולא null).
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. עדות-נתיב: ‏slug='kehila' ⇒ ‏doc נקרא בדיוק פעם אחת עם
   ‏(db,'orgSecretsMeta','kehila'), ו-getDoc עם ההפניה ש-doc החזיר.
2. המסמך לא קיים (‏exists()=false) ⇒ ‏{} (אובייקט ריק).
3. ‏data()={smtpUrl:true, smsApiKey:false, updatedAt:'2026-08-04T05:00:00.000Z'}
   ⇒ מוחזר האובייקט עצמו כמות-שהוא (שלושת השדות, כולל updatedAt).
4. ‏getDoc נדחה (‏reject Error('permission-denied')) ⇒ ‏{} — נבלע, לא מחלחל.
5. ‏doc זורק סינכרונית (‏Error('ענן לא אותחל')) ⇒ ‏{} — גם זה בתוך ה-try.
**מוצא:** maor/src/lib/cloudConfig.ts:158-167 (‏readOrgSecretsMeta). חולץ
כלשונו; ‏cloudDb/doc/getDoc הפכו לשקעי-fs (חוק-1).
