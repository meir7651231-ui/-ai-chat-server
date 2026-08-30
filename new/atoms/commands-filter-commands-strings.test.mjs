// בדיקת-צילום · commands-filter-commands-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { COMMANDS_FILTER_COMMANDS_T } from './commands-filter-commands-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COMMANDS_FILTER_COMMANDS_T), "{\"k1\":\"openDonor\"}");
console.log('OK commands-filter-commands-strings');
