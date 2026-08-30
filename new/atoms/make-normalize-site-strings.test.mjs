// בדיקת-צילום · make-normalize-site-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { MAKE_NORMALIZE_SITE_T } from './make-normalize-site-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(MAKE_NORMALIZE_SITE_T), "{\"k1\":\"string\",\"k2\":\"object\",\"k3\":\"number\",\"k4\":\"heroTitle\",\"k5\":\"brandLine\",\"k6\":\"heroBadge\",\"k7\":\"titleAccent\",\"k8\":\"servicesHeading\",\"k9\":\"microCopy\",\"k10\":\"ticker\",\"k11\":\"storyTitle\",\"k12\":\"storyTitleAccent\",\"k13\":\"storyBadge\",\"k14\":\"donateNote\"}");
console.log('OK make-normalize-site-strings');
