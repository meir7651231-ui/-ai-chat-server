// בדיקת-צילום · vcard-import-terms — המונחים זהים ביט-אחר-ביט למקור.
import { VCARD_IMPORT_TERMS } from './vcard-import-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(VCARD_IMPORT_TERMS), "{\"k1\":\"נייד\",\"k2\":\"בית\",\"k3\":\"עבודה\",\"k4\":\"פקס\",\"k5\":\"ראשי\",\"k6\":\"utf-8\",\"k7\":\"QUOTED-PRINTABLE\",\"k8\":\"X-CUSTOM\"}");
console.log('OK vcard-import-terms');
