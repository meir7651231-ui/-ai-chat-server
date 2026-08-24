# חוזה · חוט explain-call
**תפקיד:** סימולטור-שיחה חי (item 16) — תיאור-אנושי **בעברית** של מה
שמתקשר יחווה: מריץ את שקע-הסימולציה ומתרגם את המסלול לסיפור קריא
(אימוג'י + שורות). טהור, דטרמיניסטי (הזמן נמסר). מכסה חיוג-יוצא/כשר ·
מוקד-מצוקה · שבעה · הכרזה · שעות/חג · IVR · תור · חסימה · אחרי-שעות (F11:
מודע-voicemail — כבוי ⇒ צליל-תפוס).
**שקעים (חוק-1 — השכנים הוזרקו כאובייקט eng):**
- ‏eng.simulateCall(tenant, call, opts) ⇒ ‏{path:string[], outcome:string,
  reason?:string} — הסימולטור (במקור: אותו קובץ).
- ‏eng.featureOn(tenant, key) ⇒ boolean — דגל-פיצ'ר (נשאל רק על 'voicemail'
  במסלול afterhours; במקור: ‏config.mjs).
**קלט:** ‏tenant · ‏call (ברירת-מחדל ‏{}) · ‏opts (ברירת-מחדל ‏{}) · ‏eng.
**פלט:** ‏{outcome, reason, summary, lines, sim} — ‏sim הוא **אותו אובייקט**
שהשקע החזיר (זהות-הפניה); ‏summary = ‏lines.join(' ').
**דוגמאות מחייבות** (סימולטור מזויף שמחזיר sim קבוע):
1. ‏sim={path:['open','office'],outcome:'office',reason:'שעות-פעילות'} ·
   ‏tenant.destinations.office.ext=['101','102'] ⇒ ‏lines=
   ‏['✅ בשעות-פעילות → מצלצל במשרד (101, 102).'] · ‏reason='שעות-פעילות' ·
   ‏out.sim===sim, והשקע נקרא פעם אחת עם ‏(tenant, call, opts) עצמם.
2. ‏call={callerId:'0501234567',dow:2,hhmm:'10:00'} ⇒ השורה הראשונה
   ‏'📲 מתקשר 0501234567 · יום שלישי 10:00' (‏DOW_HE[2]='שלישי').
3. סיבה ספציפית מוצגת, גנרית לא: ‏sim.outcome='voicemail' · ‏sim.reason='חג'
   · ‏manager.ext='200' · ‏voicemail.box='300' ⇒
   ‏'🌙 מחוץ-לשעות (חג) → מנהל (200) → תא-קולי (300).' ; ואילו
   ‏reason='מחוץ-לשעות' ⇒ בלי סוגריים: ‏'🌙 מחוץ-לשעות → מנהל (200) → תא-קולי (300).'
4. ‏F11: ‏sim={path:['open','office','manager'],outcome:'afterhours',reason:''}
   · ‏featureOn⇒false ⇒ ‏'🌙 אין-מענה במשרד → מנהל (—) → צליל-תפוס (אין תא-קולי).'
   (יעדים חסרים ⇒ '—'); ‏featureOn⇒true ⇒ ‏'... → תא-קולי.' ; ‏path כולל
   ‏'ivr-invalid' ⇒ הטריגר 'בחירה לא-תקינה ב-IVR'.
5. חיוג-יוצא: ‏call={direction:'outbound',did:'035551234'} ·
   ‏sim.outcome='via:sim1' ⇒ ‏lines=['📞 חיוג-יוצא: 035551234','✅ יוצא דרך: sim1']
   · ‏reason='' תמיד במסלול-יוצא; ‏outcome='non-kosher-blocked' ⇒
   ‏'⛔ מצב-כשר: ניסיון-יציאה דרך SIM לא-כשר — נחסם.'
6. בחירת-IVR (default): ‏sim.outcome='ivr:office' ⇒ ‏'✅ בחירת-IVR → office.' ;
   ‏outcome לא-מוכר 'zzz' ⇒ ‏'תוצאה: zzz'.
7. ‏summary=lines.join(' '): בדוגמה 2+1 ‏summary =
   ‏'📲 מתקשר 0501234567 · יום שלישי 10:00 ✅ בשעות-פעילות → מצלצל במשרד (101, 102).'
**מוצא:** maor/telephony/lib/simulate.mjs:231-302 (המקור הטהור, 677 בדיקות-מנוע;
‏maor/src/lib/telephony/engine.ts:87-91 הוא רק re-export מוקלד — הטיוטה הצביעה
עליו). השכנים simulateCall+featureOn הפכו לשקעי-eng (חוק-1); העוזרים הפרטיים
DOW_HE+closedTag נשארו בקובץ (חלק מהיחידה).
