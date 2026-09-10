# 31 · ניסוי-שדה במחולל GENMAX — מה הוא באמת יודע לעשות

> נכתב 2026-09-09 · עותק-מעבדה `scratchpad/repos/genesis-lab` (HEAD `578dbf2`, נקי לפני ההתחלה, זהה-ביט ל-`repos/genesis`)
> עותק-בסיס להשוואה: `scratchpad/repos/genesis-base` (העתק של `genesis` שנוצר לצורך מדידת "מה נכשל ממילא")
> ראיות: `scratchpad/research/evidence/` · **Flutter/Dart אינם מותקנים במכונה** (`which flutter dart` ⇒ ריק) · לא בוצע commit/push/ship

---

## 0 · שלוש הדלתות של המחולל (כפי שבעלים מפעיל אותן)

| נתיב | קלט שהאדם כותב | המנוע | פלט |
|---|---|---|---|
| **A · משפטים** | `machtzev/generator/app-golden-N.json` = `{name, goal, modules:[{sentence, goal, ops[]}]}` | `app-from-sentences.mjs` ⇒ `sentence.mjs` (חיפוש-מונח) ⇒ `retarget.mjs` (מודול-זהב מוסב) | `gen_retarget_<ישות>_from_<מודול>.dart` + `gen_app_<שם>.dart` + `gen_main_<שם>.dart` |
| **B · פירוקים** | `machtzev/generator/peruks/peruk-NN.md` (מסמך-בעלים בעברית) | `peruk.mjs --all` ⇒ `specs-ds/<ns>.txt` ⇒ `app-ds.mjs -f <ספק> --name <ns> --skin` ⇒ `balagan.mjs` | `apps/<ns>.json` + ~16 מסכי `gen_app_<ns>_*.dart` + מודול ב«בלגן» |
| **C · סוכן-על-המחצב** | מטרה (`generator/goals/*.txt`) → הסוכן מפרק לפעולות-יסוד → `search-record.mjs` באורקל → הרכבה בכלי-ההרכבה → `goal-card.mjs` → משטרה | `search-record` · `particles.mjs`/`app-ds` · `goal-card` · `police`/`gates.tsv` | מסך מורכב-מאטומים + רשומת-חיפוש חתומה + כרטיס-מטרה חתום |

הרצתי את שלושתן. B ו-C הן הנתיבים ש**עבדו**; A עובד אבל הוא לא NLU (ר׳ §4).

---

## 1 · מה הרצתי ומה קרה

### 1א · ניסוי 1 — רג׳ן-בסיס (node בלבד)

| פקודה | תוצאה | זמן | ראיה |
|---|---|---|---|
| `node <runner> regen.mjs REGEN+INDEX` (49 שלבים, לפי `regen.mjs`) | **48/49 עברו · 1 נפל** | **86.3s** | `evidence/regen-baseline.log` |
| `node machtzev/generator/tighten-types.mjs --record --apply` | **🚨 נפל (exit 1)** | 31.4s | `evidence/tighten-stderr.txt` |
| `git status --short` אחרי הרג׳ן | 84 קבצים השתנו — **אף אחד מהם אינו פלט-GENMAX** | — | `evidence/regen-baseline-gitstatus.txt` |
| `git status --short new/dart-gen-bs new/dart-data-bs generator/apps generator/specs-ds peruk-index.json` | **0 קבצים** ⇒ שחזור **ביט-זהה** | — | — |
| רג׳ן מלא בלי `tighten-types` (50 שלבים, כולל הספקים החדשים) | **50/50 עברו** | **56.3s** (מתוכם `truth.mjs` 27.4s) | `evidence/regen-final.log` |

**ההודעה המילולית של הכשל:**
```
file:///…/machtzev/generator/tighten-types.mjs:221
  if (redBoxes.length) throw new Error(`tighten: ${redBoxes.length} קופסאות אדומות שאינן של ההידוק — …`);
Error: tighten: 35 קופסאות אדומות שאינן של ההידוק — a11y:  · audit:  · ayin: 
    at apply (…/tighten-types.mjs:221:30)
```

**ממצא חמור (רגרסיה, לא רק כשל):** הריצה שנפלה כן כתבה לדיסק — היא **שחררה** 76 אטומי-Dart מטיפוס מהודק חזרה ל-`dynamic`:
```diff
- String fixPhone(String p, String Function(dynamic) formatIsraeliPhone) {
+ String fixPhone(dynamic p, String Function(dynamic) formatIsraeliPhone) {
```
(`new/dart-maor/fix-phone.dart`). זה גרר שינוי ב-`logic-census.json` (296 שורות), `auto-logic.json` (74), `ops-map.json` (371), `atom-index-full.json`, `TRUTH.md`.
הריצה **השנייה** של אותה פקודה מדווחת `🧪 tighten·boxes: 0/62 קופסאות מייבאות אטומים-מהודקים` ויוצאת **0** — כלומר "ירוק" רק מפני שההידוק כבר נהרס. הרג׳ן אינו אידמפוטנטי בשכבה הזו כשאין `maor-system`.

**מה דורש Flutter מתוך רשימת ה-REGEN:** אף שלב ברשימה עצמה. `ds-forge · auto-skin · logic-census · oracle · auto-logic · skin-golden · core-from-shape · core-dart · app-from-sentences · peruk · 33×app-ds · balagan · atom-index · quarry-golden · op-census · truth` — כולם node טהור. Flutter נדרש רק ב**שערים** (§6).

### 1ב · ניסוי 2 — פירוק חדש מאפס (נתיב B)

הפקודות שבעלים מקליד, בסדר:
```bash
$EDITOR machtzev/generator/peruks/peruk-29.md          # 229 שורות, שלד זהה ל-peruk-02
node machtzev/generator/peruk.mjs --all                 # 0.126s
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk29.txt --name peruk29 --skin   # 0.713s
node machtzev/generator/balagan.mjs                     # 0.633s
```

| שלב | תוצאה | ראיה |
|---|---|---|
| `peruk.mjs --all` | `✓ peruk-29.md ⇒ peruk29: 9 שדות · 6 חלקים · 66 תוכן · אדום/צהוב/ירוק · שרשרת 0` · `📄 peruk: 29 פירוקים ⇒ 29 ספקים` | `evidence/peruk29-run.log`, `evidence/peruk29.txt` |
| 28 הפירוקים הישנים | **לא השתנה אף ספק** (`git status` על `specs-ds/` = ריק חוץ מ-`peruk29.txt` החדש) | — |
| `app-ds --name peruk29 --skin` | `🧩 חלקיקים: 9/9 נמצאו-ומחווטים · 2 מסכי-חלקיקים · 66 פריטי-תוכן · 1 מסכי-דוח` · `✨ 8 מסכים · 2 ישויות · 1 דשבורדים` | `evidence/appds-peruk29.log`, `evidence/peruk29.json` |
| `balagan.mjs` | `🧭 בלגן: 31 מודולים … מזהה-הרגע: ✓ כותרת+הרגע ⇒ עצמו ב-31/31` | `evidence/balagan-run.log` |
| קבצי-Dart | 16 מסכים + 16 קבצי-תוכן = **1,738 שורות Dart** מ-229 שורות markdown | `new/dart-gen-bs/gen_app_peruk29_*.dart` |

