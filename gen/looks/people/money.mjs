/* money.mjs — לא מי שאני בחרתי ולא מערכות-עיצוב: **המוצרים הכי נפוצים בעולם**
   שהפעולה «לרשום תנועת-כסף ולהחזיר אותה» היא הליבה שלהם.
   נבחרו לפי מספר משתמשים בפועל, לא לפי טעם.
   הרצה: node gen/looks/people/money.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'money'), { recursive: true });

const P = [
  { id: 'alipay', name: 'Alipay', users: '1.3 מיליארד', url: 'https://global.alipay.com/', act: 'תשלום והחזר' },
  { id: 'paypal', name: 'PayPal', users: '430 מיליון', url: 'https://www.paypal.com/us/digital-wallet/send-receive-money', act: 'שליחה · החזר · מחלוקת' },
  { id: 'paypal-refund', name: 'PayPal · החזר', users: '430 מיליון', url: 'https://www.paypal.com/us/cshelp/article/how-do-i-issue-a-refund-help101', act: 'הפקת החזר' },
  { id: 'amazon', name: 'Amazon', users: '310 מיליון', url: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=GKM69DUUYKQWKWX7', act: 'ביטול הזמנה והחזר' },
  { id: 'phonepe', name: 'PhonePe', users: '580 מיליון', url: 'https://www.phonepe.com/', act: 'UPI — תשלום מיידי' },
  { id: 'paytm', name: 'Paytm', users: '350 מיליון', url: 'https://paytm.com/', act: 'ארנק והחזרים' },
  { id: 'nubank', name: 'Nubank', users: '100 מיליון', url: 'https://nubank.com.br/en/', act: 'בנק דיגיטלי' },
  { id: 'revolut', name: 'Revolut', users: '50 מיליון', url: 'https://www.revolut.com/', act: 'תנועות והחזרים' },
  { id: 'cashapp', name: 'Cash App', users: '57 מיליון', url: 'https://cash.app/', act: 'שליחה וקבלה' },
  { id: 'venmo', name: 'Venmo', users: '90 מיליון', url: 'https://venmo.com/', act: 'תשלום חברתי' },
  { id: 'klarna', name: 'Klarna', users: '150 מיליון', url: 'https://www.klarna.com/us/', act: 'תשלום והחזר' },
  { id: 'uber-receipt', name: 'Uber', users: '150 מיליון', url: 'https://help.uber.com/riders/article/i-would-like-a-refund?nodeId=b0e5b3d7-0c8a-4e88-9c34-8d3f6e2f6e3b', act: 'בדיקת-נסיעה והחזר' },
];

const LOOK = () => {
  const t = document.body.innerText;
  const money = ['refund', 'reverse', 'undo', 'cancel', 'dispute', 'chargeback', 'reversal', 'void'].filter(w => new RegExp('\\b' + w, 'i').test(t));
  const secs = [...new Set((t.match(/\b\d+\s*(seconds?|minutes?|hours?|days?|business days?)\b/gi) || []).map(s => s.replace(/\s+/g, ' ').trim()))].slice(0, 8);
  const shots = [...document.querySelectorAll('img,video')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 260 && r.height > 180; }).length;
  const gate = ['log in', 'sign in', 'download the app', 'get the app'].filter(w => t.toLowerCase().includes(w));
  return { money, secs, shots, gate, words: t.split(/\s+/).length };
};

const b = await chromium.launch();
const out = [];
for (const s of P) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3200);
    for (const t of ['Accept', 'Accept all', 'Accept All Cookies', 'Got it', 'Allow all', 'I agree', 'Aceitar', 'Agree']) {
      const x = p.locator(`button:has-text("${t}")`).first();
      if (await x.count() && await x.isVisible().catch(() => false)) { await x.click().catch(() => { }); await p.waitForTimeout(800); break; }
    }
    const r = await p.evaluate(LOOK);
    await p.screenshot({ path: join(here, 'money', s.id + '.png') });
    out.push({ ...s, ...r, title: (await p.title()).slice(0, 50) });
    console.log(`✓ ${s.name.padEnd(16)} ${s.users.padEnd(13)} מילות-החזר: ${r.money.join('/') || '—'}`);
    if (r.secs.length) console.log(`     זמנים: ${r.secs.slice(0, 5).join(' · ')}`);
  } catch (e) { console.log(`✗ ${s.name.padEnd(16)} ${String(e.message).slice(0, 45)}`); out.push({ ...s, err: String(e.message).slice(0, 45) }); }
  await p.close();
}
await b.close();
writeFileSync(join(here, 'money.json'), JSON.stringify(out, null, 1));
