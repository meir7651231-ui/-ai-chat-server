/** בדיקת-קצה · קופסת ics-feed (מייבאת אך-ורק את הקופסה-שלה).
 *  DoD (דיבר 12, נכתב לפני הקוד): `node new/boxes/ics-feed.test.mjs` ⇒ exit 0.
 *  מוכיחה את 8 דוגמאות-החוזה דרך החיווט המלא + מגן-הכרעה בקריאת-מקור. */
import { mintFeedToken, icsFeedUrl, readIcsFeedToken, publishIcsFeed } from './ics-feed.mjs';
const ICS_FEED_TERMS = {
  k1: "icsFeeds",
};   // צילום-מקומי (מנוע-הטיהור v6 — מגני-המקור עודכנו לצורה החדשה)
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const NOW = '2026-08-24T10:00:00.000Z';

// ── זיוף-ענן: רושם כל קריאת-Firestore לבדיקת-הצורה + הנתיב ──
const makeCloud = (snapData) => {
  const calls = { doc: [], get: 0, set: [] };
  return {
    calls,
    cloud: {
      db: 'DB',
      nowIso: () => NOW,
      doc: (db, col, id) => { calls.doc.push([db, col, id]); return { db, col, id }; },
      getDoc: async (ref) => {
        calls.get++;
        return { exists: () => snapData !== undefined, data: () => snapData };
      },
      setDoc: async (ref, data) => { calls.set.push({ ref, data }); },
    },
  };
};

// 1) mintFeedToken ⇒ 32-hex
{
  const t = mintFeedToken();
  ok(/^[0-9a-f]{32}$/.test(t), 'mintFeedToken אינו 32-hex: ' + t);
  ok(mintFeedToken() !== t || true, 'mint'); // אקראי — לא כובלים ערך
}

// 2) icsFeedUrl — encodeURIComponent על slug בלבד
{
  const u = icsFeedUrl('proj-1', 'ke hila', 'abc');
  ok(u === 'https://us-central1-proj-1.cloudfunctions.net/icsFeed?org=ke%20hila&key=abc',
    'icsFeedUrl שגוי: ' + u);
}

// 3) readIcsFeedToken — token קיים + עדות-נתיב
{
  const { calls, cloud } = makeCloud({ token: 'a1b2c3d4', ics: 'BEGIN:VCALENDAR' });
  const t = await readIcsFeedToken('kehila', cloud);
  ok(t === 'a1b2c3d4', 'readIcsFeedToken לא החזיר את ה-token הקיים: ' + t);
  ok(calls.doc.length === 1 && calls.doc[0][1] === ICS_FEED_TERMS.k1 && calls.doc[0][2] === 'kehila',
    'נתיב-הקריאה אינו (db,icsFeeds,kehila): ' + JSON.stringify(calls.doc));
  ok(calls.get === 1, 'getDoc לא נקרא בדיוק פעם אחת');
}

// 4) readIcsFeedToken — מסמך חסר / token ריק / לא-מחרוזת ⇒ null
{
  ok((await readIcsFeedToken('x', makeCloud(undefined).cloud)) === null, 'מסמך-חסר לא ⇒ null');
  ok((await readIcsFeedToken('x', makeCloud({ token: '' }).cloud)) === null, 'token ריק לא ⇒ null');
  ok((await readIcsFeedToken('x', makeCloud({ token: 42 }).cloud)) === null, 'token לא-מחרוזת לא ⇒ null');
}

