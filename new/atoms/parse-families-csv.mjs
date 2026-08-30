/** חוט · parse-families-csv — תכנון ייבוא-משפחות 13 עמודות (P0.5, ענף-המשפחות בלגאסי).
 *  חוזה: parse-families-csv.contract.md · שקעים: clean, normName, digits
 *  חולץ כלשונו מ-maor/src/lib/familiesImport.ts:60-114 (קריאות-השכן שוקעו — חוק-1). */
export function parseFamiliesCsv(rows, existing, clean, normName, digits, T) {
  const news = [];
  const upds = [];
  for (const r of rows.slice(1)) {
    let name = clean(r[0]);
    if (!name || name.includes(T.k1)) continue;
    let isFair = false;
    if (/יריד חנוכה/.test(name)) {
      isFair = true;
      name = clean(name.replace(/-?\s*יריד חנוכה תשפ..?/g, ''));
    }
    name = clean(name.replace(T.k2, ''));
    if (!name) continue;
    let city = clean(r[6]);
    if (city === T.k3) city = '';
    if (city === T.k4 || city === T.k5) city = T.k6;
    const noteRaw = r[T.k19] || '';
    const stc = clean((noteRaw.match(/סטטוס:\s*([^\n]+)/) || [])[1] || '');
    const obj = {
      name,
      father: '',
      mother: clean(r[3]),
      fatherId: clean(r[1]),
      motherId: clean(r[4]),
      phone: clean(r[2]) === '-' ? '' : clean(r[2]),
      phone2: clean(r[5]) === '-' ? '' : clean(r[5]),
      email: '',
      address: clean([r[7], r[8]].map(clean).filter(Boolean).join(' ')),
      city,
      status: stc.includes(T.k7) ? T.k8 : T.k9,
      maritalStatus: stc.includes(T.k10) || (r[9] || '').includes(T.k11)
        ? T.k12
        : stc.includes(T.k13)
          ? T.k14
          : T.k15,
      language: T.k16,
      community: clean(r[T.k20]) || T.k17,
      notes: isFair ? T.k18 : '',
    };
    const ex = existing.find((f) => normName(f.name) === normName(name) &&
      (!digits(obj.phone) || !digits(f.phone) || digits(f.phone) === digits(obj.phone)));
    if (ex) upds.push({ id: ex.id, obj });
    else news.push(obj);
  }
  return { news, upds };
}
