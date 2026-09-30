# ליבה – Android bubble

Floating voice bubble for the ליבה page. Download the APK: **[liba.apk](https://github.com/meir7651231-ui/-ai-chat-server/raw/liba-android/liba.apk)**

Source in `android/` (Kotlin, minSdk 26, targetSdk 34). Build: `gradle assembleDebug` with `sdk.dir` in `local.properties`.

## ערוץ: מה סשן אחר צריך לדעת

- **פקודות לטלפון חייבות חתימה.** מסמך `inbox/<id>` עם `kind:'cmd'` מתבצע רק אם הוא חתום ב-`tools/cmd.mjs` (מפתח Ed25519 מחוץ לריפו). לא חתום, פג תוקף או חוזר - נדחה ומסומן `refused`. `node tools/cmd.mjs "open https://github.com/..."` מדפיס את המסמך לכתיבה.
- **קישור מחוץ ל-claude.ai / github.com** לא נפתח לבד גם כשהוא חתום: הוא הופך להתראה שמאיר נוגע בה.
- **שבת וחג:** מהדלקת נרות עד צאת הכוכבים שום הודעה לא עוברת, גם לא דחופה. רק `node tools/cmd.mjs --pikuach "טקסט"` (פיקוח נפש חתום) עובר - בדף פתוח; בטלפון הדף כבוי בשבת.
- **גרסה:** `version.json` חתום ב-`ship/version.mjs`; הטלפון (3.32 ומעלה) לא מאמין לגרסה לא חתומה.
