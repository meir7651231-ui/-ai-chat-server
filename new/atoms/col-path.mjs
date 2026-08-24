/** חוט · col-path — נתיב אוסף בענן (שורש/פר-ארגון). חוזה: col-path.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud-diff.ts:45-49 (אחיו של meta-path). */
export function colPath(slug, cloudRoot, col) {
  return cloudRoot ? col : 'orgs/' + slug + '/' + col;
}
