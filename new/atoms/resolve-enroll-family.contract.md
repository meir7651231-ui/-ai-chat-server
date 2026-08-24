# חוזה · חוט resolve-enroll-family
**תפקיד:** פתרון המשפחה לשיבוץ-חדש בטופס-החוגים: בחירת id קיים ⇒ הקיימת;
הסנטינל '__new' (ENROLL_NEW_FAMILY, מיוצא מהאטום) + שם לא-ריק ⇒ דה-דופ לפי
נרמול-שם — שם שכבר קיים משתמש בקיימת (create=false), אחרת יש ליצור חדשה
(‏fam=null, create=true). כל מקרה אחר (id לא-מוכר, '__new' עם שם-ריק) ⇒
‏{fam:null, create:false}.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏normName(s) ⇒ מחרוזת — נרמול-שם להשוואת-כפילויות (במקור: ‏normNameLocal =
  ‏normSearch עברי + הסרת כל הרווחים; למשל 'כהן-לוי ' ו'כהןלוי' שווים).
**קלט:** ‏families — מערך ‏{id, name, …} · ‏famSel — id נבחר או '__new' ·
‏newFamName — שם למשפחה חדשה · השקע normName.
**פלט:** ‏{fam: המשפחה או null, create: boolean}.
**דוגמאות מחייבות** (‏F=[{id:'f1',name:'כהן'},{id:'f2',name:'לוי-מזרחי'}] ·
‏normName-בדיקה = ‏lowercase + הסרת רווחים ומקפים):
1. ‏(F,'f2','') ⇒ ‏{fam:F[1], create:false} — id קיים מנצח, השם לא נבדק.
2. ‏(F,'__new','לוי מזרחי') ⇒ ‏{fam:F[1], create:false} — דה-דופ: הרווח מול
   המקף מתאחדים בנרמול; לא נוצרת כפילות.
3. ‏(F,'__new','אברהם') ⇒ ‏{fam:null, create:true} — שם חדש באמת.
4. ‏(F,'__new','   ') ⇒ ‏{fam:null, create:false} — שם-ריק אחרי trim לא יוצר.
5. ‏(F,'f9','אברהם') ⇒ ‏{fam:null, create:false} — id לא-מוכר שאינו '__new'.
6. ‏([], '__new','כהן') ⇒ ‏{fam:null, create:true} — רשימה ריקה: תמיד יצירה.
**מוצא:** maor/src/components/courses/lib.ts:540-559 (‏resolveEnrollFamily;
הסנטינל ENROLL_NEW_FAMILY='__new' משורה 523 — הוטמע ומיוצא). ‏normNameLocal
היה helper פרטי באותו קובץ — הפך לשקע (חוק-1).
