# 🤝 מסירה · לולאת-המרת-Dart (מצב: 26.8.2026 — 🏁 מאור-הלוגיקה גמור; הבא: 197 בנייה-חכמה)
> **סוכן ממשיך: קרא את זה במלואו, ואז את `CLAUDE.md` + `machtzev/emit/DART-PORTING-RULES.md`.
> אל תמציא — כל הפקודות כאן verbatim. עבוד על ענף `claude/mah-kora-0by8kw` בלבד.**

## 1. מה עושים ולמה (במשפט)
ממירים את קטלוג-מאור מ-JavaScript (`new/atoms/*.mjs`) ל-Dart (`new/dart-maor/*.dart`),
כדי שקטלוג-האימפריה יהיה בשפה-אחת (Dart) → קופסה תחבר מאור+בנייה-חכמה → אפליקציית-טלפון
ניטיבית + web-דרך-מנוע-פליטה. **הכרעת-בעלים 15: כל הלוגיקה ל-Dart לפני שכבת-המסכים.**

## 2. הכלים (קיימים, אל תבנה מחדש)
- **Dart SDK:** `/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/dart-sdk/bin/dart`
  (אם נמחק — הורד מחדש: ‏`curl -fsSL https://storage.googleapis.com/dart-archive/channels/stable/release/3.5.4/sdk/dartsdk-linux-x64-release.zip`)
- **מנוע-פליטה AST:** `node machtzev/emit/ast-js-to-dart.mjs <atom.mjs>` — טיוטת-Dart אוטומטית.
- **פאזר-דיפרנציאלי:** `node machtzev/emit/fuzz-parity.mjs '[["atom-name","num"|"str"]]'` — JS↔Dart על קלטי-קצה.
- **סורק-הפניות:** `node machtzev/emit/free-ref-scan.mjs` — שער-משטרה 7 (אפס-הפניה-חופשית).
- **משטרה:** `node machtzev/police.mjs --fast` — **חובה ירוקה לפני כל commit** (7 שערים).
- **דדופ:** `node machtzev/dedup-atoms.mjs` (מדף) · `node machtzev/dedup-cross-dart.mjs` (מאור↔בנייה-חכמה).
- **11 כללי-המרה שנלמדו-בדם:** `machtzev/emit/DART-PORTING-RULES.md` — הסוכן-הממיר חייב לכבד.

## 3. הזרימה — מנוע-הייצור: K נחילי-אטום-בודד במקביל (L22)
**הסקריפט:** `/root/.claude/projects/-home-user--ai-chat-server/2d086046-4b60-52a1-9aee-58e2962b1958/workflows/scripts/js-to-dart-flow-wf_1c82c1dd-347.js`
כל אטום עובר: **מנוע-AST טיוטה → סוכן מלטש (מחיל 11 הכללים) → זהב (dart --enable-asserts) → אימות-עוין**.

### 3.0 ⚡ תבנית-המקביליות (נמדד 25.8 — L22)
תקרת-Workflow = `min(16, ליבות-2)` **פר-נחיל**, לא גלובלית. המכונה = 4 ליבות ⇒
תקרה **2 בלבד** לנחיל. **לכן: אל תריץ נחיל-אחד-ענק — הרץ K נחילי-אטום-בודד
במקביל**, כולם בהודעה-אחת (K קריאות-Workflow בבלוק אחד ⇒ יורים יחד). כל נחיל
= `args:[אטום-בודד]`. נמדד: 3 נחילים חפפו נקי (day-names 116ש׳ + day-letters
149ש׳ התחילו יחד ב-t≈20ש׳); הגדל את K עד שמופיע throttling-API (הסוכנים
תקועי-IO, לא CPU). נחיל-אחד-של-16 @תקרה-2 = ~24 דקות; K=8 נחילים = חלקי-8.
**הכן K טיוטות מראש** (לולאת ה-node שב-שלב-א׳), ואז שגר K נחילים במקביל.
**קיבוע:** commit+push אחרי שכל K נוחתים (הם כותבים קבצים-שונים ⇒ אפס-התנגשות).
**מתי לא לפצל:** כשחוקי-ההמרה עדיין לומדים (NO-GO חוזרים) — אצוות-רצף מאפשרות
הזרקת-חוק בין-אצוות; משהתכנסו (0-NO-GO רצוף) ⇒ פצל למקסימום.

