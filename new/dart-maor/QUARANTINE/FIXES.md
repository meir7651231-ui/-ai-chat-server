# 🔒 הסגר · 3 המרות-Dart שהאימות-העוין פסל (סטיית-התנהגות אמיתית מהמקור)
> הזהב (דוגמאות-החוזה) עבר ירוק — אבל האימות-העוין (הרצה-דיפרנציאלית מעבר לקורפוס)
> חשף שהפורט **לא** שקול-ביט למקור בקצוות. חוק-4: הפורט חייב להתנהג כמו המקור. לתיקון+חזרה.

## age-of — פסילת-תאריך-שבור
‏`DateTime.tryParse` מגלגל חודש/יום מחוץ-לטווח (‏'2000-13-01'→תקין ב-Dart, null ב-JS).
‏JS `new Date(...)===NaN` פוסל. **סיכון-נתונים: גיל-שגוי ב-CRM.**
**תיקון:** regex `^\d{4}-\d{2}-\d{2}` על ה-head + round-trip (‏d.month==הנקלט) לפני קבלה.

## gematria (gem) — קריסה על אלפים-עגולים
‏n≥1000 כפולת-100: ‏JS `s.slice(0,-1)` מחזיר '״' בשלווה; ‏Dart `s.substring(0,-1)` זורק RangeError.
**תיקון:** להחליף substring-עם-אינדקס-שלילי בלוגיקת-slice בטוחה (בדיקת-אורך לפני).

## heb-month-he — גבול ערב-ראש-השנה
המרה-ידנית (Dershowitz–Reingold) מגלגלת שנה יום-מוקדם: ‏29 אלול 5784 (2024-10-02 צהריים)
→ JS Intl 'אלול', Dart 'תשרי'. ‏1 סטייה מ-4018 ימים.
**תיקון:** לתקן את גלגול-השנה ב-`_fixedToHebrew` (או להשתמש ב-Intl-מקביל). **מומלץ: שקע-לוח.**

## shekel — סימן-RTL בפורמט-עברי (תפס: פאזר-דיפרנציאלי, אחרי זהב+אימות-עוין!)
‏JS `toLocaleString('he-IL')` מזריק סימן-כיווניות (‏U+200E) לפני מינוס: `shekel(-1)='₪‎-1'`.
השקע `_toLocaleString` עשה `.toString()` ⇒ `'₪-1'` בלי הסימן. גם `-0.5`: JS `₪‎-0` מול Dart `₪0`.
**הבאג עבר את הזהב ואת האימות-העוין** — רק הפאזר-המכני (סריקת שליליים) תפס.
**תיקון:** השקע `_toLocaleString` חייב לחקות פורמט-he-IL: סימן-RTL + עיגול-סימן-אפס.

## apply-meta-partial — null מול undefined (תפס: אימות-עוין)
‏Dart `if (v == null) return` מבלבל JS `undefined` עם JSON `null`. JS מדלג רק על undefined,
אז null-מפורש (ניקוי-שדה מ-Firestore) כן-מוקצה. **תיקון:** `if (!meta.containsKey(k)) return;`.

## build-ics — 24:00 גלגול-חצות (תפס: אימות-עוין)
‏JS `new Date('...T24:00:00')` תקין ב-V8 (מגלגל למחרת 00:00), אך Dart-guard `hh<24` דוחה
⇒ נפילה לאירוע-יום-שלם במקום שעתי. **תיקון:** לשקף סמנטיקת-Date של JS (קבל 24:00), לא משמר-טווח.

## candidate-supporters-for-charge — מיון-לא-יציב (תפס: אימות-עוין) ⚠️ מערכתי!
‏Dart `List.sort` **לא-יציב** ל-≥32 איברים (quicksort); JS `Array.sort` יציב-לפי-תקן.
שוויון-ציון ב-≥32 ⇒ סדר שונה ⇒ קבוצת-מועמדים שונה. **תיקון + כלל-המרה מערכתי:**
כל מיון ב-Dart שמסתמך על יציבות ⇒ decorate-sort-undecorate (הוסף אינדקס-מקורי כשובר-שוויון).

