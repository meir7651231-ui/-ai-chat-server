# חוזה · אטום-קבוע template-defs
**תפקיד:** ערך-מערכת קבוע — הגדרות תבניות-ההודעה (וואטסאפ): מפתח · תווית ·
משתנים-זמינים · נוסח-ברירת-מחדל. הנוסחים חייבים להישאר זהים-ביט לנוסחים
ההיסטוריים (ratchet במקור). **התחייבות:** הערך זהה-ביט לצילום שבבדיקה.
**ערכים:** TEMPLATE_DEFS — 5 תבניות: ‏wa.delivery · wa.payment · wa.birthday ·
wa.dialer · wa.paylink.
**דוגמאות מחייבות:**
1. ‏TEMPLATE_DEFS.length ⇒ 5.
2. ‏TEMPLATE_DEFS[0].key ⇒ 'wa.delivery' · ‏def ⇒ 'שלום {name}, משלוח מ{org} בדרך אליכם היום 🚚'.
3. ‏TEMPLATE_DEFS[1].vars ⇒ ['org','what','amount'].
4. ‏TEMPLATE_DEFS[4] ⇒ ‏{key:'wa.paylink', label:'💳 שליחת קישור-תשלום',
   vars:['name','org','link'], def:'שלום {name}, תודה על השיחה! לתרומה מקוונת ל{org}: {link} 🙏'}.
**מוצא:** maor/src/lib/templates.ts:19-53 (‏TEMPLATE_DEFS — תבניות-הודעה
עריכות, ROADMAP-100 ‏#12; חייגן/קישור-תשלום 20.8).
