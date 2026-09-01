#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  teach.mjs — למידה-מהשימוש: קושר מילה/ביטוי לאטום (דאטה, לא מנוע).
//  המשתמש מלמד פעם אחת ⇒ המילה נכנסת לאוצר-המילים של האטום (learned.json)
//  ⇒ match.mjs מתייחס אליה כמו לכותרת. אפס-האכלה-שלי, אפס-תלות-חיצונית.
//  שימוש:  node teach.mjs "עוגה" DonutChart
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';

const HERE = new URL('.', import.meta.url).pathname;
const LP = path.join(HERE, 'knowledge/learned.json');

export function teach(word, cls) {
  const atlas = JSON.parse(fs.readFileSync(path.join(HERE, 'atlas.json'), 'utf8'));
  if (!atlas.widgets.some((w) => w.cls === cls)) throw new Error(`אטום «${cls}» לא קיים בקטלוג`);
  const w = String(word).trim();
  if (!/[֐-׿]/.test(w)) throw new Error('המילה חייבת להיות בעברית');
  const doc = JSON.parse(fs.readFileSync(LP, 'utf8'));
  doc.bindings = doc.bindings || {};
  const list = doc.bindings[cls] || [];
  if (!list.includes(w)) list.push(w);
  doc.bindings[cls] = list;
  fs.writeFileSync(LP, JSON.stringify(doc, null, 2) + '\n');
  return { cls, word: w, total: Object.values(doc.bindings).flat().length };
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const [word, cls] = process.argv.slice(2);
  if (!word || !cls) { console.error('שימוש: node teach.mjs "<מילה>" <AtomClass>'); process.exit(1); }
  try {
    const r = teach(word, cls);
    console.log(`✅ נלמד: «${r.word}» ⇒ ${r.cls}  (סה"כ ${r.total} מילים-שנלמדו)`);
  } catch (e) { console.error('🚫 ' + e.message); process.exit(1); }
}
