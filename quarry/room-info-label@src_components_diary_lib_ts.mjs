/** 🪨 טיוטת-חוט (דרגת-מחצבה) · roomInfoLabel — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/diary/lib.ts:291-304 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): roomInfoLabel
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function roomInfoLabel(room) {
    const eqOn = Object.entries(room.eq || {})
        .filter(([, v]) => v)
        .map(([k]) => k);
    return ('משבצות של ' +
        (room.slot || 60) +
        ' דק׳' +
        (room.cap ? ' · עד ' + room.cap + ' משתתפים' : '') +
        (room.access ? ' · נגיש' : '') +
        (eqOn.length ? ' · ' + eqOn.slice(0, 3).join(', ') : ''));
}
