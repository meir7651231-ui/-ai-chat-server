/** חוט · apply-meta-partial — מיזוג מסמך-meta מרוחק (הענן-מנצח; מונים רק-עולים).
 *  חוזה: apply-meta-partial.contract.md
 *  חולץ כלשונו מ-maor/src/lib/cloud-merge.ts:106-141 — ללא שכנים (עצמאי). */
export function applyMetaPartial(db, meta) {
  const next = { ...db };
  let changed = false;
  const assign = (k, v) => {
    if (v === undefined) return;
    if (JSON.stringify(db[k]) !== JSON.stringify(v)) {
      next[k] = v;
      changed = true;
    }
  };
  assign('orgName', meta.orgName);
  assign('orgSite', meta.orgSite);
  assign('orgDonate', meta.orgDonate);
  assign('orgGoal', meta.orgGoal);
  assign('budget', meta.budget);
  assign('usdRate', meta.usdRate);
  assign('audit', meta.audit);
  assign('notif', meta.notif);
  assign('reports', meta.reports);
  assign('ui', meta.ui);
  assign('attnDone', meta.attnDone);
  // מונים: לעולם לא מקטינים — מונע התנגשות מזהים/מספרי-קבלה בין מכשירים
  const bumpCounter = (k) => {
    const v = meta[k];
    if (typeof v === 'number' && Number.isFinite(v) && v > db[k]) {
      next[k] = v;
      changed = true;
    }
  };
  bumpCounter('seq');
  bumpCounter('receiptSeq');
  bumpCounter('donationSeq');
  bumpCounter('shopReceiptSeq');
  return changed ? next : db;
}
