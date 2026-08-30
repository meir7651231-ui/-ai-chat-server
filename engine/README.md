# המחולל · מנוע נקי (Sentence → UI Engine)

מנוע **דטרמיניסטי** שממיר **משפט בעברית** ל**מסך Flutter עובד** — בלי מודל-שפה, בלי
הזיות, אפס-עלות-פר-חילול, רץ אופליין. אותו קלט מפיק אותו פלט, כל פעם.

> **אפס-דאטה.** שלושת קבצי-הליבה (`generate.mjs` · `atlas.mjs` · `lib.mjs`) אינם מכילים
> שום ידע על שום פרויקט. כל הידע (מילים, roles, טוקנים) והקטלוג (אטומים) מגיעים מבחוץ.
> העיקרון: **"מחק את הקטלוג, העלה קטלוג חדש — המנוע עדיין עובד."**

---

## הפעלה מהירה
```bash
node generate.mjs                      # מחולל את כל ה-specs שבתיקיית specs/
node generate.mjs hello "כותרת שלום"   # שומר spec יחיד ומחולל אותו
```
הפלט: `out/screens/gen_<slug>.dart` (מסך) + `out/data/gen_<slug>_content.dart` (הטקסטים).
דרוש Node.js בלבד. אין תלויות npm.

---

## שלושת הרכיבים שאתה מזין

### 1. קטלוג — האטומים שלך (`catalog/`)
קבצי-Dart. המנוע סורק אותם ובונה קטלוג-חי:
- `catalog/widgets/` — לבנים-ויזואליות (‏`class X extends StatelessWidget/StatefulWidget`); המנוע קורא את שם-המחלקה, ה-props הנדרשים והטיפוסים.
- `catalog/logic/` — פונקציות טהורות (אופציונלי — לגשר-לוגיקה).
- `catalog/data/` — קבועים (אופציונלי).

**אטום = יכולת טהורה:** אפס-דאטה בפנים. צבע/טקסט/מספר מגיעים כ-props מוזרקים. זה מה
שמאפשר למנוע לבחור ולחווט אותו אוטומטית.

### 2. ידע (`knowledge/`)
- `lexicon.json` — **מילת-צורה ⇒ role** (`"כפתור":"button"`). אוצר-המילים שלך.
- `roles.json` — **regex-על-שם-מחלקה ⇒ role** (`"Button" → "button"`). מקשר אטום ל-role.
- `tokens.json` — **שם-prop-צבע ⇒ טוקן-עיצוב** (`"accent" → "Tokens.brand"`).
- `logic-lexicon.json` — כללי-גשר מפורשים (אופציונלי; `{ "rules": [] }`).

### 3. spec — המשפט (`specs/*.txt`)
טקסט עברי רב-שורתי. שורה 1 = כותרת-המסך. כל שורה = רכיב אחד:
```
<מילת-צורה> [מספרים] [אמוג'י] <תווית> [| תת-כותרת] [: אופציה / אופציה]
```
דוגמאות:
```
כפתור התחל עכשיו
כרטיס כותרת | תת-כותרת
נתון 42 פריטים פעילים
בחירה מצב: א / ב / ג
```

---

## איך זה עובד (הצינור)
```
משפט  →  role (lexicon)  →  בחירת-אטום (atlas + pickAtom)  →  חיווט-props (fillProp)  →  Dart
```
1. **parse** — כל שורה מפורקת לחלק: role, תווית, מספרים, אופציות, אמוג'י, תת-כותרת.
2. **atlas** — סריקה סטטית של הקטלוג ⇒ כל אטום עם ה-props שלו.
3. **pickAtom** — ניקוד כל אטום לפי התאמת-role + יכולת-מילוי כל ה-props הנדרשים; הגבוה נבחר. דטרמיניסטי.
4. **fillProp** — מילוי props מהמשפט: צבעים→טוקנים · מספרים→תור-לפי-סדר · טקסט→תווית/תת-כותרת · אופציות→רשימות · פעולות→מטפלים.
5. **emit** — פליטת `StatefulWidget` + קובץ-דאטה נפרד. **שער-טוהר:** אפס טקסט-מקור/אמוג'י בקוד (הכל בשכבת-הדאטה); דליפה עוצרת.

---

## `engine.config.json` — הפניה
| מפתח | תפקיד |
|------|--------|
| `knowledge` · `specs` · `out` | נתיבי הידע, הבקשות, והפלט |
| `catalog.widgets/logic/data` | תיקיות-הקטלוג לסריקה |
| `framework.imports` | שורות-import קבועות לכל מסך (למשל material) |
| `framework.tokenImport` | import לקובץ-הטוקנים |
| `framework.scaffoldBg` · `defaultToken` | טוקן-רקע-המסך · טוקן-ברירת-מחדל |
| `framework.widgetImportPrefix` · `logicImportPrefix` | קידומת-import לאטומים |
| `framework.contentImportPrefix` · `contentImportSuffix` | עטיפת-import לקובץ-התוכן |

**להחלפת פריימוורק/מערכת-עיצוב:** ערוך רק את `framework` ואת `tokens.json` — הליבה לא זזה.

---

## מה זה **לא**
- לא שפה-חופשית מלאה — הקלט הוא **DSL מבוקר** (מילת-צורה + פרמטרים).
- לא מקמפל בשבילך — הפלט הוא קוד-Dart; אתה מריץ `flutter analyze`/`build` בפרויקט שלך.
- לא ממציא אטומים — הוא בוחר מהקטלוג שנתת. יכולת חדשה = אטום חדש + מילה + דפוס.

## מבנה
```
engine/
├── generate.mjs        # הליבה: parse→select→wire→emit + runner
├── atlas.mjs           # סורק-הקטלוג
├── lib.mjs             # עזרי-סריקה (dartScan/classBody/snake/dartLit)
├── engine.config.json  # כל הנתיבים והפריימוורק
├── knowledge/          # lexicon · roles · tokens · logic-lexicon
├── catalog/            # האטומים שלך (widgets/logic/data)
├── specs/              # המשפטים
└── out/                # הפלט (screens/ + data/)
```