**עבד בניסיון הראשון. אפס תיקוני-יד.**

### 1ג · ניסוי 3 — נתיב A (משפטים + מטרה + פעולות-יסוד)

כתבתי `machtzev/generator/app-golden-5.json` בדיוק בפורמט של `app-golden-4.json`, כולל **פעולה שלא קיימת בקטלוג**:

```bash
node machtzev/generator/app-from-sentences.mjs          # 1.5s לכל 5 האפליקציות
node machtzev/generator/app-from-sentences.mjs --gate
```

| ניסיון | תוצאה |
|---|---|
| `ops: ["גריד-שבועי","התנגשות","סיכון"]` — פעולה **קיימת בקטלוג אך לא במודול שנבחר** | `exit 1` + המנוע **מונה את הזמינות** (למטה) |
| `ops: ["גריד-שבועי","התנגשות","בדיקת-גדר"]` — פעולה **מומצאת** | אותה שגיאה בדיוק, אותה רשימה |
| `ops: ["גריד-שבועי","התנגשות","חסימה"]` | `✓ ShchunaApp ⇒ gen_app_shchuna.dart · 3 מודולים` |

**השגיאה מילה-במילה** (`evidence/appgolden5-bad-op.log`):
```
Error: ops: [סיכון] אינן פעולות-יסוד של schoolos_rooms.dart — הזמינות: חדרים·גריד-שבועי (rm.weekly) ·
חדרים·התנגשות (rm.clash) · חדרים·חסימה (rm.holiday) · חדרים·ייצוא (rm.export)
    at particlesForOps (…/sentence.mjs:66:29)
```
זה בדיוק "המנוע מדווח, לא ממציא" — הוא לא בחר משהו דומה, לא נפל בשקט, ולא ביקש LLM.

### 1ד · ניסוי 4 — «בלגן» על הפירוק החדש

`balagan.mjs` **לא קורא אינדקס-יד**: `loadModules()` גוזר `apps/*.json ∩ peruk-index.json`. לכן peruk29 נכנס לבד:
```json
{ "index": 30, "ns": "peruk29", "layer": "peruk",
  "title": "מכתב מהמועצה על גדר בגבול עם השכן", "topic": "בית ספר",
  "home": "GenAppPeruk29HomeScreen", "root": "GenAppPeruk29Ent1Screen", "dates": 1 }
```
המודול מופיע ב-`gen_balagan_ask.dart · gen_balagan_confirm.dart · gen_balagan_home.dart · gen_balagan_shell.dart · gen_balagan_topics.dart`.

**מזהה-הרגע (TF-IDF)** — הרצתי אותו ישירות מ-node (`buildIdentifier` + `identify`), הסף המחולל הוא `const double kBalaganWeak = 0.056` ב-`gen_balagan_moments.dart`:

| שאילתה | top-1 | ביטחון |
|---|---|---|
| «המועצה שלחה מכתב על הגדר» | **peruk29** | 0.339 ✅ |
| «קיבלתי מכתב מהמועצה על הגדר בגבול עם השכן» | **peruk29** (peruk24 0.028 · peruk08 0.006) | 0.706 ✅ |
| «הגדר חורגת» | **peruk29** | 0.244 ✅ |
| «המשכיר מקזז מהפיקדון» (בקרה) | peruk02 | 0.259 ✅ |
| «לשלם ארנונה מחר» (שורה-כללית, בקרה) | peruk12 | 0.037 ⇒ **מתחת לסף = "לא זוהה"**, כמצופה |

**הרתמות ב-JS שקיימות ורצות** (אין צורך ב-Dart): `balagan-one.mjs --gate`, `balagan-look.mjs --gate`, `balagan-run.mjs`. אין `balagan-score.mjs` (זה קובץ-דאטה `balagan-score.json`).
- `✓ balagan-one: אפליקציה אחת · 31 מודולים … מזהה-הרגע 31/31 · אפס רשימה-סגורה (רצפה 30)`
- `✓ balagan-look: 35/36 ≥ רצפה 35 · אפס-אדומים על 33 אפליקציות-נייר`
- `⚪ balagan-run: אין אתר בנוי … — מדולג` ← **זה השער היחיד שדורש דפדפן+build של Flutter**
- `genesis_gen_balagan_facts_test.dart` הוא Dart — **לא הצלחתי להריץ** (אין flutter).

### 1ה · ניסוי-C — הפעלה כסוכן-על-המחצב (מטרה חדשה)

**המטרה:** «רשימת אנשים פנויים עכשיו לידי עם מרחק ומחיר לשעה».
**זמן כולל: כ-12 דקות** (רובן שלי, לא של הכלים; כל פקודת-כלי ≤1s).

**צעד 2 (אני) — פירוק לפעולות-יסוד:** זהות-אדם-בשורה · מצב פנוי/תפוס · עובדה-מספרית מרחק · עובדה-מספרית מחיר-לשעה · מיון/סינון · מצב-ריק · פעולת-הזמנה.

**צעד 3 (הכלי) — `search-record.mjs` על האורקל המאוחד (1774 תצוגה + 850 לוגיקה):**

| שאילתה | מועמדים · חזקים | הכרעה |
|---|---|---|
| `אנשים list row שורת רשימה person avatar` | 12 · 12 (BrandListRow 7 · ForgeProfileRowList 7 · OrderListRow 7) | `--choose ForgeProfileRowList` |
| `פנוי available now זמין status סטטוס` | 12 · 12 (StatusDotChip 4 · LiveStatusPill 4 · PulsingStatus 4) | `--choose StatusDotChip` |
| `מחיר price hour שעה שקל shekel money` | 12 · 12 (PriceChip 4 · money 3 · fMoney 3) | `--choose PriceChip` |
| `ריק empty state אין תוצאות` | 12 · 12 (EmptyStateCard 8 · ForgeEmptyState 8) | `--choose ForgeEmptyState` |
| `מרחק distance km haversine geo מיקום location` | **5 · 2** | **`--none`** |
| `תעריף לשעה hourly rate per hour שעות` | 12 · 2 | **`--none`** |

**איפה לאורקל אין אטום — מצוטט מתוך רשומת ה-`--none` החתומה:**
> «אין באורקל אף אטום שמחשב מרחק בין שתי נקודות: `LocationButton` הוא כפתור-ניווט שפותח מפה חיצונית ולא מודד ק״מ; `locationToAvailability` ממפה מחרוזת-מיקום-מלאי (warehouse/site) לזמינות-ציוד ואינו גאוגרפי; `hasCoords` רק בודק ש-lat/lng אינם null. חסרה פעולת-יסוד haversine/מרחק-ממני.»

