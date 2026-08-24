# חוזה · קופסת-חיבורים support-chat

מקור-האמת (L4): `/home/user/maor-system/src/lib/supportChat.ts` — מנוע-טהור של צ׳אט-התמיכה
וצ׳אט-הצוות (בלי firebase/DOM). הקופסה מחווטת 10 אטומים לפי גרף-הקריאות של המקור;
ההכרעות (תקרת-האורך, סדר-המיון, ברירות-המחדל, מילון-התוויות) חיות בקופסה.

**שקעי-IO מוזרקים (מתועדים, לא ממומשים בקופסה):**
- `todayIso` — בסיס-היום ל-`supportDayLabel` (הרכיב מזרים `isoToday()`; טוהר — אין `Date.now` במנוע). מקור: `supportChat.ts:61`.
אין שקעי-DOM/localStorage/fetch/ענן — הלִיבּ טהור לגמרי.

## החשיפה (ביט-זהה לחתימות המקור)

### `SUPPORT_MSG_MAX` — קבוע
תקרת-אורך הודעה (מקבילה ל-Rules). מקור: `supportChat.ts:33`.
- ערך: `2000`.

### `sanitizeSupportText(raw)` — string
ניקוי: קיצוץ-רווחי-קצה + חיתוך-לתקרה. מקור: `supportChat.ts:36-38`.
החיווט: האטום מקבל תקרה כשקע; הקופסה מזריקה את `SUPPORT_MSG_MAX`.
- `sanitizeSupportText('  שלום  ')` ⇒ `'שלום'`
- `sanitizeSupportText(null)` ⇒ `''`
- `sanitizeSupportText('a'.repeat(2100))` ⇒ מחרוזת באורך `2000`

### `isSendableSupportText(raw)` — boolean
האם שליח (לא-ריק אחרי ניקוי). מקור: `supportChat.ts:41-43`.
החיווט: מוזרק ה-`sanitizeSupportText` המחווט של הקופסה.
- `isSendableSupportText('  ')` ⇒ `false`
- `isSendableSupportText(' x ')` ⇒ `true`
- `isSendableSupportText(null)` ⇒ `false`

### `sortSupportMsgs(msgs)` — SupportMsg[]
מיון לפי `at` עולה (ישן→חדש), יציב, לא-משנה-מקור. מקור: `supportChat.ts:46-48`.
- `sortSupportMsgs([{at:'2026-08-24T10:00'},{at:'2026-08-24T08:00'}])` ⇒ `[{at:'…08:00'},{at:'…10:00'}]`
- `sortSupportMsgs([])` ⇒ `[]`

### `supportMsgTime(at)` — string (HH:MM מקומי)
פרסור-עמיד (מוסיף `T12:00:00` אם חסר `T`); תאריך-שבור ⇒ `''`. מקור: `supportChat.ts:51-55`.
- `supportMsgTime('2026-08-24T09:05:00')` ⇒ `'09:05'` (בתלות אזור-זמן; ישן≡חדש)
- `supportMsgTime('שבור')` ⇒ `''`

### `supportDayLabel(at, todayIso)` — string
תווית מפריד-יום: `'היום'` / `'אתמול'` / `dd/mm/yyyy`. מקור: `supportChat.ts:61-73`.
- `supportDayLabel('2026-08-24T10:00', '2026-08-24')` ⇒ `'היום'`
- `supportDayLabel('2026-08-23T10:00', '2026-08-24')` ⇒ `'אתמול'`
- `supportDayLabel('2026-08-01T10:00', '2026-08-24')` ⇒ `'01/08/2026'`

### `supportPreview(text, max=40)` — string
קיצור-תצוגה: כיווץ-רווחים + trim + חיתוך ל-`max` עם `'…'`. מקור: `supportChat.ts:76-79`.
- `supportPreview('  a   b  ')` ⇒ `'a b'`
- `supportPreview('x'.repeat(50))` ⇒ מחרוזת באורך `40` שסופה `'…'`
- `supportPreview(undefined)` ⇒ `''`

### `supportUnread(thread, side)` — number (לא-שלילי)
מונה "לא-נקרא" לצד (`'admin'`/`'user'`); חסר/שלילי ⇒ `0`. מקור: `supportChat.ts:82-86`.
- `supportUnread({unreadAdmin:3}, 'admin')` ⇒ `3`
- `supportUnread({unreadAdmin:-2}, 'admin')` ⇒ `0`
- `supportUnread(null, 'admin')` ⇒ `0`

### `sortTeamMsgs(msgs)` — TeamMsg[]
מיון הודעות-צוות לפי `at` עולה, יציב, לא-משנה-מקור. מקור: `supportChat.ts:99-101`.
- `sortTeamMsgs([{at:'b'},{at:'a'}])` ⇒ `[{at:'a'},{at:'b'}]`

### `sortSupportThreads(threads)` — (SupportThread & {uid})[]
מיון רשימת-שיחות: לא-נקראות-לתמיכה קודם, ואז לפי `lastAt` יורד. מקור: `supportChat.ts:104-115`.
**הכרעה-בקופסה (סדר):** `supportUnread(_,'admin')>0` קודם; שובר-שוויון `lastAt` יורד; חסר ⇒ `''`.
- `sortSupportThreads([{uid:'a',lastAt:'2'},{uid:'b',unreadAdmin:1,lastAt:'1'}])` ⇒ `b` לפני `a` (לא-נקרא קודם)
- `sortSupportThreads([{uid:'a',lastAt:'1'},{uid:'b',lastAt:'2'}])` ⇒ `b` לפני `a` (חדש קודם)
- `sortSupportThreads([])` ⇒ `[]`

## DoD (פקודות-אימות, נכתבו לפני הקוד — דיבר 12)
- `node /home/user/-ai-chat-server/new/boxes/support-chat.test.mjs` ⇒ exit 0 (חוזה + מגן-הכרעה)
- `node /home/user/maor-system/machtzev/parity/support-chat.parity.mjs` ⇒ exit 0 (רתמת-זהב: ישן≡חדש, אפס-סטייה)
- `node /home/user/-ai-chat-server/machtzev/police.mjs --fast` ⇒ exit 0
