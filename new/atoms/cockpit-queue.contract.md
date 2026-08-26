# חוזה · cockpit-queue

**תפקיד:** שלוש קבוצות + tasks מאוחד (שיחות→תודות→הו״ק) + total.
**מוצא:** `maor-system/src/components/supporters/cockpit.ts:250`. חוק-4: התנהגות verbatim (אחים-פרטיים הוטבעו inline).
**חתימה:** `cockpitQueue(supporters, todayIso, rate=3.7, {cockpitCalls,cockpitThanks,cockpitHokTasks}) => CockpitQueue`
**שקעים (deps):** cockpitCalls·cockpitThanks·cockpitHokTasks (אחים) — מוזרקים כפרמטר-אובייקט (חוק-1: אפס import-אטום).
**Golden:** `cockpit-queue.test.mjs` — פיקסטורת-4-תורמים + שקעים-מדומים דטרמיניסטיים + חיווט-אחים; פלט נלכד מהרצה.