הכלי **אכף** את זה: `--none` קצר מ-40 תווים נדחה, ומועמד-חזק (ציון ≥3) שלא הוזכר בשמו ⇒ `❌ מועמדים-חזקים … שלא נזכרו ב---none`. גם `hourly-rate` נדחה: `timeHoursTotal` סוכם שעות משעתון ואינו כופל בתעריף.
**גם:** השאילתה חייבת עברית **וגם** אנגלית, אחרת `❌ … אחרת חצי מהאורקל לא נסרק`.

**צעד 4 (הכלי) — הרכבה, בלי לצייר Dart ביד.** כתבתי ספק `machtzev/generator/specs-ds/panui.txt` (17 שורות) והרצתי:
```bash
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panui.txt --name panui --skin   # 0.77s
```
המפרק-הפתוח (`particles.mjs`) חיפש **בעצמו** בכל הקטלוג לכל חלקיק:
```
טבלה                    ⇒ table     ⇒ [table]        ⇒ DsTable      (חלופות: DsTable/ForgeModalDialog)
פעולה הזמן עכשיו        ⇒ act       ⇒ [action]       ⇒ DsChipButton (BigButton/DsChipButton)
ריק אין אף אחד פנוי…    ⇒ empty     ⇒ [empty]        ⇒ EmptyState@premium/feedback
זמין                    ⇒ partition ⇒ [group, alert] ⇒ DsSection + DsNote
מרחק ממני               ⇒ raw       ⇒ [fact]         ⇒ DsChip       (HomeShellMenuRow/DsChip)
מחיר לשעה               ⇒ raw       ⇒ [fact]         ⇒ DsChip
```

**צעד 5 (אני+הכלי) — כרטיס-מטרה:**
```bash
node machtzev/goal-card.mjs --screen new/dart-gen-bs/gen_app_panui_px1.dart \
  --goal "הלקוח רואה תוך שניות מי פנוי עכשיו בקרבתו, כמה הוא רחוק וכמה הוא עולה לשעה — ומזמין אותו בהקשה אחת…" \
  --models appStore,records --atoms DsTable,ForgeDataGrid,DsSection,DsChip,ForgeStatusChip,DsSearch,DsChipButton \
  --accept "8 חלקיקים בתכנית;2 עובדות מספריות (מרחק · מחיר לשעה);1 חלוקת-מצב פנוי/תפוס;0 אטומים מצוירים-ביד" \
  --picture <png>
⇒ 🎯 כרטיס-מטרה: machtzev/audit/goals/gen_app_panui_px1.json
   מודלים 2 · אטומים 7 · קבלה 4 · תמונה … (d86389d9)
```
**התמונה היא מציין-מקום.** אין דרך לרנדר Flutter כאן, אז ייצרתי PNG 640×420 (1,538 בייט) ב-node עם `zlib` — פסי-רשת על רקע-נייר, **לא צילום-מסך אמיתי**. הכלי בודק רק magic-bytes/מידות/גודל, אז הוא קיבל אותה. `evidence/panui-placeholder.png`.

**צעד 6 — משטרה:** ר׳ §6. השער `particles` **הצליח לתפוס אותי** (למטה).

---

## 2 · מה המחולל יודע לעשות (מוכח)

### 2.1 · לקרוא מסמך-בעלים בעברית מבנית ולהסיק סכימה
מ-`peruk-29.md` הוא הסיק לבד: **9 שדות-קליטה** (5 `חובה:` + 4 `רשות:`), **2 enum**, **טיפוס תאריך**, **6 חלקי-דוח**, **3 רמות-חומרה** ⇒ ישות שנייה `ממצא` עם `צבע{אדום|צהוב|ירוק}` וקשת-מחיקה, **3 מחירים**, **5 איסורים**, הסתייגות. הספק שנוצר (`specs-ds/peruk29.txt`, 93 שורות) פותח כך:

```
אפליקציה: מכתב מהמועצה על גדר בגבול עם השכן
עיצוב: נייר
שאלה בית: מה עכשיו?
ישות תיק עם לקוח*, טלפון, צילום המכתב מהמועצה*, תאריך קבלת המכתב*, כתובת הנכס*,
        גובה הגדר במטרים*, הגדר שלי או של השכן{הגדר שלי|של השכן}*,
        מפת מדידה או תשריט{מפת מדידה|תשריט}, תמונות של הגדר משני, וואטסאפ עם השכן,
        חשבוניות על בניית הגדר | שלבים התקבל, שולם, בבדיקה, נמסר, סגור
ישות ממצא עם תיק*, סעיף, מה כתוב, מה לבקש, צבע{אדום|צהוב|ירוק} | מחיקה: תיק=מפל
לוח בקרה עם מונה(תיק), מונה(ממצא: צבע=אדום)
```

**המניפסט `machtzev/generator/apps/peruk29.json` (מלא):**
```json
{
 "ns": "peruk29",
 "title": "מכתב מהמועצה על גדר בגבול עם השכן",
 "look": "paper", "layer": null, "chain": [],
 "questions": { "report": "מה לעשות עם זה?", "list": "מה פתוח עכשיו?", "home": "מה עכשיו?" },
 "home":     { "slug": "app_peruk29_home",  "cls": "GenAppPeruk29HomeScreen" },
 "shell":    { "slug": "app_peruk29_shell", "cls": "GenAppPeruk29ShellScreen" },
 "rootPage": { "slug": "app_peruk29_root",  "cls": "GenAppPeruk29RootScreen" },
 "root": {
  "slug": "app_peruk29_ent1", "cls": "GenAppPeruk29Ent1Screen", "name": "תיק",
  "descField": "לקוח",
  "stages": ["התקבל","שולם","בבדיקה","נמסר","סגור"],
  "fields": [
   { "label": "לקוח",                 "type": "text", "required": true,  "enumVals": [] },
   { "label": "טלפון",                "type": "text", "required": false, "enumVals": [] },
   { "label": "צילום המכתב מהמועצה",  "type": "text", "required": true,  "enumVals": [] },
   { "label": "תאריך קבלת המכתב",     "type": "date", "required": true,  "enumVals": [] },
   { "label": "כתובת הנכס",           "type": "text", "required": true,  "enumVals": [] },
   { "label": "גובה הגדר במטרים",     "type": "text", "required": true,  "enumVals": [] },
   { "label": "הגדר שלי או של השכן",  "type": "text", "required": true,  "enumVals": ["הגדר שלי","של השכן"] },
   { "label": "מפת מדידה או תשריט",   "type": "text", "required": false, "enumVals": ["מפת מדידה","תשריט"] },
   { "label": "תמונות של הגדר משני",  "type": "text", "required": false, "enumVals": [] },
   { "label": "וואטסאפ עם השכן",      "type": "text", "required": false, "enumVals": [] },
   { "label": "חשבוניות על בניית הגדר","type": "text","required": false, "enumVals": [] }
  ]
 },
 "entities": [ { "name": "תיק", "slug": "app_peruk29_ent1" }, { "name": "ממצא", "slug": "app_peruk29_ent2" } ],
 "relations": true,
 "report": { "slug": "app_peruk29_rp1", "cls": "GenAppPeruk29Rp1Screen" }
}
```

