/** אטום-דאטה · diary-status-labels — תוויות/צבעי סטטוס-רישום ותווית-כרטיסייה של היומן
 *  (diary/lib.ts:261-275) (הכרעה 19: משמעות = דאטה; הקופסה מחווטת). חוזה: diary-status-labels.contract.md */
export const PLAN_PUNCH = 'punch';
export const PUNCH_LABEL_PREFIX = 'כרטיסייה · יתרה ';
export const ENROLL_STATUS_META = {
  paused: { label: 'מוקפא', bg: '#fdf1d4', c: '#9a6414' },
  ended: { label: 'הסתיים', bg: '#eceae2', c: '#8b8474' },
  wait: { label: 'רשימת-המתנה ⏳', bg: '#e7edf5', c: '#3a5a86' },
};
