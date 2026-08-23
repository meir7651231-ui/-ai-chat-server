/** 🪨 טיוטת-חוט (דרגת-מחצבה) · planDemoCleanup — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/demoCleanup.ts:66-138 (73 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): planDemoCleanup, fingerprint, pred, cascade
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function planDemoCleanup(db, demoDb) {
    const cleaned = { ...db };
    const removed = {};
    // ids של ישויות-אב שהוסרו — לצורך מפל
    const removedIds = {};
    const removedMemberIds = new Set();
    for (const ent of ROOT_ENTITIES) {
        const cur = db[ent];
        const demo = demoDb[ent];
        if (!Array.isArray(cur) || !Array.isArray(demo) || demo.length === 0)
            continue;
        const fields = FP_FIELDS[ent];
        const demoFps = new Set(demo.map((r) => fingerprint(r, fields)));
        const keep = [];
        const drop = [];
        const ids = new Set();
        for (const r of cur) {
            if (demoFps.has(fingerprint(r, fields))) {
                drop.push(r);
                const id = String(r.id ?? '');
                if (id)
                    ids.add(id);
                // חברי-משפחה שהוסרה — לצורך מפל-שיבוצים (memberId)
                if (ent === 'families' && Array.isArray(r.members)) {
                    for (const m of r.members) {
                        const mid = String(m?.id ?? '');
                        if (mid)
                            removedMemberIds.add(mid);
                    }
                }
            }
            else {
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
        if (!Array.isArray(cur))
            return;
        const keep = [];
        const drop = [];
        for (const r of cur)
            (pred(r) ? drop : keep).push(r);
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
    for (const k of Object.keys(removed))
        total += removed[k].count;
    return { cleaned, total, removed };
}
