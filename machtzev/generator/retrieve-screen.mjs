// retrieve-screen.mjs — הכיוון-ההפוך (§23 · צעד-12): צורך ⇒ מסך-המקור-הכי-קרוב, לפי-מטרה.
// המטרה של כל מסך = הטקסט-העברי-האמת שבתוכנו (screens__*_content.dart). ניקוד IDF על חפיפת-מונחים
// (stem משותף עם match). אפס-מילון-דומייני · אפס-שפה-מומצאת — רק התאמה לקורפוס-המסכים הרשום.
import fs from 'node:fs';
import path from 'node:path';

const DIR = new URL('../../new/dart-data-bs/auto/', import.meta.url).pathname;
const HE = /[֐-׿][֐-׿״׳]*/g;
// נרמול-**עדין** (לא ה-stem ההורס): הגדרה-בלבד (מה/ה) + נטרול-סופיות. אותיות-שורש (מ/ש/ל/ב)
// נשמרות ⇒ מלאי/מסך/שיחות/לוח לא נהרסים. עיוור-דומיין, מבני.
const definalize = (s) => String(s).replace(/ך/g, 'כ').replace(/ם/g, 'מ').replace(/ן/g, 'נ').replace(/ף/g, 'פ').replace(/ץ/g, 'צ');
const norm = (w) => { let s = definalize(w); if (/^מה../.test(s)) s = s.slice(2); else if (/^ה./.test(s) && s.length > 2) s = s.slice(1); return s; };
// מילות-פונקציה/חלקיקים + מילות-מסגרת של הצורך ("מסך/רוצה/צריך") — רעש, לא מטרה. מבני, לא מילון-דומייני.
const STOP = new Set(['של', 'עמ', 'את', 'או', 'גמ', 'אני', 'צריכ', 'רוצה', 'מסכ', 'זה', 'יש', 'על', 'לי', 'כל', 'הזה', 'שמציג', 'לנהל', 'לראות', 'עמוד', 'בשביל']);
const toks = (s) => (String(s).match(HE) || []).map(norm).filter((w) => w.length > 1 && !STOP.has(w));

function loadScreens() {
  const byScreen = {};
  for (const f of fs.readdirSync(DIR)) {
    const m = f.match(/^screens__(.+?)_content2?\.dart$/);
    if (!m) continue;
    const strs = [...fs.readFileSync(path.join(DIR, f), 'utf8').matchAll(/'([^']*)'/g)].map((x) => x[1]).join(' ');
    (byScreen[m[1]] ??= []).push(...toks(strs));
  }
  return byScreen;
}

function buildIdf(byScreen) {
  const N = Object.keys(byScreen).length, df = {};
  for (const words of Object.values(byScreen)) for (const w of new Set(words)) df[w] = (df[w] || 0) + 1;
  const idf = {};
  for (const w in df) idf[w] = Math.log(N / df[w]);
  return idf;
}

export function retrieveScreen(need, top = 3) {
  const byScreen = loadScreens();
  const IDF = buildIdf(byScreen);
  const q = new Set(toks(need));
  const scored = [];
  for (const [name, words] of Object.entries(byScreen)) {
    const set = new Set(words);
    let s = 0, hits = [];
    for (const w of q) if (set.has(w)) { s += IDF[w] || 0; hits.push(w); }
    scored.push({ name, score: +s.toFixed(2), hits });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, top);
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const need = process.argv.slice(2).join(' ');
  if (!need) { console.error('שימוש: node retrieve-screen.mjs "<צורך>"'); process.exit(1); }
  for (const r of retrieveScreen(need, 3)) console.log(`  ${r.score.toString().padStart(6)}  ${r.name}   [${r.hits.join(' ')}]`);
}
