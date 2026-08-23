/** 🪨 טיוטת-חוט (דרגת-מחצבה) · subscribeAll — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:556-662 (107 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): subscribeAll, requireDb, stripSupKey, onSnapshot, query, collection, scopedCol, where, supAllowedKeys, docChanges, onRemote, clean
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function subscribeAll(onRemote, onError, dek) {
    const db = requireDb();
    // אכיפת-נתונים (dormant): קילוף skey מאוספים-נאכפים; no-op בשאר האוספים.
    const clean = (col, data) => SUP_KEYED_COLS.includes(col) ? stripSupKey(data) : data;
    const unsubs = ENTITY_COLLECTIONS.map((col) => onSnapshot(
    // עובד/ת מוגבל/ת ⇒ מנוי אוסף-נאכף מסונן ב-skey (Rules דוחים list לא-מסונן).
    supEnforceOn && SUP_KEYED_COLS.includes(col) && allowedPurposes
        ? query(collection(db, scopedCol(col)), where('skey', 'in', supAllowedKeys(allowedPurposes)))
        : collection(db, scopedCol(col)), (snap) => {
        if (snap.metadata.hasPendingWrites)
            return;
        const changes = snap.docChanges();
        if (!changes.length)
            return;
        // dek נעדר ⇒ נתיב ביט-זהה להיום. קיים ⇒ פענוח לפני onRemote (מחוקים אין מה לפענח).
        if (!dek) {
            onRemote({ col, docs: changes.map((ch) => ({ id: ch.doc.id, data: clean(col, ch.doc.data()), deleted: ch.type === 'removed' })) });
            return;
        }
        void Promise.all(changes.map(async (ch) => ({
            id: ch.doc.id,
            data: ch.type === 'removed' ? clean(col, ch.doc.data()) : clean(col, await decryptDoc(ch.doc.data(), dek)),
            deleted: ch.type === 'removed',
        })))
            .then((docs) => onRemote({ col, docs }))
            .catch((e) => onError?.(e));
    }, (e) => onError?.(e)));
    unsubs.push(onSnapshot(doc(db, scopedMeta()), (snap) => {
        if (snap.metadata.hasPendingWrites || !snap.exists())
            return;
        if (!dek) {
            onRemote({ meta: snap.data() });
            return;
        }
        void decryptDoc(snap.data(), dek)
            .then((meta) => onRemote({ meta }))
            .catch((e) => onError?.(e));
    }, (e) => onError?.(e)));
    return () => {
        for (const u of unsubs)
            u();
    };
}
/** רשימת-התורמים ששוגרה מנדרים (nedarimDonors). אוסף-ריק ⇒ [] (הצלחה); כשל-קריאה
 *  אמיתי (הרשאה/רשת) ⇒ **זורק** — כך ה-caller מבחין בין "אין נתונים" ל"תקלת-חיבור"
 *  (במקום להציג 'הכול מסונכרן' שגוי בזמן תקלה). (תיקון 20.8) */
