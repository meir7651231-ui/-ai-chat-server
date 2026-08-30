// בדיקת-צילום · receipt-terms — יושר-מחדש (מנוע-הטיהור).
import { RECEIPT_TERMS } from './receipt-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(RECEIPT_TERMS), "{\"k1\":\"receipt: שקע amountInWords לא סופק — אטום amount-in-words שבור (integerInWords/agorotPhrase) ו-agorot-phrase חסר; לוח-האם מזריק את שכן hebrew-number.\"}");
console.log('OK');
