import * as m from './manual-driver.mjs';
const SNAP = {"manualDriver":"{\"id\":\"manual\",\"label\":\"חיוג בלחיצה (טלפון קיים)\",\"capabilities\":{\"autoDial\":false,\"record\":false,\"screenPop\":true}}"};
let f = 0;
for (const [k, s] of Object.entries(SNAP)) if (JSON.stringify(m[k]) !== s) { console.error('✗ ' + k + ' סטה מהצילום'); f = 1; }
// callHref — נבדק על מסלול-תקין (הצילום דילג עליו כי JSON משמיט פונקציות); דוגמאות-מקור מ-callbtn-telephony.test.ts
const cases = [['050-123-4567', 'tel:0501234567'], ['+972 50-1234567', 'tel:+972501234567'], ['', null], ['12', null], ['ללא', null]];
for (const [inp, exp] of cases) {
    const got = m.manualDriver.callHref(inp);
    if (got !== exp) { console.error('✗ callHref(' + JSON.stringify(inp) + ') = ' + JSON.stringify(got) + ' ≠ ' + JSON.stringify(exp)); f = 1; }
}
if (f) process.exit(1); console.log('✓ manual-driver: צילום-ערך + callHref תואמים — ירוק');
