# חוזה · חוט is-data-image
**תפקיד:** האם מחרוזת היא תמונת-‎data:‎ תקינה מסוגי-התמונה המותרים בלבד —
‏`data:image/(png|jpeg|jpg|webp|gif);base64,`. זהו שער-החיטוי של גלריית-
התמונות (‏sanitizePhotos): מה שלא עובר — נזרק. במכוון **אין** ‏svg+xml
(וקטור XSS) ואין URL-ים רגילים.
**קלט:** ערך כלשהו (‏unknown). **פלט:** בוליאני.
**דוגמאות מחייבות:**
1. ‏'data:image/png;base64,iVBORw0K' ⇒ ‏true.
2. ‏'data:image/jpeg;base64,/9j/4AAQ' ⇒ ‏true, וגם הקיצור
   ‏'data:image/jpg;base64,/9j/' ⇒ ‏true (‏jpe?g).
3. ‏'data:image/webp;base64,UklGR' ⇒ ‏true · ‏'data:image/gif;base64,R0lGO' ⇒ ‏true.
4. ‏'data:image/svg+xml;base64,PHN2Zw==' ⇒ ‏false — ‏svg מוחרג במכוון (XSS).
5. ‏'https://x.example/a.png' ⇒ ‏false — לא ‎data:‎.
6. ‏'data:image/png,AAAA' ⇒ ‏false — חסר ‏;base64.
7. לא-מחרוזת: ‏null ⇒ ‏false · ‏42 ⇒ ‏false · ‏{} ⇒ ‏false.
**מוצא:** maor/src/lib/photoGallery.ts:20-27 (‏isDataImage — "מחרוזת היא
תמונת-data תקינה"). עצמאי — אפס שקעים.