### 2.2 · התוכן «מה שולחים / מה חוזר / אסור / חובה» **באמת נכנס ל-Dart** — לא רק טופס
```dart
// new/dart-gen-bs/gen_app_peruk29_px1.dart  (כותרת מחוללת)
//   טבלה   = [טבלה]        ⇒ table   ⇒ [table]  ⇒ DsTable
//   מסגרת  = [תוכן מסגרת]  ⇒ content ⇒ [alert]  ⇒ DsNote
//   בלוקים = [תוכן בלוקים] ⇒ content ⇒ [alert]  ⇒ DsNote
//   אסור   = [תוכן אסור]   ⇒ content ⇒ [alert]  ⇒ DsNote
//   לוח    = [לוח]         ⇒ dates   ⇒ [magnitude] ⇒ KvLine
```
```dart
// new/dart-data-bs/auto/gen_app_peruk29_px1_content.dart
const String gen_app_peruk29_px1_c85 = 'אסור';
const String gen_app_peruk29_px1_c86 = 'להבטיח שהמכתב יבוטל';
const String gen_app_peruk29_px1_c95 = 'לייצג בוועדת ערר';
const String gen_app_peruk29_px1_c98 = 'לעודד הריסת גדר של השכן כטקטיקה ראשונה';
// new/dart-data-bs/auto/gen_app_peruk29_rp1_content.dart
const String gen_app_peruk29_rp1_c106 = 'קריאת מכתב, לא ייעוץ משפטי. צו הריסה / כתב אישום / סכסוך גבולות מתמשך — עו״ד.';
```
כלומר: 66 פריטי-תוכן מהמסמך (מסגרת · בלוקים · אדום/צהוב/ירוק · אסור · הסתייגות · דוגמה · חלקי-הדוח) הפכו לקבועי-Dart מתויגים, ולא נשארו בקובץ ה-markdown. מסך-הדוח (`gen_app_peruk29_rp1.dart`) מחולל גם סריאליזציית-טקסט (`reportTextGenAppPeruk29Rp1Screen`) וגם כפתור ייצוא `שליחה בוואטסאפ⇒DsChipButton+waLink`.

### 2.3 · דטרמיניזם ובידוד
- הרצה מלאה שנייה של הרג׳ן שיחזרה את כל פלטי-GENMAX **ביט-לביט** (0 קבצים שונים תחת `dart-gen-bs` / `dart-data-bs` / `apps` / `specs-ds`).
- הוספת פירוק 29 שינתה בסך-הכל **15 קבצים במעקב** — כולם אינדקסים ופלט-«בלגן» (`balagan-index.json`, `peruk-index.json`, `gen_balagan_*`, `TRUTH.md`, `CLAUDE.md`). **אף פלט של פירוק 01–28 לא זז.**
- `dsSpecs()` ב-`regen.mjs` גוזר את רשימת האפליקציות **מהתיקייה**, אז די היה להניח `specs-ds/panui.txt` כדי שהרג׳ן יבנה אותה לבד בריצה הבאה (33 ספקים).

### 2.4 · הרכבה-מהמדף, לא ציור-ביד (הוכחת נתיב C)
מסך היכולת החדשה, כפי שהמנוע הרכיב אותו — **אפס Dart שכתבתי ביד**:
```dart
class GenAppPanuiPx1Screen extends StatelessWidget {
  Widget build(BuildContext context) => DsScaffold(title: …, children: [
    AnimatedBuilder(animation: appStore, builder: (context, _) => ForgeDataGrid(bare: true,
        columns: [c1..c7],
        items: [for (final r in appStore.records('app_panui_ent1')) [ (r[c8] ?? ''), … ]])),
    DsChipButton(label: c16, onTap: () => Navigator.of(context).push(… GenAppPanuiEnt1Screen())),
    AnimatedBuilder(… appStore.records('app_panui_ent1').isEmpty ? EmptyState(label: c18) : SizedBox.shrink()),
    // חלוקה-למצבים פנוי/תפוס — קבוצה + מונה + שורה, הכול מהחיפוש-הפתוח
    DsSection(title: c27 + ' · ' + appStore.records(…).where((r) => (r[c25] ?? '') == c26).toList().length.toString(),
              children: [ for (…) DsNote(message: (r[c22] ?? ''), label: (r[c23] ?? ''), tone: 0) ]),
    // עובדה מספרית: מרחק · מחיר-לשעה
    for (final r in appStore.records(…).where((r) => (r[c40] ?? '').trim().isNotEmpty))
      ForgeStatusChip(items: [[(r[c36] ?? '')]], variants: const <int>[0]),
  ]);
}
```

### 2.5 · שערי-מעבר (guards) על מכונת-המצבים — עובדים, בתחביר הנכון
```
ישות משימה עם כותרת, מבצע | שלבים פתוח, נלקח, סגור | מעברים: נלקח: מבצע
```
⇒ ב-Dart: `_guard(int t, Map<String,String> r)`, וב-`onStage`/`onAdvance`:
```dart
final g = _guard(i, r);
if (g != null) { ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('חסום: ' + g))); return; }
```
עם הנימוק המחולל `'נלקח · מבצע'`.

---

## 3 · מה הוא לא יודע לעשות (מוכח — קלט וּפלט מדויקים)

### 3.1 · לחשב מרחק / גאוגרפיה — אין אטום כזה בכלל
`search-record "מרחק distance km haversine geo מיקום location"` על **1774+850 אטומים** החזיר **5 מועמדים, 2 חזקים**, אף אחד גאוגרפי. סריקה ישירה של `logic-census.json` על `/dist|geo|lat|lng|coord|km|radius|near|haversine/` החזירה רק רעש (`coordinatorBoxes`, `distributionListLines`, `donorConstellation`…) פלוס `hasCoords(double? lat, double? lng) => lat != null && lng != null`.
**מסקנה:** «מרחק ממני» מיוצג במסך כשדה-מספר שמישהו מזין. אין חישוב — והמנוע גם לא המציא אחד.

### 3.2 · `[איתור]` ו-`[חריגה]` — מוכרזים בדקדוק, לא ממומשים ברנדרר
הספק הראשון של panui כלל `חלקיק איש: [איתור]` ו-`חלקיק איש: [חריגה]`. הפלט:
```
🧩 חלקיקים (הכרעה-27): 6/8 נמצאו-ומחווטים
```
ותכנית-החלקיקים מראה `"ok": true`, אטומים נבחרו (`DsSearch`, `FilterChipPill`), אבל `"wired": []`. הסיבה בבייטים: `shapeOf()` ב-`particles.mjs` מזהה `search`/`filter`/`export` (שורות 123–125), אבל ל-`particleWidgets()` **אין ענף** ל-`s.kind === 'search'` / `'filter'` — יש רק `count/sum/avg / − × vs / partition / diff / number / message / dates / raw / act / table / empty / content`.
השער תפס:
```
🔴 particles (panui): 2 חלקיקים לא-פתורים/לא-מחווטים: איתור · חריגה
```
אחרי הסרת שתי השורות: `✓ particles: 464 חלקיקים ב-33 ספקים — כולם נמצאו ומחווטים`.
(אף אחד מ-32 הספקים הקיימים לא משתמש ב-`[איתור]`/`[חריגה]` — הייתי הראשון, ולכן זה לא נתפס קודם.)

