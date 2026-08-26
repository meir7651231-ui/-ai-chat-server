/** חוט · nedarim-strong-match-for-charge — Golden. חוזה: nedarim-strong-match-for-charge.contract.md
 * מוצא: nedarimSync.ts:302 (strongMatchForCharge) + keysOf:87 (inline). חוק-4 verbatim.
 * ההתאמה-החזקה-ביותר לפי מפתח-ודאי בלבד (לא שם) או null. שקעים: normId,normPhone,normSearch.
 */
export function strongMatchForCharge(charge, supporters, { normId, normPhone, normSearch }) {
  const keysOf = (o) => {
    const ks = [];
    const ext = (o.extId || '').trim(); if (ext) ks.push('ext:' + ext);
    const id = normId(o.idNum || o.zeout); if (id) ks.push('id:' + id);
    for (const p of [o.phone, o.phone2, o.phone3]) { const ph = normPhone(p || ''); if (ph.length >= 7) ks.push('ph:' + ph); }
    const em = (o.email || '').trim().toLowerCase(); if (em) ks.push('em:' + em);
    const n = normSearch(o.name || ''); const c = normSearch(o.city || ''); if (n && c) ks.push('nc:' + n + '|' + c);
    return ks;
  };
  const ck = new Set(keysOf({ extId: charge.toremId, zeout: charge.zeout, phone: charge.phone, email: charge.email }));
  if (!ck.size) return null;
  let best = null;
  for (const sp of supporters) {
    let score = 0;
    for (const k of keysOf({ extId: sp.extId, idNum: sp.idNum, phone: sp.phone, email: sp.email })) {
      if (!ck.has(k)) continue;
      if (k.startsWith('ext:')) score = Math.max(score, 5);
      else if (k.startsWith('id:')) score = Math.max(score, 4);
      else if (k.startsWith('ph:')) score = Math.max(score, 3);
      else if (k.startsWith('em:')) score = Math.max(score, 2);
    }
    if (score && (!best || score > best.score)) best = { sp, score };
  }
  return best?.sp ?? null;
}
