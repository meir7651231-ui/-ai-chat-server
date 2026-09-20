# מפת הישיבה — מה היא יודעת, מה מחובר, ואיפה השער החסר

> **מחקר בלבד. אפס שינוי קוד.** כל מספר כאן נושא את הפקודה שהפיקה אותו.
> מה שלא נמדד כתוב «לא-נמדד» עם הסיבה.
>
> * ישיבה: `meir7651231-ui/yeshiva-engine` @ `598f0d827df10c2940a20d6fb21d48cd0582936b` (‏main, מאומת מול CLAUDE.md)
> * מחולל: `-ai-chat-server` @ `99d14a1`, ענף `claude/r-yeshiva-map-260919`
> * הישיבה **לא הייתה בקונטיינר** — `add_repo` + `git clone --depth 1` ⇒ `/home/user/yeshiva-engine`
> * שני הריפואים נשארו **נקיים**: `git status --porcelain` ריק בשניהם בסוף (למעט `.maimatai/` שהוא gitignored)

---

## תקציר — חמש השורות שחשובות

1. **הישיבה חיה ועובדת.** ‏`234 passed in 22.94s`, והדלת למחולל מחזירה פסק ב-**90ms**.
2. **מחובר בפועל: 5 מודולים מתוך 17** (‏terms · engine · knowledge · trace · dialectic). נמדד ב-`sys.settrace`, לא הוערך.
3. **המחולל לקח את המְתָרֵץ ולא את המַקְשֶׁה.** ‏`maimatai.py` — שכבה-1, המנוע ששואל — **נטען ואפס קריאות-פונקציה**.
4. **השערים: הטענה «המחולל מימש את (ג) בלבד» — אמת, ונמדדה.** שער (א) ושער (ב): אפס מופעים בכל הריפו.
5. **ההשערה על שער (א) — אושרה בניסוי.** צילום-הבסיס תופס מחיקה של 45 קבצים **לא-מנוהלים ב-git**, שה-`git diff` לא רואה.
   ובדרך מצאתי **שלושה באגים מאותה משפחה בתוך הישיבה עצמה** — פקודות-תצוגה שמוחקות את הראיה. לא תיקנתי; רשומים למטה.

---

## שאלה 1 — מה הישיבה יודעת לעשות

17 מודולים · 6,572 שורות. **הרצתי את כולם.** ‏`</dev/null` על כל פקודות ה-CLI (‏`gate` נתקע בלעדיו על `json.load(sys.stdin)`).

