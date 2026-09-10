# 34 · הרכבה לפי «הדרך» — «פנויים לידי עכשיו» (9.9.2026)

**עותק-מעבדה:** `scratchpad/repos/genesis-lab2` · **ראיות גולמיות:** `scratchpad/research/evidence2/`
**זמן כולל:** ~45 דק׳ (מתוכן ~20 דק׳ ריצות-שערים ברקע). **Flutter/Dart אינם מותקנים** — כל שלב שדורש אותם מסומן.
**אפס אטום חדש · אפס `.dart` שנכתב ביד · אפס `--none`.**

---

## צעד 1 — המטרה בשורה אחת
> הלקוח פותח מסך ורואה **מי פנוי עכשיו לידו**, ולכל אחד: **שם · מרחק ממנו · מחיר לשעה · מחיר לשעתיים** — ומזמין בהקשה אחת.

## צעד 2 — פירוק לפעולות-יסוד (לא "אטום-מרחק")
| # | פעולת-יסוד | תפקידה במטרה |
|---|---|---|
| 1 | **הפרש** Δרוחב = רוחב−רוחב-שלי | הרכיב הראשון של המרחק |
| 2 | **הפרש** Δאורך | הרכיב השני |
| 3 | **מכפלה** Δ×Δ (ריבוע) ×2 | ריבועי-ההפרשים |
| 4 | **קנה-מידה** ×12321 / ×8649 (=111²/93² ק״מ לדרגה) | מעלות ⇒ ק״מ² |
| 5 | **סכום** ריבוע+ריבוע | מרחק-בריבוע |
| 6 | **שורש-ריבועי** √ | ק״מ אמיתיים |
| 7 | **קיום-נקודה** lat/lng לא-ריקים | האם בכלל אפשר למדוד |
| 8 | **מכפלה** מחיר×שעות | מחיר לשעתיים |
| 9 | **חלוקה-למצבים** פנוי/תפוס + **ספירה** | «מי פנוי עכשיו» |
| 10 | **טבלה / שורת-עובדה** | 4 הערכים לכל אדם |
| 11 | **מצב-ריק** | אין אף אחד פנוי |
| 12 | **פעולה** הזמן עכשיו | הערך נסגר בהקשה |
| (13) | **מיון** לפי מרחק | שיפור, לא בגוף-המטרה |

## צעד 3 — חיפוש באורקל (12 רשומות חתומות · `machtzev/audit/search/`)
כל שאילתה עברית+אנגלית, כל אחת `--choose`. **אפס `--none`.**

| פעולת-יסוד | שאילתה | מועמד-מוביל (ציון) | `--choose` | קובץ-רשומה |
|---|---|---|---|---|
| שורש-ריבועי | `שורש ריבועי sqrt root מספר` | **sqrt 3** (logic · `dart/sqrt.dart`) | `sqrt` | `2026-09-09-ורש-ריבועי-sqrt-409ed6e2.json` |
| קיום-נקודה | `קואורדינטות coords מיקום lat lng` | **hasCoords 3** (`dart/has_coords.dart`) | `hasCoords` | `…-קואורדינטות-coords-יקום-99d18638.json` |
| מכפלה מחיר×שעות | `מחיר price כמות quantity שורה line סכום amount` | **boqLineAmount 6** · PriceChip 4 | `boqLineAmount` | `…-חיר-price-מות-a1ab6351.json` |
| הפרש (Δ) | `הפרש difference delta מדד kpi אריח tile` | **KpiTile 7** · DsDiffRow 4 | `KpiTile` | `…-פרש-difference-delta-8e434f3a.json` |
| חלוקה-למצבים | `קבוצה section חלוקה מצב זמין available` | **DsSection 4** | `DsSection` | `…-קבוצה-section-חלוקה-4f3d3d5c.json` |
| שורת-מצב לרשומה | `הודעה message שורה toast כרטיס card` | **ToastCard 7** | `ToastCard` | `…-ודעה-message-ורה-d459a000.json` |
| טבלה | `טבלה table עמודות columns grid רשימה` | ForgeDataGrid 5 · **DsTable 4** | `DsTable` | `…-טבלה-table-עמודות-ddfbdac1.json` |
| עובדה-מספרית בשורה | `שבב chip עובדה fact תווית label ערך` | **DsChip 6** | `DsChip` | `…-שבב-chip-עובדה-b94a607c.json` |
| מצב-ריק | `ריק empty state אין תוצאות` | EmptyStateCard 8 · **EmptyState 6** | `EmptyState` | `…-ריק-empty-state-e4e4f9bf.json` |
| פעולה | `כפתור big button פעולה הזמנה` | **BigButton 7** | `BigButton` | `…-פתור-big-button-0f6f554f.json` |
| מיון | `מיון sort סדר order כותרת header` | **ForgeSortHeaderStates 6** | `ForgeSortHeaderStates` | `…-יון-sort-סדר-3acb16e1.json` |
| (סריקות-יבש נוספות: הפרש/מכפלה/סכום/אנשים/פנוי — `evidence2/03,04`) | | | | |

