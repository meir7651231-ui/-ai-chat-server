/** חוט · ev-label — תווית-אירוע (custom עם טקסט-חופשי גובר). חוזה: ev-label.contract.md
 *  חולץ כלשונו מ-maor/src/lib/eventMeta.ts:19-22; הקבוע EV_META הוזרק כשקע
 *  evMeta (חוק-1 — אפס import פנימי). */
export function evLabel(ev, evMeta) {
  return (ev.type === 'custom' && ev.customType) || evMeta[ev.type].label;
}
