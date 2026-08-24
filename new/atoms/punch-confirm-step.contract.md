# חוזה · חוט punch-confirm-step
**תפקיד:** צעד אחד במכונת-המצבים של **אישור-הניקוב-הכפול** (P1.3, דגל
courses.punch.confirm; ‏ratchet מלגאסי legacy-main-script.js:330-342) — טהור.
לחיצה ראשונה "מזיינת" את השיבוץ; לחיצה שנייה על **אותו** שיבוץ בתוך חלון של
**3000ms** (PUNCH_CONFIRM_MS) מבצעת. שיבוץ אחר / חלון פג ⇒ זריון-מחדש.
דגל כבוי ⇒ ביצוע מיידי. ‏fire=true ⇒ לנקב עכשיו והזריון מתנקה (next=null);
‏fire=false ⇒ לעדכן את הזריון ל-next.
**קלט:** ‏confirmOn (boolean) · ‏armed ({id, armedAt}|null — הזריון הנוכחי) ·
‏enrollmentId (string) · ‏now (number, ms — מוזרק, אין Date.now באטום).
**פלט:** ‏{ fire: boolean, next: {id, armedAt}|null }.
**דוגמאות מחייבות:**
1. דגל כבוי: ‏(false, {id:'e1',armedAt:0}, 'e1', 999999) ⇒ ‏{fire:true, next:null}
   — ביצוע מיידי, גם כשקיים זריון ישן.
2. לחיצה ראשונה: ‏(true, null, 'e1', 10000) ⇒ ‏{fire:false, next:{id:'e1',armedAt:10000}}.
3. לחיצה שנייה בתוך החלון (קצה-כולל): ‏(true, {id:'e1',armedAt:10000}, 'e1', 13000)
   ⇒ ‏{fire:true, next:null} — בדיוק 3000ms עדיין בפנים (≤).
4. החלון פג: ‏(true, {id:'e1',armedAt:10000}, 'e1', 13001) ⇒
   ‏{fire:false, next:{id:'e1',armedAt:13001}} — זריון-מחדש מהרגע הנוכחי.
5. שיבוץ אחר: ‏(true, {id:'e1',armedAt:10000}, 'e2', 10500) ⇒
   ‏{fire:false, next:{id:'e2',armedAt:10500}} — הזריון עובר לשיבוץ החדש.
**מוצא:** maor/src/components/courses/lib.ts:572-591 (‏punchConfirmStep +
‏PUNCH_CONFIRM_MS=3000 — הקבוע מיוצא גם מהאטום). חולץ כלשונו; אפס שקעים.
