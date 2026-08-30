/** חוט · match-incoming-to-planned — שיוך תשלום-נכנס לחיוב-מתוכנן יחיד.
 *  חוזה: match-incoming-to-planned.contract.md
 *  חולץ כלשונו מ-maor/src/lib/plannedMatch.ts:107-129 (matchIncomingToPlanned).
 *  השכנים nameMatches (דמיון-שם) ו-dayDiff (מרחק-ימים) הוזרקו כשקעים (חוק-1).
 *  ‏DATE_WINDOW_DAYS = 3: ערך-הסף של האטום עצמו (טווח ±3 ימים). */
export function matchIncomingToPlanned(inc, allOpen, nameMatches, dayDiff, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const DATE_WINDOW_DAYS = 3;

  const targetCents = Math.round(inc.amount * T.k1);
  const incDate = (inc.at || '').slice(0, T.k2); // ISO
  const candidates = [];
  for (const ref of allOpen) {
    const planCents = Math.round(ref.plan.amount * T.k1);
    if (planCents !== targetCents) continue;
    if (!nameMatches(ref.name, inc.name || '')) continue;
    if (incDate && ref.plan.date && dayDiff(incDate, ref.plan.date) > DATE_WINDOW_DAYS) continue;
    // ציון-דירוג לניפוי-כפולות: תאריך-קרוב = יותר-בטוח
    const dd = incDate && ref.plan.date ? dayDiff(incDate, ref.plan.date) : 0;
    const conf = Math.max(T.k3, T.k1 - dd * T.k2);
    candidates.push({ ...ref, incomingId: inc.id, confidence: conf });
  }
  if (candidates.length !== 1) return null;
  return candidates[0];
}
