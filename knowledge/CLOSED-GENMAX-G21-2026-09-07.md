# ✅ CLOSED · GENMAX · G21 — retrofit-תפר: הקבוצה השלישית מקבלת שקע-דאטה (7.9.2026)

> הכרעת-בעלים: "תסיים את הקבוצה השלישית" (אטומים שמציגים ערך אבל ממציאים אותו) — הכרעה-26. מנוע, לא נחיל (הכרעה-24).

## מה נסגר
| אטום | היה | שקע-הדאטה (G21) |
|---|---|---|
| LinearProgress · ProgressRing · RadialGauge | אנימציה-מחזורית 0→100 | `pct` (0–100), אנימציית-כניסה 0→pct |
| MiniCalendar | `sin(i·2.3)` + "היום"=17 | `today` · `marked: Set<int>` |
| DualRange | 0.25/0.75 קבועים | `low` · `high` (0–100) · `onChanged(low, high)` |
| StoryRing | אייקון-אדם | `initials` · `seen` |
| PinPad | הקשה נבלעת | `onDigit(int)` · `onBackspace` |
| BarChart | `seed`+סינוס | `values: List<double>` (עמודה לכל ערך, יחסי-למקסימום) |
| StatBlock | `sin(i·1.7)·40+60` | `values: List<num>` (מקביל ל-labels) |
| FabMenu | 3 אייקונים קבועים | `labels` · `onSelect(i)` |
| ForgeFabAction · ForgeFabMenu · ForgeDsToggleTile | תאי-ZERO ב-Pure | תאים אמיתיים ב-`pure/action-family.html` ⇒ ds-forge חוצב עם seam |
| ReportTable · DsCalendar · DsMonthOffset · FabAction | op-census: zero (תפר-האינדקס דרס `rows`/`records`) | op-census רואה את השקעים ⇒ כשירים |

**FAKERS (compose-engine):** `['stat_block','linear_progress','radial_gauge','bar_chart','sparkline']` ⇒ `[]` — כולם קיבלו שקע (sparkline כבר היה עם `values`). הרשימה נשארת SSOT לחוב עתידי; `no-fakers-check` ירוק-מפורש על רשימה ריקה (היה regex-ריק שתפס הכל).

## המחולל (genesis-gen) — מה השתנה כדי שהקוראים יזינו דאטה ולא יזייפו
- `fillProp`: `pct|low|high|value` (double/num) ⇒ רק ממספר-במשפט (אין ⇒ null, לא `16`); `List/Set<double|num|int>` ⇒ שאר מספרי-המשפט; `FILLABLE` מכיר בהם.
- `pickAtom`: אטום בלי שום שקע (ForgedHeader וחבריו) אינו מועמד (§20-ג); +1 לכל שקע-סקלרי שתואם מספר במשפט ⇒ "עוגה 170 5" נשאר DonutChart(height, slices) ולא DonutChart(values:[170,5]).
- `--only a,b`: חילול-נקודתי בלי `rmSync(OUT)`/מחיקת-תוכן/שכתוב-ספקים — הריצה-המלאה מוחקת 116 קובצי-תוכן של GENMAX (drift של 200 קבצים; L93).
- הספקים (צעדים 1–2, אדם כותב) קיבלו את המספרים: `charts` (עמודות 12 9 15 6 18 4 11 · מד 73) · `feedback10` (סרגל 62) · `viz` (לוח 17 + 3 8 12 21 26) · `input9` (טווח 25 75) · `dash11` (בלוק 1240 318 42) · `states` (טבעת 62) · `media` (צף: עריכה / שיתוף / מועדפים). 9 מסכים חוללו-מחדש ב-`--only` — דיף = השקעים בלבד (17+/16−).

## תוצאה (TRUTH.md)
| מדד | לפני | אחרי |
|---|---|---|
| כשירים (תצוגה) | 867 | **882** |
| נגישים-לבוררים | 1717/1717 | **1732/1732** |
| לא-כשירים במכוון (בשם) | 47 | **32** — רקעים (5) · ספינרים/נקודות (6) · שלדים (3) · ידיות/מפרידים (5) · 13 קובצי-משפחה `Forged*` |
| FAKERS | 5 | 0 |
| הפער האמיתי | 0 | 0 |

analyze 0 (buildsmart · lib/genesis) · שערי opcensus/cover/no-fakers/truth ירוקים.

## מה נשאר לא-כשיר, ולמה זה נכון
ה-32 הם קישוט-טהור: אין להם מה להציג מלבד עצמם (רקע, ספינר, שלד-טעינה, ידית-גרירה, מפריד) — אטומים אחרים משתמשים בהם כילדים. לפי §20-ג הם לא מועמדים לבחירה-לפי-מטרה, ונספרים בשמם ב-TRUTH.md כדי שלא ייעלמו במכנה. 13 ה-`Forged*` הם קובצי-משפחה של pure-forge (1.9), לא אטומים.
