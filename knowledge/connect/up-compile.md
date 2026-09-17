# up-compile — "כל משפט ⇒ אפליקציה שמתקמפלת ורצה", נמדד בפלאטר (לא מוצהר)

הוראת-הבעלים (צ'אט 18:5x): "כל משפט — תתקין את מה שצריך כדי שתוכל לאמת". הותקן Flutter 3.47.4 (stable, /root/flutter); המראה ל-buildsmart = העתק מילולי של שלב-2 ב-`ship.mjs` (scratchpad/mirror.mjs) על worktree של `buildsmart@claude/hei-rxv1v1` (הענף שנושא `app_flutter/lib/genesis` · 577 gen · 49 בדיקות `genesis_*`).
כל מספר עם פקודה. `flutter analyze --no-fatal-infos --no-fatal-warnings lib/genesis` — הקריטריון של ship: רק `error •` מפיל.

## הפער שנמדד
| מה | פקודה | תוצאה |
|---|---|---|
| בסיס: המראה המחויב | analyze | **0 שגיאות** · 75 אזהרות · 2208 infos (51s) |
| משפט חופשי חדש: "ניהול ספקים עם שם, טלפון, עיר ותאריך הצטרפות" | `app-ds --name demo_manager --text …` ⇒ מראה ⇒ analyze | **6 שגיאות**, כולן ב-`gen_app_demomanager_wizard.dart` |
| קורפוס `nl-smoke.txt` + `nl-quality.txt` (35 משפטים ⇒ 35 אפליקציות) | 35× app-ds ⇒ מראה ⇒ analyze | **5 שגיאות** נוספות (אחרי תיקון א׳), כולן `not_enough_positional_arguments` באשף — corp02/08/14/25/34, כולם עם "תשלומים" |

כלומר: שערי-המשפט (`nlsmoke` · `nlquality` · `appgen`) מוכיחים "נבנה בלי קריסה" — **לא** "מתקמפל". הקומפילציה נבדקת רק על המראה המחויב (genesis-compile ב-CI), ומשפט-חופשי חדש לעולם לא עובר בה. §22 ("משפט חופשי ⇒ אפליקציה עובדת") לא היה נמדד עד היום.

## הסיבה (שני באגים במנוע-רינדור אחד — `render-ds.mjs · renderWizard`)
1. `_live(String label, String out)` קיבל את פלט-האטום גולמי: `basename(...)` ⇒ `String?`, `is45(...)` ⇒ `bool`, `namespaceOf(...)` ⇒ `int`. במסך-הישות אותו מנוע כבר עוטף לפי טיפוס-ההחזרה (`wrap`: bool ⇒ כן/לא · num ⇒ toString · String? ⇒ ?? '') — האשף לא. **4 שגיאות.**
2. `DsDateField(label: …)` / `DsNumberField` / `DsToggleTile` נפלטו בלי `value`/`onChanged` שהם חובה בחוזה-הווידג'ט (רק `DsField` קיבל אותם). **2 שגיאות.**
3. סינון-מועמדי-הטרנספורם (`XFORM`): `params.length === 1 || /\[/.test(sig)` — `[` **בכל מקום** בחתימה הספיק, ולכן `payLink(String, num, [String, …])` (2 חובה) נכנס ונקרא בארגומנט אחד. **5 שגיאות בקורפוס.** התיקון: `requiredArity(sig)` = הפרמטרים לפני ה-`[`/`{` הראשון בעומק-0 ⇒ חייב להיות 1.

## אחרי התיקון (אותו מנוע, עותק-עבודה)
| מה | תוצאה |
|---|---|
| משפט-הדמו ⇒ analyze | **0 שגיאות** |
| 35 משפטי-הקורפוס + הדמו (36 אפליקציות · 1139 קבצי-gen במראה) ⇒ analyze | **0 שגיאות** · 75 אזהרות (כמו הבסיס) |
| `flutter test` — בדיקת-עשן זמנית: 36 אפליקציות עולות (`pumpWidget(<App>MainScreen)`, MaterialApp, אפס חריגה) | **36/36 עוברות** (3s) |
| `flutter test test/genesis_*_test.dart` (49 קבצים, המראה עם 36 האפליקציות החדשות) | **297/297 עוברות** (73s) |
| `flutter test test/genesis_gen_app_studio_test.dart` (בקרה) | 16/16 |

## מה נשאר לבעלים
- `render-ds.mjs` **נעוץ** (pins-check STATIC) ⇒ הקומיט דורש `Allow: pins-write:machtzev/generator/render-ds.mjs`. הטלאי שמור (scratchpad/land/render-ds-wizard.patch, 8+/3−) ומאומת; לא נקמט בלי אישור.
- שער-קומפילציה למשפטים (הצעה, לא בוצע): `nl-smoke` כבר בונה כל משפט — עם Flutter במכונת-המשטרה אפשר להוסיף analyze על הפלט (≈50s לכל הקורפוס יחד). זה שער חדש ⇒ gates.tsv/police.mjs (נעוצים) ⇒ הכרעת-בעלים.
- ממצא-אגב (איכות, לא קומפילציה): לשדה "שם" האשף מציע תצוגות-חיות של `basename`/`firstOpen`/`is45`/`namespaceOf` — אטומי שמות-קבצים שנבחרו לפי המילה "שם". מתקמפל, לא הגיוני. לא נגעתי.
