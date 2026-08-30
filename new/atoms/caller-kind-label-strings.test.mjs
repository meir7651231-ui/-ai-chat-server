// בדיקת-צילום · caller-kind-label-strings — המחרוזות שחולצו זהות ביט-אחר-ביט למקור.
import { CALLER_KIND_LABEL_T } from './caller-kind-label-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(CALLER_KIND_LABEL_T), "{\"k1\":\"family\",\"k2\":\"entity.family\",\"k3\":\"משפחה\",\"k4\":\"member\",\"k5\":\"entity.member\",\"k6\":\"בן/בת משפחה\",\"k7\":\"supporter\",\"k8\":\"entity.supporter\",\"k9\":\"תורם/ת\",\"k10\":\"volunteer\",\"k11\":\"entity.volunteer\",\"k12\":\"מתנדב/ת\",\"k13\":\"coordinator\",\"k14\":\"entity.tzCoordinator\",\"k15\":\"רכז/ת\"}");
console.log('OK caller-kind-label-strings');
