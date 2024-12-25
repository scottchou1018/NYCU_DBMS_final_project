#!/bin/bash
for i in {1..60}; do
    curl "https://codeforces.com/api/user.rating?handle=tourist"
done