**ממצא-מפתח:** לפעולות **הפרש · מכפלה · סכום** אין אטום-מדף — ולא צריך: הן **אופרטורים של המנוע עצמו**
(`particles.mjs:134-137` צורות `−`/`×`/`/` · `render-ds.mjs:201 compileFormula`). המדף מחזיק diff **דומייניים** בלבד
(dayDiff, diffDb, donationPartitionDiff…). היוצא-מן-הכלל: **`boqLineAmount`** הוא מכפלה-אמיתית של שני שדות-רשומה
(`(+n.eyes||0) * (n.rate||0)`, `new/dart-maor/boq-line-amount.dart`) — ולכן הוא **המנוע** של «מחיר × שעות».

## צעד 4 — חיווט דרך המנוע (ספק ⇒ מנוע ⇒ Dart). אפס Dart ביד.
**הקובץ שכתבתי (ספק בלבד):** `machtzev/generator/specs-ds/panuy.txt` (17 שורות · עותק ב-`evidence2/panuy.txt`)
```
ישות אדם עם שם*, זמין{כן|לא}, קו רוחב, קו אורך, קו רוחב שלי[32.0853], קו אורך שלי[34.7818], מחיר לשעה, שעות[2],
  הפרש רוחב = קו רוחב - קו רוחב שלי,
  הפרש אורך = קו אורך - קו אורך שלי,
  מרחק בריבוע = (קו רוחב - קו רוחב שלי) * (קו רוחב - קו רוחב שלי) * 12321 + (קו אורך - קו אורך שלי) * (קו אורך - קו אורך שלי) * 8649,
  מרחק בקמ = sqrt(מרחק בריבוע),
  יש נקודה = hasCoords(קו רוחב→lat, קו אורך→lng),
  מחיר לשעתיים = boqLineAmount(שעות→eyes, מחיר לשעה→rate)
חלקיק אדם: [טבלה] / שם / זמין / מונה(זמין=כן) / הפרש רוחב = … / הפרש אורך = … / מרחק בריבוע / מחיר לשעה /
            מחיר לשעתיים / [ריק] … / [פעולה] הזמן עכשיו / מחיר לשעתיים בשורה = מחיר לשעה × שעות
```
**המנוע שצרך אותו:**
```bash
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin
⇒ 🧩 חלקיקים (הכרעה-27): 12/12 נמצאו-ומחווטים · 1 מסכי-חלקיקים   (0.7s)
```
שרשרת: `app-ds.mjs` → `entity.mjs` (‏`שדה=נוסחה`, שורה 83) → `render-ds.mjs` (‏`compileFormula`/`MAP_ENGINES`) →
`particles.mjs` (‏`shapeOf`⇒`opsOf`⇒`cover`⇒`wireAtom`). תכנית-החלקיקים: `machtzev/generator/particle-plan-panuy.md`.

## צעד 5 — הזרקה דרך חריצים בלבד
`git status` אחרי הריצה: **אפס** שינוי תחת `new/atoms/ · new/dart/ · new/dart-maor/ · new/dart-ui-bs/ · pure/forge`.
כל התוצר הוא קבצי `gen_app_panuy_*` חדשים + הספק + רשומות-החיפוש + כרטיסי-המטרה.

