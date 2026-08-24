# חוזה · חוט hok-due
**תפקיד:** התומכים שהו"ק-החודש שלהם טרם נרשמה — מסונן (פעיל-אפקטיבית וטרם-נרשם)
וממוין לפי יום-החיוב (‏hok.day; חסר ⇒ 0, כלומר ראשון).
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏hokEffectivelyActive — ‏(sp, todayIso)⇒boolean (הו"ק-סליקה שפגה לא נספרת; אטום-אח).
- ‏hokRecordedThisMonth — ‏(sp, todayIso)⇒boolean (חיוב-החודש כבר נרשם; אטום-אח).
**קלט:** supporters מערך · todayIso (+2 השקעים). **פלט:** מערך-תומכים חדש, מסונן+ממוין.
**דוגמאות מחייבות (todayIso='2026-08-24'; שקעי-הדוגמה: ‏active=(sp)=>!!sp.hok?.active ·
‏recorded=(sp)=>!!sp.rec):**
1. ‏A={hok:{active:true,day:20}} · ‏B={hok:{active:true,day:5}} · ‏C={hok:{active:false,day:1}}
   ⇒ ‏[A,B,C] → ‏[B,A] (הלא-פעיל נופל; מיון עולה לפי יום-החיוב).
2. אותם A,B אבל ‏B.rec=true → ‏[A] (מי שנרשם החודש לא "ממתין").
3. ‏D={hok:{active:true}} (בלי day) עם A ⇒ ‏[A,D] → ‏[D,A] (חסר-day ⇒ 0 ⇒ ראשון).
4. ‏[] → ‏[] (ריק בטוח).
5. מערך-הקלט לא משתנה: אחרי הקריאה ‏[A,B,C] נשאר בסדרו המקורי (filter יוצר עותק — המיון על העותק).
**מוצא:** maor/src/components/supporters/lib.ts:728-732 (‏hokDue). השכנים
hokEffectivelyActive + hokRecordedThisMonth הפכו לשקעים (חוק-1 — אפס import פנימי).
