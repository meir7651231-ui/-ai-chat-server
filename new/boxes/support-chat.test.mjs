/** בדיקת-קצה · קופסת support-chat — דרך הקופסה בלבד (חוק-4). מוכיחה את דוגמאות-החוזה
 *  + מגן-הכרעה (קוראת את מקור-הקופסה ומאשרת את הכרעת-סדר-המיון verbatim). */
import assert from 'node:assert';
const SUPPORT_CHAT_TERMS = {
  k1: "admin",
};   // צילום-מקומי (מנוע-הטיהור v6 — מגני-המקור עודכנו לצורה החדשה)
import { readFileSync } from 'node:fs';
import * as B from './support-chat.mjs';

let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// ── SUPPORT_MSG_MAX ──
ok(B.SUPPORT_MSG_MAX === 2000, `SUPPORT_MSG_MAX=${B.SUPPORT_MSG_MAX}≠2000`);

// ── sanitizeSupportText (תקרה מוזרקת מהקופסה) ──
ok(B.sanitizeSupportText('  שלום  ') === 'שלום', 'sanitize trim');
ok(B.sanitizeSupportText(null) === '', 'sanitize null');
ok(B.sanitizeSupportText('a'.repeat(2100)).length === 2000, 'sanitize תקרה-2000');

// ── isSendableSupportText ──
ok(B.isSendableSupportText('  ') === false, 'sendable ריק');
ok(B.isSendableSupportText(' x ') === true, 'sendable לא-ריק');
ok(B.isSendableSupportText(null) === false, 'sendable null');

// ── sortSupportMsgs (עולה, לא-משנה-מקור) ──
{
  const src = [{ at: '2026-08-24T10:00' }, { at: '2026-08-24T08:00' }];
  const out = B.sortSupportMsgs(src);
  ok(out[0].at === '2026-08-24T08:00' && out[1].at === '2026-08-24T10:00', 'sortSupportMsgs עולה');
  ok(src[0].at === '2026-08-24T10:00', 'sortSupportMsgs לא-משנה-מקור');
  ok(JSON.stringify(B.sortSupportMsgs([])) === '[]', 'sortSupportMsgs ריק');
}

// ── supportMsgTime (עמיד; שבור⇒'') ──
ok(B.supportMsgTime('שבור') === '', 'supportMsgTime שבור');
ok(/^\d{2}:\d{2}$/.test(B.supportMsgTime('2026-08-24T09:05:00')), 'supportMsgTime HH:MM');
// עמידות: 'T' חסר ⇒ מתווסף T12:00:00 (לא זורק)
ok(typeof B.supportMsgTime('2026-08-24') === 'string', 'supportMsgTime בלי-T');

// ── supportDayLabel (todayIso מוזרק) ──
ok(B.supportDayLabel('2026-08-24T10:00', '2026-08-24') === 'היום', 'dayLabel היום');
ok(B.supportDayLabel('2026-08-23T10:00', '2026-08-24') === 'אתמול', 'dayLabel אתמול');
ok(B.supportDayLabel('2026-08-01T10:00', '2026-08-24') === '01/08/2026', 'dayLabel תאריך');

// ── supportPreview ──
ok(B.supportPreview('  a   b  ') === 'a b', 'preview כיווץ');
{
  const p = B.supportPreview('x'.repeat(50));
  ok(p.length === 40 && p.endsWith('…'), 'preview חיתוך-40+…');
}
ok(B.supportPreview(undefined) === '', 'preview undefined');

// ── supportUnread (לא-שלילי; חסר⇒0) ──
ok(B.supportUnread({ unreadAdmin: 3 }, SUPPORT_CHAT_TERMS.k1) === 3, 'unread admin');
ok(B.supportUnread({ unreadAdmin: -2 }, SUPPORT_CHAT_TERMS.k1) === 0, 'unread שלילי⇒0');
ok(B.supportUnread(null, SUPPORT_CHAT_TERMS.k1) === 0, 'unread null⇒0');
ok(B.supportUnread({ unreadUser: 5 }, 'user') === 5, 'unread user');

// ── sortTeamMsgs ──
{
  const out = B.sortTeamMsgs([{ at: 'b' }, { at: 'a' }]);
  ok(out[0].at === 'a' && out[1].at === 'b', 'sortTeamMsgs עולה');
}

// ── sortSupportThreads (לא-נקרא קודם, ואז חדש-קודם) ──
{
  const out = B.sortSupportThreads([{ uid: 'a', lastAt: '2' }, { uid: 'b', unreadAdmin: 1, lastAt: '1' }]);
  ok(out[0].uid === 'b', 'threads לא-נקרא-קודם');
  const out2 = B.sortSupportThreads([{ uid: 'a', lastAt: '1' }, { uid: 'b', lastAt: '2' }]);
  ok(out2[0].uid === 'b', 'threads חדש-קודם');
  ok(JSON.stringify(B.sortSupportThreads([])) === '[]', 'threads ריק');
}

/* 🛡 מגן-הכרעה: קוראים את מקור-הקופסה ומאשרים שהכרעות-הסדר/התקרה verbatim בקופסה. */
const src = readFileSync(new URL('./support-chat.mjs', import.meta.url), 'utf8');
ok(src.includes("_sanitizeSupportText(raw, SUPPORT_MSG_MAX)"), 'מגן: הזרקת-תקרה שונתה');
ok(src.includes("const ua = supportUnread(a, SUPPORT_CHAT_TERMS.k1);"), 'מגן: מפתח-מיון-שיחות שונה');
ok(src.includes('return ua > 0 ? -1 : 1;'), 'מגן: כלל לא-נקרא-קודם שונה');
ok(src.includes('return la < lb ? 1 : la > lb ? -1 : 0;'), 'מגן: כלל חדש-קודם שונה');

if (f) process.exit(1);
console.log('✓ קופסת support-chat: 10 חוטים מחווטים · דוגמאות-חוזה + מגן-הכרעה — ירוק');
