# snip — קטע קוד אמיתי כתמונה "שקופה" לפיד

תמונה בלי חלון, בלי מסגרת ובלי צל: אותיות הקוד ישר על הרקע, צבעי GitHub, שורות חשובות מסומנות במרקר.
גודל 1080 רוחב (פי 2 ברזולוציה), יחס 4:5 או 1:1, הפונט נבחר לבד כדי שיהיה הכי גדול שנכנס.

```
node snip.mjs --file <path> --lines 223-230 --hot 228 --theme light --out out.png
node snip.mjs --file <path> --lines 10-40 --hot '/exhaustive/' --theme all --out out.png   # light + dark + transparent
```

- `--lines A-B` שורות מהקובץ · `--hot` מספרי שורות בקובץ או `/regex/` · `--theme light|dark|transparent|all` · `--ratio 4:5|1:1`
- JS/TS מסודר ב-prettier לרוחב `--wrap` (ברירת מחדל 60); `--raw` משאיר את הפריסה המקורית. שפות אחרות (dart, py, sh) — שבירת שורות רכה.
- **שומר-סודות:** מסרב לצייר שורה שנראית כמו מפתח, טוקן, סיסמה או מפתח פרטי (יציאה 3).
- light = רקע לבן #FFFFFF · dark = רקע של פייסבוק במצב כהה #242526 · transparent = בלי רקע, צבעים בהירים (למצב כהה בלבד).
