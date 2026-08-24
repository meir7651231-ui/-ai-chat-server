/** חוט · is-super-admin — האם מייל-על (trim+lowercase מול רשימה מוזרקת). חוזה: is-super-admin.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:729-733; הקבוע-השכן SUPER_ADMIN_EMAILS
 *  הוזרק כשקע (חוק-1) — זהות/מיילים הם חיווט-הצבה, לא אטום (חוק-6). */
export function isSuperAdmin(email, superAdminEmails) {
  const e = (email || '').trim().toLowerCase();
  return !!e && superAdminEmails.includes(e);
}
