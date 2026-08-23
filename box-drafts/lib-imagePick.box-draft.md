# 📦 טיוטת-קופסה · lib-imagePick
> חוללה ממכונת-החיווט (גרף-הקריאות של src/lib/imagePick.ts). ‏4 חוטים.
> קידום: לבחור מהחוטים המקודמים ב-new/atoms, לחווט לפי הגרף, חוזה+בדיקת-קצה.

## תוכנית-החיווט
· MAX_UPLOAD_BYTES (2ש)
· pickAndCompressImage (22ש ⚠️לא-טהור) ← פנימי: pickAndCompressImage ← שקעים-חיצוניים: readAsDataUrl,loadImage,createElement,getContext,drawImage
· MAX_EMBED_BYTES (2ש)
· readFileAsDataUrl (24ש) ← פנימי: readFileAsDataUrl ← שקעים-חיצוניים: readAsDataUrl,resolve,reject,readAsDataURL,loadImage
