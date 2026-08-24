# חוזה · קופסת-חיבורים "מודול-החנות" (shop)

**תפקיד:** מחווטת את 31 חוטי-מודול-החנות לכדי ה-API של העמודה. מקור-האמת:
`maor/src/components/shop/lib.ts` — כל טענה כאן מעוגנת בשורת-מקור (דיבר 11).
זהו המקום היחיד שבו חוטי-החנות נפגשים (חוקי-החשמלאי).

**שקעים חוצי-מודול (הכרעת-הקופסה):**
- מיובאים כאטומים ומחווטים בפנים: `termOf` · `dateInRange` · `hebParts` · `isoLocal` (=`isoOf`).
- מוזרקים כשקעי-פרמטר (מנוע-קופסה-שכנה שלוח-האם מספק כבר-מחווט): `holidayOf`
  (לוח-עברי) · `smartFilter` (חיפוש) · `featureOn` (קונפיג).
- שקעי-IO אמיתיים: אין (המנוע טהור מהמקור).

## חשיפה (עוגני-מקור)
- `liveRedemptions(a)` — מימושים לא-מבוטלים (lib.ts:25). re-export ישיר.
- `itemOf(db,comp)` — פענוח רכיב→פריט+דריסות (lib.ts:49).
- `holidayAllowed(ri,name)` — חג רלוונטי (ריק=הכול) (lib.ts:79).
- `itemRemaining(db,itemId)` — מלאי-פריט פחות מימושים-חיים (lib.ts:87; liveRedemptions מחווט).
- `effectivePrice(basePrice,critIds,criteria)` — מחיר אחרי הנחה-גבוהה (lib.ts:109; maxDiscountPct מחווט).
- `maxDiscountPct(critIds,criteria)` — ההנחה הגבוהה 0..100 (lib.ts:116). re-export ישיר.
- `upcomingHolidays(fromIso,days,holidayOf)` — חגים בטווח (lib.ts:131; holidayOf מוזרק, isoOf מחווט).
- `holidayNames(holidayOf)` — כל שמות-החגים (lib.ts:153; holidayOf מוזרק).
- `assignmentRedeemed(a,componentId,holiday)` — מומש? מתנת-חג פר-שנה-עברית (lib.ts:180; liveRedemptions+hebYearOf מחווטים).
- `componentRemaining(componentId,productId,assignments,stock)` — מלאי-רכיב (lib.ts:200; liveRedemptions מחווט).
- `couponExpiry(a,comp)` — פקיעת-קופון או '' (lib.ts:221; isoOf מחווט).
- `SHOP_HOLIDAY_DUE_DAYS`=30 (lib.ts:239) · `SHOP_EXPIRY_WARN_DAYS`=7 (lib.ts:375). re-export.
- `needsCare(db,todayIso,config,holidayOf,featureOn)` — רשימת-הטיפול (lib.ts:249; holidayOf+featureOn מוזרקים, 11 שקעים מחווטים).
- `expiringIntakes(db,todayIso,windowDays)` — קליטות-מתכלות (lib.ts:378; isoOf מחווט).
- `upcomingMeetings(db,todayIso,days,config)` — פגישות-קרובות (lib.ts:406; isoOf+beneficiaryLabel מחווטים).
- `givenValue(a)` / `collectedPaid(a)` / `subsidyTotal(a)` — סכומים (lib.ts:433/440/447; liveRedemptions מחווט).
- `productAssignments(assignments,productId)` — שיוכי-מוצר (lib.ts:452). re-export.
- `componentRedeemedNow(db,a,comp,holidays)` — מומש-עכשיו (lib.ts:466; itemOf/holidayAllowed/assignmentRedeemed מחווטים).
- `filterAssignments(db,q,status,pendingOnly,productId,sort,todayIso,holidayOf,smartFilter)` — סינון+מיון (lib.ts:504; pendingCount/progressOf/upcomingHolidays מחווטים, holidayOf+smartFilter מוזרקים).
- `filterProducts(products,q,onlyActive,smartFilter)` (lib.ts:538) · `filterItems(db,q,stockState,smartFilter)` (lib.ts:551; itemRemaining מחווט) · `filterRedemptions(a,from,to,includeVoided)` (lib.ts:565; dateInRange מחווט).
- `intakeLog(db)` — יומן-קליטות+סה"כ (lib.ts:588). re-export.
- `eligibleFamilies(db,critIds,excludeProductId)` — משפחות-זכאיות (lib.ts:610). re-export.
- `distributionListLines(db,productId,config)` — רשימת-חלוקה (lib.ts:627; itemOf+beneficiaryLabel מחווטים).
- `redemptionsCsvRows(db,config)` — CSV-מימושים, מבוטל-מסומן (lib.ts:656; beneficiaryLabel+itemOf מחווטים).
- `beneficiaryLabel(db,a,config)` — "משפחת X — בן" (lib.ts:681; termOf מחווט).
- `componentCounts(p)` — ספירת-רכיבים לפי-סוג (lib.ts:691). re-export.

## הכרעות-חיווט חיות-בקופסה
- **כלל-הצהריים ל-hebYearOf**: `hebParts(new Date(iso+'T12:00:00')).year` (lib.ts:171-173).
- **סדר-הקדימות ב-needsCare**: `[...due, ...meetings, ...coupons, ...expired, ...stock, ...expiring]` (lib.ts:371).
- **מיון-ממתינים**: יש-רכיב-ממתין קודם, ובתוכם `since` עולה (lib.ts:525-529).
- **holidayOf/featureOn/smartFilter מוזרקים** — הקופסה לא מרכיבה קופסה-אחרת.

## דוגמאות מחייבות (מספריות — מוכחות ב-shop.test.mjs)
1. `liveRedemptions` על שיוך עם מימוש-חי אחד ומימוש-מבוטל אחד ⇒ אורך 1.
2. `maxDiscountPct(['c1','c2'], [{id:'c1',discountPct:10},{id:'c2',discountPct:25}])` ⇒ 25 (הגבוה).
3. `effectivePrice(100, ['c2'], [{id:'c2',discountPct:25}])` ⇒ 75.
4. `subsidyTotal` על שיוך value=100/paid=30 ⇒ 70; אחרי ביטול-המימוש ⇒ 0.
5. `itemRemaining` פריט stock=5, מימוש-חי אחד המצביע עליו ⇒ 4; מימוש מבוטל אינו נספר.
6. `beneficiaryLabel` בלי config ⇒ "משפחת <שם>"; עם `terms['entity.familyOf']='בית'` ⇒ "בית <שם>".
7. `couponExpiry` since='2026-08-01' validDays=10 ⇒ '2026-08-11'; בלי validDays ⇒ ''.
8. `upcomingHolidays('2026-08-01', 45, holidayOf)` עם holidayOf-מוזרק שמחזיר 'X' ב-3.8 ⇒ פריט {iso:'2026-08-03',name:'X'} יחיד (חג-כפול מנוכה).
9. `filterProducts` עם smartFilter-מוזרק (זהות) ⇒ מסנן onlyActive.
10. `needsCare` שיוך-active עם רכיב-קופון שפקע ⇒ פריט kind:'couponExpired'; עם featureOn-מוזרק שמחזיר false ל-'shop.expiry' ⇒ אפס פריטי-'expiring'.
