# חוזה · חוט filter-assignments
**תפקיד:** סינון+מיון שיוכי-החנות (‏db.shopAssignments): סינון status (ריק=הכול)
⇒ סינון productId (ריק=הכול) ⇒ ‏pendingOnly (רק שיוכים עם רכיב-ממתין) ⇒ חיפוש
q דרך שקע-smartFilter (מונחים: שם-המשפחה · כל מילה משם-המשפחה בנפרד ·
שם-החבילה) ⇒ מיון לפי sort:
- ‏'pending' — יש-רכיב-ממתין קודם, ובתוכם ‏since עולה (הכי-ותיק-ממתין ראשון;
  ‏since ריק ⇒ '9999' וצף לסוף קבוצתו); ממומש-כולו אחרון.
- ‏'name' — שם-המשפחה, ‏localeCompare עברית עולה.
- ‏'progress' — התקדמות-המימוש עולה (שקע-progressOf).
‏todayIso (רשות, swarm-audit): ניתן ⇒ ‏holidays=upcomingHolidays(todayIso,
SHOP_HOLIDAY_DUE_DAYS) ומושחל לכל קריאות pendingCount/progressOf (דין מתנת-החג
פר-שנה-עברית); חסר ⇒ ‏undefined — ההתנהגות ההיסטורית.
**שקעים (חוק-1 — קריאות-שכן הוזרקו):**
- ‏upcomingHolidays(fromIso, days) ⇒ ‏{iso,name}[] — החגים הקרובים.
- ‏SHOP_HOLIDAY_DUE_DAYS — חלון-ימי-החג (האטום shop-holiday-due-days; במקור 30).
- ‏pendingCount(db, a, holidays) ⇒ ‏number — כמה רכיבים בשיוך עדיין ממתינים.
- ‏smartFilter(q, list, getTerms) ⇒ ‏list — חיפוש-חכם (האטום smart-filter;
  ‏q ריק ⇒ עותק-הכול).
- ‏progressOf(db, a, holidays) ⇒ ‏0..1 — התקדמות-המימוש.
**קלט:** ‏db{shopAssignments,families,shopProducts} · q · status ('' | ערך) ·
pendingOnly · productId ('' | id) · sort ('pending'|'name'|'progress') ·
todayIso? · חמשת השקעים. **פלט:** ‏ShopAssignment[].
**דוגמאות מחייבות** (‏db: משפחות f1='משפחת פרץ', f2='משפחת גל', f3='משפחת כהן';
חבילות p1='חבילת פסח', p2='חבילת חורף'; שיוכים a1{f1,p1,active,since:'2026-01-01'} ·
a2{f2,p1,active,since:'2026-03-01'} · a3{f3,p2,done,since:'2026-02-01'};
שקעים: ‏pendingCount⇒{a1:1,a2:2,a3:0} · ‏progressOf⇒{a1:0.5,a2:0,a3:1} ·
‏smartFilter=עותק כש-q ריק / הכלה-במונח אחרת · ‏SHOP_HOLIDAY_DUE_DAYS=30):
1. הכול-פתוח, sort='pending' ⇒ ‏['a1','a2','a3'] — ממתינים לפי since עולה,
   ממומש-כולו (a3) אחרון.
2. ‏status='active' ⇒ ‏['a1','a2'].
3. ‏productId='p2' ⇒ ‏['a3'].
4. ‏pendingOnly=true ⇒ ‏['a1','a2'] (‏a3 עם 0 ממתינים נופל).
5. ‏sort='name' ⇒ ‏['a2','a3','a1'] (גל < כהן < פרץ).
6. ‏sort='progress' ⇒ ‏['a2','a1','a3'] (0 < 0.5 < 1).
7. ‏q='חורף' (שקע-ההכלה, מונח שם-החבילה) ⇒ ‏['a3'];
   וב-‏pendingOnly=true עם ‏todayIso='2026-03-20' ⇒ ‏upcomingHolidays נקרא
   עם ('2026-03-20', 30) ותוצאתו מושחלת כלשונה (===) ל-pendingCount
   (⇒ ‏['a1','a2']); בלי todayIso ⇒ ‏undefined.
**מוצא:** maor/src/components/shop/lib.ts:504-537 (‏filterAssignments, UX סינון 2
+ תיקון swarm-audit). חמש קריאות-השכן שוקעו (חוק-1).