| # | מודול | שו׳ | מה הוא עושה | קלט | פלט | הפקודה | רץ? |
|---|---|---|---|---|---|---|---|
| 1 | `gate.py` | 2209 | **השער**: 15 תת-פקודות. עוצר את הסוכן, נועל, מצלם בסיס, פוסק | prompt/hook-JSON ב-stdin | חסימה (exit 2) / שאלות / פסק | `python3 -m yeshiva.gate detect "…" </dev/null` | ✅ |
| 2 | `maimatai.py` | 995 | **שכבה-1 — המקשה**: גלאים על צורת המשפט ⇒ שאלות | `Statement` + `World` | `Question[]`, רקורסיה עומק-3 | `PYTHONPATH=. python3 -m examples.brachot_2a_maimatai` | ✅ |
| 3 | `daf.py` | 481 | סורק ש"ס מ-Sefaria ⇒ מהלכים ⇒ זרעים | מסכת.דף | `daf/ledger.json` · `seeds.json` | `python3 -m yeshiva.daf scan FILE` | ✅ |
| 4 | `mefarshim.py` | 447 | **שכבה-3**: 26 מפרשים ⇒ 22 צורות ב-16 משפחות | פרק/עמוד | `mefarshim_ledger/profile.json` | `python3 -m yeshiva.mefarshim profile` | ✅ |
| 5 | `shut.py` | 386 | **שכבה-4**: 19 משיבים · 17 מהלכים (על-השאלה / על-התשובה) | סימן | `shut_ledger/profile.json` | `python3 -m yeshiva.shut profile` | ✅ |
| 6 | `dialectic.py` | 358 | **שכבה-2 — המהלכים**: קושיא · חילוק · אוקימתא · חקירה · צריכותא · ק"ו · בנין אב | `KnowledgeBase` | `Kushya/Terutz/…` | דרך `engine` | ✅ |
| 7 | `poskim.py` | 346 | **שכבה-5**: 9 חיבורים · 19 מהלכי-הכרעה | סימן | `poskim_ledger/profile.json` | `python3 -m yeshiva.poskim profile` | ✅ |
| 8 | `rashi.py` | 303 | **המנוע השני**: 20 מהלכי-רש"י — מהלכים של **פלט** | עמוד | `rashi_ledger.json` | `python3 -m yeshiva.rashi status` | ✅ |
| 9 | `terms.py` | 200 | אבני-יסוד: `Source`(דרגה 1–6) · `Case` · `Claim` · `Rule` · `Geder` | — | טיפוסים | דרך `engine` | ✅ |
| 10 | `shiura.py` | 187 | ברכות ב: — זיהויים מתנגשים, `collapse_test` · `place` · `check_siman` | `Dispute`/`Identification` | קריסות ותירוצים | `PYTHONPATH=. python3 -m examples.brachot_2b` | ✅ |
| 11 | `engine.py` | 187 | **המנוע**: `sugya()` מריץ סוגיא · `ask()` = "בעי" ⇒ הלכתא/תיקו | `KnowledgeBase` | `Trace` / `Answer` | `python3 -m yeshiva` | ✅ |
| 12 | `knowledge.py` | 152 | המאגר: `claim` · `rule` · `chakira` · `derive` · `outcome` | טענות | הכרעה למקרה | דרך `engine` | ✅ |
| 13 | `moves.py` | 126 | המהלכים כמבני-נתונים (dataclasses) | — | טיפוסים | דרך `dialectic` | ✅ |
| 14 | `mine.py` | 105 | **כורה המהלכים**: צורות-פתיחה מדורגות לפי **פיזור** ולא כמות | מטמון-טקסטים | `daf/candidates.json` | `python3 -m yeshiva.mine gemara 5` | ⚠️ רץ, 0 מועמדים |
| 15 | `trace.py` | 50 | פרוטוקול: סימן + עומק ⇒ `render()` / `to_dict()` | צעדים | טקסט/JSON | דרך `engine` | ✅ |
| 16 | `__init__.py` | 35 | ה-API הציבורי (‏ומייבא את `maimatai` — ראה שאלה 3) | — | — | — | ✅ |
| 17 | `__main__.py` | 5 | הדגמה: ברכות ב. | — | סוגיא | `python3 -m yeshiva` | ✅ |

**מצב הקורפוס — נמדד** (`python3 -m yeshiva.<m> status`), והוא **גמור**:

```
דפים: 5348 (אחרון: נדה 73.)          ← כל הבבלי
רש"י — עמודים: 5413, בלי רש"י: 381
מפרשים — יחידות: 475/475
שו"ת — תשובות: 5493; חלקים: 35/35
פוסקים — יחידות: 7764; חלקים: 30/30
```

לכן `next` בכל ארבע השכבות מחזיר «סיימנו את הש"ס» / «סיימנו את כל החיבורים» — **לא תקלה, סיום**.

**הוכחה שהסורק עדיין חי** (הפנקס גמור, אז סרקתי דף חי — `scan` הוא טהור, אפס כתיבה):

```bash
python3 -m yeshiva.daf scan /tmp/.../b2a.txt      # ברכות ב. מ-Sefaria
⇒ מאימתי[בנוי: היכא קאי] · מעשה[מעשה רב] · מאי שנא · איכא דאמרי · אי הכי ·
  הא גופא קשיא · אמר מר · פשיטא · והא כתיב[ורמינהו] · ממאי …  (17 מהלכים)
```

**בריאות כוללת:** `python3 -m pytest -q` ⇒ `234 passed in 22.94s` · `pytest arena -q` ⇒ `38 passed`.

---

## שאלה 2 — השכבות, והסדר ביניהן

השאלה «מה שתיים ואחת?» נענית — אבל התשובה חושפת ש**יש שני צירים שונים ששניהם קרויים «שכבה»**, וזה מקור הבלבול.

### ציר א׳ — חמש שכבות-החשיבה (ה-README, «שכבה ראשונה … חמישית»)

