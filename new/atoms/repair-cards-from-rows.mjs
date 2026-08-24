/** חוט · repair-cards-from-rows — ריפוי-כרטיסים מרשומות-ספק: תיקון תווית-סליקה
 *  + מילוי-אם-ריק של פרטי-קשר. אידמפוטנטי; לעולם לא דורס ערך קיים.
 *  חוזה: repair-cards-from-rows.contract.md
 *  חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:367-404; השכן fillCardFromCharge
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function repairCardsFromRows(supporters, rows, label, fillCardFromCharge) {
  const map = new Map();
  for (const r of rows) {
    const k = (r.txnId || '').trim() || (r.reference || '').trim();
    if (k && !map.has(k)) map.set(k, r);
  }
  if (!map.size) return { supporters, relabeled: 0, enriched: 0 };
  let relabeled = 0;
  let enriched = 0;
  const out = supporters.map((sp) => {
    const hist = sp.hist;
    if (!hist?.length) return sp;
    let touched = false;
    const mine = [];
    const next = hist.map((h) => {
      const key = (h.txn || '').trim() || (h.ref || '').trim();
      const row = key ? map.get(key) : undefined;
      if (!row) return h;
      mine.push(row);
      if (h.clearer === label) return h;
      touched = true;
      relabeled++;
      return { ...h, clearer: label };
    });
    if (!mine.length) return touched ? { ...sp, hist: next } : sp;
    let filled = { ...sp, hist: next };
    const before = filled;
    for (const row of mine) filled = fillCardFromCharge(filled, row);
    if (filled !== before) enriched++;
    if (filled !== before || touched) return filled;
    return sp;
  });
  return { supporters: out, relabeled, enriched };
}
