# 🔬 ביקורת-מערכת מלאה — 2026-09-01 (5 עדשות-חוצות · byte-verified)
> נחיל 5-בודקים חוצה-שכבות + ביקורת-ארטיפקטים עצמית. כל מספר מהבייטים.
> ענף `claude/hei-rxv1v1`. מטרה: "הכל · כמה · איך · למה · מתי · מה-מחובר."

## 🔴 5 הממצאים-המערכתיים (לפי חומרה)

### 1. המפעל והמשטרה חלוקים על "ירוק" (HIGH · באג-אמת)
`one.mjs:108` מריץ `purity/purity-data.mjs --gate` כשלב **לא-אופציונלי**. הסורק הזה **אדום** (על `compute-quote.mjs`) ⇒ **`one.mjs` יוצא 1**, בעוד **`police.mjs` יוצא 0**. שני שערי-הכניסה אוכפים סטים-שונים.
→ **תיקון-החלטה:** או לחווט `purity-data` למשטרה + לפתור compute-quote, או לסמן את שלב-108 אופציונלי.

### 2. המחולל (§22 · צפון-הכוכב) אינו-נבדק ע"י המשטרה (HIGH)
כל אשכול-המחולל — `generator/{app-ds,render-ds,entity,nl-spec,match,compose}` + 4 רַצֶ'טי-`mahulal` — **מנותק** מ-`one.mjs`/`police.mjs`. ‏11 שערי-המשטרה בודקים אטומים/קופסאות/טוהר, **אפס בודק שהמחולל עובד**. הרַצֶ'טים שכן בודקים (spec-acceptance·generator-ratchet·nl-smoke·nl-quality — כולם **ירוקים**) הם **יתומים לא-מחווטים**. קיימים **3 מימושי-מחולל מקבילים:** ‏`generator/app-ds+render-ds` (יתום, שעבדתי עליו) · `generator/genesis-gen` (חי ב-one.mjs) · `engine/generate.mjs` (עצמאי-שלישי).

### 3. ‏40/97 קבצי-.mjs יתומים או מתים (MED)
‏**57 חיים · 27 יתומים · 13 מתים.** אזור-המת-הגדול = אשכול-ה-NL של §22. קוד-מת ודאי: `generator/{app,nl,compose,teach,intent,entities}` + `emit/parity-*` + חלק מ-`purity/*`.

### 4. ‏3 ארטיפקטים-מיושנים — אחד מזין את המחולל (MED)
| ארטיפקט | הפרש מול regen | קורא |
|---|---|---|
| `generator/atom-census.json` | **+654/-20** | ← `render-ds` (בורר-האטומים!) |
| `generator/atlas.json` | +1035/-15 | ← match/render-ds/teach |
| `WIRING.md` | +67/-62 | תיעוד |
| atom-index · logic-census · entities | תואמים | — |

### 5. סחף-ספירות + baselines מנופחים (LOW–MED)
- **הספירה-הקנונית = 522** (`atom-index.json`, האורקל). ‏CLAUDE.md אומר **516** (סחף −6). ‏487 = census צר-יותר (תת-קבוצה, חסר 35). ‏274 = מת.
- ‏CLAUDE.md: "6 שערים"→**11** · "10 pins"→**11** · רשימת-fast-gate חלקית.
- `HANDOFF-MASTER.md` — snapshot **מיושן-לגמרי** (681/62/279/7-of-7), עדיין מקושר-כפעיל.
- ‏3 baselines של הטוהר מנופחים (124≪336 · 220<281 · 37≪59) — לא הודקו מאז ששולם החוב.

## 📊 טבלת-השערים (11 רשומים · 5 יתומים-ירוקים · 2 יתומים-אדומים)
**רשומים (כולם ירוקים):** wiring · contract · quarry · freeref · datapurity · deeppurity · assembly · synth · pins · selftest · mutation.
**יתומים-ירוקים (⇒ אפשר 16):** `independence-check` · `generator-ratchet` · `nl-smoke` · `spec-acceptance` · `nl-quality`.
**יתומים-אדומים:** `purity-data` (אדום · compute-quote) · `tokens-roundtrip` (קורס · registry של maor).

## 🧬 חוב-הטוהר (3 סורקים · byte)
| סורק | מסמן | baseline | אדום? | תופס compute-quote? |
|---|---|---|---|---|
| data-purity (dec-16) | 124 | 336 | 🟢 | לא |
| purity-data (dec-28.8) | 220 | 281 | 🔴 | כן (false-positive) |
| deep-purity (dec-19) | 37 | 59 | 🟢 | לא |

`compute-quote.mjs` = **false-positive:** אטום **טהור באמת** (0 עברית-בקוד, שקעים מוזרקים); ‏purity-data מבלבל `const lines=[...filter]` (מערך-מחושב) עם דאטה. איחוד-מעורבים חוצה-סורקים = 291 (נשלט-כיסוי), רק 1 (`schedule-clash-text`) מעורב בכל-השלושה.

## 🔗 חיווט-המדף (byte)
- **שכבת-MJS בריאה:** ‏984/1112 אטומים מחווטים לקופסה (**88.5%**) · 128 אינרטיים.
- **המחולל = צוואר-בקבוק:** פולט **13** אטומי-אימפריה (12 עוטפי-DS + 1 לוגי) מתוך ~1210 בקטלוג (**1.1%**) — רק ל-13 יש תפר-נתונים. זה הפער ל-§21.

## 🔢 ספירות-אמת (מאומתות)
נכונים: atlas ‏486/724/3845 · logic-census 810 · entities 60 · screens-seed 254 · gates 11 · wireable 104/433/537 · **טבלת-העץ ב-README מדויקת**. סחף: 522↔516 · CLAUDE-gates/pins · HANDOFF-MASTER.

## ✅ מה כבר תוקן בסבב-הזה (מוקדם)
נתיבי-SDK-מתים⇒env · run.mjs שבור-מהזזה · m[3]⇒m[2] · מגני-quarry · ספירות gates.tsv/behavioral · knowledge/archive.

## 🟡 החלטות פתוחות (לא-משנים בעיוור)
1. **one.mjs vs police** — לחווט purity-data + לפתור compute-quote · או לסמן-אופציונלי.
2. **compute-quote** — לתקן heuristic של purity-data (הכי-נכון) · או baseline.
3. **לחווט 5 שערי-מחולל** ⇒ המשטרה תבדוק את §22 (16 שערים).
4. **לרענן 3 ארטיפקטים מיושנים** (atom-census מזין מחולל — שינוי-התנהגות).
5. **קוד-מת** (‏13 מתים + יתומים) ⇒ `archive/`?
6. **סחף-ספירות בתיעוד** (516⇒522, gates, HANDOFF-MASTER) — תיקון-תיעוד.
