/** קופסת-חיבורים · lib-cloud-config — קונפיג-הארגון בפלטפורמה (CLOUD2): מסמך-הארגון
 *  החי, החברים, כספת-הסודות, בקשות-ההרשמה/ההצטרפות, הלידים, וצ׳אטי התמיכה/הצוות.
 *  חוזה: lib-cloud-config.contract.md · מקור-האמת (L4): maor/src/lib/cloudConfig.ts.
 *  זה המקום היחיד שבו חוטי-הענן-האלה נפגשים (חוקי-החשמלאי, LAW.md): כל קריאת-שכן
 *  שבמקור (cloudDb·firestore·sanitizeSupportText·writeOrgCloudDoc) = הזרקת-שקע כאן.
 *  הקופסה מייבאת אך-ורק אטומים (חוק-2), ואינה צורבת שום ידית-ענן/סוד (חוק-6):
 *  שקעי-ה-IO (Firestore + ה-db) חיים בלוח-האם, מוזרקים כאובייקט `cloud`. */

// ── שמות-האוספים (קבועי-מנגנון — אטומי-ערך) ──
import { PLATFORM_ORGS } from '../atoms/platform-orgs.mjs';
import { PLATFORM_REQUESTS } from '../atoms/platform-requests.mjs';
import { PLATFORM_LEADS } from '../atoms/platform-leads.mjs';
import { SUPPORT_CHATS } from '../atoms/support-chats.mjs';
import { TEAM_CHATS } from '../atoms/team-chats.mjs';
import { ORG_SECRET_KEYS } from '../atoms/org-secret-keys.mjs';
import { SUPPORT_MSG_MAX } from '../atoms/support-msg-max.mjs';

// ── חוטי-הענן (כולם: cloudDb+firestore הוזרקו כשקע-fs באטום) ──
import { fetchOrgCloudConfig as fetchOrgCloudConfigAtom } from '../atoms/fetch-org-cloud-config.mjs';
import { watchOrgCloudConfig as __pure_watchOrgCloudConfig } from '../atoms/watch-org-cloud-config.mjs';
import { WATCH_ORG_CLOUD_CONFIG_T as __d_watchOrgCloudConfig_WATCH_ORG_CLOUD_CONFIG_T } from '../atoms/watch-org-cloud-config-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const watchOrgCloudConfigAtom = (...a) => __pure_watchOrgCloudConfig(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_watchOrgCloudConfig_WATCH_ORG_CLOUD_CONFIG_T);
import { writeOrgCloudDoc as writeOrgCloudDocAtom } from '../atoms/write-org-cloud-doc.mjs';
import { writeOrgCloudConfig as writeOrgCloudConfigAtom } from '../atoms/write-org-cloud-config.mjs';
import { writeOrgSecrets as writeOrgSecretsAtom } from '../atoms/write-org-secrets.mjs';
import { readOrgSecretsMeta as readOrgSecretsMetaAtom } from '../atoms/read-org-secrets-meta.mjs';
import { deleteOrgRequest as deleteOrgRequestAtom } from '../atoms/delete-org-request.mjs';
import { writeOrgRequest as writeOrgRequestAtom } from '../atoms/write-org-request.mjs';
import { fetchOrgRequests as fetchOrgRequestsAtom } from '../atoms/fetch-org-requests.mjs';
import { findMemberOrgSlugs as findMemberOrgSlugsAtom } from '../atoms/find-member-org-slugs.mjs';
import { fetchAllOrgs as fetchAllOrgsAtom } from '../atoms/fetch-all-orgs.mjs';
import { writeOrgJoinRequest as writeOrgJoinRequestAtom } from '../atoms/write-org-join-request.mjs';
import { fetchOrgJoinRequests as fetchOrgJoinRequestsAtom } from '../atoms/fetch-org-join-requests.mjs';
import { deleteOrgJoinRequest as deleteOrgJoinRequestAtom } from '../atoms/delete-org-join-request.mjs';
import { deleteOrgMemberConfig as deleteOrgMemberConfigAtom } from '../atoms/delete-org-member-config.mjs';
import { clearEmployeeField as clearEmployeeFieldAtom } from '../atoms/clear-employee-field.mjs';
import { addOrgMember as addOrgMemberAtom } from '../atoms/add-org-member.mjs';
import { removeOrgMember as removeOrgMemberAtom } from '../atoms/remove-org-member.mjs';
import { deleteOrgCompletely as deleteOrgCompletelyAtom } from '../atoms/delete-org-completely.mjs';
import { writeOrgLead as writeOrgLeadAtom } from '../atoms/write-org-lead.mjs';
import { fetchOrgLeads as fetchOrgLeadsAtom } from '../atoms/fetch-org-leads.mjs';
import { sendSupportMessage as sendSupportMessageAtom } from '../atoms/send-support-message.mjs';
import { sendSupportReply as sendSupportReplyAtom } from '../atoms/send-support-reply.mjs';
import { watchSupportMessages as __pure_watchSupportMessages } from '../atoms/watch-support-messages.mjs';
import { WATCH_SUPPORT_MESSAGES_T as __d_watchSupportMessages_WATCH_SUPPORT_MESSAGES_T } from '../atoms/watch-support-messages-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const watchSupportMessagesAtom = (...a) => __pure_watchSupportMessages(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_watchSupportMessages_WATCH_SUPPORT_MESSAGES_T);
import { watchSupportThreadMeta as __pure_watchSupportThreadMeta } from '../atoms/watch-support-thread-meta.mjs';
import { WATCH_ALL_SUPPORT_THREADS_T as __d_watchSupportThreadMeta_WATCH_SUPPORT_THREAD_META_T } from '../atoms/watch-all-support-threads-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const watchSupportThreadMetaAtom = (...a) => __pure_watchSupportThreadMeta(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_watchSupportThreadMeta_WATCH_SUPPORT_THREAD_META_T);
import { watchAllSupportThreads as __pure_watchAllSupportThreads } from '../atoms/watch-all-support-threads.mjs';
import { WATCH_ALL_SUPPORT_THREADS_T as __d_watchAllSupportThreads_WATCH_ALL_SUPPORT_THREADS_T } from '../atoms/watch-all-support-threads-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const watchAllSupportThreadsAtom = (...a) => __pure_watchAllSupportThreads(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_watchAllSupportThreads_WATCH_ALL_SUPPORT_THREADS_T);
import { markSupportRead as markSupportReadAtom } from '../atoms/mark-support-read.mjs';
import { sendTeamMessage as sendTeamMessageAtom } from '../atoms/send-team-message.mjs';
import { watchTeamMessages as __pure_watchTeamMessages } from '../atoms/watch-team-messages.mjs';
import { WATCH_TEAM_MESSAGES_T as __d_watchTeamMessages_WATCH_TEAM_MESSAGES_T } from '../atoms/watch-team-messages-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const watchTeamMessagesAtom = (...a) => __pure_watchTeamMessages(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_watchTeamMessages_WATCH_TEAM_MESSAGES_T);
import { sanitizeSupportText as sanitizeSupportTextAtom } from '../atoms/sanitize-support-text.mjs';

