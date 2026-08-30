// בדיקת-צילום · pull-nedarim-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PULL_NEDARIM_T } from './pull-nedarim-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PULL_NEDARIM_T), "{\"k1\":\"כתובת-משיכה לא-תקינה (חייבת https)\",\"k2\":\"נדרשת התחברות-ענן\",\"k3\":\"root\",\"k4\":\"org\",\"k5\":\"full\",\"k6\":\"reset\",\"k7\":\"POST\",\"k8\":\"Bearer \",\"k9\":\"משיכה נכשלה (\"}");
console.log('OK pull-nedarim-strings');
