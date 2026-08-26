# 🎯 סגירה · גל-הקופסאות הדו-לשוני (JS↔Dart) — 26.8.2026

**החזון (הכרעת-בעלים):** "שגם מאור וגם בנייה-חכמה יכולות להתחבר לאותה קופסה."
**הושג:** 51 קופסאות-חיבורים חיות עכשיו **בשתי השפות** — `new/boxes/*.mjs` (מאור)
ו-`new/dart-boxes/*.dart` (בנייה-חכמה) — כל אחת מחווטת את **אותם אטומים** מול
**אותו חוזה**, ומוכחת **זהה-ביט** על אותם קלטים (~1,415 טענות-פאריטי מצטברות).

## איך
- **גלי-נחיל:** 7 גלים של סוכנים-במקביל (עד 12 בו-זמנית), אפס-git לסוכנים,
  אימות-עוין מרכזי (analyze נקי + proof ✓) + commit על-ידי המפקד בלבד.
- כל קופסת-Dart: imports-בלבד מ-`dart-maor/`, חיווט זהה-סדר, דבקי-חיווט/קבועים
  חיים בקופסה (חוק-5), מתאמי-טיפוס ל-Dart-הקשיח חיים בקופסה (אפס-נגיעה באטום).
- גבול-IO פר-פלטפורמה (חוק-6): שעון/DOM/fetch/localStorage/ענן/זהות מוזרקים
  בלוח-האם — הליבה-הטהורה חוצה-שפות זהה-ביט, ה-IO פר-מערכת.

## מה נסגר (51)
יסוד: validate·date-util·config(ליבה)·dedup·search·hebdate·hebrew·hebrew-calendar·sup-partition
תשתית/ענן: cloud-merge·cloud-diff·smtp-url·telephony·caller-id·wa·ics-feed·lib-ics·lib-nedarim-sync
תורמים/כסף: empowerment(27)·receipt·donation-partition·annual-report·export-rows·export-gate·supporters(45)
עמודות: families·diary·shop·tzedaka·ayin·reports·distribution·reenroll·dialer·platform·public-site
UX: a11y·navhist·tour·guide·templates·vertical-packs(98)·signup-wizard·photo-gallery·names-export·worktasks·theme·audit·custom-export·support-chat·vcard-import

## באגי-אטום חוצי-שפות שנמצאו (ראה DART-ATOM-BUGS)
1. commands-build-commands.dart — dedupCount as num זרק על null ⇒ **תוקן+ratchet**.
2. push-nav.dart — הוקשח-יתר ל-List<String> (הקופסה גישרה) ⇒ לתיקון-מקור.
3. vcard/decode-quoted-printable — אטום-ה-JS שבור (הקופסה-JS עוקפת), אטום-ה-Dart תקין.

## נותר (חסום על המרת-אטומים — לא-קופסה)
~10 קופסאות עם אטומי-Dart חסרים: cloud-crypto·components-courses·csvx·image-pick·
lib-ai·lib-cloud·lib-cloud-config·lib-crypto·lib-lock·lib-pwa·net-check·pricing.
צעד-הבא: המרת האטומים החסרים (TS→JS→Dart), ואז הקופסאות ייבנו כמו השאר.

## שער
`dart analyze` נקי בכל 51 · כל ה-proofs ירוקים · משטרה 7/7 + mutation 708/708.