### שלב א׳ — הכן אצווה (בחר 16 אטומי-מאור טהורים שטרם-מומרו):
```bash
cd /home/user/-ai-chat-server
done=$(ls new/dart-maor/*.dart 2>/dev/null|grep -v _test|sed 's#.*/##;s#.dart##'; ls new/dart-maor/QUARANTINE/*.dart 2>/dev/null|grep -v _test|sed 's#.*/##;s#.dart##'; ls dart-from-maor/*.draft 2>/dev/null|sed 's#.*/##;s#.dart.draft##')
picked=""; c=0
for f in $(ls new/atoms/*.mjs|grep -v test|sed 's#.*/##;s#.mjs##'); do
  echo "$done"|grep -qxF "$f" && continue
  grep -qE 'crypto|fetch|navigator|localStorage|document|await|onSnapshot|requireDb' new/atoms/$f.mjs && continue
  grep -q 'export function\|=> ' new/atoms/$f.mjs || continue
  [ -f "new/atoms/$f.test.mjs" ] || continue
  node machtzev/emit/ast-js-to-dart.mjs new/atoms/$f.mjs > dart-from-maor/$f.dart.draft 2>/dev/null
  picked="$picked $f"; c=$((c+1)); [ $c -ge 16 ] && break
done
git add dart-from-maor; git commit -q -m "אצווה · טיוטות"; git push -q -u origin claude/mah-kora-0by8kw
echo "$picked"|tr ' ' '\n'|grep .|python3 -c "import sys,json;print(json.dumps([l.strip() for l in sys.stdin]))"
```
### שלב ב׳ — שגר את הנחיל (Workflow tool):
`Workflow({ scriptPath: "<הסקריפט-למעלה>", args: [<16-השמות-מהפלט>] })`

### שלב ג׳ — כשהנחיל נוחת (task-notification עם go/nogo):
```bash
DART=/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/dart-sdk/bin/dart
# 1) קבע כל GO ירוק:
for a in <שמות-ה-GO>; do
  [ -f "new/dart-maor/${a}_test.dart" ] && $DART run --enable-asserts "new/dart-maor/${a}_test.dart" >/dev/null 2>&1 \
    && git add "new/dart-maor/$a.dart" "new/dart-maor/${a}_test.dart"
done
# 2) לכל NO-GO — קרא את הסיבה:
#    • אם "האטום תקין, הבדיקה חלשה" (join'' וכו') ⇒ חזק את הבדיקה (אורך+איבר-איבר, כלל-8), הרץ, קבע.
#    • אם "האטום שגוי" (סטיית-התנהגות) ⇒ הסגר: mv ל-new/dart-maor/QUARANTINE/, הוסף שורה ל-QUARANTINE/FIXES.md.
#      אם הבאג מערכתי (חוזר) ⇒ הוסף כלל ל-DART-PORTING-RULES.md + הזרם לפרומפט-הסקריפט.
# 3) שערים + קיבוע:
node machtzev/emit/free-ref-scan.mjs   # חייב "0 עם הפניה"
node machtzev/police.mjs --fast        # חייב "המשטרה ירוקה — 7/7"
git commit -q -m "אצווה N Dart · X GO"; git push -q -u origin claude/mah-kora-0by8kw
# 4) חזור לשלב א׳ לאצווה הבאה + תזמן ScheduleWakeup ~35 דק כרשת-ביטחון.
```

