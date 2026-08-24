# חוזה · חוט cred-red-threshold
**תפקיד:** קבוע — ערך-סף מספרי 500. ערך בלבד (חוק-5): המספר לא יודע שהוא
"סף סיכון-נטישה במדד-האמינות" — ההשוואה `score < 500` ⇒ דרגת-red היא חיווט-הקופסה
(tierOf). במקור יושר ללגאסי: legacy tier red ‎<500 (מול 300 שהיה ב-React).
**קלט:** — (קבוע). **פלט:** מספר שלם.
**דוגמאות מחייבות:** הערך=500 · מספר-שלם (‏Number.isInteger) · גדול מ-0 ·
‏499 < הסף→true (צד-הסיכון) · ‏500 < הסף→false (על-הסף = לא-red)
**מוצא:** maor/src/components/families/lib.ts:52 (‏`CRED_RED_THRESHOLD` — "סף
מדד-אמינות 'סיכון' — יישור ללגאסי (tierOf red)"; חולץ כלשונו מטיוטת-המחצבה
cred_red_threshold@src_components_families_lib_ts).
