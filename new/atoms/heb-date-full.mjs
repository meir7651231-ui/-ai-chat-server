/** חוט · heb-date-full — 'ט״ו אלול תשפ״ו' מתוך ISO (צהריים-מקומי — חסין-אזורי-זמן).
 *  חוזה: heb-date-full.contract.md · חולץ כלשונו מ-maor/src/lib/hebrew.ts:156-161;
 *  השכנים gem/gemYear/hebParts הוזרקו כשקעים (חוק-1); fmtHM/fmtHY = ‏Intl מובנה. */
const fmtHM = new Intl.DateTimeFormat('he-u-ca-hebrew', { month: 'long' });
const fmtHY = new Intl.DateTimeFormat('he-u-ca-hebrew', { year: 'numeric' });
export function hebDateFull(iso, gem, gemYear, hebParts) {
  if (!iso) return '';
  const d = new Date(iso.slice(0, 10) + 'T12:00:00');
  if (isNaN(d.getTime())) return '';
  return `${gem(hebParts(d).day)} ${fmtHM.format(d)} ${gemYear(fmtHY.format(d))}`;
}
