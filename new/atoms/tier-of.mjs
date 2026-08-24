/** חוט · tier-of — דרגת מדד-האמינות לפי ניקוד (950/800/סף-אדום), כולל פיגמנטי-הדרגה.
 *  חוזה: tier-of.contract.md
 *  חולץ כלשונו מ-maor/src/components/families/lib.ts:61-68; קבוע-השכן
 *  CRED_RED_THRESHOLD הוזרק כשקע redThreshold (חוק-1). */
export function tierOf(score, redThreshold) {
  if (score >= 950) return { key: 'titan', label: 'טיטאן', bg: '#fdf3dd', c: '#9a6414', dot: '#f3c76b' };
  if (score >= 800) return { key: 'lion', label: 'לביאה', bg: '#e4f5ea', c: '#12803c', dot: '#16a34a' };
  if (score >= redThreshold) return { key: 'pale', label: 'טעון שיפור', bg: '#fdf1d4', c: '#9a6414', dot: '#d97706' };
  return { key: 'red', label: 'סיכון נטישה', bg: '#fdeaea', c: '#b91c1c', dot: '#dc2626' };
}
