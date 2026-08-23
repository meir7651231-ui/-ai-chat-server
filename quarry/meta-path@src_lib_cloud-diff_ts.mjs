/** 🪨 טיוטת-חוט (דרגת-מחצבה) · metaPath — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud-diff.ts:50-58 (9 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): metaPath
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function metaPath(slug, cloudRoot) {
    return cloudRoot ? 'meta/org' : 'orgs/' + slug + '/meta/org';
}
/**
 * נתיב מסמך ה-envelope (ה-DEK העטוף של הצפנת-הענן): ‏cloudRoot ⇒ ‏_enc/envelope
 * (שורש הלקוח החי); אחרת ⇒ orgs/{slug}/_enc/envelope. שני מקטעים (אוסף/מסמך) = תקין
 * ל-Firestore. ה-envelope נשמר plaintext-ciphertext — חסר-ערך בלי הסיסמה.
 */
