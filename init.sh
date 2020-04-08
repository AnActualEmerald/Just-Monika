#!/bin/sh

echo "Creating necessary json files"

cat jsonreq.txt | while read LINE; do
    if [ -f "$LINE" ] && [ "$1" != "-f" ]; then
        echo "$LINE already exists"
    else 
        echo "writing $LINE"
        echo "{}" > "$LINE"
    fi
done