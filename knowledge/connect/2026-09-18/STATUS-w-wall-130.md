# STATUS · w-wall-130 — הקיר של 130 היחידות, ומה באמת חוסם אותו

18.9.2026 · ענף `claude/w-wall-130-260918` · בסיס `fb0b723` (‏`claude/up-connect-260917`)

> כל מספר כאן נושא את הפקודה שהפיקה אותו. מה שלא נמדד כתוב «לא נמדד» עם הסיבה.

---

## 0 · תמצית

**הבריף ביקש לדרג 29 שאלות-בעלים לפי ערך. המדידה החזירה שתי תשובות, ושתיהן לא הדירוג
שקיוויתי למסור:**

1. **היום, כל 29 המתגים שווים אפס** — ולא כי המילה העברית חסרה. **שקעי-ישויות-המסך
   מדברים אוצר-מילים אחר מזה שהקושר-שקעים קורא**: החציבה מצהירה `int`/`String`/`bool`
   (טיפוסי-Dart) והקושר בודק `/number/i`, `/date/i` (אוצר-סכמה). גם אילו הבעלים היה
   עונה על כל 29 השאלות, **אף יחידה לא הייתה זזה משלב-1.** זו החיה — אותו דפוס שנתפס
   שלוש פעמים היום: לא חֶסֶר, חוסם.

2. **אחרי סגירת החוסם המפה יוצאת שטוחה, לא מדורגת.** שלוש המחלקות שפותחות משהו פותחות
   את **אותן 15 היחידות בדיוק**, ו-26 הנותרות אפס. כלומר **זהות-הישות אינה המנוף —
   צורת-השקע היא.** אין «11 מול 1»; יש «יש שקע-מספר» (15) ו«אין» (0).

**מה שכן יצא מזה לבעלים, והוא שימושי יותר מדירוג:** אין צורך לענות על 25 שאלות כדי
לזוז. **תשובה אחת** על אחת משלוש המחלקות מזיזה 15 יחידות. ו-**המנוף הגדול באמת הוא
לא מילה בכלל**: 40 מ-73 היחידות תלויות בשקע-**תאריך**, ו-0 מ-29 ישויות-המסך נושאת כזה.

---

## 1 · מה נמדד לפני

הסולם, מקובץ-המדידה של שלב-7 (**לא הרצתי אותו מחדש** — ראה §8):

```
node machtzev/mahulal/nl-smoke.mjs --meter          # 2026-09-18T16:18:39Z · 1436s
  ⇒ 1:175 · 2:45 · 3:45 · 4:45 · 5:44   (14.0%)  · notMeasured 0
```

הפילוח, מ-`knowledge/connect/2026-09-18/meter-100.json`:

```
node -e 'const j=require("./knowledge/connect/2026-09-18/meter-100.json");
  const b={}; for(const r of j.rows.filter(r=>r.stage===1)) b[r.why]=(b[r.why]||0)+1;
  console.log(j.rows.filter(r=>r.stage===1).length, b["אין-ישות"])'
  ⇒ 130  73
```

**ו-73 אומת מחדש בעץ הזה**, לא נלקח מהקובץ — המצב החדש מחשב אותו בעצמו בכל ריצה:

```
node machtzev/generator/tzinor.mjs --screen-map
  ⇒ רצפה: 315 יחידות · 73 על «אין-ישות» (שלב-1)
```

---

## 2 · התוצר הראשי — המפה

### 2א · הפקודה

```
node machtzev/generator/tzinor.mjs --screen-map [--json <out>]
```

מצב חדש ב**מנוע קיים** (`tzinor.mjs`, בעל-הבית של `SCREEN_ENTS` ושל המתג `he`).
מה הוא עושה: לכל אחת מ-29 ישויות-המסך, ולכל אחת מ-73 היחידות, הוא לוקח את
**מילות-ה-∅ של היחידה עצמה** (מילים שנאמרו במשפט ואין להן מקור בשרשרת), מציב אותן
זמנית ב-`he` **בזיכרון בלבד**, מריץ את `goalNeeds` האמיתי, ובודק אם נגזרו צרכים.

**אפס המצאה** (§20-ג · L57): המילה אינה שלי — היא של המשפט. המספר אומר «אילו הבעלים
היה קורא לישות הזאת באחת מהמילים שהמשפט כבר אמר, N יחידות היו עולות לשלב-2». הוא
**אינו** טענה שהמילה נכונה; השאלה המדויקת (`e.ask`) נוסעת עם כל שורה.

**אפס מתג נדלק**: `he` חוזר ל-`null` ב-`finally` בכל בדיקה, והמצב **מאמת את ההחזרה**
לפני שהוא מדפיס — גם בזיכרון וגם מול הדיסק. הפלט מסתיים ב-`✓ הוחזר: 0 מתגים בזיכרון · 0 בדיסק`,
ואם לא — הוא זורק (L110 §5: «רשת-ביטחון נמדדת, לא מוצהרת»).