| שכבה | מודול | התפקיד | מה היא מוסיפה על שקדמה לה |
|---|---|---|---|
| **1** | `maimatai.py` | **המקשה** | מקבלת **משפט** (לא דינים מוכנים) ומולידה שאלות מ**צורתו**. בלי זה אין על מה לדון |
| **2** | `terms`+`knowledge`+`dialectic`+`engine`+`moves`+`trace` | **המתרץ** | מקבלת טענות עם **מקור בדרגה** ומיישבת סתירות: חילוק · אוקימתא · מחלוקת · ק"ו · בנין אב ⇒ הלכתא או תיקו |
| **3** | `mefarshim.py` | **המפרשים** | לא *מה* לענות אלא **איך שואלים ואיך סוגרים**. 26 מפרשים · 22 צורות |
| **4** | `shut.py` | **שו"ת** | האדם האמיתי שואל בניסוח שלו. מהלכים **על השאלה** (פירוק, הנחת-השואל, ראובן ושמעון) לפני התשובה |
| **5** | `poskim.py` | **פוסקים** | **להכריע ולשתוק**: לכתחילה/בדיעבד · שעת הדחק · במה דברים אמורים · שיעור · צריך עיון |

הסדר אינו שרירותי — הוא **מסלול של משפט אחד**: נשאל (1) ⇒ יושב (2) ⇒ מנוסח היטב (3) ⇒ מותאם לשואל האמיתי (4) ⇒ **מוכרע ונגמר** (5).

### ציר ב׳ — חמש שכבות-הכרייה (‏`mine.LAYERS`, ותג `layer=` בזרעים)

```
LAYERS = { gemara, rashi, mefarshim, shut, poskim }     # yeshiva/mine.py:25
layer="…" בזרעים:  rashi · mefarshim · shut · poskim    # gemara = ברירת-המחדל (layer: None)
```

כאן `daf` ו-`rashi` הם **קורפוסים**, לא שכבות-חשיבה. **«המנוע השני» של רש"י אינו «שכבה שנייה»** — זה ציר אחר: `daf` הוא המנוע-הסורק הראשון, `rashi` השני. ‏`daf` שואל על **המשפט**, ‏`rashi` על **התשובה** (מהלכי-פלט).

**איך שתי המערכות נפגשות:** כל חמש שכבות-הכרייה כותבות לאותו `daf/seeds.json`, והשער מגיש אותן כשאלות מתויגות. נמדד:

```bash
python3 -m yeshiva.gate detect "תבנה דף נחיתה ואחר כך תחבר לדיוור" </dev/null
⇒ מאן קתני · מנא לן · מאי שנא ברישא · מאי · מאי נפקא מינה · איכא דאמרי
  היכי דמי  [זרע מהדף]      ותסברא [זרע מהדף]    מיתיבי [זרע מהדף]
  רש"י: לפיכך [זרע מרש"י — על התשובה]            רש"י: כגון [זרע מרש"י]
```

זה **הציר-ב׳ מוזרם לתוך שכבה-1** — הקורפוסים מלמדים את המקשה מה עוד לשאול.

---

## שאלה 3 — 🔴 מה מזה מחובר למחולל בפועל

### הדלת קיימת, והיא **עובדת** — נמדד

```
yeshiva/ask.mjs:71   spawnSync(python3, [ask.py], { PYTHONPATH: <yeshiva-engine> })
yeshiva/ask.py:58    from yeshiva import Case, KnowledgeBase, YeshivaEngine, source
```

ריצה חיה שכתבתי (‏`t-ask.mjs`, קורא ל-`askYeshiva`):

```
yeshivaHome() = /home/user/yeshiva-engine
available=true ok=true wall=90ms
outcome: [{"law":"זכאי","outcome":false}]   trace steps: 5 | sugya steps: 7
```

ועוד יותר חשוב — **השער שמוודא שהפסק-שבדיסק ≡ ריצה טרייה עבר ירוק**:

```bash
YESHIVA_LEDGER_CAP=100000 node yeshiva/entity-psak.mjs --gate
🕯️ הישיבה (/home/user/yeshiva-engine): 21 תשובות · 103ms
📊 7 מילים · הלכתא 4 · לא-ישות 2 · תיקו 1 · בלי-פסק 0
✅ ראצ'ט-טריות: הפסק שבדיסק ≡ ריצה טרייה (7 מילים)      [exit=0]
```

**תיקון לנקודת-המוצא שקיבלתי:** «`tzinor.mjs:375` קורא פסק מקובץ בדיסק ולא מהישיבה החיה» — נכון עובדתית, אבל **זו החלטה מוצהרת, לא נתק**. ‏`tzinor.mjs:362-364` מנמק מילה-במילה: *«אחרת המחולל היה מתנהג אחרת בקונטיינר עם ישיבה ובקונטיינר בלעדיה — הבאג-השקט של L110»*, ‏`--gate` מאמת ≡. הרצתי את השער והוא ירוק. **הישיבה כן מכריעה; היא פשוט מכריעה בזמן-`--write` ולא בזמן-רינדור.**

