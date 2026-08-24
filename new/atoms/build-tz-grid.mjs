/** חוט · build-tz-grid — גריד-חודשי ללוח-הצדקה (wrapper דק). חוזה: build-tz-grid.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:302-307; השכן buildMonthGrid
 *  הוזרק כשקע (חוק-1). ה-re-export של DAY_NAMES = חיווט-קופסה, הושמט מהאטום. */
export function buildTzGrid(tzEvents, anchorIso, hebMode, buildMonthGrid) {
  return buildMonthGrid(tzEvents, anchorIso, hebMode);
}
