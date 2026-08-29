// 🛗 הורם ע"י מנוע-המדף (shelf-lift) — verbatim מהמקור, אל תערוך ידנית.
// מוצא: screens__smart_home_screen:_CatalogConfigOpen (בנייה-חכמה main)
import 'package:flutter/material.dart';

class CatalogConfigOpen extends StatelessWidget {
  const CatalogConfigOpen();

  @override
  Widget build(BuildContext context) {
    // FULL-SCREEN open on the home (owner: "מסך מלא · פתוח מלא · ללא חלון") — NOT a
    // bordered 560px window; the [CatalogConfigScreen]'s own AppBar heads it. A
    // ListView child must be height-bounded (can't Expand), so we size it to the
    // HomeShell's BODY viewport EXACTLY: screen minus the shell's AppBar
    // (kToolbarHeight) + bottom-nav (58 · main.dart `_kHomeNavHeight`) + the OS
    // safe-areas. Earlier `screen − statusBar` overshot by the app-bar + nav and
    // slid behind them (top row + bottom cut · owner "נחתך באמצע"). Now it fits and
    // scrolls INSIDE — never clipped by the shell chrome.
    const kShellAppBar = kToolbarHeight; // _HomeAppBar preferredSize
    const kShellBottomNav = 58.0; // home_shell.dart _BottomNav (main _kHomeNavHeight)
    final media = MediaQuery.of(context);
    final avail = media.size.height -
        media.padding.top -
        media.padding.bottom -
        kShellAppBar -
        kShellBottomNav;
    return SizedBox(
      height: avail > 360 ? avail : 360,
      child: const CatalogConfigScreen(),
    );
  }
}
