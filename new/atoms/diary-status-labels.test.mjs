// בדיקת-צילום · diary-status-labels — ביט-אחר-ביט.
import { PLAN_PUNCH, PUNCH_LABEL_PREFIX, ENROLL_STATUS_META } from './diary-status-labels.mjs';
import assert from 'node:assert';
assert.strictEqual(PLAN_PUNCH, 'punch');
assert.strictEqual(PUNCH_LABEL_PREFIX, 'כרטיסייה · יתרה ');
assert.strictEqual(JSON.stringify(ENROLL_STATUS_META),
  '{"paused":{"label":"מוקפא","bg":"#fdf1d4","c":"#9a6414"},'
  + '"ended":{"label":"הסתיים","bg":"#eceae2","c":"#8b8474"},'
  + '"wait":{"label":"רשימת-המתנה ⏳","bg":"#e7edf5","c":"#3a5a86"}}');
console.log('OK diary-status-labels');
