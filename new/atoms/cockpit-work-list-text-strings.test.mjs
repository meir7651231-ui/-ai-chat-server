// בדיקת-צילום · cockpit-work-list-text-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { COCKPIT_WORK_LIST_TEXT_T } from './cockpit-work-list-text-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COCKPIT_WORK_LIST_TEXT_T), "{\"k1\":\"📞 שיחה\",\"k2\":\"💛 תודה\",\"k3\":\"🔁 הו״ק\",\"k4\":\"ללא שם\"}");
console.log('OK cockpit-work-list-text-strings');
