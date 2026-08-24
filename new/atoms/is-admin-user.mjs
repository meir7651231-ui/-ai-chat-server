/** חוט · is-admin-user — האם המשתמש מנהל-על (רשימה ריקה=כולם). חוזה: is-admin-user.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:673-686. */
export function isAdminUser(config, email) {
  const admins = config.adminEmails;
  if (!admins || admins.length === 0) return true;
  if (!email) return false;
  const e = email.trim().toLowerCase();
  return admins.some((a) => a.trim().toLowerCase() === e);
}
