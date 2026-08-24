import { askClaude } from './ask-claude.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };
// זיוף-רשת: מחזיר Response-דמוי לפי תסריט, ורושם את הבקשה לבדיקת-הצורה
const fake = (script) => {
  const calls = [];
  const doFetch = async (url, init) => {
    calls.push({ url, init });
    return { ok: script.status === 200, status: script.status, json: async () => script.body };
  };
  return { doFetch, calls };
};
const expectThrow = async (p, wanted, label) => {
  try { await p; ok(false, label + ': לא נזרקה שגיאה'); }
  catch (e) { ok(e.message === wanted, label + ': "' + e.message + '" ≠ "' + wanted + '"'); }
};
// 1) תשובה תקינה — גזומה
{
  const { doFetch } = fake({ status: 200, body: { content: [{ type: 'text', text: '  שלום עולם  ' }] } });
  ok((await askClaude('k', 'שאלה', doFetch)) === 'שלום עולם', 'תשובה תקינה לא נגזמה נכון');
}
// 2) איחוי בלוקי-text בלבד, בסדר
{
  const { doFetch } = fake({ status: 200, body: { content: [{ type: 'thinking', text: 'X' }, { type: 'text', text: 'א' }, { type: 'text', text: 'ב' }] } });
  ok((await askClaude('k', 'ש', doFetch)) === 'אב', 'איחוי-הבלוקים שגוי');
}
// 3–5) מיפוי-שגיאות בעברית
await expectThrow(askClaude('k', 'ש', fake({ status: 401, body: {} }).doFetch), 'מפתח ה-API לא תקין — בדקו בהגדרות', '401');
await expectThrow(askClaude('k', 'ש', fake({ status: 429, body: {} }).doFetch), 'חריגה ממכסת-השימוש — נסו בעוד רגע', '429');
await expectThrow(askClaude('k', 'ש', fake({ status: 500, body: {} }).doFetch), 'הקריאה לעוזר נכשלה (500)', '500');
// 6) ok אך תוכן ריק
await expectThrow(askClaude('k', 'ש', fake({ status: 200, body: { content: [] } }).doFetch), 'לא התקבלה תשובה — נסו שוב', 'תוכן-ריק');
// 7) צורת-הבקשה
{
  const { doFetch, calls } = fake({ status: 200, body: { content: [{ type: 'text', text: 'ת' }] } });
  await askClaude('key-123', 'הפרומפט', doFetch);
  ok(calls.length === 1, 'מספר-קריאות ≠ 1');
  const { url, init } = calls[0];
  ok(url === 'https://api.anthropic.com/v1/messages', 'URL שגוי');
  ok(init.method === 'POST', 'method ≠ POST');
  ok(init.headers['x-api-key'] === 'key-123', 'x-api-key לא הוזרק');
  ok(init.headers['anthropic-version'] === '2023-06-01', 'anthropic-version שגוי');
  ok(init.headers['anthropic-dangerous-direct-browser-access'] === 'true', 'כותרת-הדפדפן חסרה');
  const body = JSON.parse(init.body);
  ok(body.model === 'claude-haiku-4-5-20251001', 'model שגוי');
  ok(body.max_tokens === 600, 'max_tokens ≠ 600');
  ok(body.messages.length === 1 && body.messages[0].role === 'user' && body.messages[0].content === 'הפרומפט', 'messages שגוי');
}
if (f) process.exit(1);
console.log('✓ ask-claude: 7 דוגמאות-חוזה — ירוק (זיוף-רשת, אפס קריאות אמיתיות)');
