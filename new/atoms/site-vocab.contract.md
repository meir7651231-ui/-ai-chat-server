# חוזה · חוט site-vocab
**תפקיד:** תוויות-הפעולה של האתר-הציבורי לפי סוג-הארגון: מסחרי (בלי §46)
⇒ שפת-פנייה ("צרו קשר"); עמותתי ⇒ שפת-תרומה ("לתרומה", עם ♡ בצ׳יפי
navCta/give). אנגלית רק כש-lang==='en'; כל שפה אחרת (he/yi/לא-מוכר) ⇒ עברית.
טהור, אפס שקעים.
**קלט:** ‏commercial — boolean · ‏lang — קוד-שפה.
**פלט:** אובייקט ‏{heroCta, navCta, give, giveLabel, commercial}.
**דוגמאות מחייבות:**
1. ‏(false,'he') ⇒ {heroCta:'לתרומה עכשיו', navCta:'לתרומה ♡',
   give:'לתרומה ♡', giveLabel:'התרומה שלך', commercial:false}.
2. ‏(false,'en') ⇒ {heroCta:'Donate now', navCta:'Donate ♡', give:'Donate ♡',
   giveLabel:'Your gift', commercial:false}.
3. ‏(true,'he') ⇒ {heroCta:'צרו קשר', navCta:'צרו קשר', give:'צרו קשר',
   giveLabel:'הפנייה שלך', commercial:true} — במסחרי אין ♡.
4. ‏(true,'en') ⇒ {heroCta:'Get in touch', navCta:'Contact', give:'Contact us',
   giveLabel:'Your request', commercial:true}.
5. ‏(false,'yi') ⇒ זהה-ביט ל-(false,'he') — יידיש נופלת לעברית (רק en שונה).
**מוצא:** maor/src/lib/publicSite.ts:153-176 (‏siteVocab, "תוויות-פעולה
תלויות-סוג-ארגון: מסחרי (בלי §46) ⇒ 'צרו קשר'; עמותתי ⇒ 'לתרומה'").
