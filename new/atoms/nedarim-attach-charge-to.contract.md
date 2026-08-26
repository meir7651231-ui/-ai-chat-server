# חוזה · nedarim-attach-charge-to
**תפקיד:** חיבור-ידני לכרטיס: hist+=chargeToHist (דדופ txn/ref); histDedupKey inline.
**מוצא:** `maor-system/src/lib/nedarimSync.ts`. חוק-4: verbatim (keysOf/curOf/histDedupKey inline).
**חתימה:** `attachChargeTo(supporters, supId, charge, {chargeDedupKey,chargeToHist,withNedarimHok}) => {supporters,added}`
**שקעים:** chargeDedupKey,chargeToHist (אחים) · withNedarimHok (Genesis)
**Golden:** `nedarim-attach-charge-to.test.mjs` — פיקסטורה + שקעים-inline נאמנים (norm*/nameSortKey/withNedarimHok); Golden מריצת-חיווט-אמיתי.
