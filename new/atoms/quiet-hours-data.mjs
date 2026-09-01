/** אטום-דאטה · quiet-hours-data — קבועי-הדומיין של הקופסה (הכרעה 19: טבלה/סף-דומיין = דאטה).
 *  חולץ מנועית מ-quiet-hours · צורת-דאטה טהורה (פטור-טוהר-עומק). חוזה: quiet-hours-data.contract.md */
export const QUIET_FROM = 21;
export const QUIET_TO = 8;
export const PREFIX_TZ = [
    { p: '+972', off: 3, label: 'ישראל' },
    { p: '+1', off: -5, label: 'ארה״ב/קנדה' },
    { p: '+44', off: 0, label: 'בריטניה' },
    { p: '+33', off: 1, label: 'צרפת' },
    { p: '+32', off: 1, label: 'בלגיה' },
    { p: '+41', off: 1, label: 'שווייץ' },
    { p: '+61', off: 10, label: 'אוסטרליה' },
    { p: '+7', off: 3, label: 'רוסיה' },
    { p: '+380', off: 2, label: 'אוקראינה' },
];