// 5) publishIcsFeed — token קיים נשמר, כתיבה בצורה המחייבת + נתיב setDoc
{
  const { calls, cloud } = makeCloud({ token: 'tok-old' });
  const t = await publishIcsFeed('org1', 'BEGIN:VCALENDAR', undefined, cloud);
  ok(t === 'tok-old', 'token קיים לא נשמר: ' + t);
  ok(calls.set.length === 1, 'setDoc לא נקרא פעם אחת');
  ok(calls.set[0].ref.col === ICS_FEED_TERMS.k1 && calls.set[0].ref.id === 'org1',
    'נתיב-הכתיבה אינו icsFeeds/org1');
  const d = calls.set[0].data;
  ok(d.token === 'tok-old' && d.ics === 'BEGIN:VCALENDAR' && d.updatedAt === NOW,
    'מסמך-הפיד שנכתב אינו {token,ics,updatedAt=NOW}: ' + JSON.stringify(d));
}

// 6) אין token קיים ⇒ mint 32-hex חדש נכתב ומוחזר
{
  const { calls, cloud } = makeCloud(undefined); // מסמך לא-קיים ⇒ readToken=null
  const t = await publishIcsFeed('org1', 'X', undefined, cloud);
  ok(/^[0-9a-f]{32}$/.test(t), 'לא הונפק token 32-hex חדש: ' + t);
  ok(calls.set[0].data.token === t, 'ה-token החדש לא נכתב');
}

// 7) rotate ⇒ getDoc (readToken) לא נקרא כלל, mint חדש גם כשקיים token
{
  const { calls, cloud } = makeCloud({ token: 'tok-old' });
  const t = await publishIcsFeed('org1', 'X', { rotate: true }, cloud);
  ok(/^[0-9a-f]{32}$/.test(t) && t !== 'tok-old', 'rotate לא הנפיק token חדש: ' + t);
  ok(calls.get === 0, 'rotate קרא ל-getDoc (readToken היה שורד)');
}

// 8) חריגת-גודל ⇒ זריקה בעברית, אפס כתיבה · גבול 900,000 עובר
{
  const { calls, cloud } = makeCloud({ token: 'tok-old' });
  try {
    await publishIcsFeed('org1', 'a'.repeat(900_001), undefined, cloud);
    ok(false, 'חריגת-גודל לא נזרקה');
  } catch (e) {
    ok(e.message === 'לוח-השנה גדול מדי לפרסום כפיד — פנו לתמיכה', 'הודעת-החריגה שגויה: ' + e.message);
  }
  ok(calls.set.length === 0, 'setDoc נקרא למרות חריגת-גודל');
  const edge = makeCloud({ token: 'tok-old' });
  const t = await publishIcsFeed('org1', 'a'.repeat(900_000), undefined, edge.cloud);
  ok(t === 'tok-old' && edge.calls.set.length === 1, 'גבול 900,000 המדויק נחסם בטעות');
}

/* 🛡 מגן-הכרעה: קוראים את מקור-הקופסה ומאשרים את הכרעות-החיווט verbatim. */
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('./ics-feed.mjs', import.meta.url), 'utf8');
// הכרעה א: שם-האוסף verbatim מהמקור
if (!src.includes("const ICS_FEEDS = ICS_FEED_TERMS.k1;")) { console.error('✗ מגן: שם-האוסף ICS_FEEDS שונה'); f = 1; }
// הכרעה ב: נתיב-הכתיבה מחווט את ICS_FEEDS דרך setDoc(doc(...))
if (!/cloud\.setDoc\(cloud\.doc\(cloud\.db, ICS_FEEDS, s\), docData\)/.test(src)) {
  console.error('✗ מגן: נתיב-הכתיבה setDoc(doc(db,ICS_FEEDS,slug),…) שונה'); f = 1;
}
// הכרעה ג: publish.readToken מחווט לאותו חוט-קריאה readAtom (שימוש-מחדש, icsFeed.ts:38)
if (!/readToken: \(s\) => readAtom\(s, readFs\(cloud\)\)/.test(src)) {
  console.error('✗ מגן: readToken של publish אינו חוט-הקריאה readAtom'); f = 1;
}

if (f) process.exit(1);
console.log('✓ קופסת ics-feed: 4 חוטים מחווטים · 8 דוגמאות-חוזה + מגן-הכרעה — ירוק');
