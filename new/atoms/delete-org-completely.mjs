/** חוט · delete-org-completely — מחיקת-לקוח מלאה מהענן + מצבת. חוזה: delete-org-completely.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:272-321; שכני firebase/firestore
 *  (cloudDb·doc·collection·getDocs·deleteDoc·setDoc) הוזרקו כאובייקט-שקעים fs
 *  (חוק-1 — אפס import פנימי). קבועי-המנגנון TEAM_CHATS/PLATFORM_ORGS הוטבעו כלשונם. */
export async function deleteOrgCompletely(slug, entityCols, fs, T) {
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
  for (const col of [...entityCols, T.k1, T.k2, T.k3, T.k4, T.k5]) {
    await wipeCol(T.k6 + slug + '/' + col);
  }
  // מסמכי-שורש פר-ארגון: כספת-הסודות, המטא שלה ופיד-ה-ICS — מדולגים בשקט אם אינם.
  for (const p of [T.k7 + slug, T.k8 + slug, T.k9 + slug]) {
    await deleteDoc(doc(db, p)).catch(() => {});
    deleted++;
  }
  // צ'אט-הצוות: ההודעות (subcollection) ואז מסמך-האב (אם קיים; האב לא נספר)
  await wipeCol(T.k10 + slug + T.k11);
  await deleteDoc(doc(db, T.k12, slug)).catch(() => {});
  // מסמכי-היחיד: meta + envelope-ההצפנה (מדולגים בשקט אם אינם)
  for (const p of [T.k6 + slug + T.k13, T.k6 + slug + T.k14]) {
    await deleteDoc(doc(db, p)).catch(() => {});
    deleted++;
  }
  // בקשות-ההצטרפות, ואז מסמך-הארגון — שמוחלף במצבת (deleted:true):
  // מחיקה-מלאה הייתה משאירה את הלקוח עם permission-denied עמום.
  await wipeCol(T.k15 + slug + T.k16);
  await setDoc(doc(db, T.k17, slug), { deleted: true, deletedAt: new Date().toISOString() });
  deleted++;
  return deleted;
}