### 3.3 · התנגשות-קבצים בין שתי אפליקציות עם אותו משפט+ops+skin
`app-golden-5.json` (Shchuna) כלל `"מעקב חדרים ושעות"` עם `ops:["גריד-שבועי","התנגשות","חסימה"]` — בדיוק כמו `app-golden-4.json` (Yeshiva). שניהם כותבים לאותו קובץ:
```
🔴 appgen: gen_retarget_room_from_rm_pb3f005_ske93605.dart ≠ טרי
```
כי שם-הקובץ נגזר מ-`ישות + מודול-זהב + hash(ops) + hash(skin)` בלבד, וה-`goal` **כן** נכנס לתוכן:
```diff
- // G17c · מטרה … : אפס התנגשויות בחדרי-הלימוד · פעולות-יסוד … ⇒ rm.weekly · rm.clash · rm.holiday   (Yeshiva)
+ // G17c · מטרה … : אפס התנגשויות בחדרי הוועד · פעולות-יסוד … ⇒ rm.weekly · rm.clash · rm.holiday   (Shchuna)
```
זה **מחלקה של באגים, לא מקרה**: קרה לי שוב עם `gen_retarget_family_from_stu_ske93605.dart` (Kehila «מסך משפחות עם כתובת» מול Shchuna). התיקון היחיד הוא לשנות ops או להסיר את המודול הכפול — אין דיסאמביגואציה לפי שם-אפליקציה.

### 3.4 · נתיב A אינו הבנת-שפה — הוא חיפוש-מונח
27 מונחי-ישות ב-`entity-terms.data.json` (21 ישויות). זה הכול. הרצתי את `resolve()` ישירות:

| משפט | ישות שנבחרה | למה |
|---|---|---|
| «משימה שייכת ללקוח» | **Family** (ציון 2) | `לקוח` היא **צורה של** `Family` (`"משפחה/לקוח/בית-אב/לקוחה"`) — «משימה» ו«שייכת» לא קיימות |
| «מעברים: פתוח → נלקח רק אם יש מבצע» | **TzCampaign** (3) | `מבצע` = «מבצע התרמה». כל מכונת-המצבים והתנאי **נעלמו** |
| «מזמין ומבצע» (שני שחקנים) | **TzCampaign** (2) | שוב `מבצע`; «מזמין» לא קיים |
| «רשימת ספקים עם מחירים» | **null** | ⇒ `⚪ "…": אין מונח-ישות במשפט — מקום-שמור (אין המצאה)` |
| «צור ישות משימה עם שדות כותרת, תאריך, סכום, איש קשר, טלפון, סטטוס פתוח או סגור» | **null** | אין אף מונח |
| «מחיר בשח עם עמלה 10%» | **null** | — |
| «כתובת ומרחק ממני» | **null** | — |

הפלט המדויק של הריצה: `✓ ShchunaApp … · ⚪ "רשימת ספקים עם מחירים": אין מונח-ישות במשפט — מקום-שמור (אין המצאה)`.
**זו התנהגות תקינה לפי ההגדרה** ("אין מונח ⇒ מדווח, לא מומצא") — אבל היא גם התקרה: מילה שאינה בטבלה = לא קיימת, ומילה דו-משמעית (`מבצע`) נלכדת לישות הלא-נכונה בלי אזהרה.

### 3.5 · קצוות שפת-האפיון (`app-ds`) — מה נבלע בשקט
הרצתי 8 ספקי-בדיקה (`evidence/probe/specs/p1..p8.txt`, פלט ל-`evidence/probe/out`):

| קלט | מה יצא | הערכה |
|---|---|---|
| `צור ישות משימה עם שדות כותרת, תאריך, סכום, …, סטטוס פתוח או סגור` | שדה ראשון = **`"שדות כותרת"`** (המילה «שדות» נבלעה לתווית) · `סטטוס פתוח או סגור` ⇒ **`type: bool`** ולא enum | ⚠️ שקט |
| `ישות משימה עם … סטטוס{פתוח\|נלקח\|סגור}` | `type: "bool"`, `atom: "AnimatedToggle"`, למרות **3** ערכים | 🔴 באג-קצה: `typeBool` מכיל «סטטוס» וגובר על ה-enum. `שלב{פתוח\|נלקח}` (שם אחר) נשמר `text`+enum |
| `מעברים: פתוח → נלקח רק אם יש מבצע` **כשורה עצמאית** | הפך ל**דשבורד** (`1 דשבורדים`) — כל שורה שאינה ישות/תפקיד = לוח-מדדים | 🔴 נבלע בשקט |
| `מעברים: נלקח: יש מבצע` בתוך שורת-הישות | `guards:[{stage:"נלקח", cond:"יש מבצע"}]` נקלט — אבל `compileGuard` מחפש **תווית-שדה**, «יש מבצע» אינו שדה ⇒ `null` ⇒ **הושמט מה-Dart בלי הודעה** | 🔴 נבלע בשקט |
| `עמלה 10%` | שדה `עמלה` מסוג `text`. ה-10% **נעלם** | 🔴 אין אריתמטיקת-כסף בשפה |
| `מחיר בשח` | `type: "num"` ✅ (בזכות «מחיר» ב-`typeNum`) | ✅ |
| `גובה הגדר במטרים` (peruk29) | `type: "text"` — «גובה»/«מטרים» אינם ב-`typeNum` | ⚠️ נפילה-לברירת-מחדל |
| `מרחק ממני` | `type: "text"`, **וגם נבחר כ-`descField`** של הישות | ⚠️ |
| `ישות עבודה עם מזמין, מבצע, תאריך` (שני שחקנים) | שני שדות-טקסט. אין תפקידים, אין הרשאות | ⚠️ |
| `ישות משימה עם …, לקוח` (קשר) | הקשר **מזוהה** (`1 ישויות-בנות` בניווט), אבל `"relations": false` במניפסט | קשת-שלמות היא **opt-in**: צריך `\| מחיקה: לקוח=מפל` במפורש ⇒ אז `"relations": true` |

