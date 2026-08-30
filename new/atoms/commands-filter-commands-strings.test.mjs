// בדיקת-צילום · commands-filter-commands-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { COMMANDS_FILTER_COMMANDS_T } from './commands-filter-commands-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COMMANDS_FILTER_COMMANDS_T), "{\"k1\":\"openDonor\",\"k2\":12}");
console.log('OK commands-filter-commands-strings');
