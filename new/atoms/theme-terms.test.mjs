// בדיקת-צילום · theme-terms — המונחים זהים ביט-אחר-ביט למקור.
import { THEME_TERMS } from './theme-terms.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(THEME_TERMS), "{\"k1\":\"מצב לא-מוכר: \",\"k2\":\"חיווט לפיגמנט-לא-קיים: \"}");
console.log('OK theme-terms');
