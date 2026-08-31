// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מחבר-ישות-למסך: רשומות-ישות ⇒ מסך-Composed מפורק (סורק-אוטומטי). אל תערוך ידנית.
import '../dart-screens-bs/store_dashboard_screen.g.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import '../dart-ui-bs/ds/ds.dart';
import 'package:flutter/material.dart';

class GenAppBind7Screen extends StatelessWidget {
  const GenAppBind7Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => StoreDashboardScreenComposed(
          onTap: () {},
          badge: '',
          child: const SizedBox.shrink(),
          label: '',
          on: false,
          portalTileButtonItems: appStore.records('app_ent7').map((r) => PortalTileButtonItem(title: r.entries.firstWhere((e) => !e.key.startsWith('__') && e.value.trim().isNotEmpty, orElse: () => MapEntry('', r['__id'] ?? '')).value.trim(), sub: '', onTap: () {})).toList(),
          value: '',
          t: StoreDashboardScreenTokens(color: DsTokens.accent),
        ),
      );
}
