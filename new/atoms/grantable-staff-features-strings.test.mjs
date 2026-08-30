// בדיקת-צילום · grantable-staff-features-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { GRANTABLE_STAFF_FEATURES_T } from './grantable-staff-features-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(GRANTABLE_STAFF_FEATURES_T), "{\"k1\":\"supporters.bulkselect\",\"k2\":\"supporters.bulkdelete\",\"k3\":\"supporters.purpose\",\"k4\":\"supporters.delete\",\"k5\":\"families.delete\",\"k6\":\"courses.delete\",\"k7\":\"courses.bulkadmin\",\"k8\":\"settings.teachers.delete\",\"k9\":\"shop.delete\",\"k10\":\"tzedaka.delete\"}");
console.log('OK grantable-staff-features-strings');
