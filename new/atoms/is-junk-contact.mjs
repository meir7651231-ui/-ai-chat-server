/** חוט · is-junk-contact — כרטיס-vCard זבל שאין טעם לייבא.
 *  חוזה: is-junk-contact.contract.md
 *  חולץ כלשונו מ-maor/src/lib/vcardImport.ts:229-235; השכן digitsOnly
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function isJunkContact(c, digitsOnly) {
  if (!c.fullName.trim()) return true;
  const realPhone = c.phones.some((p) => digitsOnly(p.value).length >= 5);
  return !realPhone && c.emails.length === 0;
}
