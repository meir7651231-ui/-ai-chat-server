/** 🪨 טיוטת-חוט (דרגת-מחצבה) · deleteOrgCompletely — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:272-321 (50 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): deleteOrgCompletely, cloudDb, getDocs, collection, deleteDoc, wipeCol, catch, setDoc, toISOString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function deleteOrgCompletely(slug, entityCols) {
    const db = cloudDb();
    let deleted = 0;
    const wipeCol = async (path) => {
        const snap = await getDocs(collection(db, path));
        for (const d of snap.docs) {
            await deleteDoc(d.ref);
            deleted++;
        }
    };
    // אוספי-הנתונים + התורים של השרת (webhook/sms/mail) תחת orgs/{slug}.
    // תיקון 21.8 (ממצא-נחיל): נוספו 'donations' (מסלול-B — doc-per-donation, אינו
    // ב-ENTITY_COLLECTIONS) ו-'auditlog' (טבעות-הלוג פר-משתמש) — המודאל מבטיח
    // "הכול נמחק", ובלעדיהם התרומות ולוג-הפעולות היו שורדים לנצח.
    for (const col of [...entityCols, 'donations', 'auditlog', 'incomingPayments', 'smsOutbox', 'mailOutbox']) {
        await wipeCol('orgs/' + slug + '/' + col);
    }
    // מסמכי-שורש פר-ארגון (21.8): כספת-הסודות (smtpUrl/yemotToken/nedarimApiPass/
    // smsApiKey), המטא שלה ופיד-ה-ICS — בלעדיהם אישורי-הגישה (credentials) של
    // הלקוח היו שורדים את המחיקה לנצח. מדולגים בשקט אם אינם.
    for (const p of ['orgSecrets/' + slug, 'orgSecretsMeta/' + slug, 'icsFeeds/' + slug]) {
        await deleteDoc(doc(db, p)).catch(() => { });
        deleted++;
    }
    // צ'אט-הצוות (21.8): ההודעות (subcollection) ואז מסמך-האב (אם קיים)
    await wipeCol(TEAM_CHATS + '/' + slug + '/messages');
    await deleteDoc(doc(db, TEAM_CHATS, slug)).catch(() => { });
    // מסמכי-היחיד: meta + envelope-ההצפנה (מדולגים בשקט אם אינם)
    for (const p of ['orgs/' + slug + '/meta/org', 'orgs/' + slug + '/_enc/envelope']) {
        await deleteDoc(doc(db, p)).catch(() => { });
        deleted++;
    }
    // בקשות-ההצטרפות של העובדים, ואז מסמך-הארגון — שמוחלף ב**מצבת** (deleted:true):
    // הלקוח שנכנס קורא אותה (Rules מתירים get למצבות בלבד), מנקה את המגירה
    // המקומית שלו ורואה מסך "הארגון הוסר". מחיקה-מלאה של המסמך הייתה משאירה את
    // הלקוח עם permission-denied עמום — בלתי-ניתן-להבחנה מ"עוד לא אושרת".
    await wipeCol(PLATFORM_ORGS + '/' + slug + '/joinRequests');
    await setDoc(doc(db, PLATFORM_ORGS, slug), { deleted: true, deletedAt: new Date().toISOString() });
    deleted++;
    return deleted;
}
/**
 * כתיבת ליד "נחזור אליכם" (SIGNUP מיתוג 3) — **בלי חשבון**. אוסף
 * create-only ציבורי (Rules: allow create בלבד; קריאה למיילי-על) — לכידת-ליד
 * בטוחה: אף אחד לא יכול לקרוא/למנות את הלידים חוץ מהבעלים.
 */
