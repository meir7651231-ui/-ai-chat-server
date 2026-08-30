import { emptyTelephonyConfig as __pure_emptyTelephonyConfig } from './empty-telephony-config.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_emptyTelephonyConfig_EMPTY_TELEPHONY_CONFIG_T = {
  k1: "קו ראשי",
  k2: "sim",
};
const emptyTelephonyConfig = (...a) => __pure_emptyTelephonyConfig(...a, ...Array(Math.max(0, 0 - a.length)).fill(undefined), __d_emptyTelephonyConfig_EMPTY_TELEPHONY_CONFIG_T);
if (JSON.stringify(emptyTelephonyConfig()) !== "{\"numbers\":[{\"id\":\"n1\",\"e164\":\"\",\"label\":\"קו ראשי\",\"kind\":\"sim\"}],\"officeDays\":[0,1,2,3,4],\"officeStart\":\"09:00\",\"officeEnd\":\"17:00\",\"officeExt\":\"101\",\"managerExt\":\"201\",\"vmBox\":\"100\",\"city\":\"\",\"kosherMode\":false,\"hebrewCalendar\":true,\"zmanim\":false,\"shabbat\":true,\"fasts\":false,\"voicemail\":true}") { console.error('✗ סטה'); process.exit(1); }
console.log('✓ empty-telephony-config: צילום-גטר — ירוק');
