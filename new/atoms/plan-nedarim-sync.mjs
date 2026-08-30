/** חוט · plan-nedarim-sync — מנוע-הסנכרון נדרים→מאור (תוכנית-סנכרון טהורה).
 *  חוזה: plan-nedarim-sync.contract.md
 *  חולץ כלשונו מ-maor/src/lib/nedarimSync.ts:541-694; עשרת השכנים
 *  (nameSortKey/keysOf/normId/supFromDonor/supFromCharge/histDedupKey/
 *  chargeDedupKey/chargeToHist/withNedarimHok/curOf) הוזרקו כאובייקט-deps
 *  (חוק-1 — אפס import פנימי). */
export function planNedarimSync(existing, donors, charges, opts = {}, deps, T) {
  const { nameSortKey, keysOf, normId, supFromDonor, supFromCharge, histDedupKey, chargeDedupKey, chargeToHist, withNedarimHok, curOf } = deps;
  const out = existing.map((s) => ({ ...s, hist: s.hist ? [...s.hist] : undefined }));
  const keyIndex = new Map(); // key → index ב-out
  // אינדקס-שם (שם מנורמל → idx) — לקישור-עסקה-לפי-שם: היסטוריית-נדרים מגיעה בלי
  // ToremId/ת"ז/טלפון (רק ClientName), לכן זו הדרך היחידה לחבר עסקה לכרטיס-תורם.
  // ערך -1 = שם עמום (יותר מכרטיס אחד) ⇒ לא מתאימים לפיו (בטיחות מפני מיזוג-שווא).
  const nameIndex = new Map();
  // מפתח-שם חסין-סדר (משפחה-קודם≡פרטי-קודם) + מנוקה-תארים — הליבה של זיהוי-הכפילות.
  const nkey = (s) => nameSortKey(s || '');
  const registerName = (idx) => {
    const nk = nkey(out[idx].name);
    if (!nk)
      return;
    const prev = nameIndex.get(nk);
    if (prev == null)
      nameIndex.set(nk, idx);
    else if (prev !== idx)
      nameIndex.set(nk, -1); // שם משותף ל-2 כרטיסים ⇒ עמום
  };
  const register = (idx) => {
    for (const k of keysOf(out[idx]))
      if (!keyIndex.has(k))
        keyIndex.set(k, idx);
    registerName(idx);
  };
  out.forEach((_, i) => register(i));
  const findIdx = (keys) => {
    for (const k of keys) {
      const i = keyIndex.get(k);
      if (i != null)
        return i;
    }
    return -1;
  };
  /** קישור-לפי-שם (fallback לעסקאות בלי מפתח-חזק) — עמום/ריק ⇒ -1. */
  const findByName = (name) => {
    const i = nameIndex.get(nkey(name));
    return i != null && i >= 0 ? i : -1;
  };
  const summary = {
    existing: existing.length,
    donorsIn: donors.length,
    chargesIn: charges.length,
    newSupporters: 0,
    updatedSupporters: 0,
    chargesAdded: 0,
    chargesDup: 0,
    chargesNoTxn: 0,
    chargesSkipped: 0,
    chargesNonPositive: 0,
    refundsApplied: 0,
    recurring: 0,
    ilsAdded: 0,
    usdAdded: 0,
  };
  const newNames = [];
  const updatedNames = [];
  // ── שלב 1: תורמים → כרטיסים (התאמה/העשרה/יצירה) ──
  for (const d of donors) {
    if (!d.toremId && !d.name)
      continue;
    let idx = findIdx(keysOf({ extId: d.toremId, zeout: d.zeout, phone: d.phone, phone2: d.phone2, phone3: d.phone3, email: d.email, name: d.name }));
    // קישור-לפי-שם: בנדרים הת"ז לרוב "000000000" (ריקה) ולחלק אין טלפון-תואם ⇒
    // בלי זה תורם-קיים "לא-נמצא" ונוצר ככפול. שם עמום (2 כרטיסים) ⇒ -1 (יצירה).
    if (idx < 0)
      idx = findByName(d.name);
    if (idx >= 0) {
      // העשרה — מילוי-שדות-ריקים בלבד + קביעת extId (מפתח-שיוך עתידי)
      const sp = out[idx];
      let changed = false;
      const fill = (k, v) => {
        if (v && !(sp[k] || '').trim()) {
          sp[k] = v;
          changed = true;
        }
      };
      fill(T.k1, d.toremId);
      fill(T.k2, (d.phone || d.phone2 || d.phone3 || '').trim());
      fill(T.k3, (d.email || '').trim());
      fill(T.k4, (d.address || '').trim());
      fill(T.k5, normId(d.zeout) ? String(d.zeout).replace(/\D/g, '') : '');
      if (changed) {
        register(idx); // מפתחות-חדשים (טלפון/מייל/ext) ⇒ עסקאות עתידיות יתאימו
        summary.updatedSupporters++;
        if (updatedNames.length < T.k6)
          updatedNames.push(sp.name);
      }
    }
    else {
      const sp = supFromDonor(d);
      out.push(sp);
      register(out.length - 1);
      summary.newSupporters++;
      if (newNames.length < T.k6)
        newNames.push(sp.name);
    }
  }
  // ── שלב 2: עסקאות → hist[] של הכרטיס התואם (דדופ txn/ref; יצירה אם אין) ──
  const seenKeys = new Map(); // idx → מפתחות-דדופ שכבר ב-hist
  const keySetFor = (idx) => {
    let s = seenKeys.get(idx);
    if (!s) {
      s = new Set((out[idx].hist || []).map(histDedupKey).filter(Boolean));
      seenKeys.set(idx, s);
    }
    return s;
  };
  const handledChargeIds = [];
  let chargeSeq = 0;
  for (const c of charges) {
    chargeSeq++;
    // פאזה-מודעת-כסף: ביטול (Amount 0) — אין-כסף, מסמנים טופל בלבד (לא ל-hist).
    if (c.amount === 0) {
      summary.chargesNonPositive++;
      if (c.id)
        handledChargeIds.push(c.id);
      continue;
    }
    const refund = c.amount < 0; // זיכוי — יירשם כשורת-hist שלילית (מקזזת את הצבירה)
    let idx = findIdx(keysOf({ extId: c.toremId, zeout: c.zeout, phone: c.phone, email: c.email, name: c.name }));
    // קישור-לפי-שם (ClientName) — היסטוריית-נדרים בלי מפתח-חזק. **רק בסנכרון-המלא:**
    // בחיבור-החי (attachOnly) שם-בלבד עלול לזקוף לכרטיס-שגוי (שם-יחיד ≠ עמום) בלי
    // סקירה — כמו במסלול-הידני, שם-בלבד נשאר לשיוך-ידני עם תצוגה-מקדימה.
    if (idx < 0 && !opts.attachOnly)
      idx = findByName(c.name);
    if (idx < 0) {
      // אין כרטיס-תואם. במצב attachOnly (חיבור-חי) — **לא** יוצרים כרטיס אוטומטי
      // (מונע ריבוי-כרטיסים); העסקה נשארת pending לסנכרון-הידני עם תצוגה-מקדימה.
      if (opts.attachOnly) {
        summary.chargesSkipped++;
        continue;
      }
      // זיכוי בלי כרטיס-תואם — **לא** יוצרים כרטיס-שלילי; נשאר pending לשיוך-ידני.
      if (refund) {
        summary.chargesSkipped++;
        continue;
      }
      const sp = supFromCharge(c, chargeSeq);
      // אם כבר קיים כרטיס באותו מזהה-דטרמיניסטי (עסקה קודמת יצרה) — אתרו אותו
      const same = out.findIndex((s) => s.id === sp.id);
      if (same >= 0)
        idx = same;
      else {
        out.push(sp);
        idx = out.length - 1;
        register(idx);
        summary.newSupporters++;
        if (newNames.length < T.k6)
          newNames.push(sp.name);
      }
    }
    const key = chargeDedupKey(c);
    const seen = keySetFor(idx);
    if (key && seen.has(key)) {
      summary.chargesDup++;
      if (c.id)
        handledChargeIds.push(c.id);
      continue;
    }
    if (key)
      seen.add(key);
    else
      summary.chargesNoTxn++;
    // זיכוי (refund) = שורת-hist שלילית שמקזזת את הצבירה — **בלי** withNedarimHok
    // (לא ממלא הו"ק מזיכוי) ובלי מונה-recurring. חיוב-רגיל = כרגיל (+ מילוי-הו"ק).
    const nextHist = [...(out[idx].hist || []), chargeToHist(c)];
    out[idx] = refund ? { ...out[idx], hist: nextHist } : withNedarimHok({ ...out[idx], hist: nextHist }, c);
    if (refund)
      summary.refundsApplied++;
    else {
      if (c.kevaId)
        summary.recurring++; // נספר **רק** על חיוב-הו"ק שנוסף בפועל (לא על dup/זיכוי)
      summary.chargesAdded++;
    }
    if (c.id)
      handledChargeIds.push(c.id); // חובר ⇒ אפשר לסמן handled
    // c.amount שלילי בזיכוי ⇒ מקזז את הצבירה מעצם הסכימה (הכרעת "לכולל": נטו).
    if (curOf(c) === '$')
      summary.usdAdded += c.amount;
    else
      summary.ilsAdded += c.amount;
  }
  return { supporters: out, summary, newNames, updatedNames, handledChargeIds };
}
