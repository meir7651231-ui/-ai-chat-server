// בדיקת-צילום · reenroll-csv-rows-data — הדאטה שחולצה זהה ביט-אחר-ביט למקור (מנוע-הטיהור).
import * as D from './reenroll-csv-rows-data.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(D.head), "[\"תלמיד/ה\",\"משפחה\",\"חוג\",\"נוכחות\",\"חיסורים\",\"יתרה ₪\",\"סטטוס\",\"החלטה\",\"נרשם לשנה הבאה\",\"הערה\"]");
console.log('OK reenroll-csv-rows-data');
