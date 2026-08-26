# חוזה · cockpit-progress

**תפקיד:** סופר כמה מ-queue.tasks נמצאים ב-doneIds (בעל .has); total=queue.total.
**מוצא:** `maor-system/src/components/supporters/cockpit.ts:263`. חוק-4: התנהגות verbatim.
**חתימה:** `cockpitProgress(queue, doneIds) => {done,total}`
**שקעים (deps):** אין — אטום טהור (מקבל מבני-נתונים מוכנים; אחים פרטיים הוטבעו inline).
**Golden:** ראה `cockpit-progress.test.mjs` — נלכד מהרצת האטום על פיקסטורות מייצגות.
