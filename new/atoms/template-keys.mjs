/** חוט · template-keys — גזירת רשימת-המפתחות מהגדרות-התבניות (סדר-ההגדרה נשמר).
 *  חוזה: template-keys.contract.md
 *  מוצא: maor/src/lib/templates.ts:54-56 (‏TEMPLATE_KEYS = TEMPLATE_DEFS.map);
 *  קבוע-השכן TEMPLATE_DEFS הוזרק כשקע defs (חוק-1). */
export function templateKeys(defs) {
  return defs.map((d) => d.key);
}
