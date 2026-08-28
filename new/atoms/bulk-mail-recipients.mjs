/** חוט · bulk-mail-recipients — נמעני-מייל מרוכזים: סינון ⇒ דדופ-לפי-כתובת-מנורמלת ⇒ מדידה.
 *  חוזה: bulk-mail-recipients.contract.md · שקעים: normEmail
 *  מוצא: maor/src/lib/bulkContact.ts (בקשת-בעלים 25.8 "שליחה מרובה"; חוק-4 verbatim).
 *  שומר את השם/מזהה של ה**ראשון** באותה כתובת; שורה בלי @ מסוננת. */
export function bulkMailRecipients(sups, normEmail) {
  const seen = new Set();
  const out = [];
  for (const sp of sups) {
    const e = normEmail(sp.email || '');
    if (!e || !e.includes('@')) continue;
    if (seen.has(e)) continue;
    seen.add(e);
    out.push({ id: sp.id, name: sp.name || '', email: sp.email.trim() });
  }
  return out;
}
