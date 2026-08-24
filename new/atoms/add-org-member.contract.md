# חוזה · חוט add-org-member
**תפקיד:** הוספת חבר-ארגון **אטומית** לענן — צירוף מייל מנורמל (trim +
אותיות-קטנות) למערך ‏members במסמך ‏platformOrgs/{slug} דרך ‏arrayUnion.
הרקע (תיקון 21.8, ממצא-נחיל): הדפוס הישן בנה את ‏members המלא מ-state
בזיכרון (אולי-ישן) וכתב אותו — כתיבה-מקבילה (מנהל+בעלים, שני מסכים) הייתה
מוחקת בשקט עובד/ת שאושרו במקביל (last-writer-wins). ‏arrayUnion פועל על
הערך העדכני בשרת — אין דריסה, ואין כפילות כשהמייל כבר קיים.
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id) — הפניית-מסמך.
- ‏fs.updateDoc(ref, data) ⇒ ‏Promise — העדכון.
- ‏fs.arrayUnion(value) ⇒ סנטינל-צירוף-אטומי.
(שם-האוסף 'platformOrgs' — קבוע-המנגנון PLATFORM_ORGS מהמקור, מוטבע כלשונו.)
**קלט:** ‏slug · ‏email · ‏fs. **פלט:** ‏Promise<void> (undefined).
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ‏('kehila', '  Anat.Levi@Gmail.com ') ⇒ ‏doc נקרא פעם אחת עם
   ‏(db,'platformOrgs','kehila'), ו-arrayUnion נקרא פעם אחת עם
   ‏'anat.levi@gmail.com' — **מנורמל**: trim + אותיות-קטנות (כמו approveMember
   וכהשוואת ה-Rules).
2. ‏updateDoc נקרא בדיוק פעם אחת עם: ההפניה של doc · אובייקט שמפתחו היחיד
   ‏members וערכו **הסנטינל** ש-arrayUnion החזיר (לא מערך בנוי-בזיכרון).
3. מייל כבר-מנורמל ‏'a@b.com' ⇒ ‏arrayUnion('a@b.com') — עובר כמות-שהוא.
4. הערך המוחזר (אחרי await) הוא ‏undefined.
5. ‏updateDoc שנדחה (reject 'offline') ⇒ השגיאה מבעבעת החוצה — אין בליעה.
**מוצא:** maor/src/lib/cloudConfig.ts:255-258 (‏addOrgMember, היררכיית ORGADMIN).
שכני-firestore ו-cloudDb הפכו לשקעי-fs (חוק-1).
