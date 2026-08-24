/** חוט · compose-smtp-url — הרכבת כתובת-SMTP מלאה ממייל+סיסמה+שרת.
 *  חוזה: compose-smtp-url.contract.md
 *  חולץ כלשונו מ-maor/src/lib/smtpUrl.ts:33-41 (תורגם TS→JS). */
export function composeSmtpUrl(email, password, host) {
  const em = email.trim();
  const pw = password.trim();
  const h = host.trim();
  if (!em || !pw || !h || em.indexOf('@') < 1) return null;
  const scheme = /:465$/.test(h) ? 'smtps' : 'smtp';
  return `${scheme}://${encodeURIComponent(em)}:${encodeURIComponent(pw)}@${h}`;
}
