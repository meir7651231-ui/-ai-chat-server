# חוזה · חוט filter-collections
**תפקיד:** סינון היסטוריית-הריקונים של קופת-צדקה — טווח-תאריכים **כוללני**
(שני הקצוות בפנים; קצה ריק = בלי גבול) + מבצע (‏campaignId ריק = כל המבצעים).
טהור; הסדר המקורי נשמר, הקלט לא משתנה.
**שקעים (חוק-1 — קריאת-השכן הוזרקה):**
- ‏dateInRange(iso, fromIso, toIso) ⇒ ‏boolean — השוואת-מחרוזות ISO כוללנית:
  ‏(!from || iso>=from) && (!to || iso<=to) (האטום date-in-range; מקור:
  date-util.ts:30-32).
**קלט:** ‏box{collections:{date,campaignId,…}[]} · fromIso ('' | iso) ·
toIso ('' | iso) · campaignId ('' | id) · השקע. **פלט:** ריקונים מסוננים.
**דוגמאות מחייבות** (‏box.collections: ‏k1={date:'2026-01-05',campaignId:'c1',
amount:100} · ‏k2={date:'2026-02-10',campaignId:'',amount:50} ·
‏k3={date:'2026-03-15',campaignId:'c1',amount:70}):
1. ‏from='2026-01-05', to='2026-02-28', campaignId='' ⇒ ‏[k1,k2] —
   קצה-התחתון כוללני (k1 בדיוק על from).
2. ‏from='', to='', campaignId='' ⇒ שלושתם (בלי גבולות).
3. ‏campaignId='c1' (בלי טווח) ⇒ ‏[k1,k3].
4. ‏from='2026-02-01' + campaignId='c1' ⇒ ‏[k3] — שילוב שני הדינים.
5. ‏to='2026-01-04' ⇒ ‏[] — יום לפני הריקון הראשון.
**מוצא:** maor/src/components/tzedaka/lib.ts:233-249 (‏filterCollections,
UX סינון גל B½ — "dateInRange המשותף"). ‏dateInRange שוקע (חוק-1).
