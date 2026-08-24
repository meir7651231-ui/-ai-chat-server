# חוזה · חוט hok-recorded-this-month
**תפקיד:** האם חיוב-החודש (החודש האזרחי של todayIso) של הוראת-הקבע של תומך
כבר נרשם. שלוש דרכי-הכרה, בסדר: (א) תרומה החודש בקטגוריית-הו"ק (hokCat) **או**
בסכום+מטבע מדויקים של ההוראה (מטבע-תרומה חסר ⇒ '₪'); (ב) רשומת-hist החודש
מסולק 'נדרים'/'סולה' — **בלי דרישת-סכום** (הו"ק בסכום-משתנה); (ג) נפילה:
רשומת-hist החודש בסכום+מטבע מדויקים (מקור-ישן/לגאסי). אין הו"ק (sp.hok חסר)
⇒ false תמיד.
**שקעים (חוק-1 — קבוע-שכן הוזרק כפרמטר):**
- ‏hokCat — קטגוריית-התרומה המסמנת רישום-הו"ק (במאור: הקבוע HOK_CAT = 'הו"ק').
**קלט:** ‏sp (תומך: hok?{amount,cur} · donations[{date,cat,amount,cur?}] ·
hist?[{d,clearer?,a,c?}]) · ‏todayIso (ISO yyyy-mm-dd) · השקע hokCat. **פלט:** boolean.
**דוגמאות מחייבות** (בכולן hokCat='הו"ק', todayIso='2026-08-24'):
1. ‏sp={donations:[]} בלי hok ⇒ false.
2. ‏hok={amount:100,cur:'₪'} · donations=[{date:'2026-08-05',cat:'הו"ק',amount:50}]
   ⇒ true (קטגוריה מנצחת, הסכום לא חייב להתאים).
3. ‏hok={amount:100,cur:'₪'} · donations=[{date:'2026-08-05',cat:'כללי',amount:100}]
   ⇒ true (סכום מדויק + מטבע-חסר-נופל-ל-'₪').
4. ‏hok={amount:100,cur:'₪'} · donations=[{date:'2026-07-30',cat:'הו"ק',amount:100}]
   ובלי hist ⇒ false (החיוב מחודש-קודם).
5. ‏hok={amount:100,cur:'₪'} · donations=[] · hist=[{d:'2026-08-12',clearer:'נדרים',a:37}]
   ⇒ true (חיוב-נדרים כלשהו החודש — בלי דרישת-סכום; כנ"ל clearer='סולה').
6. ‏hok={amount:100,cur:'₪'} · donations=[] · hist=[{d:'2026-08-12',a:100}]
   ⇒ true (נפילת-לגאסי: סכום מדויק, מטבע-hist חסר ⇒ '₪').
7. ‏hok={amount:100,cur:'₪'} · donations=[] · hist=[{d:'2026-08-12',a:70}]
   ⇒ false (לא נדרים/סולה וגם לא סכום-מדויק).
**מוצא:** maor/src/components/supporters/lib.ts:708-725 (‏hokRecordedThisMonth,
כולל תיקון 19.8 "חיוב-נדרים חוזר ב-hist"). HOK_CAT הפך לשקע (חוק-1).
