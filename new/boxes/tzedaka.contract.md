# חוזה · קופסת-חיבורים "tzedaka" (מודול קופות-הצדקה)

**תפקיד:** קופסת-החיווט של מנוע קופות-הצדקה. כל 19 החוטים של
`maor-system/src/components/tzedaka/lib.ts` נפגשים כאן במקום אחד: ניקוד-
גיימיפיקציה, סכומים, רשימת-הטיפול, לוח-מובילים ומבצעים, חיפוש/סינון/מיון,
תדפיס-שטח, ייצוא-CSV וגריד-הלוח-הייעודי. מייבאת אך-ורק אטומים (חוק-2).

**מקור-אמת (L4):** `maor-system/src/components/tzedaka/lib.ts` — עוגני-שורה בכל חוט למטה.

## הכרעות-הקופסה (חיות כאן, לא באטומים)
- **isoOf = isoLocal** — במקור `isoOf` מ-calLib.ts:30-32 מאציל ל-`isoLocal`
  (date-util.ts:14-17). הקופסה מכנה את האטום `iso-local` בתפקיד `isoOf`.
- **coordinatorLastCollection** (מקור lib.ts:161-168) — עזר-פרטי שלא-יוצא במקור;
  ההרכב `coordinatorBoxes ⊕ lastCollectionIso` + השוואת `>` על מחרוזות-ISO
  ('' ראשון) הוא הכרעת-חיווט. משמש את מיון-`stale` ב-filterCoordinators.
- **ברירות-מחדל (פיגמנט מהמקור):** `collectionScoreDelta` — `rules=TZ_SCORE_RULES`;
  `staleBoxes` — `days=TZ_STALE_DAYS` (90).
- **סדר-הבינדינג** של שקעי-כל-חוט (איזה אטום ממלא איזה שקע) — לפי גרף-הקריאות במקור.

## שקעי-מנוע חוצי-קופסה (חוק-3 — מוזרקים מלוח-האם, לא נגזרים כאן)
- `smartFilter(q, items, getTerms) ⇒ items` — מנוע קופסת-החיפוש. פרמטר-שקע
  ב-`filterCoordinators` וב-`boxesOverview` (במקור: import מ-lib/search.ts:13).
- `buildMonthGrid(events, anchorIso, hebMode) ⇒ grid` — מנוע קופסת-הלוח-העברי.
  פרמטר-שקע ב-`buildTzGrid` (במקור: import מ-lib/monthGrid.ts:12).
> נגזרים-כאן (אטומים עצמאיים): `termOf` · `dateInRange` · `isoOf`.

## חשיפה + דוגמאות מחייבות

### קבועים
- `TZ_SCORE_RULES` = `{emptyPts:10, ilsPerPoint:50, streakDays:60, streakPts:5}` (lib.ts:23)
- `TZ_STALE_DAYS` = `90` (lib.ts:77)
- `DAY_NAMES` = `['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת']` (calLib.ts:61, re-export lib.ts:306) — 7 ימים כולל שבת.

### lastCollectionIso(box) — lib.ts:26-30
1. `{collections:[{date:'2026-07-01'},{date:'2026-08-01'},{date:'2026-06-15'}]}` ⇒ `'2026-08-01'` (מקסימום).
2. `{collections:[]}` ⇒ `''`.

### collectionScoreDelta(box, date, amount, rules?) — lib.ts:33-48
1. קופה ריקה, סכום 120 ⇒ `10 + ⌊120/50⌋` = **12**.
2. קודם `'2026-07-01'`, חדש `'2026-08-01'` (31≤60), סכום 100 ⇒ `10+2+5` = **17** (בונוס-רצף).
3. קודם `'2026-01-01'`, חדש `'2026-08-01'` (212>60), סכום 100 ⇒ **12**.

### boxTotal / coordinatorTotal / grandTotal / campaignTotal — lib.ts:52-73
- `boxTotal({collections:[{amount:100},{amount:50},{amount:NaN}]})` ⇒ **150** (NaN מדולג).
- שתי קופות של רכז c1 (100+50 · 40) ⇒ `coordinatorTotal(boxes,'c1')` = **190**; `grandTotal` על אותן = **190**.
- `campaignTotal(boxes,'p1')` = סכום ה-collections עם `campaignId==='p1'` בלבד.

### staleBoxes(boxes, todayIso, days?) — lib.ts:80-89
- קופה `status:'home'`, ריקון אחרון `'2026-01-01'`, היום `'2026-08-24'` (>90 יום) ⇒ בתוצאה.
- אותה קופה `status:'office'` ⇒ **לא** בתוצאה (רק 'home'). ריקון בתוך 90 יום ⇒ לא.

### needsCare(db, todayIso, config?) — lib.ts:101-131
סדר: ישנות(`stale`) → אבודות(`lost`) → רכז-לא-פעיל(`inactiveCoord`) → מבצע-מסתיים(`campaignEnding`).
- `config` חסר ⇒ מונח-הקופה `'קופה'` (ביט-זהה היסטורי); עם `config` ⇒ `termOf(config,'entity.tzBox','קופה')`.
- קופה `status:'lost'` num 7 ⇒ פריט `{kind:'lost', label:'קופה 7 מסומנת כאבודה', ...}`.

### leaderboard(coordinators, boxes) — lib.ts:142-147
רק פעילים; מיון score↓ ואז total↓. שני רכזים score 30/20 ⇒ הראשון score=30 בראש.

### campaignProgress(campaign, boxes) — lib.ts:149-154
1. יעד 1000, נאסף 250 ⇒ `{sum:250, goal:1000, pct:25}`.
2. נאסף 1500 מול 1000 ⇒ `pct:100` (קטום). 3. `goal` חסר ⇒ `pct:0`.

### filterCoordinators(coords, boxes, q, onlyActive, sort, smartFilter) — lib.ts:174-192
- `sort:'name'` ⇒ localeCompare עברי. `onlyActive:true` ⇒ רק `c.active`.
- `sort:'stale'` ⇒ מי שריקונו-האחרון ישן/'' ראשון (דרך coordinatorLastCollection).

### boxesOverview(db, q, status, sort, smartFilter) — lib.ts:203-230
- שורה `{box, coordName, famName, last, total}`. `sort:'num'` ⇒ מספרי. `status:''` ⇒ הכל.

### filterCollections(box, fromIso, toIso, campaignId) — lib.ts:233-242
- טווח כוללני; קצה `''` = פתוח. `campaignId` ריק ⇒ בלי סינון-מבצע.
- `from:'2026-07-01', to:'2026-07-31'` על ריקונים 06-15/07-10/08-01 ⇒ רק 07-10.

### coordinatorPrintLines(db, coordinatorId, config?) — lib.ts:250-275
- כותרת `'רשימת קופות — <שם>'` + קו `'='×30`; קופה 'home'/'office' בלבד; רכז בלי קופות ⇒ `'אין קופות פעילות'`.

### collectionsCsvRows(db, config?) — lib.ts:281-293
- כותרת `['תאריך','רכז','קופה',<termOf entity.family|'משפחה'>,'סכום','מבצע']`; שורה לכל ריקון.

### buildTzGrid(tzEvents, anchorIso, hebMode, buildMonthGrid) — lib.ts:302-304
- האצלה מלאה: מחזיר בדיוק `buildMonthGrid(tzEvents, anchorIso, hebMode)` (wrapper דק).

**אימות:** `node new/boxes/tzedaka.test.mjs ⇒ exit 0` · רתמת-זהב:
`node maor-system/machtzev/parity/tzedaka.parity.mjs ⇒ exit 0`.
