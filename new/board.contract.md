# חוזה · לוח-האם (motherboard)

**תפקיד:** הקובץ היחיד במערכת שמחבר קופסאות (LAW חוק-3). מייבא אך-ורק מ-`boxes/`
(המשטרה, משוואה-4: `board` מייבא רק `box`, אחרת exit 1). כאן, ורק כאן, מוזרקים
ה-IO והזהות (חוק-6): שעון, קונפיג-ארגון, שער-דולר.

**מקור-האמת:** אין מקור-JS יחיד — הלוח הוא נקודת-ההרכבה החדשה. פרוסת-התורמים
מחברת שש קופסאות: `lib-config` · `date-util` · `supporters` · `empowerment` ·
`dedup` · `search`.

**חתימה:** `makeBoard(placement?) => Board`

**הצבה (placement — חיווט-הצבה, חוק-6):**
- `config` — קונפיג-ארגון גולמי; עובר `normalizeConfig` של קופסת-config. חסר ⇒ ברירת-המחדל.
- `clockIso` — שקע-שעון `() => 'YYYY-MM-DD'`. חסר ⇒ שעון-המכונה דרך `date-util`.
- `rate` — שער-דולר לקוקפיט. ברירת-מחדל `3.7`.

**החיווט חוצה-הקופסתי (מה הלוח מרכיב):**
- **config-box → צרכני-מונחים:** `term(key,fb)`/`feature(key)` נגזרים מ-`termOf`/`featureOn`
  של הקונפיג-המנורמל — מוזרקים ל-`supporters` (‏supDonEvents מקבל את אותו config).
- **date-util(שעון) → supporters + empowerment:** `today()` הוא מקור-אמת יחיד לתאריך-היום;
  מוזרק ל-`hokDue`/`hokMonthlyTotal` (supporters) ולכל פונקציות-הקוקפיט (empowerment).
  זהו האינווריאנט: שתי הקופסאות רואות אותו "היום".
- **dedup/search:** כלים חוצי-מודול, נחשפים כמות-שהם.

**דוגמאות מחייבות (הצבה: clock='2026-08-24', term override nav.supporters='שותפים'):**
- `board.today()` ⇒ `'2026-08-24'`.
- `board.term('nav.supporters','תורמים')` ⇒ `'שותפים'` (דריסה); `board.term('nav.families','משפחות')` ⇒ `'משפחות'`.
- `board.cockpit.kpis(sups)` ⇒ `{total:4, collected:400, expectedHok:150, atRisk:2}` (על שעון-הלוח).
- `board.sup.hokDue(sups)` ו-`board.cockpit.queue(sups).hok` רואים את אותו תורם-הו״ק — אותו שעון.
- `board.dedup.supporterGroups([{name:'בן צבי רחל'},{name:'רחל בן צבי'}])` ⇒ `[['x','y']]`.

**אינווריאנט:** אפס ייבוא מ-`atoms/` (עקיפת-קופסה אסורה); אפס חיבור בין-קופסתי מחוץ ללוח.
