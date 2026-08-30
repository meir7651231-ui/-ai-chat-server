#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  match.mjs — מנוע-האחזור של המחולל (למידה-מהאטומים, אפס-כללים-ידניים)
//  כל אטום-ווידג'ט נלמד מהתיאור-העברי שבכותרת-המקור שלו (atlas.he).
//  בקשה חופשית ⇒ טוקנים-מנורמלים ⇒ ציון stem∩ + IDF (נלמד מהקורפוס) ⇒ אטום.
//  אין מיפוי מילה→אטום כתוב-ביד. הידע כולו מהאטומים עצמם.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';

const HERE = new URL('.', import.meta.url).pathname;
const readJson = (p, d) => { try { return JSON.parse(fs.readFileSync(path.join(HERE, p), 'utf8')); } catch { return d; } };

const atlas = readJson('atlas.json', { widgets: [] });

// stemming עברי קליל (מנגנון-שפה טהור): קידומת-חיבור (ב/ל/ה/ו/מ/ש/כ) + סיומת (ים/ות/יות/ת/ה/י)
export const stem = (w) => w.replace(/^[בלהומשכ](?=..)/, '').replace(/(יות|ים|ות)$/, '').replace(/[התי]$/, '');
const heTokens = (s) => [...(s || '').matchAll(/[֐-׿]{2,}/g)].map((m) => stem(m[0])).filter((w) => w.length > 1);

// אינדקס: כל ווידג'ט → קבוצת-גזעים מהתיאור-העברי שלו. IDF נלמד מהמדף.
const WIDGETS = atlas.widgets.map((w) => ({ cls: w.cls, file: w.file, st: [...new Set((w.he || []).map(stem))] })).filter((w) => w.st.length);
const df = new Map();
for (const w of WIDGETS) for (const t of w.st) df.set(t, (df.get(t) || 0) + 1);
const N = WIDGETS.length || 1;
const idf = (t) => Math.log((N + 1) / ((df.get(t) || 0) + 1)) + 1;

// אחזור: מחזיר ווידג'טים מדורגים לפי חפיפת-משמעות עם הביטוי.
export function retrieve(phrase, top = 5) {
  const q = [...new Set(heTokens(phrase))];
  const qn = q.length || 1;
  return WIDGETS
    .map((w) => {
      let s = 0, m = 0;
      for (const t of q) if (w.st.includes(t)) { s += idf(t); m++; }
      // כיסוי: איזה חלק מהביטוי באמת נגע באטום (1/5 = מסגור מקרי; 2/2 = בקשת-וידג'ט אמיתית)
      return { cls: w.cls, file: w.file, s: +s.toFixed(2), m, cover: +(m / qn).toFixed(2) };
    })
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, top);
}

export const best = (phrase, min = 1.5) => { const r = retrieve(phrase, 1)[0]; return r && r.s >= min ? r : null; };

// מיפוי חלק-מפורק (שם-מחלקה אנגלי כמו '_MetricGrid') לאטום-קטלוג לפי חפיפת-מילות-מחלקה.
// טהור: נגזר משמות-המחלקות של הקטלוג בלבד. משמש את ההרכבה-ההפוכה (compose).
const clsWords = (cls) => cls.replace(/^_+/, '').replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase().split(/\s+/).filter(Boolean);
const WCLS = atlas.widgets.map((w) => ({ cls: w.cls, words: clsWords(w.cls) }));
export function matchClass(name) {
  const q = clsWords(name);
  const r = WCLS.map((w) => { let s = 0; for (const t of q) if (w.words.includes(t)) s++; return { cls: w.cls, s }; })
    .filter((x) => x.s > 0).sort((a, b) => b.s - a.s)[0];
  return r || null;
}

// ── CLI: בדיקת-אחזור מהירה ──
if (import.meta.url === 'file://' + process.argv[1]) {
  const q = process.argv.slice(2).join(' ');
  if (!q) { console.log('שימוש: node match.mjs "<ביטוי>"'); process.exit(0); }
  console.log(`🔎 "${q}" · נלמד מ-${N} אטומים`);
  for (const r of retrieve(q, 6)) console.log(`   ${r.s}\t${r.cls}`);
}
