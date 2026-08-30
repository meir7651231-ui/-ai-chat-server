// בדיקת-צילום · delete-org-completely-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { DELETE_ORG_COMPLETELY_T } from './delete-org-completely-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(DELETE_ORG_COMPLETELY_T), "{\"k1\":\"donations\",\"k2\":\"auditlog\",\"k3\":\"incomingPayments\",\"k4\":\"smsOutbox\",\"k5\":\"mailOutbox\",\"k6\":\"orgs/\",\"k7\":\"orgSecrets/\",\"k8\":\"orgSecretsMeta/\",\"k9\":\"icsFeeds/\",\"k10\":\"teamChats/\",\"k11\":\"/messages\",\"k12\":\"teamChats\",\"k13\":\"/meta/org\",\"k14\":\"/_enc/envelope\",\"k15\":\"platformOrgs/\",\"k16\":\"/joinRequests\",\"k17\":\"platformOrgs\"}");
console.log('OK delete-org-completely-strings');