**ורמינהו לפני כל «שווה 0»** (חובה-4 של הבריף · הכרעה-23): כל ישות שנמדדה באפס פוסקת
על **כל שקע שלה בשמו ובמוצאו**, ומדווחת לפנקס:

```
grep -c "tzinor.screenEntityMap" .maimatai/log.jsonl  ⇒ 25
```

```
tzinor.screenEntityMap · ערך-המתג «AiFinTileItem» (…/ai_hub_screen.g.dart:11) מול 73 יחידות «אין-ישות»
searched: שרשרת-הסכמה (schema-fields ⇒ TYPE_SHAPE) | חציבה (screen-decomp ש8) |
          גשר-אוצרות (entity.mjs TYPE_IN ⇒ sentence.mjs T2) | מילות-∅ של 73 היחידות עצמן
  AiFinTileItem.ic@…:13 → פליגא: טיפוס-Dart «String» אינו באוצר-הסכמה ש-TYPE_SHAPE קורא …
```

‏🔴 **ובדרך נתפס באג בדיווח עצמו:** בריצה הראשונה **אפס** מהלכים הגיעו לפנקס. הסיבה:
שלב-א של המצב (‏`perokGoal` על 315 יחידות) מייצר אלפי מהלכי-מִשנה ב-`soleClassOf`,
ותקרת-הפנקס (‏400) נסגרת **לפני** שמגיעים למהלכים שבשבילם הכלי רץ. זה בדיוק המקרה
שדוקבלוק `rminhu.report` מתאר («התקרה נועדה נגד לולאה, לא נגד הכותרת») ⇒ `always: true`.
בלי הבדיקה הזאת הייתי מדווח «ורמינהו רץ» על פנקס ריק.

**וריצה שנייה נותנת בדיוק אותו דבר** (‏L14: פסק רק על עץ נח):

```
31,111 בדיקות · rows זהים שורה-בשורה · 60 · ✓ הוחזר 0/0      (ריצה 2, אותו עץ)
```

### 2ב · המפה כפי שהיא **היום** (לפני הגשר)

```
node machtzev/generator/tzinor.mjs --screen-map     # 31,871 בדיקות · 1242.8s
```

הריצה הזאת נעשתה **לפני** שהגשר של §3א הותקן (‏`screen-entities.data.json` עדיין בלי
`shape`). הפלט המלא שמור: `knowledge/connect/2026-09-18/screen-map-before.json`.
לשחזורה בעץ הנוכחי צריך להחזיר את אטום-הדאטה לגרסת `fb0b723` — לכן שמרתי את הפלט.

| יחידות שנפתחות | ישויות |
|---|---|
| **0** | **כל 29** |

סה"כ: **0**. וכולן חסומות על אותה סיבה בדיוק, באותו מספר בדיוק — `ישות-בלי-שקע ×1427`.
מספר-חסימה **זהה ל-29 ישויות שונות** הוא בעצמו הראיה: השקעים שלהן לא משתתפים בחישוב כלל.

בדיקה נקודתית שמראה את זה בעיניים (הוצבה, נמדדה, הוחזרה):

```
he: "שואל" על ProposalCardItem ⇒ goalNeeds("מערכת לספרייה: כל ספר עם שם, מחבר, שנה; כל שואל עם שם וטלפון")
  ישות  שואל  cls=ProposalCardItem      ← הישות נבחרה
  שדה   ספר   type=typeNum   slot=-     ← ‏ProposalCardItem.days:int קיים, ולא נקשר
  ⇒ needs 0 · owner: «ישות-בלי-שקע»
```

---

## 3 · החיה — שני אוצרות-מילים לאותו שדה

```
node -e 'const j=require("./machtzev/generator/screen-entities.data.json");
  const t={}; for(const e of j.entities) for(const f of e.fields) t[f.type]=(t[f.type]||0)+1; console.log(t)'
  ⇒ { String: 41, VoidCallback: 23, int: 5, bool: 7, Color: 2, Widget: 1 }

node -e 'import("./new/atoms/schema-fields.mjs").then(m=>{const t={};
  for(const f of m.FIELDS) t[f.t]=(t[f.t]||0)+1; console.log(Object.entries(t).sort((a,b)=>b[1]-a[1]).slice(0,6))})'
  ⇒ [['string',166],['number',71],['Id',52],['boolean',38],['IsoDate',32],['date',15]]
```

והקושר (‏`yeshiva/purpose.mjs:88`):

```js
const TYPE_SHAPE = { typeDate: /date/i, typeNum: /number/i, typePercent: /number/i, typeBool: /bool/i };
```

`/number/i.test('int')` ⇒ **false**. `/date/i.test('String')` ⇒ **false**.
זו בדיוק מחלקת-התקלה של L56 («השוואת סטים משני אוצרות וקריאה לזה כיסוי») ושל L110
(«התאמה לפי שם שזכרתי במקום לפי המקור המוצהר»). לא חֶסֶר-יכולת — חוסם.

### 3א · הגשר — נגזר, לא נכתב

