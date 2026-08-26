# באגי-אטום חוצי-שפות שנמצאו בגל-הקופסאות הדו-לשוני (26.8.2026)

> נמצאו ע"י סוכני-הקופסה תוך בניית תאומי-Dart. הקופסה גישרה כל אחד (ירוק),
> אך האטום עצמו ראוי לתיקון-מקור (הרחבת-טיפוס/נאמנות-JS). אינווריאנט: הקופסה
> כבר עוקפת ⇒ אין רגרסיה; התיקון = ליישר את האטום לחוזה שלו.

1. **push-nav.dart** — הוקשח ל-`List<String>`/`String`, אבל החוזה (push-nav.contract.md)
   ואחיו same-loc.dart (dynamic) קובעים שאיברי-הניווט אטומיים (יכולים להיות Map).
   קופסת navhist דוחפת Map ⇒ קריאה-ישרה זורקת TypeError. הקופסה גישרה במתאם-אינדקסים.
   **תיקון מומלץ:** הרחב push-nav.dart ל-dynamic/גנרי כמו same-loc (+ריצת golden+mutation).

2. **commands-build-commands.dart** — `dedupCount as num` על null זרק (JS: undefined>0=false).
   **תוקן 26.8** (is num && >0 + ratchet). ✅
