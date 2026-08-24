/** אטום-קבוע · ayin-stages — קודם אוטומטית (צילום-ערך). חוזה: ayin-stages.contract.md */
export const AYIN_STAGES = ['new', 'lead', 'eyes', 'answer', 'done'];
/** ברירות מחדל ניטרליות לתוויות השלבים (ניתנות לשינוי-שם באשף). */
const STAGE_FALLBACK = {
    new: 'חדש',
    lead: 'בהכנה',
    eyes: 'רישום',
    answer: 'מסירה',
    done: 'הושלם',
};
/** תווית שלב מותאמת-ארגון. */
