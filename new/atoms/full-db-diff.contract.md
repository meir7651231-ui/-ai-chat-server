# חוזה · חוט full-db-diff
**תפקיד:** ה-DB המלא כ-diff — להעלאה ראשונה של נתונים מקומיים לפרויקט-ענן ריק.
כל פריט בכל אוסף-ישויות הופך לרשומת-set ‏{col,id,data}; ‏deletes תמיד ריק;
‏meta נבנה תמיד (דרך השקע metaOf). הסדר: סדר-האוספים ברשימה, ובתוך אוסף —
סדר-הפריטים ב-db. ‏data מצביע לפריט עצמו (לא עותק).
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏entityCollections — רשימת שמות אוספי-הישויות (בקוד-המקור: הקבוע
  ‏ENTITY_COLLECTIONS, ‏23 אוספים; ידע-סכמה = חיווט-קופסה, חוק-5).
- ‏metaOf — ‏(db)⇒אובייקט-meta של שדות-ה-DB שאינם רשימות ישויות (שכן באותו קובץ).
**קלט:** ‏db + השקעים. **פלט:** ‏{sets, deletes:[], meta}.
**דוגמאות מחייבות (entityCollections=['families','courses'] ·
metaOf=db⇒({orgName:db.orgName})):**
1. ‏db={orgName:'מאור', families:[{id:'f1',name:'לוי'},{id:'f2'}], courses:[{id:'c1'}]}
   ⇒ ‏sets.length===3 בסדר: ‏{col:'families',id:'f1'} · ‏{col:'families',id:'f2'} ·
   ‏{col:'courses',id:'c1'}.
2. ‏sets[0].data === db.families[0] (אותה רפרנס — לא עותק).
3. ‏deletes ⇒ [] תמיד.
4. ‏meta ⇒ ‏{orgName:'מאור'} (תוצר השקע metaOf — גם כשה-DB "ריק" מישויות).
5. אוספים ריקים: ‏db={orgName:'x', families:[], courses:[]} ⇒
   ‏sets===[] · ‏meta נבנה בכל-זאת.
**מוצא:** maor/src/lib/cloud-diff.ts:173-181. השכנים ENTITY_COLLECTIONS/metaOf
הפכו לשקעים (חוק-1).
