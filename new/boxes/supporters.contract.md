# חוזה · קופסת-חיבורים "תומכים" (components-supporters)

**מקור-האמת (L4):** `maor/src/components/supporters/lib.ts` — 41 חוטי-התומכים.
הקופסה מחווטת אותם לפי גרף-הקריאות; קריאת-שכן ⇒ שקע מוזרק (LAW חוק-1/3).

## שקעי-IO (מוזרקים, לא ממומשים בקופסה)
- **clockIso** `() => 'YYYY-MM-DD'` — שעון-מקומי. משמש את `isoToday(clockIso)`
  ו-`applyAyinNames(...,clockIso)`. במקור: `isoTodayLocal` (date-util.ts:9).
- **Date.now** — שעון-מערכת, בתוך `supScore`/`supScoreBins` (מקור: lib.ts:158);
  ברירת-המחדל של האטום שומרת אותו verbatim.
- **mkId** `() => string` — מחולל-מזהה ל-`applyAyinNames` (מקור: lib.ts:536).
- **config** (OrgConfig) — אופציונלי ל-`supDonEvents`/`donCalMonthLine`, מחווט
  ל-`termOf` (בורר-המונחים). חסר ⇒ ה-fallback העברי, ביט-זהה למקור.

## החלטות החיות בקופסה
- **emptyAyin()** — ברירת-מחדל "תיק-מעקב ריק", ביט-זהה ל-`domain.ts:598-616`
  (החלטת-קופסה, לא אטום — LAW תיקון-בעלים לחוק-5).
- **fillEmpty(a,b)** — מדיניות-מיזוג-שדות בייבוא, verbatim מ-`lib.ts:522-531`
  (אין אטום; המדיניות שייכת לחיווט, כמו הקסקדה ב-search.mjs).
- **visibleSupportersForDesignations** — סינון-הרשימה (filter+map) מחווט מעל
  האטום-הבודד `supporterVisibleForDesignations`, verbatim מ-`lib.ts:77-92`
  (האטום הקבוצתי קרא לשכן בלי שקע ⇒ החיווט חי כאן).

## החשיפה (דוגמאות מספריות מהמקור)
- `supIls(sp)` — `sp.ils + Σ hist(≠$)`. `ils:100, hist:[{a:200,c:'₪'}]` ⇒ **300** (lib.ts:108).
- `supUsd(sp)` — `sp.usd + Σ hist($)`. (lib.ts:113).
- `supCount(sp)` — `sp.count + |hist(a>0)|`. `count:2, hist:[{a:200}]` ⇒ **3** (lib.ts:120).
- `supLast(sp)` — max(sp.last, hist.d). (lib.ts:125).
- `supTotalIls(sp,rate=3.7)` — `ils + usd·rate`. `300 + 10·3.7` ⇒ **337** (lib.ts:145).
- `supScore(sp,rate=3.7)` — RFM 0–1000, ספים verbatim (lib.ts:153-164).
- `supTier(sc)` — ≥800 זהב `{bg:'#fdf3dd',c:'#9a6414',dot:'#f3c76b'}`; ≥600 כסף; ≥400 ארד; אחרת רדומה (lib.ts:174-179).
- `TIER_ORDER` — `['זהב','כסף','ארד','רדומה']` (lib.ts:181).
- `fmtDate('2026-08-01')` ⇒ **'01/08/2026'**; ריק/שבור ⇒ '—' (lib.ts:17-22).
- `normName('בן דוד')` ⇒ **'בנדוד'** (normSearch + הסרת רווחים, lib.ts:362).
- `fixPhone('0501234567')` ⇒ **'050-1234567'** (formatIsraeliPhone, lib.ts:232).
- `totalLabel(sp)` ⇒ `'₪300 + $10'` / '—' (lib.ts:237-243).
- `supDonEvents(sp)` — donations 'קבלה R-N' + hist (clearer ⇒ 'תרומה', אחרת 'מהקובץ ההיסטורי'), ממוין חדש→ישן (lib.ts:263-298).
- `supporterVisibleForDesignations(sup,allowed)` — allowed ריק/null ⇒ true; אחרת forWho ∈ allowed (בלי forWho ⇒ false) (lib.ts:57-67).
- `visibleSupportersForDesignations(sups,allowed)` — מסנן תורמים-גלויים + תרומות-בייעוד (lib.ts:77-92).
- `allDonationPurposes(sups)` — distinct+localeCompare של forWho∪purpose (lib.ts:96-100).
- `excelSerialToIso(45900)` — ימים-מ-1899-12-30 ⇒ ISO; קלט לא-תקין ⇒ '' (lib.ts:403-410).
- `parseSupporterGrid/Csv` — זיהוי-כותרות ב-15 השורות העליונות, עמודות-סליקה ⇒ hist (lib.ts:418-510).
- `mergeHist(existing,incoming)` — מיזוג אידמפוטנטי לפי `d|a|c`, max-מופעים, מיון-תאריך (lib.ts:559-593).
- `planSupporterImport(rows,existing)` — שם-מנורמל ⇒ update/insert; כפילות-בקובץ ⇒ fillEmpty (lib.ts:600-635).
- `mergeSupporterRow` / `newSupporterFromRow` — עדכון/יצירה; טלפון דרך fixPhone (lib.ts:639-674).
- `applyAyinNames(sp,names,mkId,clockIso)` — שמות ⇒ תיק (planAddName, dedup); eyes='' ⇒ clockIso לא נקרא (lib.ts:536-548).
- `HOK_CAT` = `'הו"ק'` (lib.ts:681).
- `hokEffectivelyActive/RecordedThisMonth/Due/MonthlyTotal` — מנוע הו"ק, todayIso מוזרק (lib.ts:696-744).
- `hokMethodLabel('bank')` ⇒ `'הו"ק בנקאית'`; card/cash/'' (lib.ts:747-752).

## DoD
`node new/boxes/supporters.test.mjs` ⇒ exit 0 · `node maor/machtzev/parity/supporters.parity.mjs` ⇒ exit 0.
