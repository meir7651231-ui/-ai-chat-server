/** 🪨 טיוטת-חוט (דרגת-מחצבה) · applyMetaPartial — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/cloud-merge.ts:106-141 (36 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): applyMetaPartial, assign, isFinite, bumpCounter
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function applyMetaPartial(db, meta) {
    const next = { ...db };
    let changed = false;
    const assign = (k, v) => {
        if (v === undefined)
            return;
        if (JSON.stringify(db[k]) !== JSON.stringify(v)) {
            next[k] = v;
            changed = true;
        }
    };
    assign('orgName', meta.orgName);
    assign('orgSite', meta.orgSite);
    assign('orgDonate', meta.orgDonate);
    assign('orgGoal', meta.orgGoal);
    assign('budget', meta.budget); // ORGADMIN/SHOP9 — סנכרון סקלר ארגוני (ציד-באגים 3.8)
    assign('usdRate', meta.usdRate);
    assign('audit', meta.audit); // לוג-פעולות (#10) — הענן-מנצח כמו שאר ה-meta
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
