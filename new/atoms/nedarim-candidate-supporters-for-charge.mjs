/** חוט · nedarim-candidate-supporters-for-charge — Golden. חוזה: nedarim-candidate-supporters-for-charge.contract.md
 * מוצא: nedarimSync.ts:264 (candidateSupportersForCharge) + keysOf:87 (inline). חוק-4 verbatim.
 * מועמדים לשיוך לפי מפתח-חזק או שם חסין-סדר (≥2 מילים). שקעים: normId,normPhone,normSearch,nameSortKey.
 */
export function candidateSupportersForCharge(charge, supporters, limit = 8, { normId, normPhone, normSearch, nameSortKey }) {
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
  const cName = nameSortKey(charge.name || '');
  const scored = [];
  for (const sp of supporters) {
    const sk = keysOf({ extId: sp.extId, idNum: sp.idNum, phone: sp.phone, email: sp.email });
    let score = 0;
    for (const k of sk) {
      if (!ck.has(k)) continue;
      if (k.startsWith('ext:')) score = Math.max(score, 5);
      else if (k.startsWith('id:')) score = Math.max(score, 4);
      else if (k.startsWith('ph:')) score = Math.max(score, 3);
      else if (k.startsWith('em:')) score = Math.max(score, 2);
    }
    if (!score && cName && cName.includes(' ') && nameSortKey(sp.name) === cName) score = 1;
    if (score) scored.push({ sp, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.sp);
}
