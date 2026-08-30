/** קופסת-חיבורים · פיד-יומן חי (ics-feed). חוזה: ics-feed.contract.md
 *  ההלחמות-לשעבר מ-maor/src/lib/icsFeed.ts — 4 חוטים, חיווט גלוי אחד.
 *  במקור publishIcsFeed קרא בעצמו ל-readIcsFeedToken + mintFeedToken + setDoc;
 *  כאן החיווט הפנימי הזה גלוי ומפורש (חוק-2/3 — הקופסה היחידה שמחווטת אטומים).
 *  שקעי-IO (Firestore: db/doc/getDoc/setDoc, חותם-זמן) = לוח-האם, מוזרקים
 *  כאובייקט cloud — הקופסה עצמה טהורה (חוק-6: שום זהות/ידית-ענן נצרבת). */
import { mintFeedToken as mintAtom } from '../atoms/mint-feed-token.mjs';
import { readIcsFeedToken as __pure_readIcsFeedToken } from '../atoms/read-ics-feed-token.mjs';
import { READ_ICS_FEED_TOKEN_T as __d_read_ics_feed_token_T } from '../atoms/read-ics-feed-token-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const readAtom = (...a) => __pure_readIcsFeedToken(...a, ...Array(Math.max(0, 2 - a.length)).fill(undefined), __d_read_ics_feed_token_T);
import { publishIcsFeed as __pure_publishIcsFeed } from '../atoms/publish-ics-feed.mjs';
import { PUBLISH_ICS_FEED_T as __d_publish_ics_feed_T } from '../atoms/publish-ics-feed-strings.mjs';
// עטיפת-כריכה (מנוע-הקשיחים): הדאטה נכרכת כאן — ה-API החיצוני זהה
const publishAtom = (...a) => __pure_publishIcsFeed(...a, ...Array(Math.max(0, 4 - a.length)).fill(undefined), __d_publish_ics_feed_T);
import { icsFeedUrl as __pure_icsFeedUrl } from '../atoms/ics-feed-url.mjs';
import { ICS_FEED_URL_T as __d_icsFeedUrl_ICS_FEED_URL_T } from '../atoms/ics-feed-url-strings.mjs';
import { ICS_FEED_TERMS } from '../atoms/ics-feed-terms.mjs';
// עטיפת-כריכה (מנוע-הטיהור v3): מחרוזות-הדאטה נכרכות כאן
const urlAtom = (...a) => __pure_icsFeedUrl(...a, ...Array(Math.max(0, 3 - a.length)).fill(undefined), __d_icsFeedUrl_ICS_FEED_URL_T);

// ── מילון-הקופסה (הכרעת-חיווט) ──
// שם-אוסף-הענן ICS_FEEDS (icsFeed.ts:11 verbatim) — מוטבע בחוט-הקריאה, ומחווט
// כאן גם לנתיב-הכתיבה (setDoc). זו הכרעת-הקופסה, לא של האטום.
const ICS_FEEDS = ICS_FEED_TERMS.k1;

// ── החיווט הפנימי ──
// שקעי-Firestore לחוט-הקריאה: db (במקור cloudDb()) + doc + getDoc.
const readFs = (cloud) => ({ db: cloud.db, doc: cloud.doc, getDoc: cloud.getDoc });

// ── החשיפה (ממשק lib/icsFeed.ts אחד-לאחד — L4) ──
/** token אקראי 32-hex (crypto של הפלטפורמה). */
export const mintFeedToken = () => mintAtom();

/** כתובת-המנוי הציבורית לפיד — פונקציית icsFeed בפרויקט-הענן. */
export const icsFeedUrl = (projectId, slug, token) => urlAtom(projectId, slug, token);

/** ה-token הקיים של הפיד (icsFeeds/{slug}) — שקעי-Firestore מוזרקים ב-cloud. */
export const readIcsFeedToken = (slug, cloud) => readAtom(slug, readFs(cloud));

/** פרסום/רענון הפיד. החיווט הגלוי: readToken=חוט-הקריאה · mintToken=חוט-ההנפקה ·
 *  writeFeed=setDoc על icsFeeds/{slug} (שם-האוסף מהמילון). token קיים נשמר,
 *  rotate מנפיק חדש. חותם-הזמן = ברירת-המחדל של האטום (new Date), אלא-אם הוזרק. */
export const publishIcsFeed = (slug, ics, opts, cloud) =>
  publishAtom(slug, ics, opts, {
    readToken: (s) => readAtom(s, readFs(cloud)),
    mintToken: mintAtom,
    writeFeed: (s, docData) => cloud.setDoc(cloud.doc(cloud.db, ICS_FEEDS, s), docData),
    ...(cloud.nowIso ? { nowIso: cloud.nowIso } : {}),
  });