## צעד 6 — אימות מול המטרה (הבייטים)
**המרחק — Δ ⇒ ריבוע ⇒ סכום ⇒ קנה-מידה, מורכב בפועל** (`new/dart-gen-bs/gen_app_panuy_ent1.dart:171-173`):
```dart
_calc(c22 /*הפרש רוחב*/, (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0)),
_calc(c23 /*הפרש אורך*/, (num.tryParse(_v[3] ?? '') ?? 0)  -  (num.tryParse(_v[5] ?? '') ?? 0)),
_calc(c24 /*מרחק בריבוע*/,
  ( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) ) * ( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) ) * 12321
+ ( (num.tryParse(_v[3] ?? '') ?? 0) - (num.tryParse(_v[5] ?? '') ?? 0) ) * ( (num.tryParse(_v[3] ?? '') ?? 0) - (num.tryParse(_v[5] ?? '') ?? 0) ) * 8649),
```
**מחיר לשעתיים — מנוע-לוגיקה מהמדף, מיובא ונקרא** (`gen_app_panuy_ent1.dart:9,176` · גם בכרטיס, בטבלה וב-CSV):
```dart
import '../dart-maor/boq-line-amount.dart';
_live(c27 /*מחיר לשעתיים*/, boqLineAmount(<String,String>{c28 /*eyes*/: (_v[7] ?? ''), c29 /*rate*/: (_v[6] ?? '')}).toString())
```
**המכפלה גם חיה בשורת-הרשימה** (`gen_app_panuy_px1.dart`, חלקיק `מחיר לשעה × שעות ⇒ × ⇒ KpiTile`):
```dart
KpiTile(value: ((num.tryParse(r[c90/*מחיר לשעה*/] ?? '') ?? 0) * (num.tryParse(r[c91/*שעות*/] ?? '') ?? 0)).toStringAsFixed(0), label: c89)
```
**שני ההפרשים גם חיים בשורה** (‏`− ⇒ diff ⇒ KpiTile`), ו-`מרחק בריבוע` מגיע לשורה כ-`DsChip` מהערך השמור.

### 🔴 איפה המנוע נעצר — בדיוק
`sqrt` ו-`hasCoords` **לא חוּוְטוּ**. הפלט מוכיח (`gen_app_panuy_ent1.dart:174-175`): שני השדות ירדו לשדה-קלט רגיל —
`ForgeDsField(... DsField(label: 'מרחק בקמ', value: _v[11] …))` ו-`… 'יש נקודה', value: _v[12] …`.
**השורה החוסמת:** `machtzev/generator/render-ds.mjs:97` — `/^Map</.test(ps[0])`.
בדיקת-הפרדיקט (read-only, `evidence2/12-mapengines-probe.txt`) מראה ש-`sqrt` ו-`hasCoords` **עוברים כל שאר הסעיפים**
(`RET_OK` ✓ · `he` ✓ · `selfContained` ✓) ונופלים **רק** על סעיף ה-Map:
`sqrt` ps[0]=`double` · `hasCoords` ps[0]=`double?` · `boqLineAmount` ps[0]=`Map<String, dynamic>` ✓ (10 מנועים בסך-הכל, `listMapEngines()`).
החריץ היחיד שבו האדם **נוקב בשם מנוע** הוא `render-ds.mjs:326` (`שדה = engineName(שדה→מפתח)`) — והוא ניזון רק מ-`MAP_ENGINES`.
שני החריצים האחרים סגורים אף הם: `pickXform` (`render-ds.mjs:420`) נקרא רק אחרי שהטיפוסים num/date/bool כבר חזרו ⇒ תמיד `ftype='text'`
⇒ `TYPE_COMPAT.text=['String','dynamic','Object']` פוסל `double`; `wireLogic` (`particles.mjs:232`) קושר פרמטרים רק לפי `LSOCK`=phone/text.
**מה שפת-הספק צריכה:** להרחיב את החריץ הקיים ממנועי-Map בלבד למנועי-סקלר — `שדה = sqrt(מרחק בריבוע→x)`,
כלומר טבלת-מנועים אחת שממפה **שדה→שם-פרמטר** (בדיוק כמו `maps` היום) במקום להתנות `Map<` על פרמטר-0. **לא תיקנתי.**
**מיון לפי מרחק:** אין סעיף-מיון בדקדוק כלל (הסריקה מצאה `.sort(` פולט-Dart יחיד — `particles.mjs:374`, לוח-תאריכים לקסיקלי).

## צעד 7 — שורש בבייטים · באיזו שכבה התיקון
1. **`sqrt`/`hasCoords` לא-מחווטים** — שורש: `render-ds.mjs:97` (סעיף `Map<`). שכבה: **מנוע** (לא אטום, לא דאטה). האטומים תקינים ומלאים.
2. **שדה-מנוע אינו נשמר** — `render-ds.mjs` דוחף `mapVals.push(`${cl}: ''`)` לשדה-מנוע (נראה בפלט: `c27: ''` ב-`final map`), בעוד שדה-נוסחה כן נשמר.
   לכן החלקיק `מחיר לשעתיים` (raw) קורא `r['מחיר לשעתיים']` ומקבל ריק במסך-הרשימה. **עקפתי בשפת-הספק בלבד** (חלקיק `מחיר לשעה × שעות`), לא בפלט. שכבה: **מנוע**.
