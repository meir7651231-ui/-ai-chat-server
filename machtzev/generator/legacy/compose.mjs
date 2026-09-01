#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  compose.mjs — ההרכבה-ההפוכה של המחולל (הדקומפוזר, אחורה · טהור)
//  המפעל כבר פירק 254 מסכים-אמיתיים (screens-seed/machine/*.json) ורשם לכל
//  אחד: מבנה (composer/sectionMap) + משמעות (terms בעברית). ההרכבה = הפירוק
//  אחורה: בקשה ⇒ המסך-האמיתי-הדומה-ביותר (לפי terms) ⇒ המבנה-הרשום שלו ⇒
//  כל חלק ממופה לאטום-קטלוג (matchClass). אין הרכב כתוב-ביד — הוא נלמד מהפירוק.
//  מבחן-הקונכייה: מחליף מסכים ⇒ פירוק אחר ⇒ הרכבים אחרים לבד.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { stem, matchClass } from '../match.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const SEED = path.join(HERE, '../../screens-seed/machine');

const heStems = (s) => [...new Set([...(s || '').matchAll(/[֐-׿]{2,}/g)].map((m) => stem(m[0])).filter((w) => w.length > 1))];

// קורפוס-הפירוק: לכל מסך-אמיתי — משמעות (terms) + מבנה (composer/sectionMap/widgets).
const SCREENS = [];
try {
  for (const f of fs.readdirSync(SEED).filter((f) => f.endsWith('.json'))) {
    const s = JSON.parse(fs.readFileSync(path.join(SEED, f), 'utf8'));
    // מבנה = החלקים-המורכבים שהדקומפוזר רשם, בסדר: sectionMap → composer → תת-ווידג'טים.
    const parts = [
      ...(s.sectionMap || []).map((x) => x.widget),
      ...(s.composer || []),
      ...(s.widgets || []).filter((w) => /^_/.test(w.name)).map((w) => w.name),
    ].filter(Boolean);
    const uniq = [...new Set(parts)];
    if (!uniq.length) continue;
    SCREENS.push({ file: f.replace(/\.json$/, ''), st: heStems((s.terms || []).join(' ')), parts: uniq });
  }
} catch { /* אין קורפוס */ }

const df = new Map();
for (const sc of SCREENS) for (const t of sc.st) df.set(t, (df.get(t) || 0) + 1);
const N = SCREENS.length || 1;
const idf = (t) => Math.log((N + 1) / ((df.get(t) || 0) + 1)) + 1;

// מאחזר את המסך-האמיתי-הדומה-ביותר לבקשה, וממפה את מבנהו לאטומי-קטלוג.
export function board(text, cap = 8) {
  const q = heStems(text);
  const qn = q.length || 1;
  let best = null;
  for (const sc of SCREENS) {
    let s = 0, m = 0;
    for (const t of q) if (sc.st.includes(t)) { s += idf(t); m++; }
    if (s > 0 && (!best || s > best.s)) best = { ...sc, s: +s.toFixed(2), cover: +(m / qn).toFixed(2) };
  }
  if (!best) return null;
  // הרכבה-הפוכה: כל חלק-מבני → אטום-קטלוג לפי חפיפת-שם-מחלקה.
  const atoms = [];
  const seen = new Set();
  for (const p of best.parts) {
    const hit = matchClass(p);
    if (hit && !seen.has(hit.cls)) { seen.add(hit.cls); atoms.push(hit.cls); }
    if (atoms.length >= cap) break;
  }
  return atoms.length ? { screen: best.file, atoms, s: best.s, cover: best.cover, rawParts: best.parts.length } : null;
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const q = process.argv.slice(2).join(' ');
  console.log(`🧩 קורפוס-פירוק: ${SCREENS.length} מסכים-אמיתיים`);
  if (q) { const b = board(q); console.log(b ? `\n🔎 "${q}"\n   → פורק-מ: ${b.screen} (${b.s})\n   הרכב-מקטלוג: ${b.atoms.join(' · ')}` : `אין מסך תואם`); }
}
