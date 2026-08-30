/** חוט · supporters-import-format-rows — תומכות בפורמט-ייבוא 7 העמודות של SupporterImport:
 *  שורת-כותרת קבועה + שורה לכל תורם, בסדר-המערך המקורי.
 *  חוזה: supporters-import-format-rows.contract.md · חולץ כלשונו מ-maor/src/lib/exportRows.ts:47-55. */
export function supportersImportFormatRows(db, T) {
  const rows = [[T.k1, T.k2, T.k3, T.k4, T.k5, T.k6, T.k7]];
  for (const sp of db.supporters) {
    rows.push([sp.name, sp.phone, sp.email, sp.idNum, sp.address, sp.cat, sp.forWho]);
  }
  return rows;
}
