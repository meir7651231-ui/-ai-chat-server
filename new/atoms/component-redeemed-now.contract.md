# חוזה · חוט component-redeemed-now
**תפקיד:** "האם הרכיב מומש עכשיו" בשיוך-חנות. מתנת-חג נבחנת מול מופע-החג
הקרוב **פר-שנה-עברית** (תיקון swarm-audit — מתנה שנמסרה אשתקד אינה מומשת-לנצח):
כשמועברת רשימת holidays והפריט מסוג holidayGift, החג הראשון ברשימה שמסומן
כמותר על הפריט הוא המופע הנבחן; בלי רשימה, כשהפריט אינו מתנת-חג, או כשאין
חג-מותר קרוב — ההתנהגות ההיסטורית (מימוש-חי כלשהו של הרכיב).
**שקעים (חוק-1 — קריאות-השכנים הוזרקו כפרמטרים):**
- ‏itemOf(db, comp) ⇒ פריט-הקטלוג האפקטיבי של הרכיב (במקור: מצביע+דריסות, SHOP4).
- ‏holidayAllowed(item, name) ⇒ האם החג מסומן על הפריט (חגים נבחרים, הכרעה 17).
- ‏assignmentRedeemed(a, componentId, holiday?) ⇒ האם הרכיב מומש (עם holiday —
  פר-שם-חג-ושנה-עברית; בלעדיו — מימוש-חי כלשהו).
**קלט:** db · a (שיוך) · comp (רכיב) · holidays? (‏[{iso,name}] — הקרובים) ·
שלושת השקעים. **פלט:** boolean.
**דוגמאות מחייבות (שקעים מזויפים בבדיקה; הרכיב ‏{id:'c1'}):**
1. בלי holidays ⇒ מוחזר ‏assignmentRedeemed(a,'c1') בלי חג — ‏itemOf לא נקרא כלל.
2. holidays=‏[{iso:'2026-04-02',name:'פסח'}] אך ‏itemOf⇒kind:'coupon' ⇒ הנתיב
   ההיסטורי: ‏assignmentRedeemed בלי חג.
3. ‏itemOf⇒holidayGift ו-‏holidayAllowed('פסח')=true ⇒ מוחזר
   ‏assignmentRedeemed(a,'c1',{iso:'2026-04-02',name:'פסח'}) — עם מופע-החג.
4. ‏holidayGift אך ‏holidayAllowed=false לכל הרשימה ⇒ הנתיב ההיסטורי (בלי חג).
5. holidays=‏[סוכות(לא-מותר), פסח(מותר)] ⇒ נבחן מול 'פסח' — הראשון **המותר**
   ברשימה, לא הראשון סתם.
6. באותו מצב כמו 3, כשהשקע ‏assignmentRedeemed מחזיר false לחג ⇒ false
   (האטום לא ממציא מימוש — הכרעת-המימוש כולה בשקע).
**מוצא:** maor/src/components/shop/lib.ts:466-481 (‏componentRedeemedNow).
חולץ כלשונו; השכנים itemOf/holidayAllowed/assignmentRedeemed הפכו לשקעים
(חוק-1). ‏pendingCount/progressOf הפרטיות שבסביבתו — חוטים נפרדים, לא כאן.