### איזה מודול כל קובץ **באמת** מפעיל

מדידה קשיחה — `sys.settrace` על **אירועי-`call` בלבד**, כששלב-הייבוא רץ מחוץ למדידה:

```
FUNCTION CALLS DURING THE RUN (import excluded):
   terms.py      35 · engine.py 9 · knowledge.py 6 · trace.py 5 · dialectic.py 1
   maimatai functions actually called: NONE
NEVER LOADED (9 of 17): __main__, daf, gate, mefarshim, mine, poskim, rashi, shiura, shut
```

| מודול-ישיבה | מחובר? | דרך מי | ואם לא — מה היה נותן |
|---|---|---|---|
| `terms.py` | ✅ **מופעל** (35 קריאות) | `ask.py` ⇒ `entity-psak.mjs:190` | — |
| `engine.py` | ✅ **מופעל** (9) | ↑ | — |
| `knowledge.py` | ✅ **מופעל** (6) | ↑ | — |
| `trace.py` | ✅ **מופעל** (5) | ↑ (ה-trace נשמר ב-`entity-psak.json`) | — |
| `dialectic.py` | ✅ **מופעל** (1) | ↑ | — |
| `moves.py` | 🟡 נטען, dataclasses בלבד | ↑ | — |
| `maimatai.py` | 🟡 **נטען ואפס קריאות** | `__init__.py` מייבא; אף אחד לא קורא | **שכבה-1: השאלות על משפט-הבעלים.** היום `goalPsak` מרים «∅» ומדווח לפנקס; ‏maimatai היה מוליד *מאן קתני · מנא לן · מאי שנא ברישא · לימא · פשיטא* על **כל ספק**, ובצורה — לא במילון |
| `gate.py` | ❌ לא נטען | — | שערים (א)+(ב)+(ד)+(ה), נעילה, צילום-בסיס. **ראה שאלה 4** |
| `shiura.py` | ❌ לא נטען | — | `collapse_test` — שני מועמדים שהם למעשה אותו דבר ⇒ «היינו ר' מאיר!». בדיוק הכפילות שה-`dedup` מחפש ביד |
| `daf.py` | ❌ לא נטען | — | הזרעים — 108 סוגי-שאלה שנקנו מ-5,348 דפים |
| `rashi.py` | ❌ לא נטען | — | 20 מהלכי-**פלט** — «לפיכך», «כגון»: כלל בלי דוגמה לא הובן |
| `mefarshim.py` | ❌ לא נטען | — | איך שואלים ואיך סוגרים (22 צורות) |
| `shut.py` | ❌ לא נטען | — | מהלכים **על השאלה** — פירוק, הנחת-השואל, «אם כנים הדברים» |
| `poskim.py` | ❌ לא נטען | — | **ההכרעה**: לכתחילה/בדיעבד · במה דברים אמורים · שיעור. היום כל תיקו עולה לבעלים |
| `mine.py` | ❌ לא נטען | — | כרייה אוטומטית של צורות חדשות |

**השורה התחתונה: 5 מתוך 17 (29%) מופעלים בפועל. המחולל לקח את המְתָרֵץ ולא את המַקְשֶׁה.**

### הקבצים בצד המחולל — מה כל אחד מפעיל

| קובץ | מפעיל איזה מודול-ישיבה | מדידה |
|---|---|---|
| `yeshiva/ask.py` | `KnowledgeBase` · `YeshivaEngine` · `Case` · `source` | `grep "^from yeshiva" ask.py` ⇒ שורה 58 |
| `yeshiva/ask.mjs` | ↑ דרך `spawnSync` | `wall=90ms`, ok=true |
| `yeshiva/entity-psak.mjs` | ↑ — **הקורא היחיד** של `askYeshiva` | `grep -rn askYeshiva --include=*.mjs` ⇒ שורה 190 בלבד |
| `machtzev/generator/tzinor.mjs` | **אפס** — קורא `psak/entity-psak.json` מהדיסק (שורה 375) | במכוון (‏שורות 362-364) |
| `yeshiva/purpose.mjs` | **אפס** — `psak`/`question` מגיעים מ-`soleClassOf`, כלומר מהקובץ | שורה 287 |
| `yeshiva/rminhu.mjs` | **אפס פייתון** — מימוש-JS עצמאי של שער (ג) | `HAD/PLIGA/LO` בשורות 39-41 |

