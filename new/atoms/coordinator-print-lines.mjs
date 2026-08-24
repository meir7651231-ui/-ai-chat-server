/** חוט · coordinator-print-lines — תדפיס-שטח לרכז (רשימת קופות לסבב). חוזה: coordinator-print-lines.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:250-280; השכנים
 *  termOf+coordinatorBoxes+lastCollectionIso הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function coordinatorPrintLines(db, coordinatorId, config, termOf, coordinatorBoxes, lastCollectionIso) {
    const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
    const coord = db.tzCoordinators.find((c) => c.id === coordinatorId);
    const boxes = coordinatorBoxes(db.tzBoxes, coordinatorId).filter((b) => b.status === 'home' || b.status === 'office');
    const lines = [
        'רשימת קופות — ' + (coord?.name ?? ''),
        '='.repeat(30),
    ];
    for (const b of boxes) {
        const fam = db.families.find((f) => f.id === b.famId);
        const last = lastCollectionIso(b);
        lines.push([
            '#' + b.num,
            fam ? T('entity.familyOf', 'משפחת') + ' ' + fam.name : 'במשרד',
            fam ? [fam.address, fam.city].filter(Boolean).join(', ') : '',
            fam?.phone ?? '',
            last ? 'ריקון אחרון: ' + last : 'טרם רוקנה',
        ]
            .filter(Boolean)
            .join(' · '));
    }
    if (boxes.length === 0)
        lines.push('אין קופות פעילות');
    return lines;
}
