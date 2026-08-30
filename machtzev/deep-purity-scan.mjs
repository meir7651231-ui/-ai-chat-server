#!/usr/bin/env node
/** 🔬 מחצב · סורק-טוהר-עומק (הכרעה 19: גם קבועים ושמות-דומיין הם דאטה).
 *  סורק כל אטום-מנגנון ב-new/atoms ומסווג הפרות:
 *    heb    — ליטרל-עברי בקוד (דאטה-תצוגה במנגנון)
 *    table  — טבלה/מערך/אובייקט קבוע בגוף (דאטת-דומיין מוטמעת, כמו ['pickup',...])
 *    domstr — מחרוזת-דומיין לטינית (שמות, קידומות, כתובות — 'maor_...', '972', 'wa.me')
 *    magic  — מספר-קסם (קבוע-דומיין מספרי; 0/1/2/־1 מבניים מוחרגים)
 *  אטום-דאטה טהור (צורת-דאטה) אינו הפרה — הוא הבית הנכון של דאטה.
 *  פלט: machtzev/emit/DEEP-PURITY-FINDINGS.md ממוין לפי חומרה + סיכום למסוף. */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = new URL('../', import.meta.url).pathname;
const DIRS = ['new/atoms', 'new/boxes'];
const HEB = /[֐-׿]/;
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
// צורת-דאטה: הכרזת-ליטרל ברמת-המודול בלבד (עמודה 0) — const מוזח בתוך פונקציה איננו אטום-דאטה
const isPureData = (code) => {
  // בדיקת-הצורה על שלד-הקוד — תוכן-מחרוזות ממוסך ("for"/"if" בתוך ערך אינם זרימת-בקרה)
  const skel = code.replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, '""');
  return (/^export\s+(?:const\s+\w+\s*=\s*(?:[\[{]|-?\d|['"])|function\s+\w+\s*\(\)\s*\{\s*return\s+[\[{])/m.test(skel) ||
    /^const\s+\w+\s*=\s*[\[{]/m.test(skel)) &&
  !/\b(if|for|while|switch)\b/.test(skel) && !/=>(?!\s*[\[{('"`0-9])/.test(skel) &&
  !/^(?:export\s+)?(?:const\s+\w+\s*=\s*(?:async\s*)?\(|function\s+\w+\s*\()/m.test(skel);
};
const findings = [];
for (const dir of DIRS) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const f of fs.readdirSync(abs)) {
    if (!f.endsWith('.mjs') || f.endsWith('.test.mjs')) continue;
    const raw = fs.readFileSync(path.join(abs, f), 'utf8');
    const code = strip(raw);
    if (isPureData(code)) continue;                       // אטום-דאטה בצורתו הנכונה
    const cats = { heb: [], table: [], domstr: [], magic: [] };
    for (const m of code.matchAll(/(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g)) {
      const v = m[2];
      if (HEB.test(v)) { if (cats.heb.length < 4) cats.heb.push(v.slice(0, 30)); continue; }
      if (/[a-zA-Z]{3,}|^\+?\d{3}$/.test(v) && !/^[a-z]$|^\\/.test(v)) { if (cats.domstr.length < 4) cats.domstr.push(v.slice(0, 30)); }
    }
    for (const m of code.matchAll(/const\s+\w+\s*=\s*[\[{][^;]{10,}/g)) { if (cats.table.length < 3) cats.table.push(m[0].slice(0, 44).replace(/\s+/g, ' ')); }
    // מספר-קסם = קבוע-דומיין עשרוני; הקס/ביטוויז/חזקות-2 = מבנה-חישוב, לא דאטה
    for (const m of code.matchAll(/(?<![\w.'"])-?\d{2,}(?:\.\d+)?(?![\w])/g)) {
      const n = Math.abs(parseFloat(m[0]));
      const around = code.slice(Math.max(0, m.index - 6), m.index + m[0].length + 6);
      if (/0x|[&|^]|<<|>>/.test(around)) continue;                       // ביטוויז/הקס — מבני
      if ((n & (n - 1)) === 0 && Number.isInteger(n)) continue;          // חזקת-2 — מבני
      if (![10, 100, 1000].includes(n) || cats.magic.length === 0) { if (cats.magic.length < 6) cats.magic.push(m[0]); }
    }
    const score = cats.heb.length * 4 + cats.table.length * 3 + cats.domstr.length * 2 + cats.magic.length;
    if (score > 0) findings.push({ f: path.join(dir, f), score, cats });
  }
}
findings.sort((a, b) => b.score - a.score);
const BASELINE = path.join(ROOT, 'machtzev/deep-purity-baseline.json');
const arg = process.argv[2] || '--report';
if (arg === '--baseline') {
  fs.writeFileSync(BASELINE, JSON.stringify(findings.map(x => x.f).sort(), null, 0));
  console.log(`baseline טוהר-עומק נכתב: ${findings.length} אטומים (חוב-מנוהל).`);
} else if (arg === '--gate') {
  const base = fs.existsSync(BASELINE) ? new Set(JSON.parse(fs.readFileSync(BASELINE, 'utf8'))) : new Set();
  const fresh = findings.filter(x => !base.has(x.f));
  if (fresh.length) {
    console.error(`✗ שער-טוהר-עומק: ${fresh.length} אטומים חדשים עם דאטה-במנגנון (הכרעה 19 — קבועים ושמות-דומיין = דאטה):`);
    fresh.slice(0, 20).forEach(x => console.error(`   + ${x.f} (ציון ${x.score})`));
    console.error('   פרק לפי תבנית-הלוח: מנגנון-עיוור + אטום-דאטה + חיווט-בקופסה (heb-cal-box).');
    process.exit(1);
  }
  console.log(`✓ שער-טוהר-עומק: אפס זיהום-חדש · חוב-מנוהל ${findings.length}/${base.size} (רק יורד — הכרעה 19)`);
} else { // --report
  const lines = ['# 🔬 ממצאי טוהר-עומק (הכרעה 19) — דאטה בתוך מנגנון', '',
    `נסרקו אטומי-מנגנון ב-${DIRS.join(' · ')} · הפרות: ${findings.length}`, '',
    '| אטום | ציון | עברית | טבלאות | מחרוזות-דומיין | מספרי-קסם |', '|---|---|---|---|---|---|'];
  for (const x of findings) lines.push(`| ${x.f} | ${x.score} | ${x.cats.heb.join(' · ') || '—'} | ${x.cats.table.join(' · ') || '—'} | ${x.cats.domstr.join(' · ') || '—'} | ${x.cats.magic.join(' ') || '—'} |`);
  fs.mkdirSync(path.join(ROOT, 'machtzev/emit'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'machtzev/emit/DEEP-PURITY-FINDINGS.md'), lines.join('\n') + '\n');
  const t = { heb: 0, table: 0, domstr: 0, magic: 0 };
  for (const x of findings) for (const k in t) if (x.cats[k].length) t[k]++;
  console.log(`🔬 טוהר-עומק: ${findings.length} אטומים עם דאטה-במנגנון · עברית:${t.heb} · טבלאות:${t.table} · דומיין:${t.domstr} · קסם:${t.magic}`);
  console.log('   הדוח: machtzev/emit/DEEP-PURITY-FINDINGS.md');
}
