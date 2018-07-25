#!/bin/bash
set -m

mongodb_cmd="mongod"
cmd="$mongodb_cmd"

if [ "$AUTH" == "yes" ]; then
    cmd="$cmd --auth"
fi

$cmd --bind_ip 0.0.0.0 &

if [ ! -f /data/db/.mongodb_password_set ]; then
    /usr/NodeJS/MongoDB/user.sh
fi

fg