L57 אומר: לפני שכותבים טבלת-מילים במנוע, שואלים **איפה המקור-האמת שכבר מחזיק אותה**.
הוא קיים, בשני חצאים:

```
machtzev/generator/entity.mjs:127   TYPE_IN = { date:['DateTime','String','Object'],
                                                num:['num','int','double','Object','dynamic','String'], … }
machtzev/generator/sentence.mjs:79  T2 = { date:'IsoDate', num:'number', bool:'boolean', text:'string', … }
```

ההיפוך (טיפוס-Dart ⇒ אילו טיפוסי-אפיון מקבלים אותו) מכריע **רק כשהוא חד-משמעי**:

| טיפוס-Dart | טיפוסי-אפיון שמקבלים אותו | הפסק |
|---|---|---|
| `int` · `double` · `num` | num | ⇒ `number` ✅ נגזר |
| `DateTime` | date | ⇒ `IsoDate` ✅ נגזר (‏0 מופעים בישויות-המסך) |
| `String` | date · num · text · multiline | ❌ **רב-משמעי** ⇒ הכרעה-במנוע אסורה (L114) ⇒ `shape:null` |
| `bool` · `VoidCallback` · `Color` · `Widget` | — | ❌ אין שורה ב-TYPE_IN ⇒ `shape:null` |

כל שקע נושא את ה-`how` שלו (L58: «כל שורה נושאת how»):

```
"shapeFrom": "machtzev/generator/entity.mjs:127 TYPE_IN.num ∋ int
              ⇒ machtzev/generator/sentence.mjs:79 T2.num"
```

`bool` **לא נגעתי בו בכוונה**: `TYPE_SHAPE.typeBool` הוא `/bool/i` והוא מתאים למחרוזת
`bool` כמות-שהיא. שינוי שם-הטיפוס שם היה **מבטל** קשירה קיימת — וזו לא התקלה שנמדדה.

### 3ב · מה הגשר מזיז בפועל

```
node machtzev/carve/screen-decomp.mjs --carve-dir new/dart-screens-bs knowledge/assets/screens \
  --out machtzev/generator/screen-entities.data.json
  ⇒ 29 ישויות · 79 שקעים · מונח מוצהר 0/29
    צורת-סכמה נגזרה: 5/79 שקעים (int⇒number)
```

**5 שקעים מתוך 79.** זה הכל, וזה גם התובנה: 41 מ-79 הם `String` (רב-משמעי),
23 הם `VoidCallback` (פעולה, לא ערך). ‏**אפס שקעי-תאריך בכל 29 הישויות** — ולכן
הזרוע הגדולה של הקיר נשארת סגורה גם אחרי הגשר (§4ב).

---

## 4 · מה התביעות **נושאות** — קריאה ישירה של דרישות-המנוע

לא ניבוי. ספירה של מה ש-`goalPsak` **מחזיר** עבור 73 היחידות, בתביעות שאין בהן ישות
ויש בהן מילת-∅ (כלומר תביעה שמתג-ישות יכול היה להיכנס אליה):

```
node knowledge/connect/2026-09-18/probes-w-wall-130/probe4.mjs      # goalPsak על 73 · ספירת r.kind/r.type
  רמז-תאריך      (typeDate)            : 40
  רמז-מספר/אחוז  (typeNum/typePercent) : 35
  קבוע-עם-משווה                        :  1
  אף אחד מהשלושה                        : 15
```

ושלושת אלה הם **בדיוק** שלושת המסלולים שבהם `goalNeeds` גוזר חוזה
(‏סף · שקע-תאריך · אגרגציה). לכן:

### 4א · מסלול-התאריך (40) — **הזרוע הגדולה, ואין לה ישות**

40 יחידות נושאות רמז-תאריך, ו-**אף אחת מ-29 ישויות-המסך אינה נושאת שקע-תאריך**:
0 שדות `DateTime`, וה-`String` שלהן רב-משמעי ולכן אינו נגזר (§3א). זה **לא** נסגר
בגל הזה, וזה הפריט הגדול ביותר שנשאר פתוח. הוא אינו «אין» עיוור — הוא נמדד ונקוב.

### 4ב · מסלול-המספר (35) — זה מה שהגשר פותח, וחלקית

`int ⇒ number` נותן שקע-מספר ל-3 מחלקות. המפה ב-§5 מודדת **כמה מזה באמת נפתח** —
‏15, לא 35. הפער אינו תקלה: חוזה-אגרגציה דורש גם **אות-סימן** (`סכום`/`מונה`/`ממוצע`/
`טבלה` מ-`spec-lang.data.json`), ובלעדיה התביעה יורדת למתג `אגרגציה-בלי-אות-סימן`.

## 5 · המפה אחרי הגשר — והתשובה האמיתית: **המפה שטוחה**

```
node machtzev/generator/tzinor.mjs --screen-map --json knowledge/connect/2026-09-18/screen-map.json
  ⇒ 29 ישויות-מסך מול 73 יחידות «אין-ישות» · 31,111 בדיקות · 1175.5s
  ⇒ סה"כ 60 · ✓ הוחזר: 0 מתגים בזיכרון · 0 בדיסק
```

