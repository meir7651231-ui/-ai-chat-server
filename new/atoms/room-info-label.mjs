/** חוט · room-info-label — שורת-המידע על חדר (משבצות · קיבולת · נגישות · ציוד).
 *  חוזה: room-info-label.contract.md
 *  חולץ כלשונו מ-maor/src/components/diary/lib.ts:291-304. טהור — אפס שקעים. */
export function roomInfoLabel(room) {
  const eqOn = Object.entries(room.eq || {})
    .filter(([, v]) => v)
    .map(([k]) => k);
  return (
    'משבצות של ' +
    (room.slot || 60) +
    ' דק׳' +
    (room.cap ? ' · עד ' + room.cap + ' משתתפים' : '') +
    (room.access ? ' · נגיש' : '') +
    (eqOn.length ? ' · ' + eqOn.slice(0, 3).join(', ') : '')
  );
}
