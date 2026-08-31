// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מחבר-ישות-למסך: רשומות-ישות ⇒ מסך-Composed מפורק (סורק-אוטומטי). אל תערוך ידנית.
import '../dart-screens-bs/store_screen.g.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/ds/ds.dart';
import 'package:flutter/material.dart';

class GenAppBind10Screen extends StatelessWidget {
  const GenAppBind10Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => StoreScreenComposed(
          onMinus: () {},
          onPlus: () {},
          onTap: () {},
          onTap2: () {},
          active: false,
          badge: 0,
          bold: false,
          children: const [],
          deliveryFee: 0,
          icon: Icons.circle,
          label: '',
          qty: 0,
          query: '',
          storeProjectChipItems: appStore.records('app_ent10').map((r) => StoreProjectChipItem(label: r.entries.firstWhere((e) => !e.key.startsWith('__') && e.value.trim().isNotEmpty, orElse: () => MapEntry('', r['__id'] ?? '')).value.trim(), active: false, onTap: () {})).toList(),
          storeSupplierHeaderItems: const [],
          subtotal: 0,
          total: 0,
          value: '',
          vat: 0,
          vatInclusive: false,
          t: StoreScreenTokens(color: DsTokens.accent),
        ),
      );
}
