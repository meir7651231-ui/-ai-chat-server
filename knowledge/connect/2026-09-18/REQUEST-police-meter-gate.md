# בקשת-אישור · שורה אחת ב-`machtzev/police.mjs` (חסם את מדד-היציאה 2)

18.9.2026 · `claude/w-meter-pins-260918` · לעובד הוקצו במפורש **שני** קבצים נעוצים
(`machtzev/mahulal/nl-smoke.mjs` · `machtzev/gates.tsv`); `police.mjs` נמצא ברשימת
**«לא מאושר — דורש פנייה»**. הפנייה הזו.

## הממצא: `gates.tsv` לבדו **אינו** שער — הוא הופך את המשטרה לאדומה

`police.mjs` משווה **דו-כיוונית** בין המרשם לבין הלדג'ר של הריצה:

```
machtzev/police.mjs:53   const registry = new Set(fs.readFileSync(HERE + 'gates.tsv', …))
machtzev/police.mjs:180  for (const id of registry) if (!all.has(id)) { console.error(`🚨 שער רשום שלא רץ ולא דווח: ${id}`); fail = true; }
machtzev/police.mjs:181  for (const id of all) if (!registry.has(id)) { console.error(`🚨 שער רץ שאינו במרשם: ${id}`); fail = true; }
```

רשימת-השערים שרצים היא **קשיחה** בקוד (‏`gate('<id>', '<script>', [args], FAST)`, שורות
119–178) — אין גילוי-אוטומטי. לכן:

* שורה ב-`gates.tsv` **בלי** שורה ב-`police.mjs` ⇒ `🚨 שער רשום שלא רץ` ⇒ **המשטרה אדומה**.
* מדדי-היציאה 2 («שער-ראצ'ט ב-gates.tsv») ו-3 («`police.mjs` מלאה ירוקה») הם
  **בלתי-מתקיימים-יחד** בלי השורה הזו. זו הראיה שהיא נדרשת, לא נוחות.

לכן **לא** הוספתי את שורת-`gates.tsv`: שורה לבדה הייתה מפילה את המשטרה, ודיווח «שער
נוסף» עם משטרה אדומה גרוע מדיווח «חסום».

## הפאץ' המדויק — שתי שורות, בשני קבצים

### 1 · `machtzev/police.mjs` (⛔ **טעון-אישור**) — אחרי שורה 131 (‏`nlcompile`)

```js
gate('meter100', 'mahulal/nl-smoke.mjs', ['--meter', '--gate'], FAST);   // מד-100 · ראצ'ט רק-עולה על חמשת שלבי-הסולם; מודד טרי (פסק-ישן = ירוק-חלול · L110)
```

### 2 · `machtzev/gates.tsv` (✅ מאושר) — שורה חדשה (טורי-TAB)

```
meter100	מד-100 (שלב-0 של PLAN-100 · הפסק sugya_plan): מאה אחוז = כל משפט ⇒ אפליקציה עובדת, לא «כל השערים ירוקים». חמישה שלבים על **כל** הקורפוס (315 יחידות · אסור לצמצם — מכנה שיורד מפיל): מזוהה-כמטרה · צרכים-נגזרו · Dart-נפלט · dart analyze · **עובד מול המטרה** (`dart run --enable-asserts` על `assert(r == <תשובה-מחושבת-מהנתונים>)`). ratchet **רק-עולה** לכל חמשת השלבים; שלב 5 דורש `solved === needs` (מטרה חלקית אינה «עובדת»); שומר אנטי-ריק: הוכחה בלי asserts אינה «עבר»; 0 יחידות ⇒ exit 2 «הכלי שבור, לא הנתונים»	push	mahulal/meter-100-baseline.json;grow
```

## מה נגרר אוטומטית (לא דורש אישור נוסף)

| נגרר | למה | הפקודה |
|---|---|---|
| `machtzev/pins.sha256` | `police.mjs` · `gates.tsv` · והרצפה שנכנסת ל-MANIFEST מעמודה 4 | `node machtzev/pins-check.mjs --write` |
| `TRUTH.md` | שער `truth` משווה מדידה-חיה, וכולל «שערי-משטרה (gates.tsv)» ו-«(police gate())» | `node machtzev/truth.mjs --write` |
| בלוק-האמת ב-`CLAUDE.md` | **פלט של `truth.mjs`**, ו-`pins-check` מנטרל אותו מהחתימה (`canon()`, שורה 38) — אינו «עריכת CLAUDE.md» | (אותה פקודה) |

## ⚠️ ממצא שני: תקרת-הזמן של המשטרה קטנה מהריצה

`POLICE_GATE_TIMEOUT` ברירת-מחדל = **600s** (‏`police.mjs:25`), והריצה המלאה של המד
נמדדה **943.3s** (‏העובד הקודם) — כלומר בטבעת-ה-push השער ייחתך ל-`yellow timeout`
בכל ריצה, וראצ'ט שתמיד צהוב הוא בדיוק הירוק-החלול של L110.

**הדרוש**: `POLICE_GATE_TIMEOUT=1800` בטבעת-ה-push/CI (‏`.githooks/pre-push` ·
`.github/workflows/police.yml`). שניהם ב-`OPTIONAL` של `pins-check`, לא ברשימת-האסור
שלי — אבל הם שינוי-פרוטוקול, ולכן הם כאן ולא בוצעו.

**לא קיצרתי את הקורפוס כדי להיכנס לתקרה.** 315 יחידות, כמו שנמדד.
