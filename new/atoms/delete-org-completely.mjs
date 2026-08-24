/** חוט · delete-org-completely — מחיקת-לקוח מלאה מהענן + מצבת. חוזה: delete-org-completely.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:272-321; שכני firebase/firestore
 *  (cloudDb·doc·collection·getDocs·deleteDoc·setDoc) הוזרקו כאובייקט-שקעים fs
 *  (חוק-1 — אפס import פנימי). קבועי-המנגנון TEAM_CHATS/PLATFORM_ORGS הוטבעו כלשונם. */
export async function deleteOrgCompletely(slug, entityCols, fs) {
  const { db, doc, collection, getDocs, deleteDoc, setDoc } = fs;
  let deleted = 0;
  const wipeCol = async (path) => {
    const snap = await getDocs(collection(db, path));
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
      deleted++;
    }
  };
  // אוספי-הנתונים + התורים של השרת (webhook/sms/mail) תחת orgs/{slug}.
  // תיקון 21.8 (ממצא-נחיל): 'donations' (מסלול-B) ו-'auditlog' — בלעדיהם
  // התרומות ולוג-הפעולות היו שורדים לנצח.
  for (const col of [...entityCols, 'donations', 'auditlog', 'incomingPayments', 'smsOutbox', 'mailOutbox']) {
    await wipeCol('orgs/' + slug + '/' + col);
  }
  // מסמכי-שורש פר-ארגון: כספת-הסודות, המטא שלה ופיד-ה-ICS — מדולגים בשקט אם אינם.
  for (const p of ['orgSecrets/' + slug, 'orgSecretsMeta/' + slug, 'icsFeeds/' + slug]) {
    await deleteDoc(doc(db, p)).catch(() => {});
    deleted++;
  }
  // צ'אט-הצוות: ההודעות (subcollection) ואז מסמך-האב (אם קיים; האב לא נספר)
  await wipeCol('teamChats/' + slug + '/messages');
  await deleteDoc(doc(db, 'teamChats', slug)).catch(() => {});
  // מסמכי-היחיד: meta + envelope-ההצפנה (מדולגים בשקט אם אינם)
  for (const p of ['orgs/' + slug + '/meta/org', 'orgs/' + slug + '/_enc/envelope']) {
    await deleteDoc(doc(db, p)).catch(() => {});
    deleted++;
  }
  // בקשות-ההצטרפות, ואז מסמך-הארגון — שמוחלף במצבת (deleted:true):
  // מחיקה-מלאה הייתה משאירה את הלקוח עם permission-denied עמום.
  await wipeCol('platformOrgs/' + slug + '/joinRequests');
  await setDoc(doc(db, 'platformOrgs', slug), { deleted: true, deletedAt: new Date().toISOString() });
  deleted++;
  return deleted;
}
