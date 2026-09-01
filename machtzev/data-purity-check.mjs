#!/usr/bin/env node
// 🧪 שער-טוהר-דאטה (הכרעה 16) — סורק אטומי-מנגנון עם דאטה-צרובה ("מעורבים").
//    אינווריאנט: אין דאטה במנגנון. דאטה חיה רק באטומי-דאטה ייעודיים; מנגנון מקבל בשקע.
//    ratchet: baseline = החוב הקיים (מעורבים ידועים). אטום-מעורב **חדש** (לא ב-baseline) ⇒ FAIL.
//    החוב רק יורד: אטום שטוהר נגרע; אסור להוסיף. --gate יוצא 1 על הפרה · --baseline מרענן · --report מפרט.
import fs from 'node:fs';
import path from 'node:path';
const HERE = new URL('.', import.meta.url).pathname;
const ROOT = path.join(HERE, '../new');
const HEB = /[֐-׿]/;
const DIRS = ['dart-maor', 'dart', 'atoms'];
const BASELINE = path.join(HERE, 'data-purity-baseline.json');

// מעורב = יש ליטרל-עברי (לא-תגובה) + זהו מנגנון (control-flow: if/for/while/switch/?: או ריבוי-משפטים),
//         ולא אטום-דאטה טהור (const/getter/פונקציה-שמחזירה-ליטרל בלבד).
function isMixed(src) {
  // הפשטת-הערות מלאה: גם הערות-זנב (guard נגד :// ונגד // בתוך מחרוזת); מחרוזות JS/Dart
  // הן חד-שורתיות ⇒ ‎\n שובר זוג-מרכאות — גרשיים בהערה (הו"ק/ת"ז) אינם פותחים מחרוזת.
  let code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/\/?.*$/gm, '').replace(/(^|[^:'"])\/\/[^\n]*/gm, '$1');
  // סימטריית-regex: תבנית-RegExp היא לוגיקת-ההתאמה עצמה (ב-JS ליטרל-regex פטור מטבעו;
  // ב-Dart אותה תבנית עטופה במחרוזת) — עברית בתוך ארגומנט-RegExp איננה דאטה-תצוגה.
  code = code.replace(/RegExp\(\s*r?('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, "RegExp('");
  // מפתח-עברי שקושר-שקע ('ך': T['k1']!) = חיווט, לא דאטה — הערך חי באטום-הדאטה
  // (מקביל ל-{ ך: T.k1 } בצד-ה-JS, שם המפתח אינו מחרוזת כלל).
  code = code.replace(/'[֐-׿]{1,3}'(?=\s*:\s*T\[)/g, "'k'");
  let heb = false;
  for (const m of code.matchAll(/['"]([^'"\\\n]{0,160})['"]/g)) if (HEB.test(m[1])) { heb = true; break; }
  if (!heb) return false;
  // צורת-דאטה-טהורה: Dart (const מוקלד/getter/פונקציה-מחזירת-ליטרל) או JS (export const = ליטרל) — הכרעה 19
  // סימטריית-JS⇄Dart: גם ‏const-מחרוזת ב-Dart היא צורת-דאטה-טהורה (כמו export const '...' ב-JS)
  const pureData = /^\s*(const\s+[\w<>,\s?]+\s+\w+\s*=\s*(?:[\[{]|['"])|[\w<>,\s?]+\s+get\s+\w+\s*=>\s*(?:const\s+)?(?:[\[{]|['"])|[\w<>,\s?]+\s+\w+\(\)\s*(?:=>\s*|\{\s*return\s+)(?:const\s+)?[\[{]|export\s+(?:const\s+\w+\s*=\s*(?:[\[{]|-?\d|['\"])|function\s+\w+\s*\(\)\s*\{\s*return\s+[\[{]))/m.test(code)
    && !/\b(if|for|while|switch)\b/.test(code);
  return !pureData;
}

function scan() {
  const mixed = [];
  for (const dir of DIRS) {
    const abs = path.join(ROOT, dir); if (!fs.existsSync(abs)) continue;
    for (const f of fs.readdirSync(abs)) {
      if (!/\.(dart|mjs)$/.test(f) || /_test|\.contract\.|\.test\./.test(f)) continue;
      if (isMixed(fs.readFileSync(path.join(abs, f), 'utf8'))) mixed.push(`${dir}/${f.replace(/\.(dart|mjs)$/, '')}`);
    }
  }
  return mixed.sort();
}

const arg = process.argv[2] || '--gate';
const cur = scan();

if (arg === '--baseline') {
  fs.writeFileSync(BASELINE, JSON.stringify(cur, null, 0));
  console.log(`baseline נכתב: ${cur.length} מעורבים (חוב-מנוהל).`);
} else if (arg === '--report') {
  console.log(`מעורבים כרגע: ${cur.length}`);
  cur.forEach((a) => console.log('  ⚠️ ' + a));
} else { // --gate
  const base = fs.existsSync(BASELINE) ? new Set(JSON.parse(fs.readFileSync(BASELINE, 'utf8'))) : new Set();
  const fresh = cur.filter((a) => !base.has(a));           // מעורב-חדש = הפרה
  if (fresh.length) {
    console.error(`✗ שער-טוהר-דאטה: ${fresh.length} אטומי-מנגנון-מעורבים חדשים (הכרעה 16 — אסור דאטה במנגנון):`);
    fresh.slice(0, 20).forEach((a) => console.error('   + ' + a));
    console.error(`   טהר (עברית→מטרה+terms) או, אם זה אטום-דאטה אמיתי, נרמל לצורת-דאטה טהורה.`);
    process.exit(1);
  }
  console.log(`✓ שער-טוהר-דאטה: אפס מעורב-חדש · חוב-מנוהל ${cur.length}/${base.size} (רק יורד — הכרעה 16)`);
}
