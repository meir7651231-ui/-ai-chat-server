/** חוט · collection-score-delta — דלתת-ניקוד על ריקון קופת-צדקה.
 *  חוזה: collection-score-delta.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:33-51 (תורגם TS→JS);
 *  השכן lastCollectionIso הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function collectionScoreDelta(
  box,
  date,
  amount,
  lastCollectionIso,
  // קבוע-מתמטי: משקלי-ניקוד ברירת-מחדל (מוזרקים דרך rules להתאמת-הארגון)
  rules = { emptyPts: 10, ilsPerPoint: 50, streakDays: 60, streakPts: 5 }, T) {
  let pts = rules.emptyPts + Math.floor(amount / rules.ilsPerPoint);
  const prev = lastCollectionIso(box);
  if (prev) {
    const days = Math.round(
      (new Date(date + 'T12:00:00').getTime() - new Date(prev + 'T12:00:00').getTime()) / T.k1,
    );
    if (days >= 0 && days <= rules.streakDays) pts += rules.streakPts;
  }
  return pts;
}
