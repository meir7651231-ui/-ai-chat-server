/** חוט · push-nav — דחיפת מיקום קודם למחסנית "↩ חזרה", תקרה 20 (הישן נזרק).
 *  חוזה: push-nav.contract.md
 *  חולץ כלשונו מ-maor/src/lib/navhist.ts:28-33 (תורגם TS→JS);
 *  ‏NAV_HIST_MAX=20 (navhist.ts:19, לגאסי:166) הוטמע כערך מתועד. */
const NAV_HIST_MAX = 20;

export function pushNav(hist, prev) {
  const h = [...hist, prev];
  return h.length > NAV_HIST_MAX ? h.slice(h.length - NAV_HIST_MAX) : h;
}
