// בדיקת-צילום · build-slots-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { BUILD_SLOTS_T } from './build-slots-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(BUILD_SLOTS_T), "{\"k1\":\"clean\",\"k2\":\"cleaning\",\"k3\":\"ניקיון יומי (15:00–16:00)\",\"k4\":\"#eceae2\",\"k5\":\"course\",\"k6\":\"entity.course\",\"k7\":\"חוג\",\"k8\":\"#fdf1d4\",\"k9\":\"event\",\"k10\":\"אירוע: \",\"k11\":\"#e7edf5\",\"k12\":\"blk\",\"k13\":\"blocked\",\"k14\":\"חסום — \",\"k15\":\"#fdeaea\",\"k16\":\"free\",\"k17\":\"פנוי\",\"k18\":\" · מחוץ לשעות הפעילות של החדר\"}");
console.log('OK build-slots-strings');
