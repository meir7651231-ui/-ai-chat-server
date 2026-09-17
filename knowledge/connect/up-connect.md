# up-connect — חיבור מנועים למחולל: מחוללי-קלט-נגזר נכנסים לצנרת (קבוצה 1)

הוראת-הבעלים (בועה 17:56): "ממשיך לחבר עוד מנועים". ענף: claude/up-connect-260917 (מעל up-converter ccf861e5).
כל מספר עם פקודה; DART=/root/dart-sdk/bin/dart.

## ההגדרה שמודדים לפיה
`node machtzev/census/engine-index.mjs --connected` (MEASURE-v2): **קדימה** = נגיש-בייבוא מ-6 נקודות-הכניסה (`GEN_ENTRY`) **או** מורץ-בשם מצינור-המחולל (`regen.mjs` · `ship.mjs`); **אחורה** = מייבא נקודת-כניסה. שערי-משטרה אינם מחוברים מעצם היותם שער.
לפני: קדימה 62 · אחורה 10 · לא-מחוברים 274 (מתוך 342) · שערים מחוברים 27/57.

## מה נמצא (נמדד)
ארבעה מנועים שיש להם **שער-משטרה** אבל **הצנרת לא מריצה אותם** — ולכן הקובץ שהם מייצרים (שהמחולל קורא) מתעדכן רק כשמישהו זוכר להריץ ידנית. זה בדיוק ה-"סחף-מובנה" של L80(א): *שלב-ה-regen = כל המחוללים שקוראים קלט-נגזר, בסדר-התלות*.

| מנוע | מייצר | מי קורא (בצנרת) | שער קיים |
|---|---|---|---|
| generator/entity-terms.mjs | entity-terms.data.json | retarget · sentence · tzinor · core-from-shape | entityterms |
| generator/enum-values.mjs | enum-values.data.json | core-from-shape | enumvalues |
| generator/frag-ops.mjs | frag-ops.json (+ gen_opsseed_*) | render-module (skin-golden · retarget · sentence) | fragops |
| generator/synth.mjs | specs/cap*.txt (4 יכולות מוכחות) | genesis-gen (נקודת-כניסה) | synth |

## מה שודרג (מנועים קיימים)
1. **regen.mjs** — ארבעה צעדים חדשים בסדר-התלות: `entity-terms ⇒ enum-values` מיד אחרי ds-forge (לפני כל קורא-מונחים); `frag-ops ⇒ synth` אחרי auto-logic ולפני skin-golden. אותה רשימה משרתת את ship.mjs ואת one.mjs (G22) — חיבור אחד, שני הצינורות.
2. **entity-terms.mjs · enum-values.mjs** — מצב-ברירת-המחדל קרס (`ENOENT`) כשאין maor-system; עכשיו אותו כלל כמו ה---gate שלהם: "⚪ אין maor-system — הקובץ המחויב הוא האמת", exit 0. בלי זה הצנרת הייתה נופלת בכל מכונה בלי maor.
3. **ds-variants.mjs** (ממצא-אגב): `--check` היה אדום — `ds_surface.dart` המחויב מכיל את חריץ-העור `DsLook.of(context)` (G28, 62777293) והמנוע עוד פלט `DsTokens.card`. המנוע הושלם לפלט שלו (הרצה ⇒ אפס דיף). זה תנאי-מוקדם לחיבור מנועי-ה-DS לצנרת (סעיף "לא נעשה").

## מדידות
| פקודה | תוצאה |
|---|---|
| `node machtzev/census/engine-index.mjs --connected` (אחרי) | **קדימה 66** · אחורה 10 · בשניהם 4 · **לא-מחוברים 270** · שערים מחוברים **31**/57 |
| 4 הצעדים החדשים דרך `runRegen` | entity-terms ⚪ 0.1s · enum-values ⚪ 0.0s · frag-ops 0.3s · synth 1.6s · `git status` נקי |
| `node machtzev/ds-variants.mjs --check` | ✓ טרי (היה 🚨) |
| `--connected --with-entry machtzev/generator/generate.mjs` | קדימה 71 · לא-מחוברים 265 (הכרעת-בעלים: האם generate.mjs נקודת-כניסה) |
| `--connected --with-entry machtzev/one.mjs` | קדימה 96 · לא-מחוברים 240 (הכרעת-בעלים: האם one.mjs נקודת-כניסה) |
| ריצה מלאה של `REGEN` (runRegen, 50 צעדים, 1625s) | 49 ✓ · **behavior-plan (ברירת-מחדל) קרס OOM** (V8 heap · 1546s · מכונה 15GB · בלי max-old-space; values=false ⇒ לא מסלול-הערכים) · אחרי הריצה: 31 אפליקציות-ספק מקבלות **מסך-אשף** חדש (gen_app_*_wizard + hub_content) שאינו מחויב ⇒ סחף פרה-קיים (המנוע לפני הפלט), שוחזר ולא בקומיט |

## ממצאים לבעלים (לא נגעתי)
- **behavior-plan במצב-regen נופל על זיכרון** (מדידה מלאה בטבלה): ship/one לא יכולים לעבור את הצעד הזה במכונה של 15GB. מסלול-ההוכחה-במנייה (CAP2=100000) — מדידת-בסיס על d897bc6e רצה בנפרד.
- **31 אפליקציות-ספק מיושנות** מול app-ds הנוכחי (מסך-אשף חדש לא נקמט) — regen מלא יכתוב 62 קבצים; מסך-האשף עצמו לא התקמפל (6 שגיאות) עד תיקון renderWizard (דוח נפרד: up-compile).
- **op-bridge.mjs**: הרצה משנה את `op-bridge.json` (1926 שורות ±, g1 של crs 25⇒26) — הקובץ המחויב מיושן; אין לו שער ואין לו צרכן בריפו. מדד-הסכמה בלבד. להחליט: שער+צנרת, או הסרה.
- **מנועי-DS** (ds-tokens · ds-pure · ds-variants · ds-motion · ds-graphics): מייצרים את `ds_*.dart` שהאפליקציות-המחוללות מייבאות; one.mjs מריץ אותם, ship לא. כניסה ל-regen דורשת שער ב-gates.tsv/police.mjs (קבצים נעוצים ⇒ Allow: pins-write של הבעלים). `--check` של כל החמישה ירוק עכשיו.
- **נקודות-כניסה**: generate.mjs (§22 "הכניסה-האחת") ו-one.mjs — המספרים בטבלה; ההכרעה אינה שלי (MEASURE-v2).

## מה לא נעשה
- לא חוברו שערים/בדיקות (police·selftest·*-check) — הם שומרים על המחולל, לא חלק ממנו (הגדרת MEASURE-v2).
- לא חוברו מנועי-המחצבה (extract/* · dedup/* · purity/* · carve/* · box-*): הצינור שלהם הוא run.mjs/one.mjs (מקור ⇒ מדף), לא צינור-המחולל.
