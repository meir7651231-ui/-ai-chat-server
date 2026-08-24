# חוזה · חוט clear-employee-field
**תפקיד:** מחיקת שדה-יחיד מכרטיס-העובד בענן — הסרת המפתח
‏memberConfigs.{email}.{field} ממסמך-הארגון ‏platformOrgs/{slug}.
הרקע (תיקון 21.8, ממצא-נחיל): ‏setDoc(merge:true) ממזג-עומק מפות ⇒
‏`delete next.weeklyGoal` ואז כתיבה **לא מוחקת** את השדה בענן — יעד 40 היה
חוזר לנצח אחרי שהמנהל איפס ל-0. לכן: ‏updateDoc עם
‏FieldPath('memberConfigs', email, field) ‏+ ‏deleteField() — ‏FieldPath
מטפל בנקודות שבתוך המייל כמקטע-יחיד (נתיב-נקודה היה מתפרש כמפתחות
מקוננים). ‏updateDoc (לא setDoc) — המסמך תמיד קיים בזרימה הזו.
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id) — הפניית-מסמך.
- ‏fs.updateDoc(ref, fieldPath, value) ⇒ ‏Promise — העדכון הנקודתי.
- ‏fs.FieldPath — **מחלקה** (מופעלת ב-new) של נתיב-שדה רב-מקטעי.
- ‏fs.deleteField() ⇒ סנטינל-מחיקה.
(שם-האוסף 'platformOrgs' — קבוע-המנגנון PLATFORM_ORGS מהמקור, מוטבע כלשונו.)
**קלט:** ‏slug · ‏email · ‏field · ‏fs. **פלט:** ‏Promise<void> (undefined).
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ‏('kehila','Anat.Levi@gmail.com','weeklyGoal') ⇒ ‏doc נקרא פעם אחת עם
   ‏(db,'platformOrgs','kehila'), ו-FieldPath נבנה פעם אחת עם **שלושה**
   מקטעים ‏['memberConfigs','Anat.Levi@gmail.com','weeklyGoal'] — המייל עם
   הנקודות = מקטע-יחיד, לא פוצל, לא שונה-רישיות (הנירמול אחריות-הקורא).
2. ‏updateDoc נקרא בדיוק פעם אחת עם: ההפניה של doc · מופע-FieldPath
   (instanceof) · הסנטינל ש-deleteField() החזיר.
3. ‏deleteField נקרא בדיוק פעם אחת (סנטינל טרי, לא ערך ממוחזר).
4. הערך המוחזר (אחרי await) הוא ‏undefined.
5. ‏updateDoc שנדחה (reject 'no-doc') ⇒ השגיאה מבעבעת החוצה — אין בליעה.
**מוצא:** maor/src/lib/cloudConfig.ts:243-254 (‏clearEmployeeField, ORGADMIN —
אותו דפוס כמו deleteOrgMemberConfig, עמוק מקטע-אחד).
שכני-firestore ו-cloudDb הפכו לשקעי-fs (חוק-1).
