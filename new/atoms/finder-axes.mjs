/** חוט · finder-axes — צירי-הצלילה של מאתר-המשפחות. חוזה: finder-axes.contract.md
 *  חולץ כלשונו מ-maor/src/components/families/lib.ts:87-101; השכן termOf
 *  (מילון-המונחים) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function finderAxes(config, termOf, T) {
  return [
    [T.k1, T.k2],
    [T.k3, T.k4],
    [T.k5, T.k6],
    [T.k7, T.k8],
    [T.k9, termOf(config, T.k10, T.k11)],
    [T.k12, T.k13],
    [T.k14, termOf(config, T.k15, T.k16)],
    [T.k17, T.k18],
    [T.k19, T.k20],
  ];
}