### 🔴 מה שהמפה מראה, ואינו מה שציפיתי

**שלוש המחלקות שפותחות משהו פותחות את אותן 15 היחידות בדיוק.** לא 15 שונות —
**אותן 15**, שורה-בשורה. כלומר:

> **זהות-הישות אינה המנוף. צורת-השקע היא המנוף.**

כל מחלקה שיש לה שקע-מספר פותחת את אותה קבוצה; שלושתן זהות לעניין הזה, ו-26 הנותרות
שוות אפס כי אין להן שקע בצורה שהקושר קורא. לכן **«המילה הזאת שווה 11 והזאת שווה 1»
אינו קיים כאן** — יש שתי קבוצות בלבד: «יש שקע-מספר» (15) ו«אין» (0).

זו תשובה שלמה לשאלת-הבריף, והיא **לא** הדירוג שקיוויתי למסור. אני מוסר אותה כפי שנמדדה.

וממנה נגזר משהו שימושי יותר מדירוג: **הבעלים לא צריך לענות על 25 שאלות כדי לזוז.**
תשובה **אחת** על אחת משלוש המחלקות האלה מזיזה 15 יחידות; 24 התשובות האחרות מזיזות 0
עד שיהיה להן שקע בצורה מוכרת.

### 5א · הטבלה המלאה

| ישות-מסך | היום | אחרי הגשר | שקעים (‏Dart⇒סכמה) | מוצא |
|---|---|---|---|---|
| `FacetRowItem` | 0 | **15** | label:String · desc:String · count:int⇒number · onTap:VoidCallback | `new/dart-screens-bs/catalog_screen.g.dart:23` |
| `FacetRowItem` ⧉ | 0 | **15** | label:String · desc:String · count:int⇒number · onTap:VoidCallback | `new/dart-screens-bs/gen_combined.g.dart:25` |
| `PipelineRowItem` | 0 | **15** | label:String · count:int⇒number · color:Color | `new/dart-screens-bs/manager_dashboard_screen.g.dart:27` |
| `ProposalCardItem` | 0 | **15** | id:int⇒number · name:String · workerLabel:String · days:int⇒number · onApprove:VoidCallback · onReject:VoidCallback | `new/dart-screens-bs/tasks_screen.g.dart:27` |
| `AiFinTileItem` | 0 | 0 | ic:String · title:String · sub:String · onTap:VoidCallback | `new/dart-screens-bs/ai_hub_screen.g.dart:11` |
| `ApprovalCardItem` | 0 | 0 | name:String · workerLabel:String · onApprove:VoidCallback · onReject:VoidCallback | `new/dart-screens-bs/tasks_screen.g.dart:18` |
| `AxisChipItem` | 0 | 0 | label:String · isSelected:bool · onTap:VoidCallback | `new/dart-screens-bs/catalog_screen.g.dart:40` |
| `AxisChipItem` ⧉ | 0 | 0 | label:String · isSelected:bool · onTap:VoidCallback | `new/dart-screens-bs/gen_combined.g.dart:42` |
| `FinTileItem` | 0 | 0 | ic:String · title:String · sub:String · onTap:VoidCallback | `new/dart-screens-bs/rewards_hub_screen.g.dart:12` |
| `HubTileItem` | 0 | 0 | ic:String · t:String · s:String · onTap:VoidCallback | `new/dart-screens-bs/site_hub_screen.g.dart:24` |
| `KvLineItem` | 0 | 0 | label:String · value:String | `new/dart-screens-bs/worker_report_drilldowns.g.dart:9` |
| `KvRowItem` | 0 | 0 | label:String · value:String | `new/dart-screens-bs/courier_reports_tab.g.dart:11` |
| `ManageRowItem` | 0 | 0 | label:String · value:String | `new/dart-screens-bs/manager_dashboard_screen.g.dart:35` |
| `MatchChipItem` | 0 | 0 | text:String | `new/dart-screens-bs/trade_builder_attribute_schema_editor.g.dart:12` |
| `NotifRowItem` | 0 | 0 | onTap:VoidCallback | `new/dart-screens-bs/worker_notifs_sheet.g.dart:8` |
| `PickerOptionItem` | 0 | 0 | value:String · isSelected:bool · onTap:VoidCallback | `new/dart-screens-bs/lipskey_product_sheet.g.dart:16` |
| `PortalTileButtonItem` | 0 | 0 | title:String · sub:String · onTap:VoidCallback | `new/dart-screens-bs/persona_portal.g.dart:8` |
| `PortalTileButtonItem` ⧉ | 0 | 0 | title:String · sub:String · onTap:VoidCallback | `new/dart-screens-bs/store_dashboard_screen.g.dart:14` |
| `PresetChipItem` | 0 | 0 | label:String · selected:bool · onTap:VoidCallback | `new/dart-screens-bs/courier_certs_screen.g.dart:8` |
| `SavedVersionChipItem` | 0 | 0 | label:String · onLoad:VoidCallback · onDelete:VoidCallback | `new/dart-screens-bs/catalog_screen.g.dart:32` |
| `SavedVersionChipItem` ⧉ | 0 | 0 | label:String · onLoad:VoidCallback · onDelete:VoidCallback | `new/dart-screens-bs/gen_combined.g.dart:34` |
| `SiteHubCaCardItem` | 0 | 0 | child:Widget | `new/dart-screens-bs/site_hub_screen.g.dart:18` |
| `SStatItem` | 0 | 0 | value:String · label:String | `new/dart-screens-bs/store_profile_screen.g.dart:8` |
| `StoreProjectChipItem` | 0 | 0 | label:String · active:bool · onTap:VoidCallback | `new/dart-screens-bs/store_screen.g.dart:27` |
| `StoreSupplierHeaderItem` | 0 | 0 | name:String | `new/dart-screens-bs/store_screen.g.dart:21` |
| `SwatchItem` | 0 | 0 | color:Color · selected:bool · onTap:VoidCallback | `new/dart-screens-bs/studio_panes_theme_pane.g.dart:11` |
| `ThrRowItem` | 0 | 0 | label:String · hit:bool | `new/dart-screens-bs/finance_hub_sheets.g.dart:21` |
| `VacationRowItem` | 0 | 0 | onApprove:VoidCallback | `new/dart-screens-bs/contractor_hr_sheet.g.dart:12` |
| `ValueChipItem` | 0 | 0 | text:String | `new/dart-screens-bs/trade_builder_attribute_schema_editor.g.dart:18` |

