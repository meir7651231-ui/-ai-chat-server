# vector-c — הווקטורייזרים, עם מצייר מקורי ב-C

אותם שני מנועים כמו `vector/` (trace ו-prims), עם אותה תוצאה, רק מהר יותר.
החלק הכבד היה לשלוח כל ניסיון ל-Chromium כדי לצייר אותו. כאן יש מצייר SVG שכתוב ב-C (העתקה של Skia),
שמצייר בדיוק אותם פיקסלים כמו Chromium על הצורות שהוא תומך בהן. מה שהוא לא תומך בו — נשלח ל-Chromium כרגיל.

```
bash native/build.sh                                   # בונה libvr.so ו-libvcfit.so
python3 trace/trace.py ../vector/test/icon.png out.svg
python3 prims/prims.py ../vector/test/logo.png out.svg
```

- `native/` — המצייר (`vr_*.c`), הגשר לפייתון (`vr.py`, `render_api.py`), ולולאות חמות ב-C (`vcfit.c`).
  בסוף כל ריצה ה-SVG שנבחר מצויר שוב ב-Chromium ונבדק שהוא זהה. צריך את `../vector/render.mjs` (או `VEC_RENDER_MJS`).
- `cal/` — בדיקת ההתאמה מול Chromium: 181 מתוך 229 קבצי SVG זהים לגמרי; השאר משתמשים בדברים שלא נתמכים ועוברים ל-Chromium.
- `bench/` — המדידה ישן מול חדש (נכתבה לפריסת ה-scratchpad המקורית), `report.txt`.

תוצאות שנבדקו שוב באופן עצמאי (`VERIFY.txt`): 16 מתוך 18 קבצי SVG זהים בייט-בייט לגרסה הישנה,
ובשאר ההבדל זניח (flag: ‎-0.01 dB). trace מהיר פי 3, prims מהיר פי 6 על התמונות הקטנות,
פי 54 על flag, ו-face מסתיים ב-3 דקות במקום לא לסיים בשעה וחצי.
הערה: `vcfit` משתמש בפונקציה פנימית של numpy (AVX-512). אם היא לא נמצאת או לא זהה — חוזר לפייתון, והתוצאה נשארת אותה תוצאה.
