#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  nl.mjs — דלת-הכניסה החופשית של המחולל (הבנה בלמידה-מהאטומים · טהור)
//  תיאור חופשי ⇒ פיצול-לביטויים ⇒ אחזור-אטום-לפי-משמעות (match.mjs) ⇒ ספק.
//  אפס דאטה במנגנון: אין רשימת-מילים, אין נרדפות, אין הרכב-קשיח, אין שמות-תחום.
//  כל הידע מהאטומים (atlas.he). מבחן-הקונכייה: מחליף קטלוג ⇒ לומד מחדש לבד.
//  שימוש:  node nl.mjs "רקע נושם, כרטיס פרופיל, גרף מגמה וטבלת נתונים"
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { retrieve } from './match.mjs';
import { board } from './compose.mjs';
import { teach } from './teach.mjs';

const HERE = new URL('.', import.meta.url).pathname;
const MIN = 1.5; // סף-אמון לאחזור

const heWords = (s) => [...(s || '').matchAll(/[֐-׿][֐-׿״׳]*/g)].map((m) => m[0]);
const cleanLabel = (s) => heWords(s).join(' ').slice(0, 34) || 'פריט';

function interpret(text) {
  const trace = [];
  const lines = [];
  const title = cleanLabel(text.split(/[.,\n]/)[0]).slice(0, 40) || 'המסך שלי';
  lines.push(`הירו 🎯 ${title} | נבנה מתיאור חופשי`);

  // (א) אחזור-רכיבים: אטום פר-ביטוי-משמעות בתיאור.
  const phrases = text.split(/[,.\n]|\s+ו|\s+עם\s+|\s*\+\s*/).map((s) => s.trim()).filter((s) => s.length > 1);
  const used = new Set();
  const comps = [];
  const gaps = []; // ביטויים שלא נמצא להם אטום — הזדמנות-למידה
  let compScore = 0;
  for (const ph of phrases) {
    const hits = retrieve(ph, 3);
    const hit = hits.find((h) => !used.has(h.cls)) || hits[0];
    // כיסוי-מיעוט = מסגור-מקרי (מילה-אחת מתוך משפט), לא בקשת-וידג'ט → לא רכיב.
    if (!hit || hit.s < MIN || hit.cover < 0.5) { if (ph.length > 2) gaps.push(ph); continue; }
    used.add(hit.cls);
    comps.push({ cls: hit.cls, label: cleanLabel(ph), s: hit.s });
    compScore += hit.s;
  }

  // (ב) הרכבה-הפוכה: המסך-האמיתי-שפורק הדומה-ביותר לבקשה ⇒ מבנהו כאטומי-קטלוג.
  const bd = board(text);
  const boardScore = bd ? bd.s : 0;
  const screenName = bd ? bd.screen.replace(/^screens__/, '').replace(/_screen$/, '').replace(/_/g, ' ') : '';

  // הכרעה טהורה (מונחית-ציון, בלי רשימות-מילים): אם מסך-אמיתי-שפורק מסביר את
  // הבקשה טוב-יותר מסכום-הרכיבים — מרכיבים אחורה ממבנהו; אחרת מהרכיבים.
  let placed = 0;
  if (boardScore >= MIN && boardScore > compScore) {
    trace.push(`🧩 הרכבה-הפוכה מהמסך «${screenName}» (${boardScore} > רכיבים ${compScore.toFixed(1)})`);
    for (const cls of bd.atoms) { if (used.has(cls)) continue; used.add(cls); lines.push(`אטום ${cls} ${title}`); placed++; }
    for (const c of comps) { lines.push(`אטום ${c.cls} ${c.label}`); trace.push(`   +רכיב מפורש: ${c.cls}`); placed++; }
  } else {
    for (const c of comps) { lines.push(`אטום ${c.cls} ${c.label}`); trace.push(`«${c.label.slice(0, 22)}» → ${c.cls} (${c.s})`); placed++; }
  }

  // שער-התצוגה: לא נמצא כלום? מרכיב כותרות מהתיאור — אף פעם לא מסך ריק.
  if (placed === 0) {
    trace.push('אין אטום/לוח תואם → מרכיב כותרות מהתיאור');
    for (const seg of phrases.slice(0, 4)) lines.push(`כותרת ${cleanLabel(seg)}`);
  }

  lines.push('באנר המחולל למד מהאטומים ומהלוחות ובחר לבד לפי משמעות');
  return { spec: lines.join('\n'), trace, title, gaps };
}

// ── CLI ──
// למידה-מהשימוש: node nl.mjs --teach "<מילה>" <AtomClass>
if (process.argv[2] === '--teach') {
  const [, , , word, cls] = process.argv;
  if (!word || !cls) { console.error('שימוש: node nl.mjs --teach "<מילה>" <AtomClass>'); process.exit(1); }
  try { const r = teach(word, cls); console.log(`✅ נלמד: «${r.word}» ⇒ ${r.cls}. מעכשיו המחולל יזהה את זה לבד.`); }
  catch (e) { console.error('🚫 ' + e.message); process.exit(1); }
  process.exit(0);
}

const text = process.argv.slice(2).join(' ').trim();
if (!text) { console.error('שימוש: node nl.mjs "<תיאור חופשי>"  |  node nl.mjs --teach "<מילה>" <Atom>'); process.exit(1); }
const { spec, trace, gaps } = interpret(text);
console.log('🧠 המחולל הבין (למידה-מהאטומים):');
for (const t of trace) console.log('   ' + t);
if (gaps.length) {
  console.log('\n💡 לא זיהיתי (הזדמנות-למידה — למד אותי פעם אחת):');
  for (const g of gaps.slice(0, 4)) console.log(`   «${g.slice(0, 24)}» → node nl.mjs --teach "<מילה>" <Atom>`);
}
console.log('\n📋 הספק שנגזר:');
console.log(spec.split('\n').map((l) => '   ' + l).join('\n'));
fs.writeFileSync(path.join(HERE, 'specs/nl.txt'), spec + '\n');
console.log('\n▶ מריץ את המחולל...');
const out = execFileSync('node', [path.join(HERE, 'genesis-gen.mjs'), 'nl', spec], { encoding: 'utf8' });
console.log(out.split('\n').filter((l) => /nl ·/.test(l)).join('\n'));
