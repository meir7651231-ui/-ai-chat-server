/** חוט · don-cal-month-line — שורת-סיכום-החודש של לוח-התורמים. חוזה: don-cal-month-line.contract.md
 *  חולץ כלשונו מ-maor/src/components/supporters/lib.ts:340-359; השכן termOf
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function donCalMonthLine(entries, inMonth, config, termOf) {
  const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
  let mc = 0;
  let mi = 0;
  let mu = 0;
  for (const e of entries) {
    if (!inMonth(e.date)) continue;
    mc++;
    if (e.cur === '$') mu += e.amount || 0;
    else mi += e.amount || 0;
  }
  if (!mc) return 'אין ' + T('entity.donations', 'תרומות') + ' מתועדות בחודש זה';
  const sums =
    (mi ? '₪' + mi.toLocaleString('he-IL') : '') + (mi && mu ? ' + ' : '') + (mu ? '$' + mu.toLocaleString('he-IL') : '');
  return mc + ' ' + T('entity.donations', 'תרומות') + ' החודש · ' + (sums || 'סכומים מהקובץ ההיסטורי');
}
