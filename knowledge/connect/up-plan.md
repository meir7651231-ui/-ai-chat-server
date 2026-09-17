# up-plan — particle-plan-app: אותה תכנית במשטרה מהירה ובמלאה

הממצא (17.9 09:27, מיזוג ל-mizug): אחרי `police` מלאה `particle-plan-app.json/.md` השתנו (160+/18−), ואחרי `police --fast` (טבעת-commit) חזרו לגרסה הקצרה. כל מצב עבר את שער `particles` שלו. "לא אקראי — תלוי-מצב".

## הסיבה (נמדדה)
`buildApp(specText)` כותב תמיד `particle-plan-<NS>.json` עם `NS = --name || 'app'`; שלושה שערים קוראים ל-`buildApp` בלי `--name`: `acceptance` (אפיון-מערכת-מלאה, רץ גם ב---fast), `nl-smoke` ו-`nl-quality` (משפטים חופשיים, מדולגים ב---fast). כולם כותבים לאותו קובץ — האחרון-בסדר-הריצה מנצח, והסדר תלוי במצב.

## התיקון (מנוע קיים)
`buildApp(specText, { writePlan: false })` — בנייה בלי כתיבת `particle-plan-*`/`report-plan-*` (גם G33 של ספק-ריק). `nl-smoke`, `nl-quality` **ו-`genratchet`** (mahulal/generator-ratchet.mjs — 4 ספקי-דגימה, ביניהם "מרפאה עם מטופלים" = הגרסה הקצרה שהופיעה ב---fast) עוברים ל-`writePlan:false`; רק `acceptance` (ספק אחד, קבוע) כותב את התכנית.
מדידה שחשפה את הכותב הרביעי: אחרי תיקון nl-* בלבד, `police --fast` עדיין החזיר את הגרסה הקצרה (18+/160−); בלוג-המשטרה השורה `🧩 חלקיקים: 1/4` מופיעה מיד אחרי `ran synth` ⇒ שער `genratchet`.

## אימות
בעץ נקי (3b8c2c36):
| פקודה | exit | particle-plan-app.json |
|---|---|---|
| `node machtzev/mahulal/nl-quality.mjs` | 0 | לא נגע |
| `node machtzev/mahulal/nl-smoke.mjs` | 0 | לא נגע |
| `node machtzev/mahulal/spec-acceptance.mjs` | 0 | **זהה לקובץ המקומט** (git diff ריק) |

כלומר: הגרסה שנקמטה במיזוג (d897bc6e, מהריצה המלאה) היא בדיוק תוצר `acceptance`; הגרסה הקצרה שהופיעה ב---fast הייתה שריד של כותב אחר. מעכשיו שני המצבים מייצרים אותו קובץ.
הערה: הרצת השערים ישירות (לא דרך police) משאירה קבצי-gen מחוללים (`new/dart-gen-bs/gen_app_*`, `dart-data-bs/auto`) — תופעת-לוואי ידועה של buildApp, לא של התיקון; police מנקה.
