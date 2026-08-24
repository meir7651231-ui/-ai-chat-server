/** חוט · total-label — תווית סה"כ ₪/$ לתצוגה. חוזה: total-label.contract.md
 *  חולץ מ-maor/src/components/supporters/lib.ts:235-241; supIls/supUsd שוקעו. */
export function totalLabel(sp, supIls, supUsd) {
    const i = supIls(sp);
    const u = supUsd(sp);
    const ils = i ? '₪' + i.toLocaleString('he-IL') : '';
    const usd = u ? '$' + u.toLocaleString('he-IL') : '';
    return ils && usd ? ils + ' + ' + usd : ils || usd || '—';
}
