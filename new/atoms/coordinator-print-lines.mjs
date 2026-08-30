/** חוט · coordinator-print-lines — תדפיס-שטח לרכז (רשימת קופות לסבב). חוזה: coordinator-print-lines.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:250-280; השכנים
 *  termOf+coordinatorBoxes+lastCollectionIso הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function coordinatorPrintLines(db, coordinatorId, config, termOf, coordinatorBoxes, lastCollectionIso, T2) {
    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    const coord = db.tzCoordinators.find((c) => c.id === coordinatorId);
    const boxes = coordinatorBoxes(db.tzBoxes, coordinatorId).filter((b) => b.status === T2.k1 || b.status === T2.k2);
    const lines = [
        T2.k3 + (coord?.name ?? ''),
        '='.repeat(30),
    ];
    for (const b of boxes) {
        const fam = db.families.find((f) => f.id === b.famId);
        const last = lastCollectionIso(b);
        lines.push([
            '#' + b.num,
            fam ? T(T2.k4, T2.k5) + ' ' + fam.name : T2.k6,
            fam ? [fam.address, fam.city].filter(Boolean).join(', ') : '',
            fam?.phone ?? '',
            last ? T2.k7 + last : T2.k8,
        ]
            .filter(Boolean)
            .join(' · '));
    }
    if (boxes.length === 0)
        lines.push(T2.k9);
    return lines;
}
