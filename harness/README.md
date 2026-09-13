# harness — המנוע העצמאי

**מה זה:** תוכנית אחת (`police.mjs`, ~150 שורות) שמכריעה אם עבודת-סוכן הסתיימה. היא לא יודעת כלום על שום פרויקט. כל מה שהיא יודעת מגיע מ-`harness.json` שבשורש הריפו.

## מתחיל? שלוש פקודות, אפס הגדרות
```bash
node harness/police.mjs --init        # מזהה npm/flutter/python/go/rust וכותב harness.json
node harness/police.mjs --baseline    # לפני שהסוכן נוגע
# … הסוכן עובד …
node harness/police.mjs --scope '<מה מותר להשתנות>' --claims claims.json
```
בלי שום הגדרה ידנית אתה מקבל **שמונה שערים**: שניים שנגזרים מהפרויקט שלך, ושישה שהם כשלי-סוכן אוניברסליים (עובדים בכל שפה, אפס קונפיג — `universal:false` מכבה, `universal_off:[…]` מכבה בודדים):

| שער | מה הוא תופס |
|---|---|
| in_scope | כל קובץ ש-git עוקב אחריו נחתם. נגע במשהו מחוץ למשימה ⇒ מופיע בשם |
| verify | פקודת-הטסטים שלך. שבר טסט ⇒ אין DONE |
| **tests_not_weakened** | **התרגיל הקלאסי: הטסט עבר כי הסוכן שינה את הטסט.** טסטים שנמחקו · assertions שנמחקו · `.skip`/`xit`/`@Ignore`/`t.Skip`/`@pytest.mark.skip` שנוספו |
| no_secrets | מפתח/סוד/טוקן/מפתח-פרטי בשורה שנוספה (כולל `sk-`, `AKIA`, `ghp_`) |
| no_debug_left | `console.log` · `debugger` · `print(` · `dbg!` · `fmt.Println` שנשארו בקוד-ייצור |
| no_swallowed_errors | `catch {}` · `except: pass` · `_ = err` — שגיאה שנבלעה בשקט |
| deps_declared | תלות חדשה במניפסט, **בשם** (השוואת-שמות אמיתית, לא ספירת-שורות) |
| no_deletions | קובץ שנמחק |
ובנוסף כל טענה שלו מסומנת CONFIRMED / FALSE מול השער שהיא נוקבת בשמו.

**דוגמה אמיתית** (ריפו node בן 4 קבצים, אפס הגדרות). סוכן "סיים" משימה: השבית טסט שנכשל, השאיר `console.log`, הטמיע מפתח, בלע חריגה, הוסיף תלות ומחק קובץ. `npm test` **עבר** — כי הטסט הושבת:
```
| verify              | ✅ |   ← עבר! הטסט הושבת
| tests_not_weakened  | ❌ |   נמחקו 1 טסטים ‖ נמחקה 1 assertion ‖ הושבת: test.skip('discount', …)
| no_secrets          | ❌ |   const API_KEY = "sk-live-9fj20csdk…"
| no_debug_left       | ❌ |   console.log('paying', card);
| no_swallowed_errors | ❌ |   try { return charge(…) } catch (e) {}
| deps_declared       | ❌ |   package.json: תלויות חדשות — left-pad
| no_deletions        | ❌ |   src/util.js
| in_scope            | ❌ |   מחוץ לרדיוס: package.json · src/util.js (נמחק)
## פסק: NOT DONE
```
זו הנקודה: **`verify` לבדו היה מאשר.** שער-הטסטים-לא-הוחלשו הוא מה שתפס את התרגיל.
אפס התרעות-שווא: על גנסיס (ריפו אמיתי, 1159 קובצי-פלט) כל שישה השערים האוניברסליים ✅ ופסק כולל DONE.

## התקנה בריפו חדש (הגדרה מלאה)
1. העתק את `harness/police.mjs`.
2. כתוב `harness.json` (העתק מ-`harness/harness.example.json` ומלא פקודות של הפרויקט שלך).
3. `node harness/police.mjs --baseline` — לפני שהסוכן נוגע.
4. הסוכן עובד. בסוף: `node harness/police.mjs --scope '<מה מותר להשתנות>' --claims claims.json`.
5. `DONE` = הסתיים. `NOT DONE` = לא, והדו"ח אומר בדיוק מה חסר.

## שמונת השערים (כל אחד מדולק רק אם הוגדר בקונפיג)
| שער | מה הוא מוכיח | מה בקונפיג |
|---|---|---|
| build | הבנייה עוברת | `build` |
| no_hand_edit | אף אחד לא ערך ידנית קובץ מחולל (הבנייה מחזירה אותו) | `build` + `outputs` |
| in_scope | רדיוס-הפגיעה: שום דבר מחוץ למשימה לא השתנה | `outputs` + `--scope` |
| gates | בדיקות-הפרויקט הקיימות ירוקות | `gates[]` |
| verify | הקוד מתקמפל / הטסטים עוברים | `verify` (+`verify_pre`) |
| forbid_diff | תבניות אסורות בשורות שנוספו למקור | `forbid_in_diff[]` |
| forbid_out | תבניות אסורות בפלט | `forbid_in_output[]` |
| no_orphans | אין קובץ-פלט בלי מקור | `orphans` |

## טענות
הסוכן לא כותב סיכום. הוא מגיש `claims.json`:
```json
{"claims":[{"check":"verify","text":"הקוד מתקמפל"}],"notes":"מה הוכח ומה לא"}
```
המכונה מסמנת כל טענה **CONFIRMED / FALSE / UNVERIFIED** מול השער שנקבה בשמו. טענה שגויה לא נעלמת — היא מסומנת FALSE בתוך הדו"ח.

## הוכחות
- **ירוק על נקי:** גנסיס, כל 8 השערים ✅.
- **אדום על מורעל:** 4 הרעלות (ספק של אפליקציה אחרת · עריכה-ידנית בפלט · ליטרל עברי בלוגיקת-המנוע · קובץ יתום עם `.sqrt()`) הפילו 7 שערים, כל אחד עם ייחוס מדויק.
- **ניידות:** אותו `police.mjs` בדיוק, בלי שינוי שורה, על buildsmart (Flutter, שפה אחרת, מבנה אחר) — רק `harness.json` חדש. השערים רצו ומצאו בעיה אמיתית בעותק.

## מה עוד לא
`police.mjs` הוא השער. את *הצי* (מבקרים · מאמת · מתקן) ואת לולאת-הסוכן מריץ `bench/agent.sh`, והוא עדיין מניח מבנה של גנסיס. הכללתו היא הצעד הבא.
