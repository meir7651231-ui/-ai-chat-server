# חוזה · חוט rewrap-password
**תפקיד:** החלפת סיסמת-ההצפנה **בלי** להצפין מחדש את הנתונים — מייצא את ה-DEK
(‏crypto.subtle.exportKey — WebCrypto סטנדרטי), גוזר מפתח-עטיפה מהסיסמה החדשה
עם מלח-טרי (16 בייט) ואותו ‏env.iter, ועוטף מחדש. מוחלפים **רק** ‏saltPass
ו-wrapPass; עטיפת-השחזור (saltRec/wrapRec), iter, data ושאר-השדות נשמרים
ביט-זהה. אסינכרוני; אפס-מוטציה של מעטפת-הקלט (עותק-spread).
**שקעים (חוק-1 — קריאות-שכן הוזרקו כפרמטרים; שכני lib/crypto):**
- ‏rand(n) ⇒ ‏Uint8Array — ‏n בייטים אקראיים (נקרא פעם-אחת עם 16).
- ‏deriveWrapKey(secret, salt, iter) ⇒ ‏Promise<CryptoKey> — גזירת PBKDF2.
- ‏aesEnc(key, plain:Uint8Array) ⇒ ‏Promise<מוצפן> — הצפנת AES-GCM.
- ‏b64(bytes) ⇒ מחרוזת — קידוד base64 (למלח החדש).
**קלט:** ‏env — מעטפת ({$enc:2, saltPass, wrapPass, saltRec, wrapRec, iter,
data, …}) · ‏dek — ‏CryptoKey ניתן-לייצוא · ‏newPassword — מחרוזת · 4 השקעים.
**פלט:** ‏Promise<מעטפת חדשה>.
**דוגמאות מחייבות** (‏env={$enc:2, saltPass:'SP', wrapPass:'WP', saltRec:'SR',
wrapRec:'WR', iter:600000, data:'DATA'} · ‏dek = מפתח-AES-GCM אמיתי מ-16 בייטים
ידועים [1..16] · שקעי-בדיקה: ‏rand(16)⇒בייטים-קבועים מלאי-9 · ‏b64⇒'B64:'+אורך ·
‏deriveWrapKey⇒{wrap:secret,salt,iter} · ‏aesEnc⇒{tag:'ENC',key,bytes:[...]}):
1. ‏rand נקרא בדיוק פעם-אחת, עם 16; ‏out.saltPass='B64:16' — ‏b64 קיבל את
   תוצאת-rand עצמה.
2. ‏deriveWrapKey נקרא עם ‏('סוד-חדש', <תוצאת-rand>, 600000) — ה-iter מהמעטפת,
   לא קבוע.
3. ‏out.wrapPass = ‏{tag:'ENC', key:<תוצאת-deriveWrapKey>, bytes:[1..16]} —
   ‏aesEnc קיבל את ייצוא-ה-raw האמיתי של ה-DEK.
4. שאר השדות ביט-זהים: ‏out.$enc=2 · ‏out.saltRec='SR' · ‏out.wrapRec='WR' ·
   ‏out.iter=600000 · ‏out.data='DATA'.
5. אפס-מוטציה: ‏env.saltPass נשאר 'SP', ‏env.wrapPass נשאר 'WP', ‏out!==env.
**מוצא:** חולץ כלשונו מ-maor/src/lib/crypto.ts:133-139 (‏rewrapPassword;
"עוטף מחדש את ה-DEK בלבד"). ‏rand·deriveWrapKey·aesEnc·b64 שוקעו;
‏crypto.subtle.exportKey = פלטפורמה סטנדרטית (מותר בחוק-1).
