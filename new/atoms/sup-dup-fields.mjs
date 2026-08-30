/** אטום-קבוע · sup-dup-fields — קודם אוטומטית (צילום-ערך). חוזה: sup-dup-fields.contract.md */
export const makeSUP_DUP_FIELDS = (T) => ([
    { key: T.k1, label: T.k2, get: (s) => s.name || '' },
    { key: T.k3, label: T.k4, get: (s) => s.phone || '' },
    { key: T.k5, label: T.k6, get: (s) => s.email || '' },
    { key: T.k7, label: T.k8, get: (s) => s.idNum || '' },
    { key: T.k9, label: T.k10, get: (s) => s.city || '' },
    { key: T.k11, label: T.k12, get: (s) => s.address || '' },
    { key: T.k13, label: T.k14, get: (s) => s.cat || '' },
    { key: T.k15, label: T.k16, get: (s) => s.forWho || '' },
    { key: T.k17, label: T.k18, get: (s) => s.notes || '' },
]);
/** ערך-שדה נבחר: edit גובר; אחרת pick; אחרת הרשומה הראשונה עם ערך. */