## default-course-dates — גלישת-יום (תפס: אימות-עוין; אותה משפחה כ-age-of/build-ics)
‏'2026-02-30' — JS מגלגל ל-03-02 (תקין); Dart round-trip-guard דוחה⇒now(). **תיקון:** לקבל גלישת-יום כמו JS (רק חודש-13/00+יום-00 נדחים).

## gem-year — מודולו-שלילי + פירוק-מספר (תפס: אימות-עוין; שניהם מערכתיים!)
‏`-5 % 1000`: JS=-5, Dart=995 ⇒ `.remainder()`. `num.parse('')`/'עברית' זורק ⇒ `num.tryParse`.
## freshen-demo-db — חודש-13 (משפחת גלישת-תאריך, כלל-4)

## heb-parts — גבול-שנה-עברית (תפס: אימות-עוין; משפחת heb-month-he)
המרה-ידנית סוטה מ-Intl בערב-ר"ה. **תיקון: שקע-לוח מוזרק (לא מימוש-Dershowitz-Reingold).**

## pay-bal — התיישנות-קטלוג (לא באג-המרה) · תוקן 25.8
**תפיסת המאמת-העוין:** ה-Dart שיקף נאמנה את `pay-bal.mjs`, אבל ה-JS עצמו היה
**מיושן מול המקור**: `maor courses/lib.ts:312-313` מחשב
`max(0, totalDue + carryBalance − paidOf)`, והאטום השמיט את `carryBalance`
(נוסף למקור 25.8). דוגמה חושפת: `{totalDue:500, carryBalance:100, שולם:150}` →
מקור 450, אטום 350.
**אומת מול המקור (L1)** — הבודק צדק. **תוקן לפי L4** (המקור קדוש, החוזה מתכופף):
הוספת `+ (e.carryBalance||0)` ל-mjs+dart+test (8 דוגמאות; carryBalance חסר=0 ⇒
5 הדוגמאות הישנות ביט-זהות) + עדכון contract. JS+Dart-gold ירוקים. הוחזר לחוזה.
**מסקנה:** לא רק ההמרה נבדקת — המאמת-העוין תופס גם אטומי-JS שהתיישנו מול הפיוניר.

## גל #20 (25.8 ערב) — 6 הסגרים מהאימות-העוין

## model-meta — רוויית-int64 בהמרת-מספר-למחרוזת (משפחת _jsStr — כלל-12 החדש)
double שלם-ערך ≥2^63: ‏Dart `truncate()` מרווה ל-int64-max. ‏size=1e21 ⇒ JS "1e+21" מול Dart "9223372036854775807"; ‏1e19 ⇒ JS עשרוני-מלא מול Dart רווי.
**תיקון:** ‏_jsStr לפי כלל-12 — ‏shortest-round-trip של JS: ‏<1e21 עשרוני-מלא, ‏≥1e21 כתיב-מעריכי; לגדר טווח לפני truncate.

## name-index — מפתח-Map ‏null↔undefined (כלל-2)
חבר עם ‏id:null + חבר חסר-שדה-id: ‏JS Map מבחין (2 רשומות), ‏Dart מתמוטט למפתח-אחד ⇒ רשומה אובדת מהאינדקס.
**תיקון:** ייצוג-מפתח שמבחין חסר מ-null (‏sentinel לחסר או containsKey-קדם).

## role-of — ‏toLowerCase יוניקוד İ (כלל-13 החדש)
‏"İ" (U+0130): ‏JS ⇒ "i̇" (2 יחידות), ‏Dart ⇒ "i". אימייל-אדמין עם İ לא מזוהה ⇒ ‏admin⇒staff.
**תיקון:** שקע-lowercase תואם-JS (טבלת-חריגים İ/I-עם-נקודה) לפי כלל-13.