// ── שכן-מחווט: ניקוי-הטקסט. במקור sendSupportMessage/Reply/TeamMessage מייבאים את
//    sanitizeSupportText מ-supportChat — כאן זו הזרקת-שקע (חוק-3), והתקרה SUPPORT_MSG_MAX
//    (=2000, מקביל ל-Rules) מוזרקת ע"י הקופסה, לא צרובה באטום. ──
const wiredSanitize = (raw) => sanitizeSupportTextAtom(raw, SUPPORT_MSG_MAX);

// ── החשיפה (קבועים — ביט-זהה ל-export-ים של cloudConfig.ts) ──
export { PLATFORM_ORGS, PLATFORM_REQUESTS, PLATFORM_LEADS, ORG_SECRET_KEYS, SUPPORT_CHATS, TEAM_CHATS };

/* ── מסמך-הארגון (platformOrgs/{slug}) ──
   שקע-ה-IO `cloud` = אובייקט-Firestore מוזרק (db + doc/getDoc/getDocs/setDoc/…);
   האטומים מקבלים אותו כ-fs (מפרקים רק את מה שהם צורכים). */
export const fetchOrgCloudConfig = (slug, cloud) => fetchOrgCloudConfigAtom(slug, cloud.db, cloud);
export const watchOrgCloudConfig = (slug, cb, cloud) => watchOrgCloudConfigAtom(slug, cb, cloud);
export const writeOrgCloudDoc = (slug, data, cloud) => writeOrgCloudDocAtom(slug, data, cloud);
// חיווט-פנימי גלוי: writeOrgCloudConfig עוטף את writeOrgCloudDoc של הקופסה (חוק-3 —
// במקור זו קריאה-לשכן; כאן היא מפורשת: אותה כתיבה, אותו merge, אותו cloud).
export const writeOrgCloudConfig = (slug, config, cloud) =>
  writeOrgCloudConfigAtom(slug, config, (s, data) => writeOrgCloudDocAtom(s, data, cloud));

