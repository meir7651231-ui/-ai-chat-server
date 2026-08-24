import { emptyTelephonyConfig } from './empty-telephony-config.mjs';
if (JSON.stringify(emptyTelephonyConfig()) !== "{\"numbers\":[{\"id\":\"n1\",\"e164\":\"\",\"label\":\"קו ראשי\",\"kind\":\"sim\"}],\"officeDays\":[0,1,2,3,4],\"officeStart\":\"09:00\",\"officeEnd\":\"17:00\",\"officeExt\":\"101\",\"managerExt\":\"201\",\"vmBox\":\"100\",\"city\":\"\",\"kosherMode\":false,\"hebrewCalendar\":true,\"zmanim\":false,\"shabbat\":true,\"fasts\":false,\"voicemail\":true}") { console.error('✗ סטה'); process.exit(1); }
console.log('✓ empty-telephony-config: צילום-גטר — ירוק');
