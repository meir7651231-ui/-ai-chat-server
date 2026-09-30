// steps cls-birth + outbound-redactor, pure: a hand-labeled corpus. Classification - sensitivity right on at least 95%,
// and a personal-sensitive sentence (2-3) classified lower: zero. Redaction - 60 sentences that must be cut, 60 that
// must pass: recall at least 95%, at most 2 false alarms. Run: node tests/class.corpus.js
const fs = require('fs'); const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'liba/src/34-class.js'), 'utf8');
const { classify, redact, egressDecide, EGRESS } = new Function(src.slice(src.indexOf('/*<pure>*/'), src.indexOf('/*</pure>*/')) + '\nreturn {classify,redact,egressDecide,EGRESS};')();
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++ };
// [sentence, sens, scope]
const C = [
  ['תכין את הדוח החודשי של המוסד', 0, 'institution'], ['כמה תלמידים נרשמו השנה', 0, 'institution'], ['תזמין ישיבת צוות ליום שלישי', 0, 'institution'],
  ['מה המצב עם התקציב של העמותה', 0, 'institution'], ['תבדוק מתי השיעור של הר"מ מתחיל', 0, 'institution'], ['תשלח לספק את ההזמנה של המטבח', 0, 'institution'],
  ['מי אחראי על הרישום לשנה הבאה', 0, 'institution'], ['תסכם את המלגות של המחזור', 0, 'institution'], ['הקבלן צריך לסיים את הגג עד חנוכה', 0, 'institution'],
  ['תכין טבלה של הבחורים בפנימייה', 0, 'institution'], ['מה עם הדו"ח למשרד החינוך', 0, 'institution'], ['תזכיר לי לחתום על הצ׳קים של הוועד', 0, 'institution'],
  ['הבועה נתקעה אחרי העדכון', 0, 'system'], ['יש באג בדף של המשימות', 0, 'system'], ['תעלה גרסה חדשה של האפליקציה', 0, 'system'],
  ['למה הסשן לא ענה', 0, 'system'], ['המיקרופון לא עובד מהבוקר', 0, 'system'], ['תבדוק את הקריסה של אתמול', 0, 'system'],
  ['מה השעה', 0, 'personal'], ['תקריאי לי את ההודעות', 1, 'personal'], ['אני רוצה לנוח עכשיו', 1, 'personal'],
  ['אשתי ביקשה שאקנה חלב', 1, 'personal'], ['הילדים שלי חוזרים בשש', 1, 'personal'], ['תזכיר לי להתקשר לאמא שלי', 1, 'personal'],
  ['יוסי אמר שהוא לא בא מחר', 1, 'personal'], ['משה ביקש לדחות את הפגישה', 1, 'personal'], ['דוד התקשר פעמיים הבוקר', 1, 'personal'],
  ['החתונה של הבת שלי בעוד חודש', 1, 'personal'], ['אני מרגיש עייף היום', 1, 'personal'], ['הבן של שמעון רוצה לעבור ישיבה', 1, 'institution'],
  ['הילד של משה מאושפז בבית חולים', 2, 'personal'], ['אבא שלי צריך ניתוח בשבוע הבא', 2, 'personal'], ['יש לי בדיקת דם מחר בבוקר', 2, 'personal'],
  ['הבחור מהמחזור השני מטופל אצל פסיכולוג', 2, 'institution'], ['לרב גולדברג יש סכרת', 2, 'personal'], ['אשתי בהריון', 2, 'personal'],
  ['יש לי חוב של עשרת אלפים בבנק', 2, 'personal'], ['המשכורת של המזכירה לא נכנסה', 2, 'institution'], ['לקחתי הלוואה על הבית', 2, 'personal'],
  ['יש עיקול על החשבון של אחי', 2, 'personal'], ['ההורים של הבחור מתגרשים', 1, 'institution'], ['עורך הדין שלח את כתב התביעה', 2, 'personal'],
  ['המשטרה רוצה לחקור את השומר', 2, 'personal'], ['העובדת הסוציאלית של הרווחה התקשרה', 2, 'personal'], ['תתקשר לשמואל 052-1234567', 2, 'personal'],
  ['הטלפון של הקבלן 03-5551234', 2, 'institution'], ['המייל שלי meir@example.com', 2, 'personal'], ['הוא נולד ב-12.5.1978', 2, 'personal'],
  ['הכתובת היא רחוב הרב קוק 12', 2, 'personal'], ['מספר הזהות שלי 123456782', 3, 'personal'], ['תעביר לחשבון 12-345-678901 אלף שקל', 3, 'personal'],
  ['הסיסמה של הבנק היא שמש', 3, 'personal'], ['מספר הכרטיס 4580 1234 5678 9014', 3, 'personal'], ['הת"ז של הבחור 000000018', 3, 'institution'],
  ['קוד הכניסה למשרד הוא ארבע שבע', 3, 'institution'], ['ה-IBAN של העמותה IL62 0108 0000 0009 9999 999', 3, 'institution'], ['חשבון בנק 987654 בסניף שמונה', 3, 'personal'],
  ['שלוש הספרות בגב הכרטיס הן 123', 3, 'personal'],
  // from the phone test: a word inside a word is not the word, and "שהייתי" is not a name
  ["הטלפון חשב שמחובר רמקול בלוטות' זר", 0, 'personal'], ['תודה, זה בדיוק מה שהייתי צריכה', 0, 'personal'], ['החוב של משה עוד לא שולם', 2, 'personal']];
