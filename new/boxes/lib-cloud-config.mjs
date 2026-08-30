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
import { fetchOrgCloudConfig as __pure_fetchOrgCloudConfig } from '../atoms/fetch-org-cloud-config.mjs';
import { FETCH_ORG_CLOUD_CONFIG_T as __d_fetch_org_cloud_config_T } from '../atoms/fetch-org-cloud-config-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const fetchOrgCloudConfigAtom = (...a) => __pure_fetchOrgCloudConfig(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_fetch_org_cloud_config_T);
import { watchOrgCloudConfig as __pure_watchOrgCloudConfig } from '../atoms/watch-org-cloud-config.mjs';
import { WATCH_ORG_CLOUD_CONFIG_T as __d_watchOrgCloudConfig_WATCH_ORG_CLOUD_CONFIG_T } from '../atoms/watch-org-cloud-config-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const watchOrgCloudConfigAtom = (...a) => __pure_watchOrgCloudConfig(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_watchOrgCloudConfig_WATCH_ORG_CLOUD_CONFIG_T);
import { writeOrgCloudDoc as __pure_writeOrgCloudDoc } from '../atoms/write-org-cloud-doc.mjs';
import { WRITE_ORG_CLOUD_DOC_T as __d_write_org_cloud_doc_T } from '../atoms/write-org-cloud-doc-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const writeOrgCloudDocAtom = (...a) => __pure_writeOrgCloudDoc(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_write_org_cloud_doc_T);
import { writeOrgCloudConfig as writeOrgCloudConfigAtom } from '../atoms/write-org-cloud-config.mjs';
import { writeOrgSecrets as __pure_writeOrgSecrets } from '../atoms/write-org-secrets.mjs';
import { WRITE_ORG_SECRETS_T as __d_write_org_secrets_T } from '../atoms/write-org-secrets-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const writeOrgSecretsAtom = (...a) => __pure_writeOrgSecrets(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_write_org_secrets_T);
import { readOrgSecretsMeta as __pure_readOrgSecretsMeta } from '../atoms/read-org-secrets-meta.mjs';
import { READ_ORG_SECRETS_META_T as __d_read_org_secrets_meta_T } from '../atoms/read-org-secrets-meta-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const readOrgSecretsMetaAtom = (...a) => __pure_readOrgSecretsMeta(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_read_org_secrets_meta_T);
import { deleteOrgRequest as __pure_deleteOrgRequest } from '../atoms/delete-org-request.mjs';
import { DELETE_ORG_REQUEST_T as __d_delete_org_request_T } from '../atoms/delete-org-request-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const deleteOrgRequestAtom = (...a) => __pure_deleteOrgRequest(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_delete_org_request_T);
import { writeOrgRequest as __pure_writeOrgRequest } from '../atoms/write-org-request.mjs';
import { WRITE_ORG_REQUEST_T as __d_write_org_request_T } from '../atoms/write-org-request-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const writeOrgRequestAtom = (...a) => __pure_writeOrgRequest(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_write_org_request_T);
import { fetchOrgRequests as __pure_fetchOrgRequests } from '../atoms/fetch-org-requests.mjs';
import { FETCH_ORG_REQUESTS_T as __d_fetch_org_requests_T } from '../atoms/fetch-org-requests-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const fetchOrgRequestsAtom = (...a) => __pure_fetchOrgRequests(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_fetch_org_requests_T);
import { findMemberOrgSlugs as __pure_findMemberOrgSlugs } from '../atoms/find-member-org-slugs.mjs';
import { FIND_MEMBER_ORG_SLUGS_T as __d_find_member_org_slugs_T } from '../atoms/find-member-org-slugs-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const findMemberOrgSlugsAtom = (...a) => __pure_findMemberOrgSlugs(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_find_member_org_slugs_T);
import { fetchAllOrgs as __pure_fetchAllOrgs } from '../atoms/fetch-all-orgs.mjs';
import { FETCH_ALL_ORGS_T as __d_fetch_all_orgs_T } from '../atoms/fetch-all-orgs-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const fetchAllOrgsAtom = (...a) => __pure_fetchAllOrgs(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_fetch_all_orgs_T);
import { writeOrgJoinRequest as __pure_writeOrgJoinRequest } from '../atoms/write-org-join-request.mjs';
import { WRITE_ORG_JOIN_REQUEST_T as __d_write_org_join_request_T } from '../atoms/write-org-join-request-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const writeOrgJoinRequestAtom = (...a) => __pure_writeOrgJoinRequest(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_write_org_join_request_T);
import { fetchOrgJoinRequests as __pure_fetchOrgJoinRequests } from '../atoms/fetch-org-join-requests.mjs';
import { FETCH_ORG_JOIN_REQUESTS_T as __d_fetch_org_join_requests_T } from '../atoms/fetch-org-join-requests-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const fetchOrgJoinRequestsAtom = (...a) => __pure_fetchOrgJoinRequests(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_fetch_org_join_requests_T);
import { deleteOrgJoinRequest as __pure_deleteOrgJoinRequest } from '../atoms/delete-org-join-request.mjs';
import { DELETE_ORG_JOIN_REQUEST_T as __d_delete_org_join_request_T } from '../atoms/delete-org-join-request-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const deleteOrgJoinRequestAtom = (...a) => __pure_deleteOrgJoinRequest(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_delete_org_join_request_T);
import { deleteOrgMemberConfig as __pure_deleteOrgMemberConfig } from '../atoms/delete-org-member-config.mjs';
import { DELETE_ORG_MEMBER_CONFIG_T as __d_delete_org_member_config_T } from '../atoms/delete-org-member-config-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const deleteOrgMemberConfigAtom = (...a) => __pure_deleteOrgMemberConfig(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_delete_org_member_config_T);
import { clearEmployeeField as __pure_clearEmployeeField } from '../atoms/clear-employee-field.mjs';
import { CLEAR_EMPLOYEE_FIELD_T as __d_clear_employee_field_T } from '../atoms/clear-employee-field-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const clearEmployeeFieldAtom = (...a) => __pure_clearEmployeeField(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_clear_employee_field_T);
import { addOrgMember as __pure_addOrgMember } from '../atoms/add-org-member.mjs';
import { ADD_ORG_MEMBER_T as __d_add_org_member_T } from '../atoms/add-org-member-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const addOrgMemberAtom = (...a) => __pure_addOrgMember(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_add_org_member_T);
import { removeOrgMember as __pure_removeOrgMember } from '../atoms/remove-org-member.mjs';
import { REMOVE_ORG_MEMBER_T as __d_remove_org_member_T } from '../atoms/remove-org-member-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const removeOrgMemberAtom = (...a) => __pure_removeOrgMember(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_remove_org_member_T);
import { deleteOrgCompletely as __pure_deleteOrgCompletely } from '../atoms/delete-org-completely.mjs';
import { DELETE_ORG_COMPLETELY_T as __d_delete_org_completely_T } from '../atoms/delete-org-completely-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const deleteOrgCompletelyAtom = (...a) => __pure_deleteOrgCompletely(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_delete_org_completely_T);
import { writeOrgLead as __pure_writeOrgLead } from '../atoms/write-org-lead.mjs';
import { WRITE_ORG_LEAD_T as __d_write_org_lead_T } from '../atoms/write-org-lead-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const writeOrgLeadAtom = (...a) => __pure_writeOrgLead(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_write_org_lead_T);
import { fetchOrgLeads as __pure_fetchOrgLeads } from '../atoms/fetch-org-leads.mjs';
import { FETCH_ORG_LEADS_T as __d_fetch_org_leads_T } from '../atoms/fetch-org-leads-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const fetchOrgLeadsAtom = (...a) => __pure_fetchOrgLeads(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_fetch_org_leads_T);
import { sendSupportMessage as __pure_sendSupportMessage } from '../atoms/send-support-message.mjs';
import { SEND_SUPPORT_MESSAGE_T as __d_send_support_message_T } from '../atoms/send-support-message-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const sendSupportMessageAtom = (...a) => __pure_sendSupportMessage(...a, ...Array(Math.max(0, 5 - a.length)).fill(undefined), __d_send_support_message_T);
import { sendSupportReply as __pure_sendSupportReply } from '../atoms/send-support-reply.mjs';
import { SEND_SUPPORT_REPLY_T as __d_send_support_reply_T } from '../atoms/send-support-reply-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const sendSupportReplyAtom = (...a) => __pure_sendSupportReply(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_send_support_reply_T);
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
import { markSupportRead as __pure_markSupportRead } from '../atoms/mark-support-read.mjs';
import { MARK_SUPPORT_READ_T as __d_mark_support_read_T } from '../atoms/mark-support-read-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const markSupportReadAtom = (...a) => __pure_markSupportRead(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_mark_support_read_T);
import { sendTeamMessage as __pure_sendTeamMessage } from '../atoms/send-team-message.mjs';
import { SEND_TEAM_MESSAGE_T as __d_send_team_message_T } from '../atoms/send-team-message-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const sendTeamMessageAtom = (...a) => __pure_sendTeamMessage(...a, ...Array(Math.max(0, 6 - a.length)).fill(undefined), __d_send_team_message_T);
import { watchTeamMessages as __pure_watchTeamMessages } from '../atoms/watch-team-messages.mjs';
import { WATCH_TEAM_MESSAGES_T as __d_watchTeamMessages_WATCH_TEAM_MESSAGES_T } from '../atoms/watch-team-messages-strings.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const watchTeamMessagesAtom = (...a) => __pure_watchTeamMessages(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_watchTeamMessages_WATCH_TEAM_MESSAGES_T);
import { sanitizeSupportText as __pure_sanitizeSupportText } from '../atoms/sanitize-support-text.mjs';
import { SANITIZE_SUPPORT_TEXT_T as __d_sanitize_support_text_T } from '../atoms/sanitize-support-text-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const sanitizeSupportTextAtom = (...a) => __pure_sanitizeSupportText(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_sanitize_support_text_T);

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
