/** חוט · mint-feed-token — token אקראי 32-hex לפיד-ה-ICS (crypto של הפלטפורמה,
 *  לא Math.random). חוזה: mint-feed-token.contract.md · שקעים: אין —
 *  crypto הוא סטנדרט-פלטפורמה (חוק-1: מותר שפה/סטנדרט).
 *  חולץ כלשונו מ-maor/src/lib/icsFeed.ts:17-23. */
export function mintFeedToken() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}
