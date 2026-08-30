// בדיקת-צילום · overdue-contact-task-drafts-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { OVERDUE_CONTACT_TASK_DRAFTS_T } from './overdue-contact-task-drafts-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(OVERDUE_CONTACT_TASK_DRAFTS_T), "{\"k1\":\"supporter\",\"k2\":\"📞 להתקשר — \"}");
console.log('OK overdue-contact-task-drafts-strings');
