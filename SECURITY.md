# אבטחה · Security

## מה הריפו מכיל
הריפו **ציבורי**. הוא מכיל קוד-כלים (Node.js, Dart), אטומים, תיעוד ועמודי עיצוב.
אין בו ולא יהיו בו מפתחות, סיסמאות, טוקנים או כתובות שרת פנימיות:
זהות וסודות הם "חיווט-הצבה" שמוזרק בזמן ריצה, לעולם לא חלק מאטום (חוק 6 ב-`LAW.md`).

הכלים רצים מקומית ואינם שולחים קוד או קבצים החוצה.

## דיווח על בעיה
מצאתם סוד שדלף, או בעיית אבטחה אחרת? **אל תפתחו issue ציבורי.**
פנו לבעל הריפו באופן פרטי דרך GitHub — לשונית **Security → Report a vulnerability** כשהיא זמינה,
או דרך פרופיל הבעלים.

---

*This repo is public and holds no keys, passwords, tokens or internal server addresses — secrets are injected at deploy time, never stored in an atom (law 6 in `LAW.md`). The tools run locally and send nothing out. To report a leaked secret or another security issue, do not open a public issue; contact the repo owner privately through GitHub (Security → Report a vulnerability, when available).*
