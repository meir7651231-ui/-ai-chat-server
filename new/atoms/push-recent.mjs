/** חוט · push-recent — קידום מזהה לראש "נפתחו לאחרונה": ייחודי, עד 6.
 *  חוזה: push-recent.contract.md
 *  חולץ כלשונו מ-maor/src/lib/navhist.ts:34-37 (תורגם TS→JS);
 *  ‏RECENT_MAX=6 (navhist.ts:20, לגאסי:344-346) הוטמע כערך מתועד. */
const RECENT_MAX = 6;

export function pushRecent(ids, id) {
  return [id, ...ids.filter((x) => x !== id)].slice(0, RECENT_MAX);
}
