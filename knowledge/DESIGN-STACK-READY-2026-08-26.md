# 🎨 מוכן-לפעולה · stack העיצוב של האימפריה (26.8.2026)

**הכרעת-בעלים:** "תוציא את כל מה שקשור אלינו ותכין מוכן לפעולה." זה המסמך.
מצב נוכחי: **0 פלאגיני-עיצוב מותקנים** (רק `graphics-design-animation` מובנה +
`artifact-design`). ההתקנה = פקודת-בעלים. ברגע שמותקן — הביצוע כאן מוכן.

## שלב 0 · התקנה (פקודות-בעלים — הריצו ב-Claude Code)
```
/plugin install frontend-design@claude-plugins-official   # ה-UI הרשמי של Anthropic
```
> שאר הסקילים (threejs/gsap/lottie/algorithmic-art/canvas-design/design-tokens/
> brand-guidelines/design-review/spline/react-three-fiber/app-store-screenshots)
> מותקנים כתיקיות-סקיל ב-`~/.claude/skills/` או דרך ה-registry הרלוונטי. **סדר-עדיפות
> ההתקנה:** frontend-design → design-tokens → threejs-skills → brand-guidelines →
> gsap-skills+lottie → app-store-screenshots. השאר לפי-צורך.

## שלב 1 · מיפוי משטח→stack→פעולה (הכול קיים כבר בקוד — שדרוג, לא מאפס)

### 🌌 מסך-ההרשמה של מאור (LoginScreen · SignupHero)
- **קיים:** כדור-מוח Three.js (`src/lib/three-scene.ts`, lazy chunk), נפילה ל-`public/orbit/orbit-hero.png`, כרטיס-זכוכית, אשף-5-שלבים.
- **stack:** `threejs-skills` + `react-three-fiber` + `frontend-design`.
- **פעולה:** לשדרג את ה-Hero ל-production-grade (חומרים/תאורה/מצלמה), micro-interactions בכרטיס, לשמור lazy-load + נפילה סטטית + גידור `signup.hero3d`. אפס-רגרסיה ללקוח-החי.

### ✨ גלקסיית-התורמים (constellation · canvas חי)
- **קיים:** `src/components/supporters/constellation.ts` (מנוע-פריסה טהור) + canvas מגודר opt-in.
- **stack:** `algorithmic-art` (p5) + `canvas-design`.
- **פעולה:** לשדרג רינדור (זוהר/חלקיקים/אינטראקציה) מעל מנוע-הפריסה הקיים; לשמור דטרמיניזם (המנוע כבר בלי Date.now).

### 🎨 זהות פר-ורטיקל (13 חבילות · theme/accent/emoji/motion)
- **קיים:** `VerticalPack.theme/accent/icon/motion`, `applyVerticalPack`, `config.emoji/motion`, favicon דינמי, `MOTION_KEYS`.
- **stack:** `design-tokens` + `brand-guidelines`.
- **פעולה:** להפוך את הטוקנים הקיימים למערכת-אמת מלאה (סקאלת-טיפוגרפיה, רהיטם, מרווחים), ערכת-מותג פר-ורטיקל מסחרי; לשמור `or-rishon`=קלאסי ביט-זהה-לחסד ואת `accentCustom`.

### 🖥️ ה-UI של המחולל (עתידי) + נחיתות (מאור/בנייה-חכמה)
- **stack:** `frontend-design` + `make-interfaces-feel-better` + `design-review`.
- **פעולה:** נחיתת-שיווק לבנייה-חכמה; מסך-המחולל (משפט-בעברית ⇒ פיצ'ר) — כשהקטלוג מוכן.

### 🎬 מושן + וידאו
- **stack:** `gsap-skills` + `lottie` (מיקרו-אינטראקציות) · `remotion` (וידאו — כבר יש `orbit-tour.webm`).
- **פעולה:** תנועת-מעברים בשלושת-השלדים (מכבד `prefers-reduced-motion` — כבר מחווט ב-`data-motion`).

### 📱 השקת-חנות (בנייה-חכמה · Flutter · TWA)
- **stack:** `app-store-screenshots`.
- **פעולה:** ויזואלי-שיווק ל-Play Store כשה-Flutter מיוצב (ממתין לחשבון-Console של הבעלים).

## שלב 2 · חוקי-ברזל לעבודת-העיצוב (כדי לא לשבור את החי)
1. **אפס-רגרסיה ללקוח-החי** (חסד/`or-rishon`) — כל שדרוג מאחורי דגל/ורטיקל.
2. **lazy + נפילה** — three/כבד תמיד chunk נפרד + נפילה סטטית + גידור-דגל (מתג-חירום).
3. **a11y** — `prefers-reduced-motion`, ניגודיות, focus-trap (כבר בקוד — לשמר).
4. **`artifact-design`** לפני כל דף-artifact; **design-review** אחרי כל משטח.
5. **מדידה** — כל chunk-כבד מחוץ-לבנדל-הראשי (כמו three היום).

## שלב 3 · סדר-ביצוע מומלץ (כשמחליטים לצאת לעיצוב)
1. install frontend-design + design-tokens.
2. משטח-פיילוט אחד (המלצה: **מסך-ההרשמה** — הכי-מרשים, הכי-מבודד).
3. design-review → תיקון → נעילה מאחורי דגל.
4. משטח-משטח לפי הבוער.

---
**⚠️ תלוי-החלטה:** באיזה משטח מתחילים? (הרשמה / גלקסיה / נחיתת-בנייה-חכמה / מחולל).
**⚠️ תלוי-בעלים:** התקנת הפלאגינים (פקודות שלב-0).
**סטטוס העבודה הראשית:** המרת-מאור גמורה; פירוק-מנועים-חדשים + בנייה-חכמה ממתינים לחידוש 05:00.
