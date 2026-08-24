# חוזה · קופסת-חיבורים "נעילת-גישה" (lib-lock)

**תפקיד:** קופסת נעילת-ה-PIN של maor — מה שהיה מולחם ב-`src/lib/lock.ts`
מחווט כאן במקום אחד: אזורי-הנעילה · מפתח-התחום · קריאה/כתיבה ל-localStorage ·
תיקוף/גיבוב/אימות ה-PIN. הנעילה = הרתעה מפני עיון-מזדמן (קוד מגובב, לא הצפנת-
נתונים; קוד קצר ניתן לפיצוח בכוח). המקור (L4): `/home/user/maor-system/src/lib/lock.ts`.

## הכרעות-החיווט (חיות בקופסה)
- **מלח-הגיבוב** `SALT='maor.lock.v1::'` — שקע-הגיבוב של החוט hash-pin
  (המקור: lock.ts:23). גרסת-פורמט; שינויו מבטל כל גיבוב שמור.
- **בסיס-מפתח ישן** `LOCK_BASE='maor_lock'` — עוגן המיגרציה-הרכה (lock.ts:36).
- שרשרת-המלח: `verifyPin` מזריק את `hashPin` **המחווט-בקופסה** (הנושא SALT),
  לא את החוט הגולמי — כך המלח נשמר מקצה-לקצה (lock.ts:82-85 קורא ל-73-79).

## חשיפה (שקעי-IO מוזרקים, לא ממומשים)
- `LOCK_ZONES` · `DEFAULT_LOCK_ZONES` — קבועי-האזורים (lock.ts:13-21).
- `lockKey(nsLsKey)` ⇒ מחרוזת-מפתח (lock.ts:40-43).
- `readLock(nsLsKey, storage)` ⇒ אובייקט-LockCfg (lock.ts:44-55).
- `writeLock(nsLsKey, storage, cfg)` ⇒ void (lock.ts:57-65).
- `isValidPin(pin)` ⇒ boolean (lock.ts:68-70).
- `hashPin(pin)` ⇒ Promise<hex-64> (lock.ts:73-79; SALT מוזרק).
- `verifyPin(pin, hash)` ⇒ Promise<boolean> (lock.ts:82-85).
- `nsLsKey(base)⇒string` ו-`storage{getItem,setItem,removeItem}` = שקעי-לוח-האם.

## דוגמאות מחייבות (מספריות, מקריאת-המקור)
- **lockKey:** nsLsKey=זהות ⇒ `"maor_lock"` · nsLsKey=(b)⇒`${b}:demo` ⇒ `"maor_lock:demo"`.
- **isValidPin:** `'1234'`→true · `'123'`→false · `'123456789'`→false · `'12a4'`→false · `''`→false.
- **hashPin** (SALT `'maor.lock.v1::'`):
  `'1234'` → `c4891e76dc712dd3dd24f7409c935524c99ea8a4fc677e76a260f33ed6d78c20` ·
  `'0000'` → `bdedd3bab37144fe1536d5c7481c18624ed1c0de572a5978049b2553aa16a47d` ·
  `'87654321'` → `ea82e3faa05f2bf3cb024f49bc0c27d885213f6323cb32f8b8d746309672f6f5`.
- **verifyPin:** `('1234', <hash-של-1234>)`→true · `('1234', <hash-של-0000>)`→false ·
  `('1234', undefined)`→false · `('1234', '')`→false (falsy=בלי-גיבוב).
- **writeLock/readLock round-trip:** ns=demo · `{primary:'h1'}` נכתב ל-`maor_lock:demo`;
  `readLock(demo,…)` ⇒ `{primary:'h1'}`. `{}` (ריק) ⇒ מוחק את המפתח.
- **מיגרציה-רכה:** נעילה ישנה תחת `maor_lock` (bare), תחום `demo` בלי מפתח-משלו ⇒
  `readLock((b)=>`${b}:demo`,…)` נופל ל-bare ומחזיר את הנעילה הישנה.
- **עמידות:** storage.getItem שזורק ⇒ `readLock`⇒`{}` · JSON פגום ⇒ `{}` ·
  storage.setItem שזורק ⇒ `writeLock` נבלע בשקט (ללא זריקה).

## מגן-הכרעה (הבדיקה קוראת את מקור-הקופסה)
- `SALT === 'maor.lock.v1::'` verbatim בקוד-הקופסה.
- `verifyPin` מזריק את `hashPin` המחווט (מופיע `verifyPinAtom(pin, hash, hashPin)`),
  לא את `hashPinAtom` הגולמי — שרשרת-המלח חתומה.
