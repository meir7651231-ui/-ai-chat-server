# חוזה · קופסת-חיבורים "image-pick" (בחירת-תמונה + הטמעת-קובץ)
> מקור-אמת (L4): `maor/src/lib/imagePick.ts`. עוגני-שורה מובאים לכל טענה (דיבר 11).

**תפקיד:** שתי זרימות של פיצ׳ר-הגלריה/ההטמעה, מחווטות במקום אחד:
1. **pickAndCompressImage** — קובץ-תמונה ⇒ thumbnail (data-URL image/jpeg) מכווץ.
2. **readFileAsDataUrl** — קובץ-מסמך (לא-תמונה) ⇒ data-URL מוטמע, מאחורי שער-גודל.

**הכרעות-הקופסה (חיות כאן, חוק-5):** `MAX_PX=320` (imagePick.ts:11) · `QUALITY=0.72`
(imagePick.ts:12) · סדר-השערים (סוג→גודל→קריאה→פענוח→סקייל→canvas) · מילון-שגיאות:
`'הקובץ אינו תמונה'` (imagePick.ts:16) · `'התמונה גדולה מדי (מקסימום 8MB)'`
(imagePick.ts:17) · `'דפדפן אינו תומך בעיבוד תמונה'` (imagePick.ts:27).

**חוטים מיובאים (atoms בלבד):** `MAX_UPLOAD_BYTES` (=8388608) · `MAX_EMBED_BYTES`
(=3145728) · `readFileAsDataUrl` (שער-הגודל של המסמך).

**שקעי-IO (חוק-1/6 — מוזרקים, לא ממומשים):**
- `io.readAsDataUrl(file)` ⇒ `Promise<string>` — קורא-ה-data-URL (במקור: שכן פרטי על
  `FileReader`, imagePick.ts:45-52).
- `io.loadImage(src)` ⇒ `Promise<{width,height}>` — מפענח (במקור: `new Image()`,
  imagePick.ts:54-61).
- `io.createCanvas()` ⇒ `{width,height,getContext(t),toDataURL(type,q)}` — קנבס
  (במקור: `document.createElement('canvas')`, imagePick.ts:23).

## חשיפה
- `pickAndCompressImage(file, io)` ⇒ `Promise<string>` (data-URL) או **זריקה**.
- `readFileAsDataUrl(file, io, maxBytes=MAX_EMBED_BYTES)` ⇒ `Promise<string>` או **זריקה**.
- מיוצא-מחדש: `MAX_UPLOAD_BYTES`, `MAX_EMBED_BYTES`.

## דוגמאות מחייבות (מספריות)
### pickAndCompressImage
1. `file.type='text/plain'` ⇒ זריקה `'הקובץ אינו תמונה'` — שום שקע לא נקרא (שער-סוג ראשון).
2. `file.type='image/png', size=8388609` (מעל התקרה) ⇒ זריקה `'התמונה גדולה מדי (מקסימום 8MB)'`.
3. תמונת `image/png`, מימדים `640×480` ⇒ scale=`min(1,320/640)=0.5` ⇒ `w=320,h=240`;
   `createCanvas().width/height` נקבעים ל-320/240; `toDataURL` נקרא עם `('image/jpeg',0.72)`;
   מוחזר בדיוק מה ש-`toDataURL` החזיר.
4. תמונה קטנה `100×50` ⇒ scale=`min(1,320/100)=1` (אין הגדלה) ⇒ `w=100,h=50`.
5. עיגול: `333×100` ⇒ scale=`320/333≈0.960960…` ⇒ `w=round(333·scale)=320`,
   `h=round(100·scale)=96`.
6. מימד-אפס `0×0` ⇒ scale=`min(1,320/Math.max(0,0)=Infinity)=1` ⇒
   `w=Math.max(1,round(0))=1`, `h=1` (הרצפה `Math.max(1,…)` של המקור).
7. `getContext('2d')` מחזיר `null` ⇒ זריקה `'דפדפן אינו תומך בעיבוד תמונה'`
   (אחרי קביעת width/height, לפני `drawImage`).

### readFileAsDataUrl
8. `size=3145729` (3MB+1), ברירת-מחדל ⇒ זריקה
   `'הקובץ גדול מדי להטמעה (מקסימום 3MB) — הוסיפו קישור במקום'`; `io.readAsDataUrl` **לא נקרא**.
9. `size=3145728` (בדיוק התקרה) ⇒ עובר: `io.readAsDataUrl` נקרא פעם-אחת עם הקובץ,
   והתוצאה היא בדיוק מה שהחזיר.
10. `maxBytes=1048576, size=2000000` ⇒ ההודעה נוקבת `'מקסימום 1MB'` (נגזרת מ-maxBytes).

**ההורדה/הבחירה-מהדיסק (input[type=file], DOM) = שקע של לוח-האם — הקופסה טהורה.**
