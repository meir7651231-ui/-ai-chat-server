/** חוט · min-to-hm — דקות-מחצות ⇒ "HH:MM" (ההופכי של timeToMin ביומן-החדרים).
 *  חוזה: min-to-hm.contract.md · שקעים: pad2.
 *  חולץ כלשונו מ-maor/src/components/diary/lib.ts:45-47; השכן pad2 הוזרק
 *  כשקע (חוק-1 — אפס import פנימי). */
export function minToHM(min, pad2) {
  return pad2(Math.floor(min / 60)) + ':' + pad2(min % 60);
}
