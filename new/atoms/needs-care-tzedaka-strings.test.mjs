// בדיקת-צילום · needs-care-tzedaka-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { NEEDS_CARE_TZEDAKA_T } from './needs-care-tzedaka-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(NEEDS_CARE_TZEDAKA_T), "{\"k1\":\"entity.tzBox\",\"k2\":\"קופה\",\"k3\":\"stale\",\"k4\":\" לא רוקנה מזמן\",\"k5\":\"ריקון אחרון: \",\"k6\":\"מעולם לא רוקנה (מאז \",\"k7\":\"lost\",\"k8\":\" מסומנת כאבודה\",\"k9\":\"לברר או להוציא משימוש\",\"k10\":\"home\",\"k11\":\"inactiveCoord\",\"k12\":\" אינו פעיל אך עדיין עם \",\"k13\":\" קופות בבתים\",\"k14\":\"להעביר לרכז אחר או להחזיר למשרד\",\"k15\":\"campaignEnding\",\"k16\":\"המבצע \\\"\",\"k17\":\"\\\" מסתיים ב-\",\"k18\":\"לסכם ולסגור\",\"k19\":14}");
console.log('OK needs-care-tzedaka-strings');
