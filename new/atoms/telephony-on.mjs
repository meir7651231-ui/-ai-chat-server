/** חוט · telephony-on — מודול-הטלפוניה פעיל רק על enabled:true מפורש (opt-in, חסר=כבוי).
 *  חוזה: telephony-on.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:90-92. אפס import פנימי. */
export function telephonyOn(cfg) {
  return cfg.telephony?.enabled === true;
}
