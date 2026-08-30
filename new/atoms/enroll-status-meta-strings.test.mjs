// בדיקת-צילום · enroll-status-meta-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { ENROLL_STATUS_META_T } from './enroll-status-meta-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(ENROLL_STATUS_META_T), "{\"k1\":\"paused\",\"k2\":\"מוקפא\",\"k3\":\"#fdf1d4\",\"k4\":\"ended\",\"k5\":\"הסתיים\",\"k6\":\"#eceae2\",\"k7\":\"wait\",\"k8\":\"רשימת-המתנה ⏳\",\"k9\":\"#e7edf5\",\"k10\":\"פעיל\"}");
console.log('OK enroll-status-meta-strings');
