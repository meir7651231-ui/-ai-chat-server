/** 🪨 טיוטת-חוט (דרגת-מחצבה) · pullAll — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:490-555 (66 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): pullAll, requireDb, getDoc, scopedMeta, exists, decryptDoc, data, getDocs, query, collection, scopedCol, where
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function pullAll(dek) {
    const db = requireDb();
    const metaSnap = await getDoc(doc(db, scopedMeta()));
    if (!metaSnap.exists())
        return null;
    // dek קיים ⇒ פענוח בגבול-הקריאה, לפני migrate/merge (הם נשארים על plaintext).
    const metaData = dek ? await decryptDoc(metaSnap.data(), dek) : metaSnap.data();
    const raw = { ...metaData, v: DB_VERSION };
    const snaps = await Promise.all(ENTITY_COLLECTIONS.map((col) => {
        // אכיפת-נתונים (dormant): עובד/ת מוגבל/ת ⇒ שאילתת אוסף-נאכף (supporters/events)
        // מסוננת ב-skey (Rules דוחים list לא-מסונן). מנהל/בעלים (null) / כבוי ⇒ קריאה מלאה.
        if (supEnforceOn && SUP_KEYED_COLS.includes(col) && allowedPurposes) {
            return getDocs(query(collection(db, scopedCol(col)), where('skey', 'in', supAllowedKeys(allowedPurposes))));
        }
        return getDocs(collection(db, scopedCol(col)));
    }));
    for (let i = 0; i < ENTITY_COLLECTIONS.length; i++) {
        const col = ENTITY_COLLECTIONS[i];
        const keyed = SUP_KEYED_COLS.includes(col);
        raw[col] = await Promise.all(snaps[i].docs.map(async (d) => {
            const data = dek ? await decryptDoc(d.data(), dek) : d.data();
            // קילוף skey (plaintext, לא-מוצפן) רק מאוספים-נאכפים — no-op בשאר.
            return { ...(keyed ? stripSupKey(data) : data), id: d.id };
        }));
    }
    // מסלול-B: התרומות באוסף-נפרד — קוראים ומרכיבים חזרה לתומכים **לפני migrate**,
    // כדי ש-supporterAggregates (ריפוי-המונים ב-migrate) יראה תרומות מלאות (סיכון-#1).
    if (splitOn) {
        // עובד/ת מוגבל/ת (allowedPurposes) ⇒ שאילתה מסוננת (Rules דוחים list לא-מסוננת);
        // מנהל/בעלים (null) ⇒ קריאה מלאה. 'in' תומך ≤30 ערכים — 29 ייעודים + המשותף.
        const donRef = collection(db, scopedDonations());
        const dsnap = await getDocs(allowedPurposes
            ? query(donRef, where('pkey', 'in', donAllowedKeys(allowedPurposes)))
            : donRef);
        const bySup = new Map();
        for (const d of dsnap.docs) {
            const data = (dek ? await decryptDoc(d.data(), dek) : d.data());
            const supporterId = data.supporterId;
            if (typeof supporterId !== 'string')
                continue;
            const { supporterId: _s, pkey: _p, ...donation } = data; // rid נשמר בתוך ...donation
            void _s;
            void _p;
            const arr = bySup.get(supporterId) ?? [];
            arr.push(donation);
            bySup.set(supporterId, arr);
        }
        const sups = raw.supporters;
        if (Array.isArray(sups))
            for (const sp of sups)
                sp.donations = bySup.get(sp.id) ?? [];
    }
    const migrated = migrate(raw);
    if (!migrated)
        throw new Error('נתוני הענן אינם בפורמט מוכר — לא בוצע סנכרון');
    return migrated;
}
/**
 * האזנה חיה לכל האוספים + meta/org. snapshots עם hasPendingWrites (הד מקומי
 * של כתיבות שלנו) מדולגים — רק שינויים שאושרו בשרת מגיעים ל-onRemote.
 */
