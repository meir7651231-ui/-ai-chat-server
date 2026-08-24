# חוזה · קופסת-חיבורים "ayin" (מעקב-טיפול / העין)

**תפקיד:** קופסת-החיווט של מודול-העין — כל הלוגיקה הטהורה של `feature supporters.ayin`
מחווטת כאן במקום אחד. מקור-האמת: `/home/user/maor-system/src/lib/ayin.ts` (L4).
‏30 חוטים, מחווטים לפי גרף-הקריאות של המקור. שום קופסה לא מייבאת קופסה (LAW §2);
הקופסה מייבאת אך-ורק אטומים מ-`new/atoms` (חוקי-החשמלאי §2).

## שקעי-IO / דאטה (מוזרקים בזמן-הצבה — לא ממומשים בקופסה)
המקור קורא לשלושה שכנים-טהורים שהם אטומים-על-המדף ⇒ **מיובאים ומחווטים בקופסה**:
- `termOf`  (atom `term-of`)     — מילון-המונחים (ayin.ts:13,30-47) → מזין את 4 תוויות-העין.
- `normSearch` (atom `norm-search`) — נרמול-חיפוש עברי (ayin.ts:14,70) → מזין normName ו-filterAyinBoard.

ושלושה **שקעים אמיתיים** שאינם אטומים (דאטה/שעון/מזהה) ⇒ **מוזרקים כפרמטרים**:
- `isoToday()` — קורא-שעון. מוזרק ל-`planAddName` (ayin.ts:240). דטרמיניזם ⇒ אין `new Date()` בקופסה.
- `emptyAyin()` — מפעל-ברירת-מחדל של AyinCase (domain.ts:599). מוזרק ל-ayinDailyRows/ayinAllRows/ayinBoardItems.
- `nextId(i)` — מחולל-מזהה. מוזרק ל-`templateLinesToNames` (ayin.ts:127).

## חשיפה (כל החתימות אחרי חיווט — termOf/normSearch כבר קשורים)
- `AYIN_STAGES` — ‏`['new','lead','eyes','answer','done']` (ayin.ts:18).
- `stageLabel(cfg, stage)` → string (ayin.ts:30-32).
- `featLabel(cfg)` / `itemLabel(cfg)` / `unitLabel(cfg)` → string (ayin.ts:35-47).
- `stageIndex(stage)` → 0..4, לא-מוכר⇒0 (ayin.ts:50-53).
- `nextStage(stage)` → AyinStage|null; האחרון⇒null (ayin.ts:56-59).
- `revertPatch(stage)` → `{stage}` + `{answerPushed:false}` לפני 'answer' (ayin.ts:62-66).
- `normName(s)` → נרמול-חיפוש בלי רווחים (ayin.ts:69-71).
- `ayinActive(a)` → bool; null/undefined⇒false (ayin.ts:74-83).
- `eyesTotal(a)` → סכום eyes (ayin.ts:86-88).
- `boqLineAmount(n)` = eyes×rate · `boqTotal(a)` = Σשורות (ayin.ts:94-101).
- `timeHoursTotal(a)` / `timeCostTotal(a)` / `matCostTotal(a)` (ayin.ts:104-116).
- `namesToTemplateLines(names)` → שורות רזות, ריקי-שם מדולגים (ayin.ts:119-123).
- `templateLinesToNames(lines, nextId)` → פריטי-BOQ חדשים (ayin.ts:126-139).
- `ayinActionVisible(a)` → גלוּת הכפתור-החכם (ayin.ts:145-151).
- `ayinAdvanceLabel(cfg, a)` → תווית הכפתור (ayin.ts:154-161).
- `planAyinAdvance(cfg, name, a)` → `{patch,event,toast}` או null (ayin.ts:175-220).
- `planAddName(a, rawName, eyes, id, isoToday)` → `{ok,names[,log]}` או `{ok:false,error}` (ayin.ts:226-243).
- `ayinDailyRows(cfg, supporters, todayIso, emptyAyin)` → Cell[][] (ayin.ts:249-281).
- `ayinAllRows(cfg, supporters, emptyAyin)` → Cell[][] (ayin.ts:296-316).
- `ayinBoardItems(supporters, emptyAyin)` → AyinBoardItem[] (ayin.ts:335-355).
- `filterAyinBoard(items, q, status, stage)` → AyinBoardItem[] (ayin.ts:358-372).
- `AYIN_SHEET_HEADER` — כותרת גיליון-העיניים, 8 עמודות (ayin.ts:380-389).
- `ayinSheetRows(supporters)` → string[][] (ayin.ts:396-417).
- `parseAyinSheet(rows, supporters)` → `{upds,miss[,error]}` (ayin.ts:443-494).
- `applyAyinSheet(supporters, upds, today)` → `{supporters,logged}` (ayin.ts:502-545).