## room-info-label — פריסה-עשרונית מול shortest-round-trip (כלל-12)
דאבלים שלמים 2^53<v<1e21: ‏toStringAsFixed(0) מדפיס פריסה מדויקת (…683968) מול JS מרופד-אפסים (…680000).
**תיקון:** ‏_jsStr לענף-השלמים = ‏shortest-repr של JS (toString מדעי + ריפוד-אפסים כש-exp<21).

## rooms-now — ‏roomId null↔undefined בהשוואת-דילוג (כלל-2)
חדר בלי-id מול חוג עם ‏roomId:null: ‏JS ‏null!==undefined ⇒ מדלג (חדר פנוי); ‏Dart ‏null==null ⇒ בוחן (חדר תפוס).
**תיקון:** הבחנת ‏containsKey מ-null מפורש בשני צדי-ההשוואה.

## run-audit — שלוש סטיות: ‏reduce על שדה-חסר (כלל-2) · שרשור-מחרוזת ב-reduce · ‏null⇒'undefined'
‏(1) ‏payments:[{amount:300},{}] ⇒ ‏JS ‏NaN (אפס-ממצא) מול ‏Dart ‏null⇒0 (ממצא-שווא). ‏(2) ‏amount:"100" ⇒ ‏JS שרשור "0100" מול Dart פרסינג 100. ‏(3) ‏amount:null מפורש ⇒ ‏JS ‏'null' מול ‏Dart ‏'undefined' (המיפוי-הגורף שגוי ל-null-בנתונים).
**תיקון:** ‏reduce נאמן-JS (חסר⇒NaN, מחרוזת⇒שרשור) + ‏_jsStr מבחין null-מפורש מ-חסר.

## אצווה #21 (25.8 לילה) — 7 הסגרים

## sanitize-photos — קוארציית-ארגומנטים של slice/השוואה (כלל-15 החדש)
‏photoMax="3" (מחרוזת): ‏JS ‏ToIntegerOrInfinity("3")=3 ⇒ חיתוך-ל-3; ‏Dart ממפה לא-num ל-0 ⇒ []. גם ‏photoMaxLen="6" (קוארציה-בהשוואה) וגם ‏{length:5} (קריאת-length על אובייקט) ו-raw=[null] (‏JS זורק, ‏Dart שקט).
**תיקון:** ‏_jsSlice0/_lenOf לפי כלל-15 — ‏ToNumber על ארגומנטים, ‏.length דוק-טייפינג, זריקה-נאמנה על null.

## sanitize-support-text — ‏null↔undefined בארגומנט-slice (כלל-2)
‏supportMsgMax=null מפורש: ‏JS ‏slice(0,null) ⇒ ‏ToIntegerOrInfinity(null)=0 ⇒ ''; ‏Dart ממפה null⇒עד-הסוף.
**תיקון:** ‏_jsSliceEnd: ‏end==null ⇒ 0 (ברירת-המחדל 2000 חלה רק על "לא-הועבר").

## schedule-clash-text — אינדוקס-מערך במחרוזת-קנונית (כלל-15)
‏day='1': ‏JS ‏dayNames['1']≡dayNames[1] ⇒ 'שני'; ‏Dart ‏_atIdx דורש int ⇒ 'undefined'.
**תיקון:** ‏_atIdx מקבל מחרוזת-קנונית (‏int.tryParse + ‏round-trip).

## segula-reminders — ‏setDate עם שבר-שלילי + ‏NaN + חודש-13 (כלל-4)
‏trunc(25+(−2.9))=22 ‏(JS) ≠ ‏25+trunc(−2.9)=23 ‏(Dart); ‏NaN ⇒ ‏JS שורות-NaN מול ‏Dart זריקה; "2026-13-05" ⇒ ‏JS ‏Invalid מול ‏Dart נרמול.
**תיקון:** לחשב ‏trunc על-הסכום; לגדר NaN; ‏regex+round-trip לפי כלל-4.

## segula-title — ‏_jsStr חלקי בטווח 2^53–1e21 (כלל-12)
‏day=1e20 ⇒ ‏Dart מדפיס "…000.0" מול ‏JS "…000". התנאי ‏<2^53 נוקשה — ‏2^53 עצמו כ-double נופל לענף-הרע.
**תיקון:** יישום כלל-12 מלא (פריסה-מרופדת-אפסים עד 1e21, ‏≤ בגבול).

