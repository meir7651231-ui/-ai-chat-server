/** 🪨 טיוטת-חוט (דרגת-מחצבה) · needsCare — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:101-141 (41 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): needsCare, termOf, staleBoxes, lastCollectionIso, coordinatorBoxes, setDate, getDate, isoOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function needsCare(db, todayIso, config) {
    const boxTerm = config ? termOf(config, 'entity.tzBox', 'קופה') : 'קופה';
    const out = [];
    for (const b of staleBoxes(db.tzBoxes, todayIso)) {
        const last = lastCollectionIso(b);
        out.push({
            kind: 'stale',
            id: b.id,
            label: boxTerm + ' ' + b.num + ' לא רוקנה מזמן',
            hint: last ? 'ריקון אחרון: ' + last : 'מעולם לא רוקנה (מאז ' + (b.since || '—') + ')',
        });
    }
    for (const b of db.tzBoxes.filter((x) => x.status === 'lost'))
        out.push({ kind: 'lost', id: b.id, label: boxTerm + ' ' + b.num + ' מסומנת כאבודה', hint: 'לברר או להוציא משימוש' });
    for (const c of db.tzCoordinators.filter((x) => !x.active)) {
        const holding = coordinatorBoxes(db.tzBoxes, c.id).filter((b) => b.status === 'home').length;
        if (holding)
            out.push({
                kind: 'inactiveCoord',
                id: c.id,
                label: c.name + ' אינו פעיל אך עדיין עם ' + holding + ' קופות בבתים',
                hint: 'להעביר לרכז אחר או להחזיר למשרד',
            });
    }
    const soon = new Date(todayIso + 'T12:00:00');
    soon.setDate(soon.getDate() + 14);
    const soonIso = isoOf(soon);
    for (const p of db.tzCampaigns.filter((x) => x.active && x.end && x.end >= todayIso && x.end <= soonIso))
        out.push({ kind: 'campaignEnding', id: p.id, label: 'המבצע "' + p.name + '" מסתיים ב-' + p.end, hint: 'לסכם ולסגור' });
    return out;
}
/** רכזים פעילים ממוינים: score יורד, ואז סכום יורד. */
