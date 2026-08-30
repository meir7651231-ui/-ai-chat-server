// בדיקת-צילום · cloud-db-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { CLOUD_DB_T } from './cloud-db-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CLOUD_DB_T), "{\"k1\":\"הענן לא אותחל — פנו למנהל המערכת\"}");
console.log('OK cloud-db-strings');
