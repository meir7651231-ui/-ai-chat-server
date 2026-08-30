/** חוט · dup-fields — 18 שדות-מיזוג כפולי-משפחות (key·label·get). חוזה: dup-fields.contract.md
 *  חולץ כלשונו מ-maor/src/lib/dedup.ts:189-208 (תוויות verbatim מהלגאסי 1643-1653). */
export const makeDUP_FIELDS = (T) => ([
  { key: T.k1, label: T.k2, get: (f) => f.name || '' },
  { key: T.k3, label: T.k4, get: (f) => f.mother || '' },
  { key: T.k5, label: T.k6, get: (f) => f.father || '' },
  { key: T.k7, label: T.k8, get: (f) => f.phone || '' },
  { key: T.k9, label: T.k10, get: (f) => f.phone2 || '' },
  { key: T.k11, label: T.k12, get: (f) => f.email || '' },
  { key: T.k13, label: T.k14, get: (f) => f.city || '' },
  { key: T.k15, label: T.k16, get: (f) => f.address || '' },
  { key: T.k17, label: T.k18, get: (f) => f.motherId || '' },
  { key: T.k19, label: T.k20, get: (f) => f.fatherId || '' },
  { key: T.k21, label: T.k22, get: (f) => f.community || '' },
  { key: T.k23, label: T.k24, get: (f) => f.language || '' },
  { key: T.k25, label: T.k26, get: (f) => f.maritalStatus || '' },
  { key: T.k27, label: T.k28, get: (f) => f.status || '' },
  { key: T.k29, label: T.k30, get: (f) => (f.kidsHome == null ? '' : String(f.kidsHome)) },
  { key: T.k31, label: T.k32, get: (f) => (f.kidsMarried == null ? '' : String(f.kidsMarried)) },
  { key: T.k33, label: T.k34, get: (f) => f.createdAt || '' },
  { key: T.k35, label: T.k36, get: (f) => f.notes || '' },
]);
