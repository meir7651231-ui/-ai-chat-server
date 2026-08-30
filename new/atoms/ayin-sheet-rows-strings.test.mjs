// בדיקת-צילום · ayin-sheet-rows-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { AYIN_SHEET_ROWS_T } from './ayin-sheet-rows-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(AYIN_SHEET_ROWS_T), "{\"k1\":\"תומכת\",\"k2\":\"טלפון\",\"k3\":\"שם למסירה\",\"k4\":\"כמה עיניים\",\"k5\":\"נמסר (כן/לא)\",\"k6\":\"שולם (כן/לא)\",\"k7\":\"תשובה/הערה\",\"k8\":\"עופרת בוצעה (כן/לא)\",\"k9\":\"eyes\",\"k10\":\"answer\",\"k11\":\"done\",\"k12\":\"כן\",\"k13\":\"לא\"}");
console.log('OK ayin-sheet-rows-strings');
