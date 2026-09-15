/* ===========================================================================
   המחסן — עולם אחד שממנו כל המסכים קוראים.
   דטרמיניסטי (זרע קבוע ⇒ אותם נתונים בכל פתיחה), מקושר (משפחה↔תלמיד↔מקום↔הלוואה↔קו),
   ונגזר: אין מספר אחד שנכתב ביד במסך. כל שינוי עובר דרך act() ⇒ ניתן לביטול ונרשם ביומן.
   =========================================================================== */

const seed = (s) => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
let R = seed(20260915);
const rn = (a, b) => a + Math.floor(R() * (b - a + 1));
const pk = (a) => a[Math.floor(R() * a.length)];
const chance = (p) => R() < p;

const LAST = ['ברגר', 'רוזן', 'כהן', 'ויס', 'אדלר', 'שטרן', 'נוימן', 'לוי', 'פריד', 'כץ', 'גולד', 'רוט', 'מלר', 'פרידמן', 'הורוביץ', 'אונגר', 'ויסבלט', 'גרין', 'דויטש', 'הירש', 'וקסלר', 'זילבר', 'חשין', 'טננבוים', 'יעקובוביץ', 'כהנא', 'לנדאו', 'אברמסון', 'בלוי', 'גולדשטיין', 'שוורץ', 'פישר', 'רייזמן', 'הלר', 'בראון', 'שפירא', 'טויב', 'ריינר', 'אקשטיין', 'זיסקינד'];
const MALE = ['אברהם', 'יצחק', 'יעקב', 'משה', 'אהרן', 'שמואל', 'דוד', 'שלמה', 'מנחם', 'מרדכי', 'נפתלי', 'אשר', 'זבולון', 'יששכר', 'אליהו', 'אלימלך', 'ברוך', 'גרשון', 'זלמן', 'חיים', 'טוביה', 'יוסף', 'כלב', 'לוי', 'נחום', 'עזרא', 'פינחס', 'צבי', 'קלמן', 'שרגא', 'שמעון', 'יהודה', 'דן', 'גד', 'אורי', 'בנימין'];
const FEM = ['שרה', 'רבקה', 'רחל', 'לאה', 'מרים', 'חנה', 'אסתר', 'דבורה', 'יוכבד', 'ציפורה', 'בילא', 'פייגא', 'גיטל', 'הינדא', 'מלכה', 'פסיה', 'רייזל', 'שיינדל', 'טובה', 'זיסל', 'ברכה', 'נחמה', 'תמר', 'יעל', 'אביגיל', 'שושנה'];
const CITY = ['ירושלים', 'בית שמש', 'בני ברק', 'מודיעין עילית', 'ביתר עילית', 'אלעד', 'אשדוד', 'לונדון', 'אנטוורפן', 'ניו יורק'];
const CLASSES = ['ג׳1', 'ג׳2', 'ד׳1', 'ד׳2', 'ה׳1', 'ה׳2', 'ו׳1', 'ו׳2', 'ז׳1', 'ז׳2', 'ח׳1', 'ח׳2'];
const HMONTH = ['תשרי', 'חשון', 'כסלו', 'טבת', 'שבט', 'אדר', 'ניסן', 'אייר', 'סיון', 'תמוז', 'אב', 'אלול'];
const HDAY = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳', 'י׳', 'י״א', 'י״ב', 'י״ג', 'י״ד', 'ט״ו', 'ט״ז', 'י״ז', 'י״ח', 'י״ט', 'כ׳', 'כ״א', 'כ״ב', 'כ״ג', 'כ״ד', 'כ״ה', 'כ״ו', 'כ״ז', 'כ״ח', 'כ״ט', 'ל׳'];

/* התעריפון — הבסיס לכל חיוב. שינוי כאן מזיז את כל המספרים במערכת. */
const TARIFF = { tuition: 6000, bus: 900, books: 225, year: 'תשפ״ז' };
const DISCOUNTS = [0, 0, 0, 10, 10, 15, 15, 15, 21, 35];

const DB = {
  tariff: TARIFF, hmonths: HMONTH,
  today: { hd: 'ד׳ תשרי', hy: 'תשפ״ז', dow: 'יום שלישי' },
  people: [], families: [], students: [], classes: [], staff: [], payments: [],
  donors: [], donations: [], campaigns: [], budget: [], seats: [], minyanim: [],
  yahrzeits: [], queue: [], loans: [], routes: [], calls: [], proposals: [],
  groups: [], messages: [], log: [],
};

