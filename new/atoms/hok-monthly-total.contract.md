# חוזה · חוט hok-monthly-total
**תפקיד:** סה"כ הו"ק חודשי פעיל בש"ח-שקול (ההכנסה-הקבועה) — דולר מומר בשער העריך,
הסכום הכולל מעוגל (Math.round). בלי todayIso ⇒ "פעיל" = הדגל ‏hok.active בלבד;
עם todayIso ⇒ "פעיל" דרך השקע (מנכה הו"ק-סליקה שפגה >2 חודשים בלי חיוב).
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏hokEffectivelyActive — ‏(sp, todayIso)⇒boolean (אטום-אח); נקרא **רק** כש-todayIso סופק.
**קלט:** supporters מערך · usdRate מספר · todayIso אופציונלי (+השקע). **פלט:** מספר שלם (₪).
**דוגמאות מחייבות (שקע-הדוגמה כשנדרש: ‏(sp)=>sp.hok?.kevaId!=='פג'):**
1. בלי todayIso, ‏usdRate=3.7: ‏[{hok:{active:true,amount:100,cur:'₪'}},
   ‏{hok:{active:true,amount:10,cur:'$'}}, ‏{hok:{active:false,amount:500,cur:'₪'}}] → 137
   (‏100 + 10×3.7; הלא-פעיל לא נספר).
2. עיגול: ‏[{hok:{active:true,amount:10,cur:'$'}}], ‏usdRate=3.685 → 37 (‏36.85 מעוגל).
3. ‏cur חסר ⇒ נספר כש"ח: ‏[{hok:{active:true,amount:80}}], ‏usdRate=3.7 → 80.
4. ‏[] → 0. וגם כולם-כבויים → 0.
5. עם todayIso='2026-08-24' והשקע-מהחוזה: ‏[{hok:{active:true,amount:200,cur:'₪',kevaId:'פג'}},
   ‏{hok:{active:true,amount:50,cur:'₪'}}] → 50 (הפגה מנוכה); אותה רשימה **בלי** todayIso → 250
   (בלי ניכוי — השקע לא נקרא).
**מוצא:** maor/src/components/supporters/lib.ts:736-744 (‏hokMonthlyTotal). השכן
hokEffectivelyActive הפך לשקע (חוק-1 — אפס import פנימי).
