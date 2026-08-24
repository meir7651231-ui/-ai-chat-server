/** חוט · punch-confirm-step — צעד במכונת-המצבים של אישור-הניקוב-הכפול (טהור).
 *  חוזה: punch-confirm-step.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:572-591 (תורגם TS→JS);
 *  אפס שקעים — now מוזרק (אין Date.now). ratchet: legacy-main-script.js:330-342. */
export const PUNCH_CONFIRM_MS = 3000;

export function punchConfirmStep(confirmOn, armed, enrollmentId, now) {
  if (!confirmOn) return { fire: true, next: null };
  if (armed && armed.id === enrollmentId && now - armed.armedAt <= PUNCH_CONFIRM_MS) {
    return { fire: true, next: null };
  }
  // אין זריון / שיבוץ אחר / החלון פג — מזיינים (מחדש) את השיבוץ הנוכחי
  return { fire: false, next: { id: enrollmentId, armedAt: now } };
}
