<p align="right"><b>עברית</b> · <a href="#generator-guide-english">English</a></p>

# מדריך קצר: המחולל

<div dir="rtl">

המחולל ב-`engine/` הופך משפט בעברית למסך Flutter. הוא רץ ב-Node בלבד, בלי רשת ובלי מודל-שפה.
כל מה שכאן הורץ ב-6.11.2026 על שכפול נקי של הריפו.

## 1. הרצה על הדוגמה

</div>

```bash
cd engine
node generate.mjs
# 🧬 example · "מסך לדוגמה" · 5/5 חלקים ⇒ ExampleHeader, ExampleButton, ExampleCard, ExampleStat, ExampleBanner
# engine · 1 screens · atlas: 5 widgets · 0 functions · 0 data
```

<div dir="rtl">

הפלט: `out/screens/gen_example.dart` (המסך) ו-`out/data/gen_example_content.dart` (הטקסטים).

## 2. מסך משלך

שורה ראשונה = כותרת המסך. כל שורה אחריה = רכיב אחד, שמתחיל במילת-צורה:

| מילת-צורה | role |
|---|---|
| `כותרת` · `סקציה` | header |
| `כפתור` · `פעולה` | button |
| `כרטיס` · `אריח` · `הירו` | card |
| `נתון` · `מדד` | stat |
| `באנר` · `הודעה` | banner |
| `שורה` | row |

(מתוך `engine/knowledge/lexicon.json`.)

</div>

```bash
cd engine
node generate.mjs hello "$(printf 'מסך שלום:\nכותרת שלום עולם\nכפתור בואו נתחיל\nנתון 7 משימות היום')"
# 🧬 hello · "מסך שלום" · 3/3 חלקים ⇒ ExampleHeader, ExampleButton, ExampleStat
```

<div dir="rtl">

⚠️ הפקודה הזו **כותבת** את `specs/hello.txt` ומחוללת מחדש את כל ה-specs. אם רק ניסית — מחק את `specs/hello.txt` ואת `out/*/gen_hello*` אחר כך.

הטקסטים יוצאים לקובץ-הדאטה, לא לקוד:

</div>

```dart
const String gen_hello_header_label = 'שלום עולם';
const String gen_hello_button_label = 'בואו נתחיל';
const String gen_hello_stat_value = '7';
const String gen_hello_stat_label = 'משימות היום';
```

<div dir="rtl">

## 3. מה קורה כשמילה לא מוכרת

שורה שמילת-הצורה שלה לא ב-lexicon מדולגת, והספירה מראה את זה — למשל `צפרדע ירוקה` נותן `3/4 חלקים`. אין שגיאה ואין ניחוש.

## 4. להרחיב

- **מילה חדשה** ⇒ שורה ב-`knowledge/lexicon.json`.
- **אטום חדש** ⇒ קובץ Dart ב-`catalog/widgets/` + דפוס-שם ב-`knowledge/roles.json`.
- **מערכת-עיצוב אחרת** ⇒ `framework` ב-`engine.config.json` + `knowledge/tokens.json`. הליבה לא זזה.

הפירוט המלא: [`engine/README.md`](../engine/README.md).

</div>

---

<a id="generator-guide-english"></a>

# Short guide: the generator (English)

The generator in `engine/` turns a Hebrew sentence into a Flutter screen. Node only, no network, no language model. Everything here was run on 6 Nov 2026 on a clean clone.

1. **Run the example:** `cd engine && node generate.mjs` → `out/screens/gen_example.dart` + `out/data/gen_example_content.dart` (`5/5 parts`).
2. **Your own screen:** line 1 is the screen title; each next line is one part that starts with a shape word (`כותרת` header · `כפתור` button · `כרטיס` card · `נתון` stat · `באנר` banner · `שורה` row — from `engine/knowledge/lexicon.json`):
   ```bash
   node generate.mjs hello "$(printf 'מסך שלום:\nכותרת שלום עולם\nכפתור בואו נתחיל\nנתון 7 משימות היום')"
   ```
   ⚠️ This **writes** `specs/hello.txt` and regenerates every spec. If you were only trying, delete `specs/hello.txt` and `out/*/gen_hello*` afterwards. All text goes to the data file, not the code.
3. **Unknown word:** a line whose shape word is not in the lexicon is skipped and the count shows it (`3/4 parts`). No error, no guess.
4. **Extend:** new word → `knowledge/lexicon.json` · new atom → a Dart file in `catalog/widgets/` + a name pattern in `knowledge/roles.json` · another design system → `framework` in `engine.config.json` + `knowledge/tokens.json`.

Full detail: [`engine/README.md`](../engine/README.md).
