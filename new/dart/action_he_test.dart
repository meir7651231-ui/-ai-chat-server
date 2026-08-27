import 'action_he.dart';

// stub-אמת לשקע actionDescriptor — קטלוג-מיני של 2 פעולות, אחרת null.
const _catalog = <String, ActionDescriptor>{
  'nav.screen': ActionDescriptor(
      id: 'nav.screen', he: 'מעבר למסך', kind: ActionEffectKind.navScreen, groundedIn: 'x'),
  'cart.add': ActionDescriptor(
      id: 'cart.add',
      he: 'הוספה לסל',
      kind: ActionEffectKind.cartAdd,
      groundedIn: 'y',
      mutates: true,
      confirmGated: true),
};
ActionDescriptor? actionDescriptor(String id) => _catalog[id];

void main() {
  assert(actionHe('nav.screen', actionDescriptor: actionDescriptor) == 'מעבר למסך');
  assert(actionHe('cart.add', actionDescriptor: actionDescriptor) == 'הוספה לסל');
  // לא-בקטלוג ⇒ null (השרשור ?.).
  assert(actionHe('bogus', actionDescriptor: actionDescriptor) == null);
  print('actionHe OK');
}
