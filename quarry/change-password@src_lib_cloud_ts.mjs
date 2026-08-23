/** 🪨 טיוטת-חוט (דרגת-מחצבה) · changePassword — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud.ts:362-421 (60 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): changePassword, requireAuth, reauthenticateWithCredential, credential, toString, hebrewAuthError, updatePassword, toPlain, pushMetaCounterSafe, requireDb, scopedMeta, runTransaction
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function changePassword(currentPass, nextPass) {
    const u = requireAuth().currentUser;
    if (!u || !u.email)
        throw new Error('אין משתמש מחובר — התחברו ונסו שוב');
    try {
        await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, currentPass));
    }
    catch (e) {
        const code = (e?.code ?? '').toString();
        if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || code === 'auth/invalid-login-credentials')
            throw new Error('הסיסמה הנוכחית שגויה');
        throw hebrewAuthError(e);
    }
    try {
        await updatePassword(u, nextPass);
    }
    catch (e) {
        const code = (e?.code ?? '').toString();
        if (code === 'auth/weak-password')
            throw new Error('הסיסמה החדשה חלשה מדי — לפחות 6 תווים');
        throw hebrewAuthError(e);
    }
}
/** Firestore דוחה undefined — סיבוב JSON מנקה (וגם מנתק הפניות). */
function toPlain(data) {
    return JSON.parse(JSON.stringify(data));
}
/**
 * דחיפת diff בכתיבות אצווה — עד 400 פעולות ל-batch (מגבלת Firestore: 500).
 * dek אופציונלי (הצפנת-ענן doc-level): קיים ⇒ כל מסמך מוצפן ל-{enc,iv} לפני
 * הכתיבה; **נעדר ⇒ נתיב plaintext ביט-זהה להיום** (ratchet). ה-id נשאר מפתח-המסמך.
 */
/** מוני-הענן — מונוטוניים בלבד (רצף קבלות-מס). לעולם לא לרדת במסמך ה-meta. */
const META_COUNTER_KEYS = ['seq', 'receiptSeq', 'donationSeq', 'shopReceiptSeq'];
/**
 * כתיבת מסמך ה-meta בטוחה-למונים (🐛 נחיל-עמוק 13.8): כתיבת set() עיוורת דרסה את
 * המונים בענן כשמכשיר עם מונה-מפגר דחף שינוי-meta שאינו-מונה (מרוץ תת-שנייה) ⇒
 * קבלת-מס כפולה. עסקה קוראת את המונים החיים בענן ברגע-הכתיבה ומרימה למקסימום —
 * כך הענן לעולם אינו נסוג. עובד גם לנתיב-המוצפן (פענוח/הצפנה בתוך העסקה).
 */
async function pushMetaCounterSafe(meta, dek) {
    const db = requireDb();
    const ref = doc(db, scopedMeta());
    await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        let existing = null;
        if (snap.exists()) {
            const raw = snap.data();
            existing = dek ? await decryptDoc(raw, dek) : raw;
        }
        const safe = { ...meta };
        for (const k of META_COUNTER_KEYS) {
            const cur = existing?.[k];
            const nxt = safe[k];
            if (typeof cur === 'number' && (typeof nxt !== 'number' || cur > nxt))
                safe[k] = cur;
        }
        const body = dek ? await encryptDoc(safe, dek) : safe;
        tx.set(ref, body);
    });
}
