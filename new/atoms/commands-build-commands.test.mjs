import { buildCommands as __pure_buildCommands } from './commands-build-commands.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הטיהור v3)
const __d_buildCommands_COMMANDS_BUILD_COMMANDS_T = {
  k1: "cmd:add",
  k2: "add",
  k3: "➕ הוספת ",
  k4: "פעולה",
  k5: "הוספה חדש חדשה תורם add new",
  k6: "cmd:work",
  k7: "work",
  k8: "🎯 חלון העבודה",
  k9: "ניווט",
  k10: "קוקפיט משימות עבודה היום cockpit",
  k11: "cmd:data",
  k12: "data",
  k13: "☰ מסך הנתונים",
  k14: "טבלה נתונים רשימה סינון data",
  k15: "cmd:import",
  k16: "import",
  k17: "⬆ ייבוא מקובץ CSV",
  k18: "ייבוא csv excel קובץ import",
  k19: "cmd:customreport",
  k20: "customreport",
  k21: "📊 דו״ח מותאם",
  k22: "דוח מותאם ייצוא טווח report export",
  k23: "cmd:dedup",
  k24: "dedup",
  k25: "🔗 איחוד כפולים · ",
  k26: "כפולים מיזוג איחוד dedup merge",
  k27: "cmd:incoming",
  k28: "incoming",
  k29: "💰 תשלומים נכנסים",
  k30: "תשלומים נכנסים סליקה payments",
  k31: "cmd:nedarim",
  k32: "nedarim",
  k33: "🔄 סנכרון מנדרים",
  k34: "נדרים סנכרון nedarim sync",
  k35: "donor:",
  k36: "openDonor",
  k37: "ללא שם",
  k38: "פתיחת כרטיס",
  k39: "תורם",
};
const f = (...a) => __pure_buildCommands(...a, ...Array(Math.max(0, 1 - a.length)).fill(undefined), __d_buildCommands_COMMANDS_BUILD_COMMANDS_T);
// עצמאי (חוק-1: אפס import-אח; שקעים/פיקסטורות inline). Golden נלכד מהרצה.
const CTX={supporters:[{id:'1',name:'אבי',phone:'050'},{id:'2',name:'',phone:''}],cockpitOn:true,importOn:true,customReportOn:false,dedupCount:2,paymentsOn:false,supporterTerm:'תורם/ת'};
const WANT="[{\"id\":\"cmd:add\",\"kind\":\"add\",\"label\":\"➕ הוספת תורם/ת\",\"group\":\"פעולה\",\"keywords\":\"➕ הוספת תורם/ת הוספה חדש חדשה תורם add new\"},{\"id\":\"cmd:work\",\"kind\":\"work\",\"label\":\"🎯 חלון העבודה\",\"group\":\"ניווט\",\"keywords\":\"🎯 חלון העבודה קוקפיט משימות עבודה היום cockpit\"},{\"id\":\"cmd:data\",\"kind\":\"data\",\"label\":\"☰ מסך הנתונים\",\"group\":\"ניווט\",\"keywords\":\"☰ מסך הנתונים טבלה נתונים רשימה סינון data\"},{\"id\":\"cmd:import\",\"kind\":\"import\",\"label\":\"⬆ ייבוא מקובץ CSV\",\"group\":\"פעולה\",\"keywords\":\"⬆ ייבוא מקובץ csv ייבוא csv excel קובץ import\"},{\"id\":\"cmd:dedup\",\"kind\":\"dedup\",\"label\":\"🔗 איחוד כפולים · 2\",\"group\":\"פעולה\",\"keywords\":\"🔗 איחוד כפולים · 2 כפולים מיזוג איחוד dedup merge\"},{\"id\":\"donor:1\",\"kind\":\"openDonor\",\"arg\":\"1\",\"label\":\"אבי\",\"hint\":\"פתיחת כרטיס\",\"group\":\"תורם\",\"keywords\":\"אבי אבי 050\"},{\"id\":\"donor:2\",\"kind\":\"openDonor\",\"arg\":\"2\",\"label\":\"ללא שם\",\"hint\":\"פתיחת כרטיס\",\"group\":\"תורם\",\"keywords\":\"ללא שם\"}]";
const got=JSON.stringify(f(CTX));
if(got!==WANT){console.error('✗ commands-build-commands\n'+got+'\n≠\n'+WANT);process.exit(1);}
console.log('✓ commands-build-commands: Golden — ירוק');
