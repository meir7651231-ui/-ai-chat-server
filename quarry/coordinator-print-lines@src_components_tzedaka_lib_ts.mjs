/** 🪨 טיוטת-חוט (דרגת-מחצבה) · coordinatorPrintLines — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:250-280 (31 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): coordinatorPrintLines, termOf, coordinatorBoxes, repeat, lastCollectionIso
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function coordinatorPrintLines(db, coordinatorId, config) {
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
/**
 * שורות CSV של כל הריקונים — תאריך, רכז, קופה, משפחה, סכום, מבצע.
 * שקיפות מלאה: כל ריקון שנרשם מיוצא.
 */
