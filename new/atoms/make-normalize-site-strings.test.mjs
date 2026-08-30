// בדיקת-צילום · make-normalize-site-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { MAKE_NORMALIZE_SITE_T } from './make-normalize-site-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MAKE_NORMALIZE_SITE_T), "{\"k1\":\"string\",\"k2\":\"object\",\"k3\":\"number\",\"k4\":\"heroTitle\",\"k5\":\"brandLine\",\"k6\":\"heroBadge\",\"k7\":\"titleAccent\",\"k8\":\"servicesHeading\",\"k9\":\"microCopy\",\"k10\":\"ticker\",\"k11\":\"storyTitle\",\"k12\":\"storyTitleAccent\",\"k13\":\"storyBadge\",\"k14\":\"donateNote\",\"k15\":24,\"k16\":12,\"k17\":200,\"k18\":60,\"k19\":120,\"k20\":30,\"k21\":80,\"k22\":240,\"k23\":800,\"k24\":2000,\"k25\":160,\"k26\":40,\"k27\":100,\"k28\":400,\"k29\":20,\"k30\":600,\"k31\":10}");
console.log('OK make-normalize-site-strings');
