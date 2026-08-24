/** חוט · new-supporter-from-row — שורת-ייבוא ⇒ רשומת-תומך חדשה ומאופסת.
 *  חוזה: new-supporter-from-row.contract.md
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:652-678; השכנים
 *  fixPhone ו-mergeHist הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function newSupporterFromRow(id, row, fixPhone, mergeHist) {
  return {
    id,
    name: row.name.trim(),
    phone: fixPhone(row.phone.trim()),
    email: row.email.trim(),
    idNum: row.idNum.trim(),
    address: row.address.trim(),
    cat: row.cat.trim(),
    forWho: row.forWho.trim(),
    notes: '',
    count: 0,
    ils: 0,
    usd: 0,
    first: '',
    last: '',
    nextDate: '',
    donations: [],
    ...(row.hist?.length ? { hist: mergeHist([], row.hist) } : {}),
  };
}
