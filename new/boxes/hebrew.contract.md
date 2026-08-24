# חוזה · קופסת-חיבורים "hebrew" (תוכנית: box-drafts/lib-hebrew.box-draft.md)
**תפקיד:** כל ה-API הציבורי של הלוח העברי — maor/src/lib/hebrew.ts (מקור-האמת, L4) —
מחווט מ-9 חוטים ב-new/atoms. אפס שקעי-IO: הכול Intl/סטנדרט; אין DOM/רשת/אחסון.

## DoD (נכתב לפני הקוד — דיבר 12)
- `node new/boxes/hebrew.test.mjs` ⇒ exit 0 (כל הדוגמאות שלמטה + מגן-הכרעה).
- `node /home/user/maor-system/machtzev/parity/hebrew.parity.mjs` ⇒ exit 0,
  אפס-סטייה ישן≡חדש על קורפוס-LCG ‏seed=20260824 + סריקת-ימים רציפה רב-שנתית.

## חשיפה (שם-מקור ⇒ עוגן-שורה במקור — דיבר 11)
| ייצוא | מקור hebrew.ts | חוט(ים) |
|---|---|---|
| `gem(n)` | ‏15–27 | gematria |
| `gemYear(y)` | ‏29–31 | gem-year ← gem |
| `adarNorm(monthEn)` | ‏45–47 | adar-norm |
| `hebAnnualEq(anchor, query)` | ‏95–121 | heb-annual-eq ← scanHebYear |
| `hebParts(d)` | ‏124–129 | heb-parts |
| `hebPartsOfIso(iso)` | ‏137–147 | heb-parts-of-iso ← heb-parts |
| `hebDateFull(iso)` | ‏156–161 | heb-date-full ← gem·gemYear·heb-parts |
| `HOLIDAYS` | ‏164–202 | holidays (קבוע, 33 מפתחות) |
| `holidayOf(d)` | ‏205–229 | holiday-of ← heb-parts·scanHebYear·HOLIDAYS |

## הכרעות-החיווט (חיות בקופסה בלבד)
1. **סריקת-שנה `scanHebYear`** (מקור ‏60–76): חלון **440 ימים**, עוגן `new Date(gy, 7, 1 + i, 12)`
   כאשר `gy = hebYear - 3761` (1 באוגוסט קודם תמיד לא' תשרי), מטמון-Map פר-שנה.
   זהו חיווט-הרכבה (קומפוזיציה של חוט heb-parts), לא IO — לכן חי כאן ולא כפרמטר.
2. **סדר-השקעים**: ‏`hebAnnualEq(a,q,scanHebYear)` · ‏`hebPartsOfIso(iso,hebParts)` ·
   ‏`hebDateFull(iso,gem,gemYear,hebParts)` · ‏`holidayOf(d,hebParts,scanHebYear,HOLIDAYS)` ·
   ‏`gemYear(y,gem)` — זהה לגרף-הקריאות של המקור.
3. שמות-הייצוא = שמות-המקור verbatim (החלפה-הפיכה, חוק-7).

## דוגמאות מחייבות (אומתו מול המקור המתורגם-חי, 24.8.2026)
- `gem(15)='ט״ו'` · `gem(16)='ט״ז'` · `gem(786)='תשפ״ו'` · `gem(1)='א׳'` ·
  `gem(-3)=''` · `gem(0)=''` · `gem(NaN)=''` · `gem(5786)='פ״ו'` (אין אות ל-5700).
- `gemYear(5786)='תשפ״ו'` · `gemYear('5786')='תשפ״ו'`.
- `adarNorm('Adar II')='Adar'` · `adarNorm('Adar I')='Adar I'` · `adarNorm('Elul')='Elul'`.
- `hebPartsOfIso('2026-08-24') = {day:11, month:'Elul', year:5786}` ·
  `hebParts(new Date('zzz')) = {day:0, month:'', year:0}`.
- `hebDateFull('2026-08-24')='י״א אלול תשפ״ו'` · `hebDateFull('')=''` · `hebDateFull('junk')=''`.
- כלל-ל' (מקור ‏99–111): עוגן `{day:30,month:'Heshvan'}` מול `{day:1,month:'Kislev',year:5786}`
  ⇒ **true** (חשוון תשפ"ו חסר); מול אותו-יום בשנת 5785 (חשוון מלא) ⇒ **false**.
- דין-אדר (מקור ‏112–120): עוגן `{14,'Adar'}` מול י"ד אדר-ב' תשפ"ד (2024-03-24) ⇒ **true**;
  עוגן `{14,'Adar I'}` מול אותו יום ⇒ **false**.
- `HOLIDAYS['Nisan 15']='פסח'` · 33 מפתחות.
- `holidayOf`: ‏2025-12-15 ⇒ 'חנוכה' · ‏2023-12-15 (ג' טבת, כסלו חסר) ⇒ 'חנוכה' ·
  ‏2025-12-23 (ג' טבת, כסלו מלא) ⇒ null · ‏2022-08-06 (ט' אב בשבת) ⇒ null ·
  ‏2022-08-07 ⇒ 'תשעה באב (נדחה)' · ‏2024-10-05 ⇒ null · ‏2024-10-06 ⇒ 'צום גדליה (נדחה)' ·
  ‏2013-02-21 ⇒ 'תענית אסתר (מוקדם)' · ‏2013-02-23 (י"ג אדר בשבת) ⇒ null ·
  ‏2026-04-02 ⇒ 'פסח'.

## הבחנה מקופסת hebrew-calendar
‏hebrew-calendar = קופסת-תצוגה רזה (parts/fullDate/annualKey על ISO). הקופסה הזו =
כיסוי-API מלא של lib-hebrew (9/9 חוטי-התוכנית), כולל דיני-חגים ושוויון-שנתי.
