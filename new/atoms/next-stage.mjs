/** חוט · next-stage — השלב הבא בשרשרת מעקב-הטיפול (עין), null בשלב האחרון.
 *  חוזה: next-stage.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:56-61; השכנים stageIndex (מיקום-בסדר)
 *  והקבוע AYIN_STAGES (סדר-השלבים) הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function nextStage(stage, stageIndex, AYIN_STAGES) {
  const i = stageIndex(stage);
  return i < AYIN_STAGES.length - 1 ? AYIN_STAGES[i + 1] : null;
}