### 3.6 · נפילות-לברירת-מחדל בפירוק 29 (איפה המנוע «ניחש»)
- **`descField: "לקוח"`** — לא הוסק מהמסמך. `P.personFields = ["לקוח*","טלפון"]` נדחפים לכל ישות-שורש של כל פירוק.
- **`stages: ["התקבל","שולם","בבדיקה","נמסר","סגור"]`** — קבוע ב-`peruk-lang.data.json`. פירוק 29 מדבר על שעון-30-יום ותשובה למועצה; השלבים הם של תיק-שירות, לא של הליך-אכיפה.
- **`ישות ממצא` + `מחיקה: תיק=מפל`** — נגזרת אוטומטית מעצם קיום `### ירוק/צהוב/אדום`.
- **`שרשרת: []`** — הכותרת `## 12. חיבור לפירוק 2` לא זוהתה. `peruk-lang.sections.chain` מכיל `["שרשרת","הבא","עד כאן","התחלה","הקשר לפירוק","פירוקים"]` אבל **לא** «חיבור לפירוק». זה גם המצב ב-peruk-02 המקורי (`שרשרת 0`) — כלומר סעיף-השרשרת של הבעלים לא נקרא באף פירוק שנבדק.
- **enum-שווא:** `מפת מדידה או תשריט` הפך ל-`{מפת מדידה|תשריט}` — אלה שני מסמכים חלופיים, לא שני מצבים. הכלל «X או Y עם ≤2 מילים כל צד» עיוור להבדל.
- **קטיעה:** `תמונות של הגדר משני הצדדים` ⇒ `תמונות של הגדר משני` (`fieldMaxWords: 4`).
- **נושא שגוי ב«בלגן»:** `"topic": "בית ספר"` — כי `balagan-topics.data.json` מכיל «ועדה» תחת «בית ספר», ופירוק-הגדר מזכיר «ועדת ערר». אין נושא «רשות מקומית».

### 3.7 · הרג׳ן אינו אידמפוטנטי בשכבת `tighten-types` (§1א)
כשל + הרס-נתונים + "ירוק" בריצה השנייה. זה השלב היחיד ברשימת REGEN שמתנהג כך.

### 3.8 · הבחירה של הסוכן אינה נכנסת למחולל
בחרתי ב-`search-record` את `ForgeProfileRowList`, `StatusDotChip`, `PriceChip`, `ForgeEmptyState`.
המסך שנוצר משתמש ב-`ForgeDataGrid`, `DsSection`+`DsNote`, `DsChip`, `EmptyState@premium/feedback`, `ForgeStatusChip`.
**אף אחת מארבע הבחירות שלי לא הגיעה לקוד.** אין דגל `--choose` ב-`app-ds`/`particles`; העור נבחר ע"י `auto-skin.json` (בורר-מכונה: `kpi:ForgeStatPlain … table:ForgeDataGrid … statusChip:ForgeStatusChip`) והאטום-לפעולה ע"י `cover.mjs`. רשומת-החיפוש היא **חובת-הוכחה שחיפשתי**, לא קלט להרכבה.

### 3.9 · `goal-proof` פוטר את כל פלט-המחולל
```js
const GENOUT = /\/gen_[^/]+\.dart$/;
const isScreen = (f) => /^new\/.+\.dart$/.test(f) && !EXEMPT.test(f) && (SCOPE.test(f) || (!SHELF.test(f) && !GENOUT.test(f) && /Scaffold\(|runApp\(|MaterialApp\(/.test(staged(f))));
```
כלומר כרטיס-המטרה שכתבתי ל-`gen_app_panui_px1.dart` הוא **התנדבותי**; השער לא היה דורש אותו. גם עם `git add -A` (120 קבצים ב-staging) הוא ענה `✓ goal-proof: אין מסכים/לוחות ב-staged`. אותו דבר ל-`search-proof` ו-`cross-source` — הם חלים רק על אטומים/מסכים **שנכתבו ביד**.

---

## 4 · איפה יושבת ה«הבנה» — ומה קורה כשהקלט מחוץ לה

| שכבה | קובץ / מקור | גודל | מה היא יודעת |
|---|---|---|---|
| **מודולי-הזהב** | `golden-modules.json` + `quarry-golden.mjs` ⇒ `golden-fragments.json` | **9 מודולים** · 11,980 שורות Dart · **1,668 שברים** (378 תובנות) · round-trip ביט-לביט 9/9 | `schoolos.dart` (inv) · `_students` (stu) · `_attendance` (att) · `_courses` (crs) · `_teachers` (tch) · `_rooms` (rm) · `_fees` (fee) · `_parents` (par) · `_dashboard` (dash) |
| **קטלוג-החלקיקים** | `PARTICLE_IDS`/`PARTICLE_NAMES` ב-`render-module.mjs` | **60 חלקיקים** (25 גנריים + 35 ממודולי-הזהב) | `איתור · חריגה · סיכון · קשר-הורה · רישום · ייבוא · יתרה · הוראת-קבע · חיוב · ייצוא · גיליון · יחס · השלמות · חג/שבת · מגמה · תפוסה · התנגשות · הקמה · טבלה · עומס · הסמכות · לוח-משימות · קשר · שידור · כרטיס · הרשאות · גריד-שבועי · חסימה · טריאז׳ …` |
| **TERM_DEFS** | `entity-terms.data.json` (חצוב מ-maor) | **32 מונחים → 27 עם ישות → 21 ישויות** | `מתנדב · קופה · רכז · מבצע · מוצר · חנות · קריטריון · שיוך · פריט · משפחה/לקוח · בן/בת משפחה · חוג/שיעור/סדנה · מורה/מדריכה · חדר/אולם · תורם/ליד · תרומה · שיבוץ · מסירה · שיחה · חיוג · תיק` |
| **המדף (המחצב)** | `atlas.json` · `atom-index-full.json` · `logic-census.json` | **562 widgets · 857 functions · 2,159 דאטה**; אורקל מאוחד **1,774** (924 תצוגה + 850 לוגיקה); `atom-count`: **5,331 אטומים ב-13 אזורים** | האטומים עצמם |
| **אטומי-forge** | `new/dart-forge-bs/forge-manifest.json` (מ-17 משפחות `pure/*-family.html`) | **359 אטומים · 17 משפחות** | העור |
| **דקדוק-הפירוק** | `peruk-lang.data.json` | ~50 מפתחות | הכותרות/מילות-המפתח בעברית |
| **דקדוק-האפיון** | `spec-lang.data.json` | ~45 מפתחות | `ישות · עם · שלבים · מעברים · מחיקה · חוקים · תפקיד · חלקיק · תוכן · דוח · אפליקציה · עיצוב · שאלה · שרשרת · שכבה` + רשימות-טיפוסים |

**מה קורה כשהקלט מחוץ להן — שלוש התנהגויות שונות, וזו הנקודה החשובה:**
1. **מחוץ לקטלוג-החלקיקים** ⇒ **שגיאה קולנית + רשימת הזמינים** (§1ג). מצוין.
2. **מחוץ ל-TERM_DEFS** ⇒ **`⚪` מדווח בשורת-הסיכום, המודול מדולג** (§3.4). טוב.
3. **מחוץ לדקדוק-האפיון** ⇒ **נבלע בשקט**: תנאי-guard לא-קומפילבילי נעלם, `10%` נעלם, שורת-`מעברים` עצמאית הופכת לדשבורד, `סטטוס{3 ערכים}` הופך ל-bool (§3.5). זו החולשה האמיתית — אין `--strict` שאומר "לא הבנתי את השורה הזו".
4. **מחוץ לאורקל** (מרחק/גאוגרפיה) ⇒ **תלוי בסוכן**: הכלי `search-record --none` אוכף שאסביר, אבל שום שער לא מונע ממני להמשיך בלי היכולת.

