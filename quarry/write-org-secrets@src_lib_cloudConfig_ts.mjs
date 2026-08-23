/** 🪨 טיוטת-חוט (דרגת-מחצבה) · writeOrgSecrets — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloudConfig.ts:143-157 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): writeOrgSecrets, deleteField, setDoc, cloudDb, toISOString
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function writeOrgSecrets(slug, patch) {
    const secret = {};
    const meta = {};
    for (const k of ORG_SECRET_KEYS) {
        if (!(k in patch))
            continue;
        const v = (patch[k] ?? '').trim();
        secret[k] = v || deleteField();
        meta[k] = !!v;
    }
    if (!Object.keys(secret).length)
        return;
    await setDoc(doc(cloudDb(), ORG_SECRETS, slug), secret, { merge: true });
    await setDoc(doc(cloudDb(), ORG_SECRETS_META, slug), { ...meta, updatedAt: new Date().toISOString() }, { merge: true });
}
/** קריאת מדדי-"מוגדר" בלבד — הסודות עצמם לא קריאים מהלקוח לעולם. */
