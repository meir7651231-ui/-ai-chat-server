/** חוט · apply-ayin-names — שמות-מהייבוא לתיק-המעקב.
 *  חוזה: apply-ayin-names.contract.md · שקעים: mkId, emptyAyin, planAddName
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts (קריאות-השכן שוקעו). */
export function applyAyinNames(sp, names, mkId, emptyAyin, planAddName) {
  let a = sp.ayin ?? emptyAyin();
  let changed = false;
  for (const nm of names) {
    if (!planAddName(a, nm, '', '').ok) continue; // כפילות/ריק — דילוג שקט, בלי לשרוף מזהה
    const plan = planAddName(a, nm, '', mkId());
    if (plan.ok) {
      a = { ...a, names: plan.names };
      changed = true;
    }
  }
  return changed ? { ...sp, ayin: a } : sp;
}