---

## 5 · מה נשען על Flutter ולא יכולתי להוכיח כאן

`which flutter dart` ⇒ ריק. לכן **לא הצלחתי להריץ**:

| שער / יכולת | מה הוא היה מוכיח | מה קיבלתי |
|---|---|---|
| `gen-verify.mjs --gate` | שכל 292+ פלטי-המחולל **מרונדרים בפועל** (0 חריגות, ספירת אטומים, טאפים) | `🔴 genverify: פלטי-G4/G5 שלא רונדרו/סחפו: gen_app_kehila.dart, gen_app_shchuna.dart, …` (נכשל גם בעותק-הבסיס) |
| `golden-harness.mjs --gate` | 9 מודולי-זהב מורכבים-מחדש עוברים 87 בדיקות מקוריות | `🔴 goldenharness: נסיגה מ-baseline 9/87 ⇒ 0/0` (נכשל גם בבסיס) |
| `verify-dart-tests.mjs` | הקופסאות הירוקות ב-Dart | `⚠ אפס בדיקות עברו (Dart חסר/שבור?)` |
| `box-proofs-check.mjs` · `mutation-dart-check.mjs` · `synth.mjs --gate` | הוכחות-Dart · בדוק-את-הבדיקה · שקילות JS↔Dart | `🟡 tool=dart — אין בינארי Dart` (הצהרת "אין-כלי ≠ כשל", L34) |
| `balagan-run.mjs` | playwright על האתר הבנוי: «רגע חדש ≤2 הקשות», «שלח» בהקשה אחת | `⚪ אין אתר בנוי … — מדולג` |
| `appgen --gate --test` / `--build` | `flutter test` של בדיקות-הניווט המחוללות · `flutter build web` | לא הורץ |
| `genesis_gen_balagan_facts_test.dart` | חילוץ-עובדות ומזהה-הרגע בצד Dart | **לא הצלחתי להריץ** (הרצתי במקום את `buildIdentifier`/`identify` ישירות ב-node — §1ד) |
| `--picture` אמיתי ל-`goal-card` | רנדר של המסך כראיה (THE-WAY צעד 6) | **מציין-מקום**: PNG 640×420 שיצרתי ב-node/zlib. הכלי בודק magic-bytes+מידות בלבד ולכן קיבל אותו — זו חולשת-שער, ר׳ §3.9 |
| `flutter analyze` על `lib/genesis` | שהקוד המחולל בכלל מתקמפל | **לא הצלחתי להריץ.** כל טענת-קומפילציה בדוח הזה אינה מוכחת |

**חשוב:** `gen-verify`, `golden-harness`, `op-bridge`, `ds-critic` ו-`truth` נכשלים **גם בעותק-הבסיס הנקי** (`evidence/gates-baseline.tsv`). הם לא נשברו בגללי.

---

## 6 · שערים — מה עבר ומה נפל (node בלבד)

מרשם: `machtzev/gates.tsv` = **53 שערים**. הרצתי בפועל **29 סקריפטים עם `--gate`** + **6 עם `--check`** + **10 בודקים נוספים** = 45 הרצות. השוואה: `evidence/gates-baseline.tsv` (עותק נקי) מול `evidence/gates-final.tsv` (אחרי peruk29 + Shchuna + panui).

**ירוקים אחרי כל התוספות (בחירה):**
```
✓ peruk: 29 פירוקים ⇒ 29 ספקים
✓ particles: 464 חלקיקים ב-33 ספקים — כולם נמצאו בחיפוש-פתוח ומחווטים
✓ balagan-one: 31 מודולים … מזהה-הרגע 31/31 · אפס רשימה-סגורה (רצפה 30)
✓ balagan-look: 35/36 ≥ רצפה 35 · אפס-אדומים על 33 אפליקציות-נייר
✓ appgen: TzedakaApp 7 · StudioApp 6 · YeshivaApp 4 · ShchunaApp 3 · KehilaApp 6 — ≡ מחולל-טרי
✓ sentence: 16/16 משפטי-זהב · ✓ retarget · ✓ rendermodule 9/9 · ✓ goldquarry 9/9 round-trip ביט-לביט
✓ autoskin 27 תפקידים · ✓ autologic 26/30 · ✓ core 49 ישויות · ✓ coredart 8 · ✓ shapeops 58/60 · ✓ cover 18/29
✓ opcensus 2330 אטומים ⇒ 38 ops · 0 לא-ממופים · ✓ oracle 1774 (אפס-איבוד) · ✓ compose-determinism 60 חלקיקים
✓ wiring 7575 קבצים אפס הפרות · ✓ contract 1239 אטומים · ✓ pins 133 חתומים · ✓ coverage 99%/99%/100%
✓ datapurity · ✓ no-fakers · ✓ atom-count 5331 (רצפה 3944) · ✓ index-complete 126/195
⚪ entityterms / enumvalues — מדולגים (אין maor-system)
```

**אדומים — כולם כאלה גם בבסיס, אף אחד לא בגלל הפירוק החדש:**

| שער | בסיס נקי | אחרי התוספות | מה זה |
|---|---|---|---|
| `ds-critic` | `🚨 576 מסכים · חוב-עיצוב 721 (צבע-inline:716 · גופן:5)` | `🚨 610 מסכים · חוב-עיצוב 742 (צבע-inline:737 · גופן:5)` | **הרעה של +21** — כל אפליקציה חדשה מוסיפה חוב-צבע-inline. ratchet=shrink ⇒ בטבעת-push זה היה חוסם |
| `gen-verify` | 🔴 | 🔴 (+`gen_app_shchuna.dart`) | דורש Flutter |
| `golden-harness` | 🔴 `9/87 ⇒ 0/0` | 🔴 זהה | דורש Flutter |
| `op-bridge` | 🔴 `op-bridge.json ≠ למידה-טרייה` | 🔴 זהה | חוב קיים |
| `truth` | 🔴 `TRUTH.md סטה מהמדידה החיה` | 🔴 זהה | נפתר ב-`--write` |
| `ds-variants` / `pure-decompose` (`--check`) | 🚨 / ✗ `16 קבצים לא-עדכניים` | זהה | חוב קיים |
| `learn-check` | ✗ `L80: ref blob 294bd1cb… לא נמצא` | זהה | היסטוריית-git חסרה בעותק |
| `free-ref-scan` / `deep-purity-scan` | 🟡 `tool=typescript — חסר` | זהה | `npm ci --prefix machtzev` לא הורץ |

