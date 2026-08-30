// בדיקת-צילום · signals-strings
import { S } from '../atoms/signals-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(S), "{\"k0\":\"ללא שם\",\"k1\":\"firstgift\",\"k2\":\"תורם חדש · מתנה ראשונה\",\"k3\":\"reactivated\",\"k4\":\"חזר לתת אחרי \",\"k5\":\" חודשי-שקט\",\"k6\":\"drop\",\"k7\":\"מתנה אחרונה נמוכה ב-\",\"k8\":\"% מהרגיל\",\"k9\":\"jump\",\"k10\":\"מתנה אחרונה פי-\",\"k11\":\" מהרגיל\",\"k12\":\"lapsing\",\"k13\":\"שקט \",\"k14\":\" חודשים\"}");
console.log('OK signals-strings');
