/** חוט · set-employee-override — קביעת כרטיס-עובד: דריסות המייל המנורמל במפת memberConfigs.
 *  חוזה: set-employee-override.contract.md
 *  חולץ כלשונו מ-maor/src/components/platform/lib.ts:256-265; השכן normEmail
 *  הוזרק כשקע (חוק-1 — אפס import פנימי, כתקדים approve-member). */
export function setEmployeeOverride(org, email, override, normEmail) {
    const e = normEmail(email);
    return { memberConfigs: { ...org.memberConfigs, [e]: override } };
}
