/** חוט · push-nav — דחיפת מיקום קודם למחסנית "↩ חזרה", תקרה 20 (הישן נזרק).
 *  חוזה: push-nav.contract.md
 *  חולץ כלשונו מ-maor/src/lib/navhist.ts:28-33 (תורגם TS→JS);
 *  ‏NAV_HIST_MAX=20 (navhist.ts:19, לגאסי:166) הוטמע כערך מתועד. */

export function pushNav(hist, prev) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const NAV_HIST_MAX = 20;

  const h = [...hist, prev];
  return h.length > NAV_HIST_MAX ? h.slice(h.length - NAV_HIST_MAX) : h;
}
