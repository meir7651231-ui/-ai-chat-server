// בדיקת-צילום · suggestions-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { SUGGESTIONS_T } from './suggestions-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUGGESTIONS_T), "{\"k1\":\"active\",\"k2\":\"shop\",\"k3\":\"families\",\"k4\":\"courses\",\"k5\":\"punch\",\"k6\":\"הכרטיסייה נגמרה\",\"k7\":\"sug:holiday:\",\"k8\":\"מתנת-חג · \",\"k9\":\" בעוד \",\"k10\":\" ימים\",\"k11\":\"nav.families\",\"k12\":\"משפחות\",\"k13\":\" פעילות — שקלו חלוקת מתנות לקראת החג\",\"k14\":\"sug:school:\",\"k15\":\"ערכת בית-ספר · \",\"k16\":\"בן/בת \",\"k17\":\" — לקראת/בתחילת כיתה א׳\",\"k18\":\"sug:baby:\",\"k19\":\"ערכת תינוק · \",\"k20\":\"entity.familyOf\",\"k21\":\"משפחת\",\"k22\":\" — תינוק/ת חדש/ה ב\",\"k23\":\"entity.family\",\"k24\":\"משפחה\",\"k25\":\"sug:renew:\",\"k26\":\"חידוש כרטיסייה · \",\"k27\":\"נותרו \",\"k28\":\" ניקובים\"}");
console.log('OK suggestions-strings');
