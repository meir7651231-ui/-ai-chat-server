# 📦 חוזה-קופסה · vcard-import

קופסת-חיבורים המחווטת את ייבוא-אנשי-הקשר (vCard / .vcf) של מאור. מחווטת לפי גרף-הקריאות
של `maor-system/src/lib/vcardImport.ts` (מקור-האמת, L4). מייבאת 4 אטומים; ההכרעות
(סדר-השדות ב-switch, מילון-תוויות-הטלפון `PHONE_LABELS`, כלל-הריכוך של QP, סדר-איחוד
`notes`) חיות בקופסה. אין store/DOM/רשת — טהור ודטרמיניסטי.

## ⚠️ עוגן-מקור לפער-אטום (דיבר 2 · דיבר 9)
האטום `new/atoms/decode-quoted-printable.mjs` **שבור**: הוא מתייחס ל-`HEX2` (שורה 6)
בלי להגדיר אותו — הקבוע `const HEX2 = /^[0-9A-Fa-f]{2}$/` שקיים במקור
(`vcardImport.ts:33`) הושמט בתרגום-המכונה, וקורפוס-ה-Golden שלו מעולם לא הכיל רצף
`=XX`, אז הבאג נשאר סמוי (`decodeQuotedPrintable('=D7=A7')` ⇒ `ReferenceError: HEX2 is
not defined`). האטום אינו נעול-חתימה (pins) אך אסור לי לשנות אטומים קיימים — לכן
פענוח-ה-QP **חי בקופסה כחיווט** (source-exact, ליד ששת שכני-המקור), והפער דווח.

## חוטים (אטומים מיובאים)
| אטום | עוגן-מקור | שקעים שהקופסה מזריקה |
|---|---|---|
| `parseVcards` | `vcardImport.ts:153-220` | `unfoldLines, splitProperty, decodeValue, phoneLabel, joinAddress` |
| `isJunkContact` | `vcardImport.ts:229-233` | `digitsOnly` |
| `importableContacts` | `vcardImport.ts:236-238` | `parseVcards`(מחווט), `isJunkContact`(מחווט) |
| `contactToRow` | `vcardImport.ts:255-265` | — |

## חיווט-מקומי (שכני-המקור — לא אטומים)
`decodeQuotedPrintable`(⇐ מקור:39-57, כולל `HEX2`) · `unfoldLines`(65-87) ·
`splitProperty`(90-99) · `hasParam`(101-102) · `decodeValue`(105-107) ·
`PHONE_LABELS`(109-117) · `phoneLabel`(120-137) · `joinAddress`(140-147) ·
`digitsOnly`(223).

## API
- `parseVcards(text) → VCardContact[]` — פענוח קובץ vCard שלם, בסדר-הקובץ; כרטיס בלי-שם
  מקבל fullName מורכב מ-`given family`.
- `isJunkContact(c) → boolean` — כרטיס-זבל: בלי שם, או שכל הטלפונים <5 ספרות ואין מייל.
- `importableContacts(text) → VCardContact[]` — `parseVcards` בניכוי זבל, בסדר.
- `contactToRow(c) → ContactRow` — מיפוי לשורת-ייבוא ניטרלית.
- `decodeQuotedPrintable(s) → string` — נחשף לצורך אימות/עדשה-עוינת.

## דוגמאות מספריות (הוקלטו מהמקור המתורגם — `probe`)
1. `decodeQuotedPrintable('=D7=A7=D7=99=D7=A8')` ⇒ `"קיר"`.
2. `decodeQuotedPrintable('Abc 123')` ⇒ `"Abc 123"` (ASCII כמות-שהוא).
3. קובץ בן 3 כרטיסים (כהן QP + junk "100" + כרטיס-בלי-שם):
   - `parseVcards(vcf).length` ⇒ `3`.
   - `parseVcards(vcf)[0]` ⇒
     `{fullName:"מאיר כהן", family:"כהן", given:"מאיר",
       phones:[{value:"050-1234567",label:"נייד"},{value:"03-9998888",label:"בית"}],
       emails:["maor@example.com"], org:"חסד", title:"Manager",
       address:"רחוב 1, תל אביב", note:"hello"}`.
   - `isJunkContact(parsed[1])` ⇒ `true` (טלפון "100" = 3 ספרות, אין מייל).
   - `isJunkContact(parsed[2])` ⇒ `true` (fullName ריק).
   - `importableContacts(vcf).length` ⇒ `1`.
   - `contactToRow(parsed[0])` ⇒
     `{name:"מאיר כהן", phone:"050-1234567", phone2:"03-9998888",
       email:"maor@example.com", address:"רחוב 1, תל אביב",
       notes:"🏢 חסד · Manager · hello"}`.
4. תווית-טלפון עברית מותאמת `X-CUSTOM(...,=D7=A0=D7=99=D7=99=D7=93)` ⇒ `label:"נייד"`.
5. קלט-קצה: `parseVcards('')` ⇒ `[]` · `parseVcards(null)` ⇒ `[]`.

## מגן-הכרעה
`vcard-import.test.mjs` קורא את מקור-הקופסה עם fs ומאשר verbatim: מילון `PHONE_LABELS`
(CELL→נייד … VOICE/PREF→ריק) · שורת-ה-`HEX2` הרגקס · סדר-איחוד-ה-`notes`
(`🏢 org · title · note`) · הזרקת חמשת-השקעים ל-`parseVcards`.

## DoD (פקודה+פלט — לפני הקוד, דיבר 12)
- `node new/boxes/vcard-import.test.mjs` ⇒ exit 0, שורת-"✓".
- `node machtzev/parity/vcard-import.parity.mjs` (במאור) ⇒ exit 0, ישן≡חדש אפס-סטייה.
- `node machtzev/police.mjs --fast` (בגנסיס) ⇒ exit 0.
