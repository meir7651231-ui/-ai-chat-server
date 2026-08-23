/** 🪨 טיוטת-חוט (דרגת-מחצבה) · applyVerticalPack — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/verticalPacks.ts:467-495 (29 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): applyVerticalPack
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function applyVerticalPack(config, packId) {
    const pack = VERTICAL_PACKS.find((p) => p.id === packId);
    if (!pack)
        return config;
    // terms/modules/features מוחלפים בערכי-החבילה (נקודת-פתיחה); שאר הקונפיג נשמר.
    // features חסר בחבילה = {} = הכול דלוק (ברירת-המחדל של מאור, לוורטיקלים העמותתיים).
    const next = { ...config, terms: { ...pack.terms }, modules: { ...pack.modules }, features: { ...pack.features } };
    // ערכת-נושא: מוחלפת רק כשהחבילה מגדירה (עמותתיות בלי theme ⇒ שמירת הערכה).
    if (pack.theme)
        next.theme = pack.theme;
    // אימוג'י-אייקון: מוגדר בחבילה ⇒ נכתב; חסר ⇒ מוסר (נפילה לאות-ראשונה, כמו הלקוח-החי).
    if (pack.icon)
        next.emoji = pack.icon;
    else
        delete next.emoji;
    // תנועה: כנ"ל — מוגדר ⇒ נכתב; חסר ⇒ מוסר (ברירת-המחדל).
    if (pack.motion)
        next.motion = pack.motion;
    else
        delete next.motion;
    // צבע-הדגשה: צבע-ידני (accentCustom) שורד בכל מקרה; אחרת ⇐ צבע-החבילה, ואם אין —
    // מוסר (צבע-הערכה). את הדגל accentCustom משמרים רק כשהצבע-הידני שרד.
    if (config.accentCustom) {
        next.accent = config.accent;
        next.accentCustom = true;
    }
    else if (pack.accent) {
        next.accent = pack.accent;
        delete next.accentCustom;
    }
    else {
        delete next.accent;
        delete next.accentCustom;
    }
    return next;
}
