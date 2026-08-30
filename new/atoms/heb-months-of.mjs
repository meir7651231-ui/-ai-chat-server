/** חוט · heb-months-of — חודשי שנה עברית לפי הסדר, בתוויות עבריות (12/13).
 *  חוזה: heb-months-of.contract.md · חולץ כלשונו מ-maor/src/lib/hebdate.ts:91-94;
 *  השכנים isHebLeapYear/monthHeOf הוזרקו כשקעים (חוק-1); סדרי-החודשים = קבוע-נתונים. */

/** סדר החודשים בשנה פשוטה (12) ובשנה מעוברת (13) — שמות Intl. */

export function hebMonthsOf(hebYear, isHebLeapYear, monthHeOf, ORDER_COMMON, ORDER_LEAP) {
  const order = isHebLeapYear(hebYear) ? ORDER_LEAP : ORDER_COMMON;
  return order.map(monthHeOf);
}
