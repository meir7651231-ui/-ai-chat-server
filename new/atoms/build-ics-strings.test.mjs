// בדיקת-צילום · build-ics-strings — המחרוזות זהות ביט-אחר-ביט למקור.
import { BUILD_ICS_T } from './build-ics-strings.mjs';
import assert from 'node:assert';
assert.strictEqual(JSON.stringify(BUILD_ICS_T), "{\"k1\":\"BEGIN:VCALENDAR\",\"k2\":\"VERSION:2.0\",\"k3\":\"CALSCALE:GREGORIAN\",\"k4\":\"METHOD:PUBLISH\",\"k5\":\"X-WR-CALNAME:\",\"k6\":\"BEGIN:VEVENT\",\"k7\":\"UID:\",\"k8\":\"DTSTAMP:\",\"k9\":\"DTSTART:\",\"k10\":\"DTEND:\",\"k11\":\"DTSTART;VALUE=DATE:\",\"k12\":\"DTEND;VALUE=DATE:\",\"k13\":\"SUMMARY:\",\"k14\":\"DESCRIPTION:\",\"k15\":\"LOCATION:\",\"k16\":\"END:VEVENT\",\"k17\":\"END:VCALENDAR\",\"k18\":\"PRODID:-//maor-system//he//\",\"k19\":3600000}");
console.log('OK build-ics-strings');
