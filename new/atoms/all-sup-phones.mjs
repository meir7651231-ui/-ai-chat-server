/** חוט · all-sup-phones — תורם ⇒ כל טלפוניו עם סיווג-אזור. חוזה: all-sup-phones.contract.md
 *  חולץ מ-maor/src/components/supporters/lib.ts:283-292.
 *  שקע: phoneRegion(num) ⇒ 'il'|'intl' — מוזרק (חוק-1, אפס import פנימי). */
export function allSupPhones(sp, phoneRegion) {
  const rows = [];
  if (sp.phone)
    rows.push({ num: sp.phone, label: '', note: '', wa: false, region: phoneRegion(sp.phone), primary: true });
  for (const p of sp.phones ?? []) {
    if (!p.num) continue;
    rows.push({ num: p.num, label: p.label ?? '', note: p.note ?? '', wa: !!p.wa, region: phoneRegion(p.num), primary: false });
  }
  return rows;
}
