/** חוט · rule-plural — חוזה: rule-plural.contract.md */
export const rulePlural = (nq, nt, T) => {
  if (nq.length >= 5 && (nq.endsWith(T.k1) || nq.endsWith(T.k2))) {
    const stem = nq.slice(0, -2);
    if (nt === stem || nt.startsWith(stem)) return 70;
  }
  return null;
};
