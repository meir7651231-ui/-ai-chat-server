#!/usr/bin/env node
/** 📦 שער-הוכחות-הקופסאות (מבצע-המאה, פאזה 8) — הלקח: מדפי-הטיהור שינו חתימות-אטומים
 *  וקופסאות-ה-Dart נשארו על ה-API הישן בלי שאף שער יאדים (26/62 אדומות בשקט).
 *  ratchet: baseline = הקופסאות-האדומות הידועות (box-proofs-baseline.json). קופסה-ירוקה
 *  שהאדימה (לא-ב-baseline) ⇒ FAIL. החוב רק יורד: --baseline מרענן אחרי ריפוי.
 *  שימוש: --gate (ברירת-מחדל) · --baseline · --report. הרצה מלאה (dart run לכל הוכחה).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { resolveDart } from './dart-bin.mjs';
import * as R from './root.mjs';
const ROOT = R.ROOT;
const BOXES = path.join(ROOT, 'new/dart-boxes');
const BASE = path.join(ROOT, 'machtzev/box-proofs-baseline.json');

// פתרון-Dart עמיד: DART_BIN → dart ב-PATH → flutter → הסקרצ'פד. אין בינארי ⇒ לא-ניתן-להוכיח (כנות, לא סחף).
// c2 · פותר-Dart משותף — dart-bin.mjs (DART_BIN → ~/dart-sdk → flutter → PATH).
const DART = resolveDart();
if (!DART) {
  // ⚠️ הבחנה קריטית (L27): "אין בינארי" ≠ "סחף-חתימות". לא מפברקים ירוק ולא מפברקים סיבה.
  console.error('🚨 שער-הוכחות-הקופסאות: לא-ניתן-להוכיח — אין בינארי Dart בסביבה.');
  console.error('   זו אינה סחף-חתימות ואין להריץ rethread-boxes. התקן Dart/Flutter או הגדר DART_BIN, והרץ שוב.');
  process.exit(2);   // קוד ייחודי: מדולג-בכפייה (לא pass, לא drift)
}

const red = [];
const boxes = fs.readdirSync(BOXES).filter(f => f.endsWith('-proof.dart')).map(f => f.replace(/-proof\.dart$/, '')).sort();
for (const b of boxes) {
  try { execFileSync(DART, ['run', '--enable-asserts', path.join(BOXES, b + '-proof.dart')], { cwd: BOXES, stdio: 'pipe', timeout: 120000 }); }
  catch { red.push(b); }
}
const arg = process.argv[2] || '--gate';
if (arg === '--baseline') {
  fs.writeFileSync(BASE, JSON.stringify(red, null, 0));
  console.log(`baseline נכתב: ${red.length}/${boxes.length} אדומות (חוב-מנוהל).`);
} else if (arg === '--report') {
  console.log(`אדומות: ${red.length}/${boxes.length}`);
  red.forEach(b => console.log('  🔴 ' + b));
} else {
  const base = fs.existsSync(BASE) ? new Set(JSON.parse(fs.readFileSync(BASE, 'utf8'))) : new Set();
  const fresh = red.filter(b => !base.has(b));
  if (fresh.length) {
    console.error(`🚨 שער-הוכחות-הקופסאות: ${fresh.length} קופסאות שהאדימו (סחף-חתימות! חווט מחדש עם rethread-boxes.mjs):`);
    fresh.forEach(b => console.error('   + ' + b));
    process.exit(1);
  }
  // c3ג · עיקרון 5: שער לא כותב. חוב שירד מדווח ומוחל בטבעת-push (--baseline); היה: כתיבה-עצמית (R2-5.6).
  if (red.length < base.size) console.log(`ℹ️ baseline may shrink: box-proofs ${base.size}→${red.length} — מוחל בטבעת-push (--baseline)`);
  console.log(`✓ שער-הוכחות-הקופסאות: אפס הַאֲדָמָה · חוב-מנוהל ${red.length}/${boxes.length}`);
}
