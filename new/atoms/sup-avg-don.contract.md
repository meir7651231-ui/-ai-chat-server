# חוזה · חוט sup-avg-don
**תפקיד:** ממוצע-לתרומה על-פני רשימת-תורמים — סה"כ השווי בש"ח (‏Σ‏supTotalIls‏,
דולר לפי השער) חלקי מספר-התרומות הכולל (‏Σ‏supCount‏), מעוגל ‏Math.round‏.
אין אף תרומה (המונה 0) ⇒ ‏null (לא חלוקה-באפס). מקור-הנוסחה: legacy supAvgDon:3024.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏supTotalIls(sp, rate)⇒number — שווי-תורם כולל בש"ח (‎ils + usd×rate‎, כולל היסטוריה).
- ‏supCount(sp)⇒number — מספר-תרומות של תורם (קיים גם כחוט sup-count; כאן שקע —
  אטום לא מייבא אטום, הקופסה תחווט).
**קלט:** ‏supporters: Supporter[]‏ · ‏rate (ברירת-מחדל 3.7) · שני השקעים.
**פלט:** מספר שלם מעוגל, או ‏null.
**דוגמאות מחייבות (שקעי-הבדיקה: ‏supTotalIls=(sp,r)⇒ils+usd×r‏ · ‏supCount=(sp)⇒count):**
1. ‏[{ils:400,count:2},{ils:200,count:1}] ⇒ ‏600/3 = ‏200.
2. ‏[{ils:1000,count:3}] ⇒ ‏round(333.33…) = ‏333.
3. ‏[{ils:500,count:3}] ⇒ ‏round(166.66…) = ‏167 (עיגול-מעלה).
4. ‏[{ils:0,count:0},{ils:0,count:0}] ⇒ ‏null (אפס תרומות — לא 0 ולא NaN).
5. השער זורם לשקע: ‏[{ils:100,usd:100,count:1}] עם ‏rate=4 ⇒ ‏100+400 = ‏500.
6. ‏rate לא הועבר ⇒ ‏3.7: ‏[{ils:0,usd:10,count:1}] ⇒ ‏round(37) = ‏37.
**מוצא:** maor/src/components/supporters/lib.ts:191-197 (‏supAvgDon) — חולץ כלשונו;
השכנים supTotalIls/supCount הפכו לשקעים (חוק-1).
