#!/usr/bin/env node
// 📏 meter-100 — **הפניה בלבד**. המד עבר לביתו: `nl-smoke.mjs --meter` (w-meter-pins · 18.9,
// אישור-הבעלים «תחבר אותם»). כאן לא נשאר גוף — **עותק אחד** של המד בריפו, אחרת שני
// המדים סוחפים זה מזה ומדווחים שתי אמיתות (L111 מילה-במילה, על פותר-כלים).
// הקובץ נשאר כדי שהפקודה המתועדת (‏PLAN-100.md · STATUS-w-meter-100.md) תמשיך לעבוד;
// כל ארגומנט מועבר כמות-שהוא, וקוד-היציאה הוא של המד.
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const r = spawnSync(process.execPath, [path.join(HERE, 'nl-smoke.mjs'), '--meter', ...process.argv.slice(2)],
  { stdio: 'inherit' });
process.exit(r.status ?? 1);
