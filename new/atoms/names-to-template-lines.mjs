/** חוט · names-to-template-lines — פריטי-"עין" ⇒ שורות-תבנית רזות. חוזה: names-to-template-lines.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:119-125. טהור, אפס שקעים (חוק-1). */
export function namesToTemplateLines(names) {
  return names
    .filter((n) => n.name.trim())
    .map((n) => ({ name: n.name.trim(), qty: +n.eyes || 0, rate: n.rate || 0 }));
}
