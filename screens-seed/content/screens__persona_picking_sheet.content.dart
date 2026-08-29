// 📦 דאטה-תוכן (חולל ע"י screen-lift, הכרעה-11: מנוע-לא-נחיל) · screens__persona_picking_sheet
// מוצא: screens__persona_picking_sheet.dart — כל מחרוזת-תוכן שהייתה צרובה ב-widget, ממופתחת פר-מנגנון.

const personaPickingSheetContent = (
  t01: 'אין הזמנות בקטגוריה זו ✓',
  t02: '📄 הצג תעודת משלוח',
  t03: '🛵 ההזמנה מוכנה — ממתינה לאיסוף השליח',
  t04: 'סמן כל פריט כ"לוקט" או "חסר" כדי לסיים את ההכנה',
  t05: 'תעודת משלוח',
  tplOrderid6: '📦 ${order.id}',
  tplSttwsKOrderStageLabelor7: 'סטטוס: ${kOrderStageLabel[order.stage]}',
  tplHandledlineslengthFryty8: '$handled/${lines.length} פריטים טופלו',
  frytJsrMmty9: '⏳ פריט חסר — ממתין לבחירת הקבלן (החלפה / ביטול)',
  tyqwBwxeHqbl10: '✓ תיקון בוצע — הקבלן החליט, המשך בליקוט',
  tplFmissingCountFrytyJsr11: '⚠️ ${f.missingCount} פריטים חסרים — הקבלן עודכן',
  tplHhzmnhMfwxltLfsplitInt12: '🚚 ההזמנה מפוצלת ל-${f.splitInto} משלוחים — הכן כל קבוצה כחבילה נפרדת.',
  tplHhzmnhHwknhBg13: '🚚 ההזמנה הוכנה ב-$g חבילות',
  hfyxwlBwtlJbylh14: 'הפיצול בוטל — חבילה אחת',
  hqblEwdkHhzmnh15: '⏳ הקבלן עודכן — ההזמנה ממתינה להחלטתו (החלפה / הסרה / ביטול)',
  tplMclwjGIdxslength16: '📦 משלוח $g — ${idxs.length} פריטים',
  tplBtyawOrdersiteHaulic17: '🕒 בתיאום · 📍 ${order.site} · ${haul.ic} ${haul.name}',
  acrWqblLhknh18: '✓ אשר וקבל להכנה',
  klHfrytyTwflw19: '📦 כל הפריטים טופלו — סמן כמוכן',
  smKmwkBkl20: 'סמן כמוכן בכל זאת',
  hhzmnhMmtynhLhjltt21: '⚠️ ההזמנה ממתינה להחלטת הקבלן על פריט חסר — לא ניתן להמשיך',
  tplHhzmnhOrderidEwdknh22: 'ההזמנה ${order.id} עודכנה — מסונכרן עם השליח והמנהל ✓',
  tplOsite23: '📍 ${o.site}',
  tplOitemsFrytyFMoneyosum24: '${o.items} פריטים · ${fMoney(o.sum)}',
  tplHwkBfsplitIntoJbylwt25: '🚚 הוכן ב-${f.splitInto} חבילות',
  txt26: '🔁',
);

const contractorMissingDecisionSheetContent = (
  t06: 'פריט חסר — נדרשת החלטה',
  t07: 'ההזמנה אינה זמינה עוד',
  sgwr3: 'סגור',
  tplHzmnhOrderidOrdersite4: 'הזמנה: ${order.id} · ${order.site}',
  hhjlthHtqblhHsfq5: '✓ ההחלטה התקבלה — הספק ממשיך בליקוט (תיקון בוצע)',
  hsfqExrAt6: 'הספק עצר את הליקוט — יש לבחור לכל פריט חסר: החלפה או הסרה, ',
  awLbtlAt7: 'או לבטל את ההזמנה כולה.',
  hhjlthNcljhLsfq8: '🔁 ההחלטה נשלחה לספק — ',
  tplOrderlinesinameYwjlBm9: '"${order.lines[i].name}" יוחלף במוצר חלופי',
  tplHfrytOrderlinesinameHw10: 'הפריט "${order.lines[i].name}" הוסר — ',
  hsfqMmcyBlyqwt11: 'הספק ממשיך בליקוט',
  bytwlHhzmnh12: 'ביטול ההזמנה',
  tplHhzmnhOrderidTbwtl13: 'ההזמנה ${order.id} תבוטל כולה אצל הספק — ',
  fewlhBltyhfykh14: 'פעולה בלתי-הפיכה.',
  btlHzmnh15: 'בטל הזמנה',
  hhzmnhBwtlhHsfq16: 'ההזמנה בוטלה — הספק עודכן',
  bytwlHhzmnhKwlh17: '🚫 ביטול ההזמנה כולה — בקרוב',
  btlAtHhzmnh18: '🚫 בטל את ההזמנה כולה',
);

const decisionLineContent = (
  t08: '🔁 החלף מוצר',
  t09: 'הסר מההזמנה',
  tplKmwtQtyHsfq3: 'כמות: $qty · ⏳ הספק ממתין להחלטתך',
);

const pickLineContent = (
  t10: 'מוצר חלופי',
  t11: 'חסר',
  lwqt3: '✓ לוקט',
  jsr4: '✕ חסר',
  mmtyLbjyrtHqbl5: '⏳ ממתין לבחירת הקבלן',
  bwtlExyHqbl6: '✕ בוטל ע״י הקבלן',
  hwjlExyHqbl7: '🔁 הוחלף ע״י הקבלן',
  tplKmwtLlyqwtLineqty8: 'כמות לליקוט: ${line.qty}',
);

const splitControlContent = (
  t12: '🚚 פיצול משלוחים',
  jbylhAjt2: 'חבילה אחת',
  tplGJbylwt3: '$g חבילות',
);

