# חוזה · חוט reencrypt-db
**תפקיד:** הצפנת JSON חדש עם DEK קיים (שמירה שוטפת של DB מוצפן) — שומר את
המעטפת כמות-שהיא (‏$enc, מלחים, עטיפות-DEK, iter) ומחליף **רק** את שדה `data`
בתוצאת-ההצפנה של ה-JSON (מקודד UTF-8 עם TextEncoder הסטנדרטי). אסינכרוני.
לא נוגע במעטפת-הקלט (עותק-spread — אין מוטציה).
**שקעים (חוק-1 — קריאת-שכן הוזרקה כפרמטר):**
- ‏aesEnc(dek, bytes:Uint8Array) ⇒ ‏Promise<מוצפן> — הצפנת AES-GCM עם ה-DEK
  (שכן מאותו lib/crypto). האטום לא מציץ בתוצאה — מניח אותה כמות-שהיא ב-data.
**קלט:** `env` — מעטפת ({$enc:2, saltPass, wrapPass, saltRec, wrapRec, iter,
data, …}) · `dek` — מפתח-הנתונים (מועבר כמות-שהוא ל-aesEnc) · `json` — מחרוזת ·
השקע `aesEnc`. **פלט:** ‏Promise<מעטפת חדשה>.
**דוגמאות מחייבות** (‏env={$enc:2, saltPass:'SP', wrapPass:'WP', saltRec:'SR',
wrapRec:'WR', iter:600000, data:'OLD'} · ‏aesEnc-בדיקה ⇒ {tag:'ENC',
key:<ה-dek שהתקבל>, text:<פענוח-UTF-8 של הבייטים>}):
1. ‏reencryptDb(env, 'DEK1', '{"a":1}', aesEnc) ⇒ ‏out.data = {tag:'ENC',
   key:'DEK1', text:'{"a":1}'} — הבייטים שהוצפנו הם בדיוק UTF-8 של ה-JSON.
2. שאר השדות נשמרים ביט-זהה: ‏out.$enc=2 · ‏out.saltPass='SP' ·
   ‏out.wrapPass='WP' · ‏out.saltRec='SR' · ‏out.wrapRec='WR' · ‏out.iter=600000.
3. ‏env.data נשאר 'OLD' (אין מוטציה של הקלט) ו-out !== env (עותק חדש).
4. ‏json עברי 'שָׁלוֹם' ⇒ ‏text='שָׁלוֹם' (קידוד-UTF-8 עגול — מולטי-בייט שלם).
**מוצא:** חולץ כלשונו מ-maor/src/lib/crypto.ts:128-131 (‏aesEnc שוקע; ‏enc =
‏TextEncoder סטנדרטי — הוטמע פנימה).
