# חוזה · חוט expiring-intakes
**תפקיד:** קליטות-מלאי מתכלות שפגו או עומדות-לפוג (SHOP10) — טהור. אצווה
נכללת כשיש לה expiry והוא ≤ אופק (היום + windowDays, ברירת-מחדל 7); בלי
expiry או מעבר-לאופק ⇒ בחוץ. expired=true רק כשה-expiry לפני היום ממש
(expiry=היום ⇒ עוד בתוקף). שם-הפריט מוצלב מ-shopItems; לא-נמצא ⇒ '—'.
הפלט ממוין עולה לפי expiry.
**שקע (חוק-1):** isoOf(date)→'YYYY-MM-DD' מקומי (במקור מ-calendar/calLib).
**קלט:** db={shopIntakes[], shopItems[]} · todayIso · isoOf · windowDays=7.
**פלט:** מערך ‎{intake, itemName, expired}‎.
**דוגמאות מחייבות (todayIso='2026-08-24' ⇒ אופק '2026-08-31';
shopItems=[{id:'a',name:'קמח'},{id:'b',name:'שמן'}]; shopIntakes=
[{id:'i1',itemId:'a',expiry:'2026-08-20',qty:5}, {id:'i2',itemId:'b',expiry:'2026-08-30',qty:2},
{id:'i3',itemId:'a',expiry:'2026-09-15'}, {id:'i4',itemId:'c'},
{id:'i5',itemId:'zz',expiry:'2026-08-25'}]):**
אורך=3 (‏i3 מעבר-לאופק, i4 בלי-expiry — בחוץ) · סדר לפי expiry:
‏[0]={intake:i1, itemName:'קמח', expired:true} ·
‏[1]={intake:i5, itemName:'—', expired:false} (פריט לא-נמצא ⇒ '—') ·
‏[2]={intake:i2, itemName:'שמן', expired:false}.
**גבולות:** expiry='2026-08-31' (=האופק) ⇒ נכלל, expired=false ·
expiry='2026-08-24' (=היום) ⇒ נכלל, expired=false · ‏windowDays=0 ⇒ אופק=היום
('2026-08-30' בחוץ, '2026-08-24' בפנים).
**מוצא:** חולץ כלשונו מ-maor/src/components/shop/lib.ts:378-397
(‏expiringIntakes; הקבוע SHOP_EXPIRY_WARN_DAYS=7 שוכן כברירת-מחדל; isoOf שוקע).
