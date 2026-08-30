#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  nl.mjs — שכבת-הבנת-שפה של המחולל (דלת-כניסה חופשית)
//  תיאור בעברית חופשית ⇒ זיהוי-כוונות ⇒ ספק למחולל. אם אין התאמה מדויקת:
//  נופל לקרוב-ביותר / כללי — כך שתמיד מגיעים לתצוגה (אף פעם לא ריק).
//  שימוש:  node nl.mjs "מסך כניסה עם רקע מטורף, שני כפתורים, וגרף מכירות"
//  אפס-דאטה במנגנון: מפת-הכוונות בקובץ knowledge/intents.json.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const HERE = new URL('.', import.meta.url).pathname;
const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return d; } };

// מפת-כוונות: ביטוי (regex) ⇒ מילת-צורה של המחולל + ארגומנטים-ברירת-מחדל.
// נטענת מקובץ-ידע; חסר ⇒ ברירת-מחדל מובנית (כדי שהמנוע ירוץ עצמאית).
const INTENTS = readJson(path.join(HERE, 'knowledge/intents.json'), { rules: DEFAULT_RULES() }).rules
  .map(r => ({ re: new RegExp(r.re), word: r.word, args: r.args || '', multi: !!r.multi, ph: r.ph || r.word }));

const COUNT = { 'שני': 2, 'שתי': 2, 'שלוש': 3, 'שלושה': 3, 'ארבע': 4, 'ארבעה': 4, 'חמישה': 5, 'כמה': 3, 'מספר': 2, 'הרבה': 4 };

function interpret(text) {
  const lines = [];
  const trace = [];
  // כותרת: נגזרת מהמשפט (מסירים פעלים פותחים)
  let title = (text.split(/[.,\n]/)[0] || 'המסך שלי')
    .replace(/^\s*(בנה|תבנה|אני רוצה|רוצה|צור|תעשה|עשה|הכן|תכין)\s*(לי)?\s*(מסך|דף|עמוד|אפליקצי[הת])?\s*(של|עם)?\s*/,'')
    .trim().slice(0, 40) || 'המסך שלי';
  lines.push(`הירו 🎯 ${title} | נבנה מתיאור חופשי`);

  const seen = new Set();
  for (const it of INTENTS) {
    if (!it.re.test(text) || seen.has(it.word)) continue;
    seen.add(it.word);
    if (it.multi) {
      let n = 1;
      for (const w in COUNT) if (text.includes(w)) { n = COUNT[w]; break; }
      if (/כפתורים|לחצנים/.test(text) && n < 2) n = 2;
      for (let i = 0; i < n; i++) lines.push(`${it.word} ${it.args} ${['המשך','עוד','פעולה','שלח','סיום'][i] || 'פעולה'}`);
      trace.push(`«${it.ph}»${n>1?' ×'+n:''} → ${it.word}`);
    } else {
      lines.push(`${it.word} ${it.args} ${it.ph}`.trim());
      trace.push(`«${it.ph}» → ${it.word}`);
    }
  }

  // 🔁 שער-התצוגה: אם כמעט כלום זוהה — לא נכשל, מרכיב ממה שיש:
  //    כל פסקה בתיאור שלא מופתה הופכת ל'כותרת' (טקסט חי), + כרטיס-ברירת-מחדל.
  const contentParts = lines.filter(l => !l.startsWith('הירו')).length;
  if (contentParts === 0) {
    trace.push('אין התאמה מדויקת → מרכיב מהקרוב-ביותר');
    // פיצול לפסקאות-משמעות: פיסוק או ו'-חיבור (רווח לפני), לא ו' באמצע-מילה
    for (const seg of text.split(/[,.\n]|\s+ו|\s+עם\s+/).map(s => s.trim()).filter(s => s.length > 2).slice(0, 4)) {
      lines.push(`כותרת ${seg.slice(0, 30)}`);
    }
    lines.push('מחירון 240 מה שיש לנו | הרכבה מהקטלוג');
  }

  lines.push('באנר המחולל הבין את התיאור ובחר את האטומים לבד');
  return { spec: lines.join('\n'), trace, title };
}

// ── CLI ──
const text = process.argv.slice(2).join(' ').trim();
if (!text) { console.error('שימוש: node nl.mjs "<תיאור חופשי>"'); process.exit(1); }
const { spec, trace, title } = interpret(text);
console.log('🧠 המחולל הבין:');
for (const t of trace) console.log('   ' + t);
console.log('\n📋 הספק שנגזר:');
console.log(spec.split('\n').map(l => '   ' + l).join('\n'));
// מריץ את המחולל על הספק (הרכבה אמיתית)
fs.writeFileSync(path.join(HERE, 'specs/nl.txt'), spec + '\n');
console.log('\n▶ מריץ את המחולל...');
const out = execFileSync('node', [path.join(HERE, 'genesis-gen.mjs'), 'nl', spec], { encoding: 'utf8' });
console.log(out.split('\n').filter(l => /nl ·/.test(l)).join('\n'));

