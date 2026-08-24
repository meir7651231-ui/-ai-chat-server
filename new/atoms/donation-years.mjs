/** חוט · donation-years — שנות-התרומה של תורם/ת, יורד. חוזה: donation-years.contract.md
 *  חולץ כלשונו מ-maor/src/lib/annualReport.ts:32-34 (דוח-שנתי-לתורם). */
export function donationYears(donations) {
    return [...new Set(donations.map((d) => (d.date || '').slice(0, 4)).filter((y) => /^\d{4}$/.test(y)))].sort().reverse();
}
