/** חוט · thanks-prompt — בונה-פרומפט למכתב-תודה-לתורם; שורות-רשות רק כשהשדה מסופק.
 *  חוזה: thanks-prompt.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ai.ts:46-60. */
export function thanksPrompt(inp, T) {
  return [
    T.k1 + (inp.orgName || T.k2) + '"',
    T.k3 + inp.supporterName + T.k4 + inp.lastAmount + '.',
    inp.designation ? T.k5 + inp.designation + '.' : '',
    inp.totalSoFar ? T.k6 + inp.totalSoFar + T.k7 : '',
    T.k8,
    T.k9,
  ].filter(Boolean).join('\n');
}
