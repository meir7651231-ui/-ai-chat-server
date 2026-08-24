/** 🪨 טיוטת-חוט (דרגת-מחצבה) · fetchOutboxIssues — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:787-804 (18 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): fetchOutboxIssues, collection, requireDb, scopedCol, getDocs, query, where, data
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function fetchOutboxIssues() {
    const issues = [];
    const pending = { sms: 0, mail: 0 };
    for (const box of ['sms', 'mail']) {
        const colName = box === 'sms' ? 'smsOutbox' : 'mailOutbox';
        const ref = collection(requireDb(), scopedCol(colName));
        const errs = await getDocs(query(ref, where('status', '==', 'error')));
        for (const d of errs.docs) {
            const v = d.data();
            issues.push({ id: d.id, box, to: v.to ?? '', subject: v.subject, error: v.error, at: v.at });
        }
        pending[box] = (await getDocs(query(ref, where('status', '==', 'pending')))).size;
    }
    issues.sort((a, b) => ((a.at ?? '') < (b.at ?? '') ? 1 : -1));
    return { issues, pending };
}
/** 🔁 שליחה-חוזרת: החזרת הרשומה ל-pending — ה-Function הדקתית תרים אותה שוב. */
