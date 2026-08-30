// בדיקת-צילום · org-cal-entries-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ORG_CAL_ENTRIES_T } from './org-cal-entries-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ORG_CAL_ENTRIES_T), "{\"k1\":\"📞 תשובה: \",\"k2\":\"🔁 לדבר שוב\"}");
console.log('OK org-cal-entries-strings');
