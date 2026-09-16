#!/bin/bash
# מדרג את כל ענפי exp/h3-* שקיימים; --note "round 3"
cd /home/user/yeshiva-engine-repo
git fetch -q origin '+refs/heads/exp/h3-*:refs/remotes/origin/exp/h3-*'
for pair in db:db_choice slow:slow_site func:func_name apology:apology ac:ac_message refund:refund meeting:meeting estimate:estimate bugcontacts:bug_contacts bugage:bug_age bugslug:bug_slug audit:audit_shop; do
  b=${pair%%:*}; t=${pair#*:}
  for a in with without; do
    if git rev-parse -q --verify "origin/exp/h3-$b-$a" >/dev/null; then
      python -m bench.score --task $t --arm $a --branch origin/exp/h3-$b-$a --model haiku --note "round 3"
    else echo "$t [$a]: אין ענף"; fi
  done
done