## set-audit-context — ‏toLowerCase צ'רוקי (הרחבת כלל-13)
‏"ᏣᎳᎩ" (U+13E3…): ‏JS ⇒ קטנות (U+ABB3…); ‏Dart ⇒ ללא-שינוי. ‏_jsLower מכיר רק İ/Σ.
**תיקון:** הרחבת-הטבלה: ‏U+13A0–U+13F5 ⇒ ‏+0x97D0 (וכלל: מיפוי-מלא, לא נקודתי).

## set-employee-override — סדר-מפתחות-JS (כלל-14 החדש)
מפתחות דמויי-שלם ("2","10") ממוינים מספרית-קודם ב-JS; ‏Dart משמר סדר-הכנסה ⇒ ‏JSON שונה. בדומיין-אמיתי (מיילים עם @) לא מתממש — אך חוק-4 מחייב.
**תיקון:** עטיפת-מפה שממיינת מפתחות-שלמים-קנוניים קודם (או הכרעת-בעלים על צמצום-טיפוס).

## אצווה #22 (25.8 לילה) — 6 הסגרים

## sheet-roster — ‏courseId חסר מול null (כלל-2)
‏enrollments=[{n:1},{courseId:null}] + courseId=null: ‏JS מחריג שורה-חסרת-מפתח, ‏Dart כולל. **תיקון:** containsKey כש-הארגומנט null.

## site-campaign-progress — ‏Date.parse צורות-קצרות
‏V8 מקבל "2027"/"2026-05" (⇒1.1/יום-1); הפורט דרש 10-תווים ⇒ daysLeft:null. **תיקון:** לקבל אורך 4/7.

## site-donate-url — ריכוך-יתר על config=null
‏JS זורק TypeError (config.site לא-משורשר-אופציונלית); הפורט ריכך ל-null. **תיקון:** זריקה נאמנת בגישות-העליונות (דפוס _get-הזורק).

## size-label — ‏id=null מול שדה-חסר (כלל-2)
‏JS ‏s.id===null לא תופס חסר ⇒ "—"; ‏Dart ‏null==null ⇒ "X". **תיקון:** containsKey('id').

## smtp-host-for — ‏trim של NEL ‏U+0085 (חוק-16 החדש)
‏Dart ‏trim גוזם ‏U+0085 (Unicode WS); ‏JS לא (אינו ב-ECMAScript WS) ⇒ ‏"user@gmail.com" עם NEL: ‏JS "" מול Dart "smtp.gmail.com:465". **תיקון:** שקע-trim נאמן-ECMAScript.

## sort-support-msgs — קומפרטור לא-טרנזיטיבי (‏at מעורב-טיפוסים)
עם ערכי-at הטרוגניים (מספר+מחרוזת-לא-מספרית) ⇒ NaN בקומפרטור ⇒ הפלט תלוי-אלגוריתם (‏TimSort-V8 מול מיון-Dart) — ‏13/750 סטיות בסריקה ממצה. בקלטים הומוגניים — זהה מלא. **דורש הכרעת-בעלים:** לצמצם-טיפוס בחוזה (at אחיד) או לחקות TimSort.

## גל #23–#24 (25.8 לילה-מאוחר) — 7 הסגרים

## sup-ils · sup-count — ה-+ של JS = תמיד float64 (חוק-17 החדש)
‏2^53±ε: ‏JS מעגל-double בכל צעד (…996), ‏Dart int64 מדויק (…995). **תיקון:** ‏toDouble() בענף-המספרי של ‏_jsAdd.

## strip-audit-meta — סף-אינדקס מדויק (עידון חוק-14)
‏JS ממיין-קודם רק ‏array-indices (0..2^32−2); ‏"4294967295" ומעלה = סדר-הכנסה. **תיקון:** ‏_isJsIntegerKey ⇒ ‏n ≤ 4294967294.

