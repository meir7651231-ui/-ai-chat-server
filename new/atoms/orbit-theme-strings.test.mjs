// בדיקת-צילום · orbit-theme-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { ORBIT_THEME_T } from './orbit-theme-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ORBIT_THEME_T), "{\"k1\":\"#ffffff\",\"k2\":\"Ice\",\"k3\":\"Ember\",\"k4\":\"Aurora\",\"k5\":\"rgba(\",\"k6\":\"--o-accent\",\"k7\":\"--o-accent-rgb\",\"k8\":\"--o-accent2\",\"k9\":\"--o-glow\",\"k10\":\"--o-btn-a\",\"k11\":\"--o-btn-b\",\"k12\":\"--o-btn-text\",\"k13\":\"--accent\"}");
console.log('OK orbit-theme-strings');
