#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  nl-quality.mjs — יַרְד-מידה §22: מודד את **איכות** חילוץ-הישויות ממשפט-חופשי
//  (לא רק "בונה" כמו nl-smoke). קורפוס אמת (generator/nl-quality.txt) ⇒ מטריקות:
//  קריסה/אפס=חייב-0 · שם-דלף=שם-ישות שמכיל מילת-פונקציה (זבל-ראש) · שם-קידומת-ל.
//  שער: 0 קריסות · 0 אפס · שמות-נקיים ≥ רצפה (רק-עולה). כך §22 נמדד ונעול מרגרסיה.
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import { nlToSpec } from '../generator/nl-spec.mjs';
import { buildApp } from '../generator/app-ds.mjs';
import * as R from '../root.mjs';

const LANG = JSON.parse(fs.readFileSync((R.GEN_DIR + 'nl-lang.data.json'), 'utf8'));
const LEAD = new Set(LANG.leadins || []);
const sents = fs.readFileSync((R.GEN_DIR + 'nl-quality.txt'), 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);

const FLOOR_CLEAN = 0.92;   // רצפת-איכות: ≥92% משמות-הישויות נקיים מזבל-ראש (רק-עולה)
let crash = 0, zero = 0, buildFail = 0, names = 0, leaked = 0;
const bad = [];
for (const s of sents) {
  let spec;
  try { spec = nlToSpec(s); } catch (e) { crash++; bad.push(`CRASH · ${s} · ${e.message}`); continue; }
  const ents = spec.split('\n').filter((l) => l.trim());
  if (!ents.length) { zero++; bad.push(`ZERO · ${s}`); continue; }
  try { buildApp(s); } catch (e) { buildFail++; bad.push(`BUILD-FAIL · ${s} · ${e.message}`); continue; }
  // שם-ישות = בין 'ישות' ל-'עם'. דלף = מילת-פונקציה (leadin) בתוך השם, או קידומת-ל על מילה-בודדת.
  for (const line of ents) {
    const m = line.match(/^ישות\s+(.+?)\s+עם\s/);
    if (!m) continue;
    names++;
    const words = m[1].split(/\s+/);
    const hasLead = words.some((w) => LEAD.has(w));
    const lPrefix = words.length === 1 && words[0].length >= 4 && words[0][0] === 'ל' && !/(ים|ות)$/.test(words[0]);
    if (hasLead || lPrefix) { leaked++; bad.push(`LEAK · ${s}\n       ⇒ "${m[1]}"`); }
  }
}
const cleanRatio = names ? (names - leaked) / names : 1;
const hard = crash + zero + buildFail;
console.log(`§22 יַרְד-מידה · ${sents.length} משפטים · ${names} שמות-ישות`);
console.log(`  קריסה:${crash} אפס:${zero} כשל-בנייה:${buildFail} · שם-דלף:${leaked} · נקי:${(cleanRatio * 100).toFixed(1)}% (רצפה ${FLOOR_CLEAN * 100}%)`);
if (bad.length) { console.log('\n--- בעיות ---'); for (const b of bad) console.log('  ' + b); }
if (hard > 0) { console.log(`\n🚨 §22: ${hard} כשלים-קשים (קריסה/אפס/בנייה)`); process.exit(1); }
if (cleanRatio < FLOOR_CLEAN) { console.log(`\n🚨 §22: איכות ${(cleanRatio * 100).toFixed(1)}% < רצפה ${FLOOR_CLEAN * 100}%`); process.exit(1); }
console.log('\n✅ §22 יַרְד-מידה: אפס-כשלים-קשים · איכות מעל-הרצפה');
