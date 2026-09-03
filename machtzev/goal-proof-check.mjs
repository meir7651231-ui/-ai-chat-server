#!/usr/bin/env node
/** מחצב · goal-proof-check — שער `goal-proof` (הדרך צעדים 1·3·6 · 23-ד · שלב 9): מסך/לוח שנוסף או השתנה ⇒ כרטיס-מטרה תקף + תמונה.
 *  בודק בבייטים (לא שופט): כרטיס קיים · sig · screenSha == תוכן-המסך ב-index (הכרטיס לא ישן) · תמונה קיימת, PNG/JPEG אמיתי, ≥400×300,
 *  pictureSha תואם · goal ≥40 · models/atoms לא-ריקים וכל אחד מופיע בקוד-המסך · accept מספרי.
 *  שימוש: --files a,b (מסכים staged מ-pre-commit). יציאה 0/1. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import * as R from './root.mjs';
const argv = process.argv.slice(2);
const fi = argv.indexOf('--files');
const files = fi >= 0 ? argv[fi + 1].split(',').filter(Boolean) : [];
const SCOPE = /^new\/(dart-screens-bs|dart-boards-bs)\/[^/]+\.dart$/;
const targets = files.filter((f) => SCOPE.test(f) && !/_test\.dart$|-proof\.dart$/.test(f));
if (!targets.length) { console.log('✓ goal-proof: אין מסכים/לוחות ב-staged'); process.exit(0); }
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const DIR = R.MACH + 'audit/goals/';
const staged = (f) => { try { return execFileSync('git', ['show', ':' + f], { cwd: R.ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }); } catch { return fs.readFileSync(path.join(R.ROOT, f), 'utf8'); } };
const bad = [];
for (const t of targets) {
  const cf = DIR + path.basename(t).replace(/\.dart$/, '') + '.json';
  if (!fs.existsSync(cf)) { bad.push(`${t}: אין כרטיס-מטרה (node machtzev/goal-card.mjs --screen ${t} --goal "…" --models … --atoms … --accept "…" --picture <img>)`); continue; }
  let card; try { card = JSON.parse(fs.readFileSync(cf, 'utf8')); } catch { bad.push(`${t}: כרטיס לא-JSON`); continue; }
  const { sig, ...body } = card;
  if (sha('machtzev-goal-v1\n' + JSON.stringify({ ...body, sig: undefined })) !== sig) { bad.push(`${t}: הכרטיס נערך אחרי החתימה — הרץ goal-card מחדש`); continue; }
  const src = staged(t);
  if (card.screenSha !== sha(src)) bad.push(`${t}: המסך השתנה אחרי הכרטיס — node machtzev/goal-card.mjs --refresh ${t} [--picture <רנדר חדש>] (ומדוד מול המטרה בעין — צעד 6)`);
  if (!card.goal || card.goal.replace(/\s+/g, '').length < 40) bad.push(`${t}: goal ריק/קצר`);
  if (!card.models?.length) bad.push(`${t}: models ריק`); else for (const m of card.models) if (!new RegExp(`\\b${m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(src)) bad.push(`${t}: model ${m} לא מופיע בקוד — חיבור בהחלטה, לא רק בכרטיס (23-ד)`);
  if (!card.atoms?.length) bad.push(`${t}: atoms ריק`); else for (const a of card.atoms) if (!new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(src)) bad.push(`${t}: atom ${a} לא מופיע בקוד`);
  if (!card.accept?.length || !card.accept.every((x) => /\d/.test(x))) bad.push(`${t}: accept חסר/לא-מספרי`);
  if (!card.picture || !fs.existsSync(path.join(R.ROOT, card.picture))) { bad.push(`${t}: תמונה חסרה (${card.picture || '—'})`); continue; }
  const b = fs.readFileSync(path.join(R.ROOT, card.picture));
  const png = b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), jpg = b[0] === 0xff && b[1] === 0xd8;
  if (!png && !jpg) bad.push(`${t}: התמונה אינה PNG/JPEG`);
  if (png) { const w = b.readUInt32BE(16), h = b.readUInt32BE(20); if (w < 400 || h < 300) bad.push(`${t}: תמונה ${w}×${h} קטנה מדי`); }
  if (sha(b) !== card.pictureSha) bad.push(`${t}: התמונה הוחלפה אחרי הכרטיס (pictureSha)`);
}
if (bad.length) { console.log(`🔴 goal-proof: ${bad.length} הפרות — מסך בלי מטרה/תמונה/חיבור:`); bad.forEach((x) => console.log('   ✗ ' + x)); process.exit(1); }
console.log(`✓ goal-proof: ${targets.length} מסכים · לכולם כרטיס-מטרה חתום, מודלים ואטומים בקוד, תמונה אמיתית`);
