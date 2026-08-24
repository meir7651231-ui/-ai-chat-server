/** חוט · find-supporter-dup-groups — קבוצות כפולי-תורמים (Union-Find). חוזה: find-supporter-dup-groups.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dedup.ts:286-341; השכנים normPhone/normId/
 *  supNameCityKey/nameSortKey הוזרקו כאובייקט-שקעים (חוק-1 — אפס import פנימי). */
export function findSupporterDupGroups(supporters, { normPhone, normId, supNameCityKey, nameSortKey }) {
  const parent = new Map();
  const find = (x) => {
    let r = x;
    while (parent.get(r) !== r) r = parent.get(r);
    let c = x;
    while (parent.get(c) !== r) {
      const nx = parent.get(c);
      parent.set(c, r);
      c = nx;
    }
    return r;
  };
  const union = (a, b) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  };
  for (const sp of supporters) parent.set(sp.id, sp.id);
  const byPhone = new Map();
  const byEmail = new Map();
  const byId = new Map(); // ת"ז
  const byExt = new Map(); // מזהה-חיצוני (ToremId)
  const byNameCity = new Map();
  const byNameSorted = new Map(); // שם חסין-סדר (בלי חובת-עיר)
  const link = (map, key, id) => {
    if (!key) return;
    const prev = map.get(key);
    if (prev) union(prev, id);
    else map.set(key, id);
  };
  for (const sp of supporters) {
    const p = normPhone(sp.phone);
    link(byPhone, p.length >= 7 ? p : '', sp.id);
    link(byEmail, (sp.email || '').trim().toLowerCase(), sp.id);
    link(byId, normId(sp.idNum), sp.id);
    link(byExt, (sp.extId || '').trim(), sp.id);
    link(byNameCity, supNameCityKey(sp), sp.id);
    // מפתח-שם חסין-סדר: תופס כפילות נדרים ("בן צבי רחל"↔"רחל בן צבי") שאין לה עיר/ת"ז.
    // דורש ≥2 מילים (שם-מלא) כדי לא לקבץ שמות-בודדים נפוצים. תוצאה = הצעה לסקירה-ידנית.
    const ns = nameSortKey(sp.name);
    link(byNameSorted, ns.includes(' ') ? ns : '', sp.id);
  }
  const groups = new Map();
  for (const sp of supporters) {
    const r = find(sp.id);
    (groups.get(r) ?? groups.set(r, []).get(r)).push(sp.id);
  }
  return [...groups.values()].filter((g) => g.length >= 2);
}
