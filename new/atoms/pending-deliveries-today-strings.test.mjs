// בדיקת-צילום · pending-deliveries-today-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { PENDING_DELIVERIES_TODAY_T } from './pending-deliveries-today-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(PENDING_DELIVERIES_TODAY_T), "{\"k1\":\"delivered\"}");
console.log('OK pending-deliveries-today-strings');
