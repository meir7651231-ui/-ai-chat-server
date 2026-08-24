/** חוט · donations-of-year — תרומות שנה אחת, ממוינות עולה. חוזה: donations-of-year.contract.md
 *  חולץ כלשונו מ-maor/src/lib/annualReport.ts:37-39 (דוח-שנתי-לתורם). */
export function donationsOfYear(donations, year) {
    return donations.filter((d) => (d.date || '').startsWith(year + '-')).sort((a, b) => a.date.localeCompare(b.date));
}