## suggestions — ‏".0" בטווח [2^53,1e21) (עידון חוק-12)
‏Dart מדפיס שלם-double שם עשרונית עם ‏".0" (לא מדעית) ⇒ ענף-הרג'קס מת. **תיקון:** גיזום ‏".0" מה-toString.

## sup-avg-don — ‏Math.round(-0.4) ⇒ ‏−0 (אובדן-סימן)
‏f+1 עם f=−1.0 נותן ‏+0.0 ב-IEEE. **תיקון:** ‏if (v<0 && v>=-0.5) return -0.0; לפני ענף-השבר.

## sup-don-events · sup-dup-field-value — ‏tryParse גוזם-בעצמו (חוק-18 החדש)
‏num/double.tryParse של Dart גוזם רווחי-יוניקוד (‏U+0085!) גם אחרי ‏_jsTrim נאמן ⇒ שומר-ה-ES נעקף. **תיקון:** אימות-דקדוק-מספר-ES ‏(regex) לפני tryParse, או דחיית מחרוזת עם רווח-כלשהו אחרי ‏_jsTrim.

## גל #25–#26 (26.8 לפנות-בוקר, מתכונת-חסכונית) — 9 הסגרים
כולן משפחות-מוכרות; המאמת-החסכוני (≤10 קלטים, harness-אחד) תפס את כולן:
- **to-tenant-id · task-identity · teacher-id-of** — חוק-13 (İ/ς/צ'רוקי — מיפוי-מלא): לשאוב _toLowerJs מ-task-identity.dart ולהרחיב ל-Final_Sigma.
- **tour-advance · template-lines-to-names** — חוק-17 (float64): ‏toDouble() בחיבור/פרסינג-כמות.
- **time-cost-total · time-hours-total · teacher-id-of** — חוק-18 (‏tryParse גוזם NEL): דקדוק-ES לפני tryParse.
- **support-day-label** — פרסור-V8: שנה-מורחבת ‏+002026 מתקבלת ⇒ להרחיב regex.
- **support-msg-time** — פרסור-V8: ‏T24+שבר נחסם · שבר>9-ספרות מותר · ‏±275760 גבול-TimeClip · ‏offset≤23:59 ⇒ 4 גידורים.

## גל #27–#28 (26.8, מתכונת-היברידית) — 2 הסגרים (אומתו ב-verify-only על Opus)
- **wa-payment-text** — חוק-17+12: ‏balance=-0.5 ⇒ Math.round=-0 (JS '‎-0') מול Dart +0.0⇒'0'; ‏1e21 ⇒ ‏d.toInt() נחתך ל-int64-max. תיקון: ‏_jsAdd/toDouble + שימור-סימן-אפס-שלילי + _heIlInt דרך shortest-round-trip.
- **waitlist-for** — ‏localeCompare מול compareTo: ‏['B','a'] ⇒ JS [a,B] מול Dart [B,a]. תיקון: שקע-קולציה מודע-locale (או decorate לפי normalize).

## גל-שחרור (26.8) — 4 נותרו בהסגר לגל-חוזר
- **set-audit-context** — צ'רוקי-משלים U+13F0–13F5; **הספרייה תוקנה** (js-compat jsLower) — לשחרר עם הגרסה-המעודכנת.
- **wa-payment-text** — פורמט he-IL של שלילי-אלפים (LRM U+200E) — צריך שקע-Intl.NumberFormat (לא בספרייה עדיין).
- **apply-meta-partial** — null↔חסר כש-db חסר-המפתח: המיפוי-הגורף מפתח-חסר⇒'null' מזהה שוב עם null-מפורש; דורש הבחנה מבנית (לא jsStr).
- **template-lines-to-names** — eyes/rate שלם-double בטווח [9.2e18,1e21): _jsNumJson של-הסוכן ממיר ל-int רק <int64; חייב jsStr המאומת (toStringAsFixed בלי .0). לשחרר עם jsStr verbatim.

## גל-שחרור-תאריכים (26.8) — 3 נותרו בהסגר
- **support-msg-time** — TimeClip ±275760 עם שבר-מילישנייה: הגידור מתעלם משבר-השנייה בגבול; דורש טיפול-שבר-בגבול-TimeClip.
- **run-audit** — קוארציית 0b/0o בבדיקת-סכום: השתמש _jsToNum במקום _jsStrToNum המלא; להחליף ל-jsStrToNum (מכיר בינארי/אוקטלי).
- **waitlist-for** — localeCompare אמיתי (enrolledAt מחרוזת-חופשית בחוזה): דורש שקע-קולציה מודע-locale (לא בספרייה).

## 🏁 סיום-מאור (26.8) — 9 האטומים האחרונים חזרו לחוזה · הסגר 10→1
כל הלוגיקה-הטהורה של מאור הומרה ל-Dart שקולת-ביט. שוחררו (זהב + אימות-עוין מול Node):
- **heb-parts · heb-month-he** — תוקן גלגול-השנה של Dershowitz–Reingold ל-canonical; אומת 0 סטיות מול Intl על 255K ימים.
- **apply-meta-partial** — containsKey+סנטינל (null-מפורש↔מפתח-חסר).
- **schedule-clash-text** — _atIdx מקבל מחרוזת-אינדקס-קנונית (כלל-15).
- **suggestions** — jsStr המאומת (בלי ".0" בטווח [2^53,1e21)).
- **support-msg-time** — V8 מגלגל יום-בטווח-[1,31] שחורג-מהחודש (Feb 29 בפשוטה ⇒ Mar 1); שונה מ-`day>_daysInMonth` ל-`day>31`. אומת מול Node.
- **shekel · wa-payment-text** — **תוקן באג-שורש ב-js-compat-reference**: `jsHeIlInt`/`jsStr` השתמשו ב-`toStringAsFixed(0)` (פריסת-double מדויקת …683968) ובמעריכי ל-≥1e21, אך `toLocaleString`/`String()` = **shortest-round-trip** (…680000) ומרחיבים ≥1e21 לספרות-מלאות. נוסף `_expandIntFromDart` (מרחיב את shortest של Dart.toString). אומת מול Node על 1e21/1.5e21/…680000/-0.
- **run-audit** — 3 סטיות: (1) `+` פולימורפי — reduce-הסכומים משרשר-מחרוזות כשאופרנד מחרוזתי (`0+"100"="0100"`), לא חיבור-מספרי; (2) null↔undefined ב-reduce — `0+null=0` (Number(null)=0) אך `0+undefined=NaN` (סנטינל דרך containsKey); (3) שרשור-property — `+d.amount` נותן 'null' ל-null-מפורש, 'undefined' למפתח-חסר. נוספו `_jsPlus`/`_jsGt`/`_numAdd`/`_jsConcat`/`_prop`. אומת מול Node על קורפוס-עוין מלא + 7 ratchet.
- **תובנה מערכתית (js-compat-reference · jsNum):** ב-harness-JSON אין `undefined` ⇒ **null-מפורש הוא תמיד JS-null ⇒ Number(null)=0** (לא NaN); מפתח-חסר (undefined) מזוהה ב-containsKey **לפני** הקוארציה (חוק-2). תוקן `jsNum(null)=0` בספרייה.

### 🔒 נותר בהסגר: 1 — אטום-שקע לגיטימי (לא כשל-המרה)
- **waitlist-for** — `localeCompare` על `enrolledAt` (מחרוזת-חופשית בחוזה): קולציית-ICU מלאה אינה ניתנת-להטבעה כעוזר טהור (`['B','a']` ⇒ JS `[a,B]` מול Dart `[B,a]`). **מקבילה מדויקת ל-hebrew-calendar-socket** — דורש שקע-קולציה מוזרק, לא מימוש-פנימי. לנתונים-האמיתיים (חותמות-ISO) שקול-ביט; נשאר כאטום-שקע עד הכרעת-שקע-הקולציה. **מאור-הלוגיקה = גמור.**
