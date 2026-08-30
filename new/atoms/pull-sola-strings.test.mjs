// בדיקת-צילום · pull-sola-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { PULL_SOLA_T } from './pull-sola-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PULL_SOLA_T), "{\"k1\":\"כתובת-משיכה לא-תקינה (חייבת https)\",\"k2\":\"נדרשת התחברות-ענן\",\"k3\":\"root\",\"k4\":\"org\",\"k5\":\"default\",\"k6\":\"vault\",\"k7\":\"reset\",\"k8\":\"POST\",\"k9\":\"Bearer \",\"k10\":\"משיכה נכשלה (\"}");
console.log('OK pull-sola-strings');
