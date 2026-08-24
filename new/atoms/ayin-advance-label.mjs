/** חוט · ayin-advance-label — תווית הכפתור-החכם לפי שלב.
 *  חוזה: ayin-advance-label.contract.md · שקע: stageLabel
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:154-174 (קריאת-השכן שוקעה). */
export function ayinAdvanceLabel(cfg, a, stageLabel) {
    const st = a.stage;
    if (st === 'new')
        return stageLabel(cfg, 'lead') + ' ←';
    if (st === 'lead')
        return '✓ אישור — ' + stageLabel(cfg, 'lead');
    if (st === 'eyes')
        return stageLabel(cfg, 'answer') + ' ←';
    if (st === 'answer')
        return a.answerPushed ? '✓ ' + stageLabel(cfg, 'done') : '📞 דחיפה ללוח';
    return '';
}