**פיזור שכבת-הוורמינהו — נמדד מחדש:** ‏`44` קבצים **מייבאים** את `rminhu.mjs` (‏`grep -rn "import .*from '[^']*rminhu\.mjs'"`), ‏`47` מזכירים אותו. נקודת-המוצא אמרה 42 — הפער הוא 3 קבצי-`probe` חדשים מ-18-19.9 ועוד `ask.mjs`. **זה השער היחיד שהתפשט.**

---

## שאלה 4 — שלושת השערים, ואיפה (א) צריך להיכנס

### תיקון ראשון: ה-README מתאר **חמישה** שערים, לא שלושה

| שער | README | מה הוא עוצר | במחולל? |
|---|---|---|---|
| (א) **מאימתי** | שורה 3 | לפני שחושבים — נעילה עד 3 תשובות + **צילום-בסיס** | ❌ **אפס** |
| (ב) **ממאי** | שורה 14 | לפני שפועלים לפי מסקנה — דילמא · לימא · סימן | ❌ **אפס** |
| (ג) **ורמינהו** | שורה 27 | לפני שינוי של דבר קיים | ✅ **44 מייבאים** |
| (ד) **פסק המכונה** | שורה 187 | אחרי — `police.mjs` פוסק, לא הסוכן | 🟡 `machtzev/police.mjs` קיים, אך **ללא** `--baseline` של חתימות-עץ |
| (ה) **מנא הני מילי** | שורה 204 | עובדה בפלט שלא הייתה בבקשה | ❌ אפס |

### אימות «אפס» — דרך ורמינהו, כנדרש

```bash
grep -rn "dilma|דילמא|lima|לימא|leshitato|לשיטתו|mimai" --include=*.mjs machtzev/ yeshiva/
⇒ 0 תוצאות                                       # שער (ב)
grep -rn "detect(|--arm|guard.mjs|מאימתי" --include=*.mjs machtzev/ yeshiva/
⇒ 0 רלוונטיות                                    # שער (א)
```

ה«baseline» היחיד במחולל הוא **רצפת-ratchet של שער** (‏`coverage-baseline.json`, `wired-floor.json`) — **לא** חתימת-sha256 על העץ לפני נגיעה. הבדל-המהות, לא הבדל-שם.

ארבעת ה«אין» נרשמו בפנקס ואומתו שהגיעו (רול-3):

```
map-yeshiva.gateA      sources=4  verdicts=['לא שייך', 'פליגא']
map-yeshiva.gateB      sources=1  verdicts=['לא שייך']
map-yeshiva.door       sources=3  verdicts=['חד שיעורא', 'לא שייך']
map-yeshiva.maimatai   sources=7  verdicts=['חד שיעורא', 'לא שייך', 'פליגא']
```
(‏`YESHIVA_LEDGER_CAP=100000` — התקרה המובנית היא 400 ו`reported().capped` דיווח `0 נחתכו`.)

### 🔴 ההשערה על שער (א) — **אושרה בניסוי**, ובצורה חזקה מהצפוי

מה שגייט (א) עושה בפועל (‏`gate.py:1537-1541`), נמדד בעותק-חד-פעמי:

```
echo '{"prompt":"תשפר את המנוע"}' | python3 -m yeshiva.gate prompt
⇒ סימן: עמימות (5 שאלות-ליבה לא נענו), החלטת תכנון — מצב שאלות.
⇒ 13 שאלות, כולל [זרע מהדף] ו-[זרע מרש"י]
.harness/baseline.txt   112 קבצים חתומים          ← לפני שנגעו
.harness/ARMED.json                               ← המשמר דרוך
state: {'locked': True, 'harness': True, 'armed': True, 'base': '598f0d82…'}

echo '{"tool_name":"Edit",…}' | python3 -m yeshiva.gate check   ⇒ exit=2  "השער נעול"
python3 -m yeshiva.gate clear --qa … ×3                         ⇒ "השער נפתח"
echo '{"tool_name":"Edit",…}' | python3 -m yeshiva.gate check   ⇒ exit=2  "ממאי — עצור"
```

**הניסוי המכריע.** בניתי עץ-דמה, צילמתי בסיס, ואז הרצתי «משימה» שמוחקת קבצים:

