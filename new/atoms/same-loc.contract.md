# חוזה · חוט same-loc
**תפקיד:** השוואת שני מיקומי-ניווט (ניווט-אחורה P1.5, feature shell.navhist):
זהים ⇔ שלושת השדות ‏view · selFamilyId · selCourseId שווים (===). מעבר
לאותו מיקום אינו נרשם כצעד-היסטוריה — זו בדיקת-הזהות שמונעת זאת.
**קלט:** ‏a, b — אובייקטי-מיקום ‏{view, selFamilyId, selCourseId}.
**פלט:** ‏boolean.
**דוגמאות מחייבות:**
1. ‏{view:'families', selFamilyId:'f1', selCourseId:null} מול עותק-זהה ⇒ true.
2. ‏view שונה ('families' מול 'courses'), שאר השדות זהים ⇒ false.
3. ‏selFamilyId שונה ('f1' מול 'f2') ⇒ false; ‏null מול 'f1' ⇒ false.
4. ‏selCourseId שונה (null מול 'c1') ⇒ false.
5. שדות-נוספים מחוץ לשלושה אינם משפיעים: ‏{view:'home', selFamilyId:null,
   selCourseId:null, scroll:99} מול אותו-מיקום עם ‏scroll:0 ⇒ true.
**מוצא:** maor/src/lib/navhist.ts:23-27 (‏sameLoc). טהור — אפס שקעים.
