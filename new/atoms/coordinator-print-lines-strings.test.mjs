// בדיקת-צילום · coordinator-print-lines-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { COORDINATOR_PRINT_LINES_T } from './coordinator-print-lines-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(COORDINATOR_PRINT_LINES_T), "{\"k1\":\"home\",\"k2\":\"office\",\"k3\":\"רשימת קופות — \",\"k4\":\"entity.familyOf\",\"k5\":\"משפחת\",\"k6\":\"במשרד\",\"k7\":\"ריקון אחרון: \",\"k8\":\"טרם רוקנה\",\"k9\":\"אין קופות פעילות\"}");
console.log('OK coordinator-print-lines-strings');