/* ── כספת-הסודות פר-ארגון (orgSecrets/{slug} + orgSecretsMeta/{slug}) ──
   allowlist-המפתחות ORG_SECRET_KEYS מוזרק ע"י הקופסה (הכרעת-חיווט; באטום = שקע keys). */
export const writeOrgSecrets = (slug, patch, cloud) => writeOrgSecretsAtom(slug, patch, ORG_SECRET_KEYS, cloud);
export const readOrgSecretsMeta = (slug, cloud) => readOrgSecretsMetaAtom(slug, cloud);

/* ── בקשות-הרשמה (platformRequests/{uid}) ── */
export const deleteOrgRequest = (uid, cloud) => deleteOrgRequestAtom(uid, cloud);
export const writeOrgRequest = (uid, req, cloud) => writeOrgRequestAtom(uid, req, cloud);
export const fetchOrgRequests = (cloud) => fetchOrgRequestsAtom(cloud.db, cloud);

/* ── ניתוב-עצמי + לוח-הבקרה (platformOrgs) ── */
export const findMemberOrgSlugs = (email, cloud) => findMemberOrgSlugsAtom(email, cloud);
export const fetchAllOrgs = (cloud) => fetchAllOrgsAtom(cloud);

/* ── בקשות-הצטרפות של עובדות (platformOrgs/{slug}/joinRequests/{uid}) ── */
export const writeOrgJoinRequest = (slug, uid, req, cloud) => writeOrgJoinRequestAtom(slug, uid, req, cloud);
export const fetchOrgJoinRequests = (slug, cloud) => fetchOrgJoinRequestsAtom(slug, cloud.db, cloud);
export const deleteOrgJoinRequest = (slug, uid, cloud) => deleteOrgJoinRequestAtom(slug, uid, cloud);

/* ── כרטיס-העובד + חברות (memberConfigs / members) ── */
export const deleteOrgMemberConfig = (slug, email, cloud) => deleteOrgMemberConfigAtom(slug, email, cloud);
export const clearEmployeeField = (slug, email, field, cloud) => clearEmployeeFieldAtom(slug, email, field, cloud);
export const addOrgMember = (slug, email, cloud) => addOrgMemberAtom(slug, email, cloud);
export const removeOrgMember = (slug, email, cloud) => removeOrgMemberAtom(slug, email, cloud);

/* ── מחיקת-לקוח מלאה (entityCols מוזרק ע"י הקורא — ENTITY_COLLECTIONS) ── */
export const deleteOrgCompletely = (slug, entityCols, cloud) => deleteOrgCompletelyAtom(slug, entityCols, cloud);

/* ── לידים "נחזור אליכם" (platformLeads) ── */
export const writeOrgLead = (lead, cloud) => writeOrgLeadAtom(lead, cloud);
export const fetchOrgLeads = (cloud) => fetchOrgLeadsAtom(cloud.db, cloud);

/* ── צ׳אט-תמיכה חי (supportChats/{uid}) — sanitizeSupportText מחווט בקופסה ── */
export const sendSupportMessage = (uid, meta, text, cloud) => sendSupportMessageAtom(uid, meta, text, cloud, wiredSanitize);
export const sendSupportReply = (uid, text, cloud) => sendSupportReplyAtom(uid, text, wiredSanitize, cloud);
export const watchSupportMessages = (uid, cb, cloud) => watchSupportMessagesAtom(uid, cb, cloud);
export const watchSupportThreadMeta = (uid, cb, cloud) => watchSupportThreadMetaAtom(uid, cb, cloud);
export const watchAllSupportThreads = (cb, cloud) => watchAllSupportThreadsAtom(cb, cloud);
export const markSupportRead = (uid, side, cloud) => markSupportReadAtom(uid, side, cloud);

/* ── צ׳אט-צוות תוך-ארגוני (teamChats/{slug}) — sanitizeSupportText מחווט בקופסה ── */
export const sendTeamMessage = (slug, sender, name, text, cloud) => sendTeamMessageAtom(slug, sender, name, text, wiredSanitize, cloud);
export const watchTeamMessages = (slug, cb, cloud) => watchTeamMessagesAtom(slug, cb, cloud);
