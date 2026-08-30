/** חוט · parse-ayin-sheet — פענוח גיליון-העיניים שחזר (round-trip מהלגאסי).
 *  חוזה: parse-ayin-sheet.contract.md · שקע: normName
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:443-501 (קריאת-השכן normName שוקעה — חוק-1). */
export function parseAyinSheet(rows, supporters, normName, T) {
  if (rows.length < 2) return { upds: [], miss: 0, error: T.k1 };
  const clean = (x) => (x ?? '').replace(/\s+/g, ' ').trim();
  const header = (rows[0] ?? []).map((h) => clean(h));
  const hIdx = (keys) => header.findIndex((h) => keys.some((k) => h.includes(k)));
  const iSup = hIdx([T.k2, T.k3]);
  const iNm = hIdx([T.k4, T.k5, T.k6]);
  const iEyes = hIdx([T.k7]);
  const iDone = hIdx([T.k8]);
  const iPaid = hIdx([T.k9, T.k10]);
  const iAns = hIdx([T.k11, T.k12]);
  const iLead = hIdx([T.k13]);
  if (iNm < 0 || iEyes < 0) {
    return { upds: [], miss: 0, error: T.k14 };
  }
  const yes = (v) => /כן|yes|✓|v|שולם/i.test(v);
  const upds = [];
  let miss = 0;
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r] ?? [];
    const supN = clean(iSup >= 0 ? row[iSup] : '');
    const nm = clean(row[iNm]);
    if (!nm) continue;
    const raw = clean(row[iEyes]);
    const eyes = /^\d+$/.test(raw) ? +raw : null;
    const doneRaw = clean(iDone >= 0 ? row[iDone] : '');
    const paidRaw = iPaid >= 0 ? clean(row[iPaid]) : '';
    const ansRaw = iAns >= 0 ? clean(row[iAns]) : '';
    const leadRaw = iLead >= 0 ? clean(row[iLead]) : '';
    const sp = supporters.find(
      (x) =>
        (!supN || normName(x.name) === normName(supN)) &&
        (x.ayin?.names ?? []).some((n) => normName(n.name) === normName(nm)),
    );
    if (!sp) {
      miss++;
      continue;
    }
    const rec = (sp.ayin?.names ?? []).find((n) => normName(n.name) === normName(nm));
    if (eyes == null && !doneRaw && !paidRaw && !ansRaw && !leadRaw) continue;
    upds.push({
      supporterId: sp.id,
      nameId: rec.id,
      eyes,
      done: doneRaw ? yes(doneRaw) : null,
      paid: paidRaw ? yes(paidRaw) : null,
      answer: ansRaw || null,
      lead: leadRaw ? yes(leadRaw) : null,
    });
  }
  return { upds, miss };
}
