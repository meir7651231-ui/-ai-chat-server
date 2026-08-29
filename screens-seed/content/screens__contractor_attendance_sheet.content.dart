// 📦 דאטה-תוכן (חולל ע"י screen-lift, הכרעה-11: מנוע-לא-נחיל) · screens__contractor_attendance_sheet
// מוצא: screens__contractor_attendance_sheet.dart — כל מחרוזת-תוכן שהייתה צרובה ב-widget, ממופתחת פר-מנגנון.

const contractorAttendanceSheetContent = (
  header: '🕒 נוכחות עובדים',
  subtitle: 'מי מהעובדים שלך מחותם כרגע ומי נכח היום (לצפייה בלבד)',
  emptyPresent: 'אין עובדים מחותמים כרגע',
  today: 'היום',
  emptyToday: 'אין נוכחות רשומה היום',
  sgwr6: 'סגור',
  tplNwkjyEkcywPresentleng7: '🟢 נוכחים עכשיו (${present.length})',
);

const presentRowContent = (
  tplDayusername1: '🟢 ${day.username}',
  knysh2: 'כניסה —',
  tplKnyshFmtTimeinTs3: 'כניסה ${_fmtTime(inTs)}',
);

const todayRowContent = (
  tplDayusername1: '🦺 ${day.username}',
  tplFmtDurworkedCewt2: '${_fmtDur(worked)} שעות',
  tplKnyshInTsNull3: 'כניסה ${inTs == null ? ',
  tplYxyahOutTsNull4: 'יציאה ${outTs == null ? ',
);

const locationPillContent = (
  location: 'מיקום הכניסה — פתח ניווט',
  tplDayusernameMyqwKnysh2: '${day.username} — מיקום כניסה',
);

