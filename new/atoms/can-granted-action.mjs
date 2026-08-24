/** חוט · can-granted-action — הרשאת פעולה מוגבלת: מנהל תמיד · אדמין · הדלקה-פר-עובד.
 *  חוזה: can-granted-action.contract.md
 *  חולץ כלשונו מ-maor/src/lib/config.ts:687-696; השכן isAdminUser הוזרק
 *  כשקע (חוק-1 — אפס import פנימי). */
export function canGrantedAction(config, email, isManager, key, isAdminUser) {
    return isManager || isAdminUser(config, email) || config.features?.[key] === true;
}
