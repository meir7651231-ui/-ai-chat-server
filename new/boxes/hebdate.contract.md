# חוזה · קופסת-חיבורים "hebdate" — שכבת קלט/תצוגה תאריך-עברי
**מקור-האמת (L4):** ‏`maor-system/src/lib/hebdate.ts` · תוכנית: `box-drafts/lib-hebdate.box-draft.md` (8 חוטים).

**תפקיד:** המרות עברי↔לועזי דרך Intl בלבד — המערכת שומרת ISO לועזי; העברי = שכבת
קלט/תצוגה (hebdate.ts:1-10). החיווט (=ההכרעות) שחי בקופסה:
- ‏isoOf — הרכבת ISO מקומי דרך pad2 (‏hebdate.ts:60-62).
- ‏hebToIsoEn — סריקת-העוגן: 1-באוגוסט של (שנה עברית−3761), עד 440 ימים, בצהריים-מקומי
  (חסין שעון-קיץ); גבולות יום 1..30 ושנה 4000..7000 ⇒ null (‏hebdate.ts:65-75).
- ‏KNOWN_MONTHS_EN — מילון 14 שמות-Intl מוכרים כולל 'Adar'+'Adar I/II' (‏hebdate.ts:124).
- ברירות-מחדל: ‏hebYearNow(now=new Date()) (‏hebdate.ts:53) · ‏validateHebMonthNames(hebYear=hebYearNow()) (‏hebdate.ts:125).
- שער-ה-CLDR שבמקור רץ בטעינת-מודול (‏hebdate.ts:139-143) נחשף כ-`cldrGuard(now, warn)` —
  שקע-warn מוזרק; הקופסה נקייה מתופעות-לוואי בייבוא (חיווט-לוח-האם באתחול).

**חשיפה:** ‏monthHeOf · monthEnOf · hebYearNow · isHebLeapYear · hebMonthsOf · hebToIso ·
isoToHebParts · validateHebMonthNames (+‏KNOWN_MONTHS_EN, ‏cldrGuard).

**דוגמאות מחייבות (מקריאת-הקוד):**
- ‏`monthHeOf('Av')`=`'אב'` · ‏`monthHeOf('Foo')`=`''` (‏hebdate.ts:42-44)
- ‏`monthEnOf('אב')`=`'Av'` · ‏`monthEnOf('אדר א׳')`=`'Adar I'` · ‏`monthEnOf('זבל')`=`null` (‏hebdate.ts:47-49)
- ‏`hebToIso(23,'אב',5786)`=`'2026-08-06'` (הדוגמה שבמקור — hebdate.ts:97)
- ‏`isoToHebParts('2026-08-06')`=`{day:23, monthHe:'אב', year:5786}` (‏hebdate.ts:106)
- ‏`hebYearNow(new Date(2026,7,24,12))`=`5786` (י״א אלול תשפ״ו)
- ‏`isHebLeapYear(5784)`=`true` · ‏`isHebLeapYear(5786)`=`false` (‏hebdate.ts:79-85)
- ‏`hebMonthsOf(5786)` = ‏12 חודשים עם `'אדר'` (בלי א׳/ב׳); ‏`hebMonthsOf(5784)` = ‏13 עם
  `'אדר א׳'`+`'אדר ב׳'` (בלי `'אדר'`), פתיחה `'תשרי'` וסיום `'אלול'` (‏hebdate.ts:91-94)
- ‏`hebToIso(1,'אדר א׳',5786)`=`null` (אדר א׳ בשנה פשוטה — hebdate.ts:98)
- שמירת-גבולות (‏hebdate.ts:66-67): ‏`hebToIso(0|31|2.5,'אב',5786)`=`null` ·
  ‏`hebToIso(15,'אב',3999|7001)`=`null`
- קלט שבור (‏hebdate.ts:108-110): ‏`isoToHebParts('junk'|''|'2026-8-6')`=`null`.
  ⚠ ‏`'2026-02-30'` עובר את הרג׳קס ו-V8 מגלגל ל-2 במרץ — התנהגות-המקור נשמרת:
  ‏`isoToHebParts('2026-02-30')`≡`isoToHebParts('2026-03-02')` (לא null)
- ‏`validateHebMonthNames(5786)`=`[]` · ‏`validateHebMonthNames(5784)`=`[]` (‏hebdate.ts:125-137)
- ‏`cldrGuard(new Date(2026,7,24,12), warn)`=`true` בלי קריאת-warn; ‏warn נקרא (הודעת
  המקור hebdate.ts:142 תו-בתו) רק כששם-החודש לא-מוכר.
- ‏round-trip: לכל ISO תקין, ‏`hebToIso(isoToHebParts(iso))`≡iso.

**DoD (נכתב לפני הקוד — דיבר 12):**
- ‏`node new/boxes/hebdate.test.mjs` ⇒ ‏exit 0 + שורת-סיכום `✓ קופסת-hebdate: …`
- ‏`node /home/user/maor-system/machtzev/parity/hebdate.parity.mjs` ⇒ ‏exit 0 + `🥇 זהב-hebdate: ישן≡חדש על N השוואות` (קורפוס-LCG ‏seed=20260824, אפס Date.now בקורפוס)

**מגן-הכרעה (בבדיקה, על מקור-הקופסה):** ‏`hebYear - 3761` · ‏`i < 440` ·
‏`new Date(gy, 7, 1 + i, 12)` · ‏`now = new Date()` · הודעת-ה-warn תו-בתו ·
ייבוא מ-`../atoms/` בלבד · אפס `console.warn(` ברמת-מודול (השער — פונקציה, לא תופעת-לוואי).
