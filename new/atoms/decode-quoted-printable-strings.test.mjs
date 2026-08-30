// בדיקת-צילום · decode-quoted-printable-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DECODE_QUOTED_PRINTABLE_T } from './decode-quoted-printable-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DECODE_QUOTED_PRINTABLE_T), "{\"k1\":\"QUOTED-PRINTABLE\",\"k2\":\"נייד\",\"k3\":\"בית\",\"k4\":\"עבודה\",\"k5\":\"פקס\",\"k6\":\"ראשי\",\"k7\":\"X-CUSTOM\",\"k8\":\"utf-8\",\"k9\":255,\"k10\":63}");
console.log('OK decode-quoted-printable-strings');