```
45 קבצים מנוהלים-ב-git + 45 קבצים מחוללים (לא-מנוהלים)
node police.mjs --baseline        ⇒ 📌 בסיס נשמר: 60 קבצים
<מחיקה של 30 מנוהלים + 45 מחוללים>
git diff HEAD --diff-filter=D     ⇒ רואה 30            ← git לבדו מפספס את המחוללים
node police.mjs                   ⇒ | in_scope | ❌ |
                                    **מחוץ לרדיוס:** gen/g1.txt (נמחק) · gen/g10.txt (נמחק) …
                                    **no_deletions:** 30 קבצים נמחקו
                                    ## פסק: **NOT DONE** — חסר: in_scope, no_deletions
```

**זו הראיה.** ‏«הרצתי משהו ואחר כך גיליתי שהוא מחק 45 קבצים» ו-«`{write:false}` לא חסם, נמחקו 30» — שניהם נתפסים. ושים לב למה שרק **הבסיס** תופס ו-git לא: **קבצים מחוללים שאינם ב-git**. זה בדיוק הפרופיל של תוצרי-המחולל.
עוד פרט: `baseline.txt` נכתב עם דגל `i` (immutable) — הסוכן אינו יכול לזייף את הראיה נגד עצמו.

### **איפה בדיוק (א) צריך להיכנס** — `file:line`

השרשרת, כפי שמדדתי אותה:

```
app-ds.mjs:348-349   ← המשפט-בעברית נכנס מהדיסק/argv   (הגבול החיצוני)
        ↓
🎯 yeshiva/purpose.mjs:246   export function goalPsak(sentence, origin)
        ↓                     ← **המשפך היחיד.** כל צרכן עובר כאן:
        ├─ yeshiva/purpose.mjs:403   goalNeeds()      → behavior-plan.mjs:665 (perokGoal)
        ├─ yeshiva/purpose.mjs:567   purposeDoc()
        ├─ machtzev/generator/tzinor.mjs:611          (classOf/soleClassOf)
        └─ yeshiva/entity-psak.mjs:156
        ↓
particles.mjs ⇒ behavior-compose.mjs
```

**התשובה: `yeshiva/purpose.mjs:246`, בראש `goalPsak`.**

ארבע סיבות, כל אחת מדודה:

1. **זה המשפך היחיד.** כל ארבעת הצרכנים (‏`goalNeeds` · `purposeDoc` · `tzinor:611` · `entity-psak:156`) עוברים דרכו. שער אחד כאן מכסה את כל השרשרת; שער ב-`particles` או ב-`behavior-compose` מאחר — ההנחות כבר נקרשו ל-`requirements`.
2. **המקום כבר יודע להודות שהוא לא יודע.** ‏`purpose.mjs:252-270` כבר מזהה «אין תביעה» ומדווח לוורמינהו על כל מילה. **החסר אינו הזיהוי — הוא הנעילה.** היום ה-∅ נרשם בפנקס והשרשרת **ממשיכה**.
3. **התיקו כבר קיים ואין מי שיעצור עליו.** מדדתי `תיקו 1` מתוך 7 מילים ב-`--gate`. הישיבה אומרת «לא איפשיטא», והמחולל ממשיך.
4. **צילום-הבסיס שייך לכאן דווקא** — זו הנקודה הראשונה שאחריה נכתב תוצר. ‏`app-ds.mjs:348` מוקדם מדי (לא כל ריצה בונה); ‏`particles` מאוחר מדי.

**מה זה אומר מעשית** (לא ביצעתי — זו הכרעת-בעלים):
`goalPsak` פותח ב-`police --baseline` על עץ-הפלט ⇒ מריץ את `detect` של שכבה-1 על `sentence` ⇒ אם יש ≥3 שאלות-ליבה בלי מענה **או** תיקו-בישיבה — **עוצר ומחזיר את השאלות**, במקום להמשיך עם ברירת-מחדל שקטה.

---

## מה לא הצלחתי להריץ, ולמה

