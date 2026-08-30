import { publishIcsFeed as __pure_publishIcsFeed } from './publish-ics-feed.mjs';
// צילום-מקומי + עטיפת-כריכה (מנוע-הקשיחים; בדיקה לא מייבאת אטום-שכן)
const __d_publish_ics_feed_T = {
  k1: "לוח-השנה גדול מדי לפרסום כפיד — פנו לתמיכה",
};
const publishIcsFeed = (...a) => __pure_publishIcsFeed(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_publish_ics_feed_T);
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
const NOW = '2026-08-24T10:00:00.000Z';
// זיוף-ענן: רושם כל קריאה לבדיקת-הצורה
const fake = (existing) => {
  const calls = { read: [], mint: 0, write: [] };
  return {
    calls,
    sockets: {
      readToken: async (slug) => { calls.read.push(slug); return existing; },
      mintToken: () => { calls.mint++; return 'tok-new'; },
      writeFeed: async (slug, data) => { calls.write.push({ slug, data }); },
      nowIso: () => NOW,
    },
  };
};
// 1) token קיים נשמר — mint לא נקרא, הכתיבה בצורה המחייבת
{
  const { calls, sockets } = fake('tok-old');
  const t = await publishIcsFeed('org1', 'BEGIN:VCALENDAR', undefined, sockets);
  ok(t === 'tok-old', 'token קיים לא נשמר');
  ok(calls.mint === 0, 'mintToken נקרא למרות token קיים');
  ok(calls.read.length === 1 && calls.read[0] === 'org1', 'readToken לא נקרא עם ה-slug');
  ok(calls.write.length === 1 && calls.write[0].slug === 'org1', 'writeFeed לא נקרא עם ה-slug');
  const d = calls.write[0].data;
  ok(d.token === 'tok-old' && d.ics === 'BEGIN:VCALENDAR' && d.updatedAt === NOW,
    'מסמך-הפיד שנכתב אינו {token,ics,updatedAt} כמחויב');
}
// 2) אין token קיים ⇒ mint פעם אחת
{
  const { calls, sockets } = fake(null);
  const t = await publishIcsFeed('org1', 'X', undefined, sockets);
  ok(t === 'tok-new' && calls.mint === 1, 'ללא token קיים לא הונפק חדש');
  ok(calls.write[0].data.token === 'tok-new', 'ה-token החדש לא נכתב');
}
// 3) rotate ⇒ readToken לא נקרא כלל, mint גם כשקיים token
{
  const { calls, sockets } = fake('tok-old');
  const t = await publishIcsFeed('org1', 'X', { rotate: true }, sockets);
  ok(t === 'tok-new', 'rotate לא הנפיק token חדש');
  ok(calls.read.length === 0, 'rotate קרא ל-readToken (הישן היה שורד)');
  ok(calls.mint === 1, 'rotate לא קרא ל-mintToken');
}
// 4) חריגת-גודל: 900,001 בתי-ascii ⇒ זריקה בעברית, אפס כתיבה
{
  const { calls, sockets } = fake('tok-old');
  try {
    await publishIcsFeed('org1', 'a'.repeat(900_001), undefined, sockets);
    ok(false, 'חריגת-גודל לא נזרקה');
  } catch (e) {
    ok(e.message === 'לוח-השנה גדול מדי לפרסום כפיד — פנו לתמיכה', 'הודעת-חריגת-הגודל שגויה: ' + e.message);
  }
  ok(calls.write.length === 0, 'writeFeed נקרא למרות חריגת-גודל');
}
// 5) גבול מדויק: 900,000 בתים בדיוק ⇒ עובר
{
  const { calls, sockets } = fake('tok-old');
  const t = await publishIcsFeed('org1', 'a'.repeat(900_000), undefined, sockets);
  ok(t === 'tok-old' && calls.write.length === 1, 'גודל-הגבול המדויק נחסם בטעות');
}
// 6) המדידה בבתים (UTF-8): 450,001 אלפי"ן = 900,002 בתים ⇒ זריקה
{
  const { calls, sockets } = fake('tok-old');
  try {
    await publishIcsFeed('org1', 'א'.repeat(450_001), undefined, sockets);
    ok(false, 'מדידת-בתים: עברית לא נחסמה (נמדדו תווים במקום בתים)');
  } catch (e) {
    ok(e.message === 'לוח-השנה גדול מדי לפרסום כפיד — פנו לתמיכה', 'הודעת-החריגה (UTF-8) שגויה');
  }
  ok(calls.write.length === 0, 'writeFeed נקרא למרות חריגת-בתים');
}
if (f) process.exit(1);
console.log('✓ publish-ics-feed — כל דוגמאות-החוזה ירוקות');
