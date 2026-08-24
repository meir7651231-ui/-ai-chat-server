/** חוט · campaign-progress — מדדי-התקדמות של מבצע-קופות. חוזה: campaign-progress.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:149-154; השכן campaignTotal
 *  הוזרק כשקע (חוק-1). */
export function campaignProgress(campaign, boxes, campaignTotal) {
  const sum = campaignTotal(boxes, campaign.id);
  const goal = campaign.goal || 0;
  const pct = goal > 0 ? Math.min(100, Math.round((sum / goal) * 100)) : 0;
  return { sum, goal, pct };
}
