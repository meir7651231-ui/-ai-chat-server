/** חוט · dup-field-value — ערך-שדה נבחר במיזוג-כפולים (edit ⇒ pick ⇒ ראשונה-עם-ערך).
 *  חוזה: dup-field-value.contract.md · חולץ כלשונו מ-maor/src/lib/dedup.ts:211-223. */
export function dupFieldValue(fams, def, pick, edit) {
    const edited = edit[def.key];
    if (edited != null)
        return edited;
    const idx = pick[def.key] ?? fams.findIndex((f) => def.get(f));
    return def.get(fams[idx >= 0 ? idx : 0]);
}
