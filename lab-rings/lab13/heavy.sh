#!/bin/bash
# usage: heavy.sh <command...>   — runs the command holding one of 2 memory slots (each heavy run may peak ~5GB; 3 at once OOM-kills).
S=/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad
while true; do
  for i in 1 2; do
    exec {fd}>$S/heavy.$i.lock
    if flock -n $fd; then "$@"; rc=$?; flock -u $fd; exit $rc; fi
    exec {fd}>&-
  done
  sleep 20
done
