# חוזה · חוט all-modules
**תפקיד:** קבוע — רשימת כל מפתחות-המודולים של המערכת (מקור-אחד לפאנל ולקונפיג-הלידה).
ערך בלבד (חוק-5): הרשימה לא יודעת מי דולק/כבוי — הדלקה/כיבוי = חיווט-הקופסה.
בית והגדרות אינם ברשימה (תמיד דלוקים — אינם מפתח-מודול).
**קלט:** — (קבוע). **פלט:** מערך 9 מחרוזות-slug באנגלית-קטנה.
**דוגמאות מחייבות:** ‏ALL_MODULES.length→9 · ‏ALL_MODULES[0]→'families' ·
‏ALL_MODULES[8]→'shop7' · ‏includes('tzedaka')→true · ‏includes('home')→false ·
המערך המלא→['families','courses','calendar','diary','supporters','reports','tzedaka','shop','shop7'] ·
אין כפילויות (new Set ⇒ אותו אורך)
**מוצא:** maor/src/components/platform/lib.ts:39 (‏`ALL_MODULES` — "כל מפתחות
המודולים — מקור אחד לפאנל ולקונפיג-הלידה"; חולץ כלשונו מטיוטת-המחצבה
all_modules@src_components_platform_lib_ts).