| מה | מה הודיע | למה |
|---|---|---|
| `daf/rashi/mefarshim/shut/poskim next` | «סיימנו את הש"ס» / «סיימנו את כל החיבורים»; ‏`daf next 1` ⇒ `✗ Niddah 73b: HTTP Error 404` | **לא תקלה** — הפנקס בסוף הש"ס (נדה 73.). רשת ל-Sefaria **כן** עובדת (בדקתי ישירות) |
| `python3 -m yeshiva.mine` | `## gemara: 0 מועמדים` | המטמון `.maimatai/daf` הוא **gitignored** ⇒ ריק בקלון-טרי. הכורה לא יכול לרוץ בקלון-טרי **בשום מצב** |
| `yeshiva.gate done` | — | **לא הרצתי במכוון.** מגיש פסק-מכונה; המשימה שלי היא מחקר ואין מה לפסוק. לא נחסמתי |
| `guard.mjs --arm` בקלון האמיתי | — | **לא הרצתי במכוון** (חוק 4). בדקתי אותו **בעותק** בסקרצ׳פד ומחקתי |
| `bench.score` | — | דורש ענף-תוצר וקריאות-מודל. ‏`bench.report` כן רץ: 44 ריצות של `fable` |
| `python examples/X.py` כפי שה-README כותב | `ModuleNotFoundError: No module named 'yeshiva'` | **ה-README שגוי**: הרצת-סקריפט מוסיפה את `examples/` ל-`sys.path`, לא את השורש. עובד עם `PYTHONPATH=. python3 -m examples.X`. ירוני לאור כלל «תיעוד = טענה» שב-README עצמו |

---

## שתי טעויות שעשיתי

### 1. הרצתי `daf status` בהנחה שהוא קורא — והוא מחק את הראיה

`status` נשמע לקריאה. הוא **כותב**. מדדתי אחרי שהשוויתי מול git:

```
asked counters lost: 105   changed counters lost: 20
state downgrades: 5   (היכי דמי · ותסברא · מיתיבי · רש"י: לפיכך · רש"י: כגון   ער → ניסיון)
```

וגרוע מזה: **הפלט שהדפסתי כבר היה המצב ההרוס.** ‏`cmd_status` מאפס ואז מדפיס, אז ה-`(0/0)` שראיתי בכל הזרעים הוא **התוצאה של הריצה שלי**, לא מצב-העולם. ‏שחזרתי ב-`git checkout -- daf/`. אילו הייתי מדווח «כל הזרעים 0/0 — הישיבה מעולם לא למדה», הייתי מדווח על נזק שאני גרמתי כאילו היה ממצא. **זו בדיוק המשפחה שהבעלים תיאר: «המדידה דרסה את הראיה של לפני».**

### 2. מדדתי קודי-יציאה דרך צינור, וקיבלתי «הצלחה» על שבעה כשלונות

הרצתי `python3 examples/X.py 2>&1 | head -25; echo "[exit=$?]"` — ו-`$?` הוא של `head`, לא של python. כל שבעת ה-examples הדפיסו `[exit=0]` בזמן ש**כולם** נפלו ב-`ModuleNotFoundError`. הבחנתי רק כי קראתי את הפלט. תיקנתי ל-`out=$(cmd); ec=$?`.

---

## באגים שמצאתי — **לא תיקנתי**, רשומים בלבד

כולם באותה משפחה, וכולם **בתוך הישיבה עצמה**: פקודה ששמה מרמז על קריאה גוזרת-מחדש מדד מקור-נתונים **שאינו ב-git**, ומוחקת את התוצאה המחושבת שכן ב-git.

| # | איפה | מה קורה | הראיה |
|---|---|---|---|
| **B1** | `daf.py:440` (`cmd_status`) ⇒ `daf.py:304` (`update_seed_states`) ⇒ `gate.py:76` (`seed_stats`) | `seed_stats()` קורא את `.maimatai/log.jsonl` — **gitignored**. בקלון-טרי הוא ריק ⇒ `stats.get(key, (0,0))` מחזיר אפס לכולם ⇒ המונים נדרסים והמצבים מודחים. `seeds.json` **כן** ב-git | 105 `asked` + 20 `changed` + 5 הדחות, מדוד |
| **B2** | `mefarshim.py rescan` (וזהה ב-`daf`/`rashi`/`shut`/`poskim`) | «נסרקו מחדש 475 יחידות מהמטמון» — **ממטמון ריק**. מדפיס **הצלחה** ומוחק את הפנקס | `git diff --stat` ⇒ `daf/mefarshim_ledger.json | 75089 +++---- (4565 insertions, 70524 deletions)`; `מהלכים שנראו: 0 מתוך 42` |
| **B3** | `mine.py:101` (`_save(OUT, result)`) | `result` מכיל רק את השכבות שנכרו; הכתיבה **דורסת את כל הקובץ** במקום למזג | `mine gemara 5` (‏0 מועמדים) ⇒ `candidates.json` מ-444 שורות ל-3 |
| **B4** | `daf.py:440` | `cmd_status` כותב ל-`seeds.json` **בלי `locked()`**, בעוד `learn()` (שורה 271) כן נועל. ההערה שם: *«ארבע השכבות כותבות לאותו seeds.json; שתי ריצות במקביל דרסו זו את זו»* — ‏`status` הוא בדיוק כותב-חמישי בלי מנעול | קריאת-קוד; לא הרצתי מרוץ |
| **B5** | `README.md` (‏`python examples/X.py` ×4) | הפקודה המתועדת נכשלת ב-`ModuleNotFoundError` | 7/7 נפלו; עובד עם `PYTHONPATH=.` |
| **B6** | `machtzev/census/engine-index.mjs:69,76` | סורק `/home/user/yeshiva-engine-repo/` — **לא קיים כאן**; ומצהיר `/home/user/yeshiva-engine` כ«העתק-ישן, 5 בלבד זהים למקור». אבל זה בדיוק הנתיב ש-`ask.mjs:43` מוצא ומפעיל בהצלחה, והקלון שלי הוא `598f0d82` = main המאומת | `ls -d /home/user/yeshiva-engine-repo` ⇒ לא קיים; `engine-index.mjs` ⇒ `מנועים: 374 · yeshiva 9` (9 = קבצי-המחולל, לא 17 מודולי-הישיבה) |

