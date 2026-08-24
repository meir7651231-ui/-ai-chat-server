# חוזה · חוט merge-donations-preserving
**תפקיד:** מיזוג-תרומות חסין-אובדן בסנכרון-ענן (בקשת-בעלים 19.8 — "תרומות לא
מסונכרנות"): "הענן מנצח" ברמת-המסמך היה דורס תרומה שנרשמה רק-מקומית. הפתרון —
איחוד לפי ‏rid (מזהה-הקבלה): הענן מנצח על ‏rid שבשני הצדדים, תרומה מקומית-בלבד
(עם ‏rid) מצורפת לסוף; מונים סקלריים ‏count/ils/usd לא-יורדים (‏max — "מונים
רק עולים"; לא-מספר/לא-סופי ⇒ 0). חל **רק** על אוסף ‏'supporters'; אחרת מוחזר
המסמך המרוחק כמות-שהוא. אין-מה-לשמר (אפס מקומיות-בלבד והמונים לא גדלו) ⇒
מוחזר ‏incoming **באותה הפניה**. טהור, לא משנה קלט.
**קלט:** ‏col (שם-אוסף) · ‏local (מסמך מקומי) · ‏incoming (מסמך מהענן).
**פלט:** המסמך הממוזג.
**דוגמאות מחייבות:**
1. ‏col='families' ⇒ מוחזר ‏incoming עצמו (‏===) — החוט חל רק על supporters.
2. שימור מקומית-בלבד: ‏local={donations:[{rid:'R-1',ils:100},{rid:'R-2',ils:50}],count:2,ils:150,usd:0} ·
   ‏incoming={donations:[{rid:'R-1',ils:100}],count:1,ils:100,usd:0} ⇒
   ‏donations=[R-1 (גרסת-הענן), R-2] · ‏count=2 · ‏ils=150 · ‏usd=0.
3. זהים לגמרי: ‏local ו-incoming עם אותו ‏{donations:[{rid:'R-1'}],count:1,ils:100} ⇒
   מוחזר ‏incoming באותה הפניה (‏===) — אפס-שכתוב מיותר.
4. תרומה מקומית **בלי rid** אינה משתמרת: ‏local={donations:[{ils:5}],count:0,ils:0} ·
   ‏incoming={donations:[],count:0,ils:0} ⇒ ‏incoming עצמו (‏===).
5. מונים רק עולים גם בלי תרומות-לשימור: ‏local={donations:[],count:3,ils:0,usd:0} ·
   ‏incoming={donations:[{rid:'R-9'}],count:1,ils:0,usd:0} ⇒
   ‏{donations:[{rid:'R-9'}], count:3, ils:0, usd:0}.
6. מונה לא-מספרי ⇒ 0: ‏incoming.count='7' (מחרוזת) · ‏local.count=2 ⇒ ‏count=2.
7. עריכת-ענן על rid משותף מנצחת: ‏local R-1 עם ‏ils:100 · ‏incoming R-1 עם
   ‏ils:120 (‏count/ils שווים) ⇒ ברשימה גרסת-הענן ‏{rid:'R-1',ils:120} בלבד.
**מוצא:** maor/src/lib/cloud-merge.ts:51-71 (‏mergeDonationsPreserving —
סנכרון Firestore, עקבי עם אינווריאנט "מונים רק עולים"). אפס שכנים — חוט עצמאי.
