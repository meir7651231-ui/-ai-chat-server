<p align="right"><b>עברית</b> · <a href="README.en.md">English</a></p>

<p align="center" dir="rtl"><b>⚡ נסו עכשיו</b> — פקודה אחת, ~2 שניות, Node 22 בלבד (<a href="#רואים-את-זה-רץ">ראו את ה-GIF</a>):</p>

```bash
git clone --depth 1 https://github.com/meir7651231-ui/-ai-chat-server orbit && cd orbit/engine && node generate.mjs
```

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/hero.svg"><img src="assets/hero-light.svg" alt="Orbit Genesis בפעולה: משפט בעברית נכנס, חמישה אטומים נבחרים מהקטלוג ומחווטים, יוצא מסך Flutter" width="100%"></picture></p>

<p align="center">
<img src="https://img.shields.io/badge/Node.js-22-3dff8e?style=for-the-badge&labelColor=0b1018" alt="Node.js 22">
<img src="https://img.shields.io/badge/npm%20deps-0-6aa8ff?style=for-the-badge&labelColor=0b1018" alt="אפס תלויות npm">
<img src="https://img.shields.io/badge/status-feature%20freeze-ffb020?style=for-the-badge&labelColor=0b1018" alt="סטטוס: הקפאת פיצ'רים">
<img src="https://img.shields.io/badge/quick%20start-~45s-3dff8e?style=for-the-badge&labelColor=0b1018" alt="התחלה מהירה: כ-45 שניות, נמדד">
</p>

<h3 align="center" dir="rtl">כל חוט עם חוזה. שום דאטה צרובה. שום יכולת לא הולכת לאיבוד.</h3>

<p align="center" dir="rtl"><a href="#הבעיה">הבעיה</a> · <a href="#איך-זה-עובד">איך זה עובד</a> · <a href="#רואים-את-זה-רץ">הדגמה</a> · <a href="#המספרים">המספרים</a> · <a href="#מה-בפנים">מה בפנים</a> · <a href="#מה-זה-לא-עושה">מה זה לא עושה</a> · <a href="#התחלה-מהירה--60-שניות">התחלה מהירה</a> · <a href="#מסמכים">מסמכים</a> · <a href="#סטטוס">סטטוס</a> · <a href="#שאלות-נפוצות">שאלות</a></p>

---

<div dir="rtl">

## הבעיה

שלוש מערכות חיות — **maor**, **buildsmart** ו-**yoman** — גדלו מהר, וכל אחת צרבה בתוך הקוד שלה טקסטים, מספרים והקשר.
קוד כזה עובד, אבל אי אפשר להעביר חלק ממנו לפרויקט אחר בלי לשנות אותו, ואי אפשר להרכיב ממנו פיצ'ר חדש באופן אוטומטי.

**Orbit Genesis הוא הבנייה-מחדש הנקייה:** הקוד הישן פורק לעשרות אלפי אטומים רשומים, וכאן נבנה עץ חדש רק מאטומים טהורים
וקופסאות חיווט — לקראת **המחולל**: משפט בעברית ⇒ פיצ'ר מורכב מהקטלוג.

</div>

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/beforeafter.svg"><img src="assets/beforeafter-light.svg" alt="לפני: קוד עם טקסט ומספרים צרובים, נעול לאפליקציה אחת. אחרי: אטום טהור, הדאטה מוזרקת, שמיש בכל מקום" width="100%"></picture></p>

<div dir="rtl">

## איך זה עובד

</div>

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/how.svg"><img src="assets/how-light.svg" alt="מקור ישן ← מחצבה ← אטומים ← קופסאות ← לוח-אם ← מחולל; המשטרה בודקת כל שלב" width="100%"></picture></p>

<div dir="rtl">

1. **מחצבה** (`machtzev/`) — מחלצת מהמקור הישן טיוטות-אטומים.
2. **אטום** (`new/atoms/`) — יכולת טהורה אחת: קוד + חוזה + בדיקה. בלי דאטה בתוכו (ראו `PURPOSE.md`).
3. **קופסה** (`new/boxes/`) — רק חיווט בין אטומים.
4. **לוח-אם** (`new/board.*`) — מחבר את הקופסאות למערכת אחת.
5. **המחולל** (`engine/`) — מנוע דטרמיניסטי שממיר משפט בעברית למסך Flutter, בלי מודל-שפה.
6. **המשטרה** (`machtzev/police.mjs`) — 13 שערים (חיווט, חוזה, טוהר, סינתזה, כיסוי, חתימות ועוד) שחייבים להיות ירוקים לפני כל commit.

פירוט מאומת: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · החוקים: [`LAW.md`](LAW.md) · המטרה: [`PURPOSE.md`](PURPOSE.md).

