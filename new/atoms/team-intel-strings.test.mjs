// בדיקת-צילום · team-intel-strings
import { S } from '../atoms/team-intel-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(S), "{\"k0\":\"object\",\"k1\":\"string\",\"k2\":\"עובד/ת\",\"k3\":\"סה\\\"כ פעולות\",\"k4\":\"השבוע\",\"k5\":\"שבוע-קודם\",\"k6\":\"מגמה\",\"k7\":\"ימי-פעילות\",\"k8\":\"שקט (ימים)\",\"k9\":\"שעת-שיא\",\"k10\":\"יעד-שבועי\",\"k11\":\"עמידה-ביעד\",\"k12\":\"פעולה-מובילה\",\"k13\":\"ללא פעילות\",\"k14\":\"היום\",\"k15\":\"אתמול\"}");
console.log('OK team-intel-strings');
