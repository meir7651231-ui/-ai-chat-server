/** חוט · heb-months-of — חודשי שנה עברית לפי הסדר, בתוויות עבריות (12/13).
 *  חוזה: heb-months-of.contract.md · חולץ כלשונו מ-maor/src/lib/hebdate.ts:95-99;
 *  השכנים isHebLeapYear/monthHeOf הוזרקו כשקעים (חוק-1); סדרי-החודשים = קבוע-נתונים. */

/** סדר החודשים בשנה פשוטה (12) ובשנה מעוברת (13) — שמות Intl. */
const ORDER_COMMON = [
  'Tishri', 'Heshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar',
  'Nisan', 'Iyar', 'Sivan', 'Tamuz', 'Av', 'Elul',
];
const ORDER_LEAP = [
  'Tishri', 'Heshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar I', 'Adar II',
  'Nisan', 'Iyar', 'Sivan', 'Tamuz', 'Av', 'Elul',
];

export function hebMonthsOf(hebYear, isHebLeapYear, monthHeOf) {
  const order = isHebLeapYear(hebYear) ? ORDER_LEAP : ORDER_COMMON;
  return order.map(monthHeOf);
}
