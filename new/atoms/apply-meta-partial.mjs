/** חוט · apply-meta-partial — מיזוג מסמך-meta מרוחק (הענן-מנצח; מונים רק-עולים).
 *  חוזה: apply-meta-partial.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud-merge.ts:106-141 — ללא שכנים (עצמאי). */
export function applyMetaPartial(db, meta, T) {
  const next = { ...db };
  let changed = false;
  const assign = (k, v) => {
    if (v === undefined) return;
    if (JSON.stringify(db[k]) !== JSON.stringify(v)) {
      next[k] = v;
      changed = true;
    }
  };
  assign(T.k1, meta.orgName);
  assign(T.k2, meta.orgSite);
  assign(T.k3, meta.orgDonate);
  assign(T.k4, meta.orgGoal);
  assign(T.k5, meta.budget);
  assign(T.k6, meta.usdRate);
  assign(T.k7, meta.audit);
  assign(T.k8, meta.notif);
  assign(T.k9, meta.reports);
  assign('ui', meta.ui);
  assign(T.k10, meta.attnDone);
  // מונים: לעולם לא מקטינים — מונע התנגשות מזהים/מספרי-קבלה בין מכשירים
  const bumpCounter = (k) => {
    const v = meta[k];
    if (typeof v === T.k11 && Number.isFinite(v) && v > db[k]) {
      next[k] = v;
      changed = true;
    }
  };
  bumpCounter(T.k12);
  bumpCounter(T.k13);
  bumpCounter(T.k14);
  bumpCounter(T.k15);
  return changed ? next : db;
}
