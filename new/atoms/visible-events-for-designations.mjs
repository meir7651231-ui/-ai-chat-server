/** חוט · visible-events-for-designations — סינון אירועי-לוח לעובד/ת מוגבל/ת-ייעוד.
 *  חוזה: visible-events-for-designations.contract.md
 *  שקע (חוק-1, אפס-import): isSupVisible(sup, allowed) => boolean — ראוּת-תורם.
 *  מוצא: maor/src/components/supporters/lib.ts:98-110 · קריאה-לשכן supporterVisibleForDesignations ⇒ שקע. */
export function visibleEventsForDesignations(events, supporters, allowed, isSupVisible) {
  if (!allowed || !allowed.length) return events;
  const byId = new Map(supporters.map((s) => [s.id, s]));
  return events.filter((ev) => {
    if (!ev.spId) return true; // אירוע לא-מקושר-לתורם — לא בתחום-ההגבלה
    const sp = byId.get(ev.spId);
    return sp ? isSupVisible(sp, allowed) : false;
  });
}
