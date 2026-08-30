/** חוט · default-prices — טבלת-מחירי-ברירת-המחדל של מנוע-התמחור. חוזה: default-prices.contract.md
 *  חולץ כלשונו מ-maor/src/lib/pricing.ts:57-75; הקבוע-השכן
 *  DEFAULT_INTEGRATION_PRICES הוזרק כשקע ⇒ קבוע הפך למפעל (חוק-1 — אפס import פנימי). */
export function defaultPrices(integrationPrices, T) {
  return {
    base: T.k1, // ליבה: בית · משפחות · לוח · הגדרות (CRM בסיסי)
    modules: {
      families: 0, // כלול בבסיס (CRM ליבה)
      calendar: 0, // כלול בבסיס
      courses: T.k2, // חוגים · שיבוצים · נוכחות — מודול כבד
      diary: T.k3,
      supporters: T.k4, // תורמים + קבלות §46 — הערך הגבוה ביותר
      reports: T.k5,
      tzedaka: T.k6,
      shop: T.k6,
      shop7: T.k7, // חלוקה
    },
    integrations: integrationPrices,
    sizeMult: { small: 1, medium: 1.6, large: 2.4 },
    setup: T.k8, // הקמה/הטמעה חד-פעמית — נורמת-שוק (הבעלים יכול לאפס כמנוף-מכירה)
    enterprise: { oneTime: T.k9, annualMaintenance: T.k10 },
  };
}
