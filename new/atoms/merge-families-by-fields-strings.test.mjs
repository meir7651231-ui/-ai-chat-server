// בדיקת-צילום · merge-families-by-fields-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { MERGE_FAMILIES_BY_FIELDS_T } from './merge-families-by-fields-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MERGE_FAMILIES_BY_FIELDS_T), "{\"k1\":\"kidsHome\",\"k2\":\"kidsMarried\",\"k3\":\"status\",\"k4\":\"name\",\"k5\":\"mother\",\"k6\":\"father\",\"k7\":\"phone\",\"k8\":\"phone2\",\"k9\":\"email\",\"k10\":\"city\",\"k11\":\"address\",\"k12\":\"motherId\",\"k13\":\"fatherId\",\"k14\":\"community\",\"k15\":\"language\",\"k16\":\"maritalStatus\",\"k17\":\"createdAt\",\"k18\":\"notes\"}");
console.log('OK merge-families-by-fields-strings');
