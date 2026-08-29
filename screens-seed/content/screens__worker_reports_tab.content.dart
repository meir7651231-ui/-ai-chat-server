// 📦 דאטה-תוכן (חולל ע"י screen-lift, הכרעה-11: מנוע-לא-נחיל) · screens__worker_reports_tab
// מוצא: screens__worker_reports_tab.dart — כל מחרוזת-תוכן שהייתה צרובה ב-widget, ממופתחת פר-מנגנון.

const workerReportsTabContent = (
  title: '📊 דוחות',
  timeEmpty: 'אין עדיין מדידות זמן — הזמן נמדד אוטומטית מרגע תחילת משימה ועד אישורה.',
  areaNote: 'האזור נגזר משם המשימה (אין שדה אתר במנוע המשימות). שיוך לאתרי פרויקט אמיתיים יחובר עם חיבור השרת.',
  historyEmpty: 'עוד לא הגשת משימות לאישור — ההגשות שלך יופיעו כאן.',
  rejectionsEmpty: 'אין משימות שנדחו לתיקון.',
  sendDailyButton: '💬 שלח דוח יומי לקבלן',
  aiButton: 'נסח דוח עם AI',
  sendNote: 'הדוח נשלח כהודעה אמיתית לשיחת הקבלן (טאב שיחות) — סיכום הסטטוסים הנוכחי, בלי המצאות.',
  tplStreakYmy9: '$streak ימים',
  tplNtwnyJyyMhmcymwt10: 'נתונים חיים מהמשימות של ${workerShortName(worker)} — ללא המצאות',
  aycwrRacw11: 'אישור ראשון',
  ajwzHhgcwtCawcrw12: 'אחוז ההגשות שאושרו בלי דחייה מתוך כלל ההגשות. לחיצה פותחת פירוט מלא של הנתון.',
  aycwrracw13: 'אישור-ראשון 🎯',
  tplMazOrgTermref14: 'מאזן ${orgTerm(ref, ',
  AppBrandclubHmcwtLkl15: ', AppBrand.club)} המשותף לכל התפקידים במכשיר (אינו נצבר לעובד בנפרד). לחיצה פותחת פירוט.',
  BuildCoinsMwedwMcwt16: 'BuildCoins (מועדון משותף) 🪙',
  rxFeylwt17: 'רצף פעילות',
  msfrHymyHrxwfy18: 'מספר הימים הרצופים עם פעילות לפי שעון-המשימות. לחיצה פותחת פירוט הרצף.',
  rxFeylwt19: 'רצף פעילות 🔥',
  tplAycwrracwHgcwtCawcrw20: 'אישור-ראשון = הגשות שאושרו בלי דחייה מתוך כלל ההגשות — עדיין אין הגשות. מטבעות — מאזן ${orgTerm(ref, ',
  AppBrandclubHmcwtLkl21: ', AppBrand.club)} המשותף לכל התפקידים במכשיר (אינו נצבר לעובד בנפרד); הרצף נמדד משעון המשימות (ימים רצופים עם פעילות).',
  tplAycwrracwFirstPassMtw22: 'אישור-ראשון: $firstPass מתוך ${submitted.length} הגשות אושרו בלי דחייה. מטבעות — מאזן ${orgTerm(ref, ',
  sykwCbweyMcymwt23: '📅 סיכום שבועי — משימות שאושרו',
  ewdAyMcymwt24: 'עוד אין משימות שאושרו — משימה שתאושר תופיע כאן.',
  ayMcymwtCawcrw25: 'אין משימות שאושרו השבוע.',
  tplLlaTaryNoDate26: '🗓️ ללא תאריך: $noDate ${noDate == 1 ? ',
  mcymwtCawcrw27: 'משימות שאושרו',
  zmLklMcymh28: '⏱️ זמן לכל משימה',
  zmMcymh29: 'זמן משימה',
  mxygAtMcHebwdh30: 'מציג את משך-העבודה שנמדד למשימה. לחיצה פותחת פירוט זמן מלא של המשימה.',
  tplBbyxweMazHhmmclocktids31: '🔨 בביצוע מאז ${_hhmm(clock[t.id]!.startedAt!)}',
  fyrwtLfyAzwr32: '📍 פירוט לפי אזור עבודה',
  azwrEbwdh33: 'אזור עבודה',
  mskKmhMcymwt34: 'מסכם כמה משימות אושרו בכל אזור (הנגזר משם המשימה). לחיצה פותחת את המשימות באזור.',
  tplLengthevaluelengthAwcrw35: ').length}/${e.value.length} אושרו',
  tplHystwryytHgcwtSubmitte36: '📋 היסטוריית הגשות (${submitted.length})',
  tplDjywtLtyqwRejectedTas37: '↩️ דחיות לתיקון (${rejectedTasks.length})',
  sybtDjyyh38: 'סיבת דחייה',
  ljyxhFwtjtAt39: 'לחיצה פותחת את סיבת הדחייה של המנהל ואת פרטי המשימה לתיקון.',
  tplTnameHxgSybt40: '${t.name} — הצג סיבת דחייה',
  tplSybtHmnhlRejectNotesti41: 'סיבת המנהל: "${rejectNotes[t.id]}"',
  hmnhlLaXyr42: 'המנהל לא צירף סיבה לדחייה.',
  cljDwjYwmy43: 'שלח דוח יומי לקבלן',
  tplBtwrQueued44: '⏳ בתור: $queued',
  cyjtHqblLa45: 'שיחת הקבלן לא נמצאה — הדוח לא נשלח',
  hdwjNcljLqbl46: '💬 הדוח נשלח לקבלן — מופיע בטאב שיחות',
  tplDwjywWorkerShortNamewo47: 'דוח-יום — ${workerShortName(worker)}',
  tplAwcrwCount48: '✅ אושרו: ${count(',
  tplHwgcwWmmtynwtLaycwr49: '📸 הוגשו וממתינות לאישור: ${count(',
  tplNdjwLtyqwCount50: '↩️ נדחו לתיקון: ${count(',
  tplBbyxweCount51: '🔨 בביצוע: ${count(',
  tplBtwrCount52: '⏳ בתור: ${count(',
);

const kpiBoxContent = (
  tplLabelHxgFyrwt1: '$label — הצג פירוט',
);

const kvRowContent = (
  tplLabelValueHxg1: '$label, $value — הצג פירוט',
);

const barColumnContent = (
  ywBgr1: 'יום בגרף',
  ljyxhElEmwdtyw2: 'לחיצה על עמודת-יום פותחת את רשימת המשימות שאושרו באותו יום.',
  tplYwKDayLettersindexCou3: 'יום ${_kDayLetters[index]} — $count אושרו, הצג פירוט',
);

const historyRowContent = (
  photoError: '📷 לא ניתן להציג את התמונה',
  sgwr2: 'סגור',
  frtyHgch3: 'פרטי הגשה',
  ljyxhElCwrt4: 'לחיצה על שורת ההגשה פותחת את פירוט-ההגשה — מצב, זמן והערה.',
  tplTasknameHxgFrty5: '${task.name} — הצג פרטי הגשה',
);

const proofThumbContent = (
  tmwntHwkjh1: 'תמונת הוכחה',
  ljyxhElTmwnthhwkjh2: 'לחיצה על תמונת-ההוכחה הזעירה פותחת אותה במסך מלא עם זום.',
  hxgTmwntHwkjh3: 'הצג תמונת הוכחה במסך מלא',
  txt4: '📷',
);

