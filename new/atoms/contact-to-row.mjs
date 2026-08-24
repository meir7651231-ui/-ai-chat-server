/** חוט · contact-to-row — כרטיס-vCard ⇒ שורת-ייבוא ניטרלית. חוזה: contact-to-row.contract.md
 *  חולץ כלשונו מ-maor/src/lib/vcardImport.ts:255-266. */
export function contactToRow(c) {
    const notes = [c.org ? '🏢 ' + c.org : '', c.title, c.note].filter(Boolean).join(' · ');
    return {
        name: c.fullName.trim(),
        phone: c.phones[0]?.value || '',
        phone2: c.phones[1]?.value || '',
        email: c.emails[0] || '',
        address: c.address,
        notes,
    };
}
