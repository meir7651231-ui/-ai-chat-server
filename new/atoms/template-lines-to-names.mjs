/** חוט · template-lines-to-names — שורות-תבנית (שם·כמות·מחיר) ⇒ פריטי-BOQ חדשים,
 *  עם מזהים מסופק-המזהים המוזרק (nextId — שקע, פרמטר כבר במקור).
 *  חוזה: template-lines-to-names.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:126-144. אפס import פנימי. */
export function templateLinesToNames(lines, nextId) {
  return lines
    .filter((l) => (l.name || '').trim())
    .map((l, i) => ({
      id: nextId(i),
      name: l.name.trim(),
      eyes: +l.qty || 0,
      done: false,
      ...(l.rate > 0 ? { rate: l.rate } : {}),
    }));
}
