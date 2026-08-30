/** חוט · ayin-advance-label — תווית הכפתור-החכם לפי שלב.
 *  חוזה: ayin-advance-label.contract.md · שקע: stageLabel
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:154-174 (קריאת-השכן שוקעה). */
export function ayinAdvanceLabel(cfg, a, stageLabel, T) {
    const st = a.stage;
    if (st === T.k1)
        return stageLabel(cfg, T.k2) + ' ←';
    if (st === T.k2)
        return T.k3 + stageLabel(cfg, T.k2);
    if (st === T.k4)
        return stageLabel(cfg, T.k5) + ' ←';
    if (st === T.k5)
        return a.answerPushed ? '✓ ' + stageLabel(cfg, T.k6) : T.k7;
    return '';
}
