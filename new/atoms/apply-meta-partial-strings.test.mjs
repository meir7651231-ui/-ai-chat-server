// בדיקת-צילום · apply-meta-partial-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { APPLY_META_PARTIAL_T } from './apply-meta-partial-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(APPLY_META_PARTIAL_T), "{\"k1\":\"orgName\",\"k2\":\"orgSite\",\"k3\":\"orgDonate\",\"k4\":\"orgGoal\",\"k5\":\"budget\",\"k6\":\"usdRate\",\"k7\":\"audit\",\"k8\":\"notif\",\"k9\":\"reports\",\"k10\":\"attnDone\",\"k11\":\"number\",\"k12\":\"seq\",\"k13\":\"receiptSeq\",\"k14\":\"donationSeq\",\"k15\":\"shopReceiptSeq\"}");
console.log('OK apply-meta-partial-strings');
