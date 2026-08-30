/** חוט · needs-care-tzedaka — רשימת-הטיפול של מודול-הקופות (מוזנחות/אבודות/
 *  רכז-לא-פעיל/מבצע-מסתיים). חוזה: needs-care-tzedaka.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:101-141; השכנים
 *  (termOf · staleBoxes · lastCollectionIso · coordinatorBoxes · isoOf)
 *  הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function needsCare(db, todayIso, config, sockets, T) {
  const { termOf, staleBoxes, lastCollectionIso, coordinatorBoxes, isoOf } = sockets;
  const boxTerm = config ? termOf(config, T.k1, T.k2) : T.k2;
  const out = [];
  for (const b of staleBoxes(db.tzBoxes, todayIso)) {
    const last = lastCollectionIso(b);
    out.push({
      kind: T.k3,
      id: b.id,
      label: boxTerm + ' ' + b.num + T.k4,
      hint: last ? T.k5 + last : T.k6 + (b.since || '—') + ')',
    });
  }
  for (const b of db.tzBoxes.filter((x) => x.status === T.k7))
    out.push({ kind: T.k7, id: b.id, label: boxTerm + ' ' + b.num + T.k8, hint: T.k9 });
  for (const c of db.tzCoordinators.filter((x) => !x.active)) {
    const holding = coordinatorBoxes(db.tzBoxes, c.id).filter((b) => b.status === T.k10).length;
    if (holding)
      out.push({
        kind: T.k11,
        id: c.id,
        label: c.name + T.k12 + holding + T.k13,
        hint: T.k14,
      });
  }
  const soon = new Date(todayIso + 'T12:00:00');
  soon.setDate(soon.getDate() + 14);
  const soonIso = isoOf(soon);
  for (const p of db.tzCampaigns.filter((x) => x.active && x.end && x.end >= todayIso && x.end <= soonIso))
    out.push({ kind: T.k15, id: p.id, label: T.k16 + p.name + T.k17 + p.end, hint: T.k18 });
  return out;
}