## דוגמאות מספריות מחייבות (מקריאת-המקור)
1. `stageLabel({}, 'lead')` ⇒ `'בהכנה'` · `stageLabel({terms:{'ayin.stage.lead':'טיוטה'}}, 'lead')` ⇒ `'טיוטה'`.
2. `nextStage('answer')` ⇒ `'done'` · `nextStage('done')` ⇒ `null` · `stageIndex('zzz')` ⇒ `0`.
3. `revertPatch('new')` ⇒ `{stage:'new', answerPushed:false}` · `revertPatch('done')` ⇒ `{stage:'done'}`.
4. `eyesTotal({names:[{eyes:3},{eyes:'2'},{eyes:''}]})` ⇒ `5`.
5. `boqTotal({names:[{eyes:2,rate:10},{eyes:3,rate:0}]})` ⇒ `20`.
6. `ayinActive(null)` ⇒ `false` · `ayinActive({stage:'new',names:[],lastTouch:'',answers:[],log:[]})` ⇒ `false`.
7. `planAyinAdvance({}, 'כהן', {stage:'new', names:[{id:'1',name:'א',eyes:''}], answers:[], log:[]})`
   ⇒ patch `{stage:'lead'}`, event.title מכיל `'בהכנה — כהן (1 שם לטיפול)'`, toast `'נרשמו 1 — נכנס ללוח: בהכנה'`.
8. `planAddName({names:[],log:[]}, ' ', '', 'x', ()=>'2026-01-01')` ⇒ `{ok:false, error:'הקלידו שם לפני ההוספה'}`.
9. `planAddName({names:[{name:'דוד'}],log:[]}, 'דוד', '', 'x', ()=>'2026-01-01')` ⇒ `{ok:false, error:'השם "דוד" כבר ברשימה'}` (dedup דרך normName←normSearch).
10. `AYIN_SHEET_HEADER[3]` ⇒ `'כמה עיניים'`.
11. `parseAyinSheet([['שם למסירה'],['דמה']], [])` ⇒ `{upds:[], miss:0, error:'חסרות עמודות ...'}` (חסר עמודת-עיניים; שורה-בודדת ⇒ error 'הקובץ ריק').

## מגן-הכרעה (חתום ב-test)
- שקעי-IO (`isoToday`/`emptyAyin`/`nextId`) **מוזרקים** — הקופסה טהורה: אין `new Date(`, `Date.now`, `localStorage`, `fetch` בגוף.
- `termOf` ו-`normSearch` מיובאים כאטומים ומחווטים (לא ממומשים-מחדש).
- הערת-ההכרעה `שקעי-IO (החלטת-הקופסה)` נשמרת verbatim.

## רתמת-זהב
`/home/user/maor-system/machtzev/parity/ayin.parity.mjs` — טרנספילציה-חיה של
`src/lib/ayin.ts` (עם termOf/normSearch/isoToday/emptyAyin מוזרקים) מול הקופסה,
קורפוס-LCG דטרמיניסטי seed=20260824, תאריכים קבועים (בלי Date.now). אפס-סטייה ישן≡חדש.
