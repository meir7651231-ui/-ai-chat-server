/** 🔌 חוט · term-of — מונח-מותאם מהמילון: ‏cfg.terms[key] אחרי trim אם אינו-ריק, אחרת fallback.
 *  דריסה ריקה/רווחים-בלבד = "אין דריסה". הלב של ה-White-label (45 מונחים).
 *  מוצא: maor/src/lib/config.ts:119-126 כלשונו (הטווח ברישום היה מזוהם-ריבוי-הצהרות). */
export function termOf(cfg, key, fallback, T) {
  const v = cfg.terms?.[key];
  if (typeof v === T.k1) {
    const t = v.trim();
    if (t) return t;
  }
  return fallback;
}