**המסקנה שמחברת את B1–B3 לשאלה 4:** הישיבה בנתה שער שמצלם את העץ לפני שנוגעים — ו**שלוש פקודות בתוך הישיבה עצמה מוחקות ראיות בלי שהשער הזה חל עליהן**, כי הוא חל על *הסוכן*, לא על *המודולים*. מי שיטמיע את שער (א) ב-`purpose.mjs:246` ירוויח גם את זה: הבסיס תופס מחיקה בלי קשר למי מחק.

---

## נספח — כל הפקודות שהרצתי

```bash
# הבאת הישיבה
git clone --depth 1 https://github.com/meir7651231-ui/yeshiva-engine /home/user/yeshiva-engine
git -C /home/user/yeshiva-engine rev-parse HEAD        # 598f0d827df10c2940a20d6fb21d48cd0582936b

# שכבה-2 והדוגמאות
python3 -m yeshiva
PYTHONPATH=. python3 -m examples.{brachot_2a_maimatai,task_maimatai,brachot_2b_maimatai,refund_policy,dragon_parking,brachot_2b,brachot_next10}

# השער
python3 -m yeshiva.gate {detect "…",stats,log,gufa "…",kasad,rminhu --matter … --grep …,audit --scope …} </dev/null
python3 -m yeshiva.gate mnhm --file ans.md </dev/null        # תפס 5/5 עובדות מומצאות
echo '{"prompt":"…"}' | python3 -m yeshiva.gate prompt       # **בעותק בלבד**
echo '{"tool_name":"Edit",…}' | python3 -m yeshiva.gate check # exit=2

# הסורקים
python3 -m yeshiva.{daf,rashi,mefarshim,shut,poskim} status </dev/null     # ⚠ daf status כותב — ראה B1
python3 -m yeshiva.{mefarshim,shut,poskim} profile </dev/null              # טהור
python3 -m yeshiva.daf scan <daf.txt>                                     # טהור
python3 -m yeshiva.mine gemara 5                                          # ⚠ דורס — ראה B3

# בריאות
python3 -m pytest -q          # 234 passed in 22.94s
python3 -m pytest arena -q    # 38 passed
python3 -m bench.report       # 44 ריצות, fable

# המחולל
node <t-ask.mjs>                                              # askYeshiva ⇒ ok=true, 90ms
YESHIVA_LEDGER_CAP=100000 node yeshiva/entity-psak.mjs --gate  # ✅ 7 מילים, exit=0
node machtzev/census/engine-index.mjs                          # 374 מנועים · yeshiva 9
YESHIVA_LEDGER_CAP=100000 node <vermin.mjs>                    # 4 מהלכי-ורמינהו ⇒ פנקס

# מדידת-החיבור
PYTHONPATH=/home/user/yeshiva-engine python3 <settrace על ask.py>   # 5 מודולים מופעלים, maimatai NONE

# ניסוי צילום-הבסיס (עץ-דמה בסקרצ׳פד, נמחק)
node police.mjs --baseline ; <מחיקת 30+45 קבצים> ; node police.mjs   # NOT DONE
```

**נקיון:** `git status --porcelain` ריק בשני הריפואים. כל הכתיבות שוחזרו ב-`git checkout -- daf/`; כל העותקים בסקרצ׳פד נמחקו. ‏`.maimatai/log.jsonl` (‏3,575 שורות) הוא gitignored ונשאר כראיה.
