/** חוט · finder-axis-value — ערך-המשפחה בציר-צלילה נתון. חוזה: finder-axis-value.contract.md
 *  חולץ כלשונו מ-maor/src/components/families/lib.ts:102-118; השכנים termOf/
 *  tierOf/famLiveEnrollments/STATUS_META הוזרקו כאובייקט-שקעים (חוק-1). */
export function finderAxisValue(db, f, axis, config, { termOf, tierOf, famLiveEnrollments, STATUS_META }, T2) {
  const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
  switch (axis) {
    case T2.k1: return f.city || '';
    case T2.k2: return f.community || '';
    case T2.k3: return f.maritalStatus || T2.k4;
    case T2.k5: return STATUS_META[f.status].label;
    case T2.k6: return tierOf(f.cred?.score ?? T2.k19).label;
    case T2.k7: return f.members.some((m) => !m.isParent) ? T2.k8 : T2.k9;
    case T2.k10: return famLiveEnrollments(db, f).length ? T2.k11 + T(T2.k12, T2.k13) : T2.k14;
    case T2.k15: return f.fullSefach ? T2.k16 : T2.k17;
    case T2.k18: return f.language || '';
    default: return '';
  }
}
