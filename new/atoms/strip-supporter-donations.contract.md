# חוזה · חוט strip-supporter-donations
**תפקיד:** מסלול-B של סנכרון-הענן (doc-per-donation) — ריקון מערך `donations`
מכל מסמכי-התומך שב-diff (התרומות עוברות לאוסף-הנפרד). **טהור, לא מוטציה:**
מחזיר diff חדש; אוספים אחרים, meta ו-deletes עוברים כמות-שהם. במצב-כבוי
הפונקציה לא נקראת כלל (החיווט מחליט — לא האטום).
**קלט:** ‏diff — ‏{sets:[{col, id?, data}...], ...שאר-שדות} (מבנה DbDiff).
**פלט:** diff חדש — כל set של ‏col==='supporters' עם data-אובייקט מקבל
‏data חדש עם ‏donations:[]; כל השאר זהה-רפרנס.
**דוגמאות מחייבות:**
1. ‏{sets:[{col:'supporters', id:'s1', data:{name:'ראובן', donations:[{amount:100}]}}], deletes:[]}
   ⇒ ‏sets[0].data ⇒ ‏{name:'ראובן', donations:[]} — התרומות רוקנו, שאר-השדות נשמרו.
2. ‏{sets:[{col:'families', id:'f1', data:{donations:[1,2]}}]} ⇒ ללא-שינוי —
   רק אוסף supporters מטופל.
3. ‏{sets:[{col:'supporters', id:'s2', data:null}]} ⇒ ללא-שינוי — ‏data falsy
   (null) לא נוגעים בו (השמירה ‏s.data && typeof==='object').
4. שדות-אחים נשמרים: ‏{sets:[...], deletes:['x'], meta:{orgName:'א'}} ⇒
   ‏deletes ו-meta עוברים זהה-רפרנס (‏...diff).
5. אי-מוטציה: אחרי הקריאה, ה-diff המקורי עדיין מחזיק
   ‏donations:[{amount:100}] — הפלט הוא עותק.
6. תומך בלי donations כלל: ‏data:{name:'לאה'} ⇒ ‏{name:'לאה', donations:[]} —
   המפתח נוסף ריק (התנהגות-המקור: ריסוס מפורש).
**מוצא:** maor/src/lib/cloud-diff.ts:75-83 (‏stripSupporterDonations, "מסלול-B
(טהור) — מסיר את donations ממסמכי-התומך שב-diff").
