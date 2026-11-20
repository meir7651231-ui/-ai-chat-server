// חוט · lin-cycles — מונה מחזורים ליניארי רצפת חלוקה. מנגנון עיוור: אפס קבועים.
// תאום נאמן ל-new/atoms/lin-cycles.mjs (חוק-4): Math.floor — רצפה אמיתית בכל התחום.
// ‏~/ לבדו חותך-לאפס ⇒ שגוי למונה שלילי (לילה 20.11: שער-הסינתזה תפס -12≠-13).
int linCycles(int n, int a, int b, int c) {
  final x = a * n - b;
  final q = x ~/ c;
  return (x.remainder(c) != 0 && ((x < 0) != (c < 0))) ? q - 1 : q;
}
