#!/usr/bin/env node
/** מחצב · goal-card — כרטיס-מטרה (הדרך צעדים 1·3·6 · הכרעה 23-ד · שלב 9 צעדים 2–4 · "המטרה — הסוכן מזין, וגם תמונה").
 *  הסוכן מזין: המטרה של הלקוח (טקסט) · המודלים שמזינים את ההחלטה · האטומים שמגלמים · מבחני-קבלה מספריים · **תמונה** (רנדר).
 *  הכלי כותב machtzev/audit/goals/<screen-basename>.json חתום, עם sha של המסך ושל התמונה. השער goal-proof דורש כרטיס תקף
 *  לכל מסך/לוח שנוסף או השתנה, ובודק בבייטים: כל מודל וכל אטום מופיעים בקוד-המסך · תמונה אמיתית (PNG/JPEG, ≥400×300, <1MB) · המסך לא השתנה אחרי הכרטיס.
 *  שימוש: node machtzev/goal-card.mjs --screen new/dart-screens-bs/x.dart --goal "<מה הלקוח משיג>" --models a,b --atoms X,Y
 *         --accept "8 KPI;10 עמודות;טעינה < 2s" --picture <png|jpg>     |   --refresh <screen> [--picture <new>]  (המסך השתנה, שאר השדות נשמרים) */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import * as R from './root.mjs';
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const DIR = R.MACH + 'audit/goals/';
const screen = opt('--screen') || opt('--refresh');
if (!screen) { console.error('usage: goal-card --screen <path> --goal "…" --models a,b --atoms X,Y --accept "…;…" --picture <img>  |  --refresh <screen> [--picture <img>]'); process.exit(2); }
const abs = path.resolve(R.ROOT, screen);
if (!fs.existsSync(abs)) { console.error(`❌ המסך ${screen} לא קיים`); process.exit(1); }
const cardFile = DIR + path.basename(screen).replace(/\.dart$|\.mjs$/, '') + '.json';
let card = fs.existsSync(cardFile) ? JSON.parse(fs.readFileSync(cardFile, 'utf8')) : {};
if (opt('--refresh')) { if (!card.goal) { console.error('❌ אין כרטיס קיים לרענון — צור עם --screen'); process.exit(1); } }
else {
  card = { v: 1, screen, goal: opt('--goal') || '', models: (opt('--models') || '').split(',').map((s) => s.trim()).filter(Boolean), atoms: (opt('--atoms') || '').split(',').map((s) => s.trim()).filter(Boolean), accept: (opt('--accept') || '').split(';').map((s) => s.trim()).filter(Boolean), picture: null };
}
// ── תמונה ──
const pic = opt('--picture');
if (pic) {
  const src = path.resolve(R.ROOT, pic); if (!fs.existsSync(src)) { console.error(`❌ התמונה ${pic} לא קיימת`); process.exit(1); }
  const ext = /\.png$/i.test(src) ? '.png' : /\.jpe?g$/i.test(src) ? '.jpg' : null; if (!ext) { console.error('❌ תמונה חייבת להיות PNG או JPEG'); process.exit(1); }
  const dst = DIR + path.basename(cardFile, '.json') + ext; fs.mkdirSync(DIR, { recursive: true }); if (path.resolve(dst) !== src) fs.copyFileSync(src, dst);
  card.picture = path.relative(R.ROOT, dst);
}
// ── אימות שדות (מה שהשער יבדוק — נכשל כאן מוקדם) ──
const errs = [];
if (!card.goal || card.goal.replace(/\s+/g, '').length < 40) errs.push('goal: המטרה של הלקוח ≥40 תווים (התוצאה, לא הצורה — הדרך צעד 1)');
if (!card.models?.length) errs.push('models: לפחות מודל/אות אחד שמזין את ההחלטה (23-ד: מחברים, לא בוחרים)');
if (!card.atoms?.length) errs.push('atoms: לפחות אטום אחד שמגלם את הפעולה (הדרך צעד 3)');
if (!card.accept?.length || !card.accept.every((a) => /\d/.test(a))) errs.push('accept: מבחני-קבלה מספריים, מופרדים ב-; (כל אחד עם מספר)');
if (!card.picture) errs.push('picture: תמונה (רנדר) חובה — --picture <png|jpg>');
const src = fs.readFileSync(abs, 'utf8');
for (const m of card.models || []) if (!new RegExp(`\\b${m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(src)) errs.push(`model ${m} לא מופיע בקוד-המסך — חיבור בתצוגה בלבד אינו חיבור (23-ד)`);
for (const a of card.atoms || []) if (!new RegExp(`\\b${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(src)) errs.push(`atom ${a} לא מופיע בקוד-המסך`);
if (card.picture) {
  const b = fs.readFileSync(path.resolve(R.ROOT, card.picture));
  const png = b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), jpg = b[0] === 0xff && b[1] === 0xd8;
  if (!png && !jpg) errs.push('picture: לא PNG/JPEG אמיתי (magic bytes)');
  if (b.length >= 1024 * 1024) errs.push('picture: ≥1MB (שער nobinary) — הקטן');
  if (png) { const w = b.readUInt32BE(16), h = b.readUInt32BE(20); if (w < 400 || h < 300) errs.push(`picture: ${w}×${h} קטן מדי (≥400×300)`); }
  card.pictureSha = sha(b);
}
if (errs.length) { console.error('❌ כרטיס-מטרה לא תקף:'); errs.forEach((e) => console.error('   ✗ ' + e)); process.exit(1); }
card.screenSha = sha(src); card.ts = new Date().toISOString();
const body = JSON.stringify({ ...card, sig: undefined });
card.sig = sha('machtzev-goal-v1\n' + body);
fs.mkdirSync(DIR, { recursive: true }); fs.writeFileSync(cardFile, JSON.stringify(card, null, 1) + '\n');
console.log(`🎯 כרטיס-מטרה: ${path.relative(R.ROOT, cardFile)}\n   מטרה: ${card.goal.slice(0, 90)}…\n   מודלים ${card.models.length} · אטומים ${card.atoms.length} · קבלה ${card.accept.length} · תמונה ${card.picture} (${card.pictureSha.slice(0, 8)})`);