const got = C.map(([t]) => classify(t));
const right = C.filter((c, i) => got[i].sens === c[1]).length, under = C.filter((c, i) => c[1] >= 2 && got[i].sens < c[1]);
ok(right / C.length >= 0.95, `classification: sensitivity right on ${right} of ${C.length}` + (right / C.length < 0.95 ? '\n  ' + C.map((c, i) => got[i].sens !== c[1] ? c[0] + ' → ' + got[i].sens + ' (צפוי ' + c[1] + ')' : '').filter(Boolean).join('\n  ') : ''));
ok(under.length === 0, 'classification: a sensitive sentence classified lower: ' + under.length + (under.length ? ' - ' + under.map(c => c[0]).join(' | ') : ''));
const sc = C.filter((c, i) => got[i].scope === c[2]).length;
ok(sc / C.length >= 0.85, `classification: scope right on ${sc} of ${C.length}` + (sc / C.length < 0.85 ? '\n  ' + C.map((c, i) => got[i].scope !== c[2] ? c[0] + ' → ' + got[i].scope : '').filter(Boolean).join('\n  ') : ''));
// redaction: 60 must be cut
const MUST = [];
for (const n of ['123456782', '000000018', '039337423', '311111110', '012345674']) MUST.push('מספר הזהות שלו ' + n, 'ת"ז ' + n + ' של הבחור');
for (const p of ['052-1234567', '0521234567', '054 765 4321', '+972-52-1234567', '03-5551234', '02-6789012', '077-5556677', '058-9998877']) MUST.push('תתקשר ל ' + p, 'הטלפון שלו ' + p + ' עד הערב');
for (const c of ['4580 1234 5678 9014', '4111111111111111', '5326-1000-0000-0005', '4580-0000-0000-0000']) MUST.push('תשלם בכרטיס ' + c);
for (const a of ['12-345-678901', '12-345-12345', '987654321']) MUST.push('תעביר לחשבון ' + a, 'חשבון מספר ' + a + ' בבנק');
MUST.push('IL62 0108 0000 0009 9999 999 זה החשבון', 'שלח ל-IL620108000000099999999');
for (const e of ['meir@example.com', 'a.b+c@gmail.co.il', 'office@yeshiva.org']) MUST.push('תכתוב ל ' + e, 'המייל ' + e);
for (const d of ['12.5.1978', '3/11/2001', '28.02.65']) MUST.push('הוא נולד ב-' + d, 'תאריך לידה ' + d);
for (const a of ['רחוב הרב קוק 12', 'רח\' הנביאים 40', 'שדרות ירושלים 7']) MUST.push('הכתובת ' + a + ' דירה שתיים', 'תשלח ל' + a);
MUST.push('תעודת זהות 21003459', 'הסיסמה לאשראי ומספר הכרטיס 4580 1234 5678 9014', 'ח"ן 123456 בבנק הדואר', 'נולדה ב 1.1.1990');
while (MUST.length > 60) MUST.pop();
const PASS = ['יש לי 3 פגישות מחר', 'תכין 25 עותקים של הדוח', 'הגג עולה 45000 שקל', 'השנה 2026 הייתה קשה', 'חדר 12 פנוי', 'בשעה 14:30 ישיבת צוות',
  'תזמין 150 מנות לשבת', 'הוא בן 17', 'גרסה 3.34.0 עלתה', 'פרק 23 בתהילים', 'יש 480 תלמידים', 'תדפיס 1000 דפים', 'הקוד של המשימה t-4512', 'הזמנה מספר 88123',
  'בעוד 45 דקות', 'שולחן 7 ליד החלון', 'אוטובוס 480 לבני ברק', 'הוא מחזור 5', 'סעיף 12 בחוזה', 'עמוד 345 בספר', 'דף 2 מתוך 9', 'מחיר 99.90', 'שעה 8 בבוקר',
  'תרשום 123 שקלים', 'ביום 5 לחודש', 'הרבעון השלישי של 2026', 'בניין 4 קומה 3', 'כיתה ט 2', 'חמישה בחורים ו-6 רמים', 'יש 12345 צפיות', 'מספר 7 בתור',
  'המספר הסידורי A-2291', 'גרסה 71 של האפליקציה', 'המשימה 4012 תקועה', 'ביקור ב-10:15', 'תאריך 12.5 בלי שנה', 'ערב ה-12.5', 'ב-3/11 יש מבחן', 'פגישה ב 28.02',
  'החדר של הרב 12', 'הוא קנה 2 כרטיסים', 'חשבון נפש לפני ראש השנה', 'החשבון של החשמל הגיע', 'עשיתי חשבון שזה לא משתלם', 'רחוב ראשי בלי מספר',
  'תקציב 250000 לשנה', 'יש 9 משימות פתוחות', '123456789 זה לא מספר תקין', '111111111', 'הרבעון 2026-3', 'הקבלה 45-12', 'אתר liba.example', 'שולחן 123456',
  'כתובת האתר בלי מייל', 'שבע ושמונה', 'שעתיים וחצי', 'מאה אחוז', 'עשרים ושלושה בחורים', 'תודה רבה', 'בסדר גמור'];
