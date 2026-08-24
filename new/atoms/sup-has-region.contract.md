# חוזה · חוט sup-has-region
**תפקיד:** האם לתורם יש טלפון כלשהו באזור המבוקש (סינון חול/ישראל בלוח-התורמים).
**קלט:**
- `sp` — אובייקט-תורם (מועבר כמות-שהוא לשקע).
- `region` — האזור המבוקש: `'il'` | `'intl'`.
- `allSupPhones` — **שקע** (חוט-שכן, מוזרק): `(sp) ⇒ [{ region, ... }]` —
  רשימת שורות-הטלפון של התורם, כל אחת עם שדה `region`.
**פלט:** בוליאני — `true` אם לפחות שורת-טלפון אחת עם `row.region === region`.
**התנהגות:** `allSupPhones(sp).some((r) => r.region === region)`. אין טלפונים ⇒ `false`.
**דוגמאות מחייבות (שקע-דמה `ap = sp => sp.rows`):**
- ‏`({rows:[{region:'il'}]}, 'il', ap)` → `true`
- ‏`({rows:[{region:'il'}]}, 'intl', ap)` → `false`
- ‏`({rows:[]}, 'il', ap)` → `false`
- ‏`({rows:[{region:'intl'},{region:'il'}]}, 'intl', ap)` → `true`
- ‏`({rows:[{region:'intl'},{region:'il'}]}, 'il', ap)` → `true`
- ‏`({rows:[{region:'intl'}]}, 'il', ap)` → `false`
**מוצא:** maor/src/components/supporters/lib.ts:295-297 (`supHasRegion`). במקור קרא
ל-`allSupPhones` מאותו מודול — כאן הוזרם כשקע-פרמטר (חוק-1: אפס import פנימי).
