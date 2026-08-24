# חוזה · קופסת-חיבורים "וואטסאפ" (wa)
**תפקיד:** הקופסה של הרחבת-`whatsapp` — קישורי wa.me click-to-chat + נוסחי-ההודעה,
כפי שהם חיים ב-`maor/src/lib/wa.ts` (INTEGRATIONS גל א׳; ‏WaBtn ב-5 משטחים).
כל מה שהיה מולחם בשני קבצים (‏wa.ts + ‏templates.ts) — מחווט כאן במקום אחד:
המרת-טלפון ← wa-digits · קישור ← wa-link(שקע-digits) · שלושת הנוסחים ←
wa-*-text(שקעי render+orgOf) · רינדור-תבנית ← render-template(שקע-defs) ·
נוסחי-ברירת-המחדל ← template-defs (דאטת-חיווט).

**DoD (נכתב לפני הקוד — דיבר 12):**
- `node new/boxes/wa.test.mjs` ⇒ exit 0 + שורת ✓.
- `node /home/user/maor-system/machtzev/parity/wa.parity.mjs` ⇒ exit 0 + שורת 🥇
  (ישן≡חדש, אפס-סטייה, מאות השוואות).

**חשיפה (הממשק של lib/wa.ts אחד-לאחד — L4):**
- ‏`waDigits(phone)` ⇒ ספרות-בינלאומי ('972…') או null — ‏wa.ts:14-29.
- ‏`waLink(phone, text='')` ⇒ ‏'https://wa.me/<digits>[?text=…]' או null — ‏wa.ts:32-37.
- ‏`waDeliveryText(orgName, famName, cfg?)` — הודעת-מסירה (חלוקה) — ‏wa.ts:52-54.
- ‏`waPaymentText(orgName, what, balance, cfg?)` — תזכורת-תשלום; הסכום
  ‏Math.round + ‏toLocaleString('he-IL') — ‏wa.ts:57-63.
- ‏`waBirthdayText(orgName, firstName, cfg?)` — ברכת יום-הולדת — ‏wa.ts:66-68.

**הכרעות שחיות בקופסה (verbatim מהמקור):**
1. שם-ארגון ריק/רווחים ⇒ ‏'העמותה' (‏orgOf — ‏wa.ts:47-49). ‏ORG_FALLBACK במילון-הקופסה.
2. נוסחי-ברירת-המחדל = אטום-הקבוע ‏TEMPLATE_DEFS (‏templates.ts:19-52) מוזרק לשקע
   ‏defs של render-template — דריסת-ארגון (‏cfg.templates, אחרי trim) גוברת; ריק ⇒ ברירת-מחדל.
3. סדר-השקעים בחיווט-הטקסטים: ‏(orgName, …, cfg, wiredRender, orgOf) — כמו באטומים.

**שקעי-IO:** אין. הקופסה טהורה — פתיחת-הקישור בדפדפן/אפליקציה היא של לוח-האם.
‏encodeURIComponent / ‏toLocaleString = סטנדרט-שפה בתוך האטומים.

**דוגמאות מחייבות:**
- ‏waDigits('050-123-4567') ⇒ '972501234567' · ‏waDigits('+972 050-123-4567') ⇒
  '972501234567' (ה-0 המקומי נבלע — ‏wa.ts:19) · ‏waDigits('00972501234567') ⇒
  '972501234567' · ‏waDigits('501234567') ⇒ '972501234567' (ישראלי בלי 0 — ‏wa.ts:20-22) ·
  ‏waDigits('0044 20 7946 0958') ⇒ '442079460958' · ‏waDigits('05012') ⇒ null
  (0-מוביל באורך אחר — ‏wa.ts:25) · ‏waDigits('123') ⇒ null · ‏waDigits('') ⇒ null.
- ‏waLink('050-123-4567') ⇒ 'https://wa.me/972501234567' ·
  ‏waLink('050-123-4567','שלום') ⇒ 'https://wa.me/972501234567?text=%D7%A9%D7%9C%D7%95%D7%9D' ·
  ‏waLink('אבג','היי') ⇒ null · טקסט רווחים-בלבד ⇒ בלי ‏?text.
- ‏waDeliveryText('מאור החסד','כהן') ⇒ 'שלום משפחת כהן, משלוח ממאור החסד בדרך אליכם היום 🚚' ·
  ‏waDeliveryText('  ','לוי') ⇒ 'שלום משפחת לוי, משלוח מהעמותה בדרך אליכם היום 🚚' (הכרעה 1).
- ‏waPaymentText('מאור','חוג ציור',1234.6) ⇒
  'שלום, תזכורת ידידותית ממאור: יתרה לתשלום עבור חוג ציור — ₪1,235. תודה רבה!'.
- ‏waBirthdayText('מאור','דנה') ⇒ 'מזל טוב לדנה ליום ההולדת! 🎂 באהבה, מאור' ·
  עם דריסה ‏{'wa.birthday':'יומולדת שמח {first}! מ{org}'} ⇒ 'יומולדת שמח דנה! ממאור' ·
  דריסה '   ' (רווחים) ⇒ נופל לברירת-המחדל (הכרעה 2).

**מוצא:** ‏maor/src/lib/wa.ts (כולו) + ‏maor/src/lib/templates.ts:19-67
(‏TEMPLATE_DEFS + ‏renderTemplate). רתמת-זהב: ‏machtzev/parity/wa.parity.mjs.
