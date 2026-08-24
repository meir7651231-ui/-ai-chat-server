/** חוט · sup-dup-field-value — ערך-השדה הנבחר במיזוג כפולי-תורמים.
 *  חוזה: sup-dup-field-value.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dedup.ts:417-429; טהור — def.get חלק מהקלט,
 *  אפס קריאות-חוץ. הקדימות: edit (גם ריק-מפורש) → pick (גם 0) → הראשונה
 *  עם ערך → sups[0]. */
export function supDupFieldValue(sups, def, pick, edit) {
    const edited = edit[def.key];
    if (edited != null)
        return edited;
    const idx = pick[def.key] ?? sups.findIndex((s) => def.get(s));
    return def.get(sups[idx >= 0 ? idx : 0]);
}