// מפת-ברירת-המחדל המובנית (אם intents.json חסר)
function DEFAULT_RULES() {
  return [
    { re: 'חלקיק|ניצוצ', word: 'חלקיקים', args: '200 90 2', ph: 'חלקיקים' },
    { re: 'קונפט|חגיג|פיצוץ|מסיב', word: 'פיצוץ', args: '200 80 2', ph: 'חגיגה' },
    { re: 'גנרטיב|תבנית|רעש', word: 'רעש', args: '200 16', ph: 'שדה גנרטיבי' },
    { re: 'רקע|אורות|נושם|מטורף|קוסמ|אנימצ|אפקט|חלל|גלקסי', word: 'גל', args: '200 60 2', ph: 'רקע מונפש' },
    { re: 'עוגה|פילוח|נתח|התפלגות', word: 'עוגה', args: '150 5', ph: 'תרשים-עוגה' },
    { re: 'עמודות|השווא|היסטוגר', word: 'עמודות', args: '150 7', ph: 'תרשים-עמודות' },
    { re: 'מד |מחוג|ביצוע', word: 'מד', args: '160', ph: 'מד' },
    { re: 'רדאר|עכביש', word: 'רדאר', args: '170 6', ph: 'מכ"ם' },
    { re: '(?<![א-ת])לוח|קלנדר|יומן', word: 'לוח', args: '150', ph: 'לוח-חודש' },
    { re: 'גרף|תרשים|מגמ|מכיר|הכנס|נתונ|סטטיסט|דוח|אנליט', word: 'מגמה', args: '130 20', ph: 'גרף-מגמה' },
    { re: 'מחיר|תמחור|מנוי|חביל|מסלול', word: 'מחירון', args: '260', ph: 'כרטיס-מחירון' },
    { re: 'פרופיל|משתמש|חשבון|עובד|אווטאר', word: 'פרופיל', args: '230', ph: 'כרטיס-פרופיל' },
    { re: 'מזג|אוויר|טמפרט|תחז', word: 'מזג', args: '160', ph: 'כרטיס-מזג' },
    { re: 'חיפוש|לחפש|סרצ', word: 'חיפוש', args: '52', ph: 'שדה-חיפוש' },
    { re: 'שדה|טופס|הזנ|הקלד|אימייל|מייל|טלפון|סיסמ|שם מלא', word: 'מיקוד', args: '52', ph: 'שדה-קלט' },
    { re: 'מתג|טוגל|התראות|הפעל', word: 'נדנדה', args: '40', ph: 'מתג' },
    { re: 'דירוג|כוכב|ביקור|לדרג|חוות', word: 'כוכבים', args: '44 5', ph: 'דירוג-כוכבים' },
    { re: 'מחוון|עוצמ|ווליום|בהירות|טווח|סליידר', word: 'מחוון', args: '40', ph: 'מחוון' },
    { re: 'טעינ|ספינר|טוען|loading|מסתובב', word: 'טוען', args: '60', ph: 'ספינר-טעינה' },
    { re: 'התקדמ|פרוגר|סרגל', word: 'סרגל', args: '44', ph: 'סרגל-התקדמות' },
    { re: 'התרא|הודע|הצלח|שגיא|נשמר|אישור', word: 'התראה', args: '52', ph: 'פס-התראה' },
    { re: 'סטטוס|מחובר|אונליין|זמין', word: 'סטטוס', args: '44', ph: 'נקודת-סטטוס' },
    { re: 'כיתוב|טקסט גדול|לוגו', word: 'כיתוב', args: '60', ph: 'כיתוב-גרדיאנט' },
    { re: 'לשוני|טאב', word: 'לשוניות', args: '44: בית / פרופיל / הגדרות', ph: 'לשוניות' },
    { re: 'אקורדיון|שאלות|faq', word: 'אקורדיון', args: '48: שאלה ראשונה / שאלה שנייה', ph: 'אקורדיון' },
    { re: 'קרוסל|סליידשו', word: 'קרוסלה', args: '150: ראשונה / שנייה / שלישית', ph: 'קרוסלה' },
    { re: 'טבל|רשימ', word: 'טבלה', args: '30 5', ph: 'טבלה' },
    { re: 'כפתור|לחצן|cta|שגר|התחל|הרשמ|הצטרפ|קנ[הות]|הזמ|כניס|לחצ', word: 'ניאון', args: '54', ph: 'כפתור', multi: true },
  ];
}
