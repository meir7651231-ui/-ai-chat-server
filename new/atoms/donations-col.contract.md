# חוזה · חוט donations-col
**תפקיד:** קבוע — המחרוזת 'donations'. ערך בלבד (חוק-5): המחרוזת לא יודעת שהיא
"שם אוסף-התרומות-הנפרד במסלול-B (doc-per-donation, מפתח=rid)" — הרכבת-הנתיב
(colPath / donationsPath) והחרגתה מ-ENTITY_COLLECTIONS הן חיווט-הקופסה.
**קלט:** — (קבוע). **פלט:** מחרוזת.
**דוגמאות מחייבות:** הערך='donations' · אורך 9 · אותיות-לטיניות-קטנות בלבד
(‏/^[a-z]+$/) · בלי '/' (מקטע-נתיב יחיד — חוקי כשם-אוסף Firestore)
**מוצא:** maor/src/lib/cloud-diff.ts:64 (‏`DONATIONS_COL` — "מסלול-B: שם-אוסף
התרומות-הנפרד; לא ב-ENTITY_COLLECTIONS"; חולץ כלשונו מטיוטת-המחצבה
donations_col@src_lib_cloud-diff_ts).
