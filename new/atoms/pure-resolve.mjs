/** חוט · pure-resolve — הכרעת-פיגמנט לפי סולם-קדימות (שכבה D · הבחירה, לא הקבע).
 *  layers = שכבות מהגבוה-לנמוך: [prop, instance, family, base]. הראשונה שמגדירה את התפקיד מנצחת.
 *  שקעים בלבד — אפס-import, אפס-ליטרל, אפס ידע-תפקיד (חוק-1/5). חוזה: pure-resolve.contract.md */
export function resolvePigment(role, layers) {
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    if (layer && layer[role] != null) return layer[role];
  }
  return null;
}
