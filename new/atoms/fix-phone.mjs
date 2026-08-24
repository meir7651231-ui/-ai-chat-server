/** חוט · fix-phone — עיצוב-טלפון בטפסי-התומכים (האצלה לשקע הקנוני). חוזה: fix-phone.contract.md
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:230-234; השכן
 *  formatIsraeliPhone (lib/validate) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function fixPhone(p, formatIsraeliPhone) {
  return formatIsraeliPhone(p);
}
