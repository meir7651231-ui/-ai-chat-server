// בדיקת-צילום · clear-employee-field-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { CLEAR_EMPLOYEE_FIELD_T } from './clear-employee-field-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CLEAR_EMPLOYEE_FIELD_T), "{\"k1\":\"platformOrgs\",\"k2\":\"memberConfigs\"}");
console.log('OK clear-employee-field-strings');
