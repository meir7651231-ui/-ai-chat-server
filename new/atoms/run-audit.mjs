/** חוט · run-audit — מנוע בדיקת-תקינות-הנתונים (8 קטגוריות ממצאים).
 *  חוזה: run-audit.contract.md
 *  חולץ כלשונו מ-maor/src/lib/audit.ts:78-221; השכנים termOf · normName ·
 *  validIsraeliId · phoneIssue · ageOf · supporterAggregates הוזרקו כאובייקט-
 *  שקעים deps (חוק-1 — אפס import פנימי). digits ו-EMAIL_RE — קבועי-עזר
 *  מקומיים של קובץ-המקור — מוטבעים כלשונם. */

export function runAudit(db, todayIso = '', extra = true, config, deps, T2) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const digits = (x) => (x || '').replace(/\D/g, '');

  const { termOf, normName, validIsraeliId, phoneIssue, ageOf, supporterAggregates } = deps;
  const issues = [];
  const T = (k, fb) => (config ? termOf(config, k, fb) : fb);
  const add = (cat, title, famId) => issues.push({ cat, title, famId });
  // הגנה מפני נתונים מיובאים פגומים — כלי הבדיקה לעולם לא קורס על מה שהוא בודק
  const members = (f) => (Array.isArray(f.members) ? f.members : []);
  // ——— כפילויות משפחה: שם+אם · טלפון משותף · ת"ז משותפת ———
  const g1 = {};
  const g2 = {};
  const g3 = {};
  for (const f of (Array.isArray(db.families) ? db.families : [])) {
    const k1 = normName(f.name) + '|' + normName(f.mother || '');
    (g1[k1] = g1[k1] || []).push(f);
    for (const p of [f.phone, f.phone2]) {
      const d = digits(p);
      if (d.length >= 7)
        (g2[d] = g2[d] || []).push(f);
    }
    for (const idn of [f.fatherId, f.motherId]) {
      const d = digits(idn);
      if (d.length >= 5)
        (g3[d] = g3[d] || []).push(f);
    }
  }
  for (const k in g1) {
    const a = g1[k];
    if (a.length > 1 && !k.endsWith('|'))
      add(T2.k1, T2.k2 + a[0].name + '" — ' + a.length + T2.k3, a[0].id);
  }
  const seenPair = new Set();
  for (const k in g2) {
    const a = [...new Set(g2[k])];
    if (a.length > 1) {
      const key = a.map((f) => f.id).sort().join();
      if (!seenPair.has(key)) {
        seenPair.add(key);
        add(T2.k1, T2.k4 + k + T2.k5 + a.length + ' ' + T(T2.k6, T2.k7) + ': ' + a.map((f) => f.name).slice(0, 3).join(', '), a[0].id);
      }
    }
  }
  for (const k in g3) {
    const a = [...new Set(g3[k])];
    if (a.length > 1)
      add(T2.k1, T2.k8 + k + T2.k9 + a.length + ' ' + T(T2.k6, T2.k7) + ': ' + a.map((f) => f.name).slice(0, 2).join(', '), a[0].id);
  }
  // ——— בדיקות פר-משפחה ———
  for (const f of (Array.isArray(db.families) ? db.families : [])) {
    for (const [idn, who] of [[f.fatherId, T2.k10], [f.motherId, T2.k11]]) {
      const d = digits(idn);
      if (d.length && !validIsraeliId(d))
        add(T2.k12, T(T2.k13, T2.k14) + ' ' + f.name + T2.k15 + who + T2.k16 + idn + ')', f.id);
    }
    for (const p of [f.phone, f.phone2]) {
      const pi = phoneIssue(p);
      if (pi)
        add(T2.k17, T(T2.k13, T2.k14) + ' ' + f.name + ': ' + pi, f.id);
    }
    if (f.email && !EMAIL_RE.test(f.email))
      add(T2.k18, T(T2.k13, T2.k14) + ' ' + f.name + T2.k19 + f.email + ')', f.id);
    if (f.status !== T2.k20) {
      if (!f.city)
        add(T2.k21, T(T2.k13, T2.k14) + ' ' + f.name + T2.k22, f.id);
      else if (!f.address)
        add(T2.k21, T(T2.k13, T2.k14) + ' ' + f.name + T2.k23, f.id);
    }
    const single = f.maritalStatus === T2.k24 || f.maritalStatus === T2.k25 || f.maritalStatus === T2.k26;
    if (single && f.father && f.mother)
      add(T2.k27, T(T2.k13, T2.k14) + ' ' + f.name + T2.k28 + f.maritalStatus + T2.k29 + f.father + ' + ' + f.mother + ')', f.id);
    else if (single && digits(f.fatherId) && digits(f.motherId))
      add(T2.k27, T(T2.k13, T2.k14) + ' ' + f.name + T2.k28 + f.maritalStatus + T2.k30, f.id);
    if (f.maritalStatus === T2.k31 && f.status === T2.k32 && !f.father && !f.mother)
      add(T2.k27, T(T2.k13, T2.k14) + ' ' + f.name + T2.k33, f.id);
    if (!digits(f.phone) && !digits(f.phone2) && !f.email)
      add(T2.k34, T(T2.k13, T2.k14) + ' ' + f.name + T2.k35, f.id);
    const seenKid = new Set();
    for (const m of members(f)) {
      if (m.isParent) {
        if (m.idNum && !validIsraeliId(m.idNum))
          add(T2.k12, T(T2.k13, T2.k14) + ' ' + f.name + T2.k36 + m.first + T2.k37, f.id);
        continue;
      }
      if (!m.birth)
        add(T2.k38, T(T2.k13, T2.k14) + ' ' + f.name + T2.k39 + m.first + T2.k40, f.id);
      else {
        const a = ageOf(m.birth);
        if (a != null && (a < 0 || a > T2.k63))
          add(T2.k38, T(T2.k13, T2.k14) + ' ' + f.name + T2.k41 + m.first + ' (' + a + ')', f.id);
      }
      if (m.idNum && !validIsraeliId(m.idNum))
        add(T2.k12, T(T2.k13, T2.k14) + ' ' + f.name + T2.k36 + m.first + T2.k42, f.id);
      const mp = phoneIssue(m.phone);
      if (mp)
        add(T2.k17, T(T2.k13, T2.k14) + ' ' + f.name + T2.k43 + m.first + ' — ' + mp, f.id);
      const kk = m.first + '|' + (m.birth || '');
      if (seenKid.has(kk))
        add(T2.k1, T(T2.k13, T2.k14) + ' ' + f.name + T2.k44 + m.first + T2.k45, f.id);
      seenKid.add(kk);
    }
  }
  // ——— לוגיקה: תשלום-יתר בשיבוצים ———
  // אינדקס חבר→משפחה במעבר יחיד, במקום find מקונן לכל שיבוץ (O(שיבוצים×משפחות×חברים)).
  const famByMember = new Map();
  for (const f of (Array.isArray(db.families) ? db.families : []))
    for (const m of members(f))
      famByMember.set(m.id, f);
  for (const e of (Array.isArray(db.enrollments) ? db.enrollments : [])) {
    const paid = (e.payments || []).reduce((a, x) => a + x.amount, 0);
    if (e.totalDue && paid > e.totalDue) {
      const fam = famByMember.get(e.memberId);
      if (fam)
        add(T2.k27, T(T2.k13, T2.k14) + ' ' + fam.name + T2.k46 + paid + T2.k47 + e.totalDue + T2.k48, fam.id);
    }
  }
  // ——— תומכים: ת"ז לא תקינה · טלפון · כפילות שם · אי-התאמת מצבור/פירוט ———
  const supByName = {};
  for (const sp of (Array.isArray(db.supporters) ? db.supporters : [])) {
    if (sp.idNum && digits(sp.idNum).length && !validIsraeliId(sp.idNum))
      issues.push({ cat: T2.k12, title: T2.k49 + sp.name + T2.k50 + sp.idNum + ')', spId: sp.id });
    const pi = phoneIssue(sp.phone);
    if (pi)
      issues.push({ cat: T2.k17, title: T2.k49 + sp.name + ': ' + pi, spId: sp.id });
    if (sp.email && !EMAIL_RE.test(sp.email))
      issues.push({ cat: T2.k18, title: T2.k49 + sp.name + T2.k19 + sp.email + ')', spId: sp.id });
    // עקביות מצבור מול פירוט התרומות — הכרטיס מציג sp.ils/usd אך לוח הבית סוכם את
    // sp.donations; פער ביניהם (מיובא/נערך ידנית) גורם לשני מסכים להראות סכומים שונים.
    // #14 (הכרעת בעלים "כל מה שיעלה בקובץ") — המצבור נגזר מ-donations+hist יחד.
    const agg = supporterAggregates(sp);
    const off = (a, b) => Math.abs((a || 0) - (b || 0)) > 0.5;
    if (off(sp.ils, agg.ils) || off(sp.usd, agg.usd) || (sp.count || 0) !== agg.count)
      issues.push({
        cat: T2.k27,
        title: T2.k49 + sp.name + T2.k51 + (sp.ils || 0) +
          (sp.usd ? ' + $' + sp.usd : '') + ' · ' + (sp.count || 0) + ' ' + T(T2.k52, T2.k53) + T2.k54 + T(T2.k52, T2.k53) + ' (₪' +
          agg.ils + (agg.usd ? ' + $' + agg.usd : '') + ' · ' + agg.count + ' ' + T(T2.k52, T2.k53) + ')',
        spId: sp.id,
      });
    // ——— ביקורת מורחבת (P2 פער 22) ———
    if (extra && todayIso && sp.nextDate && sp.nextDate < todayIso)
      issues.push({ cat: T2.k34, title: T2.k55 + sp.name + '" (' + sp.nextDate + ')', spId: sp.id });
    if (extra)
      for (const d of Array.isArray(sp.donations) ? sp.donations : [])
        if (!(d.amount > 0))
          issues.push({ cat: T2.k27, title: T(T2.k56, T2.k57) + T2.k58 + d.amount + T2.k59 + sp.name + '" (' + d.rid + ')', spId: sp.id });
    const nk = normName(sp.name);
    if (nk)
      (supByName[nk] = supByName[nk] || []).push(sp.id);
  }
  for (const k in supByName) {
    if (supByName[k].length > 1) {
      const sp = db.supporters.find((x) => x.id === supByName[k][0]);
      if (sp)
        issues.push({ cat: T2.k1, title: T2.k60 + sp.name + T2.k61 + supByName[k].length + T2.k62, spId: sp.id });
    }
  }
  return issues;
}
