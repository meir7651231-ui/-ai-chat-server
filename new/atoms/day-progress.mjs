/** חוט · day-progress — מד-התקדמות ליום-חלוקה לפי סטטוס. חוזה: day-progress.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop7/lib.ts:43-51; השכן deliveriesOfDay
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function dayProgress(db, dayId, deliveriesOfDay, T) {
  const list = deliveriesOfDay(db, dayId);
  return {
    total: list.length,
    pickup: list.filter((d) => d.status === T.k1).length,
    enroute: list.filter((d) => d.status === T.k2).length,
    delivered: list.filter((d) => d.status === T.k3).length,
  };
}
