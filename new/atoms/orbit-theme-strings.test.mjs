// בדיקת-צילום · orbit-theme-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ORBIT_THEME_T } from './orbit-theme-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ORBIT_THEME_T), "{\"k1\":\"#ffffff\",\"k2\":\"Ice\",\"k3\":\"Ember\",\"k4\":\"Aurora\",\"k5\":\"rgba(\"}");
console.log('OK orbit-theme-strings');
