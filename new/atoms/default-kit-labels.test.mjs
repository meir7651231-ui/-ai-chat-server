import * as m from './default-kit-labels.mjs';
const SNAP = {"DEFAULT_KIT_LABELS":"[\"הטמעת התוצר בסביבת-הלקוח\",\"בדיקת-קבלה מול הלקוח\",\"מסירת חומרי-הדרכה\",\"גיבוי + הרשאות-גישה\",\"חתימת-מסירה\"]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ default-kit-labels: צילום-ערך תואם — ירוק');
