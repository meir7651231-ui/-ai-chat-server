// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מחבר-ישות-למסך: רשומות-ישות ⇒ מסך-Composed מפורק. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_bind2_content.dart';
import '../dart-screens-bs/persona_portal.g.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';

class GenAppBind2Screen extends StatelessWidget {
  const GenAppBind2Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => PersonaPortalComposed(
          portalTileButtonItems: appStore.records('app_ent2').map((r) => PortalTileButtonItem(title: r.entries.firstWhere((e) => !e.key.startsWith('__') && e.value.trim().isNotEmpty, orElse: () => MapEntry('', r['__id'] ?? '')).value.trim(), sub: gen_app_bind2_c0, onTap: () {})).toList(),
          t: const PersonaPortalTokens(),
        ),
      );
}
