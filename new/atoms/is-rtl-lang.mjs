/** חוט · is-rtl-lang — האם שפת-האתר RTL (כל מה שאינו 'en'). חוזה: is-rtl-lang.contract.md
 *  חולץ כלשונו מ-maor/src/lib/publicSite.ts:34-36. טהור — אפס שקעים. */
export function isRtlLang(lang) {
  return lang !== 'en';
}