/* ---------- בניית העולם ---------- */
function build() {
  R = seed(20260915);
  let pid = 0;
  const person = (o) => { const p = { id: 'p' + pid++, ...o }; DB.people.push(p); return p; };

  /* 12 כיתות */
  CLASSES.forEach((n, i) => DB.classes.push({ id: 'c' + i, name: n, room: 'חדר ' + (10 + i), rebbe: null, students: [] }));

  /* 44 עובדים */
  const STAFF_ROLES = [['מגיד שיעור', 12], ['מלמד', 10], ['משגיח', 3], ['מזכירות', 4], ['מטבח', 5], ['אחזקה', 3], ['נהג', 4], ['הנהלה', 3]];
  STAFF_ROLES.forEach(([role, n]) => {
    for (let i = 0; i < n; i++) {
      const p = person({ first: pk(MALE), last: pk(LAST), city: pk(CITY), kind: 'עובד' });
      const absent = chance(0.07) ? pk(['חופשה', 'מחלה']) : null;
      DB.staff.push({
        id: 't' + DB.staff.length, personId: p.id, role, absent, sub: null,
        since: rn(1, 22) + ' שנים', phone: '0' + rn(50, 58) + '-' + rn(200, 999) + '-' + rn(1000, 9999),
        shifts: [],
      });
    }
  });
  /* משבצות היום — נגזרות מהתפקיד, לא נכתבות ביד */
  const SHIFT = {
    'מגיד שיעור': [['08:00', '12:20', 'סדר א׳'], ['13:45', '16:10', 'סדר ב׳']],
    'מלמד': [['08:00', '12:20', 'סדר א׳'], ['13:45', '15:20', 'חזרה']],
    'משגיח': [['06:20', '09:00', 'שחרית'], ['12:20', '13:45', 'סעודה'], ['19:00', '21:30', 'סדר ערב']],
    'מזכירות': [['08:00', '15:00', 'משרד']],
    'מטבח': [['05:30', '14:00', 'בוקר וצהריים'], ['17:00', '20:00', 'ערב']],
    'אחזקה': [['07:00', '16:00', 'אחזקה']],
    'נהג': [['07:00', '08:30', 'איסוף'], ['16:00', '17:30', 'פיזור']],
    'הנהלה': [['08:30', '17:00', 'משרד']],
  };
  DB.staff.forEach(s => { s.shifts = s.absent ? [] : SHIFT[s.role].map(x => x.slice()); });
  DB.classes.forEach((c, i) => { const t = DB.staff[i]; c.rebbe = t.id; t.classId = c.id; });
  /* מחליף למי שנעדר — רק אם יש פנוי באותו תפקיד */
  DB.staff.filter(s => s.absent).forEach(s => {
    const free = DB.staff.find(x => !x.absent && x.role === s.role && !x.subFor);
    if (free && chance(0.7)) { s.sub = free.id; free.subFor = s.id; free.shifts = [['08:00', '16:00', 'במקום ' + nameOf(s.personId)]]; }
  });

  /* 168 משפחות · 412 תלמידים */
  const FAMS = 168;
  for (let i = 0; i < FAMS; i++) {
    const last = LAST[i % LAST.length] + (i >= LAST.length ? ' ' + MALE[i % 7][0] + '׳' : '');
    const head = person({ first: pk(MALE), last, city: pk(CITY), kind: 'הורה' });
    const spouse = person({ first: pk(FEM), last, city: head.city, kind: 'הורה' });
    const f = {
      id: 'f' + i, name: 'משפחת ' + last, city: head.city, head: head.id, spouse: spouse.id,
      phone: '0' + rn(50, 58) + '-' + rn(200, 999) + '-' + rn(1000, 9999),
      kids: [], discount: pk(DISCOUNTS), hok: chance(0.62), seat: null, loan: null, donor: null,
      note: '',
    };
    head.familyId = spouse.familyId = f.id;
    DB.families.push(f);
  }
  /* התלמידים מחולקים למשפחות עד 412 בדיוק */
  let sid = 0;
  while (sid < 412) {
    const f = DB.families[sid % FAMS];
    if (f.kids.length >= 5) { sid++; continue; }
    const p = person({ first: pk(MALE), last: f.name.replace('משפחת ', ''), city: f.city, kind: 'תלמיד', familyId: f.id });
    const cls = DB.classes[rn(0, 11)];
    const st = {
      id: 's' + sid, personId: p.id, familyId: f.id, classId: cls.id,
      att: Array.from({ length: 5 }, () => chance(0.93)),
      note: chance(0.1) ? pk(['איחורים חוזרים', 'מצטיין בעיון', 'זקוק לחיזוק בחשבון', 'חבר טוב לכיתה']) : '',
      routeId: null, stopIdx: 0,
    };
    p.studentId = st.id; f.kids.push(st.id); cls.students.push(st.id);
    DB.students.push(st); sid++;
  }

  /* חיובים — נגזרים מהתעריפון ומההנחה; אין שדה «יתרה» שנכתב ביד */
  DB.families.forEach(f => {
    f.paid = 0;
    const due = charged(f);
    const ratio = f.hok ? (0.55 + R() * 0.45) : (0.15 + R() * 0.75);
    f.paid = Math.round(due * ratio / 100) * 100;
  });

  /* תשלומים אחרונים */
  for (let i = 0; i < 48; i++) {
    const f = pk(DB.families);
    DB.payments.push({ id: 'y' + i, familyId: f.id, amount: rn(3, 40) * 100, method: pk(['הוראת קבע', 'המחאה', 'אשראי', 'מזומן', 'העברה']), ago: i });
  }

  /* מגביות ותרומות */
  DB.campaigns.push({ id: 'k0', name: 'בניין בית המדרש', goal: 2400000, open: true, miles: [[25, 'יסודות'], [50, 'שלד'], [75, 'גג'], [100, 'סיום']] });
  DB.campaigns.push({ id: 'k1', name: 'קמחא דפסחא', goal: 240000, open: false, miles: [] });
  DB.campaigns.push({ id: 'k2', name: 'דינר תשפ״ו', goal: 1000000, open: false, miles: [] });
  const AMB = 5;
  for (let i = 0; i < 180; i++) {
    const inFam = i < 60 ? DB.families[rn(0, FAMS - 1)] : null;
    const p = inFam ? DB.people.find(x => x.id === inFam.head) : person({ first: pk(MALE), last: pk(LAST), city: pk(CITY), kind: 'תורם' });
    const d = { id: 'd' + i, personId: p.id, city: p.city, amb: i < AMB ? 'a' + i : (chance(0.55) ? 'a' + rn(0, AMB - 1) : null), anon: chance(0.12) };
    if (inFam) inFam.donor = d.id;
    p.donorId = d.id;
    DB.donors.push(d);
  }
  /* התפלגות התרומות: הרבה קטנות, מעט גדולות — אחרת המגבית «עוברת» את היעד שלה */
  const AMOUNTS = [360, 360, 500, 500, 1000, 1000, 1800, 1800, 3600, 3600, 5400, 5400, 10000, 18000, 25000, 36000];
  for (let i = 0; i < 260; i++) {
    const dn = pk(DB.donors);
    DB.donations.push({
      id: 'n' + i, donorId: dn.id, amount: i === 0 ? 180000 : pk(AMOUNTS),   // מתנת-הפתיחה של הפרנס
      campaignId: chance(0.72) ? 'k0' : pk(['k1', 'k2']),
      amb: dn.amb, ago: i, method: pk(['העברה', 'אשראי', 'המחאה', 'מזומן']),
    });
  }
  DB.ambassadors = Array.from({ length: AMB }, (_, i) => ({ id: 'a' + i, personId: DB.donors[i].personId, goal: [700000, 500000, 250000, 200000, 150000][i] }));

  /* תקציב — הביצוע נגזר מהחודשים */
  [['שכר מלמדים וצוות חינוכי', 1180], ['מטבח וסעודות', 312], ['הסעות', 196], ['אחזקת מבנה וחשמל', 168],
  ['ספרים וציוד לימודי', 84], ['פנימייה', 126], ['משרד, ביטוח ורואה חשבון', 64], ['בית המדרש ואירועים', 20]]
    .forEach(([n, plan], i) => {
      const months = HMONTH.map((_, m) => m === 11 ? 0 : Math.round(plan / 11 * (0.75 + R() * 0.55)));
      DB.budget.push({ id: 'b' + i, name: n, plan, months });
    });

  /* בית המדרש — 72 מקומות, חלקם משויכים למשפחות */
  for (let r = 0; r < 6; r++) for (let c = 0; c < 12; c++) {
    const edge = c === 0 || c === 11;
    const st = edge ? 'שמור' : chance(0.42) ? 'קבוע' : chance(0.45) ? 'מושכר' : 'פנוי';
    const s = { id: 'q' + (r * 12 + c), row: r, col: c, status: st, familyId: null, price: st === 'מושכר' ? 2400 : 0 };
    if (st === 'קבוע' || st === 'מושכר') { const f = DB.families[rn(0, FAMS - 1)]; if (!f.seat) { f.seat = s.id; s.familyId = f.id; } else s.status = 'פנוי'; }
    DB.seats.push(s);
  }
  [['05:40', 'ותיקין', 'עזרה מזרחית'], ['06:20', 'שחרית · מניין ב׳', 'האולם הגדול'], ['07:15', 'שחרית · מניין ג׳', 'האולם הגדול'],
  ['08:00', 'שיעור דף היומי', 'בית המדרש'], ['13:45', 'מנחה גדולה', 'האולם הגדול'], ['16:30', 'שיעור הלכה', 'חדר עיון'],
  ['18:52', 'שקיעה', ''], ['19:10', 'מנחה ומעריב', 'האולם הגדול'], ['20:30', 'סדר ערב', 'בית המדרש']]
    .forEach(([t, n, w], i) => DB.minyanim.push({ id: 'm' + i, time: t, name: n, where: w, count: w ? rn(18, 120) : 0 }));
  for (let i = 0; i < 9; i++) {
    const f = DB.families[rn(0, FAMS - 1)];
    DB.yahrzeits.push({ id: 'z' + i, name: (chance(0.5) ? 'ר׳ ' + pk(MALE) + ' בן ר׳ ' + pk(MALE) : 'מרת ' + pk(FEM) + ' בת ר׳ ' + pk(MALE)), day: pk(HDAY) + ' תשרי', familyId: f.id });
  }

  /* החצר — תור קבלת קהל */
  for (let i = 0; i < 14; i++) {
    const f = DB.families[rn(0, FAMS - 1)];
    DB.queue.push({ id: 'u' + i, no: 47 + i, familyId: f.id, reason: pk(['קוויטל', 'קוויטל · ברכה לרפואה', 'שידוך', 'עניין הוועד', 'בקשת הנחה', 'הודעה אישית']), state: i === 0 ? 'inside' : 'wait', mins: i === 0 ? 4 : null });
  }

  /* חסד — השלבים, הערבים והאיסורים מגיעים מהאפיון (SPEC), לא מהדמיון */
  const LFLOW = ['בקשה', 'ועדה', 'אושר', 'ניתן', 'בהחזר', 'נפרע'];
  for (let i = 0; i < 26; i++) {
    const f = DB.families[rn(0, FAMS - 1)];
    const stage = i < 5 ? LFLOW[rn(0, 1)] : i < 8 ? LFLOW[rn(2, 3)] : i < 23 ? 'בהחזר' : chance(0.5) ? 'באיחור' : 'נפרע';
    const total = rn(4, 36) * 1000;
    const inst = rn(12, 36);
    const started = ['בהחזר', 'באיחור', 'נפרע'].includes(stage);
    const l = {
      id: 'l' + i, familyId: f.id, amount: total,
      purpose: pk(['חתונה', 'הוצאות רפואיות', 'שכר לימוד', 'תיקון רכב', 'שיפוץ דירה', 'מעבר דירה', 'הוצאות חג', 'ציוד לימודי']),
      stage, guarantors: stage === 'בקשה' ? rn(0, 2) : 2, installments: inst,
      paid: stage === 'נפרע' ? inst : started ? rn(1, inst - 1) : 0,
      late: stage === 'באיחור' ? rn(2, 4) : 0, days: rn(0, 14),
    };
    if (!f.loan) f.loan = l.id;
    DB.loans.push(l);
  }

  /* תפעול — קווים, נהגים מתוך הצוות, נוסעים מתוך התלמידים */
  const drivers = DB.staff.filter(s => s.role === 'נהג');
  [['קו 1 · ירושלים מרכז', [['גאולה', '07:00'], ['מאה שערים', '07:08'], ['בר אילן', '07:17'], ['רמות ג׳', '07:29'], ['המוסד', '07:45']]],
  ['קו 2 · בית שמש', [['רמב״ש א׳', '06:40'], ['רמב״ש ב׳', '06:48'], ['נהר הירדן', '06:56'], ['המוסד', '07:40']]],
  ['קו 3 · ביתר', [['גבעה א׳', '06:50'], ['גבעה ב׳', '06:58'], ['המוסד', '07:42']]],
  ['קו 4 · מודיעין עילית', [['קרית ספר', '06:45'], ['גרין פארק', '06:55'], ['המוסד', '07:38']]],
  ['קו 5 · בני ברק', [['רבי עקיבא', '06:35'], ['חזון איש', '06:44'], ['המוסד', '07:35']]],
  ['קו 6 · פנימייה · פיזור', [['המוסד', '16:10'], ['רמות', '16:32'], ['גאולה', '16:48'], ['בית שמש', '17:20']]]]
    .forEach(([name, stops], i) => {
      DB.routes.push({ id: 'r' + i, name, driver: i === 3 ? null : (drivers[i % drivers.length] || {}).id || null, stops: stops.map(([n, t]) => ({ name: n, time: t, riders: [] })), at: i < 3 ? [rn(0, stops.length - 2), R()] : null });
    });
  DB.students.forEach(st => {
    if (!chance(0.63)) return;
    const r = DB.routes[rn(0, 4)];
    const k = rn(0, r.stops.length - 2);
    st.routeId = r.id; st.stopIdx = k; r.stops[k].riders.push(st.id);
  });
  [['דוד חם לא עובד · פנימייה קומה ב׳', 'דחוף', 2], ['נזילה במטבח · מתחת לכיור', 'דחוף', 1],
  ['תאורה בחדר 14', 'רגיל', 4], ['דלת הכיתה לא ננעלת', 'רגיל', 6], ['צביעת מסדרון מזרחי', 'כשיתאפשר', 21]]
    .forEach(([t, sev, days], i) => DB.calls.push({ id: 'v' + i, text: t, sev, days, owner: i < 2 ? DB.staff.find(s => s.role === 'אחזקה').id : null }));

  /* שידוכים */
  const CRIT = ['חוג', 'לימוד אחרי החתונה', 'מגורים', 'גיל', 'השכלה', 'תמיכת ההורים', 'בריאות', 'מכרים משותפים'];
  const PSTAGES = stagesOf('שידוכים', 'הצעה');
  for (let i = 0; i < 31; i++) {
    const a = DB.families[rn(0, FAMS - 1)], b = DB.families[rn(0, FAMS - 1)];
    DB.proposals.push({
      id: 'o' + i, a: a.id, b: b.id, stage: PSTAGES[rn(0, PSTAGES.length - 1)],
      crit: CRIT.map(c => ({ k: c, ok: chance(0.82) ? 'yes' : 'part' })), days: rn(1, 60),
    });
  }

  /* תקשורת */
  [['הורי כיתה ז׳', null], ['כל ההורים', null], ['צוות חינוכי', null], ['תורמים · פרנסים', null], ['ועד ההורים', null]]
    .forEach(([n], i) => DB.groups.push({ id: 'g' + i, name: n }));
  DB.groups[0].count = DB.students.filter(s => s.classId === 'c8' || s.classId === 'c9').length;
  DB.groups[1].count = DB.families.length;
  DB.groups[2].count = DB.staff.filter(s => ['מגיד שיעור', 'מלמד', 'משגיח'].includes(s.role)).length;
  DB.groups[3].count = DB.donors.length;
  DB.groups[4].count = 9;
  [['תזכורת תשלום · כיתה ז׳', 31, 2, 'אתמול'], ['ביטול לימודים · סערה', 412, 0, 'לפני 3 ימים'], ['עלון פרשת נצבים', 388, 0, 'לפני שבוע']]
    .forEach(([t, ok, bad, when], i) => DB.messages.push({ id: 'g' + i, text: t, ok, bad, when }));

  /* יומן — נזרע בעבר, וממשיך להיכתב בכל פעולה */
  [['התקבל תשלום', 'גבייה', 'לפני 12 דק׳'], ['נפתחה בקשת הנחה', 'גבייה', 'לפני שעה'],
  ['אושרה הלוואה', 'חסד', 'אתמול'], ['שובץ מחליף לאחזקה', 'צוות', 'אתמול'],
  ['נשלחה תזכורת ל-31 הורים', 'תקשורת', 'אתמול'], ['נסגרה מגבית קמחא דפסחא', 'תרומות', 'לפני שבוע']]
    .forEach(([what, dept, when], i) => DB.log.push({ id: 'e' + i, what, dept, when, who: 'י. מלר', undo: null }));
}

