/** חוט · importable-contacts — אנשי-הקשר הראויים-לייבוא מטקסט-VCF (בניכוי זבל). חוזה: importable-contacts.contract.md
 *  חולץ כלשונו מ-maor/src/lib/vcardImport.ts:236-254; השכנים parseVcards (פרסור-VCF)
 *  ו-isJunkContact (זיהוי כרטיס-זבל) הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function importableContacts(text, parseVcards, isJunkContact) {
  return parseVcards(text).filter((c) => !isJunkContact(c));
}
