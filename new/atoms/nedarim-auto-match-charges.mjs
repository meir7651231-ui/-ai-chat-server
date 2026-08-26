/** חוט · nedarim-auto-match-charges — Golden. חוזה: nedarim-auto-match-charges.contract.md
 * מוצא: nedarimSync.ts:324 (autoMatchCharges) + keysOf:87 (inline). חוק-4 verbatim.
 * שיוך-אוטומטי מרובה: אינדקס-מפתחות O(S) ואז מפתח-חזק-ביותר לכל עסקה O(M). שם-בלבד לא נכלל.
 * שקעים: normId,normPhone,normSearch.
 */
export function autoMatchCharges(charges, supporters, { normId, normPhone, normSearch }) {
  const keysOf = (o) => {
    const ks = [];
    const ext = (o.extId || '').trim(); if (ext) ks.push('ext:' + ext);
    const id = normId(o.idNum || o.zeout); if (id) ks.push('id:' + id);
    for (const p of [o.phone, o.phone2, o.phone3]) { const ph = normPhone(p || ''); if (ph.length >= 7) ks.push('ph:' + ph); }
    const em = (o.email || '').trim().toLowerCase(); if (em) ks.push('em:' + em);
    const n = normSearch(o.name || ''); const c = normSearch(o.city || ''); if (n && c) ks.push('nc:' + n + '|' + c);
    return ks;
  };
  const idx = new Map();
  for (const sp of supporters) {
    for (const k of keysOf({ extId: sp.extId, idNum: sp.idNum, phone: sp.phone, email: sp.email })) {
      if (!idx.has(k)) idx.set(k, sp.id);
    }
  }
  const out = [];
  for (const c of charges) {
    let supId;
    for (const k of keysOf({ extId: c.toremId, zeout: c.zeout, phone: c.phone, email: c.email })) {
      const hit = idx.get(k);
      if (hit) { supId = hit; break; }
    }
    if (supId) out.push({ supId, charge: c });
  }
  return out;
}
