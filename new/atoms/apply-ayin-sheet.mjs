/** חוט · apply-ayin-sheet — החלת עדכוני גיליון-העיניים.
 *  חוזה: apply-ayin-sheet.contract.md · טהור, אפס-שקעים.
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts. */
export function applyAyinSheet(supporters, upds, today) {
  let logged = 0;
  const byId = new Map();
  for (const u of upds) {
    const arr = byId.get(u.supporterId) ?? [];
    arr.push(u);
    byId.set(u.supporterId, arr);
  }
  const out = supporters.map((sp) => {
    const mine = byId.get(sp.id);
    if (!mine || !sp.ayin) return sp;
    let a = { ...sp.ayin };
    for (const u of mine) {
      const rec = a.names.find((n) => n.id === u.nameId);
      if (!rec) continue;
      if (u.eyes != null && +rec.eyes !== u.eyes) {
        a = { ...a, log: [{ date: today, eyes: u.eyes, name: rec.name }, ...a.log] };
        logged++;
      }
      if (u.eyes != null || u.done != null) {
        a = {
          ...a,
          names: a.names.map((n) => n.id === u.nameId
            ? { ...n, ...(u.eyes != null ? { eyes: u.eyes } : {}), ...(u.done != null ? { done: u.done } : {}) }
            : n),
        };
      }
      if (u.paid != null) a = { ...a, paid: u.paid };
      if (u.answer && !a.answers.some((x) => x.note === u.answer)) {
        a = { ...a, answers: [{ date: today, note: u.answer }, ...a.answers], answeredNote: u.answer };
      }
      if (u.lead && !['eyes', 'answer', 'done'].includes(a.stage)) a = { ...a, stage: 'eyes' };
      a = { ...a, lastTouch: today };
    }
    return { ...sp, ayin: a };
  });
  return { supporters: out, logged };
}