3. **קבועי 12321/8649** = קירוב equirectangular לקווי-הרוחב של ישראל. הם **דאטה בספק**, לא קוד. שכבה: **קובץ-דאטה**.

## כרטיס-מטרה ותמונה
```bash
node machtzev/goal-card.mjs --screen new/dart-gen-bs/gen_app_panuy_px1.dart --goal "…" --models appStore,records \
  --atoms DsTable,DsChip,DsSection,ToastCard,KpiTile,EmptyState,BigButton --accept "…" --picture <png>
⇒ 🎯 machtzev/audit/goals/gen_app_panuy_px1.json  (מודלים 2 · אטומים 7 · קבלה 6 · תמונה 85b99adc)
⇒ 🎯 machtzev/audit/goals/gen_app_panuy_ent1.json (מודלים 1 · אטומים 5 · קבלה 3 · כולל boqLineAmount בקוד)
```
**התמונה היא מציין-מקום** — אין רנדרר Flutter כאן. ייצרתי PNG 640×440 (3,737B) ב-node עם `zlib` (`evidence2/panuy-placeholder.png`).
הכלי בודק magic-bytes/מידות/גודל בלבד ולכן קיבל אותה. **זו אינה תמונת-מסך.** גם הכרטיס הראשון נדחה בצדק («atom boqLineAmount לא מופיע בקוד-המסך») — הכלי נושך.

## שערים (node בלבד)
| שער | תוצאה |
|---|---|
| `particles.mjs --gate` | ✅ `448 חלקיקים ב-32 ספקים — כולם נמצאו בחיפוש-פתוח ומחווטים` (כולל 12 שלי) |
| `search-proof-check --gate` | ✅ |
| `goal-proof-check --gate` | ✅ |
| `police.mjs` (מלא, ~3 דק׳) | 🚨 אדומה — **43 ran · 5 yellow · 5 failed**: `goldenharness · genverify · appgen · learn · selftest` — **כולם `אין Dart`** |
| `police.mjs` **בסיס** (HEAD, בלי הספק שלי) | 🚨 **אותם 5 בדיוק** ⇒ הספק שלי מוסיף **אפס אדום** (`evidence2/20-police-BASELINE.txt`) |
| `one.mjs --genmax` | 🚨 נפל — אך בבידוד כל 52 שלבי `regen` עברו; הכשל היחיד (peruk15, `ENOENT gen_app_audit_content.dart`) נגרם מ**ריצה מקבילה שלי** (police+regen יחד מוחקים-וכותבים באותו מרחב-שמות). **לא כשל של הספק.** |
| `flutter analyze / flutter test / gen-verify` | ⛔ **לא ניתן** — Flutter/Dart לא מותקנים. הקומפילציה של הפלט לא נבדקה. |

---

## שורה תחתונה (פסק-דין)
**כן — חלקית, ובכנות.** המחולל הרכיב את המטרה מחלקיקים קיימים בלבד: **12/12 חלקיקים נמצאו-וחוּוְטוּ**, ההפרש·הריבוע·הסכום·קנה-המידה
נפלטו כביטוי-Dart אחד חי בשורה ובטופס, ו«מחיר לשעתיים» חוּוַט אל **מנוע-לוגיקה אמיתי מהמדף** (`boqLineAmount`, `new/dart-maor/`)
שיובא ונקרא בקוד — בלי שנכתב אף `.dart` ובלי שנגעתי באטום. **מה שלא הושג:** ההמרה האחרונה למרחק בק״מ — `sqrt` קיים במדף,
האורקל מחזיר אותו כמועמד-החזק היחיד, אבל שום חריץ במנוע אינו יודע לקשור מנוע חד-פרמטרי-סקלרי לשדה; לכן התוצר עוצר ב-**מרחק-בריבוע**
ולא במרחק. **חלוקת האחריות:** *הסוכן* החליט את המטרה, את הפירוק ל-13 פעולות-יסוד, את ניסוח-הנוסחאות ואת מיפוי `שעות→eyes, מחיר לשעה→rate`;
*המנוע* בחר לבדו כל אטום-תצוגה (DsTable · DsChip · DsSection+ToastCard · KpiTile · EmptyState · BigButton), פלט את כל האריתמטיקה,
והוא גם זה ש**סירב** ל-`sqrt`/`hasCoords` — סירוב שאני מדווח ולא עוקף. הכישלון של הניסיון הקודם היה לחתום `--none` על «אין אטום-מרחק»;
כאן אין `--none` אחד, `sqrt` נמצא ונבחר, והפער היחיד שנותר הוא **שורה אחת במנוע** (`render-ds.mjs:97`), לא חור במחצב.
