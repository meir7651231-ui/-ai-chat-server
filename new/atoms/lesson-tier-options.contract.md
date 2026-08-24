# חוזה · חוט lesson-tier-options
**תפקיד:** רשימת רמות-ההנחה הזמינות לחוג פר-שיעור, כאופציות-בורר
‏{v,t}: תמיד פותחת ב"מחיר מלא · ₪N" (‏v=''); כל רמה 1–3 עם מחיר truthy
מוסיפה שורה עם שם-הרמה (או ברירת-מחדל 'הנחה N') + המחיר שלה.
**קלט:** ‏c — אובייקט-חוג עם `lessonPrice`, ‏`lessonPrice1..3`,
‏`price1Name..price3Name` אופציונליים. **פלט:** מערך ‏{v:''|'1'|'2'|'3', t:string}.
**דוגמאות מחייבות:**
1. ‏{lessonPrice:100} ⇒ ‏[{v:'', t:'מחיר מלא · ₪100'}] — שורה אחת בלבד
2. ‏{} ⇒ ‏[{v:'', t:'מחיר מלא · ₪0'}] — מחיר חסר מוצג 0
3. ‏{lessonPrice:100, lessonPrice1:80, price1Name:'אח שני'} ⇒ שורה שנייה
   ‏{v:'1', t:'אח שני · ₪80'}
4. ‏{lessonPrice:100, lessonPrice2:60} ⇒ שורה שנייה ‏{v:'2', t:'הנחה 2 · ₪60'}
   — שם חסר ⇒ ברירת-מחדל
5. ‏{lessonPrice:100, lessonPrice1:80, lessonPrice2:60, lessonPrice3:40} ⇒
   4 שורות בסדר ‏''→'1'→'2'→'3'
6. ‏{lessonPrice:100, lessonPrice2:0} ⇒ שורה אחת — מחיר-רמה 0 = falsy, לא נכנס
**מוצא:** maor/src/components/courses/lib.ts:270-276 (‏lessonTierOptions),
חולץ כלשונו — אפס שקעים.
