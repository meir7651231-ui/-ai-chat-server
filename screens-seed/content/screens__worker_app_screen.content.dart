// 📦 דאטה-תוכן (חולל ע"י screen-lift, הכרעה-11: מנוע-לא-נחיל) · screens__worker_app_screen
// מוצא: screens__worker_app_screen.dart — כל מחרוזת-תוכן שהייתה צרובה ב-widget, ממופתחת פר-מנגנון.

const weekStripCardContent = (
  journal: '📅 היומן שלי',
  fullMonth: 'חודש מלא ›',
  a3: 'א',
  b4: 'ב',
  g5: 'ג',
  d6: 'ד',
  h7: 'ה',
  w8: 'ו',
  c9: 'ש',
  jwdcMla10: 'חודש מלא',
  fwtjAtLwjhnwkjwt11: 'פותח את לוח-הנוכחות החודשי המלא — כניסה/יציאה, מיקום ',
  wsykwEbwdhLklYw12: 'וסיכום-עבודה לכל יום בחודש.',
);

const dayChipContent = (
  tplYwLabelDayNumisToday1: 'יום $label $dayNum${isToday ? ',
);

const dayAttendanceCardContent = (
  t01: '✓ נרשמה נוכחות להיום',
  t02: 'לא נרשמה נוכחות ביום זה',
  knyshEMyqw3: '🟢 כניסה עם מיקום',
  yxyahEMyqw4: '🔴 יציאה עם מיקום',
  nwkjwtHyw5: '🕐 נוכחות היום',
  nwkjwt6: '🕐 נוכחות',
  knysh7: 'כניסה',
  yxyah8: 'יציאה',
  shk9: 'סה"כ',
  myqwHebwdh10: 'מיקום העבודה',
  ncmrMmkcyrHGPS11: 'נשמר ממכשיר ה-GPS בעת רישום הכניסה. לחיצה פותחת ניווט ',
  bWazeAwBGoogle12: 'ב-Waze או ב-Google Maps אל מיקום העבודה.',
  ftjNywwtLmyqw13: 'פתח ניווט למיקום העבודה',
  ayMyqwCmwr14: 'אין מיקום שמור',
  myqwHebwdhNcmr15: 'מיקום העבודה נשמר — פתח ניווט',
  laNcmrMyqw16: 'לא נשמר מיקום ליום זה',
  nwkjwtEMyqw17: 'נוכחות עם מיקום',
  rwcKnyshyxyahLhyw18: 'רושם כניסה/יציאה להיום ושומר את מיקום ה-GPS. אם המיקום ',
  aynwZmyHnwkjwt19: 'אינו זמין — הנוכחות נרשמת בלי מיקום, בלי המצאה.',
);

const workerNavContent = (
  mcymwt1: 'משימות',
  cyjwt2: 'שיחות',
  dwjwt3: 'דוחות',
  azwrAycy4: 'אזור אישי',
);

const summaryCardContent = (
  t03: 'דמו',
  ycLMcymh2: 'יש לך משימה פעילה',
  ycMcymwtBtwr3: 'יש משימות בתור',
  ayMcymwtFtwjwt4: 'אין משימות פתוחות',
  tplClwName5: 'שלום, $name 👷',
  feylh6: 'פעילה',
  btwr7: 'בתור',
  hwgcw8: 'הוגשו',
);

const sectionContent = (
  krtysMcymh1: 'כרטיס משימה',
  ljyxhElHkrtys2: 'לחיצה על הכרטיס פותחת את פירוט המשימה — שלבים, הוראות, ',
  mhLhbyaWdywwj3: '"מה להביא" ודיווח ביצוע. כפתור "שלח לאישור" מגיש את ',
  hmcymhLaycwrHmnhl4: 'המשימה לאישור המנהל.',
);

const taskCardContent = (
  tplTaskdaysYmyTaskstepsl1: '🕒 ${task.days} ימים · ${task.steps.length} שלבים',
);

const equipmentButtonContent = (
  checkEquipment: 'בדוק ציוד נדרש',
  mrkzAtKl2: 'מרכז את כל הכלים והחומרים הדרושים למשימות הפעילות שלך לרשימה ',
  qlystMawgdLyw3: 'קליסט מאוגד ליום, שאפשר לסמן ולשלוח לקבלן.',
  txt4: '🧰',
);

const employerStockButtonContent = (
  employerStock: 'מלאי הקבלן',
  mxygLxfyyhBlbd2: 'מציג לצפייה בלבד את מלאי הקבלן המעסיק — איזה פריט נמצא במחסן ',
  wayzhBatrAyn3: 'ואיזה באתר. אינך עורך מלאי זה; הוא של הקבלן.',
  txt4: '📦',
);

const proposeTaskButtonContent = (
  addTask: 'הוסף משימה',
  fwtjTwfsLhxet2: 'פותח טופס להצעת משימה חדשה לקבלן. המשימה שאתה מציע נשלחת ',
  lqblLaycwrWrq3: 'לקבלן לאישור, ורק לאחר שאישר אותה היא הופכת לפעילה אצלך.',
);

const ganttButtonContent = (
  gantt: 'גאנט משימות',
  mxygLxfyyhBlbd2: 'מציג לצפייה בלבד את לוח-הזמנים של המשימות לפי תאריך-התחלה ',
  mtwzmHqblQwbe3: 'מתוזמן. הקבלן קובע את התאריכים; אתה רואה כאן את התזמון.',
  txt4: '📊',
);

const defectsButtonContent = (
  defects: 'ליקויים',
  fwtjTwfsLdywwj2: 'פותח טופס לדיווח על ליקוי שמצאת. הליקוי נשלח לקבלן לאישור, ',
  wbrgeCaycrAwtw3: 'וברגע שאישר אותו הוא נכנס לביצוע — בדיוק כמו משימה.',
  txt4: '🔧',
);

const submitButtonContent = (
  submit: '📸 שלח לאישור',
  cljLaycwr2: 'שלח לאישור',
);

