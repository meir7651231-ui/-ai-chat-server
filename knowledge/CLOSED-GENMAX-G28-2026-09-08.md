# ✅ CLOSED · GENMAX G28 · המראה (הכרעה-28) — 8.9.2026

**המשימה (הבעלים 7.9 ערב):** «תרשום את כל החלטות והעיצובים ואני מזהיר תעבוד בלולאה עד שזה מאה אחוז!!! לא אחוז פחות». גל-המראה = הראשון בלולאה G28⇒G29⇒G30⇒G32 (PLAN §9 הכרעה-6).

## מה נבנה (הכל מנוע, אפס-יד באפליקציה)
| שכבה | קובץ | מה |
|---|---|---|
| טוקנים | `new/atoms/pure-look.mjs` ⇒ `ds-pure.mjs` ⇒ `ds_pure.dart` | `--on-a` · `--hi` · `--shade` (ליטרלים שהיו צרובים ⇒ טוקנים, ערך-כהה זהה) · `skins.paper` (לבן · #37352F · קו 8% · צל-שקוף · 3 צבעי-מצב) · `themes.t-balagan` (כחול-יחיד, בלי גרדיאנט/זוהר) · `fontSets.heebo` |
| forge | `ds-forge.mjs` `tokenLit` | 496 ליטרלים ⇒ `skin.onA/hi/shade/…` (359 אטומים · דיף = החלפת-טקסט בלבד; נותרו 8 ליטרלי-גוון ייעודיים) |
| כרום-DS | `ds.dart` `DsLook` + 13 קבצי-שדה (`lookify` מונחה-מהדר) | בלי PureScope ⇒ `DsLook.dark` = DsTokens ביט-זהה · paper ⇒ שטוח: DsScaffold (כותרת 22/600, קו, ≤720, בלי אריח-אמוג׳י, בלי גרדיאנט) · DsNavTile שורה 52 · DsSection כותרת+שורות · DsPrimaryButton אקצנט-מלא · **DsFold** (▸ פרטים (n)) · **DsNote** (פסקת-תוכן) |
| מנוע | `look.mjs` (setLook/isPaper/stripGlyph/skinWired/HARD_COLOR) · `render-ds` (PureScope בשורש · Brightness.light · k() חותך גליף-מוביל · 9 ליטרלים ⇒ DsLook) · `app-shell` (עובדות מקופלות אחרי בנות+דוח · `שאלה רשימה`) · `particles` (3-למעלה+DsFold · `שאלה דוח` · wireAtom: נייר פוסל צבע-קשיח, bare=דרישה, forge sockets items/selected/bare · `pickWired`) · `app-ds` (`עיצוב: נייר` · `שאלה <מסך>:` · נייר: בלי מסכי-מגירה, בלי skin-swap ל-navTile/section/pageHeader, גיזום ייבוא-אטום-לא-בשימוש, מחיקת תוצר-ישן) · `atlas.mjs` (forge בנייר) · `op-census.mjs` (שקעי-forge אמיתיים) |
| ספק | `spec-lang`: `lookWord/looks/questionWord/questionTargets` · `chrome`: `foldLabel` · `peruk-lang`: `look/questions` ⇒ כל פירוק מקבל `עיצוב: נייר` + 2 שאלות · `sechirut.txt` |
| שער | `balagan-look.mjs --gate` + `balagan-score.json` (36 כללים) + baseline · gates.tsv/police/INDEX |

## הציון · 7/36 (ratchet)
ירוקים: D1 פעולה-ראשית-אחת · D9 מסך=שאלה · D11 טיפוגרפיה/אסימונים/אפס-אמוג׳י מוזרקים · D12 ≤720 · D13 שטוח/אפס-צבע-קשיח/אפס-אטום-קשיח · D14 ≤5 יעדים · D15 3-למעלה. **29 ממתינים-לגל** (G29: T4/T6 · G30: D2/D3/D4/D10/T3 · G32: D5–D8/P1–P14/T1/T2/T5 · שרת: P15).

## אימות
analyze 0 (lib/genesis) · flutter test genesis_* 171/171 · צילומי `sechirut` (בית · «מה פתוח עכשיו?» · «דוד כהן» עם בנות/דוח/פרטים(12) · «מה לעשות עם זה?» עם 3 חלקים + פרטים(4) + שליחה) · 5 אפליקציות-פירוק באותו עור · הכהה ביט-זהה (auto-skin.json, gen_app_yeshiva/… ללא דיף).

## מה לא (כנות)
- הבורר-התחתון = ForgeMustChip (3 צ׳יפים) ולא סרגל-ניווט עם אייקונים — הבחירה הפתוחה של המנוע אחרי הדרישות (need+bare+skinWired); אייקוני-קו = אטום שאין בקטלוג.
- `ratio`/`headline` בנייר: אטומי-auto עם BsTokens.brand נפסלו ⇒ שורות KvLine במקום אריחי-KPI (שטוח — תואם PLAN §5.3).
- מסכי-ישות (טפסים) לבנים אך עדיין טפסים — «צלם⇒קראתי» = G28b/בעלים (בינה).
- אטומי-forge באטלס רק בנייר (בכהה ביט-זהה) — איחוד = חוב מוצהר.
