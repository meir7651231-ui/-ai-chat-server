// ✨ GoldButton — כפתור מיליארד-דולר: label + onTap? + icon? + loading + kind.
// רמת Linear/Stripe: ריסון · sheen-עליון עדין · צל-מבטא רך שמתכווץ בלחיצה (refactoring-ui:
// צל-קטן=נלחץ) · מיקרו-scale · Semantics(button) · reduced-motion · touch≥48 · פוקוס-מקלדת + הפעלה.
// חוט-טהור: material בלבד · פיגמנט const · טקסט דרך פרמטר · RTL. אומת 3× (ניגוד·רדיוס·פוקוס).
import 'package:flutter/material.dart';

enum GoldButtonKind { primary, secondary, ghost }

class GoldButton extends StatefulWidget {
  const GoldButton({
    required this.label,
    this.onTap,
    this.icon,
    this.loading = false,
    this.kind = GoldButtonKind.primary,
    super.key,
  });

  final String label;
  final VoidCallback? onTap;
  final IconData? icon;
  final bool loading;
  final GoldButtonKind kind;

  // ── טוקנים (מבטא-אינדיגו עמוק · לבן עליו עובר 4.5:1) ──
  static const _accentTop = Color(0xFF6E5EF0);
  static const _accent = Color(0xFF5B4CE0);
  static const _accentDeep = Color(0xFF4A3CC0);
  static const _glow = Color(0xFF6C5CE7);
  static const _onAccent = Color(0xFFFFFFFF);
  static const _surface = Color(0xFF16161D);
  static const _ink = Color(0xFFF4F5F7);
  static const _muted = Color(0xFF9AA0AC);
  static const _line = Color(0x1FFFFFFF);
  static const _ring = Color(0xFF9C8CFF);

  @override
  State<GoldButton> createState() => _GoldButtonState();
}

class _GoldButtonState extends State<GoldButton> {
  bool _pressed = false;
  bool _focused = false;

  bool get _enabled => widget.onTap != null && !widget.loading;

  @override
  Widget build(BuildContext context) {
    final reduce = MediaQuery.of(context).disableAnimations;
    final k = widget.kind;
    final down = _pressed && _enabled;

    final fg = k == GoldButtonKind.primary
        ? GoldButton._onAccent
        : k == GoldButtonKind.secondary
            ? GoldButton._ink
            : GoldButton._muted;

    final Gradient? grad = k == GoldButtonKind.primary
        ? const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [GoldButton._accentTop, GoldButton._accent, GoldButton._accentDeep],
            stops: [0, 0.45, 1],
          )
        : null;
    final bg = k == GoldButtonKind.secondary
        ? GoldButton._surface
        : k == GoldButtonKind.ghost
            ? Colors.transparent
            : null;

    final border = k == GoldButtonKind.ghost
        ? null
        : Border.all(color: k == GoldButtonKind.primary ? const Color(0x24FFFFFF) : GoldButton._line);

    // צל-מבטא (primary) שמתכווץ בלחיצה + טבעת-פוקוס (סבב-3)
    final shadows = <BoxShadow>[
      if (_focused)
        const BoxShadow(color: GoldButton._ring, spreadRadius: 2.5),
      if (k == GoldButtonKind.primary && _enabled)
        BoxShadow(
          color: GoldButton._glow.withValues(alpha: down ? 0.22 : 0.36),
          blurRadius: down ? 8 : 18,
          offset: Offset(0, down ? 3 : 8),
        ),
    ];

    final content = widget.loading
        ? const SizedBox(
            width: 18,
            height: 18,
            child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(GoldButton._onAccent)),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (widget.icon != null) ...[
                Icon(widget.icon, size: 18, color: fg),
                const SizedBox(width: 8),
              ],
              Text(
                widget.label,
                style: TextStyle(color: fg, fontSize: 15, fontWeight: FontWeight.w600, letterSpacing: -0.1),
              ),
            ],
          );

    final button = AnimatedScale(
      scale: down ? 0.97 : 1,
      duration: Duration(milliseconds: reduce ? 0 : 110),
      curve: Curves.easeOut,
      child: AnimatedContainer(
        duration: Duration(milliseconds: reduce ? 0 : 160),
        curve: Curves.easeOut,
        height: 48,
        alignment: Alignment.center,
        padding: const EdgeInsetsDirectional.symmetric(horizontal: 20),
        decoration: BoxDecoration(
          gradient: grad,
          color: bg,
          borderRadius: BorderRadius.circular(14), // סבב-1: אחיד עם משפחת-האטומים
          border: border,
          boxShadow: shadows,
        ),
        child: content,
      ),
    );

    return Semantics(
      button: true,
      enabled: _enabled,
      label: widget.label,
      child: Opacity(
        opacity: _enabled ? 1 : 0.5,
        child: FocusableActionDetector(
          enabled: _enabled,
          onShowFocusHighlight: (v) => setState(() => _focused = v),
          actions: <Type, Action<Intent>>{
            ActivateIntent: CallbackAction<ActivateIntent>(onInvoke: (_) {
              widget.onTap?.call();
              return null;
            }),
          },
          child: GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: _enabled ? widget.onTap : null,
            onTapDown: _enabled ? (_) => setState(() => _pressed = true) : null,
            onTapUp: _enabled ? (_) => setState(() => _pressed = false) : null,
            onTapCancel: _enabled ? () => setState(() => _pressed = false) : null,
            child: button,
          ),
        ),
      ),
    );
  }
}