## רואים את זה רץ

הקלטה של ריצה אמיתית (6.11.2026, Node 22, בלי `npm install`): בדיקת חיווט ← בדיקת חוזים ← בדיקת לוח-האם ← המחולל קורא משפט ומוציא מסך Dart.

</div>

<p align="center"><img src="assets/demo.gif" alt="הקלטת טרמינל: wiring-check, contract-check, board test, ואז generate.mjs ממיר את engine/specs/example.txt למסך gen_example.dart" width="100%"></p>

<div dir="rtl">

## המספרים

</div>

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/numbers.svg"><img src="assets/numbers-light.svg" alt="נמדד 6.11.2026: 6,514 קבצים בלי הפרות חיווט; 1,239 אטומים עם חוזה ובדיקה ירוקה; 39 טענות לוח-אם עוברות; 0 תלויות npm" width="100%"></picture></p>

<div dir="rtl">

כל מספר כאן נמדד בהרצה, לא הוערך. הפקודות — ב[התחלה מהירה](#התחלה-מהירה--60-שניות).

## מה בפנים

| תיקייה / קובץ | מה יש שם |
|---|---|
| `new/` | העץ החדש: אטומים, קופסאות, לוח-אם, ושכבות Dart |
| `machtzev/` | המחצבה והמשטרה: חילוץ, בדיקות, לקחים (`LEARNINGS.md`), הכרעות (`DECISIONS.md`) |
| `engine/` | המחולל — משפט ⇒ מסך ([README](engine/README.md)) |
| `runtime/` | ריצת-Dart של האטומים |
| `box-drafts/` | תוכניות-קופסה ומד-מוכנות (`READINESS.md`) |
| `dart-from-maor/` · `dart-quarry/` | טיוטות Dart שהומרו מהמקור |
| `screens-seed/` | זרעי-מסכים להרכבה |
| `design/` | עמודי עיצוב ומיתוג של Orbit |
| `knowledge/` | תוכניות, סיכומים ומסמכי סגירה |
| `docs/` | ארכיטקטורה, מדריך המחולל, ו-`handoff/` — מסמכי העברה שאין אליהם הפניות |
| `.github/` | תבניות ל-issue ול-PR (אין workflows) |
| `meron/` | תיק-תכנון נושאי לניהול אירוע מירון (HTML, נושא לקובץ) — [README](meron/README.md) |
| `WIRING.md` | מפת-החיווט החיה (מחוללת אוטומטית — לא לערוך ידנית) |
| `HANDOFF-MASTER.md` · `HANDOFF-DART-CONVERSION.md` | מסמכי העברה שמסמכים אחרים מפנים אליהם (נשארים בשורש) |

## מה זה לא עושה

- **זה לא שרת ולא אפליקציה שרצה.** אין כאן שירות לפרוס; זה עץ-קוד, כלים ובדיקות.
- **המחולל לא משתמש במודל-שפה** ולא "מבין" עברית חופשית — כל שורה מתחילה במילת-צורה (`כפתור`, `כרטיס`…) שממופה דרך אוצר-מילים (`lexicon.json`) לאטום מהקטלוג. מילת-צורה שלא באוצר-המילים לא תמופה.
- **לא מחליף את המערכות החיות.** maor, buildsmart ו-yoman ממשיכים לרוץ מהריפו שלהם; המעבר (cutover) מתוכנן הפיך, לפי חוק 7.
- **לא מבטיח שמסך מחולל עובר `flutter analyze` כאן** — מבחן-הקומפילציה רץ בתוך buildsmart, לא בריפו הזה.
- **לא מכיל סודות, זהויות או חיבורים** — אלה מוזרקים בזמן הצבה (חוק 6).
- **אין כרגע CI** — הבדיקות רצות ידנית או בסשן.

## התחלה מהירה · 60 שניות

</div>

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/install.svg"><img src="assets/install-light.svg" alt="שלושה צעדים: שכפול, בדיקה עם Node 22, הרצת המחולל. בלי npm install" width="100%"></picture></p>

<div dir="rtl">

דרוש Node.js 22 בלבד. אין `npm install` — הכלים משתמשים רק במודולים המובנים של Node.

</div>

```bash
git clone --depth 1 https://github.com/meir7651231-ui/-ai-chat-server orbit && cd orbit

(cd engine && node generate.mjs)         # המחולל: משפט ⇒ מסך
node machtzev/wiring-check.mjs ./new     # חוקי-החיווט על העץ החדש
node --test new/board.test.mjs           # בדיקת לוח-האם
node machtzev/contract-check.mjs ./new   # לכל אטום: חוזה + בדיקה ירוקה
node machtzev/police.mjs --fast          # המשטרה המהירה (לפני כל commit)
```

<div dir="rtl">

**נמדד ב-6.11.2026** משכפול נקי, Node 22.23, מכונה עם 4 ליבות:

| שלב | זמן |
|---|---|
| `git clone --depth 1` | 2.3 שנ׳ |
| המחולל | 0.05 שנ׳ |
| בדיקת חיווט | 0.2 שנ׳ |
| בדיקת לוח-האם | 0.15 שנ׳ |
| בדיקת חוזים (מריצה 1,239 בדיקות) | 40.6 שנ׳ |
| **סה"כ מ-clone עד ארבע בדיקות ירוקות** | **כ-44 שנ׳** |

`police.mjs --fast` לא נכלל בזמן — הוא אדום כרגע (ראו [סטטוס](#סטטוס)).

רוצים מסך משלכם? [`docs/GENERATOR.md`](docs/GENERATOR.md).

## מסמכים

| מסמך | מה בו |
|---|---|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | השכבות, החוקים והמחולל — רק מה שנבדק |
| [`docs/GENERATOR.md`](docs/GENERATOR.md) | מדריך קצר: מסך משלכם תוך דקה |
| [`ROADMAP.md`](ROADMAP.md) | מה נעשה, מה בעבודה, מה מתוכנן |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | איך תורמים — ענפים, חוזים, משטרה |
| [`CHANGELOG.md`](CHANGELOG.md) | אבני-הדרך |
| [`SECURITY.md`](SECURITY.md) | ריפו ציבורי, אפס סודות, דיווח פרטי |
| [`LAW.md`](LAW.md) · [`PURPOSE.md`](PURPOSE.md) | החוקה והמטרה |

## סטטוס

- 🧊 **הקפאת פיצ'רים** (הכרעת-בעלים D5, נובמבר 2026) — עבודה רק על תיקונים, סדר ותיעוד.
- ✅ חיווט: 6,514 קבצים, אפס הפרות · ✅ חוזה: 1,239 אטומים · ✅ לוח-אם: 39 טענות עוברות.
- 🔴 `police.mjs --fast` אדום כרגע בשער-הסינתזה (שקילות JS↔Dart). התיקון ממתין ב-PRs טיוטה #2–#4.
- ענף-העבודה הראשי: `claude/mah-kora-0by8kw`. אין כרגע CI אוטומטי בריפו.
- מה הלאה: [`ROADMAP.md`](ROADMAP.md) · היסטוריה: [`CHANGELOG.md`](CHANGELOG.md) · אבטחה: [`SECURITY.md`](SECURITY.md).

## שאלות נפוצות

<details><summary><b>למה אין כאן קוד-לגאסי?</b></summary>

הריפו נולד ריק ב-24.8.2026. כל קובץ נכנס דרך המחצבה, עם חוזה ובדיקה. הקוד הישן נשאר בריפו המקוריים.
</details>

<details><summary><b>מה זה "אטום טהור"?</b></summary>

יחידת-קוד שעושה דבר אחד ואין בה שום דאטה צרובה — לא טקסט, לא מספר קבוע, לא שם. הדאטה מוזרקת משכבת-הדאטה, ולכן אותו אטום משרת כל מטרה בלי שינוי.
</details>

<details><summary><b>המחולל משתמש במודל-שפה?</b></summary>

לא. המנוע ב-`engine/` דטרמיניסטי: אותו משפט מפיק אותו פלט, אופליין, בלי עלות לכל הרצה.
</details>

<details><summary><b>מה ההבדל בין המשטרה כאן ל-agent-police?</b></summary>

`machtzev/police.mjs` היא משטרת-הבנייה של הריפו הזה בלבד: 13 שערים, מחיווט וחוזה ועד טוהר וחתימות. היא לא מוצר נפרד ולא תוסף.
</details>

<details><summary><b>למה המשטרה אדומה אם החיווט והחוזים ירוקים?</b></summary>

שער-הסינתזה משווה פלט JS לפלט Dart, ושם יש פער בהדפסת רשימות (`[א, ח, ת]` מול `א,ח,ת`). זה בודק, לא אטום — והתיקון ממתין לאישור ב-PRs #2–#4.
</details>

<details><summary><b>למה שם הריפו לא תואם את התוכן?</b></summary>

השם הוא שריד מהגדרה מוקדמת. שינוי שם הוא הגדרת-ריפו, והוא ממתין להכרעת הבעלים.
</details>

<details><summary><b>מאיפה מתחילים לקרוא?</b></summary>

`LAW.md` ← `machtzev/LEARNINGS.md` ← `machtzev/AGENT-CODE.md` ← `machtzev/DECISIONS.md`. הסדר המלא ב-`CLAUDE.md`.
</details>

</div>
