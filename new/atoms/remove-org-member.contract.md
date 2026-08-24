# חוזה · חוט remove-org-member
**תפקיד:** הסרת חבר-ארגון **אטומית** מהענן — הוצאת המייל ממערך ‏members
במסמך ‏platformOrgs/{slug} דרך ‏arrayRemove. ההסרה שולחת **שתי וריאציות**:
הצורה הגולמית (trim בלבד) והצורה המנורמלת (trim + אותיות-קטנות) — כך
רשומות-עבר לא-מנורמלות לא נתקעות ברשימה (תיקון 21.8, ממצא-נחיל: ‏arrayRemove
פועל על הערך העדכני בשרת — אין דריסת כתיבה-מקבילה כמו בדפוס-הישן שכתב
מערך מלא מ-state בזיכרון).
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id) — הפניית-מסמך.
- ‏fs.updateDoc(ref, data) ⇒ ‏Promise — העדכון.
- ‏fs.arrayRemove(...values) ⇒ סנטינל-הסרה-אטומית.
(שם-האוסף 'platformOrgs' — קבוע-המנגנון PLATFORM_ORGS מהמקור, מוטבע כלשונו.)
**קלט:** ‏slug · ‏email · ‏fs. **פלט:** ‏Promise<void> (undefined).
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ‏('kehila', '  Anat.Levi@Gmail.com ') ⇒ ‏doc נקרא פעם אחת עם
   ‏(db,'platformOrgs','kehila'), ו-arrayRemove נקרא פעם אחת עם **שני**
   ארגומנטים: ‏'Anat.Levi@Gmail.com' (גולמי-אחרי-trim) ואז
   ‏'anat.levi@gmail.com' (מנורמל) — בסדר הזה.
2. מייל כבר-מנורמל ‏'a@b.com' ⇒ שתי הווריאציות זהות ⇒ ‏arrayRemove נקרא
   עם ארגומנט **יחיד** ‏'a@b.com' (Set מאחד — אין כפילות).
3. ‏updateDoc נקרא בדיוק פעם אחת עם: ההפניה של doc · אובייקט שמפתחו היחיד
   ‏members וערכו **הסנטינל** ש-arrayRemove החזיר (לא מערך בנוי-בזיכרון).
4. הערך המוחזר (אחרי await) הוא ‏undefined.
5. ‏updateDoc שנדחה (reject 'offline') ⇒ השגיאה מבעבעת החוצה — אין בליעה.
**מוצא:** maor/src/lib/cloudConfig.ts:259-262 (‏removeOrgMember, היררכיית
ORGADMIN). שכני-firestore ו-cloudDb הפכו לשקעי-fs (חוק-1).
