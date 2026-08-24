# חוזה · קופסת-חיבורים "תבניות-ההודעה" (templates)
**תפקיד:** הקופסה של `maor/src/lib/templates.ts` (ROADMAP-100 ‏#12) — נוסחי-הוואטסאפ
העריכים פר-ארגון. שלושת החוטים מחווטים במקום אחד:
מילון ← template-defs · מפתחות ← template-keys(מילון) · רינדור ← render-template(מילון).

**עוגני-מקור (דיבר 11):**
- ‏`maor/src/lib/templates.ts:19-52` — ‏TEMPLATE_DEFS: ‏5 תבניות בסדר קבוע
  (wa.delivery · wa.payment · wa.birthday · wa.dialer · wa.paylink), נוסחי-ברירת-מחדל
  ביט-זהים לנוסחים ההיסטוריים (ratchet במקור).
- ‏`maor/src/lib/templates.ts:54` — ‏TEMPLATE_KEYS = מיפוי-מפתחות מהמילון (סדר נשמר).
- ‏`maor/src/lib/templates.ts:57-66` — ‏renderTemplate: דריסה `cfg?.templates?.[key]`
  (שורה 63: ‏`.trim() || def` — ריק/רווחים ⇒ ברירת-המחדל; מפתח לא-מוכר ⇒ ‏def='');
  החלפה טקסטואלית `split('{k}').join(v)` פר-משתנה (שורה 64) — סדרתית לפי
  ‏Object.entries(vars); משתנה שלא סופק נשאר `{כפי-שהוא}`.

**חשיפה:**
- ‏`TEMPLATE_DEFS` — המילון המחווט (key·label·vars·def) ×5.
- ‏`TEMPLATE_KEYS` — ‏['wa.delivery','wa.payment','wa.birthday','wa.dialer','wa.paylink'].
- ‏`renderTemplate(cfg, key, vars) ⇒ string` — ‏cfg = ‏{ templates?: Record<key,נוסח> }
  או undefined; ‏vars = ‏Record<שם,ערך>.

**שקעי-IO (לוח-האם, לא הקופסה):** טעינת-הקונפיג (localStorage/ענן/אשף) · שליחת-
ההודעה (wa.me/SMS) · עריכת-הנוסח באשף. הקופסה טהורה — אפס DOM/רשת/שעון.

**דוגמאות מחייבות (הבדיקה מוכיחה בדיוק אותן):**
1. ‏`renderTemplate(undefined,'wa.delivery',{name:'דנה',org:'מאור החסד'})`
   ⇒ ‏`'שלום דנה, משלוח ממאור החסד בדרך אליכם היום 🚚'`
2. דריסת-ארגון גוברת: ‏`{templates:{'wa.delivery':'היי {name} מ{org}!'}}`
   ⇒ ‏`'היי דנה ממאור החסד!'`
3. דריסה של רווחים-בלבד `'   '` ⇒ ברירת-המחדל (כמו 1).
4. מפתח לא-מוכר `'wa.nope'` ⇒ `''` (ובדריסה — הדריסה כן מרונדרת).
5. משתנה לא-סופק נשאר: ‏`renderTemplate(undefined,'wa.birthday',{org:'מאור'})`
   ⇒ ‏`'מזל טוב ל{first} ליום ההולדת! 🎂 באהבה, מאור'`
6. ‏`renderTemplate(undefined,'wa.payment',{org:'מאור',what:'חוג ציור',amount:'120'})`
   ⇒ ‏`'שלום, תזכורת ידידותית ממאור: יתרה לתשלום עבור חוג ציור — ₪120. תודה רבה!'`
7. ‏cfg=null / ‏templates:null ⇒ מתנהג כ-undefined (אופציונל-שרשור במקור).

**מגן-הכרעה:** הבדיקה קוראת את מקור-הקופסה ומאשרת verbatim את הזרקת-המילון
לשני השקעים (`templateKeys(TEMPLATE_DEFS)` · `renderTemplateAtom(cfg, key, vars, TEMPLATE_DEFS)`).
**רתמת-זהב:** ‏`maor-system/machtzev/parity/templates.parity.mjs` — ישן≡חדש, ‏seed=20260824.
