/** חוט · beneficiary-label — תווית מוטב לשיבוץ-חנות. חוזה: beneficiary-label.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:681-689; השכן termOf
 *  (מילון-מונחי-הארגון) הוזרק כשקע (חוק-1 — אפס import פנימי; נקרא רק כשיש config). */
export function beneficiaryLabel(db, a, config, termOf) {
  const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
  const fam = db.families.find((f) => f.id === a.famId);
  const famLabel = fam ? T('entity.familyOf', 'משפחת') + ' ' + fam.name : T('entity.family', 'משפחה') + ' לא ידועה';
  if (!a.memberId || !fam) return famLabel;
  const m = fam.members.find((x) => x.id === a.memberId);
  return m ? famLabel + ' — ' + m.first : famLabel;
}
