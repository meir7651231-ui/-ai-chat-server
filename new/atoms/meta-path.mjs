/** חוט · meta-path — קודם אוטומטית (אפיון-Golden). חוזה: meta-path.contract.md */
export function metaPath(slug, cloudRoot) {
    return cloudRoot ? 'meta/org' : 'orgs/' + slug + '/meta/org';
}
/**
 * נתיב מסמך ה-envelope (ה-DEK העטוף של הצפנת-הענן): ‏cloudRoot ⇒ ‏_enc/envelope
 * (שורש הלקוח החי); אחרת ⇒ orgs/{slug}/_enc/envelope. שני מקטעים (אוסף/מסמך) = תקין
 * ל-Firestore. ה-envelope נשמר plaintext-ciphertext — חסר-ערך בלי הסיסמה.
 */
