מפתח החתימה לא נמצא ברפו – בכוונה.
לבנייה מקומית: keys/liba.jks + keys/keystore.properties (storeFile=keys/liba.jks, storePassword=…, keyAlias=liba, keyPassword=…).
לבנייה אוטומטית ב-GitHub (צעד 91): להוסיף ב-Settings → Secrets: LIBA_KEYSTORE_B64 (base64 של ה-jks), LIBA_KEYSTORE_PASS, LIBA_KEY_PASS.
צעד 93 (החלפת מפתח): מפתח חדש = התקנה מחדש של האפליקציה אצל כולם (אנדרואיד לא מקבל עדכון עם חתימה אחרת). לעשות רק אם מאיר מחליט.
