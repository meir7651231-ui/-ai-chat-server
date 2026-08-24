# חוזה · חוט filter-redemptions
**תפקיד:** סינון מימושי-שיוך של חבילת-חנות לפי טווח-תאריכים כוללני; מימוש
מבוטל (‏voidedAt) מוחרג אלא אם ‏includeVoided=true (ברירת-השקיפות של המסך).
**שקע (חוק-1):** ‏dateInRange(iso, fromIso, toIso) ⇒ בוליאני — טווח כוללני,
קצה ריק=פתוח (החוט date-in-range המשותף).
**קלט:** ‏a (שיוך עם ‏redemptions: מערך ‏{date, voidedAt?}) · ‏fromIso · ‏toIso
(‏ISO או '') · ‏includeVoided (בוליאני) · ‏dateInRange.
**פלט:** מערך המימושים העוברים, בסדר-המקור.
**דוגמאות מחייבות** (מימושים: ‏r1=2026-01-01 · ‏r2=2026-02-15 מבוטל
(voidedAt='2026-02-16') · ‏r3=2026-03-01):
1. טווח פתוח ('', '') + ‏includeVoided=true ⇒ ‏[r1, r2, r3].
2. טווח פתוח + ‏includeVoided=false ⇒ ‏[r1, r3] (המבוטל בחוץ).
3. ‏from='2026-02-01', ‏to='2026-03-01', ‏includeVoided=true ⇒ ‏[r2, r3] —
   הקצה העליון כוללני (‏r3 בדיוק על ‏to נכנס).
4. ‏from='2026-01-01', ‏to='2026-01-01', ‏includeVoided=false ⇒ ‏[r1] —
   טווח-של-יום-אחד כוללני משני הקצוות.
5. ‏redemptions=[] ⇒ ‏[].
**מוצא:** maor/src/components/shop/lib.ts:565-575 (‏filterRedemptions — UX סינון
גל B½; ביטול-מימוש SHOP3). השכן ‏dateInRange הפך לשקע (חוק-1).
