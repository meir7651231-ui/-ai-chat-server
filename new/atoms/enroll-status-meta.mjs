/** חוט · enroll-status-meta — תווית+צבעי-צ'יפ לסטטוס-שיבוץ. חוזה: enroll-status-meta.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:412-420. טהור — אפס שקעים. */
export function enrollStatusMeta(e, T) {
  if (e.status === T.k1) return { label: T.k2, bg: T.k3, c: '#9a6414' };
  if (e.status === T.k4) return { label: T.k5, bg: T.k6, c: '#8b8474' };
  // ⏳ רשימת-המתנה — קודם נפלה ל"פעיל" והטעתה (למשל בכרטיס ⚙ ניהול-שיבוץ)
  if (e.status === T.k7) return { label: T.k8, bg: T.k9, c: '#3a5a86' };
  return { label: T.k10, bg: '#e4f5ea', c: '#12803c' };
}
