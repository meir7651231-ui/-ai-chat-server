import * as m from './a11-y-fab-toggles.mjs';
const SNAP = {"A11Y_FAB_TOGGLES":"[[\"contrast\",\"ניגודיות גבוהה\"],[\"links\",\"הדגשת כפתורים וקישורים\"],[\"noanim\",\"עצירת אנימציות ותנועה\"],[\"spacing\",\"ריווח טקסט מוגדל\"]]"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
if (f) process.exit(1); console.log('✓ a11-y-fab-toggles: צילום-ערך תואם — ירוק');
