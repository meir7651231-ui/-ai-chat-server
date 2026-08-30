// בדיקת-צילום · site-vocab-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SITE_VOCAB_T } from './site-vocab-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SITE_VOCAB_T), "{\"k1\":\"Get in touch\",\"k2\":\"צרו קשר\",\"k3\":\"Contact\",\"k4\":\"Contact us\",\"k5\":\"Your request\",\"k6\":\"הפנייה שלך\",\"k7\":\"Donate now\",\"k8\":\"לתרומה עכשיו\",\"k9\":\"Donate\",\"k10\":\"לתרומה\",\"k11\":\"Your gift\",\"k12\":\"התרומה שלך\"}");
console.log('OK site-vocab-strings');
