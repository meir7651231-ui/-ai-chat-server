# חוזה · חוט is-junk-contact
**תפקיד:** כרטיס-vCard שאין טעם לייבא: בלי שם (גם רווחים-בלבד), או שכל
הטלפונים קצרים-מדי (מספרי-מערכת/חירום כמו 100/101/102 — פחות מ-5 ספרות)
**וגם** אין אף מייל. שם + טלפון-אמיתי או מייל ⇒ נשמר.
**שקעים (חוק-1 — קריאת-שכן הוזרקה כפרמטר):**
- ‏digitsOnly(s) — מחלץ ספרות-בלבד ממחרוזת (בקוד-המקור:
  ‏(s||'').replace(/\D/g,'')).
**קלט:** ‏c — ‏{fullName: string, phones: {value:string}[], emails: any[]} ·
שקע-digitsOnly. **פלט:** boolean (true = זבל, לא לייבא).
**דוגמאות מחייבות** (בכולן ‏dig=(s)=>(s||'').replace(/\D/g,'')):
1. ‏{fullName:'', phones:[{value:'03-6123456'}], emails:[]} ⇒ true — בלי שם.
2. ‏{fullName:'   ', phones:[], emails:[]} ⇒ true — שם רווחים-בלבד (trim).
3. ‏{fullName:'מוקד חירום', phones:[{value:'100'}], emails:[]} ⇒ true —
   טלפון 3 ספרות בלבד ואין מייל.
4. ‏{fullName:'ישראל כהן', phones:[{value:'050-1234567'}], emails:[]} ⇒ false —
   טלפון אמיתי (10 ספרות ≥ 5).
5. ‏{fullName:'דנה לוי', phones:[], emails:['dana@x.co.il']} ⇒ false —
   אין טלפון אך יש מייל.
6. ‏{fullName:'קו קצר', phones:[{value:'1-23-45'}], emails:[]} ⇒ false —
   ‏digitsOnly ⇒ '12345' = בדיוק 5 ספרות (סף ה->=5 עובר).
**מוצא:** maor/src/lib/vcardImport.ts:229-235 (‏isJunkContact, ייבוא אנשי-קשר
VCF של ורטיקל-הסטודיו). השכן digitsOnly הפך לשקע (חוק-1).
