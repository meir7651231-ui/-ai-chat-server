import { supKeyMapOf } from './sup-key-map-of.mjs';
let f = 0;
const ok = (cond, msg) => { if (!cond) { console.error('✗ ' + msg); f = 1; } };

// שקע-אמת כבחוזה: forWho מחוטא; ריק ⇒ המפתח-המשותף
const supKeyOf = (sp) => ((sp.forWho ?? '').trim() || '_shared_');

// 1) ייעוד ⇒ המפתח; ריק ⇒ '_shared_'
{
  const m = supKeyMapOf([{ id: 'a', forWho: 'ישיבה' }, { id: 'b', forWho: '' }], supKeyOf);
  ok(m.size === 2, 'שתי תומכות ⇒ מפה בגודל 2');
  ok(m.get('a') === 'ישיבה', "a ⇒ 'ישיבה'");
  ok(m.get('b') === '_shared_', "b ריק ⇒ '_shared_'");
}
// 2) חיטוי-trim מגיע מהשקע
{
  const m = supKeyMapOf([{ id: 'c', forWho: '  כולל  ' }], supKeyOf);
  ok(m.get('c') === 'כולל', 'רווחים מחוטאים דרך השקע');
}
// 3) רשימה ריקה ⇒ מפה ריקה
{
  ok(supKeyMapOf([], supKeyOf).size === 0, '[] ⇒ Map ריקה');
}
// 4) כפל-id ⇒ האחרון גובר (סמנטיקת-Map)
{
  const m = supKeyMapOf([{ id: 'x', forWho: 'א' }, { id: 'x', forWho: 'ב' }], supKeyOf);
  ok(m.size === 1 && m.get('x') === 'ב', 'id כפול ⇒ הערך האחרון');
}
// 5) עיוורון-לשקע — הערכים מהשקע בלבד (טוהר חוק-5)
{
  const m = supKeyMapOf([{ id: 'z' }], (sp) => sp.id + '!');
  ok(m.get('z') === 'z!', 'שקע חלופי ⇒ ערכיו כמות-שהם');
}
if (f) process.exit(1);
console.log('✓ sup-key-map-of: 5 דוגמאות-חוזה — ירוק (supKeyOf=שקע; מיפוי בלבד)');
