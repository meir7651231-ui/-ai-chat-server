// בדיקת-צילום · sanitize-incoming-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SANITIZE_INCOMING_T } from './sanitize-incoming-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SANITIZE_INCOMING_T), "{\"k1\":\"members\",\"k2\":\"docs\",\"k3\":\"payments\",\"k4\":\"absences\",\"k5\":\"donations\",\"k6\":\"collections\",\"k7\":\"scoreLog\",\"k8\":\"components\",\"k9\":\"redemptions\",\"k10\":\"criterionIds\",\"k11\":\"waits\"}");
console.log('OK sanitize-incoming-strings');
