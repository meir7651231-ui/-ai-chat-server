/** חוט · enroll-status-meta — תווית+צבעי-צ'יפ לסטטוס-שיבוץ. חוזה: enroll-status-meta.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:412-420. טהור — אפס שקעים. */
export function enrollStatusMeta(e) {
  if (e.status === 'paused') return { label: 'מוקפא', bg: '#fdf1d4', c: '#9a6414' };
  if (e.status === 'ended') return { label: 'הסתיים', bg: '#eceae2', c: '#8b8474' };
  // ⏳ רשימת-המתנה — קודם נפלה ל"פעיל" והטעתה (למשל בכרטיס ⚙ ניהול-שיבוץ)
  if (e.status === 'wait') return { label: 'רשימת-המתנה ⏳', bg: '#e7edf5', c: '#3a5a86' };
  return { label: 'פעיל', bg: '#e4f5ea', c: '#12803c' };
}
