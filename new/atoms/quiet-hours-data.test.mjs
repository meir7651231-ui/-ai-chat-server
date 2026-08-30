// בדיקת-צילום · quiet-hours-data (ערכים מלאים — מוטציה מאדימה)
import * as D from '../atoms/quiet-hours-data.mjs';
import assert from 'node:assert';
const norm = (v) => v instanceof Set || v instanceof Map ? [...v] : v;
const got = {}; for (const k of Object.keys(D).sort()) got[k] = norm(D[k]);
assert.strictEqual(JSON.stringify(got), "{\"PREFIX_TZ\":[{\"p\":\"+972\",\"off\":3,\"label\":\"ישראל\"},{\"p\":\"+1\",\"off\":-5,\"label\":\"ארה״ב/קנדה\"},{\"p\":\"+44\",\"off\":0,\"label\":\"בריטניה\"},{\"p\":\"+33\",\"off\":1,\"label\":\"צרפת\"},{\"p\":\"+32\",\"off\":1,\"label\":\"בלגיה\"},{\"p\":\"+41\",\"off\":1,\"label\":\"שווייץ\"},{\"p\":\"+61\",\"off\":10,\"label\":\"אוסטרליה\"},{\"p\":\"+7\",\"off\":3,\"label\":\"רוסיה\"},{\"p\":\"+380\",\"off\":2,\"label\":\"אוקראינה\"}],\"QUIET_FROM\":21,\"QUIET_TO\":8}");
console.log('OK quiet-hours-data');
