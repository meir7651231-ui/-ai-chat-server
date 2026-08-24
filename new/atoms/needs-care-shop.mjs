/** חוט · needs-care-shop — רשימת-הטיפול של מודול-החנות (מה-מגיע/מלאי/תפוגה).
 *  חוזה: needs-care-shop.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:249-374; כל השכנים
 *  (upcomingHolidays · itemRemaining · componentRemaining · beneficiaryLabel ·
 *  itemOf · holidayAllowed · assignmentRedeemed · couponExpiry · featureOn ·
 *  expiringIntakes · הקבוע SHOP_HOLIDAY_DUE_DAYS) הוזרקו כשקעים (חוק-1). */
export function needsCare(db, todayIso, config, sockets) {
  const {
    upcomingHolidays, itemRemaining, componentRemaining, beneficiaryLabel,
    itemOf, holidayAllowed, assignmentRedeemed, couponExpiry, featureOn,
    expiringIntakes, shopHolidayDueDays,
  } = sockets;
  const holidays = upcomingHolidays(todayIso, shopHolidayDueDays);
  const due = [];
  const meetings = [];
  const coupons = [];
  const expired = [];
  const stock = [];
  // מלאי משותף (הכרעה 18): התרעת אזל פר-פריט — הנותר נספר על-פני כל החבילות
  for (const item of db.shopItems) {
    if (!item.active)
      continue;
    const rem = itemRemaining(db, item.id);
    if (rem === 0) {
      stock.push({
        kind: 'stockOut',
        assignmentId: '',
        componentId: item.id,
        label: item.name + ' — המלאי אזל',
        hint: 'לחדש מלאי או לעדכן את הפריט',
      });
    }
    else if (item.minStock != null && rem !== null && rem < item.minStock) {
      // מלאי מינימום (SHOP6 חנות 25): מתחת לסף — "להצטייד" לפני שאוזל
      stock.push({
        kind: 'restock',
        assignmentId: '',
        componentId: item.id,
        label: item.name + ' — המלאי נמוך',
        hint: 'להצטייד: נותרו ' + rem + ' מתחת ל-' + item.minStock,
      });
    }
    // רשימת המתנה (SHOP6 חנות 27): ממתינים + מלאי חזר (>0 או בלי-מעקב) —
    // הגיע הזמן לחלק; במלאי 0 אין התרעה (עדיין אין מה לתת)
    const waiting = item.waits ?? [];
    if (waiting.length > 0 && rem !== 0) {
      stock.push({
        kind: 'waitingRestocked',
        assignmentId: '',
        componentId: item.id,
        label: waiting.length + ' ממתינים ל' + item.name,
        hint: 'המלאי חזר — אפשר לחלק לרשימת ההמתנה',
      });
    }
  }
  // תאימות לנתונים טרום-מיגרציה: רכיב בלי itemId עם מלאי משלו
  for (const p of db.shopProducts) {
    if (!p.active)
      continue;
    for (const comp of p.components) {
      if (comp.itemId)
        continue;
      const rem = componentRemaining(comp.id, p.id, db.shopAssignments, comp.stock);
      if (rem === 0) {
        stock.push({
          kind: 'stockOut',
          assignmentId: '',
          componentId: comp.id,
          label: comp.label + ' (' + p.name + ') — המלאי אזל',
          hint: 'לחדש מלאי או לעדכן את הרכיב במוצר',
        });
      }
    }
  }
  for (const a of db.shopAssignments) {
    if (a.status !== 'active')
      continue;
    const product = db.shopProducts.find((p) => p.id === a.productId);
    if (!product)
      continue;
    const who = beneficiaryLabel(db, a, config);
    for (const comp of product.components) {
      const ri = itemOf(db, comp);
      if (ri.kind === 'holidayGift') {
        for (const h of holidays) {
          // חגים נבחרים (הכרעה 17): "מה מגיע" רק לחגים שסומנו על הפריט
          if (!holidayAllowed(ri, h.name))
            continue;
          if (!assignmentRedeemed(a, comp.id, h)) {
            due.push({
              kind: 'holidayDue',
              assignmentId: a.id,
              componentId: comp.id,
              label: who + ' — ' + ri.name,
              hint: h.name + ' ב-' + h.iso + ' — טרם נמסרה',
            });
          }
        }
      }
      else if (ri.kind === 'meeting' && !assignmentRedeemed(a, comp.id)) {
        meetings.push({
          kind: 'meetingPending',
          assignmentId: a.id,
          componentId: comp.id,
          label: who + ' — ' + ri.name,
          hint: 'פגישת ליווי טרם התקיימה',
        });
      }
      else if (ri.kind === 'coupon' && !assignmentRedeemed(a, comp.id)) {
        const expiry = couponExpiry(a, ri);
        if (expiry && expiry < todayIso) {
          expired.push({
            kind: 'couponExpired',
            assignmentId: a.id,
            componentId: comp.id,
            label: who + ' — ' + ri.name,
            hint: 'הקופון פג בתוקף ב-' + expiry + ' וטרם מומש',
          });
        }
        else {
          coupons.push({
            kind: 'couponPending',
            assignmentId: a.id,
            componentId: comp.id,
            label: who + ' — ' + ri.name,
            hint: expiry ? 'קופון טרם מומש · בתוקף עד ' + expiry : 'קופון טרם מומש',
          });
        }
      }
    }
  }
  // אצוות/תפוגה (SHOP10) — קליטות מתכלות שפגו או עומדות לפוג (≤7 ימים).
  // תיקון (swarm-audit): הקלט (שדה-תפוגה בקליטה) מגודר shop.expiry אבל ההתרעות
  // נפלטו ללא-תנאי — ארגון עם הדגל כבוי עדיין קיבל התרעות-תפוגה. עם config
  // הדגל נאכף; בלי config (קוראים ישנים/בדיקות) — ביט-זהה להיום.
  const expiryOn = !config || featureOn(config, 'shop.expiry');
  const expiring = (expiryOn ? expiringIntakes(db, todayIso) : []).map((x) => ({
    kind: 'expiring',
    assignmentId: '',
    componentId: x.intake.itemId,
    label: x.itemName + (x.expired ? ' — פג תוקף' : ' — עומד לפוג'),
    hint: (x.expired ? 'פג ב-' : 'בתוקף עד ') + x.intake.expiry + ' · אצווה ' + x.intake.qty + ' יח׳',
  }));
  return [...due, ...meetings, ...coupons, ...expired, ...stock, ...expiring];
}
