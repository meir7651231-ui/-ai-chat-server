/** חוט · ayin-daily-rows — שורות הדוח-היומי של מעקב-הטיפול.
 *  חוזה: ayin-daily-rows.contract.md · שקעים: unitLabel, itemLabel, emptyAyin, eyesTotal, stageLabel
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:249-295 (קריאות-השכן שוקעו). */
export function ayinDailyRows(cfg, supporters, todayIso, unitLabel, itemLabel, emptyAyin, eyesTotal, stageLabel, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  function fmtD(iso) {
      if (!iso)
          return '';
      const [y, m, d] = iso.split('-');
      return `${d}/${m}/${y}`;
  }

    const unit = unitLabel(cfg);
    const item = itemLabel(cfg);
    const rows = [
        [T.k1, T.k2, `${unit}${T.k6}`, T.k3, item, T.k4, T.k5],
    ];
    const touched = supporters.filter((sp) => sp.ayin && (sp.ayin.lastTouch === todayIso || sp.ayin.log?.some((l) => l.date === todayIso)));
    for (const sp of touched) {
        // 🐛 נחיל-עמוק (13.8): ayin חלקי (מלגאסי/ענן, חסר log/names/answers) הפיל את
        // הדוח ואת מסך-התורמים. מיזוג עם emptyAyin מבטיח את כל המערכים.
        const a = { ...emptyAyin(), ...sp.ayin };
        const logToday = a.log.filter((l) => l.date === todayIso);
        const eyesToday = logToday.length
            ? logToday.reduce((t, l) => t + (+l.eyes || 0), 0)
            : eyesTotal(a) || '';
        const namesLine = a.names
            .map((n) => n.name + (n.eyes !== '' && n.eyes != null ? ' ·' + n.eyes : '') + (n.done ? ' ✓' : ''))
            .join(' · ');
        const noteLine = a.answers.map((x) => x.note).join(' | ') || a.note || '';
        rows.push([
            sp.name,
            sp.phone || '',
            eyesToday,
            stageLabel(cfg, a.stage),
            namesLine,
            a.nextTalk ? fmtD(a.nextTalk) : '',
            noteLine,
        ]);
    }
    return rows;
}
/** תצוגת תאריך DD/MM/YYYY מ-ISO (מקומי לדוח). */
