/** חוט · segula-title — כותרת-תצוגה לתזכורת-סגולה. חוזה: segula-title.contract.md
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:338-342. אטום טהור, אפס תלות. */
export function segulaTitle(name, r, target) {
  return (r.final ? '🎯 סיום סגולה' : '🕯 סגולה') + ' — ' + (name || '') + ' · יום ' + r.day + '/' + target;
}
