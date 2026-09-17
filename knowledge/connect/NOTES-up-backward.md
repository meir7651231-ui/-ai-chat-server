# NOTES — up-backward ("כל מנוע יכול לנוע קדימה ואחורה")

## הכרעה: איזה מנוע לשדרג
**נבחר `machtzev/generator/behavior-plan.mjs`** (לא `search-record.mjs`).
- behavior-plan הוא **הבורר-קדימה**: צורך (params⇒ret) ⇒ מועמדים מ-`catalog()` (963 אטומי-לוגיקה) מסוננים ב-`sigOk` ⇒ הוכחה-בריצה ב-`proveCandidates`. כל התשתית לכיוון-ההפוך כבר שם: חתימות (params/ret/argc), `sigOk`, `chainCands`, `proveCandidates`, `isPure`.
- `search-record.mjs` הוא חיפוש-מילים מהאורקל (טוקנים⇒מועמדים לפי ניקוד-טקסט). **אין בו מושג של חתימה.** הכיוון-ההפוך = היפוך-חתימה (f:(A)⇒B ⇒ מי מקבל B ומחזיר A) — עניין של טיפוסים, לא של מילים. לכן שייך ל-behavior-plan.
- תקדים-עיקרון: `combine-screens.mjs` כתוב במפורש כ"הכיוון-ההפוך" של screen-decomp. כאן אותו עיקרון על חתימת-אטום.

## מה נוסף (אפס-שינוי-בברירת-מחדל)
מצב `--backward <atomId> [--examples <json>] [--imports <json>]`:
1. `forwardSigOf` — שולף חתימת f מ-`catalog()`.
2. `backwardNeeds(sig)` — בונה צרכים הפוכים: (א) **strict**: params=[ret של f], ret=params[i] (וריאציה לכל פרמטר); (ב) **invert** (§20-ב הרכבה-עד-שמושג): היפוך-פוזיציוני ששומר שאר-הפרמטרים — פותר-עבור-A[i] בהינתן השאר+התוצאה. דדופ לפי חתימה.
3. סינון כל הקטלוג ב-`sigOkBack` = `sigOk` + **אחדת-מספרים** (int/double/num מתאחדים) — הכיוון-ההפוך פחות דורש-דיוק-טיפוסי (למשל cockpitDaysSince⁻¹=addDaysIso: num⇐→int).
4. אם ניתנו דוגמאות ⇒ `proveCandidates` (Dart; מועמד שאריתו≠הדוגמה לא-מתקמפל⇒0 — הריצה מכריעה, לא הדירוג).
5. פלט JSON: `{atom, forwardSig, backwardNeed, backwardNeeds, candidates:[{id,file,exact,proven,ok,total,needs}]}`.

- `exact` = תואם-חתימה מדויק (norm, בלי אחדת-מספרים) לאחד הצרכים = היפוך-מבני אמיתי.
- ההרצה משתמשת ב-`DART=/root/dart-sdk/bin/dart` (עובד מקביל מתקן את הפתרון האוטומטי — לא נגעתי ב-logic-proof.mjs).
- אינטגרציה: בלוק `if (isMain && --backward){…; process.exit(0)}` **לפני** בלוק ה-isMain הקיים ⇒ ברירת-המחדל ו---gate ללא-שינוי.

## הערת-commit
בתחילה pre-commit חסם על `learn` (9 הפרות = ref-blobs חסרים). הסיבה: **הקלון היה shallow** ⇒ `git show <blob>`
נכשל על blobs היסטוריים. פתרון סביבתי: `git fetch --unshallow origin` ⇒ הבלובים חזרו ⇒ `learn` ירוק (116 לקחים).
עקיפת-טבעות חסומה ב-pre-tool (R2-3.7) — הפתרון היה להחזיר את הבלובים, לא לעקוף. police --fast זהה לפני/אחרי השינוי.