**שער שנפל בגללי — ובצדק (ואז תוקן):**
```
🔴 particles (panui): 2 חלקיקים לא-פתורים/לא-מחווטים: איתור · חריגה     →  ✓ אחרי הסרת השורות
🔴 appgen: gen_retarget_room_from_rm_pb3f005_ske93605.dart ≠ טרי        →  ✓ אחרי שינוי ה-ops
🔴 appgen: gen_retarget_family_from_stu_ske93605.dart ≠ טרי             →  ✓ אחרי הסרת המודול הכפול
```
זו הנקודה החזקה של המערכת: **המשטרה תפסה שלוש טעויות שלי, בשלוש שניות, בלי Flutter.**

---

## 7 · תשובה לשאלת זמן-הריצה (#6)

**אין שום נתיב-קוד שמרנדר `apps/*.json` בזמן-ריצה. הכול מהודר פר-מודול. תשובה חד-משמעית.**

הראיות, על המראה `repos/buildsmart/app_flutter/lib/genesis` (3,808 קבצי Dart):
1. **אין טעינת-נכסים בכלל:** `grep -rn "rootBundle\|loadString"` ⇒ **0 תוצאות**.
2. **אין `jsonDecode` על מניפסט:** היחיד ב-`dart:convert` שמופיע הוא `jsonEncode(snap)` בתוך `appStore.logAction(...)` — צילום-רשומה ל-undo. אין `jsonDecode` בשום מסך מחולל.
   ```dart
   appStore.logAction('del', … , entity: 'app_peruk02_ent1', rid: id, prev: jsonEncode(snap));
   ```
3. **`pubspec.yaml` לא אורז שום JSON:** `assets:` מכיל `assets/lipskey/categories/` ו-`assets/fonts/` בלבד. `apps/*.json` אפילו לא מועתק למראה.
4. **הכול מחלקות סטטיות:** 484 מחלקות `class Gen…Screen` ב-`dart-gen-bs/`. `apps/<ns>.json` נכתב ע"י `app-ds.mjs:302` **רק** כדי ש-`balagan.mjs`/השערים יקראו אותו **ב-node בזמן-בנייה** — הוא לוח-מפתח לשלב הבא של הצנרת, לא קונפיג של האפליקציה.
5. אפילו המחרוזות אינן דינמיות: כל טקסט הוא `const String gen_app_<ns>_<scr>_cNN = '…'` בקובץ-תוכן נפרד, מקומפל.

**המשמעות התפעולית:** פירוק חדש = ריצת-node (0.1s + 0.7s + 0.6s) **ואז בנייה מחדש של האפליקציה**. אי-אפשר להוסיף מודול «בלגן» למכשיר שכבר בשטח בלי deploy.

---

## 8 · מספרים

### קוד
| מדד | ערך |
|---|---|
| מחולל — `machtzev/generator/*.mjs` | **54 קבצים · 11,364 שורות** |
| כל כלי-המחצב — `machtzev/**/*.mjs` | **201 קבצים · 26,594 שורות** |
| Dart מחולל — `new/dart-gen-bs/*.dart` | **610 קבצים · 135,204 שורות** |
| דאטה מחוללת — `new/dart-data-bs/auto/*.dart` | **601 קבצים · 18,863 שורות** |
| **סה"כ פלט מחולל** | **1,211 קבצים · 154,067 שורות** |
| אטומי-forge מחוללים — `new/dart-forge-bs` | 376 קבצים · 24,394 שורות |
| **יחס מחולל→פלט (גנרטור בלבד)** | 11,364 → 154,067 ⇒ **1 : 13.6** |
| **יחס כל-הכלים→פלט** | 26,594 → 154,067 ⇒ **1 : 5.8** |
| **יחס פר-פירוק (peruk29)** | 229 שורות markdown → 93 שורות ספק → **1,738 שורות Dart** ⇒ **1 : 7.6** מהמסמך |
| **יחס פר-יכולת (panui)** | 17 שורות ספק → **1,275 שורות Dart** ⇒ **1 : 75** |

### זמן
| ריצה | זמן |
|---|---|
| REGEN+INDEX מלא (49 שלבים, כולל `tighten` שנופל) | **86.3s** |
| REGEN+INDEX בלי `tighten` (50 שלבים, 33 ספקים) | **56.3s** |
| מתוכו `truth.mjs --write` | 27.4s |
| **המחולל עצמו (בלי truth ובלי tighten)** | **≈ 29s** |
| `peruk.mjs --all` (29 מסמכים) | 0.126s |
| `app-ds` פר-אפליקציה | 0.6–1.0s |
| `balagan.mjs` (31 מודולים) | 0.63s |
| `app-from-sentences` (5 אפליקציות) | 1.5s |
| כל שערי-ה-node (45 הרצות) | ≈ 8 דקות |

### קטלוגים
| מדד | ערך |
|---|---|
| `atlas.json` | widgets **562** · functions **857** · data **2,159** |
| אורקל מאוחד (`atom-index-full` + `logic-census`) | **1,774** (924 תצוגה + 850 לוגיקה) |
| `forge-manifest.json` | **359 אטומים · 17 משפחות** (מ-17 `pure/*-family.html`) |
| `atom-count` (13 אזורים) | **5,331** (רצפה 3,944) |
| קטלוג-החלקיקים (`PARTICLE_IDS`) | **60** |
| מונחי-ישות (`entity-terms`) | 32 מונחים → **21 ישויות** |
| מודולי-זהב | **9** (1,668 שברים · 378 תובנות) |
| **שערים ב-`gates.tsv`** | **53** |
| ספקי-`specs-ds` אחרי הניסוי | **33** (יומן · 29 פירוקים · שכירות · משימות · panui) |
| מודולי «בלגן» | **31** |
| מחלקות-מסך מחוללות במראה | **484** |

---

## 9 · שורה תחתונה

**המחולל הוא מהדר, לא מתורגמן.** תן לו מסמך שנכתב **בשלד** שהוא מכיר, או ספק בדקדוק שהוא מכיר, או פעולות משמות-הקטלוג שלו — ותקבל בשניות אפליקציה שלמה, דטרמיניסטית, מורכבת מאטומים אמיתיים, עם התוכן המילולי של הבעלים בפנים. פירוק 29 עבד בניסיון הראשון: 229 שורות עברית ⇒ 1,738 שורות Dart ⇒ מודול ב«בלגן» שמזהה «המועצה שלחה מכתב על הגדר» בביטחון 0.339 מול סף 0.056.

**הגבול חד:** מחוץ ל-60 החלקיקים / 21 המונחים / ~45 מילות-הדקדוק — או שהוא צועק (הכי טוב), או שהוא מדווח `⚪`, או שהוא **בולע בשקט** (הכי גרוע: `10%`, תנאי-guard, `סטטוס` עם 3 ערכים). ואין באורקל של 1,774 אטומים אף פעולת-מרחק — הבדיקה הזו יצרה ראיה חתומה לכך.

**וה«הבנה» אינה במכונה.** היא בסוכן שכותב את ה-ops, את הפירוק, ואת הספק. המכונה מבטיחה שלושה דברים בלבד, ומבטיחה אותם היטב: **הרכבה מאטומים קיימים · דטרמיניזם · שערים שנושכים.** ההוכחה — שלושת השערים שנפלו עליי היום.
