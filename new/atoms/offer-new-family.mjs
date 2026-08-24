/** חוט · offer-new-family — האם להציע "＋ משפחה חדשה" לשאילתת-שיבוץ.
 *  חוזה: offer-new-family.contract.md · שקע: normName
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:531-534; השכן
 *  normNameLocal הוזרק כשקע normName (חוק-1 — אפס import פנימי). */
export function offerNewFamily(families, q, normName) {
  const t = q.trim();
  return t.length >= 2 && !families.some((f) => normName(f.name) === normName(t));
}
