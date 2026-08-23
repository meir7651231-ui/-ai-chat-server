/** 🪨 טיוטת-חוט (דרגת-מחצבה) · readFileAsDataUrl — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/imagePick.ts:39-62 (24 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): readFileAsDataUrl, readAsDataUrl, resolve, reject, readAsDataURL, loadImage
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export async function readFileAsDataUrl(file, maxBytes = MAX_EMBED_BYTES) {
    if (file.size > maxBytes)
        throw new Error('הקובץ גדול מדי להטמעה (מקסימום ' + Math.round(maxBytes / 1024 / 1024) + 'MB) — הוסיפו קישור במקום');
    return readAsDataUrl(file);
}
function readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(new Error('קריאת הקובץ נכשלה'));
        r.readAsDataURL(file);
    });
}
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('פענוח התמונה נכשל'));
        img.src = src;
    });
}
