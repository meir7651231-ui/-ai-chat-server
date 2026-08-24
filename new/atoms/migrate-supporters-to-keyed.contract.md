# חוזה · חוט migrate-supporters-to-keyed
**תפקיד:** מיגרציה חד-פעמית של אכיפת-התומכים (חלון-בעלים): כותבת-מחדש **כל**
מסמכי התומכים והאירועים לענן עם ‏skey (upsert לפי id) — התוכן ביט-זהה, רק
נוסף מפתח-plaintext לסינון. אידמפוטנטית ולא-הרסנית. תומך ⇒ ‏skey=supKeyOf
(ה-forWho שלו); אירוע ⇒ ‏skey=docSkey (מפתח-התומך-המקושר; ללא-קישור=משותף —
כדי ששם-תורם בלוח לא ידלוף לעובדת אחרת). עם dek ⇒ התוכן הפנימי מוצפן
(‏encryptDoc), ה-skey נשאר plaintext. הכתיבה בצברי-400 (מגבלת WriteBatch).
מחזירה את מספר המסמכים שנכתבו.
**שקעים (חוק-1 — כל השכנים הוזרקו כאובייקט-שקעים io):**
- ‏io.requireDb() ⇒ ידית-Firestore (זורק כשהענן לא אותחל — הזריקה מבעבעת).
- ‏io.supKeyMapOf(supporters) ⇒ ‏Map ‏spId⇒skey (האטום sup-key-map-of).
- ‏io.supKeyOf(sp) ⇒ skey של תומך (forWho מחוטא; ריק ⇒ '_shared_').
- ‏io.docSkey(col, data, map) ⇒ skey של מסמך-אירוע.
- ‏io.toPlain(x) ⇒ אובייקט-plain לכתיבה.
- ‏io.encryptDoc(plain, dek) ⇒ ‏Promise<אובייקט-מעטפה מוצפן>.
- ‏io.scopedCol(col) ⇒ נתיב-האוסף בהיקף-הארגון.
- ‏io.doc(db, colPath, id) ⇒ הפניית-מסמך (Firestore SDK).
- ‏io.writeBatch(db) ⇒ ‏batch עם ‏set(ref, data) ו-‏commit()⇒Promise.
**קלט:** ‏supporters · ‏events · ‏dek (או null/undefined) · ‏io.
**פלט:** ‏Promise<number> = ‏supporters.length + events.length.
**דוגמאות מחייבות (שקעים מזויפים רושמי-קריאות):**
1. תומך אחד (id='s1', forWho='דנה') + אירוע אחד (id='e1', spId='s1'), בלי dek ⇒
   צבר **אחד**: ‏set פעמיים — ‏doc(db, scopedCol('supporters'), 's1') עם
   ‏{skey:'דנה', ...toPlain(sp)} ואז ‏doc(db, scopedCol('events'), 'e1') עם
   ‏{skey:'דנה', ...toPlain(ev)}; ‏commit פעם אחת; מוחזר **2**.
2. בלי dek ⇒ ‏encryptDoc **לא נקרא** כלל (התוכן plain).
3. עם dek ⇒ ‏encryptDoc נקרא פעם-לכל-מסמך עם ‏(toPlain(x), dek), והמסמך
   הנכתב = ‏{skey, ...מעטפת-ההצפנה} — שדות-ה-plain לא מופיעים בו.
4. המפה נבנית **פעם אחת**: ‏supKeyMapOf נקרא פעם אחת עם supporters, ותוצאתו
   מועברת לכל קריאת ‏docSkey('events', ev, map).
5. צברי-400: ‏300 תומכים + 101 אירועים (401 מסמכים) ⇒ ‏writeBatch נקרא
   **פעמיים** — צבר ראשון עם 400 ‏set, שני עם 1; כל אחד ‏commit פעם אחת;
   מוחזר **401**.
6. ריק-ריק ⇒ אפס צברים (writeBatch לא נקרא), מוחזר **0**.
**מוצא:** maor/src/lib/cloud.ts:215-240 (‏migrateSupportersToKeyed — מריצים
לפני הדלקת supEnforce; לא נוגעת בתרומות/מונים/rid). שכני Firestore והחוטים
השכנים הפכו לשקעי-io (חוק-1).
