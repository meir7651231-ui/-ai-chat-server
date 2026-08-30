/** חוט · tier-of — דרגת מדד-האמינות לפי ניקוד (950/800/סף-אדום), כולל פיגמנטי-הדרגה.
 *  חוזה: tier-of.contract.md
 *  חולץ כלשונו מ-maor/src/components/families/lib.ts:61-68; קבוע-השכן
 *  CRED_RED_THRESHOLD הוזרק כשקע redThreshold (חוק-1). */
export function tierOf(score, redThreshold, T) {
  if (score >= T.k12) return { key: T.k1, label: T.k2, bg: T.k3, c: '#9a6414', dot: '#f3c76b' };
  if (score >= T.k13) return { key: T.k4, label: T.k5, bg: '#e4f5ea', c: '#12803c', dot: '#16a34a' };
  if (score >= redThreshold) return { key: T.k6, label: T.k7, bg: T.k8, c: '#9a6414', dot: '#d97706' };
  return { key: T.k9, label: T.k10, bg: T.k11, c: '#b91c1c', dot: '#dc2626' };
}
