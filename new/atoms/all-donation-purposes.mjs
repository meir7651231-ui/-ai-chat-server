/** חוט · all-donation-purposes — איחוד-ומיון ייעודי-תרומה של רשימת-תורמים. חוזה: all-donation-purposes.contract.md
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:94-98; השכן
 *  supporterPurposes הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function allDonationPurposes(supporters, supporterPurposes) {
  const set = new Set();
  for (const s of supporters) for (const p of supporterPurposes(s)) set.add(p);
  return [...set].sort((a, b) => a.localeCompare(b));
}
