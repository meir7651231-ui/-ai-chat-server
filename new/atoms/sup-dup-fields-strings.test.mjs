// בדיקת-צילום · sup-dup-fields-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { SUP_DUP_FIELDS_T } from './sup-dup-fields-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(SUP_DUP_FIELDS_T), "{\"k1\":\"name\",\"k2\":\"שם\",\"k3\":\"phone\",\"k4\":\"טלפון\",\"k5\":\"email\",\"k6\":\"אימייל\",\"k7\":\"idNum\",\"k8\":\"ת\\\"ז\",\"k9\":\"city\",\"k10\":\"עיר\",\"k11\":\"address\",\"k12\":\"כתובת\",\"k13\":\"cat\",\"k14\":\"קטגוריה\",\"k15\":\"forWho\",\"k16\":\"ייעוד\",\"k17\":\"notes\",\"k18\":\"הערות\"}");
console.log('OK sup-dup-fields-strings');
