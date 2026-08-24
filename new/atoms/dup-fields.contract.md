# חוזה · חוט dup-fields
**תפקיד:** קבוע — 18 שדות-המיזוג של כפולי-משפחות: לכל שדה key · label עברית ·
get שמחלץ ערך-תצוגה כמחרוזת (ריק/חסר ⇒ ''; מספרי kidsHome/kidsMarried ⇒ String).
ערך בלבד (חוק-5): הרשימה לא יודעת איך ממזגים — הבחירה (pick/edit) = חיווט-הקופסה.
**קלט:** — (קבוע; כל get מקבל אובייקט-משפחה). **פלט:** מערך 18 הגדרות-שדה.
**דוגמאות מחייבות:** ‏DUP_FIELDS.length→18 · ‏DUP_FIELDS[0].key→'name',
label→'שם משפחה' · ‏DUP_FIELDS[17].key→'notes' ·
‏get של 'name' על {name:'כהן'}→'כהן' · ‏get של 'phone' על {}→'' ·
‏get של 'kidsHome' על {kidsHome:3}→'3' · ‏get של 'kidsHome' על {kidsHome:0}→'0'
(אפס אינו ריק!) · ‏get של 'kidsMarried' על {}→'' (null/חסר ⇒ ריק) ·
אין כפילויות-key (new Set ⇒ אותו אורך)
**מוצא:** maor/src/lib/dedup.ts:189-208 (‏`DUP_FIELDS` — "18 שדות המיזוג —
מפתחות ותוויות verbatim מהלגאסי, legacy-main-script.js:1643-1653"; חולץ כלשונו
מטיוטת-המחצבה dup_fields@src_lib_dedup_ts).
