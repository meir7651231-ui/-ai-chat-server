# חוזה · חוט delete-org-member-config
**תפקיד:** מחיקת כרטיס-העובד של מייל מהענן — הסרת המפתח ‏memberConfigs.{email}
ממסמך-הארגון ‏platformOrgs/{slug}. הרקע (ORGADMIN): ‏writeOrgCloudDoc כותב
עם ‏merge:true שממזג-עומק מפות ⇒ השמטת מפתח **לא מוחקת** אותו (הכרטיס היה
נשאר לנצח וחוזר באישור-מחדש). לכן: ‏updateDoc עם ‏FieldPath('memberConfigs',
email) ‏+ ‏deleteField() — ‏FieldPath מטפל בנקודות שבתוך המייל כמקטע-יחיד
(נתיב-נקודה 'memberConfigs.a.b@c' היה מתפרש כמפתחות מקוננים). ‏updateDoc
(לא setDoc) — המסמך תמיד קיים בזרימה הזו.
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id) — הפניית-מסמך.
- ‏fs.updateDoc(ref, fieldPath, value) ⇒ ‏Promise — העדכון הנקודתי.
- ‏fs.FieldPath — **מחלקה** (מופעלת ב-new) של נתיב-שדה רב-מקטעי.
- ‏fs.deleteField() ⇒ סנטינל-מחיקה.
(שם-האוסף 'platformOrgs' — קבוע-המנגנון PLATFORM_ORGS מהמקור, מוטבע כלשונו.)
**קלט:** ‏slug · ‏email · ‏fs. **פלט:** ‏Promise<void> (undefined).
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ‏('kehila','Anat.Levi@gmail.com') ⇒ ‏doc נקרא פעם אחת עם
   ‏(db,'platformOrgs','kehila'), ו-FieldPath נבנה פעם אחת עם **שני** מקטעים
   ‏['memberConfigs','Anat.Levi@gmail.com'] — המייל עם הנקודות = מקטע-יחיד,
   לא פוצל, לא שונה-רישיות (הנירמול אחריות-הקורא).
2. ‏updateDoc נקרא בדיוק פעם אחת עם: ההפניה של doc · מופע-FieldPath
   (instanceof) · הסנטינל ש-deleteField() החזיר.
3. ‏deleteField נקרא בדיוק פעם אחת (סנטינל טרי, לא ערך ממוחזר).
4. הערך המוחזר (אחרי await) הוא ‏undefined.
5. ‏updateDoc שנדחה (reject 'no-doc') ⇒ השגיאה מבעבעת החוצה — אין בליעה.
**מוצא:** maor/src/lib/cloudConfig.ts:233-242 (‏deleteOrgMemberConfig, ORGADMIN).
שכני-firestore ו-cloudDb הפכו לשקעי-fs (חוק-1).
