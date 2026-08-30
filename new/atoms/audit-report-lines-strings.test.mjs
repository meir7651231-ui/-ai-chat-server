// בדיקת-צילום · audit-report-lines-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { AUDIT_REPORT_LINES_T } from './audit-report-lines-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(AUDIT_REPORT_LINES_T), "{\"k1\":\"דוח תקינות נתונים — \",\"k2\":\"מאור החסד\",\"k3\":\"הופק: \"}");
console.log('OK audit-report-lines-strings');
