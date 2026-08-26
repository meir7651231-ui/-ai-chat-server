# 🏁 CLOSED · המרת-מאור ל-Dart הושלמה (26.8.2026)

**הכרעת-בעלים "תסיים את מאור" — בוצע.** כל הלוגיקה-הטהורה של maor-system הומרה
מ-JavaScript ל-Dart שקול-ביט, אומתה בזהב (דוגמאות-חוזה) **וגם** באימות-עוין
(הרצה-דיפרנציאלית מול אורקל-Node על קורפוס-קצוות), ונחתה בחוזה.

## המספרים
- **מאור-Dart בחוזה: 625 אטומים.**
- **בהסגר: 1** — `waitlist-for` בלבד (אטום-שקע-קולציה לגיטימי, ראה למטה).
- משטרה: **7/7 ירוקה** (wiring · contract · quarry · freeref · pins · selftest · mutation).

## הגל האחרון — הסגר 10→1 (9 אטומים שוחררו)
| אטום | הבאג-שהיה | התיקון |
|------|-----------|--------|
| heb-parts · heb-month-he | גלגול-שנה של Dershowitz–Reingold סוטה מ-Intl בערב-ר"ה | תיקון-canonical; אומת 0 סטיות על 255K ימים |
| apply-meta-partial | null-מפורש↔מפתח-חסר (JS מדלג רק על undefined) | containsKey + סנטינל |
| schedule-clash-text | אינדוקס-מערך במחרוזת-קנונית ('1'⇒dayNames[1]) | _atIdx int.tryParse + round-trip (כלל-15) |
| suggestions | ".0" בטווח [2^53,1e21) שובר ענף-רג'קס | jsStr המאומת (בלי ".0") |
| support-msg-time | V8 מגלגל יום-בטווח-[1,31] שחורג-מהחודש (Feb 29 בפשוטה ⇒ Mar 1); הפורט דחה ל-Invalid | `day>31` במקום `day>_daysInMonth` |
| shekel · wa-payment-text | ראה "באג-השורש" למטה | _expandIntFromDart + jsNum(null)=0 |
| run-audit | ראה "run-audit" למטה | _jsPlus/_jsGt/_numAdd/_jsConcat/_prop |

## 🔑 באג-שורש שנתפס בספרייה (js-compat-reference · jsHeIlInt/jsStr)
`toLocaleString('he-IL')` ו-`String(num)` של JS משתמשים ב-**shortest-round-trip**
(‏`1.2345678901234568e20` ⇒ `"123456789012345680000"`), **לא** בפריסת-ה-double
המדויקת (`…683968`) שנותן `toStringAsFixed(0)`. בנוסף, `toLocaleString` **מרחיב**
ערכים ≥1e21 לספרות-מלאות (בעוד `String()` נותן `"1e+21"`). הפורטים הישנים השתמשו
ב-`toStringAsFixed(0)` ובמעריכי ⇒ סטייה. **התיקון:** `_expandIntFromDart` — פורס את
ספרות-ה-shortest של `Dart.toString()` ומרחיב אותן לשלם-מלא (מרפד אפסים). אומת מול
Node על `1e21`/`1.5e21`/`…680000`/`-0`/`999999999999999900000`. הבאג היה **חבוי גם
ב-shekel** (עבר אימות-עוין 10/10 כי לא נבדק ≥1e21) — תוקן והושרש לספרייה.

## 🔑 run-audit — שלוש סטיות של אופרטורי-JS
1. **`+` פולימורפי:** `reduce((a,x)=>a+x.amount,0)` — כשאופרנד מחרוזתי, JS משרשר
   (`0+"100"="0100"`), לא מחבר-מספרית. תוקן ב-`_jsPlus` (מחרוזת-באחד-הצדדים ⇒ שרשור).
2. **null↔undefined ב-reduce:** `0+null=0` (Number(null)=0) אך `0+undefined=NaN`.
   מפתח-חסר מזוהה ב-`_prop` (containsKey ⇒ סנטינל-undefined); `_numAdd` נותן null⇒0, undefined⇒NaN.
3. **שרשור-property:** `'…'+d.amount` — null-מפורש ⇒ `'null'`, מפתח-חסר ⇒ `'undefined'`.
   תוקן ב-`_concatProp` (containsKey-מודע). +7 ratchet; אומת מול Node על קורפוס-עוין.

## 🧠 תובנה מערכתית — null בהקשר-מספרי (js-compat-reference · jsNum)
ב-harness-האימות (JSON) **אין `undefined`** ⇒ כל `null` הוא JS-null ⇒ `Number(null)=0`
(לא NaN). מפתח-חסר (undefined אמיתי ב-JS) מזוהה ב-`containsKey` **לפני** הקוארציה
(חוק-2). לכן `jsNum(null)=0` בספרייה (תוקן מ-NaN). כל אטום שמקבל null-מפורש בהקשר-מספרי
נהנה מזה; חסר-מפתח נשאר undefined⇒NaN דרך הבדיקה-המקדימה.

## 🔒 היחיד שנשאר בהסגר — waitlist-for (לא כשל-המרה)
`waitlistFor` ממיין לפי `enrolledAt` עם `localeCompare`. קולציית-ICU מלאה
(`['B','a']` ⇒ JS `[a,B]` מול Dart `[B,a]`) **אינה ניתנת-להטבעה** כעוזר-טהור.
זהו **אטום-שקע** — מקבילה מדויקת ל-`hebrew-calendar-socket`: דורש שקע-קולציה מוזרק,
לא מימוש-פנימי. לנתונים-האמיתיים (חותמות-ISO) שקול-ביט. יישאר בהסגר עד הכרעת-שקע-הקולציה
(שתשרת גם כל `localeCompare` עתידי בבנייה-חכמה).

## הבא-בתור
1. **קידום 197 חוטי-בנייה-חכמה** (`dart-quarry/` → `new/dart/`) — כבר Dart, רק contract+test.
2. `dedup-cross-dart` — ליבה-אימפריאלית משותפת מאור↔בנייה-חכמה.
3. הכרעת-שקע-הקולציה (waitlist-for + localeCompare עתידי).
4. שכבת-המסכים (הכרעה-15) → זהב-מלא → cutover → המחולל.
