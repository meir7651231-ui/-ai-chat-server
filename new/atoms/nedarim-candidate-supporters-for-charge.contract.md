# חוזה · nedarim-candidate-supporters-for-charge
**תפקיד:** מועמדי-שיוך לפי מפתח-חזק (5..2) או שם חסין-סדר (≥2 מילים,score 1); ממוין.
**מוצא:** `maor-system/src/lib/nedarimSync.ts`. חוק-4: verbatim (keysOf/curOf/histDedupKey inline).
**חתימה:** `candidateSupportersForCharge(charge, supporters, limit=8, {normId,normPhone,normSearch,nameSortKey}) => Supporter[]`
**שקעים:** normId,normPhone,normSearch,nameSortKey (Genesis, מבונים)
**Golden:** `nedarim-candidate-supporters-for-charge.test.mjs` — פיקסטורה + שקעים-inline נאמנים (norm*/nameSortKey/withNedarimHok); Golden מריצת-חיווט-אמיתי.
