// בדיקת-צילום · excel-serial-to-iso-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { EXCEL_SERIAL_TO_ISO_T } from './excel-serial-to-iso-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(EXCEL_SERIAL_TO_ISO_T), "{\"k1\":25569,\"k2\":86400000}");
console.log('OK excel-serial-to-iso-strings');
