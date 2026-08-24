/** חוט · sup-usd — סה"כ $ של תורם כולל היסטוריה: מונה-הקבלות (usd) + שורות-hist דולריות.
 *  חוזה: sup-usd.contract.md · חולץ כלשונו מ-maor/src/components/supporters/lib.ts:111-114. */
export function supUsd(sp) {
  return (sp.usd || 0) + (sp.hist ?? []).reduce((a, h) => a + (h.c === '$' ? h.a : 0), 0);
}
