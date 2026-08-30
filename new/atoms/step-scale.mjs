/** חוט · step-scale — צעד-זום אחד למעלה/למטה, עיגול-לעשירית נגד שאריות float.
 *  חוזה: step-scale.contract.md
 *  חולץ כלשונו מ-maor/src/lib/a11y.ts:44-48; השכן clampScale והקבוע
 *  SCALE_STEP=0.1 הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function stepScale(v, dir, clampScale, step = 0.1, T) {
  return clampScale(Math.round((clampScale(v) + dir * step) * T.k1) / T.k1);
}
