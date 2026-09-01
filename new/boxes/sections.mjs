/** קופסת-חיבורים · sections — הורכבה במנוע-הרכבת-הקופסאות (הכרעה 19).
 *  מוצא: src/components/builder/sections.ts · קובץ-עצמאי (type-imports בלבד) ⇒ TS→JS ביט-התנהגותי. */
import { S } from '../atoms/sections-strings.mjs';
export const WIZARD_SECTIONS = [
    {
        id: S.k0,
        title: S.k1,
        emoji: '👨‍👩‍👧‍👦',
        module: S.k0,
        // ביקורת 6.8: הצורות הנגזרות (סמיכות/רבים) נוספו — היו עריכות רק ב-#platform
        termKeys: [S.k2, S.k3, S.k4, S.k5, S.k6, S.k7],
    },
    {
        id: S.k8,
        title: S.k9,
        emoji: '🎨',
        module: S.k8,
        termKeys: [S.k10, S.k11, S.k12, S.k13, S.k14, S.k15, S.k16],
    },
    { id: S.k17, title: S.k18, emoji: '📅', module: S.k17, termKeys: [S.k19] },
    { id: S.k20, title: S.k21, emoji: '📖', module: S.k20, termKeys: [S.k22, S.k23, S.k24] },
    {
        id: S.k25,
        title: S.k26,
        emoji: '💛',
        module: S.k25,
        termKeys: [
            S.k27,
            S.k28,
            S.k29,
            S.k30,
            // מעקב טיפול רב-שלבי — כל התוויות ניתנות לשינוי-שם כאן
            S.k31,
            S.k32,
            S.k33,
            S.k34,
            S.k35,
            S.k36,
            S.k37,
            S.k38,
        ],
    },
    {
        id: S.k39,
        title: S.k40,
        emoji: '🪙',
        module: S.k39,
        termKeys: [S.k41, S.k42, S.k43, S.k44],
    },
    {
        id: S.k45,
        title: S.k46,
        emoji: '🛍',
        module: S.k45,
        termKeys: [S.k47, S.k48, S.k49, S.k50, S.k51, S.k52],
    },
    { id: S.k53, title: S.k54, emoji: '🚚', module: S.k53, termKeys: [S.k55, S.k56, S.k57] },
    { id: S.k58, title: S.k59, emoji: '📊', module: S.k58, termKeys: [S.k60] },
    // הגאדג'טים (טיימר/קופה/מפת-טיפול) שייכים למעטפת-הבית — המונחים שלהם כאן
    { id: S.k61, title: S.k62, emoji: '🏠', termKeys: [S.k63, S.k64, S.k65] },
    { id: S.k66, title: S.k67, emoji: '⚙️', termKeys: [] },
    { id: S.k68, title: S.k69, emoji: '🧱', termKeys: [] },
    { id: S.k70, title: S.k71, emoji: '🧭', termKeys: [] },
    { id: S.k72, title: S.k73, emoji: '🪐', termKeys: [] },
];
/** המודול-אב של קבוצת פיצ'רים, או null לקבוצות שאינן ניתנות לכיבוי. */
export function featureModuleKey(m) {
    return m === S.k61 || m === S.k66 || m === S.k68 || m === S.k70 || m === S.k72 ? null : m;
}
/** האם פיצ'ר פעיל בפועל — גם הדגל שלו וגם המודול-האב חייבים להיות דלוקים. */
export function featureEffectiveOn(cfg, f) {
    const mk = featureModuleKey(f.module);
    if (mk && cfg.modules[mk] === false)
        return false;
    // דגל-opt-in (20.8): הקוד דורש true מפורש — חסר = כבוי. בלי זה האשף הציג
    // "דלוק" על מסך שבפועל כבוי (קוקפיט/מודיעין/גלקסיה/ריברנד) — באג-תצוגה אמיתי.
    if (f.optIn)
        return cfg.features?.[f.key] === true;
    return cfg.features?.[f.key] !== false;
}
