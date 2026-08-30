/** חוט · write-org-secrets — כספת-המפתחות פר-ארגון: orgSecrets/{slug} (ערכים) +
 *  orgSecretsMeta/{slug} (מדדי-"מוגדר" בלבד), שניהם merge.
 *  חוזה: write-org-secrets.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloudConfig.ts:141-155 (תורגם TS→JS); הקבוע-השכן
 *  ORG_SECRET_KEYS ⇒ פרמטר-שקע keys, ו-cloudDb/ערכת-Firestore
 *  (doc/setDoc/deleteField) ⇒ אובייקט-שקעים fs (חוק-1 — אפס import פנימי).
 *  ערך מלא = נשמר (trim); '' = נמחק מהכספת; שדה שלא נשלח לא נגוע. חוק-6:
 *  אפס סוד מוטבע — הסודות עוברים רק דרך patch בזמן-ריצה. */
export async function writeOrgSecrets(slug, patch, keys, fs, T) {
  const { db, doc, setDoc, deleteField } = fs;
  const secret = {};
  const meta = {};
  for (const k of keys) {
    if (!(k in patch)) continue;
    const v = (patch[k] ?? '').trim();
    secret[k] = v || deleteField();
    meta[k] = !!v;
  }
  if (!Object.keys(secret).length) return;
  await setDoc(doc(db, T.k1, slug), secret, { merge: true });
  await setDoc(doc(db, T.k2, slug), { ...meta, updatedAt: new Date().toISOString() }, { merge: true });
}
