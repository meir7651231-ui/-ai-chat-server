# חוזה · חוט needs-care-shop
**תפקיד:** רשימת-הטיפול המרוכזת של מודול-החנות: סורק את ה-DB ומחזיר מערך
התרעות-לפעולה בסדר קבוע — ‏[holidayDue…, meetingPending…, couponPending…,
couponExpired…, מלאי (stockOut/restock/waitingRestocked)…, expiring…].
כל התרעה: ‏{kind, assignmentId, componentId, label, hint}. תצוגה-בלבד,
אפס כתיבה ל-DB. התרעות-תפוגה מגודרות ‏shop.expiry (בלי config ⇒ ביט-זהה, דולקות).
**שקעים (חוק-1 — כל השכנים הוזרקו כאובייקט-sockets רביעי):**
- ‏upcomingHolidays(todayIso, days) ⇒ ‏[{iso,name}] — חגים בחלון.
- ‏itemRemaining(db, itemId) ⇒ number|null — נותר בפריט (null=בלי-מעקב).
- ‏componentRemaining(compId, productId, assignments, stock) ⇒ number|null — מלאי-רכיב טרום-מיגרציה.
- ‏beneficiaryLabel(db, a, config) ⇒ string — שם-הזכאי לשיוך.
- ‏itemOf(db, comp) ⇒ פריט-אפקטיבי ‏{kind,name,…} של רכיב.
- ‏holidayAllowed(item, holidayName) ⇒ boolean — חג מסומן על הפריט (הכרעה 17).
- ‏assignmentRedeemed(a, compId, holiday?) ⇒ boolean — כבר מומש.
- ‏couponExpiry(a, item) ⇒ IsoDate|'' — תוקף-קופון.
- ‏featureOn(config, flag) ⇒ boolean — שער-הדגלים (‏'shop.expiry').
- ‏expiringIntakes(db, todayIso) ⇒ ‏[{intake:{itemId,expiry,qty}, itemName, expired}].
- ‏shopHolidayDueDays — חלון-החגים בימים (במקור: הקבוע SHOP_HOLIDAY_DUE_DAYS=30).
**קלט:** ‏db (shopItems/shopProducts/shopAssignments) · todayIso · config|undefined · sockets.
**פלט:** מערך-התרעות בסדר-הקבוע לעיל.
**דוגמאות מחייבות** (שקעי-בדיקה דטרמיניסטיים):
1. פריט פעיל עם ‏itemRemaining=0 ⇒ התרעה יחידה ‏{kind:'stockOut',
   label:'סוכר — המלאי אזל', hint:'לחדש מלאי או לעדכן את הפריט', componentId:'i1'}.
2. פריט עם ‏minStock=5 ו-‏rem=2 ⇒ ‏{kind:'restock', label:'סוכר — המלאי נמוך',
   hint:'להצטייד: נותרו 2 מתחת ל-5'}.
3. פריט עם ‏waits=['f1','f2'] ו-‏rem=null (בלי-מעקב≠0) ⇒ ‏{kind:'waitingRestocked',
   label:'2 ממתינים לסוכר'} — במלאי 0 ההתרעה לא נפלטת.
4. שיוך פעיל עם רכיב-קופון לא-ממומש שתוקפו ‏'2026-01-01' < היום ‏'2026-08-24' ⇒
   ‏{kind:'couponExpired', hint:'הקופון פג בתוקף ב-2026-01-01 וטרם מומש'};
   בלי-תוקף ⇒ ‏{kind:'couponPending', hint:'קופון טרם מומש'}.
5. רכיב-פגישה לא-ממומש ⇒ ‏{kind:'meetingPending', label:'משפ׳ לוי — פגישה',
   hint:'פגישת ליווי טרם התקיימה'}; שיוך שאינו ‏active ⇒ אפס התרעות.
6. מתנת-חג: חג ‏{name:'ראש השנה', iso:'2026-09-12'} מותר-על-הפריט ולא-מומש ⇒
   ‏{kind:'holidayDue', hint:'ראש השנה ב-2026-09-12 — טרם נמסרה'} — והוא **ראשון**
   במערך (לפני פגישות/קופונים/מלאי).
7. ‏config עם ‏featureOn⇒false ל-‏'shop.expiry' ⇒ אפס התרעות-expiring גם כש-
   ‏expiringIntakes מחזיר אצווה; ‏config=undefined ⇒ ההתרעה נפלטת
   ‏{kind:'expiring', label:'חלב — פג תוקף', hint:'פג ב-2026-08-20 · אצווה 4 יח׳'}.
**מוצא:** maor/src/components/shop/lib.ts:249-374 (‏needsCare — SHOP2/6/10,
כולל תיקון-swarm-audit לגידור-התפוגה). כל הקריאות-לשכנים הפכו לשקעים.
