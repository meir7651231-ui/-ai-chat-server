/** חוט · merge-families — מיזוג משפחות-כפולות אל "שומר" (אפס אובדן נתונים).
 *  חוזה: merge-families.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dedup.ts:109-188 (תורגם TS→JS); השכנים
 *  normPhone + dedupById הוזרקו כאובייקט-שקעים deps (חוק-1 — אפס import פנימי). */
export function mergeFamilies(keeper, losers, deps) {
  const { normPhone, dedupById } = deps;
  const all = [keeper, ...losers];
  const firstNonEmpty = (pick) => {
    for (const f of all) {
      const v = (pick(f) || '').trim();
      if (v)
        return v;
    }
    return '';
  };
  const rank = (s) => (s === 'active' ? 2 : s === 'pending' ? 1 : 0);
  const status = all.reduce((acc, f) => (rank(f.status) > rank(acc) ? f.status : acc), 'inactive');
  const phone = (keeper.phone || '').trim() || firstNonEmpty((f) => f.phone);
  const phoneNorm = normPhone(phone);
  let phone2 = (keeper.phone2 || '').trim();
  if (!phone2) {
    for (const f of all) {
      for (const cand of [f.phone, f.phone2]) {
        const c = (cand || '').trim();
        if (c && normPhone(c) !== phoneNorm) {
          phone2 = c;
          break;
        }
      }
      if (phone2)
        break;
    }
  }
  const members = dedupById(all.flatMap((f) => f.members ?? []));
  const docs = dedupById(all.flatMap((f) => f.docs ?? []));
  const createdAt = all.map((f) => f.createdAt).filter(Boolean).sort()[0] ?? keeper.createdAt;
  const loserNames = losers.map((l) => l.name).filter(Boolean).join(', ');
  const notesParts = all.map((f) => (f.notes || '').trim()).filter(Boolean);
  const baseNotes = [...new Set(notesParts)].join(' · ');
  const notes = loserNames ? (baseNotes ? baseNotes + ' ' : '') + '| מוזג: ' + loserNames : baseNotes;
  return {
    ...keeper,
    father: keeper.father?.trim() || firstNonEmpty((f) => f.father),
    fatherId: keeper.fatherId?.trim() || firstNonEmpty((f) => f.fatherId),
    mother: keeper.mother?.trim() || firstNonEmpty((f) => f.mother),
    motherId: keeper.motherId?.trim() || firstNonEmpty((f) => f.motherId),
    phone,
    phone2,
    email: keeper.email?.trim() || firstNonEmpty((f) => f.email),
    city: keeper.city?.trim() || firstNonEmpty((f) => f.city),
    address: keeper.address?.trim() || firstNonEmpty((f) => f.address),
    community: keeper.community?.trim() || firstNonEmpty((f) => f.community),
    maritalStatus: keeper.maritalStatus?.trim() || firstNonEmpty((f) => f.maritalStatus),
    language: keeper.language?.trim() || firstNonEmpty((f) => f.language),
    tzedaka: keeper.tzedaka?.trim() || firstNonEmpty((f) => f.tzedaka),
    discount: keeper.discount?.trim() || firstNonEmpty((f) => f.discount),
    fullSefach: all.some((f) => f.fullSefach),
    kidsHome: Math.max(0, ...all.map((f) => f.kidsHome ?? 0)),
    kidsMarried: Math.max(0, ...all.map((f) => f.kidsMarried ?? 0)),
    status,
    members,
    docs,
    createdAt,
    notes,
  };
}