/* ---------- נגזרות ---------- */
const nameOf = (pid) => { const p = DB.people.find(x => x.id === pid); return p ? p.first + ' ' + p.last : '—'; };
const person = (id) => DB.people.find(x => x.id === id);
const fam = (id) => DB.families.find(x => x.id === id);
const stu = (id) => DB.students.find(x => x.id === id);
const cls = (id) => DB.classes.find(x => x.id === id);
const staff = (id) => DB.staff.find(x => x.id === id);
const loan = (id) => DB.loans.find(x => x.id === id);
const route = (id) => DB.routes.find(x => x.id === id);
const seat = (id) => DB.seats.find(x => x.id === id);

/* חיוב משפחה — מהתעריפון, עם ההנחה הגבוהה בלבד (כלל מהאפיון) */
function charged(f) {
  const k = f.kids.length;
  const bus = f.kids.filter(id => stu(id) && stu(id).routeId).length;
  return k * TARIFF.tuition + bus * TARIFF.bus + k * TARIFF.books;
}
const discounted = (f) => Math.round(charged(f) * (1 - f.discount / 100));
const balance = (f) => discounted(f) - f.paid;

const totals = () => {
  let due = 0, paid = 0;
  DB.families.forEach(f => { due += discounted(f); paid += f.paid; });
  return { due, paid, open: due - paid, pct: due ? Math.round(paid / due * 100) : 0 };
};
const lateFamilies = () => DB.families.filter(f => balance(f) > discounted(f) * 0.45 && !f.hok);
const raised = (k) => DB.donations.filter(d => d.campaignId === k).reduce((a, d) => a + d.amount, 0);
const ambRaised = (a) => DB.donations.filter(d => d.amb === a).reduce((s, d) => s + d.amount, 0);
const budgetActual = (b) => b.months.reduce((a, m) => a + m, 0);
const budgetTotals = () => ({ plan: DB.budget.reduce((a, b) => a + b.plan, 0), actual: DB.budget.reduce((a, b) => a + budgetActual(b), 0) });
const LOAN_OPEN = ['ניתן', 'בהחזר', 'באיחור'];
const fund = () => {
  const cap = 742000;
  const live = DB.loans.filter(l => LOAN_OPEN.includes(l.stage));
  const out = live.reduce((a, l) => a + Math.round(l.amount * (1 - l.paid / l.installments)), 0);
  return { cap, out, free: cap - out, active: live.length, late: DB.loans.filter(l => l.stage === 'באיחור').length };
};
const attendanceOf = (classId) => {
  const ss = DB.students.filter(s => s.classId === classId);
  const days = ss.reduce((a, s) => a + s.att.filter(Boolean).length, 0);
  return ss.length ? Math.round(days / (ss.length * 5) * 100) : 0;
};
const presentToday = () => DB.staff.filter(s => !s.absent).length;
const ridersOf = (r) => r.stops.reduce((a, s) => a + s.riders.length, 0);

