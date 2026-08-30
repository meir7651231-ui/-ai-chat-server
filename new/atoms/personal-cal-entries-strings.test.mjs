// בדיקת-צילום · personal-cal-entries-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PERSONAL_CAL_ENTRIES_T } from './personal-cal-entries-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PERSONAL_CAL_ENTRIES_T), "{\"k1\":\"🎯 תאריך יעד לקשר הבא\",\"k2\":\"📞 תשובה: \",\"k3\":\"🔁 לדבר שוב\"}");
console.log('OK personal-cal-entries-strings');
