/** חוט · stage-label — תווית שלב-טיפול מותאמת-ארגון (מודול העין).
 *  חוזה: stage-label.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:30-32 (תורגם TS→JS);
 *  השכן termOf הוזרק כשקע (חוק-1 — אפס import פנימי);
 *  טבלת-הנפילה STAGE_FALLBACK (אותו קובץ, שורות 21-27) הוטבעה כקבוע-פרטי. */

/** ברירות מחדל ניטרליות לתוויות השלבים (ניתנות לשינוי-שם באשף). */
const STAGE_FALLBACK = {
    new: 'חדש',
    lead: 'בהכנה',
    eyes: 'רישום',
    answer: 'מסירה',
    done: 'הושלם',
};

export function stageLabel(cfg, stage, termOf) {
    return termOf(cfg, 'ayin.stage.' + stage, STAGE_FALLBACK[stage]);
}