**3 מחלקות פותחות · 15 יחידות שונות מתוך 73.** (הטור «אחרי הגשר» מסתכם ל-60 כי `FacetRowItem` נחצבה משני מסכים ⧉ — אותה מחלקה, אותם שקעים, שאלה אחת.)

**`FacetRowItem` — 15 יחידות.** השאלה לבעלים:

> מה השם העברי של FacetRowItem (label · desc · count · onTap) במסך catalog_screen.g.dart?

היחידות (ומילת-ה-∅ שבחרה את הישות): `app_ent8`("הירו") · `improv`("יכולת") · `text`("רכיבים") · `mosad.sentences:57`("קובץ") · `mosad.sentences:73`("מוזמן") · `mosad.sentences:74`("מודעה") · `mosad.sentences:76`("משולח") · `mosad.sentences:96`("תמיכה") · `mosad.sentences:108`("תביעת") · `mosad.sentences:115`("נדר") · `mosad.sentences:116`("קידוש") · `mosad.sentences:137`("קוויטל") · `mosad.sentences:149`("החזר") · `mosad.sentences:158`("עזרה") · `mosad.sentences:184`("נרשם")

**`PipelineRowItem` — 15 יחידות.** השאלה לבעלים:

> מה השם העברי של PipelineRowItem (label · count · color) במסך manager_dashboard_screen.g.dart?

היחידות (ומילת-ה-∅ שבחרה את הישות): `app_ent8`("הירו") · `improv`("יכולת") · `text`("רכיבים") · `mosad.sentences:57`("קובץ") · `mosad.sentences:73`("מוזמן") · `mosad.sentences:74`("מודעה") · `mosad.sentences:76`("משולח") · `mosad.sentences:96`("תמיכה") · `mosad.sentences:108`("תביעת") · `mosad.sentences:115`("נדר") · `mosad.sentences:116`("קידוש") · `mosad.sentences:137`("קוויטל") · `mosad.sentences:149`("החזר") · `mosad.sentences:158`("עזרה") · `mosad.sentences:184`("נרשם")

**`ProposalCardItem` — 15 יחידות.** השאלה לבעלים:

> מה השם העברי של ProposalCardItem (id · name · workerLabel · days · onApprove · onReject) במסך tasks_screen.g.dart?

היחידות (ומילת-ה-∅ שבחרה את הישות): `app_ent8`("הירו") · `improv`("יכולת") · `text`("רכיבים") · `mosad.sentences:57`("קובץ") · `mosad.sentences:73`("מוזמן") · `mosad.sentences:74`("מודעה") · `mosad.sentences:76`("משולח") · `mosad.sentences:96`("תמיכה") · `mosad.sentences:108`("תביעת") · `mosad.sentences:115`("נדר") · `mosad.sentences:116`("קידוש") · `mosad.sentences:137`("קוויטל") · `mosad.sentences:149`("החזר") · `mosad.sentences:158`("עזרה") · `mosad.sentences:184`("נרשם")


### 5ב · למה 15 ולא 35

מ-35 היחידות שנושאות רמז-מספר (§4), חוזה-אגרגציה נגזר רק כשיש גם **אות-סימן**.
וכאן פרט שנמדד: `goalNeeds` אוסף ארבעה סימנים (`pSum` · `pCount` · `pAvg` · `pTable`)
אבל **צורך רק שלושה**:

```
yeshiva/purpose.mjs:482   const hit = sig.sum || sig.avg || sig.count;     // ‏sig.list אינו נקרא
```

