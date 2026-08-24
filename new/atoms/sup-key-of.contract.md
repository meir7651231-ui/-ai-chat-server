# חוזה · חוט sup-key-of
**תפקיד:** מפתח-הפירוק (skey) של תומך לאכיפת-הרשאה בענן — הייעוד-פר-תורם
(`forWho`) המחוטא (trim); ריק/רווחים/חסר ⇒ המפתח-המשותף (כל עובד מורשה רואה).
**שקעים (חוק-1 — הקבוע-השכן הוזרק כפרמטר):**
- ‏sharedSupKey: string — המפתח-המשותף. בחיווט-maor הערך '\_shared\_'
  (SHARED_SUP_KEY, זהה בכוונה ל-SHARED_PURPOSE_KEY של התרומות).
**קלט:** ‏sp עם ‏forWho?: string · ‏sharedSupKey. **פלט:** מחרוזת-מפתח.
**דוגמאות מחייבות (‏sharedSupKey='\_shared\_'):**
1. ‏{forWho:'אביגדור'} ⇒ 'אביגדור'.
2. ‏{forWho:'  רחל  '} ⇒ 'רחל' (חיטוי-trim).
3. ‏{forWho:''} ⇒ '\_shared\_'.
4. ‏{forWho:'   '} ⇒ '\_shared\_' (רווחים-בלבד = ריק).
5. ‏{} (‏forWho חסר) ⇒ '\_shared\_'.
6. ‏{forWho:null} ⇒ '\_shared\_' (‏?? מטפל גם ב-null).
**מוצא:** maor/src/lib/supporterPartition.ts:26-34 (‏supKeyOf) — חולץ כלשונו;
הקבוע SHARED_SUP_KEY הפך לשקע (חוק-1).
