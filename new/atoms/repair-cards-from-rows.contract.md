# חוזה · חוט repair-cards-from-rows
**תפקיד:** ריפוי-כרטיסים רטרואקטיבי מרשומות-ספק-סליקה (טהור): לכל כרטיס-תומך
שמחזיק ב-hist עסקאות של הספק — (א) **תיקון תווית-הסליקה**: רשומת-hist שמפתחה
(‏txn ואם-ריק ‏ref, אחרי trim) נמצא ברשומות-הספק ותוויתה ‏clearer שונה מ-label
⇒ מקבלת ‏clearer=label (נספר ב-relabeled); (ב) **מילוי-אם-ריק**: כל רשומת-ספק
תואמת מוזרמת דרך שקע-המילוי על הכרטיס (כרטיס שהשקע שינה נספר פעם-אחת
ב-enriched). אינדקס-הרשומות: מפתח = ‏txnId ואם-ריק ‏reference (trim);
**המופע הראשון גובר** בכפילות-מפתח. אידמפוטנטי — הרצה שנייה ⇒ ‏0/0.
אימוטבילי: כרטיס שלא נגעו בו חוזר **באותה הפניה**; רשומות בלי מפתח ⇒ אין-קלט
⇒ החזרה מיידית של אותו מערך.
**שקעים (חוק-1 — קריאת-שכן הוזרקה כפרמטר):**
- ‏fillCardFromCharge(sp, row) ⇒ ‏Supporter — מילוי-אם-ריק של פרטי-קשר
  מהעסקה; מחזיר את **אותה הפניה** כשאין מה למלא (זה המנגנון שמאחוריו
  ספירת-enriched עובדת).
**קלט:** ‏supporters (מערך ‏{hist?: [{txn?, ref?, clearer?, …}], …}) · ‏rows
(מערך ‏{txnId?, reference?, …}) · ‏label (מחרוזת) · שקע-המילוי.
**פלט:** ‏{supporters, relabeled: number, enriched: number}.
**דוגמאות מחייבות** (בכולן ‏fill=(sp,row)=>row.phone&&!(sp.phone||'').trim()?{...sp,phone:row.phone}:sp):
1. תיוג-מחדש: ‏supporters=[{id:'s1',hist:[{txn:'T1',clearer:'נדרים'}]}] ·
   ‏rows=[{txnId:'T1'}] · ‏label='סולה' ⇒ ‏relabeled=1 · ‏enriched=0 ·
   ‏hist[0].clearer==='סולה'.
2. אידמפוטנטיות: הרצת הפלט של דוגמה 1 שוב באותם rows/label ⇒ ‏relabeled=0 ·
   ‏enriched=0, והכרטיס חוזר **באותה הפניה** (לא שוכתב).
3. העשרה: ‏supporters=[{id:'s1',phone:'',hist:[{txn:'T1',clearer:'סולה'}]}] ·
   ‏rows=[{txnId:'T1',phone:'0501234567'}] · ‏label='סולה' ⇒ ‏relabeled=0 ·
   ‏enriched=1 · ‏phone==='0501234567'.
4. נפילת-מפתח ל-ref/reference: ‏hist=[{ref:'R9',clearer:'x'}] ·
   ‏rows=[{txnId:'',reference:'R9'}] · ‏label='סולה' ⇒ ‏relabeled=1.
5. רשומות בלי מפתח: ‏rows=[{txnId:'',reference:''}] ⇒
   ‏{supporters,relabeled:0,enriched:0} והמערך המוחזר === המערך הנכנס.
6. כפילות-מפתח — הראשון גובר: ‏rows=[{txnId:'T1',phone:'050'},{txnId:'T1',phone:'052'}]
   על כרטיס בלי-טלפון עם ‏{txn:'T1',clearer:'סולה'} ⇒ ‏phone==='050' (המופע
   הראשון), ‏enriched=1.
7. כרטיס לא-קשור (‏hist בלי מפתח תואם, או בלי hist) חוזר באותה הפניה.
**מוצא:** maor/src/lib/nedarimSync.ts:367-404 (‏repairCardsFromRows — ריפוי
23.8, "שם יכנס לשם, טלפון לטלפון"). השכן fillCardFromCharge הפך לשקע (חוק-1).