ספירה-צדדית שלי (סימן מסוג sum/count/avg בתביעה חסרת-ישות) נותנת **13**, וכולן נפתחו;
ועוד **2** (`improv` · `text`) נפתחו בדרך שהספירה הצדדית שלי לא תפסה. **המנוע הוא
המדידה, הספירה שלי היא אינדיקציה** — ולכן המספר בדוח הוא 15, לא 13 ולא 19.
(‏`sig.list` שנאסף ואינו נצרך הוא ממצא נקוב, לא תיקון של הגל הזה.)

### 5ג · ואזהרה על עמודת «מילת-ה-∅»

המילה בטבלה היא **המילה הראשונה שהבדיקה הציבה והצליחה** — `הירו` · `קוויטל` · `רכיבים`.
היא **אינה הצעה לשם** ואינה טענה שהיא נכונה; היא המפתח שהוכיח שהצירוף עובד.
השם העברי הוא הכרעת-בעלים, והשאלה המדויקת נוסעת עם כל שורה.

---

## 6 · המדגם של 10 — «אין בשום מקור» או «במקור ואינה מגיעה»?

הבריף ביקש לא להכריז «73 חסרות ישות» לפני שבודקים שהישות אינה **נמצאת ופשוט לא מגיעה**.
בדקתי, ולא רק על 10 — על **כל** מילות-ה-∅ של 73 היחידות:

```
node knowledge/connect/2026-09-18/probes-w-wall-130/probe2.mjs      # candidatesFor על כל מילת-∅, ומיון לפי מה שנמצא
distinct ∅ words: 562
  552 | אין מועמד כלל            (0 מועמדים בארבעת מקורות-השרשרת)
    3 | מונח מוצהר · entity=null  (תלמיד · פרויקט · בקשה)
    6 | מועמד רופף (strict=false) (הקלידו⇒Supporter · תפריטים⇒ShopItem · מגבית⇒Family …)
    1 | מועמדי-אמת · הישיבה פסקה  (הרכבתי ⇒ Member/Room)
```

ומדגם-ה-10 עצמו (`probes-w-wall-130/sample10.mjs`, 10 יחידות · 111 מילים): **108 «אינה בשום מקור» ·
3 «במקור»**. ארבע התשובות הפרטניות:

1. **`תלמיד` / `פרויקט` / `בקשה`** — הן **כן** בשרשרת (`entity-terms.data.json`), ונושאות
   `entity: null` **מוצהר**. אימות שזה לא חוסם-בטעות: `Student` · `AyinItem` **אינן**
   מחלקות ב-`schema-fields` (54 מחלקות, נבדק בשם) — כלומר `entity:null` הוא **עובדה
   מוצהרת**, לא קיצור-דרך של `keyToClass`. מתג-בעלים לגיטימי, לא באג.
2. **`הרכבתי`** — 2 מועמדי-אמת (`Member`/`Room`), ו-`entity-psak.json` כבר נושא עליה
   פסק **`לא-ישות`** («התאמת-צורה, לא מונח» · fp `35d972ea04a607e3`, 3 יחידות).
   **הישיבה כבר עבדה כאן.** לא בניתי שנייה, ולא עקפתי.
3. **6 המועמדים הרופפים** נדחו ע"י `strict:false` — התאמת-תאונה, בדיוק מה שהמשמר בנוי לו.
4. **16 מילות-∅ נוספות** נתפסות ע"י מונחי-חבילה שאינם `entity.*`
   (‏`services.ayin.stage.lead("הצעה")` · `digital.nav.calendar("פגישות")` …).
   בדקתי אם המסנן `k.startsWith('entity.')` מסתיר מחלקה אמיתית: **0 מתוכן** מצביעה
   למחלקה קיימת ב-FIELDS. תוויות-שלב אינן ישויות — המסנן צודק.

**מסקנה מדודה: בצד המילים אין חיה.** 98% מהמילים באמת אינן בשום מקור, והשאר מוסבר
בשמו. החיה כולה בצד ה**שקעים** (§3).

---

## 7 · מדדי-היציאה, בכנות

| # | המדד | התוצאה |
|---|---|---|
| 1 | **המפה**: לכל ישות — כמה יחידות ייפתחו, עם הפקודה | ✅ נמסרה · §2ב (היום: 0/29) ו-§5 (אחרי הגשר: 3 מחלקות × אותן 15). **המפה שטוחה, ואני מוסר אותה שטוחה** |
| 2 | **כמה מ-73 ירדו בלי שהודלק אף מתג** | **0** — ומדווח 0. ראה למטה |
| 3 | `nl-smoke` ⇒ 14/0 | ✅ `14` משפטים בונים · `0` כשלים |
| 4 | `tzinor --gate` ⇒ 0 המצאות | ✅ `43 מילות-ישות · 22 לשדות-אמת · 0 המצאות` |
| 5 | `police --fast` ⇒ 0 failed | ✅ `45 ran · 13 skipped · 0 yellow · 0 failed` (ראה §9-א) |

