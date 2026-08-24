/** חוט · plan-demo-cleanup — תכנון ניקוי נתוני-דמו שהתערבבו בנתונים האמיתיים.
 *  חוזה: plan-demo-cleanup.contract.md · טהור ואימוטבילי, אפס-שקעים.
 *  חולץ כלשונו מ-maor/src/lib/demoCleanup.ts:37-138 — כולל העוזרים-הפרטיים
 *  (FP_FIELDS · ROOT_ENTITIES · SEP · fingerprint · nameOf), שאינם exports-שכנים. */

/** שדות-זיהוי יציבים פר-ישות (בלי id/תאריכים/מערכים-מקוננים/מונים). */
const FP_FIELDS = {
  families: ['name', 'father', 'mother', 'phone', 'phone2', 'city', 'address', 'email'],
  supporters: ['name', 'phone', 'email', 'idNum', 'cat', 'forWho'],
  courses: ['name', 'description', 'price', 'price1', 'price2'],
  teachers: ['name', 'phone', 'email', 'idNum', 'specialty'],
  rooms: ['name', 'location', 'cap'],
  events: ['title', 'type', 'customType', 'notes', 'price', 'time'],
  volunteers: ['name', 'phone', 'area'],
  distributionDays: ['title', 'note'],
  tzCoordinators: ['name', 'phone'],
  tzCampaigns: ['name', 'title', 'goal'],
  tzEvents: ['title', 'name', 'notes'],
  shopItems: ['name', 'kind', 'value', 'basePrice'],
  shopStores: ['name', 'phone', 'address'],
  shopCriteria: ['name', 'label', 'desc'],
  shopProducts: ['name', 'title', 'kind'],
  shopEvents: ['title', 'name', 'notes'],
  shopIntakes: ['name', 'note'],
  tasks: ['title', 'note', 'desc'],
  warehouse: ['name', 'sku', 'note'],
};

/** ישויות-בסיס שמזוהות לפי טביעת-אצבע (סדר-שמות לתצוגה: name/title). */
const ROOT_ENTITIES = Object.keys(FP_FIELDS);

const SEP = '';

function fingerprint(rec, fields) {
  return fields.map((f) => String(rec?.[f] ?? '')).join(SEP);
}

function nameOf(rec) {
  return String(rec?.name ?? rec?.title ?? rec?.id ?? '').trim() || '(ללא שם)';
}

export function planDemoCleanup(db, demoDb) {
  const cleaned = { ...db };
  const removed = {};
  // ids של ישויות-אב שהוסרו — לצורך מפל
  const removedIds = {};
  const removedMemberIds = new Set();
  for (const ent of ROOT_ENTITIES) {
    const cur = db[ent];
    const demo = demoDb[ent];
    if (!Array.isArray(cur) || !Array.isArray(demo) || demo.length === 0) continue;
    const fields = FP_FIELDS[ent];
    const demoFps = new Set(demo.map((r) => fingerprint(r, fields)));
    const keep = [];
    const drop = [];
    const ids = new Set();
    for (const r of cur) {
      if (demoFps.has(fingerprint(r, fields))) {
        drop.push(r);
        const id = String(r.id ?? '');
        if (id) ids.add(id);
        // חברי-משפחה שהוסרה — לצורך מפל-שיבוצים (memberId)
        if (ent === 'families' && Array.isArray(r.members)) {
          for (const m of r.members) {
            const mid = String(m?.id ?? '');
            if (mid) removedMemberIds.add(mid);
          }
        }
      } else {
        keep.push(r);
      }
    }
    if (drop.length) {
      cleaned[ent] = keep;
      removedIds[ent] = ids;
      removed[ent] = { count: drop.length, names: drop.slice(0, 8).map(nameOf) };
    }
  }
  // ── מפל: רשומות-תלויות שמצביעות על ישות-דמו שהוסרה ──
  const has = (ent, id) => !!removedIds[ent]?.has(String(id ?? ''));
  const cascade = (ent, pred) => {
    const cur = db[ent];
    if (!Array.isArray(cur)) return;
    const keep = [];
    const drop = [];
    for (const r of cur) (pred(r) ? drop : keep).push(r);
    if (drop.length) {
      cleaned[ent] = keep;
      const prev = removed[ent]?.count ?? 0;
      removed[ent] = { count: prev + drop.length, names: (removed[ent]?.names ?? []).concat(drop.slice(0, 8).map(nameOf)).slice(0, 8) };
    }
  };
  // שיבוצים: חבר-דמו או חוג-דמו
  cascade('enrollments', (r) => removedMemberIds.has(String(r.memberId ?? '')) || has('courses', r.courseId));
  // מסירות: יום/מתנדב/שיוך/משפחה של דמו
  cascade('deliveries', (r) => has('distributionDays', r.dayId) || has('volunteers', r.volunteerId) || has('shopAssignments', r.assignmentId) || has('families', r.familyId));
  // שיוכי-חנות: מוצר-דמו או משפחת-דמו
  cascade('shopAssignments', (r) => has('shopProducts', r.productId) || has('families', r.famId));
  // קופות-צדקה: רכז-דמו או משפחת-דמו
  cascade('tzBoxes', (r) => has('tzCoordinators', r.coordinatorId) || has('families', r.famId));
  let total = 0;
  for (const k of Object.keys(removed)) total += removed[k].count;
  return { cleaned, total, removed };
}
