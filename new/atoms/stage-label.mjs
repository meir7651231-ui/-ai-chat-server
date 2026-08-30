/** חוט · stage-label — תווית שלב-טיפול מותאמת-ארגון (מודול העין).
 *  חוזה: stage-label.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:30-32 (תורגם TS→JS);
 *  השכן termOf הוזרק כשקע (חוק-1 — אפס import פנימי);
 *  טבלת-הנפילה STAGE_FALLBACK (אותו קובץ, שורות 21-27) הוטבעה כקבוע-פרטי. */

/** ברירות מחדל ניטרליות לתוויות השלבים (ניתנות לשינוי-שם באשף). */

export function stageLabel(cfg, stage, termOf, T) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  const STAGE_FALLBACK = {
      new: T.k1,
      lead: T.k2,
      eyes: T.k3,
      answer: T.k4,
      done: T.k5,
  };

    return termOf(cfg, T.k6 + stage, STAGE_FALLBACK[stage]);
}