### מדד-2 הוא 0, וזו התשובה המלאה

**אף יחידה לא ירדה מ-73 בלי מתג, ואין דרך שתרד.** «אין-ישות» פירושו שאין מילה בתביעה
שיש לה מחלקת-סכמה; ישות-מסך אינה נבחרת בלי מונח-עברי (‏`if (!e.he) continue`), והמונח
הוא **הכרעת-בעלים**. כל דרך אחרת להוריד את המספר הייתה המצאת-מילה — §20-ג.

וזה **הוכח בבייטים, לא הונח**: שקילות מלאה של `toSwitches` **וגם** `goalNeeds`
(‏`needs` + כל שאלת-מתג) על **כל 315 היחידות**, לפני הגשר ואחריו:

```
node knowledge/connect/2026-09-18/probes-w-wall-130/dump-switches.mjs <worktree@fb0b723>  > eq-base.json   # 2,775,871 בתים
node knowledge/connect/2026-09-18/probes-w-wall-130/dump-switches.mjs <עץ-העבודה>          > eq-new.json    # 2,775,871 בתים
cmp -s eq-base.json eq-new.json  ⇒  ✅ זהה בייט-בבייט
```

**השינוי אינרטי עד שהבעלים ידליק מתג** — בדיוק כמו ש-G64 הוכיח על עצמו.

---

## 8 · מה **לא** נמדד, ולמה

| מה | למה |
|---|---|
| `nl-smoke --meter` (הסולם המלא) לא הורץ מחדש | דורש Flutter, שאינו בקונטיינר; והריצה 1436s. **לא נדרש**: שקילות-הבייטים של §7 מוכיחה ששלבים 1–2 לא זזו על אף אחת מ-315 היחידות, ושלבים 3–5 נגזרים מהם. מספר-הסולם בדוח הוא של 16:18, ואני אומר זאת במפורש. |
| `nl-smoke --compile` (‏35 הירוקים) | Flutter אינו בקונטיינר. `14` הוא מספר הריצה-בלי-קומפילציה ואינו אותו מספר (L110 §4). |
| `police --fast` המלא עם `selftest`/`mutation` | `--fast` מדלג עליהם בהגדרה (`13 skipped`), ומדפיס זאת. סוף-גל מלא לא הורץ. |
| ‏«כמה ייפתחו אם ישות-מסך תקבל שקע-תאריך» | היפותטי כפול (מונח **וגם** שקע שאינו קיים). ‏40 הוא ספירת **מה שהתביעות נושאות** (§4א), לא הבטחה. |

---

## 9 · מה חסום, ועל מה

### 9-א · ‏`learn` היה אדום — והסיבה לא הייתה בקוד

הריצה הראשונה של `police --fast` נתנה `1 failed [learn]` עם 9 שורות `fatal: bad object`.
לפני שכתבתי מילה על זה, הרצתי אותו על **worktree נקי ב-`fb0b723`, אפס שינויים**:

```
(worktree @ fb0b723)  node machtzev/police.mjs --fast
  ⇒ 🚨 44 ran · 13 skipped · 0 yellow · 1 failed · [learn]     ← זהה. קדם-קיים.
```

הסיבה: הקלון **רדוד** (`git rev-parse --is-shallow-repository ⇒ true` · 129 קומיטים),
ובלוב-ה-ANTIPATTERN שכל לקח מצטט אינו בהיסטוריה. `git fetch --unshallow` (‏1414 קומיטים)
⇒ `✅ 45 ran · 0 failed`. **לא קוד, סביבה** — ונרשם כאן כדי שהעובד הבא לא יחפש באג בקוד.

### 9-ב · קבצים נעוצים — לא נגעתי, ולא נדרשתי

`nl-smoke.mjs` · `behavior-plan.mjs` · `census/*` · `particles.mjs` · `police.mjs` ·
`gates.tsv` · `LEARNINGS.md` — **אף אחד לא נגע**. שלושת הקבצים ששיניתי
(`tzinor.mjs` · `screen-decomp.mjs` · `screen-entities.data.json`) אינם ב-`pins.sha256`:

```
grep -n "tzinor\|screen-decomp\|screen-entities" machtzev/pins.sha256  ⇒ (אין)
```

**אין בקשת `pins-write`, ואין הכרעה חדשה.** המספר הגבוה נשאר 32; לא המצאתי 33.

### 9-ג · הרצפה החתומה

לא נגעתי. אין `--seal`, אין `--write-baseline`. הפער הידוע (‏חתום `2:46`, עץ `2:45`)
נשאר כפי שהוא ומחכה להכרעת-בעלים (`DECISIONS-pending.md` סעיף ו).

---

## 10 · ארבע טעויות שעשיתי