while (PASS.length > 60) PASS.pop();
const cut = MUST.filter(t => redact(t).hits.length > 0), missed = MUST.filter(t => !redact(t).hits.length);
const fa = PASS.filter(t => redact(t).hits.length > 0);
ok(MUST.length === 60 && cut.length / 60 >= 0.95, `redaction: ${cut.length} of ${MUST.length} cut` + (missed.length ? ' - missed: ' + missed.join(' | ') : ''));
ok(PASS.length === 60 && fa.length <= 2, `redaction: ${fa.length} false alarms of ${PASS.length}` + (fa.length ? ': ' + fa.map(t => t + ' → ' + redact(t).out).join(' | ') : ''));
const m = new Map(); const a = redact('תתקשר ל 052-1234567 ואחר כך שוב ל 0521234567', m), b = redact('המספר 052-1234567', m);
ok(a.out === 'תתקשר ל טלפון-1 ואחר כך שוב ל טלפון-1' && b.out === 'המספר טלפון-1', 'redaction: the same number is the same pseudonym, across sentences: ' + a.out);
// egress: 9 channels x 24 classifications against a table written here
const SCOPES = ['personal', 'institution', 'system'], SUBJ = ['self', 'third-party'], MAX = { voice: 3, relay: 3, 'db:turns': 3, 'db:decisions': 3, 'db:crashes': 1, bridge: 3, 'open-url': 0, notification: 1, 'public-beacon': 0 };
let cells = 0, green = 0; const bad = [];
for (const ch of Object.keys(MAX)) for (const scope of SCOPES) for (const subject of SUBJ) for (let sens = 0; sens <= 3; sens++) { cells++;
  const r = egressDecide(ch, { text: 'x', cls: { scope, subject, sens } }, new Map());
  const want = sens <= MAX[ch] ? 'allow' : ch === 'notification' ? 'pointer' : ch === 'db:crashes' ? 'allow-redacted' : 'deny';
  const is = !r.allow ? 'deny' : r.reason === 'pointer' ? 'pointer' : sens > MAX[ch] ? 'allow-redacted' : 'allow';
  if (want === is || (want === 'allow-redacted' && is === 'deny')) green++; else bad.push(ch + '/' + scope + '/' + subject + '/' + sens + ': ' + is); }
ok(cells === 216 && green === cells, `egress matrix: ${green}/${cells}` + (bad.length ? ' - ' + bad.slice(0, 5).join(', ') : ''));
ok(!egressDecide('mail', { text: 'שלום' }).allow && !egressDecide('sms', { text: 'שלום' }).allow, 'egress: a channel not in the table is closed (mail, sms)');
ok(!egressDecide('open-url', { text: 'https://github.com/x?q=' + encodeURIComponent('החוב של משה') }).allow && egressDecide('open-url', { text: 'https://github.com/x' }).allow, 'egress: a link carries no content in its address');
const rl = egressDecide('relay', { text: 'תעביר לחשבון 12-345-678901, ותתקשר ל 052-1234567' }, new Map());
ok(rl.allow && /חשבון-1/.test(rl.payload.text) && /052-1234567/.test(rl.payload.text), 'egress: to Claude the account number leaves as a pseudonym, the phone stays (the brain may need to call): ' + rl.payload.text);
const nt = egressDecide('notification', { text: 'הילד של משה מאושפז' });
ok(nt.allow && nt.payload.text === 'יש הודעה אישית', 'egress: a lock-screen notification of something sensitive says only that there is one');
console.log(fails ? `\n${fails} נכשלו` : '\nכל הבדיקות עברו'); process.exit(fails ? 1 : 0);
