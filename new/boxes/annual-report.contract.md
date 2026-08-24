# חוזה · קופסת-חיבורים "דוח-שנתי-לתורם"

**תפקיד:** הקופסה של `lib/annualReport.ts` (ROADMAP-100 ‏#4) — מסמך-ריכוז של
תרומות שנת-מס לועזית לתורם/ת. מחווטת 5 חוטי-המקור במקום אחד: שנות-התרומה,
תרומות-שנה, שורות-דוח-יחיד, דוח-כל-התורמים, וההורדה (מגודרת שער-ייצוא).

**מקור-אמת (L4):** `maor-system/src/lib/annualReport.ts` +
`exportGate.ts` (השער). כל השורות חולצו כלשונן לאטומים; הקופסה רק מחווטת.

## מה חי בקופסה (הכרעות — CURRICULUM #4)
- **`money(amount, cur?)`** — עוזר-פורמט **פרטי** במקור (annualReport.ts:41-43,
  לא-מיוצא ⇒ לא-אטום): `(cur==='$' ? '$' : '₪') + amount.toLocaleString('he-IL')`.
  ללא-עיגול, ‏₪ ברירת-מחדל. שוקע ל-annualReportLines.
- **`BOM` + חיבור-שורות** — טקסט-ההורדה = ‏`'﻿' + lines.join('\n')`
  (annualReport.ts:112) — ‏BOM לעברית ב-Notepad. הכרעת-קופסה.
- **סדר-החיווט:** שער-הייצוא (`guardExport`) **קודם** לכל פעולת-DOM
  (annualReport.ts:110) — נעול במגן-הכרעה.

## שקעים מוזרקים (חוק-1/3/6 — IO אמיתי, לא מימוש)
`downloadAnnualReport({filename, lines}, io)` — ‏`io`:
- `blocked` ⇒ boolean · `notify` ⇒ ‏(()=>void)|null — שער-הייצוא (guard-export).
- `createAnchor()` ⇒ אלמנט עם ‏.href/.download/.click() (במקור `document.createElement('a')`).
- `makeBlobUrl(text, mime)` ⇒ string (במקור `URL.createObjectURL(new Blob(...))`).
- `revokeUrl(url)` ⇒ void (במקור `URL.revokeObjectURL`).
- `schedule(fn, ms)` ⇒ void (במקור `setTimeout`, 5000ms).

## חשיפה
- `years(donations)` ⇒ string[] — שנות-התרומה, יורד (החדשה ראשונה).
- `ofYear(donations, year)` ⇒ AnnualDonation[] — תרומות-השנה, עולה לפי תאריך.
- `reportLines(inp)` ⇒ string[] — שורות דוח-יחיד (‏money+ofYear מחווטים).
- `allLines(orgName, orgTaxId, year, supporters, site?)` ⇒ string[] — דוח-כל-התורמים.
- `reportText(lines)` ⇒ string — ‏BOM + חיבור-'\n'.
- `downloadAnnualReport({filename, lines}, io)` ⇒ boolean — חסום ⇒ false בלי DOM;
  מותר ⇒ עוגן.download=filename · click · schedule(revoke,5000) · ⇒ true.

## דוגמאות מחייבות
inp = {orgName:'מאור', orgTaxId:'580123456', supporterName:'דוד לוי',
payerId:'012345678', year:'2026', site:'maor.org', donations:
[{date:'2026-03-01',amount:180,rid:'D-7'},{date:'2026-01-15',amount:100,cur:'$'},
{date:'2025-12-31',amount:999}]}:
- `years(inp.donations)` = ['2026','2025'] (יורד).
- `ofYear(inp.donations,'2026')` = הדולרית ‏(2026-01-15) ראשונה, אז ‏180 — מיון עולה.
- `reportLines(inp)` — אורך=20 · ‏[9]='2026-01-15          $100' · ‏[10]='2026-03-01          ₪180  קבלה D-7'
  · ‏[13]='סה"כ בשקלים: ₪180' · ‏[14]='סה"כ בדולרים: $100'.
- אפס-תרומות (year='2027', בלי taxId) ⇒ שורת 'אין תרומות רשומות בשנת 2027.', בלי §46.
- `allLines('מאור',undefined,'2026',[{name:'א',donations:[{date:'2026-05-01',amount:50}]}])` — מקטע-יחיד בלי מפריד-עמוד.
- `reportText(['a','b'])` = '﻿a\nb'.
- `downloadAnnualReport({filename:'r.txt',lines:['x']}, {blocked:true,...})` ⇒ false, אפס createAnchor.
- `downloadAnnualReport({filename:'r.txt',lines:['x']}, io-מותר)` ⇒ true, a.download='r.txt', click פעם-אחת, schedule(fn,5000).

## מוצא (עוגני-שורה · דיבר 11)
- `annualReport.ts:32-34` donationYears · `:37-39` donationsOfYear ·
  `:41-43` money · `:46-84` annualReportLines · `:87-106` annualAllLines ·
  `:109-116` downloadAnnualReport · `exportGate.ts:33-39` guardExport.

## DoD (דיבר 12 — פקודה+פלט-צפוי, לפני הקוד)
- `node new/boxes/annual-report.test.mjs` ⇒ exit 0.
- `node maor-system/machtzev/parity/annual-report.parity.mjs` ⇒ exit 0 (ישן≡חדש).
