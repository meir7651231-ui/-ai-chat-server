#!/bin/bash
cd /home/user/yeshiva-engine-repo
want="db slow func apology ac refund meeting estimate"
for i in $(seq 1 90); do
  have=$(git ls-remote --heads origin 'exp/h-*' | awk '{print $2}' | sed 's#refs/heads/##')
  n=0; for t in $want; do for a in with without; do echo "$have" | grep -qx "exp/h-$t-$a" && n=$((n+1)); done; done
  echo "$(date +%T) $n/16"
  [ "$n" -ge 16 ] && break
  sleep 20
done
echo "$have" | grep -E "exp/h-(db|slow|func|apology|ac|refund|meeting|estimate)-"
