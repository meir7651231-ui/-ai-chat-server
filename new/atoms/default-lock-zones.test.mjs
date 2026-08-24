/** בדיקת-חוזה · default-lock-zones — צילום. (אימות אין-אזור-רפאים מול lock-zones = בדיקת-קופסת-הנעילה — חוק-2.) */
import { DEFAULT_LOCK_ZONES } from './default-lock-zones.mjs';
import assert from 'node:assert';
assert.deepStrictEqual(DEFAULT_LOCK_ZONES, ['wizard', 'settings']);
console.log('✓ default-lock-zones');
