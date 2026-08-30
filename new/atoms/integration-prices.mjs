/** אטום-דאטה · integration-prices — מחירון-ברירת-המחדל של ההרחבות (builder/handoff) (הכרעה 19: משמעות = דאטה; הקופסה מחווטת). חוזה: integration-prices.contract.md */
export const DEFAULT_INTEGRATION_PRICES = {
  receipts: 60, // קבלות §46 אוטומטיות — ערך-ציות גבוה
  payments: 90, // סליקה והוראות-קבע
  whatsapp: 50,
  sms: 40, // דמי-מודול (עלות-הודעה בפועל נגבית בנפרד)
  phone: 90, // טלפוניה/מרכזייה
  gcal: 30,
  drive: 30,
  sheets: 40,
  maps: 40,
  esign: 60, // חתימה דיגיטלית
  ai: 120, // עוזר-חכם — פרימיום
  campaign: 60,
};
