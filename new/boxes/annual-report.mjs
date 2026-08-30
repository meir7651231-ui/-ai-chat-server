/** קופסת-חיבורים · דוח-שנתי-לתורם. חוזה: annual-report.contract.md
 *  מקור-אמת (L4): maor-system/src/lib/annualReport.ts (5 חוטים) + exportGate.ts (השער).
 *  מייבאת אך-ורק אטומים (חוק-2). שקעי-IO אמיתיים (DOM/setTimeout) מוזרקים (חוק-3/6).
 *  ההכרעות (money, BOM, סדר-שער-לפני-DOM) חיות כאן, לא באטומים. */
import { donationYears } from '../atoms/donation-years.mjs';
import { donationsOfYear } from '../atoms/donations-of-year.mjs';
import { annualReportLines as __pure_annualReportLines } from '../atoms/annual-report-lines.mjs';
import { ANNUAL_REPORT_LINES_T as __d_annualReportLines_ANNUAL_REPORT_LINES_T } from '../atoms/annual-report-lines-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const annualReportLines = (...a) => __pure_annualReportLines(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_annualReportLines_ANNUAL_REPORT_LINES_T);
import { annualAllLines as __pure_annualAllLines } from '../atoms/annual-all-lines.mjs';
import { ANNUAL_ALL_LINES_T as __d_annualAllLines_ANNUAL_ALL_LINES_T } from '../atoms/annual-all-lines-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const annualAllLines = (...a) => __pure_annualAllLines(...a, ...Array(Math.max(0, 7 - a.length)).fill(undefined), __d_annualAllLines_ANNUAL_ALL_LINES_T);
import { guardExport } from '../atoms/guard-export.mjs';

// ── שקע-פורמט (הכרעת-הקופסה): ₪ ברירת-מחדל / $, ללא-עיגול, he-IL ──
//    (במקור money — עוזר פרטי ב-annualReport.ts:41-43; לא-מיוצא ⇒ לא-אטום)
const money = (amount, cur) => (cur === '$' ? '$' : '₪') + amount.toLocaleString('he-IL');

// ── שקע-הורדה (הכרעת-הקופסה): BOM לעברית ב-Notepad + חיבור-'\n' (annualReport.ts:112) ──
const BOM = '﻿';

// ── החיווט ──
const wiredReportLines = (inp) => annualReportLines(inp, donationsOfYear, money);

export const years = donationYears;
export const ofYear = donationsOfYear;
export const reportLines = wiredReportLines;
export const allLines = (orgName, orgTaxId, year, supporters, site) =>
  annualAllLines(orgName, orgTaxId, year, supporters, site, donationsOfYear, wiredReportLines);

export const reportText = (lines) => BOM + lines.join('\n');

// ── ההורדה: שער-הייצוא קודם (annualReport.ts:110), אז DOM מוזרק ──
export function downloadAnnualReport({ filename, lines }, io) {
  if (!guardExport(io.blocked, io.notify)) return false; // 🔐 core.export כבוי בכרטיס-העובד
  const a = io.createAnchor();
  a.href = io.makeBlobUrl(reportText(lines), 'text/plain;charset=utf-8');
  a.download = filename;
  a.click();
  io.schedule(() => io.revokeUrl(a.href), 5000);
  return true;
}
