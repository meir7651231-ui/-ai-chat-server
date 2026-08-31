// ✨ חולל ע"י מנוע-הרינדור (render-ds) — מחבר-ישות-למסך: אגרגטי-ישות ⇒ מסך-Composed מפורק. אל תערוך ידנית.
import '../dart-data-bs/auto/gen_app_bind4_content.dart';
import '../dart-screens-bs/store_profile_screen.g.dart';
import '../dart-ui-bs/ds/ds_store.dart';
import 'package:flutter/material.dart';

class GenAppBind4Screen extends StatelessWidget {
  const GenAppBind4Screen({super.key});

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: appStore,
        builder: (context, _) => StoreProfileScreenComposed(
          sStatItems: [SStatItem(value: appStore.count('app_ent4').toString(), label: gen_app_bind4_c0)],
          t: const StoreProfileScreenTokens(),
        ),
      );
}
