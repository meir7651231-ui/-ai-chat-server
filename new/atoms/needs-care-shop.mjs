/** חוט · needs-care-shop — רשימת-הטיפול של מודול-החנות (מה-מגיע/מלאי/תפוגה).
 *  חוזה: needs-care-shop.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:249-374; כל השכנים
 *  (upcomingHolidays · itemRemaining · componentRemaining · beneficiaryLabel ·
 *  itemOf · holidayAllowed · assignmentRedeemed · couponExpiry · featureOn ·
 *  expiringIntakes · הקבוע SHOP_HOLIDAY_DUE_DAYS) הוזרקו כשקעים (חוק-1). */
export function needsCare(db, todayIso, config, sockets, T) {
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
        kind: T.k1,
        assignmentId: '',
        componentId: item.id,
        label: item.name + T.k2,
        hint: T.k3,
      });
    }
    else if (item.minStock != null && rem !== null && rem < item.minStock) {
      // מלאי מינימום (SHOP6 חנות 25): מתחת לסף — "להצטייד" לפני שאוזל
      stock.push({
        kind: T.k4,
        assignmentId: '',
        componentId: item.id,
        label: item.name + T.k5,
        hint: T.k6 + rem + T.k7 + item.minStock,
      });
    }
    // רשימת המתנה (SHOP6 חנות 27): ממתינים + מלאי חזר (>0 או בלי-מעקב) —
    // הגיע הזמן לחלק; במלאי 0 אין התרעה (עדיין אין מה לתת)
    const waiting = item.waits ?? [];
    if (waiting.length > 0 && rem !== 0) {
      stock.push({
        kind: T.k8,
        assignmentId: '',
        componentId: item.id,
        label: waiting.length + T.k9 + item.name,
        hint: T.k10,
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
          kind: T.k1,
          assignmentId: '',
          componentId: comp.id,
          label: comp.label + ' (' + p.name + T.k11,
          hint: T.k12,
        });
      }
    }
  }
  for (const a of db.shopAssignments) {
    if (a.status !== T.k13)
      continue;
    const product = db.shopProducts.find((p) => p.id === a.productId);
    if (!product)
      continue;
    const who = beneficiaryLabel(db, a, config);
    for (const comp of product.components) {
      const ri = itemOf(db, comp);
      if (ri.kind === T.k14) {
        for (const h of holidays) {
          // חגים נבחרים (הכרעה 17): "מה מגיע" רק לחגים שסומנו על הפריט
          if (!holidayAllowed(ri, h.name))
            continue;
          if (!assignmentRedeemed(a, comp.id, h)) {
            due.push({
              kind: T.k15,
              assignmentId: a.id,
              componentId: comp.id,
              label: who + ' — ' + ri.name,
              hint: h.name + T.k16 + h.iso + T.k17,
            });
          }
        }
      }
      else if (ri.kind === T.k18 && !assignmentRedeemed(a, comp.id)) {
        meetings.push({
          kind: T.k19,
          assignmentId: a.id,
          componentId: comp.id,
          label: who + ' — ' + ri.name,
          hint: T.k20,
        });
      }
      else if (ri.kind === T.k21 && !assignmentRedeemed(a, comp.id)) {
        const expiry = couponExpiry(a, ri);
        if (expiry && expiry < todayIso) {
          expired.push({
            kind: T.k22,
            assignmentId: a.id,
            componentId: comp.id,
            label: who + ' — ' + ri.name,
            hint: T.k23 + expiry + T.k24,
          });
        }
        else {
          coupons.push({
            kind: T.k25,
            assignmentId: a.id,
            componentId: comp.id,
            label: who + ' — ' + ri.name,
            hint: expiry ? T.k26 + expiry : T.k27,
          });
        }
      }
    }
  }
  // אצוות/תפוגה (SHOP10) — קליטות מתכלות שפגו או עומדות לפוג (≤7 ימים).
  // תיקון (swarm-audit): הקלט (שדה-תפוגה בקליטה) מגודר shop.expiry אבל ההתרעות
  // נפלטו ללא-תנאי — ארגון עם הדגל כבוי עדיין קיבל התרעות-תפוגה. עם config
  // הדגל נאכף; בלי config (קוראים ישנים/בדיקות) — ביט-זהה להיום.
  const expiryOn = !config || featureOn(config, T.k28);
  const expiring = (expiryOn ? expiringIntakes(db, todayIso) : []).map((x) => ({
    kind: T.k29,
    assignmentId: '',
    componentId: x.intake.itemId,
    label: x.itemName + (x.expired ? T.k30 : T.k31),
    hint: (x.expired ? T.k32 : T.k33) + x.intake.expiry + T.k34 + x.intake.qty + T.k35,
  }));
  return [...due, ...meetings, ...coupons, ...expired, ...stock, ...expiring];
}
