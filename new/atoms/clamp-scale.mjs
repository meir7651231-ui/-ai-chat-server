/** חוט · clamp-scale — הצמדת ערך-זום לגבולות; לא-מספרי ⇒ 1. חוזה: clamp-scale.contract.md
 *  חולץ כלשונו מ-maor/src/lib/a11y.ts:35-38; קבועי-השכן SCALE_MIN/SCALE_MAX
 *  הוזרקו כשקעי-פרמטר עם ברירת-המחדל של הלגאסי (חוק-1 — אפס import פנימי). */
export function clampScale(v, min = 0.8, max = 1.6) {
  if (!Number.isFinite(v)) return 1;
  return Math.min(max, Math.max(min, v));
}
