/** חוט · explode-supporter — פירוק תרומות-תומך למסמכי-ענן (מסלול-B). חוזה: explode-supporter.contract.md
 *  חולץ כלשונו מ-maor/src/lib/donationPartition.ts:56-80; השכן purposeKeyOf
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function explodeSupporter(sp, purposeKeyOf) {
  return (sp.donations ?? []).map((d) => ({
    id: d.rid,
    supporterId: sp.id,
    pkey: purposeKeyOf(d),
    donation: d,
  }));
}
