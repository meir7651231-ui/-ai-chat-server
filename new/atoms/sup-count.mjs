/** חוט · sup-count — מספר-תרומות כולל היסטוריה (רק שורות-חיוב חיוביות).
 *  חוזה: sup-count.contract.md · חולץ כלשונו מ-maor/src/components/supporters/lib.ts:118-122. */
export function supCount(sp) {
  return (sp.count || 0) + (sp.hist ?? []).filter((h) => (h.a || 0) > 0).length;
}
