/** חוט · plan-demo-cleanup — תכנון ניקוי נתוני-דמו שהתערבבו בנתונים האמיתיים.
 *  חוזה: plan-demo-cleanup.contract.md · טהור ואימוטבילי, אפס-שקעים.
 *  חולץ כלשונו מ-maor/src/lib/demoCleanup.ts:37-138 — כולל העוזרים-הפרטיים
 *  (FP_FIELDS · ROOT_ENTITIES · SEP · fingerprint · nameOf), שאינם exports-שכנים. */

/** שדות-זיהוי יציבים פר-ישות (בלי id/תאריכים/מערכים-מקוננים/מונים). */

/** ישויות-בסיס שמזוהות לפי טביעת-אצבע (סדר-שמות לתצוגה: name/title). */




export function planDemoCleanup(db, demoDb, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const FP_FIELDS = {
    families: [T.k1, T.k2, T.k3, T.k4, T.k5, T.k6, T.k7, T.k8],
    supporters: [T.k1, T.k4, T.k8, T.k9, T.k10, T.k11],
    courses: [T.k1, T.k12, T.k13, T.k14, T.k15],
    teachers: [T.k1, T.k4, T.k8, T.k9, T.k16],
    rooms: [T.k1, T.k17, T.k18],
    events: [T.k19, T.k20, T.k21, T.k22, T.k13, T.k23],
    volunteers: [T.k1, T.k4, T.k24],
    distributionDays: [T.k19, T.k25],
    tzCoordinators: [T.k1, T.k4],
    tzCampaigns: [T.k1, T.k19, T.k26],
    tzEvents: [T.k19, T.k1, T.k22],
    shopItems: [T.k1, T.k27, T.k28, T.k29],
    shopStores: [T.k1, T.k4, T.k7],
    shopCriteria: [T.k1, T.k30, T.k31],
    shopProducts: [T.k1, T.k19, T.k27],
    shopEvents: [T.k19, T.k1, T.k22],
    shopIntakes: [T.k1, T.k25],
    tasks: [T.k19, T.k25, T.k31],
    warehouse: [T.k1, T.k32, T.k25],
  };
  const ROOT_ENTITIES = Object.keys(FP_FIELDS);
  const SEP = '';
  function fingerprint(rec, fields) {
    return fields.map((f) => String(rec?.[f] ?? '')).join(SEP);
  }
  function nameOf(rec) {
    return String(rec?.name ?? rec?.title ?? rec?.id ?? '').trim() || T.k33;
  }

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
        if (ent === T.k34 && Array.isArray(r.members)) {
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
  cascade(T.k35, (r) => removedMemberIds.has(String(r.memberId ?? '')) || has(T.k36, r.courseId));
  // מסירות: יום/מתנדב/שיוך/משפחה של דמו
  cascade(T.k37, (r) => has(T.k38, r.dayId) || has(T.k39, r.volunteerId) || has(T.k40, r.assignmentId) || has(T.k34, r.familyId));
  // שיוכי-חנות: מוצר-דמו או משפחת-דמו
  cascade(T.k40, (r) => has(T.k41, r.productId) || has(T.k34, r.famId));
  // קופות-צדקה: רכז-דמו או משפחת-דמו
  cascade(T.k42, (r) => has(T.k43, r.coordinatorId) || has(T.k34, r.famId));
  let total = 0;
  for (const k of Object.keys(removed)) total += removed[k].count;
  return { cleaned, total, removed };
}
