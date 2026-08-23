/** 🪨 טיוטת-חוט (דרגת-מחצבה) · ayinDailyRows — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ayin.ts:249-295 (47 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): ayinDailyRows, unitLabel, itemLabel, emptyAyin, eyesTotal, stageLabel, fmtD
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function ayinDailyRows(cfg, supporters, todayIso) {
    const unit = unitLabel(cfg);
    const item = itemLabel(cfg);
    const rows = [
        ['שם', 'טלפון', `${unit} היום`, 'שלב', item, 'מתי לדבר שוב', 'הערה'],
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
function fmtD(iso) {
    if (!iso)
        return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}
/**
 * דוח מלא של כל השמות (למשל שמות-לתפילה) בכרטיסי מעקב-הטיפול — שורה פר-שם,
 * להורדת-מנהל בסגנון דוחות-התרומות (בקשת-בעלים 19.8 פריט א'). כולל תורם/ת,
 * טלפון, שם, כמות (עיניים), הערה, סטטוס-טיפול ושלב. מכבד את הרשאת-הייעוד
 * (המסננים בקריאה). ayin חלקי (לגאסי/ענן) ממוזג עם emptyAyin (הגנת-קריסה).
 */
