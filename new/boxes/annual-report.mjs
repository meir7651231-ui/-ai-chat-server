/** קופסת-חיבורים · דוח-שנתי-לתורם. חוזה: annual-report.contract.md
 *  מקור-אמת (L4): maor-system/src/lib/annualReport.ts (5 חוטים) + exportGate.ts (השער).
 *  מייבאת אך-ורק אטומים (חוק-2). שקעי-IO אמיתיים (DOM/setTimeout) מוזרקים (חוק-3/6).
 *  ההכרעות (money, BOM, סדר-שער-לפני-DOM) חיות כאן, לא באטומים. */
import { donationYears } from '../atoms/donation-years.mjs';
import { donationsOfYear } from '../atoms/donations-of-year.mjs';
import { annualReportLines } from '../atoms/annual-report-lines.mjs';
import { annualAllLines } from '../atoms/annual-all-lines.mjs';
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
