/** חוט · bulk-wa-recipients — נמעני-וואטסאפ מרוכזים: סינון-לפי-ספרות ⇒ דדופ ⇒ מדידה.
 *  חוזה: bulk-wa-recipients.contract.md · שקעים: waDigits
 *  מוצא: maor/src/lib/bulkContact.ts (בקשת-בעלים 25.8; חוק-4 verbatim).
 *  שני-תורמים-אותו-טלפון = הודעה-אחת; טלפון לא-תקין (waDigits=null) מסונן. */
export function bulkWaRecipients(sups, waDigits) {
  const seen = new Set();
  const out = [];
  for (const sp of sups) {
    const digits = waDigits(sp.phone || '');
    if (!digits) continue;
    if (seen.has(digits)) continue;
    seen.add(digits);
    out.push({ id: sp.id, name: sp.name || '', phone: sp.phone, digits });
  }
  return out;
}
