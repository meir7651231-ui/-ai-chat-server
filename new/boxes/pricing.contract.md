# חוזה · קופסת-חיבורים pricing (lib-pricing)

**תפקיד:** מחווטת את מנוע-התמחור המלא של המטמיע — טבלת-מחירי-ברירת-מחדל,
נירמול טבלה-לא-אמינה, חישוב הצעת-מחיר, עיצוב-שקל, ותוויות-גודל — ממימושי-האטומים
הטהורים. ההכרעות (מילון-מחירי-ההרחבות, מפתח-האחסון) חיות בקופסה; שקעי-ה-IO
(localStorage) מוזרקים כפרמטרים ולא ממומשים.

**מוצא (מקור-האמת, L4):** `maor/src/lib/pricing.ts` — גרף-הקריאות המלא.

## אטומים מחווטים
- `defaultPrices` ← `atoms/default-prices.mjs` (מקור pricing.ts:57-74)
- `SIZE_LABELS` ← `atoms/size-labels.mjs` (מקור pricing.ts:76-80)
- `normalizePrices` ← `atoms/normalize-prices.mjs` (מקור pricing.ts:122-146)
- `computeQuote` ← `atoms/compute-quote.mjs` (מקור pricing.ts:152-185)
- `shekel` ← `atoms/shekel.mjs` (מקור pricing.ts:188-190)
- `ALL_MODULES` ← `atoms/all-modules.mjs` (מקור platform/lib.ts:39)

## הכרעות-הקופסה (חיות בקוד-הקופסה, verbatim מהמקור)
- `DEFAULT_INTEGRATION_PRICES` — מילון 12 מחירי-הרחבות (pricing.ts:36-49):
  `receipts:60·payments:90·whatsapp:50·sms:40·phone:90·gcal:30·drive:30·sheets:40·maps:40·esign:60·ai:120·campaign:60`.
- `PRICES_LS_KEY = 'maor_prices'` — מפתח-האחסון המקומי (pricing.ts:192).

## שקעי-IO (פרמטרים-מוזרקים — לא מימוש)
- `readPrices(getItem)` — `getItem(key)⇒string|null` (במקור `localStorage.getItem`, pricing.ts:197).
- `writePrices(setItem, p)` — `setItem(key,value)⇒void` (במקור `localStorage.setItem`, pricing.ts:207).

## חשיפה (exports)
- `DEFAULT_PRICES` — טבלת-ברירת-המחדל המלאה = `defaultPrices(DEFAULT_INTEGRATION_PRICES)`.
- `sizeLabels` — מיפוי גודל⇒תווית-עברית.
- `shekel(n)` — עיצוב-שקל.
- `normalize(raw)` — נירמול טבלה-לא-אמינה לטבלה-מלאה.
- `quote(cfg, size, prices, nameOf, addons=[], mode='subscription')` — הצעת-מחיר מלאה.
- `readPrices(getItem)` · `writePrices(setItem, p)` — קריאה/כתיבה מקומית.

## דוגמאות מחייבות

### DEFAULT_PRICES (pricing.ts:57-74)
1. `DEFAULT_PRICES.base` ⇒ `290` · `DEFAULT_PRICES.setup` ⇒ `1500`.
2. `DEFAULT_PRICES.modules` — 9 מפתחות: `families:0·calendar:0·courses:120·diary:70·supporters:180·reports:60·tzedaka:90·shop:90·shop7:80`.
3. `DEFAULT_PRICES.sizeMult` ⇒ `{small:1, medium:1.6, large:2.4}`.
4. `DEFAULT_PRICES.enterprise` ⇒ `{oneTime:55000, annualMaintenance:9000}`.
5. `DEFAULT_PRICES.integrations.ai` ⇒ `120` · `.receipts` ⇒ `60` (12 מפתחות).

### sizeLabels (pricing.ts:76-80)
6. `sizeLabels` ⇒ `{small:'קטן', medium:'בינוני', large:'גדול'}`.

### shekel (pricing.ts:188-190)
7. `shekel(470)` ⇒ `'₪470'` · `shekel(1024)` ⇒ `'₪1,024'` · `shekel(0)` ⇒ `'₪0'`.
8. `shekel('אבג')` ⇒ `'₪NaN'` (קלט לא-מספרי).

### normalize (pricing.ts:122-146)
9. `normalize(null)` ⇒ הטבלה המלאה מברירות-המחדל (זהה ל-DEFAULT_PRICES).
10. `normalize({base:-5}).base` ⇒ `290` (שלילי נדחה) · `normalize({base:350}).base` ⇒ `350`.
11. `normalize({modules:{courses:0}}).modules.courses` ⇒ `0` (אפס חוקי).
12. `normalize({base:'100'}).base` ⇒ `290` (מחרוזת נדחית).
13. `normalize({modules:{shop:999, junk:5}}).modules` — אין מפתח `junk` (מפתח-זר נזרק); `shop` ⇒ `999`.
14. `normalize({integrations:{whatsapp:70, junk:5}}).integrations` — `whatsapp:70`, `ai:120` (ברירת-מחדל), אין `junk`.

### quote (pricing.ts:152-185; nameOf = m⇒m)
15. `quote({modules:{courses:false}}, 'small', DEFAULT_PRICES, m=>m)`:
    - `lines` = כל המודולים-הדלוקים עם מחיר>0 (courses מוסר, families/calendar כלולים במחיר 0).
    - `included` מכיל את `families`/`calendar` (מחיר 0).
    - `base` ⇒ `290` · `sizeMult` ⇒ `1`.
    - `monthly` ⇒ `round((290 + modulesSubtotal) × 1)`.
    - `firstPayment` ⇒ `monthly + 1500` · `yearly` ⇒ `monthly × 12` · `yearlyDiscounted` ⇒ `monthly × 10`.
16. `quote({}, 'medium', DEFAULT_PRICES, m=>m, [{key:'whatsapp',label:'וואטסאפ'}])`:
    - `lines` כולל שורת-הרחבה `whatsapp@50` עם `kind:'integration'` · `sizeMult` ⇒ `1.6`.
17. `quote({}, 'huge', DEFAULT_PRICES, m=>m)` — גודל לא-מוכר ⇒ `sizeMult` ⇒ `1` (נפילה).
18. הרחבה בלי מחיר בטבלה (`key:'zzz'`) ⇒ מחירה 0 ⇒ **לא** נכנסת ל-`lines`.
19. `mode='enterprise'` נשמר ב-`quote.mode`; `enterpriseOneTime`/`enterpriseAnnual` = העברה מהטבלה.

### readPrices / writePrices (שקעי-IO; pricing.ts:194-211)
20. `readPrices(() => null)` ⇒ עותק של `DEFAULT_PRICES` (אין ערך שמור).
21. `readPrices(() => JSON.stringify({base:350}))` ⇒ טבלה מנורמלת עם `base:350` (שאר-השדות מברירת-מחדל).
22. `readPrices(() => 'לא-JSON-תקין')` ⇒ עותק של `DEFAULT_PRICES` (try/catch).
23. `writePrices(setItem, p)` קורא ל-`setItem('maor_prices', JSON.stringify(p))`; שקע-שזורק ⇒ נבלע חרש (אין throw).
24. round-trip: `writePrices(store.set, p)` ואז `readPrices(store.get)` ⇒ טבלה שוות-ערך ל-`normalize(p)`.
