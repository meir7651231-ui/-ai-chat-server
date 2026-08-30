/** חוט · rule-contains — חוזה: rule-contains.contract.md */
export const ruleContains = (nq, nt, T) => (nq.length >= 2 && nt.includes(nq) ? T.k1 : null);