/* האפיון — 181 ישויות, 1,232 שדות. השלבים והאיסורים למטה הם שלו, לא שלי. */
function entOf(deptName, entName) {
  const d = SPEC.depts.find(x => x.n === deptName);
  return d ? d.e.find(x => x.n === entName) : null;
}
function stagesOf(deptName, entName) { const e = entOf(deptName, entName); return (e && e.st.length) ? e.st : ['נפתח', 'בטיפול', 'נסגר']; }
function forbiddenOf(deptName, entName) { const e = entOf(deptName, entName); return e ? e.fb : []; }
function momentOf(deptName, entName) { const e = entOf(deptName, entName); return e ? e.mo : ''; }
function fieldsOf(deptName, entName) { const e = entOf(deptName, entName); return e ? e.f : []; }
const specCount = () => {
  let ent = 0, fld = 0, st = 0, fb = 0;
  SPEC.depts.forEach(d => d.e.forEach(e => { ent++; fld += e.f.length; st += e.st.length; fb += e.fb.length; }));
  return { dept: SPEC.depts.length, ent, fld, st, fb, roles: SPEC.roles.length };
};

/* ---------- שינוי, ביטול, יומן ---------- */
const listeners = [];
const onChange = (fn) => listeners.push(fn);
let undoStack = [];
function act(label, dept, apply) {
  const undo = apply();
  DB.log.unshift({ id: 'e' + Date.now(), what: label, dept, when: 'עכשיו', who: ROLE.name, undo });
  if (undo) undoStack.push({ label, undo });
  listeners.forEach(f => f(label));
  return label;
}
function undoLast() {
  const u = undoStack.pop(); if (!u) return null;
  u.undo();
  const e = DB.log.find(x => x.undo === u.undo); if (e) { e.what = e.what + ' · בוטל'; e.undo = null; }
  listeners.forEach(f => f('undo'));
  return u.label;
}
