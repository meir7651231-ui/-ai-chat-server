// בדיקת-צילום · cloud-meta-keys — ביט-אחר-ביט.
import { META_KEYS } from './cloud-meta-keys.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(META_KEYS), "[\"orgName\",\"orgSite\",\"orgDonate\",\"orgGoal\",\"budget\",\"usdRate\",\"audit\",\"notif\",\"reports\",\"ui\",\"seq\",\"receiptSeq\",\"donationSeq\",\"shopReceiptSeq\",\"attnDone\"]");
console.log('OK cloud-meta-keys');
