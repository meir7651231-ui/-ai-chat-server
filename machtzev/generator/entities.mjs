#!/usr/bin/env node
// ══════════════════════════════════════════════════════════════════════════
//  entities.mjs — קורפוס-הישויות (הפירוק של schema.mjs, כדאטה לצריכה)
//  מפרק את מודלי-הדומיין האמיתיים של האימפריה (domain.ts/domain.dart) לישויות
//  ושדותיהן — בדיוק כמו schema.mjs (L10). הפלט entities.json הוא הקורפוס
//  שמנוע-הישויות (entity.mjs) מרכיב-ממנו-אחורה. דאטה — לא מנגנון.
//  שימוש:  node entities.mjs   (סורק מקורות ידועים ⇒ machtzev/generator/entities.json)
// ══════════════════════════════════════════════════════════════════════════
import fs from 'node:fs';
import path from 'node:path';

const HERE = new URL('.', import.meta.url).pathname;
// מקורות מודל-הדומיין של האימפריה (הקוד-החלוץ שהמחצב מפרק).
const SOURCES = [
  { repo: 'maor', file: '/home/user/maor-system/src/types/domain.ts', kind: 'ts' },
  { repo: 'buildsmart', file: '/home/user/buildsmart/app_flutter/lib/domain/domain.dart', kind: 'dart' },
];

const entities = [];
for (const s of SOURCES) {
  let txt;
  try { txt = fs.readFileSync(s.file, 'utf8'); } catch { continue; }
  let cur = null;
  txt.split('\n').forEach((line) => {
    const ent = line.match(/(?:export\s+interface|abstract\s+class|class)\s+([A-Z][A-Za-z0-9]*)/);
    if (ent) { cur = { entity: ent[1], repo: s.repo, fields: [] }; entities.push(cur); return; }
    if (/^\}/.test(line)) { cur = null; return; }
    if (!cur) return;
    // שדה: 2-רווח, שם: טיפוס;  (TS)  ·  final <type> <name>;  (Dart)
    let fld = line.match(/^\s{2,4}([a-zA-Z][a-zA-Z0-9_]*)(\??)\s*:\s*([^;=]+)[;=]/);
    if (!fld) { const d = line.match(/^\s*final\s+([\w<>,?. ]+?)\s+([a-zA-Z][a-zA-Z0-9_]*)\s*;/); if (d) fld = [null, d[2], d[1].includes('?') ? '?' : '', d[1]]; }
    if (fld && !/\(|=>|function/.test(line)) cur.fields.push({ name: fld[1], optional: fld[2] === '?', type: fld[3].trim().slice(0, 40) });
  });
}

const kept = entities.filter((e) => e.fields.length >= 2);
fs.writeFileSync(path.join(HERE, 'entities.json'), JSON.stringify({ count: kept.length, entities: kept }, null, 1));
const fields = kept.reduce((n, e) => n + e.fields.length, 0);
console.log(`🗂️ קורפוס-ישויות: ${kept.length} ישויות · ${fields} שדות`);
for (const e of kept.slice(0, 8)) console.log(`   ${e.entity} (${e.repo}) — ${e.fields.length} שדות: ${e.fields.slice(0, 5).map((f) => f.name).join(', ')}…`);
