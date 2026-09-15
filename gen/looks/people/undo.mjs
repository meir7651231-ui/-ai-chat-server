/* undo.mjs — מי בעולם מצטיין ב«בצע מיד · אפשר להחזיר · רשום ביומן».
   רוב המוצרים האלה נעולים מאחורי חשבון, אבל **עמודי-העזרה שלהם ציבוריים
   ומכילים את צילום-הממשק האמיתי** — שם מצלמים.
   הרצה: node gen/looks/people/undo.mjs */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(here, 'undo'), { recursive: true });

const P = [
  { id: 'gmail', name: 'Gmail', url: 'https://support.google.com/mail/answer/2819488', y: 500,
    part: 'Undo Send', does: 'הפעולה יוצאת, והחלון לחזור נשאר פתוח 30 שניות' },
  { id: 'stripe-refund', name: 'Stripe', url: 'https://docs.stripe.com/refunds', y: 700,
    part: 'Refund = רישום-נגדי', does: 'חיוב לא נמחק לעולם — נרשם זיכוי שמפנה אליו' },
  { id: 'stripe-events', name: 'Stripe Events', url: 'https://docs.stripe.com/api/events', y: 400,
    part: 'Event log', does: 'כל שינוי במערכת הוא אירוע בלתי-מחיק עם מי·מה·מתי' },
  { id: 'xero', name: 'Xero', url: 'https://central.xero.com/s/article/History-and-notes', y: 400,
    part: 'History & notes', does: 'לכל רשומה חשבונאית: מי נגע, מה שינה, מתי' },
  { id: 'quickbooks', name: 'QuickBooks', url: 'https://quickbooks.intuit.com/learn-support/en-us/help-article/audit-trails/use-audit-log/L0mcpVZKn_US_en_US', y: 600,
    part: 'Audit log', does: 'יומן-ביקורת שאי-אפשר לערוך — הסטנדרט החשבונאי' },
  { id: 'figma', name: 'Figma', url: 'https://help.figma.com/hc/en-us/articles/360038006754-View-a-file-s-version-history', y: 500,
    part: 'Version history', does: 'ביטול אינסופי + ציר-גרסאות עם שמות' },
  { id: 'notion', name: 'Notion', url: 'https://www.notion.com/help/duplicate-delete-and-restore-content', y: 600,
    part: 'Trash & restore', does: 'מחיקה היא העברה לסל — לא השמדה' },
  { id: 'linear', name: 'Linear', url: 'https://linear.app/docs/keyboard-shortcuts', y: 400,
    part: 'Ctrl+Z בכל מקום', does: 'כל פעולה הרסנית מקבלת טוסט-ביטול' },
  { id: 'slack', name: 'Slack', url: 'https://slack.com/help/articles/202395258-Edit-or-delete-messages', y: 500,
    part: 'Edit history', does: 'הודעה שנערכה נושאת סימן «נערך» — השינוי גלוי' },
  { id: 'dropbox', name: 'Dropbox', url: 'https://help.dropbox.com/organize/version-history-overview', y: 500,
    part: 'Version history', does: 'כל גרסה נשמרת; שחזור הוא יצירת גרסה חדשה' },
  { id: 'github-revert', name: 'GitHub', url: 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts', y: 300,
    part: 'Revert', does: 'ביטול = קומיט חדש שמבטל, לא מחיקת היסטוריה' },
];

const b = await chromium.launch();
const out = [];
for (const s of P) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await p.waitForTimeout(3000);
    for (const t of ['Accept', 'Accept all', 'Got it', 'Allow all', 'I agree', 'Accept All Cookies']) {
      const btn = p.locator(`button:has-text("${t}")`).first();
      if (await btn.count() && await btn.isVisible().catch(() => false)) { await btn.click().catch(() => { }); await p.waitForTimeout(700); break; }
    }
    if (s.y) { await p.evaluate(y => window.scrollTo(0, y), s.y); await p.waitForTimeout(1400); }
    const shots = await p.evaluate(() => [...document.querySelectorAll('img')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 300 && r.height > 150; }).length);
    await p.screenshot({ path: join(here, 'undo', s.id + '.png') });
    out.push({ ...s, shots, title: (await p.title()).slice(0, 55) });
    console.log(`✓ ${s.name.padEnd(14)} ${s.part.padEnd(22)} צילומי-ממשק ${shots}`);
  } catch (e) { console.log(`✗ ${s.name.padEnd(14)} ${String(e.message).slice(0, 45)}`); out.push({ ...s, err: String(e.message).slice(0, 45) }); }
  await p.close();
}
await b.close();
writeFileSync(join(here, 'undo.json'), JSON.stringify(out, null, 1));
