/** חוט · room-info-label — שורת-המידע על חדר (משבצות · קיבולת · נגישות · ציוד).
 *  חוזה: room-info-label.contract.md
 *  חולץ כלשונו מ-maor/src/components/diary/lib.ts:291-304. טהור — אפס שקעים. */
export function roomInfoLabel(room, T) {
  const eqOn = Object.entries(room.eq || {})
    .filter(([, v]) => v)
    .map(([k]) => k);
  return (
    T.k1 +
    (room.slot || 60) +
    T.k2 +
    (room.cap ? T.k3 + room.cap + T.k4 : '') +
    (room.access ? T.k5 : '') +
    (eqOn.length ? ' · ' + eqOn.slice(0, 3).join(', ') : '')
  );
}
