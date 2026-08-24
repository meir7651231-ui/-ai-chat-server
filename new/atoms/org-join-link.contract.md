# חוזה · חוט org-join-link
**תפקיד:** הרכבת קישור-הזמנה לעובד/ת (ORGADMIN) —
‏`{origin}{basePath}?org={slug}&join={code}`. שרשור טהור, בלי encoding
ובלי ולידציה (הקלט כבר מנורמל אצל הקורא: slug ‏[a-z0-9-], code base36).
**קלט:** origin, basePath, slug, code — מחרוזות. **פלט:** מחרוזת-URL.
**דוגמאות מחייבות:**
- ‏('https://x.org', '/', 'maor', 'ab12cd34') ⇒ 'https://x.org/?org=maor&join=ab12cd34'
- ‏('https://x.org', '', 'maor', 'ab12cd34') ⇒ 'https://x.org?org=maor&join=ab12cd34'
- ‏('https://meir.github.io', '/maor-system/', 'demo', 'z9') ⇒
  'https://meir.github.io/maor-system/?org=demo&join=z9'
- ‏('', '', '', '') ⇒ '?org=&join='
**מוצא:** חולץ כלשונו מ-maor/src/components/platform/lib.ts:99-101.
