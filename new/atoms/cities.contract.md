# חוזה · חוט cities
**תפקיד:** מילון ערי-עוגן לזמנים הלכתיים — נ״צ (lat/lon) + מנהג הדלקת-נרות
בדקות לפני-שקיעה, פר-עיר. נתון בלבד (חוק-5): המילון לא יודע מי מחשב בו זמנים.
**קלט:** — (קבוע). **פלט:** ‏{ מפתח-עיר ⇒ { he, lat, lon, candle } }.
**דוגמאות מחייבות:** ‏10 מפתחות (כולל 'default') ·
‏jerusalem={he:'ירושלים', lat:31.778, lon:35.235, candle:40} ·
‏telaviv.candle=18 · ‏tzfat.lat=32.965 · ‏haifa.candle=30 ·
‏default = נ״צ-ירושלים (‏lat/lon/candle זהים) עם he='ברירת-מחדל (ירושלים)' ·
בכל רשומה: he מחרוזת לא-ריקה ו-lat/lon/candle מספרים סופיים.
**מוצא:** חולץ כלשונו מ-maor/telephony/lib/zmanim.mjs (‏CITIES; הטיוטה נגזרה
מגשר-הטיפוסים maor/src/lib/telephony/engine.ts:118-119 שמייצא אותו כ-rawCITIES).
