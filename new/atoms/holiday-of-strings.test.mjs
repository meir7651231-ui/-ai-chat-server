// בדיקת-צילום · holiday-of-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { HOLIDAY_OF_T } from './holiday-of-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(HOLIDAY_OF_T), "{\"k1\":\"Tevet\",\"k2\":\"Kislev\",\"k3\":\"חנוכה\",\"k4\":\"Tamuz 17\",\"k5\":\"Tamuz\",\"k6\":\"צום י״ז בתמוז (נדחה)\",\"k7\":\"תשעה באב (נדחה)\",\"k8\":\"Tishri 3\",\"k9\":\"Tishri\",\"k10\":\"צום גדליה (נדחה)\",\"k11\":\"Adar 13\",\"k12\":\"Adar II 13\",\"k13\":\"Adar\",\"k14\":\"Adar II\",\"k15\":\"תענית אסתר (מוקדם)\",\"k16\":18,\"k17\":10,\"k18\":11}");
console.log('OK holiday-of-strings');
