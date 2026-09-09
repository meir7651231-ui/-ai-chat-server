# CLOSED · GENMAX G35 — ×100 בדרך-החלקיקים: מקבץ ב׳-קב…קה (9.9.2026 · לפי הכרעה-30)

> **ההוראה:** "אוקיי תמשיך ל פי מאה לפי הדרך הזאת" — כל התנהגות חדשה = צורך-חלקיק (חתימה+דוגמאות) ⇒ הבורר מוכיח-בריצה על כל מועמד מ-852 המנועים ⇒ הרכבה **אחת** ב-`gen_behaviors.dart` ⇒ המחולל קורא `bh*` בלבד. **אפס אטום חדש בגל הזה** — כל 8 הצרכים נענו מהמדף-הקיים.

## 1 · הצרכים החדשים ומי נבחר (הוכחה-בריצה, `behavior-plan.json`)
| צורך | חתימה | נבחר (מהמדף) | הוכחה | מי הודח |
|---|---|---|---|---|
| `search.exact` | `(String,String)→num?` | `ruleExact` | 2/2 | `ruleSkeleton` 1/2 |
| `search.contains` | `(String,String)→int?` | `ruleContains` | 3/3 | `rulePrefix` 2/3 (קידומת≠מכיל) |
| `text.distance` | `(String,String)→int` | `damerauLevenshtein` | 4/4 | `levenshtein` 3/4 (חילוף-אותיות = 1, לא 2) |
| `name.matches` | `(String,String,String Function(String))→bool` | `nameMatches` | 4/4 | `strongMatchForCharge` 0/4 |
| `heb.parts` | `(DateTime?)→Map<String,Object>` | `hebParts` | 2/2 | `monthLabel` 0/2 |
| `heb.gem` | `(num,List,List,List,Map)→String` | `gem` | 2/2 (26⇒כ״ו · 15⇒ט״ו) | `smartScore`/`staleBoxes` 0/2 |
| `heb.gemYear` | `(Object?,String Function(num))→String` | `gemYear` | 1/1 (5786⇒תשפ״ו) | — |
| `heb.dateFull` | `(String?,gem,gemYear,hebParts,List<String>)→String` | `hebDateFull` | 2/2 (2026-09-08⇒כ״ו אלול תשפ״ו) | — |

**לקח-חתימה:** `heb.gem` נכשל תחילה ("2 מועמדים בחתימה, אף-אחד לא `gem`") — הקטלוג שומר פרמטרים **עם שמות** (`List<String> U`), והצורך נכתב בלי. ההשוואה היא בייט-מול-בייט אחרי הסרת-רווחים; הצורך תוקן לחתימת-הקטלוג. (המוכיח קיבל `extraImports` — שקעי-דאטה שהדוגמאות צריכות, ללא-קידומת.)

## 2 · ההרכבה (`behavior-compose.mjs` ⇒ `gen_behaviors.dart`, 26 `bh*`)
| bh | הרכבה | גל |
|---|---|---|
| `bhSearchScore(q,text)` | מדויק 100 (`ruleExact`) › קידומת 80 (`rulePrefix`) › מכיל 62 (`ruleContains`) › מילה במרחק-עריכה ≤1 (≥5 אותיות ≤2) ⇒ 50−d·10 (`damerauLevenshtein`); הכל על `bhNormSearch` | ב׳-קב |
| `bhSameName(a,b)` | `nameMatches` עם נרמול-חיפוש שומר-רווחים — «רות לוי» ≈ «לוי רות», «רות כהן» ≠ | ב׳-קג |
| `bhHebDate(iso)` | `hebDateFull` ← `gem`(שקעי-גימטריה) · `gemYear` · `hebParts` · `hebMonthHe_monthNames` | ב׳-קד |
| `bhAheadOffsetsUnion(dues,…)` | איחוד `bhAheadOffsets` על כמה מועדים | ב׳-קה |
| `bhGroupRows(rows,key)` | `countBy` לפי מפתח-קבוצה | ב׳-קה |

## 3 · מה המשתמש רואה (המחולל קורא רק `bh*`)
- **ב׳-קב · חיפוש-סלחן מדורג** («נושאים»): `balaganSearchRanked` — כל התיקים בכל המודולים, ציון לשדה, ממוין; «ארנונא» מוצא «ארנונה לעירייה 1,250»; ספרות ⇒ חיפוש-המחסן (ספרות-מול-ספרות, ב׳-צב נשמר). צילום: `show2/76`.
- **ב׳-קג · כפולים לפי דמיון-שם:** `balaganDuplicates` — שדה-אדם דרך `bhSameName` (סדר-מילים הפוך = אותו תיק; מילה-אחת חופפת ≠); `balaganPersonFor('שגב נועה')` ⇒ כרטיס נועה שגב.
- **ב׳-קד · תאריך עברי:** כותרת «היום · כ״ז אלול תשפ״ו» · מסך-יום (תת-כותרת) · כותרת-השיתוף. צילום: `show2/77`.
- **ב׳-קה · תזכורות-מרוכזות מ-2** (היה >3) ותווית-הימים = רק ההיסטים שעוד לפנינו (`bhAheadOffsetsUnion`) · «עשיתי לבד»: פעולה-מרוכזת = שורה אחת «3 יחד · דחה למחר…» (`bhGroupRows`; החזר-הקבוצה כבר קיים) · **בערב:** «העבר את מה שנשאר למחר» על קטע-היום (`_snoozeAll`; מועד שעוד לפנינו לא זז — `bhDaysSince`) · «שלח לו את הפתוחים» נרשם ביומן (`send`).

## 4 · הוכחה
`behavior` 21/21 מוכחים · מיובאים+נקראים · `gen_behaviors_test` 4/4 (חדש: חיפוש-סלחן · אותו-שם · תאריך-עברי · איחוד · קבוצה) · `balagan_facts_test` 76/76 (חדש: ב׳-קב · ב׳-קג ×3) · analyze 0 · build · `balaganone` 30/30 · `balagan` 35/36 · `balaganrun` 2·1.

## 5 · נותר (אותה דרך)
מקבצים הבאים: צורך ⇒ הוכחה ⇒ `bh*` ⇒ המחולל. מועמדים מהמדף שכבר אותרו-בחתימה ולא נוצלו: `buildSlots` (חלונות-פנויים לתוכנית-היום) · `cockpitQueue` (תור-לפי-דחיפות) · `findDuplicateGroups`/`phoneKey` (כפולי-אנשים לפי טלפון) · `levenshtein` (הצעת-"התכוונת?").
