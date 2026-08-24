/** חוט · sup-last — התרומה האחרונה: המאוחר מבין הקבלות (last) וההיסטוריה (hist); '' כשאין.
 *  חוזה: sup-last.contract.md · חולץ כלשונו מ-maor/src/components/supporters/lib.ts:123-132. */
export function supLast(sp) {
  let m = sp.last || '';
  for (const h of sp.hist ?? []) if (h.d > m) m = h.d;
  return m;
}
