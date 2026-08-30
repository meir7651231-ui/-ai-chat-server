// בדיקת-צילום · names-export-terms — המונחים זהים ביט-אחר-ביט למקור.
import { NAMES_EXPORT_TERMS } from './names-export-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(NAMES_EXPORT_TERMS), "{\"k1\":\"⬇ ייצוא CSV\",\"k2\":\"names-report.csv\"}");
console.log('OK names-export-terms');