**א. הרצתי `nl-smoke` ולא הסתכלתי מה זה עשה לעץ.** הריצה (בלי `--compile`) **כותבת
מחדש** עשרות קבצים ב-`new/dart-gen-bs/` ו-`new/dart-data-bs/auto/` — 45 קבצים,
‏1,294 שורות שנמחקו (‏42 מהם תוצרי-מחולל, 3 שלי), ועוד 11 קבצים חדשים לא-מעוקבים.
אומת פעמיים: `git status` לפני ואחרי כל ריצה, והדלתא זהה. תפסתי את זה רק כש-`git diff --stat`
הפתיע אותי אחרי שהתקנתי את אטום-הדאטה. שוחזר במלואו (`git checkout` + מחיקת הלא-מעוקבים,
‏`git status` נקי). **הלקח הוא בדיוק L110 §5**: פקודת-מדידה שכותבת לעץ צריכה צילום-לפני
ושחזור-מאומת — לא «זכרתי שהיא קריאה-בלבד». זה נכנס לדוח ולא נבלע.

**ב. כתבתי `await` ברמת-המודול ב-CLI החדש.** ‏`import('./behavior-plan.mjs')` בתוך await
עליון תפס את `tzinor` במצב «מעריך», ו-behavior-plan (שמייבא אותו בחזרה דרך `purpose`)
המתין לו — **קיפאון שקט**, `Detected unsettled top-level await`, exit 13, אפס פלט.
נראה בדיוק כמו «הפקודה לא עשתה כלום». תוקן ל-`.then()`, והסיבה כתובה בקוד כדי שלא
תחזור. אותה מחלקה של L110: דילוג שנראה כמו «אין מה למדוד».

**ג. בניתי ספירה-צדדית של «כמה יחידות יכולות להיפתח» — והיא סתרה את המנוע.**
כתבתי `probe3.mjs` (לא נשמר — ראה `probes-w-wall-130/README.md`) שמשחזר בעצמו את תנאי-הגזירה של `goalNeeds` וקיבלתי «19». המנוע
נתן **15** — ולא חופף: 6 שהספירה שלי הבטיחה לא נפתחו (הסימן שלהן היה `טבלה`,
ו-`goalNeeds:482` צורך רק `sum/avg/count`), ו-2 שנפתחו הספירה לא תפסה. **זו L111
מילה-במילה** («פותר אחד, מיוצא, ולא *רק שתי שורות, מהר להעתיק*»), והפעם אני הייתי
הפותר-השני. התיקון: §4 נכתב מחדש כ**קריאה ישירה של `goalPsak`** (מה התביעות נושאות),
והמספרים שבטבלה הם של המנוע בלבד. הספירה-הצדדית נשארת מסומנת «אינדיקציה».

**ד. כתבתי «ורמינהו ⇒ פנקס» ולא בדקתי שהפנקס קיבל.** ‏`grep -c` נתן **0**: התקרה
(‏400) נסגרה בשלב-א של המצב, ו-25 מהלכי-הפסק שבשבילם הכלי רץ **לא נרשמו כלל** —
בדיוק התסמונת שדוקבלוק `rminhu.report` מזהיר מפניה. תוקן ב-`always: true` ונמדד
מחדש (‏25). **הלקח בקצרה: «דיווחתי» זה `grep -c`, לא קריאת-הקוד שכתבתי.**

---

## 11 · מה אני מוסר לבעלים — ‏25 שאלות, לא 29

```
node -e 'const j=require("./machtzev/generator/screen-entities.data.json");
  const by={}; for(const e of j.entities)(by[e.cls]||=[]).push(e);
  console.log("רשומות",j.entities.length,"· מחלקות שונות",Object.keys(by).length)'
  ⇒ רשומות 29 · מחלקות שונות 25
```

ארבע הכפילויות (`FacetRowItem` · `SavedVersionChipItem` · `AxisChipItem` ·
`PortalTileButtonItem`) נחצבו משני מסכים כל אחת ו**נושאות סט-שקעים זהה בדיוק** (נבדק).
‏`candidatesFor` ממזג אותן לפי `cls`, ולכן הן שאלה **אחת** כל אחת. הבעלים צריך לענות
על **25 שאלות, לא 29**.

ומהמפה: **רק 3 מהן מזיזות משהו היום**, ושלושתן מזיזות את אותו דבר. לכן הבקשה אליך
אינה «ענה על 25» אלא:

1. **שאלה אחת, לא 25** — מה השם העברי של **אחת** מ-`FacetRowItem` (‏label · desc ·
   count · onTap) / `PipelineRowItem` (‏label · count · color) / `ProposalCardItem`
   (‏id · name · workerLabel · days · onApprove · onReject)? כל אחת מזיזה 15 יחידות.
   22 השאלות הנותרות אינן דחופות — הן שוות 0 עד שיהיה להן שקע בצורה מוכרת.
2. **והשאלה הגדולה יותר, שאינה מילה:** ‏40 מ-73 היחידות תלויות בשקע-תאריך, ואין כזה
   בשום ישות-מסך. האם לחצוב ישויות-עם-תאריך ממקור אחר, או להצהיר ש-`String` במסך
   מסוים הוא תאריך? **שתי הדרכים הן הכרעת-בעלים, לא הכרעת-מנוע** — ולכן עצרתי כאן.