## 4. חוקי-ברזל (L14 + חוקי-החשמלאי)
- **קבע רק שלשה שלמה-וירוקה** (`.dart`+`_test.dart` שעובר dart-test). לעולם לא באמצע-כתיבה.
- **התנהגות זהה-ביט למקור** (חוק-4). אם הפורט סוטה — הסגר, אל תשנה את המקור.
- **אטום = פונקציית-top-level, אפס-import פנימי.** שכן ⇒ שקע-פרמטר או הטמעה.
- **commit+push אחרי כל אצווה.** אף פעם לא להשאיר עץ מלוכלך.
- **מסווג-Bash נתקע לפעמים** ⇒ נסה-שוב או המתן; קריאה תמיד עובדת.

## 5. מצב מדויק (עדכן בכל אצווה)
- **🏁 מאור-הלוגיקה = גמור (26.8).** מאור-Dart בחוזה: **625** · בהסגר: **1** (waitlist-for
  בלבד — אטום-שקע-קולציה לגיטימי, מקביל ל-hebrew-calendar-socket; לא כשל-המרה).
  כל אטום טהור של מאור הומר Dart שקול-ביט (זהב + אימות-עוין מול Node). דוח: `knowledge/CLOSED-MAOR-DART-2026-08-26.md`.
- גבול-IO: ~74 — לא-המרה, שקעים בשכבת-הקופסה.
- **js-compat-reference.dart** (machtzev/emit) — ספריית-העוזרים המאומתת (חוקים 6/7/10/12/13/16/17/18):
  jsTruthy · jsTrim · jsLower · jsStrToNum/jsNum · jsStr · **_expandIntFromDart** (shortest-round-trip
  מורחב, לא toStringAsFixed) · parseV8Local · **jsHeIlInt** (toLocale">he-IL, מרחיב ≥1e21). **jsNum(null)=0**
  (JSON-null≡JS-null; חוק-2 מזהה חסר ב-containsKey). לא מיובאת — מוטבעת inline בכל אטום.
- **בנייה-חכמה: 197 חוטי-Dart ב-`dart-quarry/`** — כבר Dart! רק צריך contract+`_test.dart` ⇒ `new/dart/`
  (בלי מנוע-פליטה — הם כבר בשפה). **זה הבא-בתור.**

## 6. סדר-העבודה (מה-אחרי-מה)
1. ~~סיים אטומי-מאור הטהורים~~ **✅ בוצע — מאור-הלוגיקה גמור (הסגר 1 = שקע-קולציה).**
2. **קדם 197 חוטי-בנייה-חכמה** ל-Dart-חוזה (חוזה+בדיקה, הם כבר Dart) — **הבא-בתור.**
3. **הרץ dedup-cross-dart** — יימצא ליבה-אימפריאלית (יכולות משותפות מאור↔בנייה-חכמה).
4. **הכרע שקע-הקולציה** (waitlist-for + כל localeCompare עתידי) — שקע מוזרק, לא מימוש-פנימי.
5. רק אז: **שכבת-המסכים** (הכרעה-15) → זהב-מלא → cutover (בעלים) → המחולל.

## 7. אסור (הכרעות-בעלים)
- אין push ל-main של הריפואים הישנים בלי אישור-בעלים.
- אין להתחיל מסכים לפני שכל הלוגיקה מומרת (הכרעה 15).
- זהות/סודות = שקע-הצבה, לעולם לא אטום (חוק-6).

## 8. פרוטוקול-חסכוני (הכרעת-בעלים 25.8 לילה — "לצמצם טוקנים בלי לפגוע באיכות ובמהירות")
נמדד: המתכונת-המלאה ≈ ‏170K-טוקנים/אטום (‏5.5M לגל-32). ארבעת-המנופים — **נמדד בפועל בגל 25–26: ‏3.1M לגל-32 ≈ ‏97K/אטום (חיסכון 43%; טריוויאלי ‏68K · מסוכן ‏110K), אפס-אובדן-תפיסה (9 סטיות-אמת נתפסו)**:
1. **ניתוב-לפי-סיכון (במיין-לופ, בחינם):** ‏grep על המקור — ‏Date|sort|toLowerCase|toUpperCase|trim|slice|reduce|parse|Math\.|localeCompare או קובץ ≥20 שורות ⇒ **מסוכן** = ליטוש+אימות-עוין. אחרת (זהות/קבוע/passthrough קצר) ⇒ **טריוויאלי** = ליטוש בלבד, והמיין-לופ מריץ את הזהב בעצמו בנחיתה.
2. **הרצת-השוואה אחת:** המאמת בונה את כל ‏≤10 הקלטים ב-harness-אחד, ‏node פעם-אחת + ‏dart פעם-אחת + ‏diff אחד — לא סבב-פר-קלט.
3. **תקציר-חוקים:** הסוכנים קוראים ‏machtzev/emit/RULES-DIGEST.md (19 שורות) במקום הקובץ המלא; המלא רק כשנתקעים.
4. **מאמת-משולש:** מאמת-אחד לכל אטומי-הנחיל (‏≤3) — קריאת-חוקים אחת.
‏⚠️ אטומי-כסף/תאריכים/מיון תמיד מקבלים אימות-מלא — שם נתפסו כל 20 הבאגים.
‏⚠️ לקח-תשתית: המכולה מתאתחלת בין-רעיונות — ‏commit+push כל נחיתה מיד; קבצים-לא-מקובעים אבדו פעמיים ב-25.8.

## 9. הפרוטוקול-ההיברידי (הכרעת-בעלים 26.8 — "תרשום הכל ולפי זה תעבוד")
נמדד על אטומים-אמיתיים (26.8 לפנות-בוקר):
| מתכונת | עלות/אטום | הערה |
|---|---|---|
| נחיל-מלא | ‏170K | הישן |
| נחיל-חסכוני (§8) | ‏97K | ‏9 סטיות נתפסו — אפס-אובדן-תפיסה |
| **ידני (המיין-לופ עצמו)** | **‏5K** | ‏3/3 ירוק בריצה-ראשונה |

**ההכרעה — לפי-סוג-האטום:**
1. **טריוויאלי** (קבוע/זהות/passthrough/switch-פשוט, בלי תאריך/מספר-גבולי/יוניקוד): **המיין-לופ מתרגם ידנית** — קורא מקור+בדיקה, כותב ‏.dart+‏_test.dart לפי הקונבנציה, מריץ זהב. פי-13 זול, בלי התנעת-סוכן.
2. **מסוכן** (‏Date/sort/toLowerCase/trim/slice/reduce/parse/Math/אריתמטיקה-גבולית או ≥25 שורות): **נחיל-חסכוני** (§8) — ליטוש + מאמת-משולש ‏≤10-קלטים-harness-אחד. העין-השנייה-העצמאית חובה איפה שכסף/תאריכים.
3. סיווג ב-grep במיין-לופ (בחינם): ‏Date|sort|toLowerCase|toUpperCase|trim|slice|reduce|parse|Math\.|localeCompare או ≥25 שורות ⇒ מסוכן.

**הערת-מנוע-הטיוטות (שאלת-בעלים):** ‏ast-js-to-dart.mjs רץ בהכנת-אצוות אך הסוכנים לא-פעם זורקים את הטיוטה וכותבים-מהמקור; במסלול-הידני לא משתמשים בה כלל. שרשרת-הערך האמיתית: מקור-JS + חוזה + בדיקות + 18-החוקים + זהב + אימות-עוין + משטרה. חילול-טיוטות = אופציונלי.
**חוקי-הברזל נשארים:** זהב מורץ-מחדש ע"י המיין-לופ בנחיתה · משטרה 7/7 · ‏commit+push מיד (מכולות מתאתחלות!).
